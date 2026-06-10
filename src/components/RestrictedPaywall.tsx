import React, { useState } from "react";
import { Sparkles, Lock, ArrowRight, Home, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { playClickSound } from "../utils/soundUtils";

interface RestrictedPaywallProps {
  data: {
    restricted: boolean;
    slug: string;
    bride: string;
    groom: string;
    niceDate?: string;
    theme?: {
      primary: string;
      secondary: string;
      accent: string;
      bg: string;
      heroEmoji: string;
    };
  };
  onAccessGranted: (freshData: any) => void;
  onBackHome: () => void;
}

export default function RestrictedPaywall({ data, onAccessGranted, onBackHome }: RestrictedPaywallProps) {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const themeColors = data.theme || {
    primary: "#8A3A1A",
    secondary: "#C5A880",
    accent: "#E6C252",
    bg: "#FAF6F0",
    heroEmoji: "🌸",
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!passcode.trim()) {
      setError("Please enter a passcode.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Verify passcode
      const authRes = await fetch(`/api/invitations/${data.slug}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passcode.trim() }),
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        throw new Error(authData.error || "Invalid passcode.");
      }

      // 2. Passcode is valid, store in localStorage
      localStorage.setItem("shaadi_auth_" + data.slug, passcode.trim());

      // 3. Fetch full card data
      const dataRes = await fetch(`/api/invitations/${data.slug}?passcode=${encodeURIComponent(passcode.trim())}`);
      if (!dataRes.ok) {
        throw new Error("Failed to fetch full card data.");
      }

      const fullData = await dataRes.json();
      onAccessGranted(fullData);
    } catch (err: any) {
      setError(err.message || "Failed to unlock preview.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    playClickSound();
    onBackHome();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cover bg-center overflow-y-auto"
      style={{ 
        backgroundColor: themeColors.bg,
        backgroundImage: `radial-gradient(circle at center, ${themeColors.primary}12 0%, ${themeColors.bg} 100%)` 
      }}
    >
      {/* Decorative backdrop elements */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full filter blur-[120px] pointer-events-none opacity-30" style={{ backgroundColor: themeColors.primary }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full filter blur-[120px] pointer-events-none opacity-20" style={{ backgroundColor: themeColors.accent }} />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] border p-6 sm:p-8 text-center shadow-paper-deep relative overflow-hidden"
        style={{ borderColor: `${themeColors.primary}22` }}
      >
        {/* Top decorative line */}
        <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: themeColors.primary }} />

        {/* Lock Icon */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border shadow-inner"
          style={{ 
            backgroundColor: `${themeColors.primary}08`,
            borderColor: `${themeColors.primary}20` 
          }}
        >
          <Lock className="w-7 h-7" style={{ color: themeColors.primary }} />
        </div>

        {/* Heading */}
        <h2 className="font-display italic text-3xl font-extrabold text-stone-900 mb-2">
          {data.bride} &amp; {data.groom}
        </h2>
        
        <p className="text-[10px] font-cinzel font-bold tracking-widest uppercase mb-4" style={{ color: themeColors.secondary }}>
          ✦ Wedding Invitation Preview ✦
        </p>

        {/* Restricted Notice Badge */}
        <div 
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold mb-6 select-none bg-amber-500/5 text-amber-800"
          style={{ borderColor: `rgba(245, 158, 11, 0.2)` }}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Card is Currently in Preview Mode</span>
        </div>

        {/* Main message */}
        <div className="text-stone-600 space-y-3 font-cormorant text-base leading-relaxed max-w-sm mx-auto mb-8">
          <p>
            This premium animated invitation is currently undergoing final setup and is not yet publicly active.
          </p>
          <p className="text-xs text-stone-500/80">
            If you are the card owner, please enter your secret passcode below to unlock and preview your card.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleUnlock} className="space-y-4 text-left max-w-sm mx-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-cinzel tracking-widest text-stone-500 uppercase font-bold">
              Owner passcode
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode to unlock"
                className="flex-1 px-4 py-3 bg-white border rounded-xl text-stone-850 outline-none text-xs font-mono transition-all focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/40"
                style={{ borderColor: `${themeColors.primary}20` }}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase text-white shadow transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: themeColors.primary }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-red-600 text-center"
            >
              {error}
            </motion.p>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-dashed border-stone-200" />

        {/* Footer Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-600 font-bold text-[10px] tracking-wider uppercase select-none cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>Go Back Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
