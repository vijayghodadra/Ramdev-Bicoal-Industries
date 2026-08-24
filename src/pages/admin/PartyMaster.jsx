import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { isValidGSTIN, getStateCodeFromGSTIN, getStateName } from '../../utils/gstUtils';

const emptyParty = {
  name: '', gstin: '', pan: '', address: '', city: '', state: 'Gujarat',
  state_code: '24', pincode: '', phone: '', email: '', type: 'customer'
};

export default function PartyMaster({ onSuccess }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyParty);
  const [gstinValid, setGstinValid] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchParties = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('ramdev_parties').select('*').order('name');
    setParties(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchParties(); }, [fetchParties]);

  const handleGSTINChange = (val) => {
    const v = val.toUpperCase();
    setForm(f => ({
      ...f, gstin: v,
      state_code: v.length >= 2 ? getStateCodeFromGSTIN(v) : f.state_code,
      state: v.length >= 2 ? (getStateName(getStateCodeFromGSTIN(v)) || f.state) : f.state,
    }));
    setGstinValid(v.length === 15 ? isValidGSTIN(v) : null);
  };

  const openNew = () => { setForm(emptyParty); setEditing(null); setGstinValid(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setGstinValid(isValidGSTIN(p.gstin)); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    let err;
    if (editing) {
      ({ error: err } = await supabase.from('ramdev_parties').update(payload).eq('id', editing));
    } else {
      ({ error: err } = await supabase.from('ramdev_parties').insert(payload));
    }
    setSaving(false);
    if (!err) { setShowForm(false); fetchParties(); onSuccess?.(`Party "${form.name}" saved!`); }
    else alert('Error: ' + err.message);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from('ramdev_parties').delete().eq('id', id);
    fetchParties();
    onSuccess?.('Party deleted.');
  };

  const filtered = parties.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.gstin || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search parties..."
            className="w-full bg-[#0F1115] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#0F1115] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF9F1C] outline-none">
          <option value="all">All Types</option>
          <option value="customer">Customers</option>
          <option value="supplier">Suppliers</option>
          <option value="both">Both</option>
        </select>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#E58E15] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Party
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#181B22] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Name</th>
                <th className="px-4 py-3 text-gray-400 font-medium">GSTIN</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Phone</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
                <th className="px-4 py-3 text-gray-400 font-medium">State</th>
                <th className="px-4 py-3 text-gray-400 font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No parties found. Add one!</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-300">{p.gstin || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{p.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.type === 'customer' ? 'bg-blue-500/20 text-blue-300' :
                      p.type === 'supplier' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-green-500/20 text-green-300'}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{p.state}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-[#FF9F1C] transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#181B22] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF9F1C]" />
                {editing ? 'Edit Party' : 'Add New Party'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Party Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
                    className="input-admin w-full" placeholder="COMPANY / PERSON NAME" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">GSTIN</label>
                  <div className="relative">
                    <input value={form.gstin} onChange={e => handleGSTINChange(e.target.value)}
                      maxLength={15} className="input-admin w-full pr-8 font-mono tracking-wider" placeholder="24XXXXX1234Z5" />
                    {gstinValid !== null && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {gstinValid ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">PAN</label>
                  <input value={form.pan} onChange={e => setForm(f => ({ ...f, pan: e.target.value.toUpperCase() }))}
                    maxLength={10} className="input-admin w-full font-mono" placeholder="ABCDE1234F" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Address</label>
                  <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={2} className="input-admin w-full resize-none" placeholder="Full address..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="input-admin w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">State</label>
                  <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    className="input-admin w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">State Code</label>
                  <input value={form.state_code} onChange={e => setForm(f => ({ ...f, state_code: e.target.value }))}
                    maxLength={2} className="input-admin w-full" placeholder="24" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Pincode</label>
                  <input value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                    maxLength={6} className="input-admin w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="input-admin w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-admin w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="input-admin w-full">
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2 text-sm font-semibold bg-[#FF9F1C] hover:bg-[#E58E15] text-white rounded-lg transition-colors disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Party' : 'Add Party'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
