import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Download, Filter } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import {
  calculateGST, formatINR, formatDate, todayISO, isValidGSTIN,
  getStateCodeFromGSTIN
} from '../../utils/gstUtils';
import { DEFAULT_PRODUCT } from '../../utils/companyConfig';
import Papa from 'papaparse';

const emptyPurchase = {
  purchase_date: todayISO(),
  purchase_type: 'RD',
  supplier_name: '',
  supplier_gstin: '',
  invoice_no: '',
  description: 'BIOMASS BRIQUETTES\n100% GROUNDNUTS',
  hsn_sac: '44013900',
  qty: '',
  unit: 'KGS',
  rate: '',
  gst_rate: 5,
  notes: '',
};

export default function PurchaseRegister({ onSuccess }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPurchase);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('ramdev_purchases').select('*').order('purchase_date', { ascending: false });
    if (dateFrom) q = q.gte('purchase_date', dateFrom);
    if (dateTo) q = q.lte('purchase_date', dateTo);
    const { data } = await q;
    setPurchases(data || []);
    setLoading(false);
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  // Auto-calculate
  const calcForm = (f = form) => {
    const qty = parseFloat(f.qty) || 0;
    const rate = parseFloat(f.rate) || 0;
    const taxable = parseFloat((qty * rate).toFixed(2));
    const supplyType = f.purchase_type === 'URD' ? 'intra' : 'intra'; // purchases always intra
    const gst = calculateGST({ taxableValue: taxable, gstRate: f.gst_rate, supplyType });
    return {
      ...f,
      taxable_value: taxable,
      cgst_amount: gst.cgst,
      sgst_amount: gst.sgst,
      igst_amount: gst.igst,
      total_amount: parseFloat((taxable + gst.cgst + gst.sgst + gst.igst).toFixed(2)),
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = calcForm();
    const { error } = await supabase.from('ramdev_purchases').insert(payload);
    setSaving(false);
    if (!error) {
      setShowForm(false);
      setForm(emptyPurchase);
      fetchPurchases();
      onSuccess?.('Purchase entry added!');
    } else alert('Error: ' + error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this purchase entry?')) return;
    await supabase.from('ramdev_purchases').delete().eq('id', id);
    fetchPurchases();
    onSuccess?.('Purchase deleted.');
  };

  const exportCSV = () => {
    const csv = Papa.unparse(filtered.map(p => ({
      Date: formatDate(p.purchase_date),
      Type: p.purchase_type,
      Supplier: p.supplier_name,
      GSTIN: p.supplier_gstin,
      'Invoice No': p.invoice_no,
      Description: p.description,
      HSN: p.hsn_sac,
      Qty: p.qty,
      Unit: p.unit,
      Rate: p.rate,
      'Taxable Value': p.taxable_value,
      'CGST': p.cgst_amount,
      'SGST': p.sgst_amount,
      'IGST': p.igst_amount,
      'Total': p.total_amount,
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `PurchaseRegister_${dateFrom || 'all'}_to_${dateTo || 'all'}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const filtered = purchases.filter(p => {
    const matchSearch = p.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.invoice_no || '').includes(search);
    const matchType = typeFilter === 'all' || p.purchase_type === typeFilter;
    return matchSearch && matchType;
  });

  // Summary
  const rdTotal = purchases.filter(p => p.purchase_type === 'RD').reduce((s, p) => s + (parseFloat(p.total_amount) || 0), 0);
  const urdTotal = purchases.filter(p => p.purchase_type === 'URD').reduce((s, p) => s + (parseFloat(p.total_amount) || 0), 0);
  const totalGST = purchases.reduce((s, p) => s + (parseFloat(p.cgst_amount) || 0) + (parseFloat(p.sgst_amount) || 0), 0);

  const cf = calcForm();

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#181B22] border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-300">₹{formatINR(rdTotal)}</div>
          <div className="text-xs text-gray-400 mt-1">RD Purchases</div>
        </div>
        <div className="bg-[#181B22] border border-purple-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">₹{formatINR(urdTotal)}</div>
          <div className="text-xs text-gray-400 mt-1">URD Purchases</div>
        </div>
        <div className="bg-[#181B22] border border-[#FF9F1C]/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#FF9F1C]">₹{formatINR(totalGST)}</div>
          <div className="text-xs text-gray-400 mt-1">Total GST Paid</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search supplier / invoice..."
            className="w-full bg-[#0F1115] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none">
          <option value="all">RD + URD</option>
          <option value="RD">RD Only</option>
          <option value="URD">URD Only</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <button onClick={exportCSV}
          className="flex items-center gap-2 bg-[#181B22] border border-white/10 hover:border-green-400/30 text-green-300 text-sm px-3 py-2 rounded-lg transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#E58E15] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Type</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Supplier</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Inv. No.</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Qty (KG)</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Rate</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Taxable</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">GST</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Total</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-500">No purchase entries found.</td></tr>
              ) : filtered.map(p => {
                const gstAmt = (parseFloat(p.cgst_amount) || 0) + (parseFloat(p.sgst_amount) || 0) + (parseFloat(p.igst_amount) || 0);
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-gray-300">{formatDate(p.purchase_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.purchase_type === 'RD' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {p.purchase_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white max-w-[120px]">
                      <div className="truncate">{p.supplier_name}</div>
                      {p.supplier_gstin && <div className="text-xs font-mono text-gray-500">{p.supplier_gstin}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{p.invoice_no || '—'}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{parseFloat(p.qty).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{p.rate}</td>
                    <td className="px-4 py-3 text-right text-gray-300">₹{formatINR(p.taxable_value)}</td>
                    <td className="px-4 py-3 text-right text-gray-300">₹{formatINR(gstAmt)}</td>
                    <td className="px-4 py-3 text-right text-[#FF9F1C] font-semibold">₹{formatINR(p.total_amount)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#181B22] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Add Purchase Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date *</label>
                  <input type="date" value={form.purchase_date}
                    onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))}
                    className="input-admin w-full" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Type *</label>
                  <select value={form.purchase_type}
                    onChange={e => setForm(f => ({ ...f, purchase_type: e.target.value }))}
                    className="input-admin w-full">
                    <option value="RD">RD (Registered Dealer)</option>
                    <option value="URD">URD (Unregistered Dealer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Supplier Invoice No.</label>
                  <input value={form.invoice_no}
                    onChange={e => setForm(f => ({ ...f, invoice_no: e.target.value }))}
                    className="input-admin w-full" placeholder="INV/001" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Supplier Name *</label>
                  <input required value={form.supplier_name}
                    onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value.toUpperCase() }))}
                    className="input-admin w-full" placeholder="SUPPLIER NAME" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Supplier GSTIN {form.purchase_type === 'RD' ? '*' : ''}</label>
                  <input value={form.supplier_gstin} required={form.purchase_type === 'RD'}
                    onChange={e => setForm(f => ({ ...f, supplier_gstin: e.target.value.toUpperCase() }))}
                    className="input-admin w-full font-mono" placeholder={form.purchase_type === 'URD' ? 'N/A for URD' : '24XXXXX1234Z5'} />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs text-gray-400 mb-1">Description *</label>
                  <textarea required value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} className="input-admin w-full resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">HSN/SAC</label>
                  <input value={form.hsn_sac}
                    onChange={e => setForm(f => ({ ...f, hsn_sac: e.target.value }))}
                    className="input-admin w-full font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Qty (KGS) *</label>
                  <input required type="number" step="0.001" value={form.qty}
                    onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                    className="input-admin w-full" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rate/KG *</label>
                  <input required type="number" step="0.001" value={form.rate}
                    onChange={e => setForm(f => ({ ...f, rate: e.target.value }))}
                    className="input-admin w-full" placeholder="0.000" />
                </div>
              </div>

              {/* Preview Totals */}
              {form.qty && form.rate && (
                <div className="bg-[#0F1115] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><div className="text-xs text-gray-400">Taxable</div><div className="text-white font-medium">₹{formatINR(cf.taxable_value)}</div></div>
                  <div><div className="text-xs text-gray-400">CGST 2.5%</div><div className="text-white font-medium">₹{formatINR(cf.cgst_amount)}</div></div>
                  <div><div className="text-xs text-gray-400">SGST 2.5%</div><div className="text-white font-medium">₹{formatINR(cf.sgst_amount)}</div></div>
                  <div><div className="text-xs text-gray-400">Total</div><div className="text-[#FF9F1C] font-bold">₹{formatINR(cf.total_amount)}</div></div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="input-admin w-full" placeholder="Optional notes..." />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2 text-sm font-semibold bg-[#FF9F1C] hover:bg-[#E58E15] text-white rounded-lg transition-colors disabled:opacity-60">
                  {saving ? 'Saving...' : 'Add Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
