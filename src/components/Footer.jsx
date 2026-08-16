import { Link } from 'react-router-dom';
import { Cog, MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1115] text-gray-400 pt-20 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Column 1: Company Logo & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="font-display font-extrabold text-2xl text-white tracking-wider">
                RAMDEV
                <span className="text-accent block text-[10px] tracking-[0.2em] font-semibold uppercase -mt-1.5 font-sans">
                  BIOCOAL INDUSTRIES
                </span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Manufacturing high-quality 90mm biomass briquettes from 100% pure groundnut husk. Your trusted eco-friendly industrial fuel partner in Gujarat.
            </p>
            <div className="text-accent font-display text-xs font-semibold uppercase tracking-wider">
              Precision. Quality. Reliability.
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919727775987"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#181B22] flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary transition-all duration-300 shadow-sm border border-white/10"
                aria-label="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
              <a
                href="mailto:ramdevbiocoalindustry@gmail.com"
                className="w-10 h-10 rounded-lg bg-[#181B22] flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary transition-all duration-300 shadow-sm border border-white/10"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:justify-self-center">
            <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[1.5px] after:bg-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Our Products', path: '/products' },
                { label: 'Media Gallery', path: '/gallery' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-xs text-gray-400 hover:text-accent transition-colors duration-255"
                  >
                    <ArrowRight size={12} className="mr-2 text-gray-600 group-hover:text-accent transition-all duration-200 group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:justify-self-end">
            <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[1.5px] after:bg-accent">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-xs text-gray-400">
                <MapPin className="text-accent shrink-0 mt-0.5" size={16} />
                <span className="leading-relaxed">
                  Ramdev Udhyog Nagar 2, <br />
                  Veraval Road, Sondarda, <br />
                  Gujarat - 362227
                </span>
              </li>
              <li className="flex items-start space-x-3 text-xs text-gray-400">
                <Phone className="text-accent shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col space-y-1">
                  <a href="tel:+919727775987" className="hover:text-accent transition-colors">
                    +91 97277 75987
                  </a>
                  <a href="tel:+919016874242" className="hover:text-accent transition-colors">
                    +91 90168 74242
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-400">
                <Mail className="text-accent shrink-0" size={16} />
                <a href="mailto:ramdevbiocoalindustry@gmail.com" className="hover:text-accent transition-colors">
                  ramdevbiocoalindustry@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-400">
                <Clock className="text-accent shrink-0" size={16} />
                <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-10" />

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>© 2022 Ramdev Biocoal Industries. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
