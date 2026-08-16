import { motion } from 'framer-motion';
import { Cog } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1115] text-white"
    >
      <div className="flex flex-col items-center max-w-xs text-center space-y-2">
        {/* Animated Sieve/Cog Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-accent"
        >
          <img src={logoImg} alt="Loading Logo" className="w-40 h-40 -mb-4 object-contain" />
        </motion.div>

        {/* Company Branding */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-extrabold tracking-wider font-display text-white text-center"
          >
            RAMDEV
            <span className="text-accent block text-sm tracking-[0.25em] font-semibold mt-1 font-sans text-center">
              BIOCOAL INDUSTRIES
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="h-[1px] w-full bg-accent/30 origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-[10px] text-gray-400 font-medium uppercase tracking-widest font-sans"
          >
            Precision. Quality. Reliability.
          </motion.p>
        </div>

        {/* Progress Bar Loader */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            animate={{
              left: ['-100%', '100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-1/3 bg-accent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
