import { useState, useEffect, useRef } from "react";
import { Invitation } from "./types";
import BuilderForm from "./components/BuilderForm";
import InvitationView from "./components/InvitationView";
import ThemeShowroom from "./components/ThemeShowroom";
import UserDashboard from "./components/UserDashboard";
import { playClickSound } from "./utils/soundUtils";
import { Sparkles, Heart, Check, Copy, Share2, ArrowRight, Wand2, Eye, EyeOff, Calendar, Volume2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Simple state-based router based on location path
  const [slug, setSlug] = useState<string | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<"pricing" | "terms" | "privacy" | "refund" | null>(null);
  const [invitationData, setInvitationData] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Management Login Portal States
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginSlug, setLoginSlug] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [editingData, setEditingData] = useState<Invitation | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Account Dashboard upgraded states
  const [loginMode, setLoginMode] = useState<"slug" | "email">("slug");
  const [loginEmail, setLoginEmail] = useState("");
  const [dashboardUserCards, setDashboardUserCards] = useState<any[]>([]);
  const [loggedInCardData, setLoggedInCardData] = useState<Invitation | null>(null);

  // Theme Showcase showroom selections
  const [preselectedFormTheme, setPreselectedFormTheme] = useState<"elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland" | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [stats, setStats] = useState<{ totalGenerated: number; rating: number }>({ totalGenerated: 0, rating: 4.9 });

  // Hero interactive simulator selected theme
  const [heroActiveTheme, setHeroActiveTheme] = useState<"elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland">("jaipur");

  // Falling petals canvas ref on landing page
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-cycling bezel simulator states & helpers
  const [simSlide, setSimSlide] = useState(0);
  const [savedScrollY, setSavedScrollY] = useState(0);
  const [lastPreviewedTheme, setLastPreviewedTheme] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Restore scroll position when returning to landing page
  useEffect(() => {
    if (!slug) {
      if (lastPreviewedTheme) {
        let attempts = 0;
        const interval = setInterval(() => {
          const cardEl = document.getElementById(`theme-card-${lastPreviewedTheme}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
            clearInterval(interval);
          } else {
            attempts++;
            if (attempts >= 25) {
              clearInterval(interval);
              if (savedScrollY > 0) window.scrollTo(0, savedScrollY);
            }
          }
        }, 50);
        setLastPreviewedTheme(null);
        return () => clearInterval(interval);
      } else if (savedScrollY > 0) {
        window.scrollTo(0, savedScrollY);
        
        let attempts = 0;
        const interval = setInterval(() => {
          window.scrollTo(0, savedScrollY);
          attempts++;
          if (attempts >= 20 || window.scrollY === savedScrollY) {
            clearInterval(interval);
          }
        }, 50);
        
        return () => clearInterval(interval);
      }
    }
  }, [slug, savedScrollY, lastPreviewedTheme]);


  const themeStyles = {
    jaipur: {
      bg: "linear-gradient(to bottom, #FFD5B4, #FAF6F0)",
      text: "#8A3A1A",
      accent: "#E6C252",
      isDark: false,
    },
    diya: {
      bg: "linear-gradient(to bottom, #0A0413, #170C2A)",
      text: "#F4EFE6",
      accent: "#FFE082",
      isDark: true,
    },
    lotus: {
      bg: "linear-gradient(to bottom, #FFF5F7, #FAF0F2)",
      text: "#C2185B",
      accent: "#E91E63",
      isDark: false,
    },
    elephant: {
      bg: "linear-gradient(to bottom, #FAF6F0, #E8D8CC)",
      text: "#8A3A1A",
      accent: "#D4A843",
      isDark: false,
    },
    thread: {
      bg: "linear-gradient(to bottom, #FAF8F5, #F5EFEB)",
      text: "#8B0000",
      accent: "#C5A880",
      isDark: false,
    },
    garland: {
      bg: "linear-gradient(to bottom, #E8F5E9, #FAF6F0)",
      text: "#FFA500",
      accent: "#10B981",
      isDark: false,
    }
  };

  const renderSimSlide = () => {
    const activeStyle = themeStyles[heroActiveTheme as keyof typeof themeStyles] || themeStyles.jaipur;
    const brideName = "Aditi";
    const groomName = "Karan";
    const dateStr = "11 December 2026";
    const cityStr = "Jodhpur";

    switch (simSlide) {
      case 0:
        const activePhoto = heroSimulatorConfig[heroActiveTheme as keyof typeof heroSimulatorConfig]?.photo || "/samples/couple1.jpg";
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="slide0"
            className="absolute inset-0 flex flex-col justify-between p-4 pt-10 select-none text-center relative overflow-hidden"
          >
            {/* Background Couple Photo with Frosted Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={activePhoto} 
                alt="Couple Background" 
                className="w-full h-full object-cover opacity-80"
              />
              <div 
                className="absolute inset-0 backdrop-blur-[1px]" 
                style={{ 
                  background: activeStyle.isDark 
                    ? "linear-gradient(to bottom, rgba(8, 2, 19, 0.9) 0%, rgba(8, 2, 19, 0.65) 60%, rgba(8, 2, 19, 0.95) 100%)"
                    : "linear-gradient(to bottom, rgba(250, 246, 240, 0.85) 0%, rgba(250, 246, 240, 0.55) 60%, rgba(250, 246, 240, 0.95) 100%)"
                }}
              />
            </div>

            <div className="absolute inset-2 border border-dashed rounded-[28px] pointer-events-none opacity-30 z-10" style={{ borderColor: activeStyle.text }} />

            {/* Simulated nav bar */}
            <div 
              className="absolute top-8 inset-x-0 z-30 flex justify-around px-4 text-[4.5px] font-bold tracking-widest font-marcellus opacity-85 select-none" 
              style={{ color: activeStyle.text }}
            >
              <span className="border-b-[1px] pb-0.5" style={{ borderColor: activeStyle.text }}>LIVE</span>
              <span>RSVP</span>
              <span>STORY</span>
              <span>REGISTRY</span>
              <span>TIMELINE</span>
            </div>
            
            <div className="z-10 mt-4">
              <span className="text-[6px] tracking-[3px] uppercase block font-marcellus opacity-75" style={{ color: activeStyle.text }}>Shubh Vivah</span>
              <h4 className="text-xl font-cursive font-normal leading-tight mt-1" style={{ color: activeStyle.text }}>
                {brideName}
                <span className="block text-[10px] font-serif italic my-0.5 opacity-65">weds</span>
                {groomName}
              </h4>
            </div>

            <div className="flex-1 flex items-center justify-center relative my-1 overflow-visible z-10">
              {heroActiveTheme === "jaipur" && (
                <div className="w-full flex items-center justify-center overflow-hidden relative h-20">
                  <motion.div
                    animate={{ x: [-3, -35, -3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-6 w-10 h-16 bg-[#8A3A1A] border-r-2 border-amber-500 rounded-l-lg shadow-sm"
                  />
                  <motion.div
                    animate={{ x: [3, 35, 3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-6 w-10 h-16 bg-[#8A3A1A] border-l-2 border-amber-500 rounded-r-lg shadow-sm"
                  />
                  <span className="text-lg z-0 drop-shadow-md">🌸</span>
                </div>
              )}

              {heroActiveTheme === "diya" && (
                <div className="flex flex-col items-center relative overflow-visible scale-90">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 fill-none stroke-amber-400/35 stroke-[0.8] animate-spin-slow absolute">
                    <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
                  </svg>
                  <div className="relative w-16 h-12 flex items-center justify-center overflow-visible">
                    <svg viewBox="0 0 100 60" className="w-14 h-10 text-amber-800 fill-current absolute bottom-0">
                      <path d="M10,20 C10,20 20,50 50,50 C80,50 90,20 90,20 C90,20 75,35 50,35 C25,35 10,20 10,20 Z" />
                    </svg>
                    <motion.div
                      animate={{ scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, 2, -2, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute top-1.5 w-3 h-5 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-t-full shadow-[0_0_10px_orange]"
                      style={{ transformOrigin: "bottom center" }}
                    />
                  </div>
                </div>
              )}

              {heroActiveTheme === "lotus" && (
                <div className="relative w-24 h-20 flex items-end justify-center overflow-visible scale-90">
                  <motion.svg
                    animate={{ rotate: [-20, 0, -20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    viewBox="0 0 50 100" className="w-6 h-12 absolute text-pink-500 fill-current drop-shadow"
                    style={{ transformOrigin: "bottom center", left: "15%" }}
                  >
                    <path d="M50,100 C30,90 0,60 0,35 C0,15 25,0 50,25 Z" />
                  </motion.svg>
                  <motion.svg
                    animate={{ rotate: [20, 0, 20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    viewBox="0 0 50 100" className="w-6 h-12 absolute text-pink-500 fill-current drop-shadow"
                    style={{ transformOrigin: "bottom center", right: "15%", transform: "scaleX(-1)" }}
                  >
                    <path d="M50,100 C30,90 0,60 0,35 C0,15 25,0 50,25 Z" />
                  </motion.svg>
                  <svg
                    viewBox="0 0 60 100" className="w-8 h-14 absolute text-pink-600 fill-current drop-shadow-md"
                    style={{ transformOrigin: "bottom center" }}
                  >
                    <path d="M30,100 C15,85 0,60 0,35 C0,15 15,0 30,20 C45,0 60,15 60,35 C60,60 45,85 30,100 Z" />
                  </svg>
                </div>
              )}
              {heroActiveTheme === "elephant" && (
                <div className="w-full flex justify-around px-4 relative items-center z-10 scale-90">
                  <motion.span
                    animate={{ x: [-4, 4, -4], rotate: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    🐘
                  </motion.span>
                  <span className="text-base opacity-50 font-bold" style={{ color: activeStyle.text }}>囍</span>
                  <motion.span
                    animate={{ x: [4, -4, 4], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    🐘
                  </motion.span>
                </div>
              )}

              {heroActiveTheme === "thread" && (
                <div className="flex flex-col items-center relative overflow-visible scale-90">
                  <div className="absolute top-[-25px] w-24 h-0.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-60" />
                  <motion.div
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="flex flex-col items-center origin-top mt-[-10px]"
                  >
                    <div className="w-[1px] h-8 bg-red-600" />
                    <span className="text-2xl drop-shadow-md">🔔</span>
                  </motion.div>
                </div>
              )}

              {heroActiveTheme === "garland" && (
                <div className="w-full flex flex-col items-center relative overflow-visible scale-90">
                  <div className="w-32 h-6 flex justify-around items-center border-b border-dashed border-emerald-800/10 mb-2">
                    <span className="text-[10px] animate-pulse">🌼</span>
                    <span className="text-[10px] animate-pulse" style={{ animationDelay: "0.5s" }}>🌸</span>
                    <span className="text-[10px] animate-pulse" style={{ animationDelay: "1s" }}>🌼</span>
                  </div>
                  <motion.div 
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="text-2xl flex gap-1 z-10"
                  >
                    <span>🌸</span>
                    <span>🤝</span>
                    <span>🌸</span>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="mb-6 z-10 flex flex-col items-center">
              <span className="text-[7px] uppercase tracking-wider block opacity-80 font-bold" style={{ color: activeStyle.text }}>
                {dateStr} • {cityStr}
              </span>
              <motion.div
                animate={{ scale: [1, 1.05, 1], shadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 8px 15px rgba(251,191,36,0.3)", "0 4px 6px rgba(0,0,0,0.1)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-3 px-4 py-1.5 rounded-full border text-[7.5px] tracking-widest font-marcellus font-bold shadow-md cursor-pointer"
                style={{ backgroundColor: activeStyle.isDark ? "#FFE082" : "#8A3A1A", color: activeStyle.isDark ? "#060414" : "#FFFFFF", borderColor: activeStyle.accent }}
              >
                ✉️ OPEN INVITATION
              </motion.div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="slide1"
            className="absolute inset-0 bg-[#FFF9F2] flex flex-col justify-between p-4 pt-10 text-center select-none"
          >
            <div className="mt-2">
              <span className="text-[7px] tracking-[3px] uppercase block font-marcellus text-[#8A3A1A]/60">Together Forever</span>
              <h4 className="text-xl font-cursive font-normal text-[#8A3A1A] mt-1">{brideName} &amp; {groomName}</h4>
            </div>

            <div className="relative w-56 h-36 border-[4px] border-[#D7CCC8] bg-white rounded-t-full shadow-inner overflow-hidden flex items-end justify-center mx-auto my-2">
              <div className="absolute inset-0 border-2 border-dashed border-[#A1887F]/30 rounded-t-full pointer-events-none" />
              
              <motion.div
                animate={{ x: [-45, -5, -45], y: [0, -1, 0, -1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 z-10 w-10 h-18"
              >
                <svg viewBox="0 0 100 150" className="w-full h-full text-[#8A3A1A] fill-current">
                  <path d="M42,28 C28,45 20,80 20,130 C28,135 38,135 45,130 C43,90 41,55 48,44 Z" opacity="0.6" />
                  <circle cx="45" cy="32" r="5" />
                  <circle cx="50" cy="27" r="1.5" fill="#FFE082" />
                  <path d="M54,34 Q57,35 55,38 Z" fill="#FFE082" />
                  <path d="M48,30 C53,30 55,33 53,37 C51,39 52,43 49,43 L47,43 Z" />
                  <path d="M47,51 C45,55 44,60 45,65 L54,65 C55,60 54,55 51,51 Z" />
                  <path d="M45,65 C41,75 30,105 24,130 C35,135 65,135 76,130 C70,105 59,75 54,65 Z" />
                  <path d="M44,65 Q49,67 55,65" stroke="#FFE082" strokeWidth="2.5" fill="none" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ x: [45, 5, 45], y: [0, -1, 0, -1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 z-10 w-10 h-18"
                style={{ scaleX: -1 }}
              >
                <svg viewBox="0 0 100 150" className="w-full h-full text-[#5D4037] fill-current">
                  <path d="M42,22 C42,15 58,15 58,22 C59,25 57,28 50,28 C43,28 41,25 42,22 Z" />
                  <path d="M50,15 Q52,6 54,12 Q52,15 50,15 Z" fill="#FFE082" />
                  <circle cx="50" cy="33" r="7.5" />
                  <path d="M47,40 Q50,42 53,40 L51,48 L49,48 Z" />
                  <path d="M44,48 C40,52 38,62 38,72 L38,125 C45,127 55,127 62,125 L62,72 Z" />
                  <path d="M40,78 Q50,80 60,78" stroke="#FFE082" strokeWidth="2" fill="none" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6], y: [-10, -40, -10] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 z-20 text-xl"
              >
                💖
              </motion.div>

              <div className="absolute bottom-0 inset-x-0 h-6 bg-[#E0D8D0] border-t-2 border-[#A1887F] z-25 flex items-center justify-around px-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-4 border-x border-[#A1887F]/40 bg-[#FAF6F0]/20 rounded-sm" />
                ))}
              </div>
            </div>

            <div className="mb-10 text-center">
              <span className="text-[7.5px] font-marcellus tracking-[2px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                Walk Closer Walk Together
              </span>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="slide2"
            className="absolute inset-0 bg-[#FAF6F0] flex flex-col justify-between p-4 pt-10 select-none text-left"
          >
            <div className="text-center">
              <span className="text-[7px] tracking-[3px] uppercase block font-marcellus text-amber-950/60">CELEBRATION TIME</span>
              
              <div className="flex gap-2 justify-center my-2.5 text-brand-rust">
                <div className="flex flex-col items-center">
                  <span className="text-base font-bold leading-none font-mono">190</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Days</span>
                </div>
                <span className="text-xs font-bold leading-none font-mono">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-base font-bold leading-none font-mono">07</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Hrs</span>
                </div>
                <span className="text-xs font-bold leading-none font-mono">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-base font-bold leading-none font-mono">45</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Min</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-[210px] mx-auto relative pl-4 pr-1 py-1 space-y-3 mt-1 overflow-hidden">
              <div className="absolute left-1.5 top-0 bottom-4 w-[1px] bg-brand-rust/20" />
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-brand-rust/5 border border-brand-rust/10 rounded-xl p-2 relative text-[7.5px]"
              >
                <div className="absolute left-[-15.5px] top-2.5 w-2 h-2 rounded-full bg-yellow-500 border border-brand-rust" />
                <h5 className="font-bold font-marcellus text-brand-rust text-[8.5px]">Haldi Ceremony</h5>
                <p className="text-[#8A3A1A] font-medium font-marcellus mt-0.5">Dec 11, 10:00 AM</p>
                <p className="text-stone-500 font-cormorant leading-tight mt-0.5">Golden saffron paste and family laughter.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-brand-rust/5 border border-brand-rust/10 rounded-xl p-2 relative text-[7.5px]"
              >
                <div className="absolute left-[-15.5px] top-2.5 w-2 h-2 rounded-full bg-red-600 border border-brand-rust" />
                <h5 className="font-bold font-marcellus text-brand-rust text-[8.5px]">Wedding Muhurtham</h5>
                <p className="text-[#8A3A1A] font-medium font-marcellus mt-0.5">Dec 12, 06:30 PM</p>
                <p className="text-stone-500 font-cormorant leading-tight mt-0.5">Sacred vows and Shehnai under the stars.</p>
              </motion.div>
            </div>

            <div className="mb-6 text-center select-none">
              <span className="text-[7.5px] font-marcellus tracking-[1.5px] text-stone-400 font-bold uppercase">
                Add RSVP and Registry Ledger
              </span>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.totalGenerated === "number") {
            setStats(data);
          }
        }
      } catch (err) {
        console.error("Failed to load statistics", err);
      }
    };
    fetchStats();
  }, []);

  // Landing page marigold/rose petal animation shower
  useEffect(() => {
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

    class Petal {
      x = Math.random() * width;
      y = Math.random() * -height - 20;
      size = Math.random() * 6 + 4;
      speedY = Math.random() * 0.8 + 0.4;
      speedX = Math.random() * 0.4 - 0.2;
      rotation = Math.random() * 360;
      rotationSpeed = Math.random() * 1.2 - 0.6;
      color = Math.random() > 0.5 
        ? `rgba(${Math.floor(Math.random() * 20) + 235}, ${Math.floor(Math.random() * 30) + 140}, 20, 0.45)` // Orange Toran marigold
        : `rgba(244, 63, 94, 0.35)`; // Soft rose petal

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size/2, -this.size, this.size, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size/2, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    const count = 25;
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
  }, []);

  // Determine path on startup & support direct URL access to /demo-preview
  useEffect(() => {
    const path = window.location.pathname;
    const cleanSlug = path.split("/").filter(Boolean)[0];
    const ignoredSlugs = ["index.html", "index", "api", "assets", "favicon.ico", "vite"];

    if (cleanSlug && !ignoredSlugs.includes(cleanSlug.toLowerCase()) && !cleanSlug.includes(".")) {
      const slugVal = cleanSlug.toLowerCase();
      setSlug(slugVal);
      if (slugVal === "demo-preview") {
        handleLaunchDemo("jaipur");
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch invitation block if slug is present
  useEffect(() => {
    if (!slug) return;
    if (slug === "demo-preview") {
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations/${slug}`);
        if (res.ok) {
          const parsed = await res.json();
          setInvitationData(parsed);
        } else {
          setSlug(null);
        }
      } catch (err) {
        console.error("Failed to load invitation", err);
        setSlug(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  const handleLoginVerify = async () => {
    setLoginError("");
    setDashboardUserCards([]);
    playClickSound();

    if (loginMode === "slug") {
      if (!loginSlug.trim()) {
        setLoginError("Please enter your invitation slug name.");
        return;
      }
      setLoginLoading(true);

      try {
        const res = await fetch(`/api/invitations/${loginSlug.trim()}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: loginPassword }),
        });

        const parsed = await res.json();
        if (!res.ok) throw new Error(parsed.error || "Authentication failed.");

        setLoggedInCardData(parsed.data);
        setLoginOpen(false);
        setSuccessSlug(null);
      } catch (err: any) {
        setLoginError(err.message || "Invalid passcode or link name. Check details.");
      } finally {
        setLoginLoading(false);
      }
    } else {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setLoginError("Please enter both Email and Passcode.");
        return;
      }
      setLoginLoading(true);

      try {
        const res = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });

        const parsed = await res.json();
        if (!res.ok) throw new Error(parsed.error || "Login validation failed.");

        setDashboardUserCards(parsed.invitations);
      } catch (err: any) {
        setLoginError(err.message || "Invalid Email or Passcode combination.");
      } finally {
        setLoginLoading(false);
      }
    }
  };

  const handleSelectCardForDashboard = async (cardSlug: string) => {
    playClickSound();
    setLoginLoading(true);
    try {
      const res = await fetch(`/api/invitations/${cardSlug}?admin=true`);
      if (res.ok) {
        const parsed = await res.json();
        if (parsed.editPassword === loginPassword) {
          setLoggedInCardData(parsed);
          setLoginOpen(false);
          setDashboardUserCards([]);
        } else {
          setLoginError("Error opening card data.");
        }
      }
    } catch (err) {
      setLoginError("Error connecting to card server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLaunchDemo = (themeStyle: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => {
    // Save current window scroll position before opening demo
    setSavedScrollY(window.scrollY);
    setLastPreviewedTheme(themeStyle);

    setIsDemoMode(true);
    setSlug("demo-preview");
    
    // Sync browser address bar URL path to /demo-preview
    if (window.location.pathname !== "/demo-preview") {
      window.history.pushState({}, "", "/demo-preview");
    }

    const mockThemeColors = {
      elephant: { name: "Royal Elephant", primary: "#963E1C", secondary: "#C5A880", accent: "#E6C252", bg: "#FAF6F0", heroEmoji: "🐘" },
      thread: { name: "Sacred Knot", primary: "#8B0000", secondary: "#C5A880", accent: "#E6C252", bg: "#FAF6F0", heroEmoji: "🧵" },
      diya: { name: "Midnight Diya", primary: "#E65100", secondary: "#C5A880", accent: "#F59E0B", bg: "#FAF6F0", heroEmoji: "🪔" },
      lotus: { name: "Temple Lotus", primary: "#D81B60", secondary: "#C5A880", accent: "#FF80AB", bg: "#FAF6F0", heroEmoji: "🪷" },
      jaipur: { name: "Royal Palace", primary: "#8B3A1C", secondary: "#C5A880", accent: "#FFE082", bg: "#FAF6F0", heroEmoji: "🏰" },
      garland: { name: "Marigold Garland", primary: "#FFA500", secondary: "#C5A880", accent: "#10B981", bg: "#FAF6F0", heroEmoji: "🌸" },
    };

    const targetTheme = mockThemeColors[themeStyle] || mockThemeColors.elephant;

    const mockData: Invitation = {
      slug: "demo-preview",
      bride: "Aditi",
      groom: "Karan",
      niceDate: "December 11, 2026",
      city: "Udaipur",
      vname: "Royal Palace Resort",
      vaddr: "Lake Palace Road, Udaipur, Rajasthan 313001",
      storyEnglish: "We first met on a beautiful afternoon, sharing a quiet moment and a smile. What began as an accidental meeting soon blossomed into a wonderful journey of shared dreams, laughter, and support. Today, we are taking our most beautiful step forward, together.",
      storyRegional: "We first met on a beautiful afternoon, sharing a quiet moment and a smile. What began as an accidental meeting soon blossomed into a wonderful journey of shared dreams, laughter, and support. Today, we are taking our most beautiful step forward, together.",
      tagline: "Two souls, one beautiful journey, a lifetime of love",
      lang: "en",
      langNative: "English",
      events: [
        { name: "Mehendi Ceremony", regional: "Mehendi Ceremony", time: "Dec 11, 2026 - 02:00 PM", emoji: "👋", venue: "GARDEN PAVILION", note: "Henna artistry, botanical scent, and afternoon light." },
        { name: "Haldi Ceremony", regional: "Haldi Ceremony", time: "Dec 11, 2026 - 10:00 AM", emoji: "💛", venue: "CRYSTAL HALL", note: "Golden hues, saffron paste, and laughter in the morning air." },
        { name: "Wedding Ceremony", regional: "Wedding Ceremony", time: "Dec 12, 2026 - 06:30 PM", emoji: "🌸", venue: "ROYAL COURT", note: "Sacred vows, sounds of Shehnai, and family blessings under the stars." },
      ],
      shagunOn: true,
      upiId: "wedding@upi",
      dateRaw: "2026-12-11",
      photos: [
        "/samples/couple1.jpg",
        "/samples/couple2.jpg",
        "/samples/mandap.jpg",
        "/samples/flowers.jpg"
      ],
      theme: targetTheme,
      openingTheme: themeStyle,
      groomParents: "Smt. Pushpa & Sri. Rajashekar Kapoor",
      brideParents: "Smt. Shaila & Sri. Shivakumar Sharma",
      familyBlessings: "With the blessings of the divine and the love of our families",
      guestbookNotes: [
        { id: "1", name: "Uncle Suresh & Family", note: "Congratulations Aditi and Karan! Wishing you both a lifetime of absolute joy and prosperity! 🌸", date: "4 Jun 2026" },
        { id: "2", name: "Rohit & Shruti (Friends)", note: "Can't wait to dance at the Sangeet! Super happy for you both, Karan and Aditi! 🕺💃", date: "4 Jun 2026" },
      ]
    };

    setInvitationData(mockData);
  };

  const handleCloseDemo = () => {
    playClickSound();
    setIsDemoMode(false);
    setSlug(null);
    setInvitationData(null);
    // Sync browser address bar URL path back to /
    window.history.pushState({}, "", "/");
  };

  const handleCreateSuccess = (newSlug: string) => {
    setSuccessSlug(newSlug);
  };

  const copyCreatedLink = () => {
    const link = `${window.location.origin}/${successSlug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const shareCreatedLink = () => {
    const link = `${window.location.origin}/${successSlug}`;
    const text = `囍 Our wedding website is live! 🌸 Visit the link to view the details, timeline events, and our story:\n\n👉 ${link}\n\nWe look forward to your blessings!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-rust/20 border-t-brand-rust rounded-full animate-spin mx-auto mb-4" />
          <p className="font-marcellus text-[10px] tracking-[4px] text-brand-rust/70 animate-pulse font-bold">
            PREPARING SHADILINK...
          </p>
        </div>
      </div>
    );
  }

  // Draw full dynamic Invitation View if slug successfully checked and loaded
  if (slug && invitationData) {
    return (
      <InvitationView 
        data={invitationData} 
        isDemoMode={isDemoMode}
        onCloseDemo={handleCloseDemo}
      />
    );
  }
  // Simulator themes config for Hero Interactive mockup
  const heroSimulatorConfig = {
    jaipur: { name: "Karan & Aditi", photo: "/samples/couple1.jpg", tag: "Royal Palace", detail: "Traditional arches with soft sunset glow.", style: "bg-rose-100/70 text-amber-900 border-amber-700/20" },
    diya: { name: "Kabir & Riya", photo: "/samples/couple2.jpg", tag: "Midnight Diya", detail: "Celestial stars and floating orange sky lanterns.", style: "bg-indigo-950/80 text-amber-200 border-indigo-700/30" },
    lotus: { name: "Dev & Ishika", photo: "/samples/couple1.jpg", tag: "Temple Lotus", detail: "Blooming lotuses and falling pink rose petals.", style: "bg-orange-50/50 text-[#8A3A1A] border-[#8A3A1A]/10" },
    elephant: { name: "Arjun & Priyanka", photo: "/samples/couple2.jpg", tag: "Royal Elephant", detail: "Sandstone carvings with marigold curtains.", style: "bg-amber-50/65 text-[#8A3A1A] border-amber-800/10" },
    thread: { name: "Vikram & Pooja", photo: "/samples/couple1.jpg", tag: "Sacred Knot", detail: "Cotton tassels with swinging golden bells.", style: "bg-yellow-50/60 text-[#8B0000] border-[#8B0000]/10" },
    garland: { name: "Arjun & Priyanka", photo: "/samples/couple2.jpg", tag: "Marigold Garland", detail: "Orange-yellow flowers and mango leaves.", style: "bg-emerald-50/60 text-[#FFA500] border-emerald-800/10" },
  };
  const activeSim = heroSimulatorConfig[heroActiveTheme as keyof typeof heroSimulatorConfig] || heroSimulatorConfig.jaipur;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060414] via-[#100D26] to-[#181236] text-[#F3EFE0] font-sans overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200 relative">
      {/* Background Falling Petals Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full filter blur-[150px] bg-brand-rust/5 pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[500px] h-[500px] rounded-full filter blur-[160px] bg-amber-500/5 pointer-events-none" />

      {/* Success generated modal popup */}
      {successSlug && (
        <div className="fixed inset-0 z-[700] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#120E2B]/95 rounded-[28px] border border-white/10 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
            <span className="text-5xl block mb-4 animate-bounce">🎊</span>
            <h3 className="font-marcellus text-2xl font-bold text-amber-400 mb-2">Invitation is Ready!</h3>
            <p className="text-xs text-stone-300/80 max-w-xs mx-auto mb-6 font-cormorant">
              Your wedding invitation preview is ready. View it for free and activate it to make it shareable with your guests!
            </p>

            <div className="mb-6">
              <a
                href={`/${successSlug}`}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-bold text-xs tracking-wider uppercase text-stone-950 flex items-center justify-center gap-2 select-none active:scale-95 transition-transform font-marcellus text-center"
              >
                <span>View Invitation Preview</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[9px] text-stone-500 tracking-[4px] font-marcellus font-bold">
              POWERED BY GETSHAADILINK.IN
            </p>
          </div>
        </div>
      )}

      {/* Top navigation bar */}
      <nav className="border-b border-white/10 bg-[#060414]/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div onClick={() => { playClickSound(); window.location.href = "/"; }} className="cursor-pointer flex items-center gap-2 select-none">
            <Heart className="w-4.5 h-4.5 text-amber-400 fill-amber-400/20 animate-pulse" />
            <span className="font-marcellus font-bold text-white tracking-[3px] text-base uppercase">ShaadiLink</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                setLoginOpen(true);
                setLoginError("");
                setDashboardUserCards([]);
              }}
              className="text-[10px] font-bold tracking-widest uppercase font-marcellus text-amber-300 hover:bg-white/5 px-4 py-2 rounded-full border border-amber-300/30 cursor-pointer active:scale-95 transition-all"
            >
              🔑 Manage Card
            </button>
            <span className="text-[9px] tracking-widest font-marcellus text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-2 rounded-full select-none font-bold">
              FREE TO BUILD &amp; PREVIEW
            </span>
          </div>
        </div>
      </nav>

      {/* Login Portal Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[800] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120E2B]/95 rounded-[28px] border border-white/10 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <button
              type="button"
              onClick={() => { playClickSound(); setLoginOpen(false); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-sm cursor-pointer font-bold"
            >
              ✕
            </button>
            <h3 className="font-marcellus text-2xl font-bold text-amber-400 mb-2">🔑 Card Management Portal</h3>
            <p className="text-xs text-stone-400 max-w-xs mx-auto mb-6 font-cormorant">
              Enter details below to access view statistics, blessings logs, or make custom card updates.
            </p>

            {dashboardUserCards.length === 0 && (
              <div className="flex bg-white/5 p-1 rounded-xl mb-4 border border-white/10">
                <button
                  onClick={() => { playClickSound(); setLoginMode("slug"); }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${
                    loginMode === "slug" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-300 hover:text-white"
                  }`}
                >
                  Direct Link
                </button>
                <button
                  onClick={() => { playClickSound(); setLoginMode("email"); }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${
                    loginMode === "email" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-300 hover:text-white"
                  }`}
                >
                  Email Login
                </button>
              </div>
            )}

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left">
                ⚠️ {loginError}
              </div>
            )}

            <div className="space-y-4 text-[#F3EFE0]">
              {dashboardUserCards.length > 0 ? (
                <div className="space-y-3 text-left">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-marcellus">Associated Invitations Found:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {dashboardUserCards.map((card) => (
                      <button
                        key={card.slug}
                        onClick={() => handleSelectCardForDashboard(card.slug)}
                        disabled={loginLoading}
                        className="w-full text-left p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/10 flex items-center justify-between text-xs transition-all cursor-pointer disabled:opacity-50 text-[#F3EFE0] font-marcellus"
                      >
                        <div>
                          <span className="font-semibold text-white block text-sm font-cormorant">{card.bride} & {card.groom}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">/{card.slug}</span>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-[#060414] font-bold px-3 py-1.5 rounded-lg">Manage →</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {loginMode === "slug" ? (
                    <div className="flex flex-col text-left gap-1">
                      <label className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Invitation Link Path Name</label>
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden text-sm focus-within:border-amber-400/40">
                        <span className="px-3.5 py-2.5 text-stone-400 bg-white/5 border-r border-white/5 select-none font-mono font-bold">/</span>
                        <input
                          type="text"
                          value={loginSlug}
                          onChange={(e) => setLoginSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          placeholder="e.g., priya-arjun"
                          className="flex-1 px-4 py-2.5 bg-transparent text-white outline-none font-mono placeholder:text-stone-600 text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col text-left gap-1">
                      <label className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Owner Email Address</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="couple@example.com"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs font-mono placeholder:text-stone-600"
                      />
                    </div>
                  )}

                  <div className="flex flex-col text-left gap-1">
                    <label className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Secret Passcode / Password</label>
                    <div className="relative w-full">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter passcode"
                        className="w-full pl-4 pr-11 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs font-mono placeholder:text-stone-600"
                      />
                      <button
                        type="button"
                        onClick={() => { playClickSound(); setShowLoginPassword(!showLoginPassword); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors cursor-pointer select-none"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoginVerify}
                    disabled={loginLoading}
                    className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md select-none cursor-pointer disabled:opacity-50 active:scale-95 transition-transform font-marcellus"
                  >
                    {loginLoading ? "Authenticating..." : "🔓 Unlock & Edit My Invitation"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      {loggedInCardData ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <UserDashboard
            data={loggedInCardData}
            onLogout={() => { setLoggedInCardData(null); playClickSound(); }}
            onUpdateSuccess={(freshData) => setLoggedInCardData(freshData)}
          />
        </main>
      ) : (
        /* STUNNING HIGH-CONVERSION LANDING PAGE */
        <main className="relative z-10 w-full flex flex-col items-center">
          
          {/* AESTHETIC HERO CONTAINER GRID */}
          <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Highly Persuasive Pitch */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-amber-400/20 bg-amber-400/10 text-amber-300 text-[10.5px] tracking-wider uppercase font-marcellus font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PREMIUM DIGITAL WEDDING INVITATIONS</span>
              </div>

              <h1 className="font-marcellus font-medium text-5xl sm:text-6xl lg:text-7xl leading-tight text-white">
                Create & Preview
                <span className="block mt-1 font-cursive text-amber-400 font-normal normal-case text-6xl sm:text-7xl lg:text-8xl">
                  Bespoke & Beautiful
                </span>
                Invitations for Free
              </h1>

              <p className="text-sm sm:text-base text-stone-300/80 tracking-wide leading-relaxed max-w-xl font-cormorant">
                Design a gorgeous, premium mobile-first wedding website for your big day. Enclose your details in elegant traditional covers, play instrumental background melodies, enable a live blessings guestbook wall, and collect shagun gifts. Preview your full invitation for free, and pay ₹999 once to activate your live link. Includes lifetime hosting with unlimited edits—change themes, update details, or add Google Drive links anytime, as many times as you want!
              </p>

              {/* Quick Feature highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-md pt-2 select-none">
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">100% Free to Build & Preview</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">Interactive Cover Animations</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">Polished Dual-Language Stories</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">No Ads or ShaadiLink Branding</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 select-none">
                <button 
                  onClick={() => {
                    playClickSound();
                    document.getElementById("form-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="py-3.5 px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-marcellus text-xs tracking-[2px] uppercase font-bold hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/15 transition-all cursor-pointer border border-amber-300/30 text-center"
                >
                  Create Your Free Card
                </button>
                <button 
                  onClick={() => {
                    playClickSound();
                    handleLaunchDemo("elephant");
                  }}
                  className="py-3.5 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white font-marcellus text-xs tracking-[2px] uppercase font-bold active:scale-95 transition-all cursor-pointer border border-white/10 text-center flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Watch Interactive Demo</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive iPhone bezel simulator */}
            <div className="lg:col-span-5 flex flex-col items-center select-none">
              <span className="text-[9px] tracking-[3px] uppercase font-bold text-amber-400/50 mb-3 block font-marcellus">Click template tags to preview screens</span>
              
              {/* Bezel frame with shadows */}
              <div className="relative w-72 sm:w-80 aspect-[9/18.5] rounded-[48px] border-[10px] border-stone-800 bg-[#0F021A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] border-b-[12px] border-b-stone-850">
                {/* Dynamic island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-800 rounded-full z-30 flex items-center justify-between px-3 text-[7px] text-white/40">
                  <span>●</span>
                  <span>12:00</span>
                </div>

                {/* Bezel screen preview contents with AnimatePresence */}
                <div className="absolute inset-0 rounded-[38px] overflow-hidden transition-all duration-500 bg-[#FAF6F0]">
                  <AnimatePresence mode="wait">
                    {renderSimSlide()}
                  </AnimatePresence>
                </div>

                {/* iPhone bar indicator */}
              </div>

              {/* Selector buttons tags */}
              <div className="flex flex-wrap gap-2.5 justify-center mt-6 max-w-sm">
                {(["jaipur", "diya", "lotus", "elephant", "thread", "garland"] as const).map((tCode) => (
                  <button
                    key={tCode}
                    onClick={() => { playClickSound(); setHeroActiveTheme(tCode); setSimSlide(0); }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer uppercase tracking-wider ${
                      heroActiveTheme === tCode
                        ? "bg-amber-400 border-amber-400 text-stone-950 font-bold"
                        : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                    }`}
                  >
                    {heroSimulatorConfig[tCode].tag.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF BANNER */}
          <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 mb-8 flex justify-center z-10">
            <div className="py-3 px-8 rounded-full bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-2.5 text-xs text-amber-200 tracking-wider font-semibold select-none text-center backdrop-blur-md">
              <span className="flex items-center gap-1.5 justify-center">
                <span className="text-amber-400 font-bold">{stats.rating.toFixed(1)}</span>
                <span className="flex gap-0.5 text-amber-400 text-sm">
                  {"★★★★★".split("").map((s, idx) => <span key={idx}>{s}</span>)}
                </span>
                <span className="text-stone-300 font-semibold">(Verified Couples Review)</span>
              </span>
              <span className="hidden sm:inline font-marcellus text-stone-600">|</span>
              <span className="font-marcellus text-stone-300 font-bold">{stats.totalGenerated.toLocaleString()} dynamic links generated</span>
            </div>
          </section>

          {/* THEME SHOWROOM TITLE */}
          <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 z-10">
            <ThemeShowroom
              onSelectTheme={(themeStyle) => {
                setPreselectedFormTheme(themeStyle);
                setTimeout(() => {
                  const formEl = document.getElementById("form-container");
                  formEl?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              onLaunchDemo={handleLaunchDemo}
            />
          </section>

          {/* SALES FEATURES PERSUASIVE GRID */}
          <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 z-10 select-none">
            <div className="text-center space-y-2 mb-12">
              <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase">
                👑 BESPOKE SCRAPBOOK SPECIFICATIONS
              </span>
              <h3 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
                Everything Included For ₹999
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto font-cormorant leading-relaxed">
                Unlock a premium interactive experience for your guests with a one-time payment. Edit details, change themes, or add Google Drive links anytime for free.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Sitar & Bansuri Melodies", icon: "🎵", desc: "Strictly soothing traditional instrumentals and beats with zero vocal interference." },
                { title: "Interactive Covers", icon: "🚪", desc: "Guests interact with elegant opening templates (arched doors, tasselled strings, or lighting lamps)." },
                { title: "Dynamic RSVP Manager", icon: "📝", desc: "Guests confirm their attendance. Track attendance totals instantly in your owner dashboard." },
                { title: "UPI Shagun Gift System", icon: "🎁", desc: "Receive monetary blessings direct to your account. Guests enter custom amounts to generate secure UPI QR codes." },
                { title: "Blessings registry ledger", icon: "📜", desc: "A live wedding guestbook wall where guests submit love notes that post dynamically." },
                { title: "One-Time Pay, Lifetime Edits", icon: "🔑", desc: "Pay once. Update timings, parent details, change cover templates, or add drive links at any time for free." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/10 hover:border-amber-400/40 rounded-[24px] shadow transition-all duration-300 flex flex-col gap-3 group backdrop-blur-md">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-widest font-marcellus text-amber-400">{item.title}</h4>
                    <p className="text-xs text-stone-300/70 mt-1.5 leading-relaxed font-cormorant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STEP-BY-STEP INTERACTIVE WORKFLOW */}
          <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12 z-10 select-none">
            <div className="p-6 sm:p-10 rounded-[36px] bg-gradient-to-r from-brand-rust/20 to-[#120E2B]/95 border border-brand-rust/20 relative overflow-hidden backdrop-blur-md">
              <div className="absolute right-0 top-0 w-44 h-44 bg-brand-rust/10 filter blur-[80px] rounded-full pointer-events-none" />
              
              <div className="text-center max-w-sm mx-auto mb-10">
                <span className="text-[10px] font-marcellus text-amber-400 font-bold uppercase tracking-widest block mb-1">EASY 3-STEP PROCESS</span>
                <h3 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wider text-white">How to Get Live Card</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Design for Free", desc: "Enter your wedding details, upload gallery photos, and write down your raw love story." },
                  { step: "02", title: "Preview Invitation", desc: "Instantly view your complete, interactive invitation page with polished stories, countdowns, and music." },
                  { step: "03", title: "One-Time Activation", desc: "Pay ₹999 once. Unlock your live link, share on WhatsApp, and edit your theme, drive link, or details anytime for free." }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2.5 relative">
                    <span className="font-marcellus text-4xl text-amber-400/40 font-bold leading-none">{item.step}</span>
                    <h4 className="text-sm font-bold tracking-wider text-white font-marcellus">{item.title}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-cormorant">{item.desc}</p>
                    {idx < 2 && <div className="hidden md:block absolute top-4 right-[-20px] text-amber-400/20 text-xl font-bold font-mono">→</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {editingData && (
            <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 mb-6">
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-300 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span>✏️ Currently Editing: <strong>{editingData.bride} & {editingData.groom}</strong> ({editingData.slug})</span>
                </div>
                <button
                  onClick={() => { playClickSound(); setEditingData(null); }}
                  className="text-[10px] uppercase font-marcellus tracking-widest border border-white/10 font-bold px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer text-white"
                >
                  Exit Editing Mode
                </button>
              </div>
            </div>
          )}

          {/* Unified Creation Form */}
          <section id="form-container" className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 scroll-mt-24 z-10">
            <BuilderForm
              onSuccess={(updatedSlug) => {
                setEditingData(null);
                handleCreateSuccess(updatedSlug);
              }}
              initialData={editingData}
              onCancelEdit={() => { playClickSound(); setEditingData(null); }}
              preselectedTheme={preselectedFormTheme}
            />
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060414]/90 py-16 text-center select-none text-stone-400 relative z-20">
        <p className="font-marcellus font-bold text-amber-400 tracking-[4px] text-lg uppercase mb-1">
          ShaadiLink
        </p>
        <p className="text-[10px] text-stone-500 mt-1 tracking-widest font-semibold font-marcellus">Premium Interactive Digital Wedding Invitations</p>
        
        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-4 text-[9.5px] tracking-wider font-semibold uppercase text-stone-500 mt-6 font-marcellus select-none">
          <button onClick={() => { playClickSound(); setActivePolicyModal("pricing"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Pricing Details</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("terms"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Terms & Conditions</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("privacy"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("refund"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Refund/Cancellation</button>
        </div>

        <p className="text-[9px] text-stone-600 mt-8 tracking-widest uppercase font-semibold">
          © 2026 ShaadiLink · GetShaadilink.in · Made with ❤️ in Karnataka 🇮🇳
        </p>
      </footer>

      {/* Policy Modals */}
      <AnimatePresence>
        {activePolicyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#0F0B26] border border-white/10 rounded-[32px] p-6 sm:p-8 relative text-[#FAF6F0] shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => { playClickSound(); setActivePolicyModal(null); }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer font-bold text-xs"
              >
                ✕
              </button>

              {activePolicyModal === "pricing" && (
                <div className="space-y-4 text-left">
                  <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3">Clear & Simple Pricing</h3>
                  <div className="p-6 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-center space-y-2">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-widest font-marcellus">Premium Lifetime Pass</span>
                    <h4 className="text-4xl font-extrabold text-white">₹999 <span className="text-sm font-normal text-stone-400">one-time payment</span></h4>
                    <p className="text-xs text-stone-300 max-w-md mx-auto font-cormorant leading-relaxed">
                      Absolutely zero monthly subscriptions, zero hosting renewal fees, and zero hidden charges. Pay once, use forever.
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <h4 className="font-marcellus text-sm font-bold text-white uppercase tracking-wider">What's Included:</h4>
                    <ul className="text-xs space-y-2 text-stone-300 font-cormorant leading-relaxed list-disc list-inside">
                      <li><strong className="text-amber-400">Unlimited Lifetime Edits:</strong> Update venue details, timings, parents' names, change themes, or modify photographs dynamically from your dashboard anytime, as many times as you like.</li>
                      <li><strong className="text-amber-400">Google Drive Integration:</strong> Connect a Google Drive or Dropbox link directly to share high-resolution pre-wedding/wedding photo albums.</li>
                      <li><strong className="text-amber-400">Interactive Cover Animations:</strong> Select and switch between any of our six premium cover themes anytime for free.</li>
                      <li><strong className="text-amber-400">Live Blessings Wall:</strong> Moderate and showcase heartfelt greetings from guests, with dashboard moderation to delete unwanted posts.</li>
                      <li><strong className="text-amber-400">Direct UPI Shagun Transfer:</strong> Collect monetary gift blessings directly to your personal UPI ID via secure QR code.</li>
                      <li><strong className="text-amber-400">Responsive Mobile-First Page:</strong> A custom URL path (e.g. shadilink.in/yourname) optimized for WhatsApp sharing.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activePolicyModal === "terms" && (
                <div className="space-y-4 text-left font-cormorant leading-relaxed text-stone-300 text-sm">
                  <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3 font-sans">Terms & Conditions</h3>
                  <p className="text-xs text-stone-400 font-sans">Last updated: June 2026</p>
                  <p>Welcome to <strong>ShaadiLink</strong> (getshaadilink.in). By creating, publishing, or visiting a digital wedding invitation on our platform, you agree to comply with and be bound by the following terms:</p>
                  
                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">1. Use of Service</h4>
                  <p>ShaadiLink provides tools to build and host custom mobile-friendly wedding web pages. You represent that the information, names, images, and text uploaded are correct and that you possess the necessary rights/permissions for all media used.</p>
                  
                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">2. Account Passcode & Content Management</h4>
                  <p>A passcode is generated during invitation creation to secure dashboard edits. You are solely responsible for keeping this passcode confidential. ShaadiLink reserves the right to remove any content that is abusive, defamatory, copyright-infringing, or unlawful.</p>

                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">3. Platform Availability</h4>
                  <p>While we guarantee lifetime hosting for paid invitations, server availability is subject to hosting maintenance. We take periodic backups, but suggest you keep copies of your media files.</p>
                </div>
              )}

              {activePolicyModal === "privacy" && (
                <div className="space-y-4 text-left font-cormorant leading-relaxed text-stone-300 text-sm">
                  <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3 font-sans">Privacy Policy</h3>
                  <p className="text-xs text-stone-400 font-sans">Last updated: June 2026</p>
                  <p>We respect your privacy. Here is how we handle your personal data:</p>
                  
                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">1. Information We Collect</h4>
                  <p>When creating a ShaadiLink invitation, we collect your provided names, dates, parent details, stories, venue locations, UPI IDs, and photos. This information is stored securely on our servers to render your public invitation page.</p>

                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">2. Public Guestbook Blessings</h4>
                  <p>Guests submitting a blessing wish (name, note, and optional shagun amount) acknowledge that their message is posted publicly on the invitation wall for other visitors to see. Owner/Dashboard accounts can delete any blessings anytime.</p>

                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">3. Peer-to-Peer Transactions</h4>
                  <p>All UPI shagun transfers occur directly between the guest's UPI app and your personal banking QR. ShaadiLink does not process, touch, track, or store financial credentials or transaction details.</p>
                </div>
              )}

              {activePolicyModal === "refund" && (
                <div className="space-y-4 text-left font-cormorant leading-relaxed text-stone-300 text-sm">
                  <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3 font-sans">Refund & Cancellation Policy</h3>
                  <p className="text-xs text-stone-400 font-sans">Last updated: June 2026</p>
                  
                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">1. Free Previews</h4>
                  <p>We believe in 100% transparency. You can fully customize, edit, and preview your complete invitation page, interactive cover animations, music, and story sections for free without entering any payment credentials. You only choose to pay when you want to publish the live link.</p>

                  <h4 className="font-marcellus text-xs font-bold text-white uppercase tracking-wider font-sans mt-4">2. Refund Conditions</h4>
                  <p>Since services are rendered immediately upon payment (your live link is generated and share features are unlocked), we do not offer general refunds. However, in the event of double-charges or server-side technical failures that prevent link activation, we will issue a full refund. Please contact our support within 7 days of payment.</p>
                </div>
              )}

              {/* Close Bottom Button */}
              <div className="pt-4 border-t border-white/10 text-right mt-6">
                <button
                  onClick={() => { playClickSound(); setActivePolicyModal(null); }}
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
