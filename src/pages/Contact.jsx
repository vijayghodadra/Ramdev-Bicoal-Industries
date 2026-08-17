import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageSquare, 
  CheckCircle, AlertCircle, QrCode 
} from 'lucide-react';
import SEO from '../components/SEO';
import qrImage from '../assets/B3.jpg';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function Contact() {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    business: '',
    product: 'general',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pre-fill message/product if redirected from Product details page
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state) {
      if (location.state.defaultProduct) {
        const prod = location.state.defaultProduct.toLowerCase();
        let selectedKey = 'general';
        if (prod.includes('peanut')) selectedKey = 'peanut';
        else if (prod.includes('chana') || prod.includes('chickpea')) selectedKey = 'chana';
        else if (prod.includes('tuwar') || prod.includes('pigeon')) selectedKey = 'tuwar';
        else if (prod.includes('wheat')) selectedKey = 'wheat';
        else if (prod.includes('kabuli') || prod.includes('garbanzo')) selectedKey = 'kabuli';

        setFormData(prev => ({
          ...prev,
          product: selectedKey,
          message: `Hello Ramdev Biocoal Industries. I would like to request pricing and catalog specifications for ${location.state.defaultProduct}.`
        }));
      } else if (location.state.openQuoteModal) {
        setFormData(prev => ({
          ...prev,
          message: `Hello Ramdev Biocoal Industries. I would like to request a customized quote for agricultural processing.`
        }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    
    // Phone validation
    const phoneRegex = /^[0-9+\s-]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) newErrors.message = 'Inquiry message is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newInq = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      business: formData.business.trim(),
      product: formData.product,
      message: formData.message.trim(),
      date: new Date().toISOString(),
      status: 'unread'
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('somnath_inquiries')
          .insert([newInq]);

        if (error) throw error;
        
        setSubmitSuccess(true);
      } catch (err) {
        console.error('Error writing inquiry to Supabase, falling back to localStorage:', err);
        saveInquiryToLocalStorage(newInq);
        setSubmitSuccess(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Fallback
      setTimeout(() => {
        saveInquiryToLocalStorage(newInq);
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1000);
    }

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      business: '',
      product: 'general',
      message: ''
    });
  };

  const saveInquiryToLocalStorage = (newInq) => {
    try {
      const stored = localStorage.getItem('somnath_inquiries');
      const existing = stored ? JSON.parse(stored) : [];
      newInq.id = `inq-${Date.now()}`;
      localStorage.setItem('somnath_inquiries', JSON.stringify([newInq, ...existing]));
    } catch (err) {
      console.error('Error writing inquiry to localStorage:', err);
    }
  };

  return (
    <div className="relative bg-[#0F1115] text-white">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Ramdev Biocoal Industries. Fill out our quote form or connect directly via Call/WhatsApp. View our factory location map in Sondarda."
      />

      {/* Page Header Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/50 to-[#0F1115]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white"
          >
            Contact &amp; Quotes
          </motion.h1>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
            Have questions about grain batches, sorting tariffs, or logistics schedules? Drop us a message.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="py-24 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Info, Buttons, QR Code */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
                  Corporate Office
                </span>
                <h2 className="text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
                  Get In Touch Directly
                </h2>
                <div className="h-[2px] w-16 bg-accent rounded" />
                <p className="text-gray-400 text-sm font-light">
                  Use the quick call or messaging links below to connect directly with our operations manager on the floor.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="tel:+919727775987"
                  className="px-4 py-3.5 bg-[#181B22] border border-white/10 hover:border-accent text-white hover:text-accent font-bold text-xs tracking-wider rounded-lg shadow-premium transition-all duration-300 flex items-center justify-center space-x-2 font-display uppercase cursor-pointer"
                >
                  <Phone size={14} className="fill-current" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/919727775987?text=Hello%20Ramdev%20Biocoal%20Industries%2C%0AI%20am%20interested%20in%20your%20biomass%20briquettes.%20I%20found%20your%20product%20on%20your%20website%20and%20would%20like%20to%20get%20more%20details%20regarding%20price%2C%20specifications%2C%20minimum%20order%20quantity%2C%20and%20delivery.%0AThank%20you."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs tracking-wider rounded-lg shadow transition-all duration-300 flex items-center justify-center space-x-2 font-display uppercase cursor-pointer"
                >
                  <MessageSquare size={14} className="fill-current" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="mailto:ramdevbiocoalindustry@gmail.com"
                  className="px-4 py-3.5 bg-[#181B22]/50 border border-white/10 hover:bg-[#181B22] text-white hover:text-accent font-bold text-xs tracking-wider rounded-lg shadow transition-all duration-300 flex items-center justify-center space-x-2 font-display uppercase cursor-pointer"
                >
                  <Mail size={14} />
                  <span>Email Us</span>
                </a>
              </div>

              {/* Text Info List */}
              <ul className="space-y-6 pt-4 border-t border-white/10">
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 mt-0.5 shadow-premium">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Factory Location</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed font-light">
                      Ramdev Udhyog Nagar 2, Veraval Road, <br />
                      Sondarda, Gujarat - 362227
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 mt-0.5 shadow-premium">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Operations Hours</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed font-light">
                      Monday – Saturday: 8:00 AM – 8:00 PM <br />
                      Sunday: Plant Maintenance / Closed
                    </p>
                  </div>
                </li>
              </ul>

              {/* QR Code Placeholder Card */}
              <div className="p-8 border border-white/10 bg-[#181B22]/50 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-premium">
                <div className="p-3 bg-[#181B22] border border-white/10 rounded-xl flex items-center justify-center relative group cursor-pointer shrink-0">
                  <img loading="lazy" decoding="async" src={qrImage} alt="Ramdev Biocoal Industries Business Card QR Code" className="w-24 h-24 object-contain rounded-lg bg-white p-1" />
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h4 className="font-display font-bold text-sm text-white">Scan QR Details</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Scan this QR code using your mobile phone camera to instantly download our digital business profile card and contact nodes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 bg-[#181B22] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold text-white uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-lg border bg-[#0F1115] text-sm text-white outline-none transition-colors ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                    {errors.name && (
                      <span className="flex items-center text-xs text-red-500 mt-1 font-medium">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-bold text-white uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`w-full px-4 py-3 rounded-lg border bg-[#0F1115] text-sm text-white outline-none transition-colors ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                    {errors.phone && (
                      <span className="flex items-center text-xs text-red-500 mt-1 font-medium">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-bold text-white uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg border bg-[#0F1115] text-sm text-white outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                    {errors.email && (
                      <span className="flex items-center text-xs text-red-500 mt-1 font-medium">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Business Name */}
                  <div className="space-y-2">
                    <label htmlFor="business" className="block text-xs font-bold text-white uppercase tracking-wider">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="business"
                      name="business"
                      value={formData.business}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0F1115] text-sm text-white outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-bold text-white uppercase tracking-wider">
                    Inquiry Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message here..."
                    className={`w-full px-4 py-3 rounded-lg border bg-[#0F1115] text-sm text-white outline-none transition-colors resize-y ${
                      errors.message ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-accent'
                    }`}
                  />
                  {errors.message && (
                    <span className="flex items-center text-xs text-red-500 mt-1 font-medium">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-primary font-bold text-sm uppercase tracking-wider rounded-lg shadow-premium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 rounded-full border-2 border-primary border-t-accent animate-spin" />
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Success Overlay Modal */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#181B22] rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4 z-10"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="text-accent"
                    >
                      <CheckCircle size={64} className="stroke-[1.5]" />
                    </motion.div>
                    <h3 className="font-display font-extrabold text-2xl text-white">Inquiry Submitted Successfully</h3>
                    <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-light">
                      Thank you for contacting us. Our operations team will review your requirements and reach out to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-2 border border-accent hover:bg-accent hover:text-primary bg-transparent text-accent font-semibold text-xs tracking-wider uppercase rounded-lg transition-all duration-300 font-display cursor-pointer"
                    >
                      New Inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="relative h-[450px] w-full border-t border-white/10 bg-[#0F1115]">
        <iframe
          src="https://maps.google.com/maps?q=21.2576215,70.2598469&t=&z=17&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(100%) contrast(90%)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ramdev Biocoal Industries Location Map"
        ></iframe>
      </section>
    </div>
  );
}
