import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, FileCheck, Download, Eye, FileJson, Truck } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import {
  calculateGST, formatINR, amountInWords, roundOff,
  todayISO, isValidGSTIN, getStateCodeFromGSTIN, getStateName
} from '../../utils/gstUtils';
import { COMPANY, DEFAULT_PRODUCT, INVOICE_PREFIX } from '../../utils/companyConfig';
import { generateInvoicePDF } from '../../utils/invoicePdfGenerator';
import { generateEInvoiceJSON, generateEWayBillJSON, downloadJSON } from '../../utils/gstJsonGenerator';

const emptyItem = {
  sr_no: 1, description: DEFAULT_PRODUCT.description,
  hsn_sac: DEFAULT_PRODUCT.hsn, qty: '', unit: 'KGS', rate: '',
  gst_rate: 5, cgst_rate: 2.5, sgst_rate: 2.5, igst_rate: 5,
  taxable_value: 0, cgst_amount: 0, sgst_amount: 0, igst_amount: 0, total_amount: 0,
};

const calcItem = (item, supplyType = 'intra') => {
  const qty = parseFloat(item.qty) || 0;
  const rate = parseFloat(item.rate) || 0;
  const taxableValue = parseFloat((qty * rate).toFixed(2));
  const gst = calculateGST({ taxableValue, gstRate: item.gst_rate, supplyType });
  return {
    ...item,
    taxable_value: taxableValue,
    cgst_amount: gst.cgst,
    sgst_amount: gst.sgst,
    igst_amount: gst.igst,
    total_amount: parseFloat((taxableValue + gst.cgst + gst.sgst + gst.igst).toFixed(2)),
  };
};

export default function InvoiceForm({ editId, onSaved, onCancel, onSuccess }) {
  const [parties, setParties] = useState([]);
  const [partySearch, setPartySearch] = useState('');
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [supplyType, setSupplyType] = useState('intra');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [vehicleNo, setVehicleNo] = useState('');
  const [poRef, setPoRef] = useState('');
  const [freight, setFreight] = useState(0);
  const [selectedParty, setSelectedParty] = useState(null);
  const [sameAsConsignee, setSameAsConsignee] = useState(true);
  const [consignee, setConsignee] = useState({ name: '', gstin: '', address: '' });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('draft');

  // Totals
  const totals = items.reduce((acc, item) => {
    const ci = calcItem(item, supplyType);
    return {
      taxable: acc.taxable + ci.taxable_value,
      cgst: acc.cgst + ci.cgst_amount,
      sgst: acc.sgst + ci.sgst_amount,
      igst: acc.igst + ci.igst_amount,
    };
  }, { taxable: 0, cgst: 0, sgst: 0, igst: 0 });

  const freightAmt = parseFloat(freight) || 0;
  const subtotal = totals.taxable + totals.cgst + totals.sgst + totals.igst + freightAmt;
  const ro = roundOff(subtotal);
  const grandTotal = parseFloat((subtotal + ro).toFixed(2));

  // Load parties & generate invoice number
  useEffect(() => {
    supabase.from('ramdev_parties').select('*').order('name').then(({ data }) => setParties(data || []));
    if (!editId) {
      // Generate next invoice number
      supabase.from('ramdev_invoices').select('invoice_no').order('created_at', { ascending: false }).limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const last = data[0].invoice_no;
            const num = parseInt(last.split('/').pop()) || 0;
            setInvoiceNo(`${INVOICE_PREFIX}${String(num + 1).padStart(3, '0')}`);
          } else {
            setInvoiceNo(`${INVOICE_PREFIX}001`);
          }
        });
    }
  }, [editId]);

  // Load existing invoice for editing
  useEffect(() => {
    if (!editId) return;
    const load = async () => {
      const { data: inv } = await supabase.from('ramdev_invoices').select('*').eq('id', editId).single();
      const { data: invItems } = await supabase.from('ramdev_invoice_items').select('*').eq('invoice_id', editId).order('sr_no');
      if (inv) {
        setInvoiceNo(inv.invoice_no);
        setInvoiceDate(inv.invoice_date);
        setSupplyType(inv.supply_type || 'intra');
        setVehicleNo(inv.vehicle_no || '');
        setPoRef(inv.po_ref || '');
        setFreight(inv.freight || 0);
        setStatus(inv.status || 'draft');
        setSelectedParty({
          name: inv.party_name, gstin: inv.party_gstin,
          address: inv.party_address, state: inv.party_state,
          state_code: inv.party_state_code,
        });
        setPartySearch(inv.party_name || '');
        if (inv.consignee_name && inv.consignee_name !== inv.party_name) {
          setSameAsConsignee(false);
          setConsignee({ name: inv.consignee_name, gstin: inv.consignee_gstin, address: inv.consignee_address });
        }
      }
      if (invItems && invItems.length > 0) setItems(invItems);
    };
    load();
  }, [editId]);

  const selectParty = (party) => {
    setSelectedParty(party);
    setPartySearch(party.name);
    setShowPartyDropdown(false);
    const sc = party.state_code || getStateCodeFromGSTIN(party.gstin || '');
    setSupplyType(sc === COMPANY.stateCode ? 'intra' : 'inter');
  };

  const updateItem = (idx, field, val) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: val };
      return calcItem(updated, supplyType);
    }));
  };

  const addItem = () => setItems(prev => [...prev, { ...emptyItem, sr_no: prev.length + 1 }]);
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sr_no: i + 1 })));

  const buildInvoicePayload = () => ({
    invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    party_id: selectedParty?.id || null,
    party_name: selectedParty?.name || partySearch,
    party_gstin: selectedParty?.gstin || '',
    party_address: selectedParty?.address || '',
    party_state: selectedParty?.state || '',
    party_state_code: selectedParty?.state_code || '',
    consignee_name: sameAsConsignee ? (selectedParty?.name || partySearch) : consignee.name,
    consignee_gstin: sameAsConsignee ? (selectedParty?.gstin || '') : consignee.gstin,
    consignee_address: sameAsConsignee ? (selectedParty?.address || '') : consignee.address,
    vehicle_no: vehicleNo,
    po_ref: poRef,
    supply_type: supplyType,
    invoice_type: 'tax',
    freight: freightAmt,
    taxable_value: totals.taxable,
    cgst_amount: totals.cgst,
    sgst_amount: totals.sgst,
    igst_amount: totals.igst,
    round_off: ro,
    grand_total: grandTotal,
    amount_in_words: amountInWords(grandTotal),
    status,
  });

  const handleSave = async (newStatus = status) => {
    if (!invoiceNo) return;
    setSaving(true);
    const payload = { ...buildInvoicePayload(), status: newStatus };
    let invId = editId;
    let err;
    if (editId) {
      ({ error: err } = await supabase.from('ramdev_invoices').update(payload).eq('id', editId));
    } else {
      const { data, error } = await supabase.from('ramdev_invoices').insert(payload).select('id').single();
      err = error; invId = data?.id;
    }
    if (err) { setSaving(false); alert('Error: ' + err.message); return; }

    // Save items
    if (invId) {
      await supabase.from('ramdev_invoice_items').delete().eq('invoice_id', invId);
      const itemPayloads = items.map((item, i) => {
        const ci = calcItem(item, supplyType);
        return { ...ci, invoice_id: invId, sr_no: i + 1 };
      });
      await supabase.from('ramdev_invoice_items').insert(itemPayloads);
    }
    setSaving(false);
    setStatus(newStatus);
    onSaved?.();
  };

  const handlePreviewPDF = async () => {
    const inv = buildInvoicePayload();
    const calcedItems = items.map(it => calcItem(it, supplyType));
    generateInvoicePDF(inv, calcedItems);
  };

  const handleEInvoiceJSON = async () => {
    const inv = buildInvoicePayload();
    const calcedItems = items.map(it => calcItem(it, supplyType));
    downloadJSON(generateEInvoiceJSON(inv, calcedItems), `EInvoice_${invoiceNo.replace(/\//g, '-')}.json`);
    onSuccess?.('E-Invoice JSON downloaded!');
  };

  const filteredParties = parties.filter(p =>
    p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
    (p.gstin || '').toLowerCase().includes(partySearch.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="space-y-5">
      {/* Back + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </button>
        <div className="flex-1" />
        <button onClick={handlePreviewPDF}
          className="flex items-center gap-2 bg-[#181B22] border border-white/10 hover:border-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition-all">
          <Eye className="w-4 h-4" /> Preview PDF
        </button>
        <button onClick={handleEInvoiceJSON}
          className="flex items-center gap-2 bg-[#181B22] border border-white/10 hover:border-purple-400/30 text-purple-300 text-sm px-3 py-1.5 rounded-lg transition-all">
          <FileJson className="w-4 h-4" /> E-Invoice JSON
        </button>
        <button onClick={() => handleSave('draft')} disabled={saving}
          className="flex items-center gap-2 bg-[#181B22] border border-yellow-400/30 text-yellow-300 text-sm px-3 py-1.5 rounded-lg transition-all hover:border-yellow-400/60">
          <Save className="w-4 h-4" /> Save Draft
        </button>
        <button onClick={() => handleSave('final')} disabled={saving}
          className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#E58E15] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
          <FileCheck className="w-4 h-4" /> {saving ? 'Saving...' : 'Finalize'}
        </button>
      </div>

      {/* Invoice Header */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#FF9F1C] mb-4 uppercase tracking-wide">Invoice Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Invoice No. *</label>
            <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)}
              className="input-admin w-full font-mono" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date *</label>
            <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)}
              className="input-admin w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Supply Type</label>
            <select value={supplyType} onChange={e => setSupplyType(e.target.value)}
              className="input-admin w-full">
              <option value="intra">Intra-State (CGST+SGST)</option>
              <option value="inter">Inter-State (IGST)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Vehicle No.</label>
            <input value={vehicleNo} onChange={e => setVehicleNo(e.target.value.toUpperCase())}
              className="input-admin w-full font-mono" placeholder="GJ14Z3898" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">PO Reference / Other Detail</label>
            <input value={poRef} onChange={e => setPoRef(e.target.value)}
              className="input-admin w-full" placeholder="POU4/252611597 DATE: 30/03/2026" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Freight (₹)</label>
            <input type="number" value={freight} onChange={e => setFreight(e.target.value)}
              className="input-admin w-full" step="0.01" min="0" />
          </div>
        </div>
      </div>

      {/* Party (Bill To) */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#FF9F1C] mb-4 uppercase tracking-wide">Bill To (Receiver)</h3>
        <div className="relative">
          <label className="block text-xs text-gray-400 mb-1">Select / Type Party *</label>
          <input value={partySearch}
            onChange={e => { setPartySearch(e.target.value); setShowPartyDropdown(true); setSelectedParty(null); }}
            onFocus={() => setShowPartyDropdown(true)}
            className="input-admin w-full"
            placeholder="Search party name or GSTIN..." />
          {showPartyDropdown && filteredParties.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0F1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              {filteredParties.map(p => (
                <button key={p.id} type="button"
                  onClick={() => selectParty(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <div className="text-sm text-white font-medium">{p.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{p.gstin} — {p.state}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedParty && (
          <div className="mt-3 text-xs text-gray-400 space-y-0.5">
            <div className="text-white">{selectedParty.name}</div>
            <div>{selectedParty.address}</div>
            <div>GSTIN: <span className="font-mono text-gray-300">{selectedParty.gstin}</span> | State: {selectedParty.state} ({selectedParty.state_code})</div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" id="sameConsignee" checked={sameAsConsignee} onChange={e => setSameAsConsignee(e.target.checked)} className="rounded" />
          <label htmlFor="sameConsignee" className="text-sm text-gray-300">Shipped To same as Bill To</label>
        </div>
        {!sameAsConsignee && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Consignee Name</label>
              <input value={consignee.name} onChange={e => setConsignee(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                className="input-admin w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Consignee GSTIN</label>
              <input value={consignee.gstin} onChange={e => setConsignee(c => ({ ...c, gstin: e.target.value.toUpperCase() }))}
                className="input-admin w-full font-mono" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Consignee Address</label>
              <input value={consignee.address} onChange={e => setConsignee(c => ({ ...c, address: e.target.value }))}
                className="input-admin w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#FF9F1C] uppercase tracking-wide">Items</h3>
          <button onClick={addItem}
            className="flex items-center gap-1.5 text-sm text-[#FF9F1C] hover:text-[#E58E15] transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-2 text-gray-400 font-medium w-8">Sr.</th>
                <th className="pb-2 text-gray-400 font-medium">Description of Goods</th>
                <th className="pb-2 text-gray-400 font-medium w-28">HSN/SAC</th>
                <th className="pb-2 text-gray-400 font-medium w-28">Total Kg</th>
                <th className="pb-2 text-gray-400 font-medium w-28">Rate/Kg (₹)</th>
                <th className="pb-2 text-gray-400 font-medium w-28 text-right">Taxable (₹)</th>
                <th className="pb-2 text-gray-400 font-medium w-28 text-right">Total (₹)</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item, idx) => {
                const ci = calcItem(item, supplyType);
                return (
                  <tr key={idx}>
                    <td className="py-2 pr-2 text-gray-400 text-center">{idx + 1}</td>
                    <td className="py-2 pr-2">
                      <textarea value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                        rows={2} className="input-admin w-full resize-none text-xs" />
                    </td>
                    <td className="py-2 pr-2">
                      <input value={item.hsn_sac} onChange={e => updateItem(idx, 'hsn_sac', e.target.value)}
                        className="input-admin w-full font-mono text-xs" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)}
                        className="input-admin w-full" placeholder="0" step="0.001" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" value={item.rate} onChange={e => updateItem(idx, 'rate', e.target.value)}
                        className="input-admin w-full" placeholder="0.000" step="0.001" />
                    </td>
                    <td className="py-2 pr-2 text-right text-gray-300">
                      ₹{formatINR(ci.taxable_value)}
                    </td>
                    <td className="py-2 text-right text-white font-medium">
                      ₹{formatINR(ci.total_amount)}
                    </td>
                    <td className="py-2 pl-2">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm bg-[#181B22] border border-white/10 rounded-xl p-5 space-y-2.5">
          {[
            { label: 'Sub Total (Taxable)', val: totals.taxable },
            { label: `CGST @ 2.5%`, val: totals.cgst, hidden: supplyType === 'inter' },
            { label: `SGST @ 2.5%`, val: totals.sgst, hidden: supplyType === 'inter' },
            { label: `IGST @ 5%`, val: totals.igst, hidden: supplyType === 'intra' },
            { label: 'Freight & Other Charges', val: freightAmt },
            { label: 'Round Off', val: ro },
          ].filter(r => !r.hidden).map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-gray-400">{r.label}</span>
              <span className="text-gray-300">₹{formatINR(r.val)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-2 flex justify-between">
            <span className="font-bold text-white">Grand Total</span>
            <span className="font-bold text-[#FF9F1C] text-lg">₹{formatINR(grandTotal)}</span>
          </div>
          <div className="text-xs text-gray-500 italic">{amountInWords(grandTotal)}</div>
        </div>
      </div>
    </div>
  );
}
