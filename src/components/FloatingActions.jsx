import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Phone, MessageSquare } from 'lucide-react';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-3.5">
      {/* Call Button */}
      <motion.a
        href="tel:+919925842943"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-14 h-14 bg-[#181B22] text-accent hover:bg-accent hover:text-primary rounded-full flex items-center justify-center shadow-premium border border-white/10 hover:border-accent transition-all duration-300 relative group cursor-pointer"
        aria-label="Call Now"
      >
        <Phone size={20} className="fill-current" />
        <span className="absolute right-16 bg-[#181B22] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 font-display">
          Call Now
        </span>
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/919925842943?text=Hello%20Somnath%20Industries,%20I%20would%20like%20to%20get%20more%20information%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-14 h-14 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-premium transition-all duration-300 relative group cursor-pointer"
        aria-label="WhatsApp"
      >
        <MessageSquare size={22} className="fill-current" />
        <span className="absolute right-16 bg-[#181B22] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 font-display">
          WhatsApp Us
        </span>
      </motion.a>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 bg-[#181B22] text-white border border-white/10 hover:border-accent hover:bg-accent hover:text-primary rounded-full flex items-center justify-center shadow-premium transition-all duration-300 group cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
