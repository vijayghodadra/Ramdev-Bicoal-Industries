import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function Gallery() {
  const [filter, setFilter] = useState('factory');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const DEFAULT_GALLERY = [
      {
        title: 'Advanced CCD Color Sorters',
        category: 'machinery',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Peanut Size-Grading Decks',
        category: 'machinery',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Sondarda Processing Plant Entrance',
        category: 'factory',
        image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Double-Sorted Peanut Batch',
        category: 'products',
        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Automated Packing Stations',
        category: 'packing',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Finished Inventory Warehouse Silos',
        category: 'warehouse',
        image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop'
      }
    ];

    const fetchGallery = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('ramdev_gallery')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            setGalleryItems(data);
          } else {
            // Check if seeded before in database
            const isSeeded = localStorage.getItem('ramdev_gallery_seeded') === 'true';
            if (!isSeeded) {
              const seedData = DEFAULT_GALLERY.map(item => ({
                title: item.title,
                category: item.category,
                image: item.image,
                created_at: new Date().toISOString()
              }));
              const { data: insertedData, error: seedError } = await supabase
                .from('ramdev_gallery')
                .insert(seedData)
                .select();
              
              if (!seedError) {
                localStorage.setItem('ramdev_gallery_seeded', 'true');
                setGalleryItems(insertedData || []);
              } else {
                console.error('Error seeding gallery to Supabase:', seedError);
                setGalleryItems([]);
              }
            } else {
              setGalleryItems([]);
            }
          }
        } catch (err) {
          console.error('Error fetching gallery from Supabase:', err);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('ramdev_gallery_items');
      if (stored) {
        setGalleryItems(JSON.parse(stored));
      } else {
        localStorage.setItem('ramdev_gallery_items', JSON.stringify(DEFAULT_GALLERY));
        setGalleryItems(DEFAULT_GALLERY);
      }
    };

    fetchGallery();
  }, []);

  const categories = [
    { id: 'factory', label: 'Factory' },
    { id: 'machinery', label: 'Machinery' },
    { id: 'products', label: 'Products' },
    { id: 'packing', label: 'Packing' },
    { id: 'warehouse', label: 'Warehouse' }
  ];

  const filteredItems = galleryItems.filter(item => item.category === filter);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleNext = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative bg-[#0F1115] text-white min-h-screen">
      <SEO 
        title="Media Gallery" 
        description="Browse photos of our color sorters, grading sieves, peanuts processing plant, warehouse inventory, and packaging systems in Gujarat."
      />

      {/* Page Header Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/50 to-[#0F1115]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white"
          >
            Facility Gallery
          </motion.h1>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
            Visual tour of our processing floors, color sorters, and warehouse logistics.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="bg-[#181B22]/60 backdrop-blur-md border-b border-white/10 py-6 sticky top-20 z-30 shadow-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start lg:justify-center overflow-x-auto space-x-3 pb-3 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id);
                  setLightboxIndex(null);
                }}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  filter === cat.id
                    ? 'bg-accent text-primary border-accent shadow-premium'
                    : 'bg-[#181B22] text-gray-400 border-white/10 hover:border-accent/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery Grid */}
      <section className="py-16 bg-[#0F1115] min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.title}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-xl overflow-hidden shadow-premium cursor-pointer border border-white/10 bg-[#181B22] h-72"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0F1115]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <div className="w-9 h-9 rounded-lg bg-accent/20 text-accent flex items-center justify-center border border-accent/20">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                    <div className="text-white space-y-1">
                      <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-sans">
                        {item.category}
                      </span>
                      <h4 className="font-display font-bold text-base">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm font-light">
              No photos found in this category.
            </div>
          )}

        </div>
      </section>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F1115]/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Header controls */}
            <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  {filteredItems[lightboxIndex].title}
                </h4>
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest font-sans block mt-1">
                  {filteredItems[lightboxIndex].category}
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-[10px] text-gray-400 font-sans tracking-wider uppercase font-bold">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer border border-white/10"
                  aria-label="Close Lightbox"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Center Image */}
            <div className="relative flex-grow flex items-center justify-center p-4">
              
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-6 z-10 p-3 bg-[#181B22] border border-white/10 hover:border-accent/40 rounded-full text-white transition-colors cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={20} />
              </button>

              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[70vh] max-w-full md:max-w-4xl object-contain rounded shadow-premium border border-white/10"
              />

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-6 z-10 p-3 bg-[#181B22] border border-white/10 hover:border-accent/40 rounded-full text-white transition-colors cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight size={20} />
              </button>

            </div>

            {/* Bottom info footer */}
            <div className="p-6 text-center text-[10px] uppercase tracking-widest text-gray-500 font-bold font-sans border-t border-white/10">
              <span>Use Left/Right arrow keys to navigate, Esc to close.</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

