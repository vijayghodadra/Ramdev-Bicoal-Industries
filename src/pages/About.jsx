import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import machineImg from '../assets/Machine.jpg';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      icon: ShieldCheck,
      title: 'Quality Control',
      desc: 'Uncompromising Quality Control to eliminate variance and prevent furnace clogging.'
    },
    {
      icon: Compass,
      title: 'Truck Logistics',
      desc: 'Reliable Truck Logistics ensuring your operations never halt due to fuel shortage.'
    },
    {
      icon: Zap,
      title: 'High GCV',
      desc: 'Delivering a consistent, high Gross Calorific Value (GCV) to ensure maximum heat output and thermal efficiency for your boilers.'
    }
  ];

  return (
    <div className="relative bg-[#0F1115] text-white">
      <SEO 
        title="About Us - Ramdev Biocoal Industries" 
        description="Learn more about Ramdev Biocoal Industries. We manufacture high-density 90 mm biomass briquettes exclusively from 100% groundnut husk."
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
            About Ramdev Biocoal Industries
          </motion.h1>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Established in 2022, Ramdev Biocoal Industries is dedicated to manufacturing high-density 90 mm biomass briquettes exclusively from 100% groundnut husk.
          </p>
        </div>
      </section>

      {/* Split Screen Introduction */}
      <section className="py-24 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Editorial Layout */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
                  Company Overview
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.1]">
                  A Reliable Alternative to Fossil Fuels
                </h2>
                <div className="h-[2px] w-16 bg-accent rounded" />
              </div>

              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Ramdev Biocoal Industries was founded with a singular mission: to supply industrial boiler operators with a reliable, standardized alternative to fossil fuels like coal and lignite.
              </p>
              
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                By adhering strictly to a single raw material approach (100% pure groundnut husk), we eliminate batch-to-batch calorific variance, preventing furnace clogging and ensuring uniform thermal performance.
              </p>
              
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Our manufacturing plant features modern screening, moisture management, and high-tonnage hydraulic extrusion presses operating without chemical binders.
              </p>

              {/* Minimal Stat Panel */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-[#181B22] rounded-lg border border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-accent block font-display">2022</span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mt-1">Established</span>
                </div>
                <div className="p-4 bg-[#181B22] rounded-lg border border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-white block font-display">90 mm</span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mt-1">Briquette Size</span>
                </div>
                <div className="p-4 bg-[#181B22] rounded-lg border border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-accent block font-display">100%</span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mt-1">Groundnut Husk</span>
                </div>
              </div>
            </div>

            {/* Right side: Machinery Info Graphic */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-accent/5 rounded-2xl blur-3xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-premium-lg">
                <img loading="lazy" decoding="async" src={machineImg} 
                  alt="Industrial Plant Overview" 
                  className="w-full h-64 sm:h-[450px] object-cover scale-102 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-[#181B22]/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
              Corporate Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              Core Operational Values
            </h2>
            <div className="h-[2px] w-20 bg-accent rounded mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((v) => {
              const Icon = v.icon;
              return (
                <div 
                  key={v.title}
                  className="p-6 rounded-xl bg-[#181B22] border border-white/10 hover:border-accent/15 transition-all duration-300 shadow-premium flex flex-col space-y-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 text-accent flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-display font-bold text-white text-base">{v.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-2xl bg-[#181B22] border border-white/10 relative overflow-hidden group hover:border-accent/30 transition-colors duration-500"
            >
              <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">🎯</div>
              <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans mb-3">Our Mission</span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight font-display mb-6">Industrial Decarbonization</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                To accelerate industrial decarbonization across India by providing affordable, high-efficiency biomass briquettes that seamlessly integrate into existing industrial boiler infrastructure.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-10 rounded-2xl bg-[#181B22] border border-white/10 relative overflow-hidden group hover:border-accent/30 transition-colors duration-500"
            >
              <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">🌍</div>
              <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans mb-3">Our Vision</span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight font-display mb-6">Gujarat's Premier Supplier</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                To become Gujarat's premier industrial biomass supplier recognized for raw material purity, logistics precision, and zero-binder high-density briquetting technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
