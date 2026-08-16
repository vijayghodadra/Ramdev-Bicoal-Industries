import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cog, PhoneCall, ChevronDown, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageHelper';
import logoImg from '../assets/logo.png';
import briquetteImg from '../assets/RAW.jpg';
import ecoImg from '../assets/B2.jpg';
import perfImg from '../assets/B4.jpg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const megaMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsMegaOpen(false);
  }, [location]);

  const isAdmin = sessionStorage.getItem('somnath_admin_logged_in') === 'true';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products', isMega: true },
    { name: 'Process', path: '/process' },
    { name: 'About Us', path: '/about' },
    { name: 'Media Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
    { name: isAdmin ? 'Admin Panel' : 'Admin Login', path: '/admin' },
  ];

  const megaProducts = [
    {
      id: 'briquettes',
      name: '90mm Groundnut Briquettes',
      variety: '100% Pure Groundnut Husk',
      desc: 'High-density biomass briquettes manufactured exclusively for industrial boilers.',
      image: briquetteImg,
    },
    {
      id: 'eco-fuel',
      name: 'Eco-Friendly Fuel',
      variety: 'Zero Fossil Fuels',
      desc: 'A clean, renewable energy source that drastically reduces carbon footprint.',
      image: ecoImg,
    },
    {
      id: 'performance',
      name: 'High GCV Performance',
      variety: '~4000 kcal/kg Calorific Value',
      desc: 'Provides sustained thermal output preventing furnace clogging and ash waste.',
      image: perfImg,
    }
  ];

  const handleMouseLeave = (e) => {
    if (megaMenuRef.current && e.relatedTarget instanceof Node && !megaMenuRef.current.contains(e.relatedTarget)) {
      setIsMegaOpen(false);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? 'glass-nav py-4 shadow-premium' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center mr-2"
              >
                <img src={logoImg} alt="Ramdev Logo" className="w-20 h-20 object-contain" />
              </motion.div>
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-white">
                RAMDEV
                <span className="text-accent font-extrabold text-xs tracking-[0.2em] block uppercase -mt-1 font-sans">
                  BIOCOAL INDUSTRIES
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-5">
              {navLinks.map((link) => {
                if (link.isMega) {
                  return (
                    <div 
                      key={link.name}
                      className="relative py-2"
                      onMouseEnter={() => setIsMegaOpen(true)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className="flex items-center space-x-1 font-semibold text-sm text-gray-400 hover:text-accent transition-all duration-300 cursor-pointer"
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={14} className={`transform transition-transform duration-300 ${isMegaOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isMegaOpen && (
                          <motion.div
                            ref={megaMenuRef}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[680px] bg-[#181B22]/98 backdrop-blur-md rounded-xl shadow-premium-lg border border-white/10 p-6 z-50 grid grid-cols-12 gap-6"
                          >
                            <div className="col-span-8 grid grid-cols-2 gap-4">
                              {megaProducts.map((prod) => (
                                <Link
                                  key={prod.id}
                                  to={`/products#${prod.id}`}
                                  className="group/item flex flex-col space-y-2.5 p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                                  onClick={() => setIsMegaOpen(false)}
                                >
                                  <div className="h-24 w-full rounded-md overflow-hidden relative border border-white/10">
                                    <img loading="lazy" decoding="async" src={prod.image} 
                                      alt={prod.name} 
                                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors duration-300" />
                                  </div>
                                  <div>
                                    <h4 className="font-display font-bold text-xs text-white group-hover/item:text-accent transition-colors">
                                      {prod.name}
                                    </h4>
                                    <span className="text-[9px] text-accent block font-medium mt-0.5">{prod.variety}</span>
                                    <p className="text-[10px] text-gray-400 mt-1 leading-normal line-clamp-2">
                                      {prod.desc}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <div className="col-span-4 bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col justify-between">
                              <div className="space-y-3">
                                <span className="text-[9px] font-bold text-accent tracking-widest uppercase block">Industrial Supply</span>
                                <h5 className="font-display font-extrabold text-sm text-white">Need Bulk Order Specifications?</h5>
                                <p className="text-[10px] text-gray-400 leading-normal">
                                  We support custom tonnage logistics and dedicated transport solutions for industrial plants.
                                </p>
                              </div>
                              <Link
                                to="/products"
                                className="inline-flex items-center space-x-1 text-[11px] font-bold text-accent hover:text-white transition-colors uppercase tracking-wider pt-4"
                                onClick={() => setIsMegaOpen(false)}
                              >
                                <span>All Products</span>
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `font-semibold text-sm transition-all duration-300 py-1 border-b-2 ${
                        isActive 
                          ? 'text-accent border-accent' 
                          : 'text-gray-400 hover:text-accent border-transparent'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-accent hover:bg-accent-hover text-[#0F1115] transition-all duration-300 shadow-premium font-display hover:scale-[1.03]"
              >
                Request Quote
              </Link>
            </div>

            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:text-accent focus:outline-none transition-colors duration-300 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-[#181B22] shadow-2xl flex flex-col justify-between border-l border-white/10"
            >
              <div className="px-6 py-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center space-x-2">
                    <Cog className="text-accent animate-spin-slow" size={24} />
                    <span className="font-display font-extrabold text-lg text-white tracking-wide">
                      RAMDEV
                      <span className="text-accent ml-1 font-semibold text-[9px] tracking-[0.2em] block uppercase -mt-1 font-sans">
                        BIOCOAL INDUSTRIES
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-8 flex flex-col space-y-4">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-lg font-semibold text-base transition-all ${
                            isActive
                              ? 'bg-accent/10 text-accent font-bold'
                              : 'text-gray-400 hover:bg-white/5'
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#0F1115] space-y-4">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-primary font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md text-center font-display"
                >
                  Request Quote
                </Link>
                <a
                  href="tel:+919925842943"
                  className="flex items-center justify-center space-x-2 text-xs text-gray-400 hover:text-white font-medium transition-colors py-2"
                >
                  <PhoneCall size={14} className="text-accent" />
                  <span>Call Operations: +91 99258 42943</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
