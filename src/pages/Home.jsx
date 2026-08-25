import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Cpu, Users, Truck, CheckCircle2,
  Award, Settings, Activity, Zap, ChevronRight, ChevronLeft, Hexagon, Flame
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/imageHelper';
import slide1Img from '../assets/B2.jpg';
import slide2Img from '../assets/Machine1.jpg';
import slide3Img from '../assets/R1.jpg';
import slide4Img from '../assets/B7.jpg';


import vadiImg from '../assets/B4.jpg';
import heroVideo from '../assets/Bio.mp4';
import rawImg from '../assets/RAW.jpg';

const slideConfig = [
  {
    type: 'image',
    image: slide1Img,
    fit: 'object-cover',
    position: 'object-center',
    bg: 'bg-[#181B22]'
  },
  {
    type: 'image',
    image: slide2Img,
    fit: 'object-cover',
    position: 'object-center',
    bg: 'bg-[#181B22]'
  },
  {
    type: 'image',
    image: slide3Img,
    fit: 'object-cover',
    position: 'object-center',
    bg: 'bg-[#181B22]'
  },
  {
    type: 'image',
    image: slide4Img,
    fit: 'object-cover',
    position: 'object-center',
    bg: 'bg-[#181B22]'
  }
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Parallax values for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  // References for GSAP
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const chooseUsRef = useRef(null);

  // States
  const [activeStep, setActiveStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideConfig.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideConfig.length) % slideConfig.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideConfig.length);
  };

  const products = [
    {
      id: 'peanut',
      name: '90mm Biomass Briquettes',
      variety: 'Premium High-Density',
      tagline: '100% pure groundnut husk briquettes engineered for maximum combustion efficiency.',
      image: getImageUrl('peanut')
    },
    {
      id: 'wheat',
      name: 'Eco-Friendly Bio-Coal',
      variety: 'Sustainable Alternative',
      tagline: 'Zero fossil fuels. A clean, renewable energy source that drastically reduces carbon footprint.',
      image: getImageUrl('wheat')
    },
    {
      id: 'kabuli',
      name: 'Industrial Boiler Fuel',
      variety: 'Consistent Calorific Value',
      tagline: 'Standardized size and moisture content ensuring steady and reliable heat for heavy industries.',
      image: getImageUrl('kabuli')
    }
  ];



  // Mouse Move Parallax Handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate values between -0.5 and 0.5
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    mouseX.set(x * 60); // Movement range: 60px
    mouseY.set(y * 60);
  };

  useEffect(() => {
    // GSAP animations for Hero elements
    const ctx = gsap.context(() => {
      // Rotating machine cogs
      gsap.to('.hero-cog-1', {
        rotate: 360,
        repeat: -1,
        duration: 25,
        ease: 'linear'
      });
      gsap.to('.hero-cog-2', {
        rotate: -360,
        repeat: -1,
        duration: 15,
        ease: 'linear'
      });

      // Animated flowchart timeline scroll triggers
      const steps = gsap.utils.toArray('.process-step');
      steps.forEach((step, idx) => {
        gsap.fromTo(step,
          { opacity: 0.1, y: 30 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              end: 'top 55%',
              scrub: true,
              onEnter: () => setActiveStep(idx),
              onEnterBack: () => setActiveStep(idx),
            }
          }
        );
      });

      // Flow line animation
      gsap.fromTo('.flow-progress-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-flow-container',
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: true
          }
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0F1115]" ref={heroRef}>
      <SEO
        title="Home"
        description="Welcome to Ramdev Biocoal Industries, a leading agriculture processing unit in Gujarat. We specialize in high-quality sorting, grading, and packing of peanuts, chana, and tuwar."
      />

      {/* 1. HERO SECTION */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-6 sm:pt-28 sm:pb-8 px-4 sm:px-6 lg:px-8"
        onMouseMove={handleMouseMove}
      >
        {/* Cinematic Industrial Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${getImageUrl('home_hero_bg')})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/85 via-[#0F1115]/50 to-[#0F1115]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0F1115_90%)]" />
        </div>

        {/* Animated Machine Elements (GSAP Cogs) */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.03, 0.25, 0.03] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[8%] text-accent"
          >
            <Flame size={180} className="stroke-[0.6]" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.02, 0.15, 0.02] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[5%] text-gray-400"
          >
            <Flame size={280} className="stroke-[0.4]" />
          </motion.div>

        </motion.div>

        {/* Content & Stats Container */}
        <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center justify-center space-y-6 mt-4 w-full">
          {/* Hero content */}
          <div className="space-y-4 w-full">
            {/* 1. Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent font-sans leading-relaxed">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse mr-2 align-middle shrink-0" />
                Precision Agricultural processing <span className="inline-block w-2 h-2 rounded-full bg-accent mx-2 align-middle shrink-0" /> Gujarat
              </span>
            </motion.div>

            {/* 2. Media Slideshow Banner (Images + Video + Controls) */}
            <div
              className="w-full relative px-2 my-3 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Slides container - locked to cinematic aspect ratio */}
              <div className="w-full aspect-[16/10] sm:aspect-[2/1] md:aspect-[16/7] lg:aspect-[21/9] max-h-[220px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] overflow-hidden rounded-[24px] relative shadow-premium bg-[#181B22]">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={currentSlide}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-500 ${slideConfig[currentSlide].bg}`}
                  >
                    {/* Dynamic ambient blur backdrop ONLY for specific desktop images */}
                    {slideConfig[currentSlide].showBlurOnDesktop && slideConfig[currentSlide].type !== 'video' && (
                      <img loading="lazy" decoding="async" src={slideConfig[currentSlide].image}
                        alt=""
                        className="hidden sm:block absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
                      />
                    )}

                    {/* Render Video or Image */}
                    {slideConfig[currentSlide].type === 'video' ? (
                      <video
                        src={slideConfig[currentSlide].video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`relative z-10 w-full h-full ${slideConfig[currentSlide].fit} ${slideConfig[currentSlide].position}`}
                      />
                    ) : (
                      <img loading="lazy" decoding="async" src={slideConfig[currentSlide].image}
                        alt={`Ramdev slide ${currentSlide}`}
                        className={`relative z-10 w-full h-full ${slideConfig[currentSlide].fit} ${slideConfig[currentSlide].position}`}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>


              </div>
            </div>

            {/* 3. Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-display text-white"
            >
              100% <br className="hidden sm:inline" />
              <span className="text-accent text-gradient">Groundnut Husk Briquettes</span>
            </motion.h1>

            {/* 4. Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-xl mx-auto text-sm sm:text-base text-gray-400 font-light leading-relaxed"
            >
              offering a reliable and efficient renewable fuel solution for industrial heating applications. With a calorific value of approximately 4,000 ± 200 Kcal/kg, our briquettes provide consistent heat output while utilizing agricultural waste as an alternative to conventional fuels.
            </motion.p>

            {/* 5. Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-0"
            >
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-primary font-bold tracking-wide rounded-lg shadow-lg hover:scale-102 transition-all duration-300 font-display flex items-center justify-center space-x-2"
              >
                <span>Get Operations Quote</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-accent hover:bg-white/5 text-white hover:text-accent font-semibold tracking-wide rounded-lg transition-all duration-300 font-display"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Floating statistics cards */}
          <div className="w-full flex flex-wrap items-center justify-center gap-6 md:justify-around max-w-7xl mx-auto pt-6 pb-6 bg-[#181B22]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-premium px-6">
            <div className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-accent block">2022</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold font-sans mt-1 block">Established</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
            <div className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white block">100%</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold font-sans mt-1 block">Groundnut Husk</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
            <div className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-accent block">90 mm</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold font-sans mt-1 block">Briquette Diameter</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
            <div className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white block">~4000 ±200</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold font-sans mt-1 block">Kcal/Kg Calorific Value</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION - Premium Split Screen & Timeline */}
      <section className="py-24 border-t border-white/10 relative bg-[#181B22]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left side: Editorial text & timeline */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
                  Ramdev Biocoal Industries
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-normal font-display leading-tight">
                  100% Pure Groundnut Husk,  &nbsp;We Eliminate Batch-to-Batch Calorific Variance
                </h2>
                <div className="h-[2px] w-20 bg-accent rounded" />
              </div>

              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Established in 2022, Ramdev Biocoal Industries is dedicated to manufacturing high-density 90 mm biomass briquettes exclusively from 100% groundnut husk.
              </p>


            </div>

            {/* Right side: Business Card Display */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="absolute -inset-4 bg-accent/5 rounded-2xl blur-3xl pointer-events-none max-w-md" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-premium-lg bg-[#181B22]/30 p-2 sm:p-4 flex items-center justify-center max-w-md w-full">
                <img loading="lazy" decoding="async" src={getImageUrl('cards_img')}
                  alt="Ramdev Biocoal Industries Business Card"
                  className="w-full h-auto object-contain rounded-xl transition-all duration-300 hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 4. PRODUCTS - Horizontal spotlight and 3D hover effects */}
      <section className="py-24 bg-[#181B22]/30 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
                Our Showcase
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
                Spotlight Products
              </h2>
              <div className="h-[2px] w-20 bg-accent rounded" />
            </div>
            <Link
              to="/products"
              className="px-6 py-3 border border-white/10 hover:border-accent bg-transparent text-white hover:text-primary hover:bg-accent font-semibold text-xs tracking-wider uppercase rounded-lg transition-all duration-300 font-display flex items-center justify-center space-x-2"
            >
              <span>View Product Catalogue</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 3D tilt style product list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group relative h-[420px] rounded-xl overflow-hidden border border-white/10 bg-[#181B22] transform-style-3d hover:scale-[1.02] hover:border-accent/25 transition-all duration-500 shadow-premium"
              >
                {/* Image spotlight */}
                <div className="h-56 overflow-hidden relative">
                  <img loading="lazy" decoding="async" src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#181B22_100%)]" />
                </div>

                {/* Text and Info details */}
                <div className="p-6 flex flex-col justify-between h-[196px]">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-sans block">{prod.variety}</span>
                    <h4 className="font-display font-extrabold text-lg text-white">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-3">
                      {prod.tagline}
                    </p>
                  </div>

                  <Link
                    to={`/products#${prod.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-accent hover:text-white uppercase tracking-wider pt-2 mt-auto transition-colors"
                  >
                    <span>Request Spec Sheet</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 HERITAGE, OPERATIONS & MEMORIAL SHOWCASE ROW */}
      <section className="py-14 sm:py-20 bg-[#0F1115] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <span className="text-accent font-bold tracking-widest text-[10px] sm:text-xs uppercase block font-sans">
              Sustainable Innovation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              The Power of Biomass
            </h2>
            <div className="h-[2px] w-16 sm:w-20 bg-accent rounded" />
          </div>

          {/* 3 Items Grid / Row Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* Item 1: Thakarsibapa ni Vadi */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#181B22] shadow-premium flex flex-col hover:border-accent/30 transition-all duration-300">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-transparent flex items-center justify-center">
                <img loading="lazy" decoding="async" src={vadiImg}
                  alt="ઠાકરશીબાપાની વાડી"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-sans block">Sustainable Fuel</span>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">100% Pure Groundnut Husk</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Sourced directly from our agricultural heritage to create high-density, eco-friendly biomass briquettes.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2: Jay Ramdev Mahadev Video (Full aspect ratio preserved, zero cutoff) */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#181B22] shadow-premium flex flex-col hover:border-accent/30 transition-all duration-300">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-transparent flex items-center justify-center">
                <video
                  src={heroVideo}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-sans block">Industrial Performance</span>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">Consistent Calorific Value</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Engineered for zero batch-to-batch variance, ensuring reliable and continuous heat for industrial boilers.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 3: In Loving Memory Memorial */}
            <div className="group relative rounded-2xl overflow-hidden border border-accent/25 bg-[#181B22] shadow-premium flex flex-col hover:border-accent/60 transition-all duration-300">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-transparent flex items-center justify-center">
                <img loading="lazy" decoding="async" src={rawImg}
                  alt="Raw Groundnut Husk"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-sans block">Eco-Friendly Energy</span>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white">Zero Fossil Fuels</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    A renewable, green alternative to coal and lignite that drastically reduces carbon emissions and ash waste.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US - Machine Infographic */}
      <section className="py-24 bg-[#0F1115] border-t border-white/10" ref={chooseUsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Col: Info panel */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
                Engineered for Industrial Energy
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-tight">
                High-Performance Biomass Production
              </h2>
              <div className="h-[2px] w-20 bg-accent rounded" />
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                We utilize advanced hydraulic press technologies and strict moisture control systems to produce dense, high-calorific briquettes that maximize industrial boiler efficiency.
              </p>

              <div className="p-5 bg-[#181B22] rounded-xl border border-white/10 flex items-start space-x-4">
                <Award size={24} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-white text-sm">Strict Quality Operations</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-normal">
                    We maintain rigorous density testing, strict moisture locks, and continuous ash-content monitoring to guarantee premium grade bio-coal.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Machine Style Animated Infographic */}
            <div className="lg:col-span-7 relative bg-[#181B22]/20 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-premium overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

              {/* Infographic Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Consistent Density Guarantee',
                    desc: 'Every batch is heavily compacted to ensure long burn times and consistent 90mm sizing.'
                  },
                  {
                    icon: Cpu,
                    title: 'Advanced Hydraulic Presses',
                    desc: 'Heavy-duty machinery operating at maximum pressure to forge solid briquettes.'
                  },
                  {
                    icon: Users,
                    title: 'Experienced Operators',
                    desc: 'Expert technical staff managing pressure gauges and daily production yields.'
                  },
                  {
                    icon: Truck,
                    title: 'High-Volume Dispatch',
                    desc: 'Direct loading zones and massive storage yards at our Sondarda base for rapid bulk delivery.'
                  }
                ].map((item, idx) => (
                  <div
                    key={item.title}
                    className="p-6 rounded-xl border border-white/10 bg-[#181B22]/50 hover:border-accent/35 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-accent mb-4">
                      <item.icon size={20} className="stroke-[1.5]" />
                    </div>
                    <h4 className="font-display font-bold text-white text-base mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Thermal & Proximate Analysis Section */}
      <section className="py-16 bg-[#0F1115]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#181B22] rounded-2xl p-6 sm:p-8 shadow-premium border border-white/10">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
              Thermal & Proximate Analysis
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Calorific Value (Gross)', value: '~4000 kcal/kg (±200)' },
                { label: 'Ash Content', value: '8% (±2%)' },
                { label: 'Moisture Content', value: '10% (±2%)' },
                { label: 'Volatile Matter', value: '65–70%' },
                { label: 'Combustion Efficiency', value: 'High & Sustained Flame' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0F1115] shadow-sm hover:border-white/20 transition-colors">
                  <span className="text-gray-400 font-medium text-sm sm:text-base">{item.label}</span>
                  <span className="text-white font-bold text-sm sm:text-base tracking-wide">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 6. COMPANY PROCESS Horizontal Flowchart animated using GSAP */}
      <section className="py-28 bg-[#181B22]/20 border-t border-white/10 process-flow-container" ref={processRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="text-accent font-bold tracking-widest text-xs uppercase block font-sans">
              Flowchart Lifecycle
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              The Production Journey
            </h2>
            <div className="h-[2px] w-20 bg-accent rounded mx-auto" />
            <p className="text-gray-400 font-light text-sm max-w-md mx-auto">
              Follow the material step from raw intakes down to dispatch logistics.
            </p>
          </div>

          {/* GSAP Progress Line for Desktop */}
          <div className="relative pt-8 pb-12 hidden lg:block">
            {/* Background line */}
            <div className="absolute top-[52px] left-0 right-0 h-[2px] bg-white/5 z-0" />
            {/* Animating progress line */}
            <div className="absolute top-[52px] left-0 right-0 h-[2px] bg-accent origin-left z-0 scale-x-0 flow-progress-line" />

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {[
                { title: 'Raw Material', desc: 'Groundnut husk and other agricultural biomass collected as sustainable fuel material.' },
                { title: 'Drying & Grinding', desc: 'Raw biomass is dried and processed through machines to achieve the required moisture and particle size.' },
                { title: 'Quality Test', desc: 'Briquettes are tested for calorific value, moisture, density, and overall quality.' },
                { title: 'Storage & Packaging', desc: 'Finished biomass briquettes are safely stored and packed to maintain quality and ensure easy handling.' },
                { title: 'Ready for Industrial Heating', desc: 'High-quality biomass briquettes are ready to deliver reliable heat for industrial boilers, furnaces, and heating applications.' }
              ].map((step, idx) => {
                const isActive = activeStep >= idx;
                return (
                  <div key={step.title} className="text-center space-y-4 process-step">
                    <div className="flex justify-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-xs transition-all duration-500 border ${isActive
                        ? 'bg-accent border-accent text-primary scale-110 shadow-premium'
                        : 'bg-[#181B22] border-white/10 text-gray-500'
                        }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="space-y-1 px-2">
                      <h4 className={`font-display font-bold text-xs transition-colors duration-300 ${isActive ? 'text-accent' : 'text-white'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed max-w-[160px] mx-auto font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical layout for Mobile */}
          <div className="space-y-8 lg:hidden">
            {[
              { num: '01', title: 'Raw Material', desc: 'Groundnut husk and other agricultural biomass collected as sustainable fuel material.' },
              { num: '02', title: 'Drying & Grinding', desc: 'Raw biomass is dried and processed through machines to achieve the required moisture and particle size.' },
              { num: '03', title: 'Quality Test', desc: 'Briquettes are tested for calorific value, moisture, density, and overall quality.' },
              { num: '04', title: 'Storage & Packaging', desc: 'Finished biomass briquettes are safely stored and packed to maintain quality and ensure easy handling.' },
              { num: '05', title: 'Ready for Industrial Heating', desc: 'High-quality biomass briquettes are ready to deliver reliable heat for industrial boilers, furnaces, and heating applications.' }
            ].map((step, idx) => (
              <div
                key={step.title}
                className="flex items-start space-x-4 p-5 rounded-xl border border-white/10 bg-[#181B22]/40"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center font-display font-bold text-accent shrink-0">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-normal font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* 8. PRE-FOOTER CTA SECTION */}
      <section className="bg-[#181B22] text-white py-24 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            Ready to Calibrate Your Consignment?
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
            Get in touch with our operations desk to schedule grading runs, request processing quotes, or plan a factory inspection at Sondarda.
          </p>
          <div className="pt-6">
            <Link
              to="/contact"
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-primary font-bold tracking-wide rounded-lg shadow-lg hover:scale-102 transition-all duration-300 inline-flex items-center space-x-2 font-display cursor-pointer"
            >
              <span>Contact Us &amp; Get Quote</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
