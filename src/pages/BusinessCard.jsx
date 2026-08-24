import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, MapPin, MessageSquare, Download, Share2, 
  Globe, Flame, Lock, ShieldAlert, ArrowUpRight, CheckCircle2,
  Copy, FileText, LayoutGrid, ChevronRight, Zap
} from 'lucide-react';
import SEO from '../components/SEO';

export default function BusinessCard() {
  const location = useLocation();
  const [isFromScanner, setIsFromScanner] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(location.search);
    const scannerParam = searchParams.get('scanner');
    const sourceParam = searchParams.get('source');
    
    // Check if opened via QR scanner
    if (scannerParam === 'true' || sourceParam === 'qr') {
      setIsFromScanner(true);
    } else {
      setIsFromScanner(false);
    }
  }, [location]);

  const showFeedback = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Ghodadra;Vijay;;;
FN:Vijay Ghodadra
ORG:Ramdev Biocoal Industries
TITLE:Director
TEL;TYPE=CELL,VOICE:+919727775987
EMAIL;TYPE=PREF,INTERNET:ramdevbiocoalindustry@gmail.com
ADR;TYPE=WORK:;;Ramdev Udhyog Nagar 2, Veraval Road, Sondarda;Sondarda;Gujarat;362227;India
URL:https://ramdevbiocoal.com
END:VCARD`;

    try {
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Vijay_Ghodadra.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showFeedback('Contact Card Saved Successfully');
    } catch (err) {
      console.error('Error downloading vcard:', err);
      showFeedback('Download Failed, Please Try Again');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Ramdev Biocoal Industries - Vijay Ghodadra',
      text: 'Vijay Ghodadra, Director at Ramdev Biocoal Industries - Contact Details.',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showFeedback('Profile Link Copied to Clipboard');
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        showFeedback('Copy Failed');
      }
    }
  };

  const handleCopyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showFeedback(`${label} Copied`);
    } catch (err) {
      showFeedback('Copy Failed');
    }
  };

  // Resolve correct url for QR code
  const currentCardUrl = `${window.location.origin}/digital-card?scanner=true`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentCardUrl)}&color=0b0d10&bgcolor=ffffff&qzone=2`;

  // 1. PREMIUM RESTRICTED ACCESS SCREEN
  if (!isFromScanner) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-red-500/5 rounded-full blur-[90px] pointer-events-none" />

        {/* Minimalist Graphic Shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 border-l border-t border-white/5 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-r border-b border-white/5 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-[#111419]/90 border border-white/5 p-8 rounded-2xl text-center shadow-premium relative z-10"
        >
          {/* Lock Icon */}
          <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 text-red-500/80">
            <Lock size={20} className="stroke-[1.5]" />
          </div>

          <div className="space-y-3 mb-8">
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white/95 uppercase tracking-wide">
              Identity Locked
            </h1>
            <p className="text-[11px] text-gray-400 leading-relaxed font-light max-w-xs mx-auto">
              This digital business profile card represents a verified corporate identity. Access is granted exclusively via physical card scans.
            </p>
          </div>

          {/* Guidelines Block */}
          <div className="p-4 bg-[#0B0D10] border border-white/5 rounded-xl flex items-start space-x-3 text-left mb-8">
            <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5 stroke-[1.5]" />
            <span className="text-[10px] text-gray-500 font-light leading-normal">
              To preview the identity, please scan the QR code printed on Vijay Ghodadra's physical business card using your smartphone camera.
            </span>
          </div>

          <Link
            to="/"
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/20 text-white hover:text-accent font-bold text-xs tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-display uppercase tracking-widest cursor-pointer"
          >
            <span>Visit Homepage</span>
            <ChevronRight size={12} className="stroke-[2]" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // 2. LUXURY BUSINESS CARD PROFILE VIEW
  return (
    <div className="min-h-screen bg-[#0B0D10] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none antialiased">
      <SEO 
        title="Vijay Ghodadra - Digital Business Identity" 
        description="Corporate Contact Page for Vijay Ghodadra, Director at Ramdev Biocoal Industries."
      />

      {/* Modern Desktop Presentation Background Lights */}
      <div className="hidden md:block absolute -top-80 -left-80 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 -right-80 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Center Content Column (Locks to mobile card width on desktop) */}
      <div className="max-w-md w-full mx-auto px-4 md:px-0 py-8 relative z-10 flex-grow flex flex-col justify-center space-y-6">
        
        {/* PROFILE HEADER CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#111419]/90 border border-white/5 rounded-2xl p-6 shadow-premium overflow-hidden text-center"
        >
          {/* Energy Ring Decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 border border-accent/10 rounded-full border-dashed" 
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 border border-white/5 rounded-full" 
            />
          </div>

          {/* Logo Brand Icon */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent/20 to-accent/5 p-[1px] mx-auto mb-4 border border-white/5 relative z-10 flex items-center justify-center">
            <Flame size={22} className="text-accent fill-accent/10 stroke-[1.5]" />
          </div>

          <span className="block text-[8px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1 relative z-10">
            Ramdev Biocoal Industries
          </span>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight leading-tight relative z-10">
            Vijay Ghodadra
          </h2>
          <p className="text-[10px] text-accent font-bold tracking-widest uppercase mt-1 relative z-10">
            Director
          </p>

          <p className="text-[10px] text-gray-400 font-light mt-3 leading-relaxed max-w-xs mx-auto relative z-10">
            "Premium Biomass Briquettes &amp; Bio-Coal Manufacturer"
          </p>

          {/* Executive Info separator grid */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 relative z-10">
            <div>
              <span className="block text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Role</span>
              <span className="block text-[11px] font-semibold text-white/90 mt-1 font-display">Director</span>
            </div>
            <div className="border-l border-white/5 pl-2">
              <span className="block text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Industry</span>
              <span className="block text-[11px] font-semibold text-white/90 mt-1 font-display">Bio Energy</span>
            </div>
            <div className="border-l border-white/5 pl-2">
              <span className="block text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Origin</span>
              <span className="block text-[11px] font-semibold text-white/90 mt-1 font-display">Gujarat, IN</span>
            </div>
          </div>
        </motion.div>

        {/* PRIMARY CTA - SAVE CONTACT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            onClick={handleSaveContact}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-[#0B0D10] font-display font-extrabold text-xs uppercase tracking-[0.15em] rounded-xl shadow-premium transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Download size={14} className="stroke-[2.5]" />
            <span>Save Contact Card</span>
          </button>
        </motion.div>

        {/* ACTION GRID (2x2 Grid) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Call card */}
          <motion.a
            href="tel:+919727775987"
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-[#111419]/90 border border-white/5 hover:border-accent/20 rounded-xl flex flex-col justify-between h-[96px] transition-all duration-300 shadow-premium group cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-[#0B0D10] border border-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                <Phone size={13} className="stroke-[2]" />
              </div>
              <ArrowUpRight size={10} className="text-white/20 group-hover:text-accent transition-colors" />
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">Call Phone</span>
              <span className="block text-[11px] font-bold text-white mt-0.5 font-sans">+91 97277 75987</span>
            </div>
          </motion.a>

          {/* WhatsApp card */}
          <motion.a
            href="https://wa.me/919727775987?text=Hello%20Vijay%20bhai%2C%20I%20scanned%20your%20digital%20business%20card.%20I%20would%20like%20to%20inquire%20about%20your%20biomass%20briquettes."
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-[#111419]/90 border border-white/5 hover:border-accent/20 rounded-xl flex flex-col justify-between h-[96px] transition-all duration-300 shadow-premium group cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-[#0B0D10] border border-white/5 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-[#0B0D10] transition-colors duration-300">
                <MessageSquare size={13} className="stroke-[2]" />
              </div>
              <ArrowUpRight size={10} className="text-white/20 group-hover:text-[#25D366] transition-colors" />
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">WhatsApp</span>
              <span className="block text-[11px] font-bold text-white mt-0.5 font-sans">Message Direct</span>
            </div>
          </motion.a>

          {/* Email card */}
          <motion.a
            href="mailto:ramdevbiocoalindustry@gmail.com"
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-[#111419]/90 border border-white/5 hover:border-accent/20 rounded-xl flex flex-col justify-between h-[96px] transition-all duration-300 shadow-premium group cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-[#0B0D10] border border-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                <Mail size={13} className="stroke-[2]" />
              </div>
              <ArrowUpRight size={10} className="text-white/20 group-hover:text-accent transition-colors" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">Send Mail</span>
              <span className="block text-[11px] font-bold text-white mt-0.5 font-sans truncate">ramdevbiocoal...</span>
            </div>
          </motion.a>

          {/* Address card */}
          <motion.a
            href="https://maps.google.com/?q=Ramdev+Udhyog+Nagar+2,+Veraval+Road,+Sondarda,+Gujarat+362227"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-[#111419]/90 border border-white/5 hover:border-accent/20 rounded-xl flex flex-col justify-between h-[96px] transition-all duration-300 shadow-premium group cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-[#0B0D10] border border-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                <MapPin size={13} className="stroke-[2]" />
              </div>
              <ArrowUpRight size={10} className="text-white/20 group-hover:text-accent transition-colors" />
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">Directions</span>
              <span className="block text-[11px] font-bold text-white mt-0.5 font-sans">Sondarda, Gujarat</span>
            </div>
          </motion.a>
        </motion.div>

        {/* PRODUCTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111419]/90 border border-white/5 rounded-2xl p-5 shadow-premium space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Our Products Range</span>
            <Link 
              to="/products"
              className="text-[9px] text-accent uppercase font-bold tracking-widest flex items-center space-x-1.5 group"
            >
              <span>Explore All</span>
              <ChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#0B0D10] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-white leading-tight font-display">90mm Biomass Briquettes</span>
                <span className="block text-[9px] text-gray-500 font-light">100% groundnut husk, zero chemical binders</span>
              </div>
              <span className="text-[8px] uppercase tracking-wider font-semibold border border-accent/25 bg-accent/5 px-2 py-1 rounded text-accent font-sans shrink-0">
                Premium
              </span>
            </div>

            <div className="p-3 bg-[#0B0D10] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-white leading-tight font-display">Eco-Friendly Bio-Coal</span>
                <span className="block text-[9px] text-gray-500 font-light">Consistent high GCV thermal energy alternative</span>
              </div>
              <span className="text-[8px] uppercase tracking-wider font-semibold border border-white/10 bg-white/[0.02] px-2 py-1 rounded text-gray-400 font-sans shrink-0">
                Sustainable
              </span>
            </div>
          </div>
        </motion.div>

        {/* DIGITAL IDENTITY & QR CODE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-[#111419]/90 border border-white/5 rounded-2xl p-6 shadow-premium text-center space-y-4"
        >
          <div className="space-y-1">
            <span className="block text-[8px] uppercase tracking-[0.2em] font-bold text-gray-500">Digital Card Scanner</span>
            <h4 className="font-display font-extrabold text-sm text-white/95 uppercase tracking-wide">Digital Identity QR</h4>
          </div>

          {/* QR Container */}
          <div className="relative w-44 h-44 mx-auto bg-white p-2.5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden border border-white/10">
            <img 
              loading="lazy" 
              src={qrCodeApiUrl} 
              alt="Digital Card Scan Code" 
              className="w-full h-full object-contain relative z-0" 
            />

            {/* Glowing Scan Line Animation */}
            <motion.div
              animate={{ top: ["4%", "96%", "4%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1 right-1 h-[2px] bg-accent shadow-[0_0_8px_#FF9F1C] z-10 pointer-events-none"
            />
          </div>

          <p className="text-[9px] text-gray-500 leading-normal max-w-xs mx-auto font-light">
            Scan this QR code using another device to instantly load Vijay's verified contact profile card URL.
          </p>
        </motion.div>

        {/* WEBSITE CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative bg-gradient-to-tr from-[#111419] to-[#171A20] border border-white/5 rounded-2xl p-5 shadow-premium overflow-hidden group hover:border-accent/15 transition-all duration-300"
        >
          {/* Subtle Background Icon */}
          <div className="absolute -bottom-6 -right-6 text-[#1c202a] opacity-30 transform group-hover:scale-105 transition-transform duration-500">
            <Globe size={110} className="stroke-[0.7]" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <span className="text-accent font-bold tracking-widest text-[8px] uppercase block">Corporate Portal</span>
              <h4 className="font-display font-extrabold text-base text-white tracking-tight leading-tight">
                Explore Ramdev Biocoal
              </h4>
              <p className="text-[10px] text-gray-400 leading-normal font-light max-w-[280px]">
                Discover our factory capabilities, machinery setups, sorted batches, and request customized bulk quotes.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-[10px] font-bold text-accent hover:text-white uppercase tracking-widest group font-display"
            >
              <span>Visit Main Website</span>
              <ChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </motion.div>

        {/* BOTTOM UTILITY / SHARING */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center justify-center space-x-6 py-2"
        >
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 text-[9px] text-gray-400 hover:text-white uppercase tracking-widest font-bold font-display transition-colors py-1.5 cursor-pointer"
          >
            <Share2 size={11} className="stroke-[2.5]" />
            <span>Share Profile</span>
          </button>
          
          <span className="h-3 w-[1px] bg-white/5" />

          <button
            onClick={() => handleCopyText('+919727775987', 'Phone Number')}
            className="inline-flex items-center space-x-2 text-[9px] text-gray-400 hover:text-white uppercase tracking-widest font-bold font-display transition-colors py-1.5 cursor-pointer"
          >
            <Copy size={11} className="stroke-[2.5]" />
            <span>Copy Contact</span>
          </button>
        </motion.div>

      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-white/5 relative z-10 mt-auto bg-[#0B0D10]">
        <p className="text-[8px] text-gray-500 uppercase tracking-[0.2em] font-medium leading-relaxed font-sans">
          © {new Date().getFullYear()} Ramdev Biocoal Industries • Renewable Energy Solutions
        </p>
      </footer>

      {/* TOAST FEEDBACK PORTAL */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 15, x: '-50%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 bg-[#171A20] border border-white/5 px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-white flex items-center space-x-2 shadow-premium z-50 whitespace-nowrap font-display"
          >
            <CheckCircle2 className="text-accent stroke-[2.5]" size={12} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
