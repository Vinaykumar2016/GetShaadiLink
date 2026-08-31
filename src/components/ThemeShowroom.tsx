import React from "react";
import { Sparkles, ArrowRight, Eye, Wand2 } from "lucide-react";
import { playClickSound } from "../utils/soundUtils";

interface ThemeShowroomProps {
  onSelectTheme: (themeStyle: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => void;
  onLaunchDemo: (themeStyle: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => void;
}

export default function ThemeShowroom({ onSelectTheme, onLaunchDemo }: ThemeShowroomProps) {
  const themes = [
    {
      id: "jaipur",
      name: "Royal Palace",
      tagline: "Soft pastels and palace architecture, made for royalty.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #FFD5B4 0%, #FFB3A7 100%)" }}>
            <div className="absolute inset-1.5 border border-amber-600/35 rounded-[22px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <div className="flex w-16 h-20 mb-2 relative">
                {/* Left Door */}
                <div className="w-1/2 h-full overflow-hidden">
                  <svg viewBox="0 0 100 160" className="w-full h-full">
                    <path d="M 0,160 L 100,160 L 100,0 C 70,25 30,30 0,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
                    <path d="M 8,150 L 92,150 L 92,10 C 65,30 35,35 8,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>
                </div>
                {/* Right Door */}
                <div className="w-1/2 h-full overflow-hidden">
                  <svg viewBox="0 0 100 160" className="w-full h-full">
                    <path d="M 100,160 L 0,160 L 0,0 C 30,25 70,30 100,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
                    <path d="M 92,150 L 8,150 L 8,10 C 35,30 65,35 92,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>
                </div>
              </div>
              <span className="font-marcellus text-[9px] text-[#8A3A1A] font-bold tracking-[2.5px] uppercase">Royal Palace</span>
              <span className="font-cursive text-xl text-[#8A3A1A] mt-2 block whitespace-nowrap">Karan &amp; Aditi</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#8A3A1A] text-white text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #FFD5B4 0%, #FFB3A7 50%, #FAF6F0 100%)" }}
          >
            <div className="absolute inset-1.5 border border-amber-600/35 rounded-[22px] pointer-events-none" />
            <div className="absolute inset-2 border-[0.5px] border-amber-600/15 border-dashed rounded-[20px] pointer-events-none" />
            <svg viewBox="0 0 100 40" className="absolute top-0 inset-x-0 w-full h-8 fill-none stroke-amber-600/30 stroke-[0.6] overflow-visible">
              <path d="M-10,25 Q50,-5 110,25" />
            </svg>
            <div className="text-[12px] mb-1 z-10">🏵️</div>
            <div className="inv-om" style={{ color: "rgba(138,58,26,0.6)" }}>ॐ · SHUBH VIVAH</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Karan</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-[#8A3A1A]/70 text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Aditi</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(138,58,26,0.4), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(138,58,26,0.75)" }}>DECEMBER 8, 2026</div>
            <div className="inv-city" style={{ color: "rgba(138,58,26,0.5)" }}>UDAIPUR, RAJASTHAN</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF6F0, #FFF5EE)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#8A3A1A" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(138,58,26,0.7)" }}>
              They met during a beautiful winter evening. What began as a simple friendship soon bloomed into a deep, everlasting love.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#FFF5EE" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/couple1.jpg" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/couple2.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#FFF5EE" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#FFB3A7", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Haldi Rasam</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.55)" }}>Dec 6 · 10:00 AM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#8A3A1A", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.55)" }}>Dec 7 · 7:00 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#FFD5B4", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🌸</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Shubh Vivah</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.55)" }}>Dec 8 · 11:30 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #FFF5EE, #FFEAD4)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>185</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>12</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>40</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "diya",
      name: "Midnight Diya",
      tagline: "A grand night celebration with deep tones and regal lights.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #0A0413 0%, #170C2A 100%)" }}>
            <div className="absolute inset-1.5 border border-amber-400/20 rounded-[22px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <span className="text-3xl mb-2 animate-pulse-glow">🪔</span>
              <span className="font-marcellus text-[9px] text-amber-400 font-bold tracking-[2.5px] uppercase">Midnight Diya</span>
              <span className="font-cursive text-xl text-white mt-2 block whitespace-nowrap">Kabir &amp; Riya</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #0A0413 0%, #170C2A 50%, #0F091E 100%)" }}
          >
            <div className="absolute inset-1.5 border border-amber-400/20 rounded-[22px] pointer-events-none" />
            <div className="text-[18px] mb-1 z-10">🪔</div>
            <div className="inv-om" style={{ color: "rgba(255,180,0,0.65)" }}>OM · SHUBH VIVAH</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-white font-semibold text-center">Kabir</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-amber-300 text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-white font-semibold text-center">Riya</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(255,180,0,0.4), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(255,180,0,0.75)" }}>DECEMBER 12, 2026</div>
            <div className="inv-city" style={{ color: "rgba(255,255,255,0.4)" }}>TAJ PALACE, MUMBAI</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #0F091E, #0A0015)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#FFD700", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#F0EBE0" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(240,235,224,0.5)" }}>
              A beautiful journey that started with a simple, unexpected meeting. Years of shared dreams, laughter, and support later, they decided to start their forever.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#0A0015" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#FFD700", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/couple2.jpg" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/mandap.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#0A0015" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#FFD700", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#FFD700", background: "rgba(255,255,255,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#F0EBE0" }}>Haldi Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(240,235,224,0.35)" }}>Dec 10 · 4:00 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#FF6B9D", background: "rgba(255,255,255,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#F0EBE0" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(240,235,224,0.35)" }}>Dec 11 · 7:00 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#9C27B0", background: "rgba(255,255,255,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🪔</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#F0EBE0" }}>Wedding Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(240,235,224,0.35)" }}>Dec 12 · 10:30 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #0A0015, #140924)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(255,180,0,0.15)", background: "rgba(255,255,255,0.03)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#FFD700" }}>189</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(240,235,224,0.3)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(255,180,0,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(255,180,0,0.15)", background: "rgba(255,255,255,0.03)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#FFD700" }}>08</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(240,235,224,0.3)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(255,180,0,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(255,180,0,0.15)", background: "rgba(255,255,255,0.03)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#FFD700" }}>15</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(240,235,224,0.3)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "lotus",
      name: "Temple Lotus",
      tagline: "Minimal, refined, and quietly luxurious temple gates.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #FAF8F5 0%, #F4EFE6 100%)" }}>
            <div className="absolute inset-1.5 border border-brand-rust/15 rounded-[22px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <span className="text-3xl mb-2">🪷</span>
              <span className="font-marcellus text-[9px] text-[#8A3A1A] font-bold tracking-[2.5px] uppercase">Temple Lotus</span>
              <span className="font-cursive text-xl text-[#8A3A1A] mt-2 block whitespace-nowrap">Dev &amp; Ishika</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#8A3A1A] text-white text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF8F5 0%, #F4EFE6 50%, #FAF6F0 100%)" }}
          >
            <div className="absolute inset-1.5 border border-brand-rust/15 rounded-[22px] pointer-events-none" />
            <div className="text-[12px] mb-1 z-10">🪷</div>
            <div className="inv-om" style={{ color: "rgba(138,58,26,0.6)" }}>THE WEDDING CELEBRATION</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Dev</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-[#C5A880] text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Ishika</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(138,58,26,0.25), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(138,58,26,0.75)" }}>NOVEMBER 18, 2026</div>
            <div className="inv-city" style={{ color: "rgba(138,58,26,0.5)" }}>LALIT MANDIR, BANGALORE</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF6F0, #FAF9F6)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#8A3A1A" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(138,58,26,0.6)" }}>
              Woven together with trust, laughter, and endless conversations under temple arches. Five years of shared dreams culminate here.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#FAF9F6" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/couple_realistic.png" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/flowers.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#FAF9F6" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#C5A880", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Haldi Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Nov 16 · 10:00 AM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#8A3A1A", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Nov 17 · 7:00 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#FAF6F0", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🪷</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Wedding Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Nov 18 · 10:00 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF9F6, #F5EFE4)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>165</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>22</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>10</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "elephant",
      name: "Royal Elephant",
      tagline: "Carved sandstone windows, lush marigolds, and peacocks.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #FAF6F0 0%, #F5EFEB 100%)" }}>
            <div className="absolute inset-1.5 border border-amber-900/20 rounded-[22px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <div className="flex gap-2 w-20 h-12 mb-2 justify-center">
                <svg viewBox="0 0 120 100" className="w-10 h-10 scale-x-[-1]">
                  <defs>
                    <linearGradient id="sandstone-ele-showroom-left" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FAD8B7" />
                      <stop offset="50%" stopColor="#D49A6A" />
                      <stop offset="100%" stopColor="#9E6738" />
                    </linearGradient>
                  </defs>
                  <path d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" fill="url(#sandstone-ele-showroom-left)" stroke="#825229" strokeWidth="0.8" />
                  <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#D32F2F" />
                  <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#FFB300" />
                </svg>
                <svg viewBox="0 0 120 100" className="w-10 h-10">
                  <defs>
                    <linearGradient id="sandstone-ele-showroom-right" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FAD8B7" />
                      <stop offset="50%" stopColor="#D49A6A" />
                      <stop offset="100%" stopColor="#9E6738" />
                    </linearGradient>
                  </defs>
                  <path d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" fill="url(#sandstone-ele-showroom-right)" stroke="#825229" strokeWidth="0.8" />
                  <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#D32F2F" />
                  <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#FFB300" />
                </svg>
              </div>
              <span className="font-marcellus text-[9px] text-[#8A3A1A] font-bold tracking-[2.5px] uppercase">Royal Elephant</span>
              <span className="font-cursive text-xl text-[#8A3A1A] mt-2 block whitespace-nowrap">Arjun &amp; Priyanka</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#8A3A1A] text-white text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF6F0 0%, #F5EFEB 50%, #E8D8CC 100%)" }}
          >
            <div className="absolute inset-1.5 border border-amber-900/20 rounded-[22px] pointer-events-none" />
            <div className="text-[12px] mb-1 z-10">🦚</div>
            <div className="inv-om" style={{ color: "rgba(138,58,26,0.6)" }}>VIVAH INVITATION</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Arjun</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-[#C5A880] text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-[#8A3A1A] font-semibold text-center">Priyanka</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(138,58,26,0.3), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(138,58,26,0.75)" }}>DECEMBER 28, 2026</div>
            <div className="inv-city" style={{ color: "rgba(138,58,26,0.5)" }}>FORT HERITAGE, JAIPUR</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #E8D8CC, #F5EFEB)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#8A3A1A" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(138,58,26,0.6)" }}>
              Under the starlit sky of Rajasthan, surrounded by heritage domes and music, they promised each other a lifetime of adventures.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#F5EFEB" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/couple1.jpg" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/mandap.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#F5EFEB" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#8A3A1A", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#D5A082", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Haldi Rasam</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Dec 26 · 11:00 AM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#8A3A1A", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Dec 27 · 6:30 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#E8D8CC", background: "rgba(138,58,26,0.03)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🐘</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#8A3A1A" }}>Shubh Vivah</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(138,58,26,0.5)" }}>Dec 28 · 10:00 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #F5EFEB, #EAD1BE)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>205</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>15</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(138,58,26,0.2)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(138,58,26,0.15)", background: "rgba(255,255,255,0.4)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#8A3A1A" }}>30</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(138,58,26,0.4)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "thread",
      name: "Sacred Knot",
      tagline: "Classic red and yellow cotton tassels with swinging bells.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #FFF5F2 0%, #FFE6DB 100%)" }}>
            <div className="absolute inset-1.5 border border-red-700/15 rounded-[22px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <svg viewBox="0 0 100 140" className="w-14 h-20 mb-1">
                <path d="M 50,0 Q 48,15 49,30" stroke="#D32F2F" strokeWidth="2" fill="none" />
                <path d="M 50,0 Q 52,15 51,30" stroke="#FFB300" strokeWidth="1" strokeDasharray="2,2" fill="none" />
                <path d="M 45,30 C 35,25 35,40 48,35 C 60,30 60,45 50,40" stroke="#D32F2F" strokeWidth="2.5" fill="none" />
                <path d="M 55,30 C 65,25 65,40 52,35 C 40,30 40,45 50,40" stroke="#FFB300" strokeWidth="1.5" fill="none" />
                <path d="M 50,40 L 50,55" stroke="#D32F2F" strokeWidth="1.5" fill="none" />
                <g transform="translate(50, 50)">
                  <circle cx="0" cy="8" r="4" fill="none" stroke="#FFB300" strokeWidth="1.5" />
                  <path d="M -10,22 C -10,10 10,10 10,22 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="0.8" />
                  <path d="M -10,22 L -13,42 C -13,45 13,45 13,42 L 10,22 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="0.8" />
                </g>
              </svg>
              <span className="font-marcellus text-[9px] text-[#991B1B] font-bold tracking-[2.5px] uppercase">Sacred Knot</span>
              <span className="font-cursive text-xl text-[#991B1B] mt-2 block whitespace-nowrap">Vikram &amp; Pooja</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#991B1B] text-white text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #FFF5F2 0%, #FFE6DB 50%, #FAF6F0 100%)" }}
          >
            <div className="absolute inset-1.5 border border-red-700/15 rounded-[22px] pointer-events-none" />
            <div className="text-[12px] mb-1 z-10">🔔</div>
            <div className="inv-om" style={{ color: "rgba(185,28,28,0.6)" }}>SACRED UNION</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-[#991B1B] font-semibold text-center">Vikram</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-[#DC2626] text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-[#991B1B] font-semibold text-center">Pooja</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(185,28,28,0.3), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(185,28,28,0.75)" }}>DECEMBER 14, 2026</div>
            <div className="inv-city" style={{ color: "rgba(185,28,28,0.5)" }}>GRAND LAWN, HYDERABAD</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF6F0, #FFF9F7)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#991B1B", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#991B1B" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(185,28,28,0.6)" }}>
              A bond woven with laughter, trust, and beautiful cotton threads of friendship. Together we choose to embark on our greatest adventure.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#FFF9F7" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#991B1B", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/flowers.jpg" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/couple2.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#FFF9F7" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#991B1B", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#EF4444", background: "rgba(220,38,38,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#991B1B" }}>Haldi Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(185,28,28,0.5)" }}>Dec 12 · 10:00 AM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#991B1B", background: "rgba(220,38,38,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#991B1B" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(185,28,28,0.5)" }}>Dec 13 · 7:00 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#FFE6DB", background: "rgba(220,38,38,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🔔</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#991B1B" }}>Sacred Union</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(185,28,28,0.5)" }}>Dec 14 · 11:00 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #FFF9F7, #FFE5D9)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(220,38,38,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#991B1B" }}>191</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(185,28,28,0.4)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(220,38,38,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(220,38,38,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#991B1B" }}>09</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(185,28,28,0.4)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(220,38,38,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(220,38,38,0.12)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#991B1B" }}>20</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(185,28,28,0.4)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "garland",
      name: "Marigold Garland",
      tagline: "Lush orange-yellow flowers, mango leaves, and paper diyas.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "Save 50%",
      bgBezel: "bg-cover bg-center relative",
      contentMock: (
        <>
          {/* 0. COVER SECTION */}
          <div className="inv-cover-mock" style={{ background: "linear-gradient(to bottom, #E8F5E9 0%, #FAF6F0 100%)" }}>
            <div className="absolute inset-1.5 border border-emerald-800/15 rounded-[22px] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 w-full flex justify-center h-16">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="0" y="0" width="200" height="100" fill="#8B0000" />
                <path d="M 0,20 Q 50,85 100,85 Q 150,85 200,20" fill="none" stroke="#FF8F00" strokeWidth="6" strokeLinecap="round" />
                <path d="M 0,20 Q 50,85 100,85 Q 150,85 200,20" fill="none" stroke="#FFC107" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" />
                <circle cx="15" cy="27" r="5" fill="#FF6F00" />
                <circle cx="35" cy="40" r="5.5" fill="#FF8F00" />
                <circle cx="60" cy="62" r="6" fill="#FF6F00" />
                <circle cx="85" cy="78" r="6.5" fill="#FF8F00" />
                <circle cx="100" cy="80" r="7" fill="#FF6F00" />
                <circle cx="115" cy="78" r="6.5" fill="#FF8F00" />
                <circle cx="140" cy="62" r="6" fill="#FF6F00" />
                <circle cx="165" cy="40" r="5.5" fill="#FF8F00" />
                <circle cx="185" cy="27" r="5" fill="#FF6F00" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full mt-4">
              <span className="font-marcellus text-[9px] text-[#065F46] font-bold tracking-[2.5px] uppercase">Marigold Garland</span>
              <span className="font-cursive text-xl text-[#065F46] mt-2 block whitespace-nowrap">Siddharth &amp; Neha</span>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#065F46] text-white text-[6px] tracking-widest uppercase font-bold shadow-sm">✉️ OPEN INVITATION</div>
            </div>
          </div>

          {/* 1. HERO SECTION */}
          <div 
            className="inv-hero-mock" 
            style={{ background: "linear-gradient(to bottom, #E8F5E9 0%, #FAF6F0 50%, #FAF6F0 100%)" }}
          >
            <div className="absolute inset-1.5 border border-emerald-800/15 rounded-[22px] pointer-events-none" />
            <div className="text-[12px] mb-1 z-10">🌸</div>
            <div className="inv-om" style={{ color: "rgba(6,95,70,0.6)" }}>VIVAH MAHOTSAV</div>
            
            <div className="z-10 flex flex-col items-center select-none">
              <h4 className="font-cursive text-[20px] leading-tight text-[#065F46] font-semibold text-center">Siddharth</h4>
              <span className="font-cormorant italic text-[9px] my-0.5 text-[#10B981] text-center">weds</span>
              <h4 className="font-cursive text-[20px] leading-tight text-[#065F46] font-semibold text-center">Neha</h4>
            </div>
            
            <div className="inv-line" style={{ background: "linear-gradient(to right, transparent, rgba(6,95,70,0.25), transparent)" }} />
            <div className="inv-date" style={{ color: "rgba(6,95,70,0.75)" }}>DECEMBER 20, 2026</div>
            <div className="inv-city" style={{ color: "rgba(6,95,70,0.5)" }}>HYATT REGENCY, PUNE</div>
          </div>

          {/* 2. STORY SECTION */}
          <div 
            className="inv-story-mock" 
            style={{ background: "linear-gradient(to bottom, #FAF6F0, #F1FBF2)" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#065F46", opacity: 0.8 }}>Our Story</div>
            <div className="inv-sec-h-mock" style={{ color: "#065F46" }}>How it began...</div>
            <div className="inv-story-txt-mock" style={{ color: "rgba(6,95,70,0.6)" }}>
              Two souls, one beautiful journey. Together under marigold garlands we share our vow of laughter, partnership, and forever love.
            </div>
          </div>

          {/* 3. GALLERY SECTION */}
          <div 
            className="inv-gallery-mock" 
            style={{ background: "#F1FBF2" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#065F46", opacity: 0.8 }}>Moments</div>
            <div className="inv-gallery-grid-mock">
              <img src="/samples/couple_realistic.png" alt="Couple 1" className="inv-gallery-img-mock" />
              <img src="/samples/couple1.jpg" alt="Couple 2" className="inv-gallery-img-mock" />
            </div>
          </div>

          {/* 4. EVENTS SECTION */}
          <div 
            className="inv-events-mock" 
            style={{ background: "#F1FBF2" }}
          >
            <div className="inv-sec-tag-mock" style={{ color: "#065F46", opacity: 0.8, marginBottom: "8px" }}>The Celebrations</div>
            <div className="inv-ev-mock" style={{ "--ec": "#10B981", background: "rgba(6,95,70,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💛</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#065F46" }}>Haldi Ceremony</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(6,95,70,0.5)" }}>Dec 18 · 11:00 AM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#065F46", background: "rgba(6,95,70,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">💃</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#065F46" }}>Sangeet Night</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(6,95,70,0.5)" }}>Dec 19 · 7:30 PM</div>
              </div>
            </div>
            <div className="inv-ev-mock" style={{ "--ec": "#FAF6F0", background: "rgba(6,95,70,0.02)" } as React.CSSProperties}>
              <div className="inv-ev-emo-mock">🌸</div>
              <div>
                <div className="inv-ev-nm-mock" style={{ color: "#065F46" }}>Vivah Sanskar</div>
                <div className="inv-ev-tm-mock" style={{ color: "rgba(6,95,70,0.5)" }}>Dec 20 · 10:30 AM</div>
              </div>
            </div>
          </div>

          {/* 5. COUNTDOWN SECTION */}
          <div 
            className="inv-cd-mock" 
            style={{ background: "linear-gradient(to bottom, #F1FBF2, #D0EAD4)" }}
          >
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(6,95,70,0.15)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#065F46" }}>197</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(6,95,70,0.4)" }}>Days</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(6,95,70,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(6,95,70,0.15)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#065F46" }}>11</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(6,95,70,0.4)" }}>Hours</span>
            </div>
            <div className="inv-cd-sep-mock" style={{ color: "rgba(6,95,70,0.15)" }}>:</div>
            <div className="inv-cd-b-mock" style={{ borderColor: "rgba(6,95,70,0.15)", background: "rgba(255,255,255,0.5)" }}>
              <span className="inv-cd-n-mock" style={{ color: "#065F46" }}>45</span>
              <span className="inv-cd-l-mock" style={{ color: "rgba(6,95,70,0.4)" }}>Mins</span>
            </div>
          </div>
        </>
      )
    }
  ] as const;

  const handleDemoClick = (themeId: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => {
    playClickSound();
    onLaunchDemo(themeId);
  };

  const handleBuildClick = (themeId: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => {
    playClickSound();
    onSelectTheme(themeId);
  };

  return (
    <div className="w-full space-y-12 select-none">
      {/* Sticky Catalog Header Details */}
      <div className="sticky top-[73px] z-40 bg-[#060414]/95 border-y border-white/10 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-center flex-wrap items-center gap-1.5 sm:gap-4 text-[9.5px] sm:text-[10px] uppercase font-cinzel text-stone-300/80 font-semibold tracking-wider">
          <span>Every design includes</span>
          <span className="text-white/20">•</span>
          <span className="text-amber-400 font-bold">Invitation Web Page</span>
          <span className="text-white/20">•</span>
          <span className="text-amber-400 font-bold">RSVP Registry</span>
          <span className="text-white/20">•</span>
          <span className="text-amber-400 font-bold">Photo Gallery</span>
          <span className="text-white/20">•</span>
          <span className="text-amber-400 font-bold">Owner Dashboard</span>
        </div>
      </div>

      {/* Showroom Title */}
      <div className="text-center space-y-2">
        <h2 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
          Explore Digital Invitations
        </h2>
        <p className="text-xs text-stone-400 max-w-sm mx-auto">
          Choose a visual cover style to begin. Watch the live interactive animations in one click.
        </p>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6">
        {themes.map((t) => (
          <div
            key={t.id}
            id={`theme-card-${t.id}`}
            className="shimmer-card rounded-[32px] bg-white/5 border border-white/10 p-6 flex flex-col justify-between shadow-2xl hover:border-amber-400/40 transition-all transition-transform duration-300 relative group overflow-hidden backdrop-blur-md"
          >
            {/* Phone Bezel Container */}
            <div
              className="w-full flex justify-center mb-6 pt-2 cursor-pointer"
              onClick={() => handleDemoClick(t.id)}
              title="Click to watch demo"
            >
              <div className="w-[180px] h-[320px] rounded-[36px] border-[5px] border-stone-800 bg-[#08000F] relative shadow-lg overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 group-hover:scale-[1.02] group-hover:-translate-y-1">
                {/* Dynamic screen content */}
                <div className="showroom-phone-screen">
                  <div className="showroom-scroll-track">
                    {t.contentMock}
                  </div>
                </div>
                {/* iPhone Dynamic Island / Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-stone-900 rounded-full z-30" />
                {/* iPhone Home Indicator bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-stone-900/40 rounded-full z-30" />
              </div>
            </div>

            {/* Description Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-marcellus text-lg font-bold tracking-wide text-amber-400">
                  {t.name}
                </h3>
                <p className="text-[11.5px] text-stone-300/80 leading-relaxed min-h-[36px] mt-1.5">
                  {t.tagline}
                </p>
              </div>

              {/* Pricing Line */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] text-stone-500 line-through font-semibold">₹{t.originalPrice}</span>
                <span className="text-lg font-display font-extrabold text-white">₹{t.offerPrice}</span>
                <span className="text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.badge}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => handleBuildClick(t.id)}
                className="w-full py-3 rounded-xl font-cinzel font-bold text-[10px] tracking-wider uppercase text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Customize Free ✦</span>
              </button>
              
              <button
                onClick={() => handleDemoClick(t.id)}
                className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-[10px] text-stone-200 flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98"
              >
                <span>▶ Watch demo →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
