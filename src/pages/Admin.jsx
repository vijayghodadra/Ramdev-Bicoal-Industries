import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Eye, EyeOff, LayoutDashboard, MessageSquare, 
  Image as ImageIcon, RefreshCw, Trash2, Plus, 
  CheckCircle, FileText, XCircle, LogOut, CheckSquare, Square,
  Receipt, Users, ShoppingCart, Package, FileJson
} from 'lucide-react';
import { getImageUrl, setImageUrl, resetImages } from '../utils/imageHelper';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import InvoiceList from './admin/InvoiceList';
import PartyMaster from './admin/PartyMaster';
import PurchaseRegister from './admin/PurchaseRegister';
import StockRegister from './admin/StockRegister';

const DEFAULT_PASSCODE = 'RBI@8070';

export default function Admin() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard states
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  // Image Manager values
  const [imageUrls, setImageUrls] = useState({
    home_hero_bg: '',
    peanut: '',
    wheat: '',
    kabuli: '',
    cards_img: '',
    machine_mayor: ''
  });

  // Form states for updates, quotes and gallery
  const [newUpdate, setNewUpdate] = useState({ title: '', category: 'Plant Operations', content: '' });
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'factory', image: '' });
  const [fileInputKey, setFileInputKey] = useState(0);

  // Notifications / feedback
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check session login state
    const loggedInSession = sessionStorage.getItem('ramdev_admin_logged_in');
    if (loggedInSession === 'true') {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    if (isSupabaseConfigured) {
      try {
        // Fetch inquiries
        const { data: inqs, error: inqsErr } = await supabase
          .from('ramdev_inquiries')
          .select('*')
          .order('date', { ascending: false });
        if (!inqsErr) setInquiries(inqs || []);

        // Fetch updates
        const { data: ups, error: upsErr } = await supabase
          .from('ramdev_updates')
          .select('*')
          .order('date', { ascending: false });
        if (!upsErr) setUpdates(ups || []);

        // Fetch quotes
        const { data: qts, error: qtsErr } = await supabase
          .from('ramdev_quotes')
          .select('*')
          .order('id', { ascending: false });
        if (!qtsErr) setQuotes(qts || []);

        // Fetch gallery
        const { data: gal, error: galErr } = await supabase
          .from('ramdev_gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (!galErr) setGalleryItems(gal || []);

      } catch (err) {
        console.error('Error loading admin dashboard data from Supabase:', err);
      }
    } else {
      // Inquiries
      const storedInquiries = localStorage.getItem('ramdev_inquiries');
      setInquiries(storedInquiries ? JSON.parse(storedInquiries) : []);

      // Updates
      const storedUpdates = localStorage.getItem('ramdev_updates');
      if (storedUpdates) {
        setUpdates(JSON.parse(storedUpdates));
      }

      // Quotes
      const storedQuotes = localStorage.getItem('ramdev_quotes');
      if (storedQuotes) {
        setQuotes(JSON.parse(storedQuotes));
      }

      // Gallery
      const storedGallery = localStorage.getItem('ramdev_gallery_items');
      if (storedGallery) {
        setGalleryItems(JSON.parse(storedGallery));
      }
    }

    // Load active image manager values
    setImageUrls({
      home_hero_bg: localStorage.getItem('ramdev_img_home_hero_bg') || '',
      peanut: localStorage.getItem('ramdev_img_peanut') || '',
      wheat: localStorage.getItem('ramdev_img_wheat') || '',
      kabuli: localStorage.getItem('ramdev_img_kabuli') || '',
      cards_img: localStorage.getItem('ramdev_img_cards_img') || '',
      machine_mayor: localStorage.getItem('ramdev_img_machine_mayor') || ''
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === DEFAULT_PASSCODE) {
      sessionStorage.setItem('ramdev_admin_logged_in', 'true');
      setIsLoggedIn(true);
      setLoginError('');
      loadDashboardData();
      triggerSuccess('Access Granted. Welcome to Ramdev Dashboard.');
    } else {
      setLoginError('Invalid Administrator Passcode.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ramdev_admin_logged_in');
    setIsLoggedIn(false);
    setPasscode('');
  };

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // --- Tab 1: Inquiries actions ---
  const toggleInquiryStatus = async (id) => {
    const inquiry = inquiries.find(inq => inq.id === id);
    if (!inquiry) return;

    const newStatus = inquiry.status === 'read' ? 'unread' : 'read';

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('ramdev_inquiries')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) throw error;
        
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        triggerSuccess('Inquiry status updated.');
      } catch (err) {
        console.error('Error updating inquiry status in Supabase:', err);
      }
    } else {
      const updated = inquiries.map(inq => {
        if (inq.id === id) {
          return { ...inq, status: newStatus };
        }
        return inq;
      });
      setInquiries(updated);
      localStorage.setItem('ramdev_inquiries', JSON.stringify(updated));
      triggerSuccess('Inquiry status updated.');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('ramdev_inquiries')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setInquiries(prev => prev.filter(inq => inq.id !== id));
        triggerSuccess('Inquiry deleted.');
      } catch (err) {
        console.error('Error deleting inquiry in Supabase:', err);
      }
    } else {
      const filtered = inquiries.filter(inq => inq.id !== id);
      setInquiries(filtered);
      localStorage.setItem('ramdev_inquiries', JSON.stringify(filtered));
      triggerSuccess('Inquiry deleted.');
    }
  };

  // --- Tab 2: Image overrides actions ---
  const handleImageManagerFileChange = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImageUrls(prev => ({ ...prev, [key]: compressedBase64 }));
        setImageUrl(key, compressedBase64);
        triggerSuccess(`Updated website image successfully.`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const resetSingleImage = (key) => {
    setImageUrl(key, '');
    setImageUrls(prev => ({ ...prev, [key]: '' }));
    triggerSuccess(`Reset ${key} to default asset.`);
  };

  const handleResetAllImages = () => {
    if (!window.confirm('Reset ALL customized images back to local defaults?')) return;
    resetImages();
    setImageUrls({
      home_hero_bg: '',
      peanut: '',
      wheat: '',
      kabuli: '',
      cards_img: '',
      machine_mayor: ''
    });
    triggerSuccess('All images reset to factory defaults.');
  };

  // --- Tab 3: Updates CRUD ---
  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.title.trim() || !newUpdate.content.trim()) return;

    const added = {
      title: newUpdate.title.trim(),
      category: newUpdate.category,
      content: newUpdate.content.trim(),
      date: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('ramdev_updates')
          .insert([added])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setUpdates(prev => [data[0], ...prev]);
        } else {
          loadDashboardData();
        }
        setNewUpdate({ title: '', category: 'Plant Operations', content: '' });
        triggerSuccess('Daily Update posted successfully.');
      } catch (err) {
        console.error('Error adding update to Supabase:', err);
      }
    } else {
      const addedLocal = { ...added, id: `u-${Date.now()}` };
      const updatedList = [addedLocal, ...updates];
      setUpdates(updatedList);
      localStorage.setItem('ramdev_updates', JSON.stringify(updatedList));
      setNewUpdate({ title: '', category: 'Plant Operations', content: '' });
      triggerSuccess('Daily Update posted successfully.');
    }
  };

  const handleDeleteUpdate = async (id) => {
    if (!window.confirm('Delete this update post?')) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('ramdev_updates')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setUpdates(prev => prev.filter(up => up.id !== id));
        triggerSuccess('Update post removed.');
      } catch (err) {
        console.error('Error deleting update in Supabase:', err);
      }
    } else {
      const filtered = updates.filter(up => up.id !== id);
      setUpdates(filtered);
      localStorage.setItem('ramdev_updates', JSON.stringify(filtered));
      triggerSuccess('Update post removed.');
    }
  };

  // --- Tab 3: Quotes CRUD ---
  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (!newQuote.text.trim()) return;

    const added = {
      text: newQuote.text.trim(),
      author: newQuote.author.trim() || 'Anonymous'
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('ramdev_quotes')
          .insert([added])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setQuotes(prev => [data[0], ...prev]);
        } else {
          loadDashboardData();
        }
        setNewQuote({ text: '', author: '' });
        triggerSuccess('Motivational Quote added.');
      } catch (err) {
        console.error('Error adding quote to Supabase:', err);
      }
    } else {
      const addedLocal = { ...added, id: `q-${Date.now()}` };
      const updatedList = [addedLocal, ...quotes];
      setQuotes(updatedList);
      localStorage.setItem('ramdev_quotes', JSON.stringify(updatedList));
      setNewQuote({ text: '', author: '' });
      triggerSuccess('Motivational Quote added.');
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Delete this motivational quote?')) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('ramdev_quotes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setQuotes(prev => prev.filter(q => q.id !== id));
        triggerSuccess('Quote removed.');
      } catch (err) {
        console.error('Error deleting quote in Supabase:', err);
      }
    } else {
      const filtered = quotes.filter(q => q.id !== id);
      setQuotes(filtered);
      localStorage.setItem('ramdev_quotes', JSON.stringify(filtered));
      triggerSuccess('Quote removed.');
    }
  };

  // --- Tab 4: Gallery CRUD ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_SIZE = 1000;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setNewPhoto(prev => ({ ...prev, image: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.image.trim()) return;

    const added = {
      title: newPhoto.title.trim(),
      category: newPhoto.category,
      image: newPhoto.image.trim()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('ramdev_gallery')
          .insert([{ ...added, created_at: new Date().toISOString() }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setGalleryItems(prev => [data[0], ...prev]);
        } else {
          loadDashboardData();
        }
        setNewPhoto({ title: '', category: 'factory', image: '' });
        setFileInputKey(prev => prev + 1);
        triggerSuccess('Photo added to media gallery.');
      } catch (err) {
        console.error('Error adding photo to Supabase:', err);
      }
    } else {
      const updatedList = [added, ...galleryItems];
      setGalleryItems(updatedList);
      localStorage.setItem('ramdev_gallery_items', JSON.stringify(updatedList));
      setNewPhoto({ title: '', category: 'factory', image: '' });
      setFileInputKey(prev => prev + 1);
      triggerSuccess('Photo added to media gallery.');
    }
  };

  const handleDeletePhoto = async (index, id) => {
    if (!window.confirm('Remove this photo from the media gallery?')) return;

    if (isSupabaseConfigured && id) {
      try {
        const { error } = await supabase
          .from('ramdev_gallery')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setGalleryItems(prev => prev.filter(item => item.id !== id));
        triggerSuccess('Photo removed from media gallery.');
      } catch (err) {
        console.error('Error deleting photo in Supabase:', err);
      }
    } else {
      const filtered = galleryItems.filter((_, idx) => idx !== index);
      setGalleryItems(filtered);
      localStorage.setItem('ramdev_gallery_items', JSON.stringify(filtered));
      triggerSuccess('Photo removed from media gallery.');
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="relative bg-[#0F1115] text-white min-h-screen pt-36 pb-24">
      <SEO 
        title="Admin Control Dashboard" 
        description="Secure administrator management panel. Review customer quote inquiries, update plant statistics and images, and publish daily announcement feeds."
      />

      {/* Notifications Toast */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 px-6 py-3.5 bg-accent text-primary font-bold text-xs tracking-wider rounded-lg shadow-premium flex items-center space-x-2 font-display uppercase border border-accent/25"
          >
            <CheckCircle size={15} />
            <span>{actionSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LOGIN SCREEN */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#181B22] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-premium relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center space-y-3 mb-8">
                <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent mx-auto">
                  <Lock size={20} className="stroke-[1.5]" />
                </div>
                <h2 className="font-display font-extrabold text-2xl text-white">Administrator Access</h2>
                <p className="text-xs text-gray-400 font-light">Enter client-side passcode to authorize database read/write overrides.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white uppercase tracking-widest font-sans">
                    Admin Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="w-full pl-4 pr-10 py-3 bg-[#0F1115] border border-white/10 focus:border-accent text-sm text-white rounded-lg outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginError && (
                    <span className="flex items-center text-xs text-red-500 font-medium mt-1">
                      <XCircle size={12} className="mr-1.5" />
                      {loginError}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-widest font-display rounded-lg shadow-premium hover:scale-102 transition-all duration-300 cursor-pointer"
                >
                  Authorize Console
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          
          /* ADMIN DASHBOARD CONSOLE */
          <div className="space-y-8">
            
            {/* Header Dashboard Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="text-accent" size={24} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent font-sans">Management Panel</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white font-display tracking-tight leading-none">
                  Ramdev Admin Dashboard
                </h1>
              </div>

              <button
                onClick={handleLogout}
                className="self-start sm:self-center px-4 py-2.5 bg-red-950/40 border border-red-500/20 hover:border-red-500 text-red-400 font-bold text-xs tracking-wider rounded-lg transition-colors flex items-center space-x-2 font-display uppercase cursor-pointer"
              >
                <LogOut size={13} />
                <span>End Session</span>
              </button>
            </div>

            {/* Main Section: Sidebar / Tabs and Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Tab Navigation Column (3 Cols) */}
              <div className="lg:col-span-3 space-y-2">
                {/* Business Ops Group */}
                <p className="text-[10px] uppercase tracking-widest text-[#FF9F1C] font-bold px-1 pt-1">Business</p>
                {[
                  { id: 'invoices', label: 'Invoices', icon: Receipt },
                  { id: 'parties', label: 'Party Master', icon: Users },
                  { id: 'purchases', label: 'Purchase Register', icon: ShoppingCart },
                  { id: 'stock', label: 'Stock Register', icon: Package },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-accent text-primary border-accent shadow-premium'
                        : 'bg-[#181B22] text-gray-400 border-white/10 hover:border-accent/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon size={15} />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}

                {/* Website Ops Group */}
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-1 pt-3">Website</p>
                {[
                  { id: 'inquiries', label: 'Inquiry Messages', icon: MessageSquare, count: inquiries.filter(i => i.status === 'unread').length },
                  { id: 'images', label: 'Image Manager', icon: LayoutDashboard },
                  { id: 'gallery', label: 'Media Gallery', icon: ImageIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-accent text-primary border-accent shadow-premium'
                        : 'bg-[#181B22] text-gray-400 border-white/10 hover:border-accent/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon size={15} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black font-sans ${activeTab === tab.id ? 'bg-[#0F1115] text-accent' : 'bg-accent text-primary'}`}>
                        {tab.count} New
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Display Column (9 Cols) */}
              <div className="lg:col-span-9 bg-[#181B22] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-premium min-h-[500px]">
                
                {/* 1. INQUIRIES TAB */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white">Client Inquiry Messages</h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Review contact inquiries captured from the website inquiry forms.</p>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                      {inquiries.map((inq) => (
                        <div 
                          key={inq.id}
                          className={`p-5 rounded-xl border transition-colors ${
                            inq.status === 'unread' 
                              ? 'bg-[#1e232e] border-accent/20' 
                              : 'bg-[#181B22] border-white/10'
                          }`}
                        >
                          {/* Top bar info */}
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-3 mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-display font-bold text-white text-base">{inq.name}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  inq.status === 'unread' ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-gray-800 text-gray-400'
                                }`}>
                                  {inq.status === 'unread' ? 'New Message' : 'Archived'}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                                {inq.business ? `${inq.business} | ` : ''} Product: <span className="text-accent font-bold capitalize">{inq.product}</span>
                              </span>
                            </div>

                            <span className="text-[10px] text-gray-400 font-sans">{formatDate(inq.date)}</span>
                          </div>

                          {/* Message Content */}
                          <p className="text-xs text-gray-400 leading-relaxed font-light whitespace-pre-line bg-[#0F1115] p-3 rounded-lg border border-white/10">
                            {inq.message}
                          </p>

                          {/* Action list */}
                          <div className="mt-4 flex items-center justify-between flex-wrap gap-4 pt-1">
                            <div className="flex items-center space-x-4 text-xs font-light text-gray-400">
                              <span className="flex items-center"><span className="text-accent font-semibold mr-1">Phone:</span> {inq.phone}</span>
                              {inq.email && <span className="flex items-center"><span className="text-accent font-semibold mr-1">Email:</span> {inq.email}</span>}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleInquiryStatus(inq.id)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                                title={inq.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                              >
                                {inq.status === 'read' ? <Square size={16} /> : <CheckSquare size={16} />}
                              </button>
                              
                              <button
                                onClick={() => deleteInquiry(inq.id)}
                                className="p-2 bg-red-950/20 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/10 cursor-pointer"
                                title="Delete inquiry permanently"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {inquiries.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-sm font-light">
                          No inquiries received yet. Try submitting the contact form on the contact page.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. IMAGES TAB */}
                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="font-display font-extrabold text-xl text-white">Website Image Manager</h3>
                        <p className="text-xs text-gray-400 font-light mt-1">Provide external image URLs to dynamically override the local static assets.</p>
                      </div>

                      <button
                        onClick={handleResetAllImages}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-accent font-bold text-[10px] tracking-wider rounded-lg transition-colors flex items-center space-x-1.5 uppercase font-display cursor-pointer"
                      >
                        <RefreshCw size={11} />
                        <span>Reset All</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {[
                        { key: 'home_hero_bg', label: 'Home Page Hero Background', desc: 'Main full-bleed background displayed in the landing section.' },
                        { key: 'peanut', label: '90mm Biomass Briquettes (àª¬àª¾àª¯à«‹àª®àª¾àª¸ àª¬à«àª°àª¿àª•à«‡àªŸà«àª¸) Image', desc: 'Product card image and product page illustration for 90mm Biomass Briquettes.' },
                        { key: 'wheat', label: 'Eco-Friendly Bio-Coal (àª¬àª¾àª¯à«‹-àª•à«‹àª²àª¸àª¾) Image', desc: 'Product card and details page illustration for Eco-Friendly Bio-Coal.' },
                        { key: 'kabuli', label: 'Industrial Boiler Fuel (àª”àª¦à«àª¯à«‹àª—àª¿àª• àª¬à«‹àªˆàª²àª° àª¬àª³àª¤àª£) Image', desc: 'Product card and details page illustration for Industrial Boiler Fuel.' },
                        { key: 'cards_img', label: 'Business Card Graphic', desc: 'Digital Card physical layout mockup displayed on Home page.' },
                        { key: 'machine_mayor', label: 'Plant Machinery Image', desc: 'Large banner image displayed in the About Us page.' }
                      ].map((imgItem) => {
                        const currentVal = imageUrls[imgItem.key];
                        const resolvedSrc = getImageUrl(imgItem.key);
                        
                        return (
                          <div key={imgItem.key} className="p-5 bg-[#0F1115] border border-white/10 rounded-xl flex flex-col md:flex-row gap-5 items-start">
                            {/* Preview box */}
                            <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40 relative">
                              <img loading="lazy" decoding="async" src={resolvedSrc} 
                                alt={imgItem.label} 
                                className="w-full h-full object-cover" 
                              />
                            </div>

                            {/* Inputs content */}
                            <div className="flex-grow space-y-3 w-full">
                              <div>
                                <h4 className="font-display font-bold text-white text-sm">{imgItem.label}</h4>
                                <p className="text-[10px] text-gray-400 font-light mt-0.5">{imgItem.desc}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                <div className="relative overflow-hidden inline-block">
                                  <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider font-display rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                                    <Plus size={14} className="stroke-[2.5]" />
                                    <span>Select Image File</span>
                                  </button>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageManagerFileChange(imgItem.key, e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                </div>

                                {currentVal && (
                                  <button
                                    onClick={() => resetSingleImage(imgItem.key)}
                                    className="px-4 py-2 bg-red-950/20 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/10 cursor-pointer flex items-center gap-1.5"
                                    title="Reset to local default asset"
                                  >
                                    <Trash2 size={13} />
                                    <span>Reset Default</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}


                {/* 4. GALLERY PHOTOS TAB */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white">Media Gallery Photo Manager</h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Upload, categorize, and organize photos in the website's public gallery.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Add Photo Form (5 cols) */}
                      <div className="lg:col-span-5 bg-[#0F1115] p-5 rounded-xl border border-white/10 space-y-4">
                        <h4 className="font-display font-bold text-sm text-white">Add Photo to Gallery</h4>
                        
                        <form onSubmit={handleAddPhoto} className="space-y-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-white uppercase tracking-wider">Photo Title *</label>
                            <input
                              type="text"
                              required
                              value={newPhoto.title}
                              onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g. Grain Sorting Machine Line"
                              className="w-full px-3 py-2 bg-[#181B22] border border-white/10 focus:border-accent text-xs text-white rounded-lg outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-white uppercase tracking-wider">Category</label>
                            <select
                              value={newPhoto.category}
                              onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 bg-[#181B22] border border-white/10 focus:border-accent text-xs text-white rounded-lg outline-none cursor-pointer"
                            >
                              <option value="factory">Factory</option>
                              <option value="machinery">Machinery</option>
                              <option value="products">Products</option>
                              <option value="packing">Packing</option>
                              <option value="warehouse">Warehouse</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-white uppercase tracking-wider">Upload Image *</label>
                            <div className="relative border border-dashed border-white/10 hover:border-accent/40 rounded-lg p-4 text-center cursor-pointer bg-[#181B22] transition-colors">
                              <input
                                key={fileInputKey}
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="space-y-2">
                                <div className="flex justify-center text-gray-400">
                                  <ImageIcon size={20} className="stroke-[1.5]" />
                                </div>
                                <div className="text-xs text-gray-400">
                                  {newPhoto.image ? 'âœ“ Image Loaded' : 'Click to select photo file'}
                                </div>
                                <p className="text-[9px] text-gray-500">Supports PNG, JPG, JPEG</p>
                              </div>
                            </div>
                            {newPhoto.image && (
                              <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative">
                                <img loading="lazy" decoding="async" src={newPhoto.image} alt="Upload preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider font-display rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>Add Photo to Gallery</span>
                          </button>
                        </form>
                      </div>

                      {/* Right: Grid of Photos (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="font-display font-bold text-sm text-white">Active Gallery Photos ({galleryItems.length})</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                          {galleryItems.map((photo, idx) => (
                            <div key={idx} className="p-3 bg-[#0F1115]/50 border border-white/10 rounded-xl flex items-center gap-3 relative group hover:border-white/10 transition-colors">
                              {/* Preview thumbnail */}
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0">
                                <img loading="lazy" decoding="async" src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                              </div>

                              {/* Info details */}
                              <div className="min-w-0 flex-grow pr-6">
                                <h5 className="font-display font-bold text-xs text-white truncate">{photo.title}</h5>
                                <span className="text-[8px] font-black text-accent uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded border border-accent/10 inline-block mt-1 capitalize">
                                  {photo.category}
                                </span>
                              </div>

                              {/* Delete action button */}
                              <button
                                onClick={() => handleDeletePhoto(idx, photo.id)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-red-950/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded border border-red-500/10 cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}

                          {galleryItems.length === 0 && (
                            <div className="col-span-2 text-center py-16 text-gray-500 text-xs font-light">
                              No photos in the gallery. Use the form on the left to add your first photo.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* INVOICES TAB */}
                {activeTab === 'invoices' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                        <Receipt className="text-accent" size={20} /> Invoice Management
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Create GST-compliant tax invoices. Download PDF, E-Invoice JSON & E-Way Bill JSON.</p>
                    </div>
                    <InvoiceList onSuccess={triggerSuccess} />
                  </div>
                )}

                {/* PARTY MASTER TAB */}
                {activeTab === 'parties' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                        <Users className="text-accent" size={20} /> Party Master
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Manage customers and suppliers. GSTIN validation with state auto-fill.</p>
                    </div>
                    <PartyMaster onSuccess={triggerSuccess} />
                  </div>
                )}

                {/* PURCHASE REGISTER TAB */}
                {activeTab === 'purchases' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                        <ShoppingCart className="text-accent" size={20} /> Purchase Register
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Record RD (Registered Dealer) and URD (Unregistered Dealer) purchases with auto GST calculation.</p>
                    </div>
                    <PurchaseRegister onSuccess={triggerSuccess} />
                  </div>
                )}

                {/* STOCK REGISTER TAB */}
                {activeTab === 'stock' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                        <Package className="text-accent" size={20} /> Stock Register
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-1">Track raw material (groundnut biomass) and finished goods (briquettes) separately with live balance.</p>
                    </div>
                    <StockRegister onSuccess={triggerSuccess} />
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

