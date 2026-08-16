import { motion } from 'framer-motion';
import { CheckCircle2, FileSpreadsheet, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import rawImg from '../assets/RAW.jpg';

export default function Products() {
  const products = [
    {
      id: 'briquettes',
      name: '90mm Groundnut Biomass Briquettes',
      variety: '100% Pure Groundnut Husk',
      image: rawImg,
      description: 'Manufactured exclusively from 100% pure groundnut husk, our high-density 90mm biomass briquettes provide a reliable, standardized alternative to fossil fuels like coal and lignite. By adhering strictly to a single raw material approach, we eliminate batch-to-batch calorific variance, preventing furnace clogging and ensuring uniform thermal performance.',
      applications: [
        'Industrial Boilers: Provides sustained high flame for continuous thermal operations.',
        'Textile & Chemical Mills: Reliable, consistent heat output without temperature drops.',
        'Eco-Friendly Fuel Switch: Drastically reduces carbon emissions compared to fossil fuels.',
        'Ash Management: Low ash content (8%) ensures minimal waste disposal efforts.'
      ],
      specifications: [
        { name: 'Calorific Value', value: '~4000 kcal/kg (±200)' },
        { name: 'Ash Content', value: '8% (±2%)' },
        { name: 'Moisture Content', value: '10% (±2%)' },
        { name: 'Volatile Matter', value: '65–70%' },
        { name: 'Combustion Efficiency', value: 'High & Sustained Flame' },
        { name: 'Briquette Size', value: '90 mm Diameter' }
      ]
    }
  ];

  return (
    <div className="relative bg-[#0F1115] text-white">
      <SEO 
        title="Our Products" 
        description="View our 90mm biomass briquettes manufactured exclusively from 100% groundnut husk. Providing a clean, renewable alternative to coal for industrial boilers."
      />

      {/* Page Header Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${rawImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/50 to-[#0F1115]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white"
          >
            Processed Products
          </motion.h1>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
            Providing export-quality 90mm groundnut husk biomass briquettes to industrial plants and boiler operators.
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-24 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-20">
            
            {products.map((product, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={product.id}
                  id={product.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-28 ${
                    idx > 0 ? 'border-t border-white/10 pt-20' : ''
                  }`}
                >
                  {/* Column 1: Image & Variety Label */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`lg:col-span-5 space-y-4 ${!isEven ? 'lg:order-last' : ''}`}
                  >
                    <div className="h-80 rounded-xl overflow-hidden shadow-premium relative group border border-white/10">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/85 via-transparent to-transparent" />
                    </div>
                    
                    {/* Variety Tag */}
                    <div className="p-4 bg-[#181B22] border border-white/10 rounded-lg flex items-center justify-between shadow-premium">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 block">Variety Types</span>
                        <span className="font-display font-bold text-sm text-accent">{product.variety}</span>
                      </div>
                      <Layers size={18} className="text-accent" />
                    </div>
                  </motion.div>

                  {/* Column 2: Details & Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-7 space-y-6"
                  >
                    <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                      {product.name}
                    </h2>
                    <div className="h-[2px] w-14 bg-accent rounded" />
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Applications */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center">
                          <CheckCircle2 size={16} className="text-accent mr-2" />
                          <span>Industrial Applications</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {product.applications.map((app, appIdx) => {
                            const [title, desc] = app.split(':');
                            return (
                              <li key={appIdx} className="text-xs text-gray-400 leading-normal font-light">
                                <span className="font-semibold text-accent">{title}:</span>
                                <span>{desc}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Technical Specs Table */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center">
                          <FileSpreadsheet size={16} className="text-accent mr-2" />
                          <span>Technical Specifications</span>
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden shadow-premium">
                          <table className="min-w-full divide-y divide-white/5 text-xs">
                            <tbody className="bg-[#181B22]/50 divide-y divide-white/5">
                              {product.specifications.map((spec) => (
                                <tr key={spec.name} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-2 font-semibold text-accent bg-[#181B22] w-1/3 border-r border-white/10 font-sans">
                                    {spec.name}
                                  </td>
                                  <td className="px-4 py-2 text-gray-400 font-light">
                                    {spec.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Button */}
                    <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
                      <Link
                        to="/contact"
                        state={{ defaultProduct: product.name }}
                        className="inline-flex items-center space-x-2 text-sm font-bold text-accent hover:text-white group transition-colors uppercase tracking-wider"
                      >
                        <span>Request Pricing Info</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* Quality Commitment Section */}
      <section className="bg-[#181B22] py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="font-display font-extrabold text-3xl text-white">Need Customized Bulk Shipments?</h3>
          <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto">
            We support multiple loading types, transport logistics, and weight volumes to meet your distribution parameters. Get in touch with our factory operations desk today.
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-primary font-bold text-sm tracking-wide rounded-lg shadow-lg hover:scale-102 transition-all duration-300 font-display cursor-pointer inline-flex items-center space-x-2"
            >
              <span>Contact Operations Desk</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
