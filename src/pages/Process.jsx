import { motion } from 'framer-motion';
import { CheckCircle2, FileSpreadsheet, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import r1Img from '../assets/R1.jpg';
import machineImg from '../assets/Machine.jpg';
import b4Img from '../assets/B4.jpg';
import cargoVideo from '../assets/Cargo.mp4';
import biocoalVideo from '../assets/Biocoal.mp4';

export default function Process() {
  const processSteps = [
    {
      id: 'raw-material',
      name: 'Raw Material',
      variety: '100% Pure Groundnut Husk',
      image: r1Img,
      description: 'We source high-quality groundnut husk directly from trusted agricultural partners. The raw material undergoes strict screening to remove stones, dust, and metal impurities, while moisture levels are closely monitored before processing.',
      features: [
        'Sourcing: Direct procurement from reliable partners.',
        'Screening: Removal of stones, dust, and metal.',
        'Moisture Control: Maintained at optimal levels for extrusion.',
        'Purity: Ensuring 100% groundnut husk with no mixing.'
      ],
      specs: [
        { name: 'Material', value: 'Groundnut Husk' },
        { name: 'Purity', value: '99% Cleaned' },
        { name: 'Input Moisture', value: '~10%' },
        { name: 'Preparation', value: 'Screened & Filtered' }
      ]
    },
    {
      id: 'machine',
      name: 'Machine Processing',
      variety: 'Binder-less Extrusion',
      image: machineImg,
      description: 'The cleaned groundnut husk is fed into heavy-duty hydraulic extrusion presses. Extreme pressure compacts the biomass into dense briquettes without the need for any chemical binders, utilizing the natural lignin in the husk.',
      features: [
        'Technology: High-pressure hydraulic extrusion presses.',
        'Binders: 100% chemical-free and natural compaction.',
        'Continuous Operation: 24/7 manufacturing capabilities.',
        'Efficiency: High output with consistent density.'
      ],
      specs: [
        { name: 'Pressure', value: 'High-Tonnage Hydraulic' },
        { name: 'Binding', value: 'Natural Lignin Release' },
        { name: 'Production', value: 'Continuous Extrusion' },
        { name: 'Chemicals', value: '0% Added' }
      ]
    },
    {
      id: 'product',
      name: 'Final Product',
      variety: '90mm Biomass Briquettes',
      image: b4Img,
      description: 'Freshly extruded briquettes emerge at high temperatures. They are transferred to specialized cooling tracks to allow the natural lignin to set, resulting in extremely dense, durable, and uniform 90mm biomass briquettes ready for combustion.',
      features: [
        'Density: High structural integrity prevents breakage.',
        'Cooling: Gradual room-temperature settling tracks.',
        'Shape: Uniform 90mm cylindrical briquettes.',
        'Combustion: Sustained high flame for industrial boilers.'
      ],
      specs: [
        { name: 'Diameter', value: '90 mm' },
        { name: 'Calorific Value', value: '~4000 kcal/kg' },
        { name: 'Ash Content', value: '8% (±2%)' },
        { name: 'Moisture', value: '10% (±2%)' }
      ]
    },
    {
      id: 'packing',
      name: 'Packing & Dispatch',
      variety: 'Customized Bulk Logistics',
      video: cargoVideo,
      description: 'After passing strict quality and density checks, the cooled briquettes are loaded into bulk transport vehicles or packed into customized bags based on industrial client requirements for immediate and safe dispatch.',
      features: [
        'Quality Control: Final density and integrity check.',
        'Logistics: Coordinated transport to industrial plants.',
        'Packaging: Bulk loose loading or bagged as needed.',
        'Delivery: Timely dispatch for continuous boiler operations.'
      ],
      specs: [
        { name: 'Dispatch Type', value: 'Bulk / Bagged' },
        { name: 'Transport', value: 'Industrial Trucks' },
        { name: 'Availability', value: 'Ready for Shipping' },
        { name: 'Handling', value: 'Damage-free Loading' }
      ]
    },
    {
      id: 'manufacturing-video',
      name: 'Manufacturing Showcase',
      variety: 'Live Factory Operations',
      video: biocoalVideo,
      description: 'Watch our heavy-duty hydraulic extrusion machines in action as they continuously process pure groundnut husk into high-density 90mm biomass briquettes.',
      features: [
        'Live Operations: Real-time look at our manufacturing line.',
        'High Output: Continuous extrusion capabilities.',
        'Quality Assurance: Visual proof of our binder-less technology.',
        'Efficiency: Seamless transition from raw material to product.'
      ],
      specs: [
        { name: 'Video Type', value: 'Live Showcase' },
        { name: 'Machine', value: 'Hydraulic Press' },
        { name: 'Product', value: '90mm Briquettes' },
        { name: 'Operation', value: 'Continuous Flow' }
      ]
    }
  ];

  return (
    <div className="relative bg-[#0F1115] text-white">
      <SEO 
        title="Manufacturing Process" 
        description="Explore the step-by-step manufacturing process of our 90mm biomass briquettes."
      />

      {/* Page Header Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${machineImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/50 to-[#0F1115]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white"
          >
            How We Process
          </motion.h1>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
            From raw groundnut husk to high-density fuel. Discover our binder-less, sustainable manufacturing process.
          </p>
        </div>
      </section>

      {/* Process Grid Section */}
      <section className="py-24 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-20">
            
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={step.id}
                  id={step.id}
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
                    <div className="h-80 rounded-xl overflow-hidden shadow-premium relative group border border-white/10 bg-black">
                      {step.video ? (
                        <video 
                          src={step.video} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          autoPlay 
                          muted 
                          loop 
                          playsInline 
                        />
                      ) : (
                        <img 
                          src={step.image} 
                          alt={step.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/85 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Variety Tag */}
                    <div className="p-4 bg-[#181B22] border border-white/10 rounded-lg flex items-center justify-between shadow-premium">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 block">Process Stage</span>
                        <span className="font-display font-bold text-sm text-accent">{step.variety}</span>
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
                      {step.name}
                    </h2>
                    <div className="h-[2px] w-14 bg-accent rounded" />
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      {step.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Features */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center">
                          <CheckCircle2 size={16} className="text-accent mr-2" />
                          <span>Key Highlights</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {step.features.map((feature, fIdx) => {
                            const [title, desc] = feature.split(':');
                            return (
                              <li key={fIdx} className="text-xs text-gray-400 leading-normal font-light">
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
                          <span>Process Specifications</span>
                        </h4>
                        <div className="border border-white/10 rounded-lg overflow-hidden shadow-premium">
                          <table className="min-w-full divide-y divide-white/5 text-xs">
                            <tbody className="bg-[#181B22]/50 divide-y divide-white/5">
                              {step.specs.map((spec) => (
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

                  </motion.div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

    </div>
  );
}
