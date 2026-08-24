import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Download, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { formatDate, todayISO, formatINR } from '../../utils/gstUtils';
import Papa from 'papaparse';

const TRANS_TYPES = {
  purchase_in:     { label: 'Purchase In',      color: 'text-green-400', bg: 'bg-green-500/15', sign: +1 },
  production_used: { label: 'Used in Production', color: 'text-orange-400', bg: 'bg-orange-500/15', sign: -1 },
  production_out:  { label: 'Production Out',   color: 'text-blue-400', bg: 'bg-blue-500/15', sign: +1 },
  sale_out:        { label: 'Sale Out',          color: 'text-red-400', bg: 'bg-red-500/15', sign: -1 },
  adjustment:      { label: 'Adjustment',        color: 'text-gray-400', bg: 'bg-gray-500/15', sign: +1 },
};

const ITEM_TYPES = {
  raw_material:   { label: 'Raw Material', color: 'text-amber-300' },
  finished_goods: { label: 'Finished Goods', color: 'text-cyan-300' },
};

const ITEMS_LIST = [
  { name: 'GROUNDNUT BIOMASS', hsn: '44013900', type: 'raw_material', unit: 'KGS' },
  { name: 'BIOMASS BRIQUETTES', hsn: '44013900', type: 'finished_goods', unit: 'KGS' },
];

const emptyEntry = {
  trans_date: todayISO(),
  item_type: 'raw_material',
  item_name: 'GROUNDNUT BIOMASS',
  hsn_sac: '44013900',
  trans_type: 'purchase_in',
  qty: '',
  unit: 'KGS',
  reference_no: '',
  notes: '',
};

export default function StockRegister({ onSuccess }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyEntry);
  const [saving, setSaving] = useState(false);
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('ramdev_stock').select('*').order('trans_date', { ascending: false }).order('created_at', { ascending: false });
    if (dateFrom) q = q.gte('trans_date', dateFrom);
    if (dateTo) q = q.lte('trans_date', dateTo);
    const { data } = await q;
    setTransactions(data || []);
    setLoading(false);
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Compute running stock per item
  const stockSummary = transactions.reduce((acc, t) => {
    const key = `${t.item_type}::${t.item_name}`;
    const sign = TRANS_TYPES[t.trans_type]?.sign ?? 1;
    if (!acc[key]) acc[key] = { item_type: t.item_type, item_name: t.item_name, unit: t.unit, balance: 0 };
    acc[key].balance += sign * (parseFloat(t.qty) || 0);
    return acc;
  }, {});

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('ramdev_stock').insert({ ...form, qty: parseFloat(form.qty) });
    setSaving(false);
    if (!error) {
      setShowForm(false);
      setForm(emptyEntry);
      fetchTransactions();
      onSuccess?.('Stock entry added!');
    } else alert('Error: ' + error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock entry?')) return;
    await supabase.from('ramdev_stock').delete().eq('id', id);
    fetchTransactions();
    onSuccess?.('Entry deleted.');
  };

  // Auto-set trans_type & item list when item_type changes
  const handleItemTypeChange = (val) => {
    const firstItem = ITEMS_LIST.find(i => i.type === val);
    const defaultTrans = val === 'raw_material' ? 'purchase_in' : 'production_out';
    setForm(f => ({
      ...f,
      item_type: val,
      item_name: firstItem?.name || '',
      hsn_sac: firstItem?.hsn || '',
      unit: firstItem?.unit || 'KGS',
      trans_type: defaultTrans,
    }));
  };

  const exportCSV = () => {
    const csv = Papa.unparse(transactions.map(t => ({
      Date: formatDate(t.trans_date),
      'Item Type': ITEM_TYPES[t.item_type]?.label,
      Item: t.item_name,
      'Transaction Type': TRANS_TYPES[t.trans_type]?.label,
      Qty: TRANS_TYPES[t.trans_type]?.sign === -1 ? -t.qty : t.qty,
      Unit: t.unit,
      'Reference No.': t.reference_no || '',
      Notes: t.notes || '',
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = 'StockRegister.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const filtered = transactions.filter(t =>
    itemTypeFilter === 'all' || t.item_type === itemTypeFilter
  );

  const rawItems = ITEMS_LIST.filter(i => i.type === form.item_type);
  const validTransTypes = form.item_type === 'raw_material'
    ? ['purchase_in', 'production_used', 'adjustment']
    : ['production_out', 'sale_out', 'adjustment'];

  return (
    <div className="space-y-5">
      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.values(stockSummary).map(s => {
          const typeInfo = ITEM_TYPES[s.item_type];
          const isLow = s.balance < 1000;
          return (
            <div key={`${s.item_type}-${s.item_name}`}
              className={`bg-[#181B22] border rounded-xl p-4 ${isLow ? 'border-red-500/30' : 'border-white/10'}`}>
              <div className={`text-xs font-medium mb-1 ${typeInfo?.color}`}>{typeInfo?.label}</div>
              <div className="text-sm text-gray-300 mb-2 font-medium truncate">{s.item_name}</div>
              <div className={`text-2xl font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                {parseFloat(s.balance.toFixed(2)).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-gray-500">{s.unit} {isLow ? '⚠️ Low Stock' : ''}</div>
            </div>
          );
        })}
        {Object.keys(stockSummary).length === 0 && (
          <div className="col-span-4 bg-[#181B22] border border-white/10 rounded-xl p-6 text-center text-gray-500">
            No stock data yet. Add your first entry!
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={itemTypeFilter} onChange={e => setItemTypeFilter(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none">
          <option value="all">All Items</option>
          <option value="raw_material">Raw Material</option>
          <option value="finished_goods">Finished Goods</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <div className="flex-1" />
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
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Item</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Transaction</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Qty (KG)</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Reference</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Notes</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No stock entries found.</td></tr>
              ) : filtered.map(t => {
                const tt = TRANS_TYPES[t.trans_type];
                const sign = tt?.sign === -1 ? '−' : '+';
                return (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-gray-300">{formatDate(t.trans_date)}</td>
                    <td className="px-4 py-3">
                      <div className={`text-xs font-medium ${ITEM_TYPES[t.item_type]?.color}`}>
                        {ITEM_TYPES[t.item_type]?.label}
                      </div>
                      <div className="text-white text-sm">{t.item_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tt?.bg} ${tt?.color}`}>
                        {tt?.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${tt?.color}`}>
                      {sign} {parseFloat(t.qty).toLocaleString('en-IN', { minimumFractionDigits: 3 })}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.reference_no || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{t.notes || ''}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(t.id)} className="text-gray-500 hover:text-red-400 transition-colors">
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
            className="bg-[#181B22] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF9F1C]" /> Add Stock Entry
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date *</label>
                  <input type="date" value={form.trans_date}
                    onChange={e => setForm(f => ({ ...f, trans_date: e.target.value }))}
                    className="input-admin w-full" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Item Type *</label>
                  <select value={form.item_type} onChange={e => handleItemTypeChange(e.target.value)}
                    className="input-admin w-full">
                    <option value="raw_material">Raw Material</option>
                    <option value="finished_goods">Finished Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Item Name *</label>
                  <select value={form.item_name}
                    onChange={e => {
                      const item = ITEMS_LIST.find(i => i.name === e.target.value);
                      setForm(f => ({ ...f, item_name: e.target.value, hsn_sac: item?.hsn || f.hsn_sac }));
                    }}
                    className="input-admin w-full">
                    {rawItems.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Transaction Type *</label>
                  <select value={form.trans_type}
                    onChange={e => setForm(f => ({ ...f, trans_type: e.target.value }))}
                    className="input-admin w-full">
                    {validTransTypes.map(t => (
                      <option key={t} value={t}>{TRANS_TYPES[t].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity (KGS) *</label>
                  <input required type="number" step="0.001" value={form.qty}
                    onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                    className="input-admin w-full" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Reference No.</label>
                  <input value={form.reference_no}
                    onChange={e => setForm(f => ({ ...f, reference_no: e.target.value }))}
                    className="input-admin w-full" placeholder="Invoice / PO number" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Notes</label>
                  <input value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="input-admin w-full" placeholder="Optional notes..." />
                </div>
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
