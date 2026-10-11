import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface BusLoadingScreenProps {
  onComplete: () => void;
}

export const BusLoadingScreen: React.FC<BusLoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'entering' | 'stopped' | 'departing' | 'complete'>('entering');
  const [isBraking, setIsBraking] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect accessibility prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setPhase('stopped');
    }
  }, []);

  // Entrance sequence timing
  useEffect(() => {
    if (reducedMotion) return;

    // Trigger braking dip right before reaching center (at ~1.6s)
    const brakeTimer = setTimeout(() => {
      setIsBraking(true);
    }, 1600);

    // Complete entrance and bring bus to full stop at ~2.1s
    const stopTimer = setTimeout(() => {
      setIsBraking(false);
      setPhase('stopped');
    }, 2100);

    return () => {
      clearTimeout(brakeTimer);
      clearTimeout(stopTimer);
    };
  }, [reducedMotion]);

  // Handle CTA Click: Bus drives away to the left
  const handleStartJourney = () => {
    if (phase !== 'stopped') return;

    setIsAccelerating(true);
    setPhase('departing');

    // After bus accelerates offscreen left (~1.2s), finish transition
    setTimeout(() => {
      setPhase('complete');
      setTimeout(() => {
        onComplete();
      }, 400); // smooth background fade-out duration
    }, 1200);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'stopped') {
        e.preventDefault();
        handleStartJourney();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setPhase('complete');
        setTimeout(onComplete, 300);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  if (phase === 'complete') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[10000] bg-[#070A0F] text-[#F4F7FC] flex flex-col justify-between overflow-hidden select-none"
      >
        {/* Sky / Top Gradient Background with Subtle Stars/Grid & Clouds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091322] via-[#070D18] to-[#04060A] pointer-events-none">
          {/* Subtle Cyber-Grid Glow */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3185FF_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Glowing Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#3185FF]/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-[#55B5FF]/5 blur-[90px] rounded-full pointer-events-none" />

          {/* Animated Background Clouds */}
          <div className="absolute top-12 left-0 right-0 overflow-hidden h-32 opacity-25">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
              className="flex space-x-24 w-[200%]"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex space-x-16 items-center">
                  <div className="w-32 h-8 bg-gradient-to-r from-transparent via-[#20344E] to-transparent rounded-full blur-sm" />
                  <div className="w-48 h-12 bg-gradient-to-r from-transparent via-[#18293E] to-transparent rounded-full blur-md" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Distant City Skyline Silhouettes */}
          <div className="absolute bottom-28 left-0 right-0 h-24 flex items-end justify-around opacity-20 pointer-events-none">
            <div className="w-16 h-20 bg-[#16253B] rounded-t-sm" />
            <div className="w-24 h-28 bg-[#1B2F4A] rounded-t-md" />
            <div className="w-12 h-16 bg-[#132033] rounded-t-sm" />
            <div className="w-20 h-24 bg-[#182B44] rounded-t-sm" />
            <div className="w-28 h-32 bg-[#1C314E] rounded-t-md" />
            <div className="w-14 h-18 bg-[#111C2D] rounded-t-sm" />
          </div>
        </div>

        {/* Top Bar: Brand & Skip Button */}
        <div className="relative z-20 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3185FF] to-[#55B5FF] flex items-center justify-center shadow-lg shadow-[#3185FF]/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-[#F4F7FC] flex items-center space-x-1.5">
                <span>TRANSIT</span>
                <span className="text-[#55B5FF] text-xs font-normal">INDIA</span>
              </div>
              <div className="text-[10px] text-[#8C9AAF] tracking-widest uppercase font-mono">
                Live Telemetry Platform
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPhase('complete');
              setTimeout(onComplete, 200);
            }}
            className="text-xs text-[#8C9AAF] hover:text-[#F4F7FC] px-3 py-1.5 rounded-lg border border-[#202C3B] hover:border-[#3185FF]/40 bg-[#0B111B]/60 transition-all font-medium backdrop-blur-sm"
          >
            Skip Intro ↵
          </button>
        </div>

        {/* Center Content: Headline, Subtitle & CTA Button */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 text-center max-w-2xl mx-auto -mt-10">
          <AnimatePresence>
            {phase === 'stopped' && (
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Status Pill */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#101925]/90 border border-[#3185FF]/40 text-[#55B5FF] text-xs font-medium shadow-xl shadow-[#3185FF]/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                  </span>
                  <span>All-India Intercity Express Network Ready</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F4F7FC] leading-tight">
                  Your next journey <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-[#55B5FF] via-[#3185FF] to-[#80C4FF] bg-clip-text text-transparent">
                    starts here.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#8C9AAF] max-w-md mx-auto font-normal leading-relaxed">
                  Find your bus. Choose your destination. Get moving with real-time GPS telemetry across 16 states.
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 12px 30px -5px rgba(49, 133, 255, 0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartJourney}
                    disabled={phase !== 'stopped'}
                    className="relative group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3185FF] via-[#2563EB] to-[#1D4ED8] text-white font-semibold text-base shadow-xl shadow-[#3185FF]/30 border border-[#55B5FF]/40 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Glowing highlight animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    
                    <span>Look for Buses</span>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                <div className="text-[11px] text-[#5A687D] flex items-center justify-center space-x-2 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Press <kbd className="px-1.5 py-0.5 bg-[#101925] border border-[#202C3B] rounded text-[#8C9AAF] font-mono text-[10px]">Enter</kbd> to launch</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Section: Road & Animated Bus */}
        <div className="relative z-10 w-full h-44 sm:h-52 flex flex-col justify-end">
          
          {/* Animated 2D Bus Position Container */}
          <motion.div
            initial={{ x: reducedMotion ? '0%' : '100vw', y: 0 }}
            animate={{
              x: phase === 'entering' ? '0vw' : phase === 'stopped' ? '0vw' : '-110vw',
              y: isBraking ? 4 : isAccelerating ? -2 : [0, -1.5, 0],
              rotate: isBraking ? -1.8 : isAccelerating ? 1.2 : 0,
            }}
            transition={
              phase === 'entering'
                ? { duration: 2.1, ease: [0.16, 1, 0.3, 1] }
                : phase === 'stopped'
                ? { y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }
                : { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
            }
            className="absolute bottom-11 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          >
            {/* Bus SVG Component */}
            <div className="relative w-[280px] sm:w-[360px] h-auto drop-shadow-2xl">
              
              {/* Headlight Beam Cone (Facing LEFT / Driving Left) */}
              <div className="absolute top-[38%] left-[-110px] sm:left-[-140px] w-[130px] sm:w-[160px] h-[45px] sm:h-[55px] bg-gradient-to-l from-[#55B5FF]/40 via-[#3185FF]/15 to-transparent clip-triangle pointer-events-none blur-sm transform -rotate-3" />

              {/* Red Braking Tail Light Glow (Facing RIGHT / Back of Bus) */}
              <div
                className={`absolute top-[45%] right-[-10px] w-5 h-8 rounded-full bg-[#EF4444] blur-md transition-opacity duration-200 ${
                  isBraking ? 'opacity-100 scale-125' : 'opacity-40'
                }`}
              />

              {/* Main SVG Bus Illustration */}
              <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="busBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="40%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  
                  <linearGradient id="busAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#55B5FF" />
                    <stop offset="50%" stopColor="#3185FF" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>

                  <linearGradient id="windowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5" />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Roof AC Pod / Vents */}
                <path d="M110 25 H290 V32 H110 Z" fill="#334155" rx="3" />
                <rect x="130" y="27" width="30" height="3" fill="#64748B" rx="1" />
                <rect x="170" y="27" width="30" height="3" fill="#64748B" rx="1" />
                <rect x="210" y="27" width="30" height="3" fill="#64748B" rx="1" />

                {/* Main Coach Body Shape (Front is on the LEFT - X: 20, Rear is on RIGHT - X: 370) */}
                <path
                  d="M 35 130 
                     L 25 105 
                     C 20 80, 25 50, 45 40 
                     C 55 35, 75 32, 100 32 
                     L 360 32 
                     C 372 32, 380 40, 380 52 
                     L 380 130 
                     Z"
                  fill="url(#busBody)"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Sleek Aerodynamic Side Stripe */}
                <path d="M 28 92 Q 80 88, 380 88 L 380 98 Q 80 98, 30 102 Z" fill="url(#busAccent)" />

                {/* Front Windshield (Left Side) */}
                <path
                  d="M 32 100 L 26 78 C 24 60, 35 44, 52 40 L 95 40 L 95 100 Z"
                  fill="url(#windowGlass)"
                  stroke="#0284C7"
                  strokeWidth="1.5"
                />
                
                {/* Windshield Reflection Streak */}
                <path d="M 40 45 L 85 45 L 75 90 L 35 90 Z" fill="white" fillOpacity="0.12" />

                {/* Driver Cockpit Silhouette */}
                <circle cx="65" cy="72" r="7" fill="#0F172A" />
                <path d="M 55 88 Q 65 78, 75 88 Z" fill="#0F172A" />

                {/* Passenger Windows (Side Glass Panel) */}
                <g fill="url(#windowGlass)" stroke="#1E293B" strokeWidth="1.5">
                  <rect x="105" y="40" width="45" height="35" rx="3" />
                  <rect x="155" y="40" width="45" height="35" rx="3" />
                  <rect x="205" y="40" width="45" height="35" rx="3" />
                  <rect x="255" y="40" width="45" height="35" rx="3" />
                  <rect x="305" y="40" width="60" height="35" rx="3" />
                </g>

                {/* Window Passenger Ambient Light Silhouettes */}
                <circle cx="128" cy="55" r="4" fill="#F59E0B" fillOpacity="0.4" />
                <circle cx="178" cy="55" r="4" fill="#F59E0B" fillOpacity="0.4" />
                <circle cx="228" cy="55" r="4" fill="#F59E0B" fillOpacity="0.4" />

                {/* Destination Marquee Board (Front Top LED) */}
                <rect x="42" y="42" width="48" height="9" rx="2" fill="#090D14" stroke="#3185FF" strokeWidth="0.8" />
                <text x="45" y="48.5" fill="#55B5FF" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  EXPRESS
                </text>

                {/* Front Dual LED Headlight (Left edge) */}
                <rect x="20" y="105" width="10" height="14" rx="3" fill="#F8FAFC" filter="url(#glow)" />
                <rect x="22" y="107" width="6" height="10" rx="2" fill="#38BDF8" />

                {/* Rear Tail Light (Right edge) */}
                <rect x="374" y="102" width="6" height="20" rx="2" fill={isBraking ? "#EF4444" : "#991B1B"} filter="url(#glow)" />

                {/* Wheel Arches / Cutouts */}
                <path d="M 80 130 A 24 24 0 0 1 128 130 Z" fill="#070A0F" />
                <path d="M 280 130 A 24 24 0 0 1 328 130 Z" fill="#070A0F" />

                {/* Front Wheel Assembly (At X: 104) */}
                <g transform="translate(104, 130)">
                  {/* Tire */}
                  <circle cx="0" cy="0" r="21" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                  {/* Rim */}
                  <circle cx="0" cy="0" r="13" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
                  {/* Rotating Spokes (Counter-clockwise rotation when driving left) */}
                  <motion.g
                    animate={{
                      rotate: phase === 'stopped' ? 0 : phase === 'entering' ? [-360, 0] : [-1080, 0]
                    }}
                    transition={{
                      repeat: phase === 'stopped' ? 0 : Infinity,
                      duration: phase === 'entering' ? 0.7 : 0.25,
                      ease: 'linear'
                    }}
                  >
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#F8FAFC" strokeWidth="2" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke="#F8FAFC" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#38BDF8" />
                  </motion.g>
                </g>

                {/* Rear Wheel Assembly (At X: 304) */}
                <g transform="translate(304, 130)">
                  {/* Tire */}
                  <circle cx="0" cy="0" r="21" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                  {/* Rim */}
                  <circle cx="0" cy="0" r="13" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
                  {/* Rotating Spokes */}
                  <motion.g
                    animate={{
                      rotate: phase === 'stopped' ? 0 : phase === 'entering' ? [-360, 0] : [-1080, 0]
                    }}
                    transition={{
                      repeat: phase === 'stopped' ? 0 : Infinity,
                      duration: phase === 'entering' ? 0.7 : 0.25,
                      ease: 'linear'
                    }}
                  >
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#F8FAFC" strokeWidth="2" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke="#F8FAFC" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#38BDF8" />
                  </motion.g>
                </g>

                {/* Lower Bumper & Exhaust */}
                <rect x="20" y="124" width="360" height="6" fill="#1E293B" rx="2" />
              </svg>

              {/* Dynamic Ground Contact Shadow beneath bus */}
              <motion.div
                animate={{
                  scaleX: isBraking ? 1.1 : isAccelerating ? 0.9 : 1,
                  opacity: isBraking ? 0.9 : 0.75,
                }}
                className="w-full h-4 bg-black/80 blur-md rounded-full -mt-2 mx-auto"
              />
            </div>
          </motion.div>

          {/* Road Infrastructure */}
          <div className="relative w-full h-16 sm:h-20 bg-gradient-to-b from-[#101925] via-[#0C131D] to-[#070A0F] border-t-2 border-[#202C3B] shadow-2xl flex flex-col justify-center">
            
            {/* Upper Curb Light Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3185FF]/20 via-[#55B5FF]/60 to-[#3185FF]/20" />

            {/* Sliding Dashed Road Lane Markings */}
            <div className="w-full h-2 overflow-hidden relative">
              <motion.div
                animate={{
                  x: phase === 'stopped' ? ['0px', '0px'] : ['0px', '80px'],
                }}
                transition={{
                  repeat: phase === 'stopped' ? 0 : Infinity,
                  duration: phase === 'entering' ? 0.6 : 0.2,
                  ease: 'linear',
                }}
                className="flex space-x-12 w-[150%] -ml-20"
              >
                {[...Array(24)].map((_, idx) => (
                  <div key={idx} className="w-10 sm:w-14 h-1.5 bg-[#F59E0B]/80 rounded-full shadow-sm shadow-[#F59E0B]/30" />
                ))}
              </motion.div>
            </div>

            {/* Bottom Asphalt Texture */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#05080C]" />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
