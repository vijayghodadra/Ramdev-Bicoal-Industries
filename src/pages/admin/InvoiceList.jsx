import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, FileText, Download, Eye, Trash2,
  CheckCircle, Clock, XCircle, FileJson, Truck
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { formatINR, formatDate, todayISO } from '../../utils/gstUtils';
import { generateInvoicePDF } from '../../utils/invoicePdfGenerator';
import { generateEInvoiceJSON, generateEWayBillJSON, downloadJSON } from '../../utils/gstJsonGenerator';
import InvoiceForm from './InvoiceForm';

const STATUS_ICON = {
  draft: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
  final: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
  cancelled: <XCircle className="w-3.5 h-3.5 text-red-400" />,
};
const STATUS_COLOR = {
  draft: 'bg-yellow-500/15 text-yellow-300',
  final: 'bg-green-500/15 text-green-300',
  cancelled: 'bg-red-500/15 text-red-300',
};

export default function InvoiceList({ onSuccess }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit'
  const [editId, setEditId] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('ramdev_invoices').select('*').order('invoice_date', { ascending: false });
    if (dateFrom) q = q.gte('invoice_date', dateFrom);
    if (dateTo) q = q.lte('invoice_date', dateTo);
    const { data } = await q;
    setInvoices(data || []);
    setLoading(false);
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const handleDelete = async (id, no) => {
    if (!window.confirm(`Delete Invoice ${no}? This cannot be undone.`)) return;
    await supabase.from('ramdev_invoice_items').delete().eq('invoice_id', id);
    await supabase.from('ramdev_invoices').delete().eq('id', id);
    fetchInvoices();
    onSuccess?.('Invoice deleted.');
  };

  const handleDownloadPDF = async (inv) => {
    const { data: items } = await supabase.from('ramdev_invoice_items').select('*').eq('invoice_id', inv.id).order('sr_no');
    generateInvoicePDF(inv, items || []);
  };

  const handleEInvoice = async (inv) => {
    const { data: items } = await supabase.from('ramdev_invoice_items').select('*').eq('invoice_id', inv.id).order('sr_no');
    const json = generateEInvoiceJSON(inv, items || []);
    downloadJSON(json, `EInvoice_${inv.invoice_no.replace(/\//g, '-')}.json`);
    onSuccess?.('E-Invoice JSON downloaded!');
  };

  const handleEWayBill = async (inv) => {
    if (parseFloat(inv.grand_total) < 50000) {
      alert('E-Way Bill sirf ₹50,000 se zyada ki invoice pe generate hota hai.');
      return;
    }
    const { data: items } = await supabase.from('ramdev_invoice_items').select('*').eq('invoice_id', inv.id).order('sr_no');
    const json = generateEWayBillJSON(inv, items || []);
    downloadJSON(json, `EWayBill_${inv.invoice_no.replace(/\//g, '-')}.json`);
    onSuccess?.('E-Way Bill JSON downloaded!');
  };

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
      inv.party_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (view === 'new' || view === 'edit') {
    return (
      <InvoiceForm
        editId={view === 'edit' ? editId : null}
        onSaved={() => { setView('list'); fetchInvoices(); onSuccess?.('Invoice saved!'); }}
        onCancel={() => setView('list')}
        onSuccess={onSuccess}
      />
    );
  }

  // Summary stats
  const totalFinal = invoices.filter(i => i.status === 'final').reduce((s, i) => s + parseFloat(i.grand_total || 0), 0);
  const countDraft = invoices.filter(i => i.status === 'draft').length;
  const countFinal = invoices.filter(i => i.status === 'final').length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Invoices', val: invoices.length, color: 'text-white' },
          { label: 'Finalized', val: countFinal, color: 'text-green-400' },
          { label: 'Total Billed', val: `₹${formatINR(totalFinal)}`, color: 'text-[#FF9F1C]' },
        ].map(s => (
          <div key={s.label} className="bg-[#181B22] border border-white/10 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[160px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice / party..."
            className="w-full bg-[#0F1115] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        <button onClick={() => setView('new')}
          className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#E58E15] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Invoice No.</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Party</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Taxable</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">GST</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">Grand Total</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No invoices found. Create your first invoice!</td></tr>
              ) : filtered.map(inv => {
                const gstTotal = (parseFloat(inv.cgst_amount) || 0) + (parseFloat(inv.sgst_amount) || 0) + (parseFloat(inv.igst_amount) || 0);
                return (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-white font-medium">{inv.invoice_no}</td>
                    <td className="px-4 py-3 text-gray-300">{formatDate(inv.invoice_date)}</td>
                    <td className="px-4 py-3 text-white max-w-[160px] truncate">{inv.party_name}</td>
                    <td className="px-4 py-3 text-right text-gray-300">₹{formatINR(inv.taxable_value)}</td>
                    <td className="px-4 py-3 text-right text-gray-300">₹{formatINR(gstTotal)}</td>
                    <td className="px-4 py-3 text-right text-[#FF9F1C] font-semibold">₹{formatINR(inv.grand_total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[inv.status]}`}>
                        {STATUS_ICON[inv.status]} {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" onClick={() => { setEditId(inv.id); setView('edit'); }}
                          className="p-1.5 text-gray-400 hover:text-[#FF9F1C] hover:bg-[#FF9F1C]/10 rounded-lg transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button title="Download PDF" onClick={() => handleDownloadPDF(inv)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button title="E-Invoice JSON" onClick={() => handleEInvoice(inv)}
                          className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all">
                          <FileJson className="w-3.5 h-3.5" />
                        </button>
                        {parseFloat(inv.grand_total) >= 50000 && (
                          <button title="E-Way Bill JSON" onClick={() => handleEWayBill(inv)}
                            className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all">
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button title="Delete" onClick={() => handleDelete(inv.id, inv.invoice_no)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
