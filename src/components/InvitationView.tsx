import React, { useEffect, useRef, useState } from "react";
import { Invitation } from "../types";
import { Copy, MapPin, Send, Share2, Sparkles, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import OpeningThemes from "./OpeningThemes";
import { playClickSound } from "../utils/soundUtils";

interface PhotoCarouselProps {
  photos: string[];
  themeAccent: string;
  themeType: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland";
}

function PhotoCarousel({ photos, themeAccent, themeType }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Auto scrolling interval
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [photos]);

  const nextSlide = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const renderThemeFrame = () => {
    switch (themeType) {
      case "jaipur":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Scalloped double palace gate arches */}
            <div className="absolute inset-2 border-2 border-amber-600/50 rounded-[28px]" />
            <div className="absolute inset-3 border border-amber-600/20 border-dashed rounded-[26px]" />
            <svg viewBox="0 0 100 100" className="absolute top-0 inset-x-0 w-full h-12 fill-none stroke-amber-600/40 stroke-[0.8] overflow-visible">
              <path d="M-10,35 Q50,-10 110,35 M-10,40 Q50,-5 110,40" />
            </svg>
          </div>
        );
      case "lotus":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Delicate ivory lotus petal corners */}
            <div className="absolute inset-2 border-2 border-pink-400/40 rounded-[28px]" />
            <span className="absolute top-1.5 left-1.5 text-xs opacity-75">🪷</span>
            <span className="absolute top-1.5 right-1.5 text-xs opacity-75">🪷</span>
            <span className="absolute bottom-1.5 left-1.5 text-xs opacity-75">🪷</span>
            <span className="absolute bottom-1.5 right-1.5 text-xs opacity-75">🪷</span>
          </div>
        );
      case "diya":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Glowing diya frames */}
            <div className="absolute inset-2 border-2 border-amber-500/40 rounded-[28px] shadow-[0_0_10px_orange]" />
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-xs opacity-90 animate-pulse">🪔</span>
            <span className="absolute bottom-1.5 left-1.5 text-xs opacity-75">🪔</span>
            <span className="absolute bottom-1.5 right-1.5 text-xs opacity-75">🪔</span>
          </div>
        );
      case "thread":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Twisted kalava thread look */}
            <div className="absolute inset-2 border-2 border-red-600/45 rounded-[28px] border-dashed" />
            <div className="absolute inset-3 border border-yellow-500/45 rounded-[26px] border-dashed" />
            <span className="absolute top-1.5 left-1.5 text-xs">🔴</span>
            <span className="absolute top-1.5 right-1.5 text-xs">🟡</span>
            <span className="absolute bottom-1.5 left-1.5 text-xs">🟡</span>
            <span className="absolute bottom-1.5 right-1.5 text-xs">🔴</span>
          </div>
        );
      case "garland":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Floral wreath frame */}
            <div className="absolute inset-2 border-2 border-yellow-500/40 rounded-[28px]" />
            <div className="absolute inset-0 flex justify-between p-2 flex-wrap">
              <span className="text-[6.5px]">🌼</span>
              <span className="text-[6.5px]">🌸</span>
              <span className="text-[6.5px]">🌼</span>
              <span className="text-[6.5px]">🌸</span>
            </div>
          </div>
        );
      case "elephant":
      default:
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Shimmering Golden Border Lines */}
            <div className="absolute inset-2 border-2 border-brand-gold/60 rounded-[28px] animate-pulse" />
            <div className="absolute inset-3 border border-brand-gold/30 rounded-[26px] border-dashed" />
            
            {/* Animated Corner Filigree Ornaments */}
            <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-16 h-16 fill-none stroke-brand-gold stroke-[1.2] transition-transform duration-1000 group-hover:scale-110">
              <path d="M12,25 C12,12 25,12 25,12 M12,12 L30,12 M12,12 L12,30" />
              <circle cx="25" cy="25" r="2" className="fill-brand-rust/60" />
              <path d="M15,15 Q22,22 25,25" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute top-0 right-0 w-16 h-16 fill-none stroke-brand-gold stroke-[1.2] rotate-90 transition-transform duration-1000 group-hover:scale-110">
              <path d="M12,25 C12,12 25,12 25,12 M12,12 L30,12 M12,12 L12,30" />
              <circle cx="25" cy="25" r="2" className="fill-brand-rust/60" />
              <path d="M15,15 Q22,22 25,25" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute bottom-0 left-0 w-16 h-16 fill-none stroke-brand-gold stroke-[1.2] -rotate-90 transition-transform duration-1000 group-hover:scale-110">
              <path d="M12,25 C12,12 25,12 25,12 M12,12 L30,12 M12,12 L12,30" />
              <circle cx="25" cy="25" r="2" className="fill-brand-rust/60" />
              <path d="M15,15 Q22,22 25,25" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute bottom-0 right-0 w-16 h-16 fill-none stroke-brand-gold stroke-[1.2] rotate-180 transition-transform duration-1000 group-hover:scale-110">
              <path d="M12,25 C12,12 25,12 25,12 M12,12 L30,12 M12,12 L12,30" />
              <circle cx="25" cy="25" r="2" className="fill-brand-rust/60" />
              <path d="M15,15 Q22,22 25,25" />
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative w-full max-w-md mx-auto aspect-square p-4 bg-gradient-to-b from-[#F4EFE6] to-white rounded-[32px] border border-brand-rust/15 shadow-paper select-none group"
    >
      {renderThemeFrame()}

      {/* Inner Carousel Content */}
      <div className="relative w-full h-full overflow-hidden rounded-[20px] bg-brand-gold-light border border-brand-gold/20 shadow-inner">
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {photos.map((ph, index) => (
            <div key={index} className="w-full h-full shrink-0 relative overflow-hidden bg-[#FAF6F0]">
              {/* Rotating Gold Mandala placeholder behind the photo */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#E8D8CC] z-0">
                <svg viewBox="0 0 100 100" className="w-24 h-24 fill-none stroke-[#FFE082]/70 stroke-[0.8] animate-spin-slow">
                  <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
                  <path d="M50,10 A40,40 0 0,0 10,50 A40,40 0 0,0 50,90 A40,40 0 0,0 90,50 Z" />
                  <circle cx="50" cy="50" r="15" />
                  <path d="M35,50 L65,50 M50,35 L50,65" />
                </svg>
              </div>

              {/* Photo fades in smoothly */}
              <motion.img 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                src={ph} 
                alt={`Couple Moment ${index + 1}`} 
                className="w-full h-full object-cover relative z-10" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none z-15" />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            {/* Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white border border-brand-rust/10 text-brand-rust transition-all active:scale-90 cursor-pointer z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white border border-brand-rust/10 text-brand-rust transition-all active:scale-90 cursor-pointer z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { playClickSound(); setCurrentIndex(i); }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? "w-4 bg-brand-rust" : "w-1.5 bg-brand-rust/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function DetailedBrideSilhouette({ className = "text-rose-800" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 150" className={`${className} fill-current drop-shadow-md w-full h-full`}>
      {/* Trailing Dupatta */}
      <path 
        d="M40,26 C25,42 12,75 12,130 C24,136 38,136 48,130 C43,92 41,56 46,42 Z" 
        className="opacity-50"
      />
      {/* Gajra (Jasmine Flowers in Hair Bun) */}
      <circle cx="36" cy="27" r="2.2" fill="#FFF8E1" />
      <circle cx="38" cy="24" r="2.2" fill="#FFF8E1" />
      <circle cx="41" cy="22" r="2.2" fill="#FFF8E1" />
      <circle cx="36" cy="24" r="1.8" fill="#FFF8E1" />
      
      {/* Hair Bun */}
      <path d="M41,28 C36,28 33,32 35,37 C37,41 42,41 42,37 Z" />
      
      {/* Maang Tikka */}
      <path d="M48,22 Q51,21 50,25" stroke="#FFE082" strokeWidth="1.2" fill="none" />
      <circle cx="51" cy="26" r="1.2" fill="#FFE082" />
      
      {/* Nath (Nose Ring) */}
      <circle cx="54" cy="32" r="2.5" stroke="#FFE082" strokeWidth="0.8" fill="none" />
      <circle cx="56.5" cy="32" r="0.7" fill="#FFE082" />

      {/* Face Profile, Ear, Neck */}
      <path d="M45,27 C52,27 55,30 53,34 C51,36 52,38 48,39 L45,40 C45,42 46,44 46,46 Z" />
      <circle cx="48" cy="33" r="1" fill="#FFE082" />

      {/* Bodice (Choli) & Waist */}
      <path d="M46,46 C38,51 36,56 38,62 L62,62 C64,56 62,51 54,46 Z" />
      
      {/* Waist Belt (Kamarbandh) */}
      <path d="M38,62 Q50,65 62,62" stroke="#FFE082" strokeWidth="1.8" fill="none" />

      {/* Lehenga Skirt */}
      <path d="M38,62 C32,75 15,105 5,130 C20,137 80,137 95,130 C85,105 68,75 62,62 Z" />
      
      {/* Lehenga Embroidery & Borders */}
      <path d="M7,126 Q50,133 93,126" stroke="#FFE082" strokeWidth="3" fill="none" />
      <path d="M8,121 Q50,128 92,121" stroke="#FFE082" strokeWidth="1" fill="none" strokeDasharray="2,3" />
      <path d="M18,95 Q50,101 82,95" stroke="#FFE082" strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M28,78 Q50,83 72,78" stroke="#FFE082" strokeWidth="0.8" fill="none" opacity="0.6" />

      {/* Paisley details */}
      <path d="M50,108 Q46,114 50,118 Q54,114 50,108 Z" fill="#FFE082" opacity="0.9" />
      <path d="M38,104 Q36,108 38,112 Q40,108 38,104 Z" fill="#FFE082" opacity="0.7" />
      <path d="M62,104 Q60,108 62,112 Q64,108 62,104 Z" fill="#FFE082" opacity="0.7" />
    </svg>
  );
}

function DetailedGroomSilhouette({ className = "text-amber-950" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 150" className={`${className} fill-current drop-shadow-md w-full h-full`}>
      {/* Turban (Pagri) */}
      <path d="M35,24 C33,14 67,14 65,22 C66,26 64,29 50,30 C37,30 35,27 35,24 Z" />
      <path d="M37,20 C44,15 56,15 63,20" stroke="#FFE082" strokeWidth="1" fill="none" />

      {/* Kalgi feather crest */}
      <path d="M49,15 Q52,3 55,10 Q51,13 49,15 Z" fill="#FFE082" />
      <circle cx="49" cy="15" r="1.5" fill="#D32F2F" />

      {/* Face Profile & Head */}
      <circle cx="50" cy="34" r="8" />
      <path d="M45,40 Q50,42 55,40 L52,47 L48,47 Z" />

      {/* Royal Pearl Necklace (Haar) */}
      <path d="M43,46 Q50,51 57,46" stroke="#FFE082" strokeWidth="1.5" strokeDasharray="1.5,1.5" fill="none" />
      <path d="M41,49 Q50,55 59,49" stroke="#FFE082" strokeWidth="1.2" strokeDasharray="1.2,1.2" fill="none" />

      {/* Sherwani Long Coat */}
      <path d="M42,47 C34,52 30,62 30,72 L30,125 C40,128 60,128 70,125 L70,72 C70,62 66,52 58,47 Z" />
      
      {/* Belt & Sash */}
      <path d="M31,78 Q50,80 69,78" stroke="#FFE082" strokeWidth="2.5" fill="none" />
      <path d="M30,51 L60,84" stroke="#D32F2F" strokeWidth="3.2" fill="none" opacity="0.9" />
      
      {/* Sherwani Buttons */}
      <line x1="50" y1="47" x2="50" y2="120" stroke="#FFE082" strokeWidth="1.8" strokeDasharray="1,4" />

      {/* Bottom Border */}
      <path d="M30,123 Q50,126 70,123" stroke="#FFE082" strokeWidth="3" fill="none" />

      {/* Feet & Mojri Shoes */}
      <path d="M42,126 L38,131 C35,133 46,134 46,131 Z M58,126 L62,131 C65,133 54,134 54,131 Z" />
    </svg>
  );
}

// Jharokha Balcony Scroll Walk Silhouette Animation
function BalconyScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to horizontal walking coordinates
  const brideX = useTransform(scrollYProgress, [0.15, 0.48], [-75, -8]);
  const groomX = useTransform(scrollYProgress, [0.15, 0.48], [75, 8]);
  
  // Heart/blessings activation once they meet in the middle
  const heartOpacity = useTransform(scrollYProgress, [0.45, 0.58], [0, 1]);
  const heartScale = useTransform(scrollYProgress, [0.45, 0.58], [0.5, 1.1]);

  // Gentle bobbing/sway coordinates to simulate walking steps based on scroll
  // Asymmetric strides for more natural gait feel
  const brideY = useTransform(scrollYProgress, 
    [0.15, 0.19, 0.23, 0.27, 0.31, 0.35, 0.39, 0.43, 0.48], 
    [0, -3.5, 0.5, -2.5, 0.5, -3, 0.5, -1.5, 0]
  );
  const groomY = useTransform(scrollYProgress, 
    [0.15, 0.19, 0.23, 0.27, 0.31, 0.35, 0.39, 0.43, 0.48], 
    [0, -2.5, 0.5, -3, 0.5, -2, 0.5, -2.5, 0]
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-64 bg-gradient-to-b from-[#FFF9F2] to-[#FAF6F0] rounded-[32px] border border-[#8A3A1A]/10 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4"
    >
      {/* Decorative marigold garland hanging from the top */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-6 z-20 pointer-events-none opacity-80">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            {i % 2 === 0 ? "🧡" : "💛"}
          </span>
        ))}
      </div>

      {/* Sandstone Jharokha Window Archway */}
      <div className="relative w-72 h-44 mt-6 border-[6px] border-[#D7CCC8] bg-white rounded-t-full shadow-inner overflow-hidden flex items-end justify-center">
        {/* Scalloped inner arch details */}
        <div className="absolute inset-0 border-[4px] border-dashed border-[#A1887F]/30 rounded-t-full pointer-events-none" />
        
        {/* Floating golden particles behind the couple */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(254,243,199,0.3)_0%,transparent_70%)] pointer-events-none" />

        {/* Bride Silhouette */}
        <motion.div
          style={{ x: brideX, y: brideY, willChange: "transform" }}
          className="absolute bottom-0 z-10 w-16 h-28 flex flex-col items-center"
        >
          <DetailedBrideSilhouette className="text-[#8A3A1A]" />
          <span className="text-[8px] font-marcellus tracking-wider text-brand-rust font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1">{brideName}</span>
        </motion.div>

        {/* Groom Silhouette */}
        <motion.div
          style={{ x: groomX, y: groomY, scaleX: -1, willChange: "transform" }}
          className="absolute bottom-0 z-10 w-16 h-28 flex flex-col items-center"
        >
          <DetailedGroomSilhouette className="text-[#5D4037]" />
          <span className="text-[8px] font-marcellus tracking-wider text-brand-rust font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1 transform scale-x-[-1]">{groomName}</span>
        </motion.div>

        {/* Sparkling Heart emerging in the center when they meet */}
        <motion.div 
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute bottom-16 z-20 flex flex-col items-center pointer-events-none"
        >
          {/* Radial sparkle glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-400/20 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] relative z-10">💖</span>
          <span className="text-[7.5px] font-marcellus tracking-[2px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 uppercase shadow-sm relative z-10">
            Together Forever
          </span>
        </motion.div>

        {/* Balcony Sandstone Railing Grid (Front Layer overlaying couple) */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-[#E0D8D0] to-[#C8B8B0] border-t-4 border-[#A1887F] z-25 flex items-center justify-around px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-6 border-x border-[#A1887F]/40 bg-[#FAF6F0]/20 rounded-sm shadow-inner" />
          ))}
        </div>
      </div>

      {/* Scroll indicator prompt under balcony */}
      <span className="text-[8px] font-marcellus tracking-[3px] text-[#8A3A1A]/50 uppercase font-bold animate-pulse mt-2 block">
        Scroll down to walk closer
      </span>
    </div>
  );
}

// Peacock Feathers Staggered Fan out Animation Divider
function AnimatedPeacock() {
  const numFeathers = 15;

  return (
    <div className="relative w-44 h-36 mx-auto flex items-center justify-center overflow-visible select-none my-6">
      {/* Peacock Feathers Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        {Array.from({ length: numFeathers }).map((_, i) => {
          const angle = -80 + (i * 160) / (numFeathers - 1);
          return (
            <motion.div
              key={i}
              initial={{ rotate: angle * 0.15, scale: 0.6, opacity: 0.5 }}
              animate={{
                rotate: [angle * 0.15, angle, angle * 0.15],
                scale: [0.6, 1.05, 0.6],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05
              }}
              className="absolute w-6 h-20 overflow-visible"
              style={{ 
                bottom: "20%",
                transformOrigin: "bottom center",
                willChange: "transform, opacity"
              }}
            >
              {/* Peacock Feather SVG shape */}
              <svg viewBox="0 0 20 60" className="w-full h-full text-emerald-600">
                <line x1="10" y1="60" x2="10" y2="15" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
                <ellipse cx="10" cy="15" rx="8" ry="11" fill="currentColor" opacity="0.85" />
                <ellipse cx="10" cy="15" rx="5" ry="7.5" fill="#008080" />
                <ellipse cx="10" cy="16" rx="2.5" ry="4" fill="#FFE082" />
                <circle cx="10" cy="16.5" r="1.2" fill="#004D40" />
                
                <path d="M10,25 Q4,22 2,24 M10,32 Q3,29 1,31 M10,40 Q4,37 2,39 M10,48 Q5,46 3,47" stroke="currentColor" strokeWidth="0.6" />
                <path d="M10,25 Q16,22 18,24 M10,32 Q17,29 19,31 M10,40 Q16,37 18,39 M10,48 Q15,46 17,47" stroke="currentColor" strokeWidth="0.6" />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* Peacock Body Overlay */}
      <motion.div 
        animate={{
          scale: [0.95, 1.05, 0.95],
          y: [0, -2, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-2 z-10 w-12 h-18 flex items-center justify-center"
      >
        <svg viewBox="0 0 40 60" className="w-full h-full text-teal-800 fill-current drop-shadow-md">
          <circle cx="20" cy="16" r="4.5" />
          <path d="M20,11.5 L20,8 M18.5,12.5 L17,9.5 M21.5,12.5 L23,9.5" stroke="#FFE082" strokeWidth="0.8" />
          <circle cx="20" cy="7.5" r="0.8" fill="#FFE082" />
          <circle cx="16.8" cy="9" r="0.8" fill="#FFE082" />
          <circle cx="23.2" cy="9" r="0.8" fill="#FFE082" />
          
          <path d="M20,17.5 L17,19 L20,19 Z" fill="#FFE082" />
          
          <path d="M16.5,20 C16.5,20 18,24 18,28 C18,34 13,38 13,46 C13,54 20,57 27,46 C27,38 22,34 22,28 C22,24 23.5,20 23.5,20 Z" />
          
          <path d="M18,38 Q22,39 24,42 Q23,46 17,48 Z" fill="#FFE082" opacity="0.8" />
          
          <circle cx="18.8" cy="15.2" r="0.6" fill="#FFF" />
        </svg>
      </motion.div>
    </div>
  );
}

// ==========================================
// UNIQUE SCROLL ANIMATION COMPONENTS FOR ALL 6 THEMES
// ==========================================

function PhoolonKiChaadar() {
  return (
    <svg viewBox="0 0 120 40" className="w-24 h-8 overflow-visible">
      {/* Golden Canopy Top Frame Arch */}
      <path d="M 10,6 Q 60,-2 110,6" fill="none" stroke="#FFE082" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 10,6 Q 60,-2 110,6" fill="none" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      
      {/* Vertical supporting poles extending down */}
      <line x1="15" y1="6" x2="15" y2="105" stroke="#FFE082" strokeWidth="1.2" />
      <line x1="45" y1="4" x2="45" y2="105" stroke="#FFE082" strokeWidth="0.8" opacity="0.6" />
      <line x1="75" y1="4" x2="75" y2="105" stroke="#FFE082" strokeWidth="0.8" opacity="0.6" />
      <line x1="105" y1="6" x2="105" y2="105" stroke="#FFE082" strokeWidth="1.2" />

      {/* Little hanging temple bells from poles */}
      <circle cx="15" cy="8" r="1.5" fill="#FFE082" />
      <circle cx="105" cy="8" r="1.5" fill="#FFE082" />
      
      {/* Hanging marigold swags */}
      <path d="M 15,6 Q 30,15 45,6" fill="none" stroke="#FFA500" strokeWidth="1.8" strokeDasharray="2.5,2" />
      <path d="M 45,6 Q 60,15 75,6" fill="none" stroke="#FFD700" strokeWidth="1.8" strokeDasharray="2.5,2" />
      <path d="M 75,6 Q 90,15 105,6" fill="none" stroke="#FFA500" strokeWidth="1.8" strokeDasharray="2.5,2" />
      
      {/* Draped flower drop tassels in the center */}
      <line x1="30" y1="6" x2="30" y2="20" stroke="#FFF8E1" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
      <circle cx="30" cy="21" r="1" fill="#DC2626" />
      
      <line x1="60" y1="4" x2="60" y2="24" stroke="#FFF8E1" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
      <circle cx="60" cy="25" r="1.2" fill="#DC2626" />
      
      <line x1="90" y1="6" x2="90" y2="20" stroke="#FFF8E1" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
      <circle cx="90" cy="21" r="1" fill="#DC2626" />
    </svg>
  );
}

function PalaceGateScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Groom enters from the left on the red carpet to meet the bride under the canopy
  const groomX = useTransform(scrollYProgress, [0.15, 0.48], [-85, -12]);
  const groomY = useTransform(scrollYProgress, 
    [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.48], 
    [0, -2, 0, -2, 0, -2, 0, 0]
  );
  
  // Bride enters from the right to meet the groom under the canopy
  const brideX = useTransform(scrollYProgress, [0.15, 0.48], [85, 12]);
  const brideY = useTransform(scrollYProgress, 
    [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.48], 
    [0, -2, 0, -2, 0, -2, 0, 0]
  );

  const heartOpacity = useTransform(scrollYProgress, [0.46, 0.6], [0, 1]);
  const heartScale = useTransform(scrollYProgress, [0.46, 0.6], [0.5, 1]);
  const showerOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-64 bg-gradient-to-b from-[#FFF3E0] to-[#FFE0B2] rounded-[32px] border border-amber-600/10 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4"
    >
      {/* Hanging marigold toran top */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-6 z-20 pointer-events-none opacity-80">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            {i % 2 === 0 ? "🧡" : "💛"}
          </span>
        ))}
      </div>

      <div className="relative w-72 h-44 mt-6 border-[6px] border-[#D7CCC8] bg-[#FFF9F2] rounded-t-full shadow-inner overflow-hidden flex items-end justify-center">
        <div className="absolute inset-0 border-4 border-dashed border-amber-600/15 rounded-t-full pointer-events-none z-10" />

        {/* Red carpet rolls out */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-700 z-5 rounded shadow-inner" />

        {/* Petal Celebration Shower Layer on meeting */}
        <motion.div 
          style={{ opacity: showerOpacity }} 
          className="absolute inset-0 pointer-events-none z-25 overflow-hidden"
        >
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="absolute text-[8px] animate-fall"
              style={{
                left: `${8 + i * 5.5}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1.8 + Math.random() * 1.5}s`,
                top: "-15px"
              }}
            >
              {i % 3 === 0 ? "🌸" : i % 3 === 1 ? "💛" : "🌺"}
            </span>
          ))}
        </motion.div>

        {/* Suspended Floral Canopy (Phoolon ki Chaadar) centered over the meeting point */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <PhoolonKiChaadar />
        </div>

        {/* Groom (Walking in from left to center-left) */}
        <motion.div 
          style={{ x: groomX, y: groomY, willChange: "transform" }} 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-15 w-16 h-28 flex flex-col items-center justify-end pb-1"
        >
          <DetailedGroomSilhouette className="text-[#5D4037]" />
          <span className="text-[7.5px] font-bold text-amber-950 bg-white/80 px-1 py-0.5 rounded shadow-sm translate-y-[-2px]">{groomName}</span>
        </motion.div>

        {/* Bride (Walking in from right to center-right) */}
        <motion.div 
          style={{ x: brideX, y: brideY, willChange: "transform" }} 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-15 w-16 h-28 flex flex-col items-center justify-end pb-1"
        >
          <DetailedBrideSilhouette className="text-rose-700" />
          <span className="text-[7.5px] font-bold text-amber-950 bg-white/80 px-1 py-0.5 rounded shadow-sm translate-y-[-2px]">{brideName}</span>
        </motion.div>

        {/* Meeting blessings */}
        <motion.div style={{ opacity: heartOpacity, scale: heartScale }} className="absolute bottom-18 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center pointer-events-none">
          <span className="text-3xl animate-bounce">💖</span>
          <span className="text-[7px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 uppercase shadow-sm">
            Royal Union
          </span>
        </motion.div>
      </div>

      <span className="text-[8px] font-marcellus tracking-[3px] text-amber-950/50 uppercase font-bold animate-pulse mt-2 z-10">
        Scroll to walk under canopy
      </span>
    </div>
  );
}

function LotusBlossomScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Bride walks from left, Groom walks from right — they meet at center
  const brideX = useTransform(scrollYProgress, [0.15, 0.48], [-70, -6]);
  const groomX = useTransform(scrollYProgress, [0.15, 0.48], [70, 6]);

  // Gentle walking bob
  const brideY = useTransform(scrollYProgress,
    [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.48],
    [0, -3, 0, -2.5, 0, -3, 0, 0]
  );
  const groomY = useTransform(scrollYProgress,
    [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.48],
    [0, -2, 0.5, -3, 0, -2, 0, 0]
  );

  // Heart and blessing reveal when they meet
  const heartOpacity = useTransform(scrollYProgress, [0.44, 0.58], [0, 1]);
  const heartScale = useTransform(scrollYProgress, [0.44, 0.58], [0.5, 1.1]);

  // Floating diyas glow intensifies as couple gets closer
  const diyaGlow = useTransform(scrollYProgress, [0.15, 0.48], [0.3, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-64 bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F3] to-[#F8E8EC] rounded-[32px] border border-pink-300/15 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4"
    >
      {/* Top decorative flower row */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-6 z-20 pointer-events-none opacity-80">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            {i % 2 === 0 ? "🌸" : "🪷"}
          </span>
        ))}
      </div>

      {/* Main scene area */}
      <div className="relative w-72 h-44 mt-6 rounded-t-full overflow-hidden flex items-end justify-center"
        style={{ background: "linear-gradient(to bottom, #FFF8FA 0%, #FFE4EC 60%, #D4A8B8 100%)" }}
      >
        {/* Soft inner arch border */}
        <div className="absolute inset-0 border-4 border-dashed border-pink-300/15 rounded-t-full pointer-events-none" />

        {/* Floating diyas on water surface */}
        {[
          { left: "12%", delay: 0, size: "text-base" },
          { left: "30%", delay: 0.8, size: "text-sm" },
          { left: "50%", delay: 0.3, size: "text-base" },
          { left: "68%", delay: 1.1, size: "text-sm" },
          { left: "85%", delay: 0.6, size: "text-base" },
        ].map((diya, i) => (
          <motion.div
            key={i}
            className={`absolute bottom-6 ${diya.size} select-none pointer-events-none`}
            style={{ left: diya.left, opacity: diyaGlow }}
          >
            <motion.span
              animate={{
                y: [0, -3, 0, -2, 0],
                x: [0, 2, -1, 1, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: diya.delay,
              }}
              className="block filter drop-shadow-[0_0_6px_rgba(255,180,50,0.5)]"
            >
              🪔
            </motion.span>
          </motion.div>
        ))}

        {/* Water surface shimmer line */}
        <div className="absolute bottom-4 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-pink-300/30 to-transparent" />
        <div className="absolute bottom-3 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-rose-200/20 to-transparent" />

        {/* Water ripple circles — very subtle */}
        <motion.div
          className="absolute bottom-2 w-20 h-6 rounded-full border border-pink-200/15 pointer-events-none"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Bride Silhouette — walks from left */}
        <motion.div
          style={{ x: brideX, y: brideY, willChange: "transform" }}
          className="absolute bottom-0 z-10 w-16 h-28 flex flex-col items-center"
        >
          <DetailedBrideSilhouette className="text-rose-800" />
          <span className="text-[8px] font-marcellus tracking-wider text-rose-900 font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1">
            {brideName}
          </span>
        </motion.div>

        {/* Groom Silhouette — walks from right */}
        <motion.div
          style={{ x: groomX, y: groomY, scaleX: -1, willChange: "transform" }}
          className="absolute bottom-0 z-10 w-16 h-28 flex flex-col items-center"
        >
          <DetailedGroomSilhouette className="text-[#5D4037]" />
          <span className="text-[8px] font-marcellus tracking-wider text-amber-900 font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1 transform scale-x-[-1]">
            {groomName}
          </span>
        </motion.div>

        {/* Heart & blessing when they meet */}
        <motion.div
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute bottom-16 z-20 flex flex-col items-center pointer-events-none"
        >
          <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">💖</span>
          <span className="text-[7.5px] font-marcellus tracking-[2px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mt-1 uppercase shadow-sm">
            Blessed Union
          </span>
        </motion.div>

        {/* Front railing / water edge */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-b from-[#D4A8B8] to-[#C09AAC] z-15 flex items-center justify-around px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2.5 border border-pink-400/20 bg-pink-100/10 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <span className="text-[8px] font-marcellus tracking-[3px] text-rose-800/40 uppercase font-bold animate-pulse mt-2 z-10">
        Scroll to walk by the sacred waters
      </span>
    </div>
  );
}


function SkyLanternRiseScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Main sky lantern released by the couple
  const mainLanternY = useTransform(scrollYProgress, [0.18, 0.65], [0, -180]);
  const mainLanternX = useTransform(scrollYProgress, [0.18, 0.4, 0.65], [0, 20, -10]);
  const mainLanternScale = useTransform(scrollYProgress, [0.18, 0.4, 0.65], [0.8, 1.2, 0.6]);
  const mainLanternOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.58, 0.65], [0.2, 1, 1, 0]);

  // Background sky lanterns rising at different speeds and offsets
  const bglantern1Y = useTransform(scrollYProgress, [0.1, 0.7], [80, -160]);
  const bglantern1X = useTransform(scrollYProgress, [0.1, 0.7], [0, -15]);
  const bglantern1Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.6, 0.7], [0, 0.85, 0.85, 0]);

  const bglantern2Y = useTransform(scrollYProgress, [0.22, 0.75], [80, -160]);
  const bglantern2X = useTransform(scrollYProgress, [0.22, 0.75], [0, 15]);
  const bglantern2Opacity = useTransform(scrollYProgress, [0.22, 0.32, 0.65, 0.75], [0, 0.8, 0.8, 0]);

  const bglantern3Y = useTransform(scrollYProgress, [0.15, 0.6], [80, -160]);
  const bglantern3X = useTransform(scrollYProgress, [0.15, 0.6], [0, -20]);
  const bglantern3Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.52, 0.6], [0, 0.75, 0.75, 0]);

  const bglantern4Y = useTransform(scrollYProgress, [0.28, 0.8], [80, -160]);
  const bglantern4X = useTransform(scrollYProgress, [0.28, 0.8], [0, 10]);
  const bglantern4Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.72, 0.8], [0, 0.9, 0.9, 0]);

  const coupleScale = useTransform(scrollYProgress, [0.15, 0.45], [0.92, 1]);
  const coupleOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0.6, 1]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-64 bg-gradient-to-b from-[#0A0413] via-[#120924] to-[#1D1233] rounded-[32px] border border-indigo-500/10 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4 text-white"
    >
      {/* Stars and Moon Outline Background */}
      <div className="absolute inset-0 pointer-events-none opacity-45 z-0">
        {/* Twinkling stars */}
        <div className="absolute top-6 left-12 w-[1.5px] h-[1.5px] bg-white rounded-full animate-pulse" />
        <div className="absolute top-14 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-28 left-24 w-[2px] h-[2px] bg-amber-250 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-10 right-8 w-[1.5px] h-[1.5px] bg-white rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
        
        {/* Crescent moon outline */}
        <svg viewBox="0 0 100 100" className="absolute top-4 right-6 w-10 h-10 text-amber-250/20 fill-current">
          <path d="M50,15 A35,35 0 1,0 85,50 A30,30 0 1,1 50,15 Z" />
        </svg>
      </div>

      {/* Background lanterns (twinkling and rising) */}
      <motion.div style={{ y: bglantern1Y, x: bglantern1X, opacity: bglantern1Opacity, willChange: "transform, opacity" }} className="absolute z-5 w-6 h-9 flex flex-col items-center select-none pointer-events-none left-[15%] bottom-4">
        <div className="w-5 h-7 bg-amber-500/35 rounded-t-md shadow-[0_0_12px_orange] flex items-center justify-center text-[7px]">🏮</div>
        <div className="w-1.5 h-1.5 bg-yellow-400/50 rounded-full blur-[0.5px] -mt-0.5" />
      </motion.div>

      <motion.div style={{ y: bglantern2Y, x: bglantern2X, opacity: bglantern2Opacity, willChange: "transform, opacity" }} className="absolute z-5 w-5 h-8 flex flex-col items-center select-none pointer-events-none left-[80%] bottom-4">
        <div className="w-4 h-6 bg-amber-500/30 rounded-t-md shadow-[0_0_10px_orange] flex items-center justify-center text-[6px]">🏮</div>
        <div className="w-1 h-1 bg-yellow-400/40 rounded-full blur-[0.5px] -mt-0.5" />
      </motion.div>

      <motion.div style={{ y: bglantern3Y, x: bglantern3X, opacity: bglantern3Opacity, willChange: "transform, opacity" }} className="absolute z-5 w-5 h-8 flex flex-col items-center select-none pointer-events-none left-[30%] bottom-4">
        <div className="w-4 h-6 bg-amber-500/30 rounded-t-md shadow-[0_0_10px_orange] flex items-center justify-center text-[6px]">🏮</div>
        <div className="w-1.5 h-1.5 bg-yellow-400/40 rounded-full blur-[0.5px] -mt-0.5" />
      </motion.div>

      <motion.div style={{ y: bglantern4Y, x: bglantern4X, opacity: bglantern4Opacity, willChange: "transform, opacity" }} className="absolute z-5 w-6 h-9 flex flex-col items-center select-none pointer-events-none left-[65%] bottom-4">
        <div className="w-5 h-7 bg-amber-500/35 rounded-t-md shadow-[0_0_14px_orange] flex items-center justify-center text-[7px]">🏮</div>
        <div className="w-1.5 h-1.5 bg-yellow-400/50 rounded-full blur-[0.5px] -mt-0.5" />
      </motion.div>

      {/* Main Sky Lantern released by the couple — enhanced layered glow */}
      <motion.div 
        style={{ x: mainLanternX, y: mainLanternY, scale: mainLanternScale, opacity: mainLanternOpacity, willChange: "transform, opacity" }}
        className="absolute z-20 w-9 h-14 flex flex-col items-center select-none pointer-events-none left-1/2 -translate-x-1/2 bottom-10"
      >
        <div className="w-8 h-11 bg-amber-500/70 rounded-t-xl shadow-[0_0_24px_#FFA000,0_0_48px_rgba(255,160,0,0.3)] border-t border-amber-300 flex items-center justify-center text-xs text-yellow-100 font-bold">
          🏮
        </div>
        <div className="w-3 h-3 bg-red-500/30 rounded-full blur-[1.5px] -mt-1" />
        <div className="w-2 h-4 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent opacity-90 rounded-full -mt-0.5 animate-pulse" />
      </motion.div>

      {/* Balcony / Terrace Railing & Couple */}
      <motion.div 
        style={{ scale: coupleScale, opacity: coupleOpacity, willChange: "transform, opacity" }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-end"
      >
        {/* Couple Silhouette standing on the balcony terrace — with warm backlight glow */}
        <div className="flex gap-10 items-end relative h-22 w-36 overflow-visible mb-[-2px]">
          {/* Warm glow behind the couple from lantern light - optimized to use radial gradient instead of filter blur */}
          <div className="absolute inset-0 -inset-x-4 top-2 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)" }} />
          <div className="w-12 h-20">
            <DetailedBrideSilhouette className="text-amber-250/90" />
          </div>
          {/* Main lantern starting glow in their hands before launch */}
          <div className="w-12 h-20 transform scale-x-[-1]">
            <DetailedGroomSilhouette className="text-amber-200/80" />
          </div>
          
          {/* Couple name tag */}
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[7.5px] font-bold text-amber-200 bg-[#120924]/90 border border-amber-300/30 px-2.5 py-0.5 rounded-full shadow-md z-30 uppercase tracking-widest font-marcellus">
            {brideName} &amp; {groomName}
          </div>
        </div>

        {/* Temple Terrace Railing (Front overlay) */}
        <div className="w-full h-7 bg-gradient-to-b from-[#1C0F35] to-[#0E0620] border-t-2 border-amber-500/30 z-20 flex items-center justify-around px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-4 border-x border-amber-500/15 bg-indigo-950/20 rounded-sm shadow-inner" />
          ))}
        </div>
      </motion.div>

      <span className="text-[8px] font-marcellus tracking-[3px] text-amber-250/50 uppercase font-bold animate-pulse mt-2 z-20">
        Scroll to release sky lanterns
      </span>
    </div>
  );
}

function GathbandhanKnotScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.48], [0, 1]);
  const knotScale = useTransform(scrollYProgress, [0.45, 0.58], [0.1, 1.1]);
  const knotOpacity = useTransform(scrollYProgress, [0.45, 0.58], [0, 1]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-64 bg-gradient-to-b from-[#FAF8F5] to-[#F5EFEB] rounded-[32px] border border-red-600/10 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4"
    >
      {/* Decorative floral toran header */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-6 z-20 pointer-events-none opacity-85">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
            {i % 2 === 0 ? "❤️" : "💛"}
          </span>
        ))}
      </div>

      <div className="relative w-72 h-44 mt-6 flex items-end justify-center overflow-visible">
        {/* Soft glowing sun aura behind the knot - optimized to use radial gradient instead of filter blur */}
        <div className="absolute w-28 h-28 rounded-full left-1/2 -translate-x-1/2 bottom-8 z-0 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)" }} />

        {/* Bride (Left) */}
        <div className="absolute left-4 bottom-0 z-10 w-16 h-28 flex flex-col items-center justify-end pb-1">
          <DetailedBrideSilhouette className="text-[#8A3A1A]" />
          <span className="text-[7.5px] font-bold text-red-700 bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1">{brideName}</span>
        </div>

        {/* Groom (Right) */}
        <div className="absolute right-4 bottom-0 z-10 w-16 h-28 flex flex-col items-center justify-end pb-1 transform scale-x-[-1]">
          <DetailedGroomSilhouette className="text-[#5D4037]" />
          <span className="text-[7.5px] font-bold text-yellow-600 bg-white/80 px-1.5 py-0.5 rounded shadow-sm mt-1 transform scale-x-[-1]">{groomName}</span>
        </div>

        {/* Weaving Dupatta & Shawl paths */}
        <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full pointer-events-none z-15">
          {/* Red Dupatta */}
          <motion.path
            d="M 32,100 C 55,120 75,100 100,85"
            stroke="#DC2626"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength }}
          />
          {/* Red Dupatta Gold Border */}
          <motion.path
            d="M 32,102 C 55,122 75,102 100,87"
            stroke="#FFE082"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength }}
          />

          {/* Yellow Shawl */}
          <motion.path
            d="M 168,100 C 145,120 125,100 100,85"
            stroke="#F59E0B"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength }}
          />
          {/* Yellow Shawl Gold Border */}
          <motion.path
            d="M 168,102 C 145,122 125,102 100,87"
            stroke="#FFE082"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>

        {/* Knot and hanging Jhumkas/Bells */}
        <motion.g
          style={{ 
            scale: knotScale, 
            opacity: knotOpacity,
            transformOrigin: "100px 85px"
          }}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          {/* SVG wrapper inside HTML element for absolute centering */}
          <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full">
            {/* Sparkles backdrop */}
            <motion.g
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="100" cy="85" r="14" stroke="#FFE082" strokeWidth="0.5" strokeDasharray="2,3" fill="none" />
              <path d="M 100,66 L 100,71 M 100,99 L 100,104 M 81,85 L 86,85 M 114,85 L 119,85" stroke="#FFE082" strokeWidth="0.8" />
            </motion.g>

            {/* Left hanging ribbon & jhumka — slower pendulum with asymmetric swing */}
            <motion.g
              animate={{ rotate: [-5, 5.5, -4.5, 5, -5] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
              style={{ transformOrigin: "95px 87px" }}
            >
              {/* Red ribbon tail */}
              <path d="M 95,87 C 93,95 89,100 91,107" stroke="#DC2626" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {/* Gold chain */}
              <line x1="91" y1="107" x2="91" y2="117" stroke="#FFE082" strokeWidth="1" strokeDasharray="1.5,1.5" />
              {/* Jhumka dome */}
              <path d="M 87,121 C 87,117 95,117 95,121 Z" fill="#FFE082" stroke="#D97706" strokeWidth="0.5" />
              {/* Jhumka little hanging beads */}
              <circle cx="88" cy="123" r="0.8" fill="#FFE082" />
              <circle cx="91" cy="124" r="0.8" fill="#FFE082" />
              <circle cx="94" cy="123" r="0.8" fill="#FFE082" />
            </motion.g>

            {/* Right hanging ribbon & jhumka — offset timing for natural asymmetry */}
            <motion.g
              animate={{ rotate: [4.5, -5, 4, -5.5, 4.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1], delay: 0.4 }}
              style={{ transformOrigin: "105px 87px" }}
            >
              {/* Yellow ribbon tail */}
              <path d="M 105,87 C 107,95 111,100 109,107" stroke="#F59E0B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {/* Gold chain */}
              <line x1="109" y1="107" x2="109" y2="117" stroke="#FFE082" strokeWidth="1" strokeDasharray="1.5,1.5" />
              {/* Jhumka dome */}
              <path d="M 105,121 C 105,117 113,117 113,121 Z" fill="#FFE082" stroke="#D97706" strokeWidth="0.5" />
              {/* Jhumka little hanging beads */}
              <circle cx="106" cy="123" r="0.8" fill="#FFE082" />
              <circle cx="109" cy="124" r="0.8" fill="#FFE082" />
              <circle cx="112" cy="123" r="0.8" fill="#FFE082" />
            </motion.g>

            {/* The Tied Cloth Knot shape in the center */}
            <g>
              {/* Red side of the knot */}
              <path d="M 95,85 C 93,79 98,78 100,85 C 101,91 96,92 95,85" fill="#DC2626" />
              {/* Yellow side of the knot */}
              <path d="M 105,85 C 107,79 102,78 100,85 C 99,91 104,92 105,85" fill="#F59E0B" />
              {/* Center wrapping band */}
              <ellipse cx="100" cy="85" rx="3.5" ry="5.5" fill="#D97706" />
              <ellipse cx="100" cy="85" rx="1.8" ry="3.5" fill="#FFE082" opacity="0.85" />
            </g>
          </svg>
        </motion.g>

        {/* Petal Celebration Shower Layer */}
        <motion.div 
          style={{ opacity: knotOpacity }} 
          className="absolute inset-0 pointer-events-none z-25 overflow-hidden"
        >
          {/* Looping falling petals */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-[8px] animate-fall"
              style={{
                left: `${25 + i * 10}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + Math.random() * 2}s`,
                top: "-15px"
              }}
            >
              {i % 2 === 0 ? "🌸" : "💛"}
            </span>
          ))}
        </motion.div>
      </div>

      <span className="text-[8px] font-marcellus tracking-[3px] text-red-750/50 uppercase font-bold animate-pulse mt-2 z-10">
        Scroll to tie the holy alliance
      </span>
    </div>
  );
}

function VarmalaExchangeScrollAnimation({ brideName, groomName }: { brideName: string; groomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Garland 1: Bride -> Groom (scrollYProgress 0.15 -> 0.45)
  // Starts at bride's neck (x = -72) and lands on groom's neck (x = 72)
  const garland1X = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [-72, 0, 72]);
  const garland1Y = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0, -50, 16]);
  const garland1Scale = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0.8, 1.1, 1]);
  const garland1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9], [0, 1, 1]);

  // Garland 2: Groom -> Bride (scrollYProgress 0.45 -> 0.75)
  // Starts at groom's neck (x = 72) and lands on bride's neck (x = -72)
  const garland2X = useTransform(scrollYProgress, [0.45, 0.6, 0.75], [72, 0, -72]);
  const garland2Y = useTransform(scrollYProgress, [0.45, 0.6, 0.75], [0, -50, 16]);
  const garland2Scale = useTransform(scrollYProgress, [0.45, 0.6, 0.75], [0.8, 1.1, 1]);
  const garland2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.9], [0, 1, 1]);

  // Bowing gestures (both bow forward towards each other) — smoother multi-keyframe easing
  const groomRotate = useTransform(scrollYProgress, [0.33, 0.38, 0.45, 0.50, 0.55], [0, 2, 9, 6, 0]);
  const groomY = useTransform(scrollYProgress, [0.33, 0.38, 0.45, 0.50, 0.55], [0, 1, 5, 3, 0]);

  const brideRotate = useTransform(scrollYProgress, [0.63, 0.68, 0.75, 0.80, 0.85], [0, 2, 9, 6, 0]);
  const brideY = useTransform(scrollYProgress, [0.63, 0.68, 0.75, 0.80, 0.85], [0, 1, 5, 3, 0]);

  // Couple walking closer on ceremony completion
  const brideCloseX = useTransform(scrollYProgress, [0.75, 0.9], [0, 12]);
  const groomCloseX = useTransform(scrollYProgress, [0.75, 0.9], [0, -12]);

  const coupleOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0.4, 1]);
  const heartOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const heartScale = useTransform(scrollYProgress, [0.75, 0.95], [0.5, 1]);
  
  // Arch color transformation from simple gold to fully lit/blessed marigold red
  const archStroke = useTransform(
    scrollYProgress,
    [0.15, 0.75],
    ["rgba(217, 119, 6, 0.3)", "rgba(220, 38, 38, 0.8)"]
  );

  const showerOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto h-68 bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] rounded-[32px] border border-yellow-500/10 shadow-paper overflow-hidden flex flex-col items-center justify-between p-4"
    >
      {/* Decorative hanging floral toran on the top */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-6 z-20 pointer-events-none opacity-85">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
            {i % 2 === 0 ? "🧡" : "💛"}
          </span>
        ))}
      </div>

      <div className="relative w-72 h-48 mt-4 flex items-end justify-center overflow-visible">
        {/* Ornate floral mandap archway background */}
        <svg viewBox="0 0 100 80" className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none z-0">
          <motion.path 
            d="M 12,80 L 12,30 C 12,12 30,6 50,6 C 70,6 88,12 88,30 L 88,80" 
            fill="none" 
            stroke={archStroke} 
            strokeWidth="3" 
            strokeDasharray="2,2" 
          />
          <path d="M 6,80 L 6,30 C 6,8 26,2 50,2 C 74,2 94,8 94,30 L 94,80" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
          {/* Hanging bells from the arch */}
          <circle cx="20" cy="22" r="1.5" fill="#F59E0B" />
          <path d="M 20,22 L 20,28" stroke="#F59E0B" strokeWidth="0.8" />
          <text x="18.5" y="34" fontSize="4.5" fill="#F59E0B">🔔</text>
          
          <circle cx="80" cy="22" r="1.5" fill="#F59E0B" />
          <path d="M 80,22 L 80,28" stroke="#F59E0B" strokeWidth="0.8" />
          <text x="78.5" y="34" fontSize="4.5" fill="#F59E0B">🔔</text>
        </svg>

        {/* Petal Celebration Shower Layer */}
        <motion.div 
          style={{ opacity: showerOpacity }} 
          className="absolute inset-0 pointer-events-none z-25 overflow-hidden"
        >
          {/* Looping falling petals */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-[8px] animate-fall"
              style={{
                left: `${15 + i * 10}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2 + Math.random() * 2.5}s`,
                top: "-15px"
              }}
            >
              {i % 2 === 0 ? "🌸" : "💛"}
            </span>
          ))}
        </motion.div>

        {/* Floating Garland 1 (Bride -> Groom) - Explicitly centered on neck level */}
        <motion.div 
          style={{ x: garland1X, y: garland1Y, scale: garland1Scale, opacity: garland1Opacity, willChange: "transform, opacity" }}
          className="absolute z-20 w-11 h-13 pointer-events-none left-1/2 -translate-x-1/2 bottom-[85px]"
        >
          <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
            <path d="M20,5 C10,5 4,12 4,28 C4,42 12,48 20,48 C28,48 36,42 36,28 C36,12 30,5 20,5 Z" fill="none" stroke="#F59E0B" strokeWidth="3" />
            {/* Red rose buds */}
            <circle cx="20" cy="5" r="3.2" fill="#DC2626" />
            <circle cx="10" cy="11" r="3.2" fill="#DC2626" />
            <circle cx="30" cy="11" r="3.2" fill="#DC2626" />
            <circle cx="5" cy="22" r="3.5" fill="#DC2626" />
            <circle cx="35" cy="22" r="3.5" fill="#DC2626" />
            <circle cx="6" cy="34" r="3.8" fill="#DC2626" />
            <circle cx="34" cy="34" r="3.8" fill="#DC2626" />
            <circle cx="12" cy="44" r="4" fill="#DC2626" />
            <circle cx="28" cy="44" r="4" fill="#DC2626" />
            <circle cx="20" cy="48" r="4.5" fill="#DC2626" />
            {/* Gold marigold accents */}
            <circle cx="15" cy="7" r="1.5" fill="#FBBF24" />
            <circle cx="25" cy="7" r="1.5" fill="#FBBF24" />
            <circle cx="7" cy="16" r="1.5" fill="#FBBF24" />
            <circle cx="33" cy="16" r="1.5" fill="#FBBF24" />
            <circle cx="4" cy="28" r="1.5" fill="#FBBF24" />
            <circle cx="36" cy="28" r="1.5" fill="#FBBF24" />
            <circle cx="8" cy="39" r="1.5" fill="#FBBF24" />
            <circle cx="32" cy="39" r="1.5" fill="#FBBF24" />
            <circle cx="16" cy="46" r="1.8" fill="#FBBF24" />
            <circle cx="24" cy="46" r="1.8" fill="#FBBF24" />
          </svg>
        </motion.div>

        {/* Floating Garland 2 (Groom -> Bride) - Explicitly centered on neck level */}
        <motion.div 
          style={{ x: garland2X, y: garland2Y, scale: garland2Scale, opacity: garland2Opacity, willChange: "transform, opacity" }}
          className="absolute z-20 w-11 h-13 pointer-events-none left-1/2 -translate-x-1/2 bottom-[85px]"
        >
          <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
            <path d="M20,5 C10,5 4,12 4,28 C4,42 12,48 20,48 C28,48 36,42 36,28 C36,12 30,5 20,5 Z" fill="none" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="20" cy="5" r="3.2" fill="#DC2626" />
            <circle cx="10" cy="11" r="3.2" fill="#DC2626" />
            <circle cx="30" cy="11" r="3.2" fill="#DC2626" />
            <circle cx="5" cy="22" r="3.5" fill="#DC2626" />
            <circle cx="35" cy="22" r="3.5" fill="#DC2626" />
            <circle cx="6" cy="34" r="3.8" fill="#DC2626" />
            <circle cx="34" cy="34" r="3.8" fill="#DC2626" />
            <circle cx="12" cy="44" r="4" fill="#DC2626" />
            <circle cx="28" cy="44" r="4" fill="#DC2626" />
            <circle cx="20" cy="48" r="4.5" fill="#DC2626" />
            <circle cx="15" cy="7" r="1.5" fill="#FBBF24" />
            <circle cx="25" cy="7" r="1.5" fill="#FBBF24" />
            <circle cx="7" cy="16" r="1.5" fill="#FBBF24" />
            <circle cx="33" cy="16" r="1.5" fill="#FBBF24" />
            <circle cx="4" cy="28" r="1.5" fill="#FBBF24" />
            <circle cx="36" cy="28" r="1.5" fill="#FBBF24" />
            <circle cx="8" cy="39" r="1.5" fill="#FBBF24" />
            <circle cx="32" cy="39" r="1.5" fill="#FBBF24" />
            <circle cx="16" cy="46" r="1.8" fill="#FBBF24" />
            <circle cx="24" cy="46" r="1.8" fill="#FBBF24" />
          </svg>
        </motion.div>

        {/* Bride (Left) */}
        <motion.div 
          style={{ 
            opacity: coupleOpacity, 
            x: brideCloseX, 
            y: brideY, 
            rotate: brideRotate,
            transformOrigin: "bottom center",
            willChange: "transform, opacity"
          }} 
          className="absolute left-10 z-10 w-16 h-28 flex flex-col items-center justify-end"
        >
          <DetailedBrideSilhouette className="text-[#8A3A1A]" />
          <span className="text-[7.5px] font-bold text-rose-950 bg-white/80 px-1 py-0.5 rounded shadow-sm translate-y-[-1px]">{brideName}</span>
        </motion.div>

        {/* Groom (Right) */}
        <motion.div 
          style={{ 
            opacity: coupleOpacity, 
            x: groomCloseX, 
            y: groomY, 
            rotate: groomRotate,
            scaleX: -1,
            transformOrigin: "bottom center",
            willChange: "transform, opacity"
          }} 
          className="absolute right-10 z-10 w-16 h-28 flex flex-col items-center justify-end"
        >
          <DetailedGroomSilhouette className="text-[#5D4037]" />
          <span className="text-[7.5px] font-bold text-amber-950 bg-white/80 px-1 py-0.5 rounded shadow-sm translate-y-[-1px] transform scale-x-[-1]">{groomName}</span>
        </motion.div>
        
        {/* Blessings Seal revealed on Varmala complete */}
        <motion.div 
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute bottom-16 z-35 flex flex-col items-center pointer-events-none"
        >
          <span className="text-3xl filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]">💝</span>
          <span className="text-[7.5px] font-bold text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full mt-1 uppercase shadow-sm">
            Varmala Exchange
          </span>
        </motion.div>
      </div>

      <span className="text-[8px] font-marcellus tracking-[3px] text-yellow-800/50 uppercase font-bold animate-pulse mt-2 z-10">
        Scroll to complete Varmala ceremony
      </span>
    </div>
  );
}

// ==========================================
// UNIQUE THEME SECTION DIVIDER COMPONENTS
// ==========================================

function MarigoldCurtainsDivider() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-24 my-6 flex justify-around overflow-hidden select-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2.8 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
          className="flex flex-col items-center"
          style={{ transformOrigin: "top center", willChange: "transform" }}
        >
          <div className="w-[1px] h-12 bg-green-700/40" />
          <span className="text-[8px] -mt-1">🧡</span>
          <span className="text-[8px]">💛</span>
          <span className="text-[8px]">🧡</span>
          <span className="text-[8px]">💛</span>
        </motion.div>
      ))}
    </div>
  );
}

function LotusLeafFloatingDivider() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-16 my-6 flex items-center justify-center overflow-visible select-none">
      <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
      <motion.div
        animate={{ x: [-40, 40, -40], y: [-3, 3, -3], rotate: [-8, 8, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="text-lg z-10"
      >
        🪷
      </motion.div>
      <motion.div
        animate={{ x: [35, -35, 35], y: [2, -3, 2], rotate: [6, -10, 6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="text-sm opacity-55 z-10"
      >
        🌸
      </motion.div>
    </div>
  );
}

function RotatingMandalaDiscDivider() {
  return (
    <div className="relative w-20 h-20 mx-auto my-6 flex items-center justify-center select-none">
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 100 100" 
        className="w-full h-full stroke-amber-500/40 fill-none stroke-[0.8]"
      >
        <circle cx="50" cy="50" r="40" strokeDasharray="4,4" />
        <path d="M50,10 A40,40 0 0,0 10,50 A40,40 0 0,0 50,90 A40,40 0 0,0 90,50 Z" />
        <circle cx="50" cy="50" r="15" />
      </motion.svg>
      <div className="absolute text-sm animate-pulse">🪔</div>
    </div>
  );
}

function TempleBellsDivider() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-20 my-6 flex justify-center gap-8 overflow-visible select-none">
      <div className="absolute top-0 w-24 h-0.5 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-10, 9, -8, 7, -10] }}
          transition={{ 
            duration: 2.2 + i * 0.3, 
            repeat: Infinity, 
            ease: [0.33, 0, 0.67, 1],
            delay: i * 0.35
          }}
          style={{ transformOrigin: "top center", willChange: "transform" }}
          className="flex flex-col items-center"
        >
          <div className="w-[1.2px] h-8 bg-red-600" />
          <span className="text-sm -mt-0.5 filter drop-shadow-sm">🔔</span>
        </motion.div>
      ))}
    </div>
  );
}

function MarigoldToranDivider() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-16 my-6 flex flex-col items-center select-none overflow-visible">
      <svg viewBox="0 0 100 25" className="w-full h-8 stroke-amber-500 fill-none stroke-[1]">
        <path d="M0,5 C25,18 50,18 75,5 L100,5" strokeDasharray="2,2" />
        <circle cx="20" cy="11" r="2" fill="orange" />
        <circle cx="50" cy="14" r="2" fill="yellow" />
        <circle cx="80" cy="11" r="2" fill="orange" />
      </svg>
      <motion.span
        animate={{ y: [0, 40], opacity: [0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute text-[8px] left-1/4"
      >
        🌸
      </motion.span>
      <motion.span
        animate={{ y: [0, 45], opacity: [0.8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute text-[8px] right-1/4"
      >
        🌼
      </motion.span>
    </div>
  );
}

// ==========================================
// 3D POP-OUT PHOTO FRAME SHOWCASE
// ==========================================

function PopoutPhotoFrame({ photo, themeType, themeAccent }: { photo: string; themeType: string; themeAccent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const photoScale = useTransform(scrollYProgress, [0.2, 0.9], [0.85, 1.15]);
  const photoY = useTransform(scrollYProgress, [0.2, 0.9], [30, -35]);
  const frameScale = useTransform(scrollYProgress, [0.1, 0.9], [0.95, 1.05]);
  // Dynamic shadow depth that increases as photo pops out
  const photoShadow = useTransform(
    scrollYProgress, 
    [0.2, 0.5, 0.9], 
    [
      "0 4px 12px rgba(0,0,0,0.1)",
      "0 12px 28px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.08)",
      "0 20px 50px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.12)"
    ]
  );

  const renderPopoutFrameDecor = () => {
    switch (themeType) {
      case "jaipur":
        return (
          <div className="absolute inset-0 border-[6px] border-amber-600/60 rounded-[36px] pointer-events-none">
            <div className="absolute inset-2 border border-amber-600/35 border-dashed rounded-[30px]" />
            <svg viewBox="0 0 100 20" className="absolute -top-4 inset-x-0 w-full fill-none stroke-amber-600 stroke-[1.2] overflow-visible">
              <path d="M-10,20 Q50,-5 110,20" />
            </svg>
          </div>
        );
      case "lotus":
        return (
          <div className="absolute inset-0 border-[6px] border-pink-400/40 rounded-[36px] pointer-events-none">
            <span className="absolute -top-3.5 left-4 text-lg">🪷</span>
            <span className="absolute -top-3.5 right-4 text-lg">🪷</span>
            <span className="absolute -bottom-3.5 left-4 text-lg">🪷</span>
            <span className="absolute -bottom-3.5 right-4 text-lg">🪷</span>
          </div>
        );
      case "diya":
        return (
          <div className="absolute inset-0 border-[6px] border-amber-500/40 rounded-[36px] pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg animate-pulse">🪔</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-lg animate-pulse">🪔</span>
          </div>
        );
      case "thread":
        return (
          <div className="absolute inset-0 border-[6px] border-red-600/40 border-dashed rounded-[36px] pointer-events-none">
            <div className="absolute inset-1.5 border-2 border-yellow-500/40 border-dashed rounded-[32px]" />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">MUTUAL UNION</span>
          </div>
        );
      case "garland":
        return (
          <div className="absolute inset-0 border-[6px] border-yellow-500/40 rounded-[36px] pointer-events-none">
            <div className="absolute -inset-2 flex justify-between px-6 pointer-events-none">
              <span className="text-xs">🌼</span>
              <span className="text-xs">🌸</span>
              <span className="text-xs">🌼</span>
            </div>
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[8px] bg-white border px-2 py-0.5 rounded-full text-amber-700 font-bold">🌸 Varmala 🌸</div>
          </div>
        );
      case "elephant":
      default:
        return (
          <div className="absolute inset-0 border-[6px] border-brand-gold/60 rounded-[36px] pointer-events-none">
            <div className="absolute inset-2 border border-brand-gold/30 rounded-[30px] border-dashed" />
            <svg viewBox="0 0 100 100" className="absolute -top-6 -left-6 w-12 h-12 fill-none stroke-brand-gold stroke-[1.2]">
              <path d="M12,25 C12,12 25,12 25,12" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute -top-6 -right-6 w-12 h-12 fill-none stroke-brand-gold stroke-[1.2] rotate-90">
              <path d="M12,25 C12,12 25,12 25,12" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto aspect-[4/5] bg-gradient-to-b from-[#FDFBF7] to-[#F5EFEB] rounded-[40px] border border-[#8A3A1A]/10 shadow-paper overflow-hidden flex flex-col items-center justify-center p-8 my-10"
    >
      <span className="text-[9px] font-marcellus tracking-[4px] text-brand-rust/50 uppercase font-bold mb-4 block">
        Our Sacred Moment
      </span>

      {/* Frame Base */}
      <motion.div 
        style={{ scale: frameScale }}
        className="relative w-full h-[75%] rounded-[32px] bg-[#EFEBE4] shadow-inner overflow-visible flex items-center justify-center border border-stone-200/50"
      >
        {renderPopoutFrameDecor()}

        {/* 3D Pop-out Photo — with dynamic shadow depth */}
        <motion.div
          style={{ 
            scale: photoScale,
            y: photoY,
            boxShadow: photoShadow,
            willChange: "transform",
          }}
          className="w-[85%] h-[85%] rounded-[24px] overflow-hidden border-4 border-white relative z-30"
        >
          <img 
            src={photo} 
            alt="Couple Sacred Moment" 
            className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="font-cursive text-white text-2xl drop-shadow-md">Made for Each Other</span>
          </div>
        </motion.div>
      </motion.div>

      <span className="text-[8px] font-marcellus tracking-[3px] text-brand-rust/40 uppercase font-bold mt-4 animate-pulse">
        Scroll to pop photo out of frame
      </span>
    </div>
  );
}

const getWishNotice = (lang: string) => {
  switch (lang) {
    case "hi":
      return "⚠️ नोट: आपकी शुभकामना और नाम इस आमंत्रण दीवार पर सभी मेहमानों के देखने के लिए सार्वजनिक रूप से प्रदर्शित किए जाएंगे।";
    case "kn":
      return "⚠️ ಸೂಚನೆ: ನಿಮ್ಮ ಶುಭಾಶಯ ಮತ್ತು ಹೆಸರನ್ನು ಎಲ್ಲ ಅತಿಥಿಗಳು ನೋಡಲು ಈ ಆಮಂತ್ರಣ ಪತ್ರದ ಗೋಡೆಯ ಮೇಲೆ ಸಾರ್ವಜನಿಕವಾಗಿ ಪ್ರದರ್ಶಿಸಲಾಗುತ್ತದೆ.";
    case "te":
      return "⚠️ గమనిక: మీ శుభాకాంಕ್ಷలు మరియు పేరు అందరు అతిథులు చూడటానికి ఈ ఆహ్వాన గోడపై బహిరంగంగా ప్రదర్శించబడతాయి.";
    case "ta":
      return "⚠️ குறிப்பு: உங்கள் வாழ்த்து மற்றும் பெயர் அனைத்து விருந்தினர்களும் பார்க்கும் வகையில் இந்த அழைப்பிதழ் சுவரில் பகிரங்கமாக காட்டப்படும்.";
    case "ml":
      return "⚠️ കുറിപ്പ്: നിങ്ങളുടെ ആശംസയും പേരും എല്ലാ അതിഥികൾക്കും കാണാനായി ഈ ക്ഷണക്കത്ത് ചുവരിൽ പരസ്യമായി പ്രദർശിപ്പിക്കും.";
    case "en":
    default:
      return "⚠️ Note: Your wish and name will be displayed publicly on this invitation wall for all guests to see.";
  }
};

const formatEventDateTime = (rawDateTime: string) => {
  if (!rawDateTime) return "";
  try {
    const dateObj = new Date(rawDateTime);
    if (isNaN(dateObj.getTime())) {
      return rawDateTime;
    }
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return dateObj.toLocaleDateString("en-US", options);
  } catch (e) {
    return rawDateTime;
  }
};

export default function InvitationView({
  data,
  isDemoMode,
  onCloseDemo,
}: {
  data: Invitation;
  isDemoMode?: boolean;
  onCloseDemo?: () => void;
}) {
  const [envelopeStarted, setEnvelopeStarted] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeFinished, setEnvelopeFinished] = useState(false);

  // Prevent page scroll when the opening cover envelope is folded/active
  useEffect(() => {
    if (!envelopeFinished) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [envelopeFinished]);
  
  const [paymentId, setPaymentId] = useState(data.razorpayPaymentId || "");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
      }

      const options = {
        key: "rzp_live_T1cBBF0iEWb9ej",
        amount: 99900, // Amount in paise
        currency: "INR",
        name: "GetShaadiLink",
        description: "Premium Wedding Invitation Card",
        prefill: {
          email: data.ownerEmail || "",
        },
        theme: {
          color: "#8A3A1A",
        },
        handler: async function (response: any) {
          try {
            const res = await fetch(`/api/invitations/${data.slug}/update`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                password: data.editPassword,
                razorpayPaymentId: response.razorpay_payment_id,
              }),
            });
            const updateResult = await res.json();
            if (!res.ok) {
              throw new Error(updateResult.error || "Failed to update payment status.");
            }
            setPaymentId(response.razorpay_payment_id);
          } catch (err: any) {
            alert(err.message || "Failed to update payment status on the server.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Payment gateway error.");
      setIsProcessingPayment(false);
    }
  };

  const isPaid = !!paymentId || isDemoMode;
  
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 450], [0.65, 0.02]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  const renderDetailScrollAnimation = () => {
    switch (data.openingTheme) {
      case "jaipur":
        return <PalaceGateScrollAnimation brideName={data.bride} groomName={data.groom} />;
      case "lotus":
        return <LotusBlossomScrollAnimation brideName={data.bride} groomName={data.groom} />;
      case "diya":
        return <SkyLanternRiseScrollAnimation brideName={data.bride} groomName={data.groom} />;
      case "thread":
        return <GathbandhanKnotScrollAnimation brideName={data.bride} groomName={data.groom} />;
      case "garland":
        return <VarmalaExchangeScrollAnimation brideName={data.bride} groomName={data.groom} />;
      case "elephant":
      default:
        return <BalconyScrollAnimation brideName={data.bride} groomName={data.groom} />;
    }
  };

  const renderDetailDivider = () => {
    switch (data.openingTheme) {
      case "jaipur":
        return <MarigoldCurtainsDivider />;
      case "lotus":
        return <LotusLeafFloatingDivider />;
      case "diya":
        return <RotatingMandalaDiscDivider />;
      case "thread":
        return <TempleBellsDivider />;
      case "garland":
        return <MarigoldToranDivider />;
      case "elephant":
      default:
        return <AnimatedPeacock />;
    }
  };
  
  // Default to English story; only switch to regional if user explicitly chose a non-English language
  // AND the regional story content is actually different (i.e., was truly translated)
  const [activeTab, setActiveTab] = useState<"english" | "regional">("english");
  
  const [copied, setCopied] = useState(false);

  // Background Audio settings - redirecting any vocal templates to celebratory traditional wedding instrumentals
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Programmatic custom canvas marigold rain settings
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic live countdown clocks
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [noteName, setNoteName] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteError, setNoteError] = useState("");
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [notesList, setNotesList] = useState<any[]>(data.guestbookNotes || []);
  const [shagunAmount, setShagunAmount] = useState<number | null>(null);
  const [showQrForShagun, setShowQrForShagun] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track playlist tracks mapping - vocal song.mp3 is fully eliminated
  const audioMapping = {
    elephant: "/samples/pal_pal_dil_ke_paas.mp3",
    thread: "/samples/ek_pyar_ka_nagma_hai.mp3",
    diya: "/samples/janam_janam_ka_saath_hai.mp3",
    lotus: "/samples/gaata_rahe_mera_dil.mp3",
    jaipur: "/samples/main_shayar_to_nahin.mp3",
    garland: "/samples/aaja_sanam_madhur_chandni.mp3",
  };

  const targetAudio = audioMapping[data.openingTheme || "elephant"] || audioMapping.elephant;
  useEffect(() => {
    // Initialise audio stream
    const audio = new Audio(targetAudio);
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";
    audioRef.current = audio;

    if (musicPlaying) {
      audio.play().catch(err => console.log("Audio play blocked on transition", err));
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [targetAudio]);

  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying]);
  const toggleMusic = () => {
    playClickSound();
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(() => console.warn("Failed to play audio"));
    }
  };

  // Canvas Petals shower logic
  useEffect(() => {
    if (!envelopeFinished) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const themeType = data.openingTheme || "elephant";

    // Dynamic Petal class definition
    class Petal {
      x = Math.random() * width;
      // If diya, lanterns rise from bottom
      y = themeType === "diya" ? (Math.random() * height + height + 20) : (Math.random() * -height - 20);
      size = Math.random() * 8 + 5;
      speedY = themeType === "diya" 
        ? -(Math.random() * 1.0 + 0.5) // rise up
        : (Math.random() * 1.5 + 0.8); // fall down
      speedX = Math.random() * 0.8 - 0.4;
      rotation = Math.random() * 360;
      rotationSpeed = Math.random() * 2 - 1;
      
      // Determine color and particle style based on theme
      color = (() => {
        if (themeType === "diya") {
          // Warm gold/amber glowing lanterns
          return Math.random() > 0.5 ? "rgba(251, 191, 36, 0.75)" : "rgba(249, 115, 22, 0.7)";
        } else if (themeType === "lotus") {
          // Pure pink/rose lotus shades
          return Math.random() > 0.4 ? "rgba(244, 143, 177, 0.7)" : "rgba(236, 72, 153, 0.6)";
        } else if (themeType === "jaipur") {
          // Shiny gold leaf sparkles
          return Math.random() > 0.3 ? "rgba(212, 175, 55, 0.7)" : "rgba(253, 224, 71, 0.8)";
        } else if (themeType === "thread") {
          // Red-yellow details + rose petals
          const rand = Math.random();
          return rand < 0.4 ? "rgba(239, 68, 68, 0.7)" : (rand < 0.7 ? "rgba(234, 179, 8, 0.7)" : "rgba(244, 63, 94, 0.6)");
        } else {
          // Elephant/Garland: Marigold orange & yellow
          return Math.random() > 0.5 ? "rgba(249, 115, 22, 0.7)" : "rgba(234, 179, 8, 0.7)";
        }
      })();

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (themeType === "diya") {
          // Reset lantern when it floats off the top
          if (this.y < -20) {
            this.y = height + 20;
            this.x = Math.random() * width;
          }
        } else {
          // Reset petal when it falls off the bottom
          if (this.y > height) {
            this.y = -20;
            this.x = Math.random() * width;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (themeType === "jaipur") {
          // Draw a small 4-point sparkle star for gold dust
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(0, 0, this.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, this.size);
          ctx.quadraticCurveTo(0, 0, -this.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -this.size);
          ctx.fill();
        } else if (themeType === "diya") {
          // Draw a small sky lantern shape (rounded rectangle with a burning glow at the base)
          // Draw glow behind the lantern using a semi-transparent orange circle
          ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = this.color;
          ctx.beginPath();
          // Custom path for a rounded top lantern
          ctx.moveTo(-this.size/2 + 2, -this.size);
          ctx.lineTo(this.size/2 - 2, -this.size);
          ctx.quadraticCurveTo(this.size/2, -this.size, this.size/2, -this.size + 2);
          ctx.lineTo(this.size/2, this.size * 0.3);
          ctx.quadraticCurveTo(this.size/2, this.size * 0.5, this.size/2 - 2, this.size * 0.5);
          ctx.lineTo(-this.size/2 + 2, this.size * 0.5);
          ctx.quadraticCurveTo(-this.size/2, this.size * 0.5, -this.size/2, this.size * 0.3);
          ctx.lineTo(-this.size/2, -this.size + 2);
          ctx.quadraticCurveTo(-this.size/2, -this.size, -this.size/2 + 2, -this.size);
          ctx.fill();
          
          // Flame glow at the bottom center of lantern
          ctx.fillStyle = "rgba(255, 160, 0, 0.4)";
          ctx.beginPath();
          ctx.arc(0, this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();

          // Flame at the bottom center of lantern
          ctx.fillStyle = "rgba(255, 236, 179, 0.9)";
          ctx.beginPath();
          ctx.arc(0, this.size * 0.3, this.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard petal shape
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size/2, -this.size, this.size, 0, this.size);
          ctx.bezierCurveTo(this.size, this.size, this.size, -this.size/2, 0, 0);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const count = 35;
    const petals: Petal[] = [];
    for (let i = 0; i < count; i++) {
      petals.push(new Petal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((p) => {
        p.update();
        p.draw();
      });
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [data.openingTheme, envelopeFinished]);

  // Set up live countdown calculation
  useEffect(() => {
    let target = new Date(data.dateRaw || "");
    if (isNaN(target.getTime())) {
      target = new Date("2026-12-11T18:00:00");
    }

    const timer = setInterval(() => {
      const diff = +target - +new Date();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  // Master UI Multi-Language Translation Map
  const uiTranslations: Record<string, Record<string, string>> = {
    en: {
      days: "Days",
      hrs: "Hrs",
      min: "Min",
      sec: "Sec",
      weds: "weds",
      lagnaPatrika: "Lagna Patrika",
      blessingBlessings: "With the blessings of the divine and the love of our families",
      brideParents: "Bride's Parents:",
      groomParents: "Groom's Parents:",
      greetingsBlessings: "Greetings & Blessings:",
      ourEvents: "Our Events",
      addToCalendar: "🗓️ Add to Calendar",
      ourStory: "Our Story",
      meetCouple: "Meet the Couple",
      theBride: "The Bride",
      theGroom: "The Groom",
      ourGallery: "Our Gallery",
      venue: "Venue",
      openMaps: "📍 Open in Google Maps",
      galleryHub: "Gallery Hub",
      ourWeddingAlbum: "Our Wedding Album",
      weddingAlbumDesc: "Core memory photographs are being compiled! Click below to view official drive uploads or share your captures.",
      viewWeddingAlbum: "✨ View Wedding Album",
      blessingsShagun: "Blessings & Shagun",
      leaveBlessing: "Leave a Heartfelt Blessing",
      blessingDesc: "Write your loving wishes for our happy journey. Your greetings will instantly display on our blessings wall below!",
      yourName: "Your Name",
      namePlaceholder: "e.g., Uncle Suresh & Family",
      yourMessage: "Your Blessing Message",
      messagePlaceholder: "Wishing you both a lifetime of love, joy, and absolute togetherness! 💞",
      optionalShagun: "🎁 Add an Optional Shagun Gift",
      secureQr: "Secure QR generated for",
      scanUsing: "Scan using GooglePay, PhonePe, Paytm, or BHIM to pay instantly.",
      submitBlessing: "✨ Submit Blessing to Wall",
      postingBlessing: "Posting Blessing...",
      blessingsLedger: "📜 Blessings Ledger",
      noBlessings: "No blessings posted yet. Be the first! 🌸",
      whatsappInvite: "WhatsApp Invite",
      copyLink: "Copy Link",
      copied: "Copied! ✨",
      bestWishes: "With Best Wishes"
    },
    hi: {
      days: "दिन",
      hrs: "घंटे",
      min: "मिनट",
      sec: "सेकंड",
      weds: "संग",
      lagnaPatrika: "लग्न पत्रिका",
      blessingBlessings: "दिव्य आशीर्वाद और हमारे परिवारों के स्नेह के साथ",
      brideParents: "वधू के माता-पिता:",
      groomParents: "वर के माता-पिता:",
      greetingsBlessings: "शुभकामनाएं और आशीर्वाद:",
      ourEvents: "कार्यक्रम विवरण",
      addToCalendar: "🗓️ कैलेंडर में जोड़ें",
      ourStory: "हमारी कहानी",
      meetCouple: "वर-वधू से मिलें",
      theBride: "वधू",
      theGroom: "वर",
      ourGallery: "गैलरी",
      venue: "स्थान",
      openMaps: "📍 गूगल मैप्स में खोलें",
      galleryHub: "गैलरी हब",
      ourWeddingAlbum: "शादी का एल्बम",
      weddingAlbumDesc: "शादी के खूबसूरत पलों की तस्वीरें संकलित की जा रही हैं! हमारी ड्राइव पर तस्वीरें देखने या साझा करने के लिए नीचे क्लिक करें।",
      viewWeddingAlbum: "✨ शादी का एल्बम देखें",
      blessingsShagun: "आशीर्वाद और शगुन",
      leaveBlessing: "वर-वधू को आशीर्वाद दें",
      blessingDesc: "हमारी सुखद यात्रा के लिए अपनी प्यारी शुभकामनाएं लिखें। आपका संदेश तुरंत नीचे आशीर्वाद दीवार पर दिखाई देगा!",
      yourName: "आपका नाम",
      namePlaceholder: "जैसे: सुरेश चाचा और परिवार",
      yourMessage: "आपका आशीर्वाद संदेश",
      messagePlaceholder: "आप दोनों को जीवन भर प्यार, खुशी और एकजुटता की शुभकामनाएं! 💞",
      optionalShagun: "🎁 एक वैकल्पिक शगुन उपहार जोड़ें",
      secureQr: "सुरक्षित QR कोड जनरेट किया गया",
      scanUsing: "तुरंत भुगतान करने के लिए GooglePay, PhonePe, Paytm या BHIM का उपयोग करके स्कैन करें।",
      submitBlessing: "✨ दीवार पर आशीर्वाद पोस्ट करें",
      postingBlessing: "आशीर्वाद पोस्ट किया जा रहा है...",
      blessingsLedger: "📜 प्राप्त आशीर्वाद संदेश",
      noBlessings: "अभी तक कोई आशीर्वाद पोस्ट नहीं किया गया है। पहले बनें! 🌸",
      whatsappInvite: "व्हाट्सएप आमंत्रण",
      copyLink: "लिंक कॉपी करें",
      copied: "कॉपी हो गया! ✨",
      bestWishes: "शुभकामनाओं के साथ"
    },
    kn: {
      days: "ದಿನಗಳು",
      hrs: "ಗಂಟೆಗಳು",
      min: "ನಿಮಿಷಗಳು",
      sec: "ಸೆಕೆಂಡುಗಳು",
      weds: "ಮತ್ತು",
      lagnaPatrika: "ಲಗ್ನ ಪತ್ರಿಕೆ",
      blessingBlessings: "ದೈವಿಕ ಆಶೀರ್ವಾದ ಮತ್ತು ನಮ್ಮಕುಟುಂಬಗಳ ಪ್ರೀತಿಯೊಂದಿಗೆ",
      brideParents: "ವಧುವಿನ ಪೋಷಕರು:",
      groomParents: "ವರನ ಪೋಷಕರು:",
      greetingsBlessings: "ಶುಭಾಶಯಗಳು ಮತ್ತು ಆಶೀರ್ವಾದಗಳು:",
      ourEvents: "ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳು",
      addToCalendar: "🗓️ ಕ್ಯಾಲೆಂಡರ್ಗೆ ಸೇರಿಸಿ",
      ourStory: "ನಮ್ಮ ಪ್ರೇಮ ಕಥೆ",
      meetCouple: "ದಂಪತಿಗಳ ಪರಿಚಯ",
      theBride: "ವಧು",
      theGroom: "ವರ",
      ourGallery: "ನಮ್ಮ ಗ್ಯಾಲರಿ",
      venue: "ಕಲ್ಯಾಣ ಮಂಟಪ",
      openMaps: "📍 ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ನೋಡಿ",
      galleryHub: "ಗ್ಯಾಲರಿ ಹಬ್",
      ourWeddingAlbum: "ನಮ್ಮ ವಿವಾಹದ ಆಲ್ಬಮ್",
      weddingAlbumDesc: "ವಿವಾಹದ ಸುಂದರ ಕ್ಷಣಗಳ ಫೋಟೋಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಲಾಗುತ್ತಿದೆ! ನಮ್ಮ ಡ್ರೈವ್ ಲಿಂಕ್ ವೀಕ್ಷಿಸಲು ಅಥವಾ ನಿಮ್ಮ ಫೋಟೋಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
      viewWeddingAlbum: "✨ ವಿವಾಹ ಆಲ್ಬಮ್ ವೀಕ್ಷಿಸಿ",
      blessingsShagun: "ಆಶೀರ್ವಾದ ಮತ್ತು ಶಗುನ್",
      leaveBlessing: "ನಿಮ್ಮ ಹಾರೈಕೆಯನ್ನು ಸಲ್ಲಿಸಿ",
      blessingDesc: "ನಮ್ಮ ದಾಂಪತ್ಯ ಜೀವನಕ್ಕೆ ನಿಮ್ಮ ಪ್ರೀತಿಯ ಹಾರೈಕೆಯನ್ನು ಬರೆಯಿರಿ. ನಿಮ್ಮ ಸಂದೇಶವು ತಕ್ಷಣವೇ ಕೆಳಗಿನ ಆಶೀರ್ವಾದ ಗೋಡೆಯ ಮೇಲೆ ಪ್ರದರ್ಶಿಸಲ್ಪಡುತ್ತದೆ!",
      yourName: "ನಿಮ್ಮ ಹೆಸರು",
      namePlaceholder: "ಉದಾ: ಸುರೇಶ್ ಮಾವ ಮತ್ತು ಕುಟುಂಬ",
      yourMessage: "ನಿಮ್ಮ ಆಶೀರ್ವಾದ ಸಂದೇಶ",
      messagePlaceholder: "ನಿಮ್ಮಿಬ್ಬರ ದಾಂಪತ್ಯ ಜೀವನವು ಪ್ರೀತಿ, ಸಂತೋಷ ಮತ್ತು ನಲ್ಮೆಯಿಂದ ಕೂಡಿರಲಿ! 💞",
      optionalShagun: "🎁 ಸ್ವಯಂಪ್ರೇರಿತ ಶಗುನ್ ಉಡುಗೊರೆ ಸೇರಿಸಿ",
      secureQr: "ಸುರಕ್ಷಿತ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸೃಷ್ಟಿಸಲಾಗಿದೆ",
      scanUsing: "ತ್ವರಿತ ಪಾವತಿಗಾಗಿ GooglePay, PhonePe, Paytm ಅಥವಾ BHIM ಬಳಸಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.",
      submitBlessing: "✨ ಹಾರೈಕೆಯನ್ನು ಗೋಡೆಗೆ ಸಲ್ಲಿಸಿ",
      postingBlessing: "ಹಾರೈಕೆಯನ್ನು ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
      blessingsLedger: "📜 ಶುಭಾಶಯಗಳ ಪಟ್ಟಿ",
      noBlessings: "ಇನ್ನೂ ಯಾವುದೇ ಹಾರೈಕೆಗಳು ಬಂದಿಲ್ಲ. ಮೊದಲಿಗರಾಗಿರಿ! 🌸",
      whatsappInvite: "ವಾಟ್ಸಾಪ್ ಆಮಂತ್ರಣ",
      copyLink: "ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ",
      copied: "ಕಾಪಿ ಮಾಡಲಾಗಿದೆ! ✨",
      bestWishes: "ಶುಭಾಶಯಗಳೊಂದಿಗೆ"
    },
    ta: {
      days: "நாட்கள்",
      hrs: "மணி",
      min: "நிமிடம்",
      sec: "நொடி",
      weds: "மற்றும்",
      lagnaPatrika: "லக்ன பத்திரிகை",
      blessingBlessings: "இறைவனின் ஆசியோடும் மற்றும் எங்கள் குடும்பங்களின் அன்போடும்",
      brideParents: "மணமகளின் பெற்றோர்:",
      groomParents: "மணமகனின் பெற்றோர்:",
      greetingsBlessings: "வாழ்த்துகளும் ஆசிகளும்:",
      ourEvents: "எங்கள் நிகழ்ச்சிகள்",
      addToCalendar: "🗓️ நாட்காட்டியில் சேர்க்க",
      ourStory: "எங்கள் காதல் கதை",
      meetCouple: "மணமக்களை சந்தியுங்கள்",
      theBride: "மணமகள்",
      theGroom: "மணமகன்",
      ourGallery: "எங்கள் கேலரி",
      venue: "திருமண இடம்",
      openMaps: "📍 கூகுள் மேப்பில் பார்க்க",
      galleryHub: "கேலரி ஹப்",
      ourWeddingAlbum: "எங்கள் திருமண ஆல்பம்",
      weddingAlbumDesc: "திருமணத்தின் அழகான தருணங்கள் தொகுக்கப்படுகின்றன! எங்களின் டிரைவ் இணைப்பைக் காண அல்லது உங்கள் படங்களைப் பகிர கீழே கிளிக் செய்யவும்.",
      viewWeddingAlbum: "✨ திருமண ஆல்பத்தை பார்க்க",
      blessingsShagun: "வாழ்த்துகளும் அன்பளிப்பும்",
      leaveBlessing: "உங்கள் மனமார்ந்த வாழ்த்துகளை வழங்குக",
      blessingDesc: "எங்கள் மகிழ்ச்சியான பயணத்திற்கு உங்கள் அன்பான வாழ்த்துகளை எழுதுங்கள். உங்கள் வாழ்த்துக்கள் உடனடியாக கீழே உள்ள வாழ்த்துச் வரில் தோன்றும்!",
      yourName: "உங்கள் பெயர்",
      namePlaceholder: "உதாரணம்: சுரேஷ் மாமா மற்றும் குடும்பத்தினர்",
      yourMessage: "உங்கள் வாழ்த்துச் செய்தி",
      messagePlaceholder: "உங்கள் இருவருக்கும் வாழ்நாள் முழுவதும் அன்பு, மகிழ்ச்சி மற்றும் ஒற்றுமை நிலைக்க வாழ்த்துகிறோம்! 💞",
      optionalShagun: "🎁 விருப்பப்பட்டால் அன்பளிப்பு வழங்குக",
      secureQr: "பாதுகாப்பான QR குறியீடு உருவாக்கப்பட்டது",
      scanUsing: "உடனடியாக பணம் செலுத்த GooglePay, PhonePe, Paytm அல்லது BHIM மூலம் ஸ்கேன் செய்யவும்.",
      submitBlessing: "✨ வாழ்த்துகளை சுவரில் சமர்ப்பிக்க",
      postingBlessing: "வாழ்த்து சமர்ப்பிக்கப்படுகிறது...",
      blessingsLedger: "📜 பெற்றப்பட்ட வாழ்த்துக்கள்",
      noBlessings: "இதுவரை வாழ்த்துகள் எதுவும் வரவில்லை. நீங்களே முதல் நபராக வாழ்த்துங்கள்! 🌸",
      whatsappInvite: "வாட்ஸ்அப் அழைப்பு",
      copyLink: "இணைப்பை நகலெடுக்க",
      copied: "நகலெடுக்கப்பட்டது! ✨",
      bestWishes: "வாழ்த்துகளுடன்"
    },
    te: {
      days: "రోజులు",
      hrs: "గంటలు",
      min: "నిమిషాలు",
      sec: "సెకన్లు",
      weds: "మరియు",
      lagnaPatrika: "లగ్న పత్రిక",
      blessingBlessings: "దైవిక ఆశీస్సులు మరియు మా కుటుంబాల ప్రేమతో",
      brideParents: "వధువు తల్లిదండ్రులు:",
      groomParents: "వరుడి తల్లిదండ్రులు:",
      greetingsBlessings: "శుభాకాంక్షలు మరియు ఆశీస్సులు:",
      ourEvents: "మా వేడుకలు",
      addToCalendar: "🗓️ క్యాలెండర్లో చేర్చండి",
      ourStory: "మా ప్రేమ కథ",
      meetCouple: "వధూవరుల పరిచయం",
      theBride: "వధువు",
      theGroom: "వరుడు",
      ourGallery: "మా గ్యాలరీ",
      venue: "కళ్యాణ వేదిక",
      openMaps: "📍 గూగల్ మ్యాప్స్ లో చూడండి",
      galleryHub: "గ్యాలరీ హబ్",
      ourWeddingAlbum: "మా పెళ్లి ఆల్బమ్",
      weddingAlbumDesc: "పెళ్లి వేడుకల జ్ఞాపకాల ఫోటోలు సేకరించబడుతున్నాయి! డ్రైవ్ ఫోల్డర్ వీక్షించడానికి లేదా మీ ఫోటోలను పంచుకోవడానికి కింద క్లిక్ చేయండి.",
      viewWeddingAlbum: "✨ పెళ్లి ఆల్బమ్ చూడండి",
      blessingsShagun: "ఆశీస్సులు మరియు శగునం",
      leaveBlessing: "వధూవరులను ఆశీర్వదించండి",
      blessingDesc: "మా సంతోషకరమైన జీవిత ప్రయాణానికి మీ ప్రేమపూర్వక శుభాకాంక్షలు వ్రాయండి. మీ సందేశం కింద ఉన్న ఆశీర్వాద బోర్డుపై వెంటనే కనిపిస్తుంది!",
      yourName: "మీ పేరు",
      namePlaceholder: "ఉదాహరణకు: సురేష్ మామయ్య మరియు కుటుంబం",
      yourMessage: "మీ ఆశీర్వాద సందేశం",
      messagePlaceholder: "మీరిద్దరూ జీవితాంతం ప్రేమ, సంతోషం మరియు ఐక్యతతో వర్ధిల్లాలని ఆకాంక్షిస్తున్నాము! 💞",
      optionalShagun: "🎁 ఐచ్ఛిక శగునం బహుమతిని జోడించండి",
      secureQr: "సురక్షిత QR కోడ్ రూపొందించబడింది",
      scanUsing: "వెంటనే చెల్లింపు చేయడానికి GooglePay, PhonePe, Paytm లేదా BHIM ని ఉపయోగించి స్కాన్ చేయండి.",
      submitBlessing: "✨ బోర్డుపై ఆశీర్వాదం సమర్పించండి",
      postingBlessing: "ఆశీర్వాదం సమర్పించబడుతోంది...",
      blessingsLedger: "📜 లభించిన ఆశీస్సులు",
      noBlessings: "ఇంకా ఎలాంటి ఆశీస్సులు రాలేదు. మొదటి వ్యక్తి మీరే అవ్వండి! 🌸",
      whatsappInvite: "వాట్సాప్ ఆహ్వానం",
      copyLink: "లింక్ కాపీ చేయండి",
      copied: "కాపీ అయింది! ✨",
      bestWishes: "శుభాకాంక్షలతో"
    },
    ml: {
      days: "ദിവസങ്ങൾ",
      hrs: "മണിക്കൂർ",
      min: "മിനിറ്റ്",
      sec: "സെക്കൻഡ്",
      weds: "ഒപ്പം",
      lagnaPatrika: "ലഗ്ന പത്രിക",
      blessingBlessings: "ദൈവിക അനുഗ്രഹങ്ങളോടും ഞങ്ങളുടെ കുടുംബങ്ങളുടെ സ്നേഹത്തോടും കൂടി",
      brideParents: "വധുവിന്റെ മാതാപിതാക്കൾ:",
      groomParents: "വരന്റെ മാതാപിതാക്കൾ:",
      greetingsBlessings: "ആശംസകളും അനുഗ്രഹങ്ങളും:",
      ourEvents: "ഞങ്ങളുടെ ചടങ്ങുകൾ",
      addToCalendar: "🗓️ കലണ്ടറിലേക്ക് ചേർക്കുക",
      ourStory: "ഞങ്ങളുടെ പ്രണയകഥ",
      meetCouple: "ദമ്പതികളെ പരിചയപ്പെടാം",
      theBride: "വധു",
      theGroom: "വരൻ",
      ourGallery: "ഞങ്ങളുടെ ഗാലറി",
      venue: "വിവാഹ വേദി",
      openMaps: "📍 ഗൂഗിൾ മാപ്പിൽ തുറക്കുക",
      galleryHub: "ഗാലറി ഹബ്",
      ourWeddingAlbum: "ഞങ്ങളുടെ വിവാഹ ആൽബം",
      weddingAlbumDesc: "കല്യാണ ചടങ്ങുകളുടെ മനോഹരമായ ചിത്രങ്ങൾ ഇവിടെ പങ്കുവെക്കുന്നു! ഗാലറി കാണുന്നതിനായി താഴെ ക്ലിക്ക് ചെയ്യുക.",
      viewWeddingAlbum: "✨ വിവാഹ ആൽബം കാണുക",
      blessingsShagun: "അനുഗ്രഹങ്ങളും ഉപഹാരങ്ങളും",
      leaveBlessing: "നിങ്ങളുടെ ആശംസകൾ അറിയിക്കുക",
      blessingDesc: "ഞങ്ങളുടെ ദാമ്പത്യ ജീവിതത്തിന് നിങ്ങളുടെ മംഗളാശംസകൾ എഴുതുക. നിങ്ങളുടെ സന്ദേശം താഴെ കാണിക്കുന്നതാണ്!",
      yourName: "നിങ്ങളുടെ പേര്",
      namePlaceholder: "ഉദാഹരണത്തിന്: സുരേഷ് മാമനും കുടുംബവും",
      yourMessage: "നിങ്ങളുടെ സന്ദേശം",
      messagePlaceholder: "നിങ്ങൾക്ക് രണ്ടുപേർക്കും സ്നേഹവും സന്തോഷവും നിറഞ്ഞ ദാമ്പത്യജീവിതം ആശംസിക്കുന്നു! 💞",
      optionalShagun: "🎁 നിങ്ങളുടെ ഉപഹാരം സമർപ്പിക്കുക (തിരഞ്ഞെടുക്കാവുന്നത്)",
      secureQr: "സുരക്ഷിത QR കോഡ് തയ്യാറാക്കിയിരിക്കുന്നു",
      scanUsing: "പണമടയ്ക്കുന്നതിനായി ഗൂഗിൾപേ, ഫോൺപേ, പേടിഎം അല്ലെങ്കിൽ ഭീം ആപ്പ് വഴി സ്കാൻ ചെയ്യുക.",
      submitBlessing: "✨ ആശംസകൾ സമർപ്പിക്കുക",
      postingBlessing: "ആശംസകൾ സമർപ്പിക്കുന്നു...",
      blessingsLedger: "📜 ആശംസകളുടെ പട്ടിക",
      noBlessings: "ആരും ആശംസകൾ രേഖപ്പെടുത്തിയിട്ടില്ല. ആദ്യത്തെ ആളാകൂ! 🌸",
      whatsappInvite: "വാട്സാപ്പ് ക്ഷണം",
      copyLink: "ലിങ്ക് കോപ്പി ചെയ്യുക",
      copied: "കോപ്പി ചെയ്തു! ✨",
      bestWishes: "ആശംസകളോടെ"
    }
  };

  const t = (key: string): string => {
    const langCode = data.lang || "en";
    const dict = uiTranslations[langCode] || uiTranslations.en;
    return dict[key] || uiTranslations.en[key] || "";
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoteError("");
    setNoteSuccess(false);

    if (!noteName.trim() || !noteMessage.trim()) {
      setNoteError("Please fill in both Name and Blessing message!");
      return;
    }

    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/invitations/${data.slug}/add-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: noteName.trim(),
          message: noteMessage.trim(),
          amount: shagunAmount,
        }),
      });

      const parsed = await res.json();
      if (!res.ok) {
        throw new Error(parsed.error || "Failed to submit blessing note.");
      }

      setNotesList(parsed.notes);
      setNoteName("");
      setNoteMessage("");
      setShagunAmount(null);
      setShowQrForShagun(false);
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 5000);
    } catch (err: any) {
      setNoteError(err.message || "Failed to save note. Please try again.");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleOpenEnvelope = () => {
    setEnvelopeStarted(true);
    window.scrollTo(0, 0);
    audioRef.current?.play()
      .then(() => setMusicPlaying(true))
      .catch(() => console.log("Autoplay audio blocked"));

    setTimeout(() => {
      setEnvelopeOpen(true);
      setTimeout(() => {
        setEnvelopeFinished(true);
        window.scrollTo(0, 0);
      }, 1000);
    }, 400);
  };

  const copyInvitationLink = () => {
    playClickSound();
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    playClickSound();
    const shareText = `You're cordially invited to celebrate the wedding of *${data.bride} & ${data.groom}*! 🌸\n\n📅 Date: ${data.niceDate}\n📍 Venue: ${data.vname}, ${data.city}\n\nView the fully dynamic interactive wedding card here ✨:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const getRegionalFontClass = () => {
    switch (data.lang) {
      case "kn": return "font-kannada";
      case "hi": return "font-devanagari";
      case "ta": return "font-tamil";
      case "te": return "font-telugu";
      case "ml": return "font-malayalam";
      default: return "font-sans";
    }
  };

  const getWedsRegionalLabel = () => {
    switch (data.lang) {
      case "kn": return "ಮತ್ತು";
      case "hi": return "संग";
      case "ta": return "மற்றும்";
      case "te": return "మరియు";
      case "ml": return "ഒപ്പം";
      default: return "weds";
    }
  };

  const mapQuery = encodeURIComponent(`${data.vname} ${data.vaddr}`);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const themePrimary = data.theme?.primary || "#8A3A1A";
  const themeSecondary = data.theme?.secondary || "#C5A880";
  const themeAccent = data.theme?.accent || "#E6C252";

  return (
    <div className="relative overflow-x-hidden font-sans select-none min-h-screen bg-relief-pattern text-[#2C1810]">
      {/* Background Image is set to fade out slowly on scroll */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none select-none bg-cover bg-center bg-no-repeat"
        style={{ 
          opacity: bgOpacity,
          backgroundImage: data.photos && data.photos.length > 0 
            ? `url(${data.photos[0]})` 
            : `url('/samples/couple1.jpg')`
        }} 
      />

      {/* Floating animations style injections */}
      <style>{`
        @keyframes driftLeft {
          0%, 100% { transform: translate(0, 0) rotate(12deg) scale(1); }
          50% { transform: translate(15px, 20px) rotate(15deg) scale(1.03); }
        }
        @keyframes driftRight {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-20px, -15px) rotate(-3deg) scale(1.02); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 40s linear infinite;
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall 2s infinite linear;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Drifting background overlay images */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-[0.08] transition-opacity duration-1000">
        {/* Top-Left Floral Spray */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cover bg-no-repeat rotate-12 filter blur-[1px] animate-[driftLeft_20s_infinite_ease-in-out]"
             style={{ backgroundImage: `url('/samples/flowers.jpg')`, maskImage: 'radial-gradient(circle, black, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black, transparent 75%)', willChange: "transform" }} />
        
        {/* Bottom-Right Soft Mandap Overlay */}
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-cover bg-no-repeat filter blur-[1.5px] animate-[driftRight_25s_infinite_ease-in-out]"
             style={{ backgroundImage: `url('/samples/mandap.jpg')`, maskImage: 'radial-gradient(circle, black, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black, transparent 70%)', willChange: "transform" }} />
      </div>

      {/* Demo Mode Overlay banner */}
      {isDemoMode && (
        <div className="fixed top-0 inset-x-0 z-[600] bg-gradient-to-r from-brand-rust to-brand-terracotta text-white font-semibold text-xs tracking-wider uppercase text-center py-3.5 px-4 flex items-center justify-center gap-4 shadow-md">
          <span>💡 Live Preview Mode (Save 40% Active)</span>
          <button 
            onClick={onCloseDemo} 
            className="bg-white hover:bg-stone-100 text-[#8A3A1A] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-normal active:scale-95 transition-all cursor-pointer shadow"
          >
            ✕ Close Preview
          </button>
        </div>
      )}

      {/* Floating Canvas marigold petals */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-50" />

      {/* Envelope opening interaction */}
      <AnimatePresence>
        {!envelopeFinished && (
          <OpeningThemes
            theme={data.openingTheme || "elephant"}
            bride={data.bride}
            groom={data.groom}
            niceDate={data.niceDate}
            city={data.city}
            primaryColor={themePrimary}
            secondaryColor={themeSecondary}
            accentColor={themeAccent}
            bgStyle="#FAF6F0"
            heroEmoji="🌸"
            onOpen={handleOpenEnvelope}
            lang={data.lang || "en"}
            photo={data.photos && data.photos[0]}
          />
        )}
      </AnimatePresence>

      {/* Anchor Sound Controller button bottom-right */}
      <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-3">
        <button
          onClick={toggleMusic}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-brand-rust text-white shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-brand-gold/30"
          title={musicPlaying ? "Pause music" : "Play classical background music"}
        >
          {musicPlaying ? (
            <div className="flex items-end gap-[2px] h-[18px] w-[18px] justify-center pb-[2px]" style={{ transform: "rotate(0deg)" }}>
              <div className="w-[3px] bg-brand-gold rounded-full animate-equalizer-bar-1" />
              <div className="w-[3px] bg-brand-gold rounded-full animate-equalizer-bar-2" />
              <div className="w-[3px] bg-brand-gold rounded-full animate-equalizer-bar-3" />
              <div className="w-[3px] bg-brand-gold rounded-full animate-equalizer-bar-4" />
            </div>
          ) : (
            <VolumeX className="w-4.5 h-4.5 text-white/50" />
          )}
        </button>
      </div>

      {/* Invitation Core Vertical card-stack wrapper */}
      <main 
        className="relative z-10 w-full max-w-xl mx-auto px-4 py-12 flex flex-col items-center"
        style={{ display: envelopeFinished ? "flex" : "none" }}
      >
        
        {/* Floating background highlight glow - optimized to use radial gradient instead of slow filter blur */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(138,58,26,0.05) 0%, transparent 70%)" }} />

        {/* 1. COVER HERO DETAILS STACK - Upgraded to floating frosted card backing for absolute readability */}
        <section className="w-full text-center mt-8 mb-12 flex flex-col items-center bg-white/75 backdrop-blur-md border border-brand-rust/10 rounded-[32px] p-6 sm:p-8 shadow-paper relative">
          {/* Traditional om ornament */}
          <div className="flex items-center justify-center gap-1.5 mb-6 text-brand-rust">
            <span className="h-[1px] w-8 bg-brand-rust/10" />
            <span className="text-[12px] tracking-widest font-marcellus">囍</span>
            <span className="h-[1px] w-8 bg-brand-rust/10" />
          </div>

          <h1 className="font-cursive font-normal text-7xl sm:text-8xl text-brand-rust leading-tight">
            {data.bride}
            <span className="block font-cormorant italic text-3xl my-1 text-brand-gold">{t("weds")}</span>
            {data.groom}
          </h1>

          {data.lang !== "en" && (
            <p className={`text-base font-semibold mt-3 text-brand-rust/60 tracking-wider ${getRegionalFontClass()}`}>
              {data.bride} {getWedsRegionalLabel()} {data.groom}
            </p>
          )}

          <p className="mt-4 font-cormorant italic font-medium text-lg sm:text-xl text-brand-rust/70 px-4 max-w-sm">
            &ldquo;{data.tagline || "Two hearts, one beautiful journey begins today"}&rdquo;
          </p>

          <div className="mt-8 select-none flex flex-col items-center">
            <span className="text-[9.5px] font-marcellus text-brand-rust/40 tracking-[3px] uppercase font-bold block mb-1">
              Scroll to explore
            </span>
            <motion.span 
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-xs text-brand-rust/45"
            >
              ↓
            </motion.span>
          </div>
        </section>

        {/* 2. LAGNA PATRIKA CARD */}
        {(data.brideParents || data.groomParents || data.familyBlessings) && (
          <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
            {/* Embedded Ganesha graphic element (top) */}
            <div className="w-full flex justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-18 h-18 fill-none stroke-brand-rust/20 stroke-[1.2]">
                {/* Ganesha paper-cut outlines */}
                <path d="M50,20 C40,20 38,32 38,40 C38,50 48,55 48,65 C48,70 42,75 42,80 C48,82 52,82 58,80 C58,75 52,70 52,65 C52,55 62,50 62,40 C62,32 60,20 50,20 Z" />
                <path d="M44,45 Q50,48 56,45" />
                <circle cx="50" cy="30" r="1.5" className="fill-brand-rust/40" />
              </svg>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-[1px] w-8 bg-brand-rust/10" />
              <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("lagnaPatrika")}</span>
              <span className="h-[1px] w-8 bg-brand-rust/10" />
            </div>

            <p className="font-cormorant font-medium text-xs tracking-widest text-brand-rust/50 uppercase mb-4">
              {t("blessingBlessings")}
            </p>

            <div className="space-y-6">
              {data.brideParents && (
                <div>
                  <span className="text-[10px] font-marcellus tracking-widest text-brand-rust/60 uppercase block mb-1 font-semibold">{t("brideParents")}</span>
                  <p className="text-xl font-cormorant italic font-bold text-brand-rust leading-relaxed">
                    {data.brideParents}
                  </p>
                </div>
              )}

              {data.brideParents && data.groomParents && (
                <div className="w-6 h-[1px] bg-brand-rust/10 mx-auto" />
              )}

              {data.groomParents && (
                <div>
                  <span className="text-[10px] font-marcellus tracking-widest text-brand-rust/60 uppercase block mb-1 font-semibold">{t("groomParents")}</span>
                  <p className="text-xl font-cormorant italic font-bold text-brand-rust leading-relaxed">
                    {data.groomParents}
                  </p>
                </div>
              )}

              {data.familyBlessings && (
                <>
                  <div className="w-12 h-[1px] border-t border-dashed border-brand-rust/15 mx-auto" />
                  <div>
                    <span className="text-[9.5px] font-marcellus tracking-[2.5px] text-brand-rust/45 block mb-2 uppercase">{t("greetingsBlessings")}</span>
                    <p className="text-sm text-brand-rust/80 leading-relaxed max-w-sm mx-auto font-cormorant font-medium">
                      {data.familyBlessings}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* 3. WEDDING TIMELINE EVENTS */}
        <section 
          ref={timelineRef}
          className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden"
        >
          
          {/* Detailed dynamic theme divider */}
          {renderDetailDivider()}

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-brand-rust/10" />
            <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("ourEvents")}</span>
            <span className="h-[1px] w-8 bg-brand-rust/10" />
          </div>

          <div className="relative max-w-md mx-auto text-left pl-8 pr-2 pt-4 space-y-10">
            {/* Scroll-linked growing timeline vertical path */}
            <div className="absolute left-3.5 top-2 bottom-8 w-0.5 bg-brand-rust/10">
              <motion.div 
                style={{ scaleY: timelineScrollProgress, transformOrigin: "top" }}
                className="w-full h-full bg-gradient-to-b from-brand-rust via-brand-gold to-brand-rust" 
              />
            </div>

            {data.events.map((ev, idx) => {
              // Custom paper-cut event graphics
              let eventIcon = "🌸";
              let nodeIcon = "🌸";
              if (ev.name.toLowerCase().includes("haldi")) {
                nodeIcon = "🌼";
                eventIcon = (
                  <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#FFF9C4]/80 stroke-amber-600/30 stroke-[0.8] mx-auto">
                    <path d="M15,60 C15,80 35,90 50,90 C65,90 85,80 85,60 Z" />
                    <circle cx="50" cy="50" r="10" className="fill-amber-400" />
                    <circle cx="35" cy="53" r="8" className="fill-yellow-500" />
                    <circle cx="65" cy="53" r="8" className="fill-yellow-500" />
                  </svg>
                );
              } else if (ev.name.toLowerCase().includes("mehendi") || ev.name.toLowerCase().includes("mehndi")) {
                nodeIcon = "🌿";
                eventIcon = (
                  <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#E8D8CC] stroke-brand-rust/30 stroke-[0.8] mx-auto">
                    <path d="M50,90 L50,60 C48,50 35,45 35,30 C35,18 42,12 50,15 C58,12 65,18 65,30 C65,45 52,50 50,60 Z" />
                    <path d="M40,32 Q50,35 60,32" strokeDasharray="2,2" />
                  </svg>
                );
              } else {
                nodeIcon = "🔔";
                eventIcon = (
                  <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#ECEFF1] stroke-brand-rust/20 stroke-[0.8] mx-auto">
                    <path d="M35,25 L65,25 L50,55 L50,85 L65,85 L35,85" />
                    <circle cx="48" cy="35" r="2.5" className="fill-amber-400/50" />
                    <circle cx="53" cy="40" r="1.5" className="fill-amber-400/50" />
                  </svg>
                );
              }

              return (
                <div key={idx} className="relative pl-6">
                  {/* Timeline milestone node */}
                  <div className="absolute left-[-22px] top-1.5 z-20 flex items-center justify-center">
                    <motion.div 
                      whileInView={{ scale: [0.8, 1.15, 1], rotate: [0, 10, -10, 0] }}
                      viewport={{ once: false }}
                      className="w-5 h-5 rounded-full border-2 border-brand-rust bg-[#FAF6F0] flex items-center justify-center shadow-sm text-[8px] select-none"
                    >
                      {nodeIcon}
                    </motion.div>
                  </div>
                  
                  {/* Event content card */}
                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
                    className="bg-brand-rust/5 border border-brand-rust/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-inner border border-brand-rust/5">
                        {eventIcon}
                      </div>
                      <div>
                        <h4 className="font-marcellus text-base text-brand-rust font-bold">{ev.name}</h4>
                        {data.lang !== "en" && ev.regional && (
                          <p className={`text-xs text-brand-rust/60 mt-0.5 ${getRegionalFontClass()}`}>{ev.regional}</p>
                        )}
                        <p className="text-[10px] font-semibold font-marcellus mt-0.5" style={{ color: themePrimary }}>
                          {formatEventDateTime(ev.time)}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-brand-rust/70 leading-relaxed font-cormorant mb-3">{ev.note || "Join us in our celebrations."}</p>
                    
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        `${ev.name} — ${data.bride} & ${data.groom}`
                      )}&details=${encodeURIComponent(
                        `Join us in celebrating our wedding event ${ev.name} at ${data.vname}, ${data.city}.`
                      )}&location=${encodeURIComponent(`${data.vname}, ${data.vaddr}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8.5px] font-bold text-brand-rust bg-white border border-brand-rust/10 hover:bg-brand-rust/5 font-marcellus tracking-wider uppercase select-none active:scale-95 transition-transform"
                    >
                      {t("addToCalendar")}
                    </a>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. LOVE STORY CARD */}
        <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-brand-rust/10" />
            <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("ourStory")}</span>
            <span className="h-[1px] w-8 bg-brand-rust/10" />
          </div>

          {data.lang !== "en" && (
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => { playClickSound(); setActiveTab("english"); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${
                  activeTab === "english" ? "bg-brand-rust text-white shadow-sm" : "text-brand-rust/50 hover:bg-brand-rust/5"
                }`}
              >
                English
              </button>
              <button
                onClick={() => { playClickSound(); setActiveTab("regional"); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${getRegionalFontClass()} ${
                  activeTab === "regional" ? "bg-brand-rust text-white shadow-sm" : "text-brand-rust/50 hover:bg-brand-rust/5"
                }`}
              >
                {data.langNative}
              </button>
            </div>
          )}

          <div className="min-h-[110px] flex items-center justify-center px-2">
            {activeTab === "english" ? (
              <p className="text-lg sm:text-xl leading-relaxed text-brand-rust/80 font-cormorant italic font-medium">
                &ldquo;{data.storyEnglish}&rdquo;
              </p>
            ) : (
              <p className={`text-lg sm:text-xl leading-relaxed text-brand-rust/90 ${getRegionalFontClass()}`}>
                {data.storyRegional}
              </p>
            )}
          </div>
        </section>

        {/* 5. MEET THE COUPLE PERSONALITY BADGES & AVATARS */}
        <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-6">
          <span className="h-[1px] w-8 bg-brand-rust/10" />
          <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("meetCouple")}</span>
          <span className="h-[1px] w-8 bg-brand-rust/10" />
        </div>

        {renderDetailScrollAnimation()}

        {/* Personality Tags box */}
        <div className="flex flex-wrap gap-2.5 justify-center py-2 mt-6 border border-brand-rust/10 bg-brand-rust/5 rounded-2xl p-4 max-w-md mx-auto">
          {["HOPELESS ROMANTICS", "SOUL MATES", "BEST FRIENDS", "FOREVER & ALWAYS"].map((tag) => (
            <span key={tag} className="text-[9.5px] font-marcellus font-bold tracking-wider px-2.5 py-1 bg-white border border-[#8A3A1A]/10 text-brand-rust rounded-full shadow-sm hover:scale-105 transition-transform duration-200">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 3D Popout Photo Frame Showcase */}
      {data.photos && data.photos.length > 0 && (
        <PopoutPhotoFrame 
          photo={data.photos[0]} 
          themeType={data.openingTheme || "elephant"} 
          themeAccent={themeAccent} 
        />
      )}

      {/* 6. PHOTO GALLERY & MOMENTS CARD */}
      {data.photos && data.photos.length > 0 && (
        <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-[1px] w-8 bg-brand-rust/10" />
              <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("ourGallery")}</span>
              <span className="h-[1px] w-8 bg-brand-rust/10" />
            </div>

            <PhotoCarousel photos={data.photos} themeAccent={themeAccent} themeType={data.openingTheme || "elephant"} />
          </section>
        )}

        {/* 7. VENUE DETAILS CARD */}
        <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-brand-rust/10" />
            <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("venue")}</span>
            <span className="h-[1px] w-8 bg-brand-rust/10" />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-rust/5 text-brand-rust mb-4 shadow-inner">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-marcellus text-xl text-brand-rust mb-2">{data.vname}</h4>
            <p className="text-xs leading-relaxed text-brand-rust/60 mb-6 max-w-sm font-cormorant">{data.vaddr}</p>

            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-full text-[10px] font-marcellus font-bold uppercase tracking-widest text-brand-rust bg-brand-gold-light border border-brand-rust/15 hover:bg-brand-rust/5"
            >
              {t("openMaps")}
            </a>
          </div>
        </section>

        {/* 8. POST-WEDDING ALBUM HUB */}
        {data.postWeddingPhotosUrl && (
          <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-[1px] w-8 bg-brand-rust/10" />
              <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("galleryHub")}</span>
              <span className="h-[1px] w-8 bg-brand-rust/10" />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl block mb-4">📷</span>
              <h4 className="font-marcellus text-xl text-brand-rust mb-2">{t("ourWeddingAlbum")}</h4>
              <p className="text-sm leading-relaxed text-brand-rust/60 mb-6 max-w-sm font-cormorant">
                {t("weddingAlbumDesc")}
              </p>
              <a
                href={data.postWeddingPhotosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full text-[10px] font-marcellus font-bold uppercase tracking-widest text-white bg-brand-rust hover:bg-brand-rust/95 active:scale-95 shadow-sm"
              >
                <span>{t("viewWeddingAlbum")}</span>
              </a>
            </div>
          </section>
        )}

        {/* 9. GUESTBOOK & SHAGUN CARD */}
        <section className="w-full bg-white border border-brand-rust/10 rounded-[28px] p-6 sm:p-8 mb-8 shadow-paper text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-brand-rust/10" />
            <span className="font-marcellus text-[13px] sm:text-sm tracking-[4px] font-bold text-brand-gold uppercase">{t("blessingsShagun")}</span>
            <span className="h-[1px] w-8 bg-brand-rust/10" />
          </div>

          <h3 className="font-cursive text-4xl font-normal mb-2 text-brand-rust">{t("leaveBlessing")}</h3>
          <p className="text-sm text-brand-rust/50 max-w-xs mx-auto mb-6 leading-relaxed font-cormorant">
            {t("blessingDesc")}
          </p>

          <form onSubmit={handleAddNote} className="max-w-md mx-auto text-left space-y-4 mb-8">
            {noteError && (
              <div className="p-3 bg-red-50 border border-red-500/20 text-red-700 rounded-xl text-xs">
                ⚠️ {noteError}
              </div>
            )}
            {noteSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-700 rounded-xl text-xs font-semibold">
                🎉 Blessing posted successfully! Thank you!
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-marcellus tracking-widest text-brand-rust/80 uppercase font-bold">{t("yourName")}</label>
              <input
                type="text"
                required
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-marcellus tracking-widest text-brand-rust/80 uppercase font-bold">{t("yourMessage")}</label>
              <textarea
                required
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                className="w-full h-24 px-4 py-2.5 bg-[#FAF8F5] border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs resize-none"
              />
            </div>

            <p className="text-[9.5px] text-amber-800 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl leading-relaxed font-cormorant font-semibold select-none">
              {getWishNotice(data.lang || "en")}
            </p>

            {/* UPI QR generator with custom user-input shagun amount */}
            {data.upiId && (
              <div className="pt-2 border-t border-brand-rust/10">
                <span className="text-[10px] font-marcellus tracking-[2px] text-brand-gold uppercase block mb-1.5 font-bold">
                  {t("optionalShagun")}
                </span>
                <div className="flex flex-col gap-1.5 mb-3">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Custom Amount in ₹ (Optional)"
                    value={shagunAmount || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val) || val <= 0) {
                        setShagunAmount(null);
                        setShowQrForShagun(false);
                      } else {
                        setShagunAmount(val);
                        setShowQrForShagun(true);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                  />
                </div>

                {showQrForShagun && shagunAmount && (
                  <div className="p-6 rounded-[24px] bg-[#120E2B] border-2 border-brand-gold/60 flex flex-col items-center text-center mt-4 mb-2 shadow-paper relative overflow-hidden">
                    {/* Corner gold borders */}
                    <div className="absolute inset-1 border border-brand-gold/30 rounded-[20px] pointer-events-none" />
                    <div className="absolute inset-1.5 border border-brand-gold/10 border-dashed rounded-[18px] pointer-events-none" />
                    
                    {/* Title Banner */}
                    <span className="text-[8.5px] font-marcellus tracking-[3px] text-brand-gold uppercase block mb-3 font-bold z-10">
                      ✨ Scan to send Shagun ✨
                    </span>

                    {/* QR Code */}
                    <div className="relative p-2.5 bg-white rounded-xl border-4 border-brand-gold/50 shadow-inner z-10">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `upi://pay?pa=${data.upiId}&pn=${data.bride}%20And%20${data.groom}&am=${shagunAmount}&cu=INR&tn=Shagun%20from%20${encodeURIComponent(noteName || "Guest")}`
                        )}`}
                        alt="Honorary UPI QR"
                        className="w-28 h-28 object-contain rounded-sm"
                      />
                    </div>
                    
                    {/* Amount & Instructions */}
                    <div className="mt-3.5 z-10 space-y-1.5 w-full">
                      <p className="text-[11px] font-marcellus font-extrabold text-white tracking-wider">
                        Amount: ₹{shagunAmount}
                      </p>
                      <p className="text-[9px] text-brand-gold font-medium font-marcellus tracking-wider">
                        To: {data.bride} &amp; {data.groom}
                      </p>
                      <p className="text-[8.5px] text-stone-400 max-w-xs leading-relaxed font-cormorant pt-1.5 border-t border-white/10 mx-auto">
                        {t("scanUsing")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingNote}
              className="w-full py-3 rounded-full bg-brand-rust hover:bg-brand-rust/95 font-bold text-xs uppercase tracking-wider text-white shadow select-none cursor-pointer font-marcellus"
            >
              {submittingNote ? t("postingBlessing") : t("submitBlessing")}
            </button>
          </form>

          {/* RENDERING LIST OF NOTES */}
          <div className="max-w-md mx-auto space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <span className="text-[10px] font-marcellus tracking-widest text-brand-rust/45 block mb-2 uppercase font-bold">
              {t("blessingsLedger")} ({notesList.length})
            </span>
            {notesList.length === 0 ? (
              <p className="text-xs text-brand-rust/30 py-6 italic select-none font-cormorant">{t("noBlessings")}</p>
            ) : (
              notesList.map((nt, index) => (
                <div key={nt.id || index} className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-rust/10 text-left text-brand-rust relative shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cursive text-xl font-normal text-brand-rust">{nt.name}</span>
                  </div>
                  <p className="text-sm text-brand-rust/70 leading-relaxed font-cormorant font-medium">{nt.note || nt.message}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* CREDIT FOOTER */}
        <footer className="w-full text-center mt-8 pt-12 pb-24 border-t border-brand-rust/10 select-none">
          <p className="font-marcellus font-bold text-brand-rust tracking-[4px] text-lg uppercase mb-1">
            {data.bride} &amp; {data.groom}
          </p>
          <p className="text-[10px] uppercase tracking-[3px] text-brand-rust/35 mt-1 mb-8 font-marcellus">
            {t("bestWishes")} 🙏
          </p>
          {isPaid && (
            <p className="text-[10px] tracking-widest text-brand-rust/30 font-marcellus">
              Beautiful wedding websites crafted with ❤️ by{" "}
              <a href="/" className="underline hover:text-brand-rust/50 font-bold">
                GetShaadilink.in
              </a>
            </p>
          )}
        </footer>

      </main>

      {/* Floating Action Drawer Panel or Payment Bar at bottom */}
      {!isPaid ? (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF6F0] border-t border-brand-rust/20 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center px-6 py-3 sm:py-0 sm:h-16 max-w-2xl mx-auto shadow-lg select-none gap-2">
          <p className="text-[11px] font-marcellus font-bold text-brand-rust tracking-wider text-center sm:text-left">
            Your invitation is ready! Pay ₹999 to make it live and shareable.
          </p>
          <button
            onClick={handlePayNow}
            disabled={isProcessingPayment}
            className="flex items-center gap-1.5 py-2 px-5 rounded-full bg-brand-rust hover:bg-brand-rust/90 font-bold text-[10px] tracking-wider uppercase text-white shadow active:scale-95 transition-transform duration-100 cursor-pointer font-marcellus disabled:opacity-50"
          >
            {isProcessingPayment ? (
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            )}
            <span>{isProcessingPayment ? "Processing..." : "Pay Now"}</span>
          </button>
        </div>
      ) : (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF6F0]/95 border-t border-brand-rust/10 backdrop-blur-md flex justify-around items-center h-16 max-w-2xl mx-auto shadow-lg select-none">
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-emerald-700 hover:bg-emerald-600 font-bold text-[10px] tracking-wider uppercase text-white shadow active:scale-95 transition-transform duration-100 cursor-pointer font-marcellus"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t("whatsappInvite")}</span>
          </button>

          <button
            onClick={copyInvitationLink}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-full hover:bg-brand-rust/5 font-bold text-[10px] tracking-wider uppercase text-brand-rust border border-brand-rust/15 active:scale-95 transition-transform duration-100 cursor-pointer font-marcellus"
          >
            {copied ? <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t("copied") : t("copyLink")}</span>
          </button>
        </div>
      )}

    </div>
  );
}
