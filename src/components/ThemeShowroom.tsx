import React from "react";
import { Wand2 } from "lucide-react";
import { playClickSound } from "../utils/soundUtils";

interface ThemeShowroomProps {
  onSelectTheme: (themeStyle: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => void;
  onLaunchDemo: (themeStyle: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland") => void;
  userPhoto?: string;
}

export default function ThemeShowroom({ onSelectTheme, onLaunchDemo, userPhoto }: ThemeShowroomProps) {
  const activePhoto = userPhoto || "/samples/couple_realistic.png";
  const themes = [
    {
      id: "elephant",
      class: "t1",
      name: "Royal Elephant",
      tagline: "Two decorated elephants part beneath falling marigolds — your photo rises inside a gilded howdah arch.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Aditi",
      n2: "Karan",
      w: "weds",
      initials: "A ♥ K",
      date: "DECEMBER 11, 2026 · Udaipur",
      prompt: "TAP SEAL TO ENTER THE CELEBRATION",
      finial: "👑",
    },
    {
      id: "thread",
      class: "t2",
      name: "Sacred Knot",
      tagline: "A brass temple bell descends on red thread — guests pull it down to unveil your photo, ringed in gold.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Priya",
      n2: "Rahul",
      w: "weds",
      initials: "P ♥ R",
      date: "NOVEMBER 22, 2026 · Mysuru",
      prompt: "DRAG THE BELL DOWN TO TIE THE KNOT",
      finial: null,
    },
    {
      id: "diya",
      class: "t3",
      name: "Midnight Diya",
      tagline: "A single oil lamp glows beneath a starlit sky, its warm light haloing your photo as fireflies drift by.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Sneha",
      n2: "Arjun",
      w: "weds",
      initials: "S ♥ A",
      date: "JANUARY 18, 2027 · Bengaluru",
      prompt: "TAP THE FLAME TO LIGHT UP THE NIGHT",
      finial: null,
    },
    {
      id: "lotus",
      class: "t4",
      name: "Temple Lotus",
      tagline: "Eight petals bloom open across still water, cradling your photo at their heart as diyas drift past.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Ananya",
      n2: "Vikram",
      w: "weds",
      initials: "A ♥ V",
      date: "FEBRUARY 8, 2027 · Chennai",
      prompt: "TAP THE LOTUS TO UNFOLD YOUR STORY",
      finial: null,
    },
    {
      id: "jaipur",
      class: "t5",
      name: "Royal Palace",
      tagline: "A jharokha window of carved gold lattice frames your photo, gold dust drifting past a red carpet below.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Kavya",
      n2: "Rohan",
      w: "weds",
      initials: "K ♥ R",
      date: "DECEMBER 28, 2026 · Jaipur",
      prompt: "TAP THE PALACE DOORS TO ENTER",
      finial: "☀",
    },
    {
      id: "garland",
      class: "t6",
      name: "Marigold Garland",
      tagline: "A ring of fresh marigolds swings open around your photo, mango leaves and petals drifting past your names.",
      originalPrice: "1,999",
      offerPrice: "999",
      badge: "SAVE 50%",
      n1: "Meera",
      n2: "Aditya",
      w: "weds",
      initials: "M ♥ A",
      date: "APRIL 14, 2027 · Hyderabad",
      prompt: "LIFT THE GARLAND TO REVEAL YOUR PHOTO",
      finial: null,
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
      {/* Embedded CSS for showroom layouts and keyframe animations */}
      <style>{`
        .showroom-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .preview {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .grain {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          opacity: 0.35;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/></svg>");
        }
        .vignette {
          position: absolute;
          inset: 0;
          z-index: 19;
          pointer-events: none;
          box-shadow: inset 0 0 90px 30px rgba(0,0,0,0.55);
        }

        .names-overlay {
          position: absolute;
          top: 26px;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 11;
          pointer-events: none;
        }
        .no-tag {
          font-family: 'Italiana', serif;
          font-size: 8.5px;
          letter-spacing: 4px;
          margin-bottom: 7px;
          opacity: 0.7;
        }
        .no-n1, .no-n2 {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 32px;
          font-weight: 600;
          line-height: 1.05;
          text-shadow: 0 2px 18px rgba(0,0,0,0.7);
        }
        .no-w {
          font-family: 'Cinzel', serif;
          font-size: 8px;
          letter-spacing: 2.5px;
          margin: 4px 0;
          opacity: 0.8;
        }

        .photo-stage {
          position: absolute;
          left: 50%;
          top: 53%;
          transform: translate(-50%,-50%);
          z-index: 8;
          width: 172px;
          height: 172px;
        }
        .photo-frame {
          position: absolute;
          inset: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: frameReveal 1.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes frameReveal {
          0% { opacity: 0; transform: scale(0.7); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .pf-fill {
          position: absolute;
          inset: 0;
        }
        .pf-mono {
          position: relative;
          z-index: 2;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 1px;
          opacity: 0.55;
          text-align: center;
          line-height: 1.3;
          margin: auto;
        }
        .pf-mono small {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 6px;
          letter-spacing: 2px;
          opacity: 0.7;
          margin-top: 3px;
          font-style: normal;
        }
        .pf-shine {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(115deg,transparent 40%,rgba(255,255,255,0.16) 50%,transparent 60%);
          background-size: 250% 250%;
          animation: pfShine 5s ease-in-out infinite;
        }
        @keyframes pfShine {
          0% { background-position: 120% 0%; }
          50% { background-position: -20% 100%; }
          100% { background-position: 120% 0%; }
        }

        .date-strip {
          position: absolute;
          bottom: 38px;
          left: 20px;
          right: 20px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 100px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.07);
          z-index: 12;
        }
        .date-strip span {
          font-family: 'Cinzel', serif;
          font-size: 8.5px;
          letter-spacing: 1.5px;
          color: rgba(245,236,215,0.65);
        }

        .act-prompt {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 7.5px;
          letter-spacing: 2px;
          color: rgba(245,236,215,0.4);
          z-index: 12;
          animation: hintPulse 2.6s ease-in-out infinite;
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }

        .brand-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.62);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'Cinzel', serif;
          font-size: 8.5px;
          letter-spacing: 2.5px;
          color: rgba(245,236,215,0.32);
          transition: height 0.35s, opacity 0.35s;
          overflow: hidden;
          opacity: 0;
          z-index: 15;
        }
        .theme-card:hover .brand-strip {
          height: 22px;
          opacity: 1;
        }

        /* Hover selectors for interactive previews inside the phone bezel mockup */
        .theme-card:hover .elephant-l {
          transform: translateX(-60px) rotate(-8deg);
          opacity: 0.15;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .elephant-r {
          transform: translateX(60px) rotate(8deg);
          opacity: 0.15;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .howdah-glint {
          opacity: 0;
          transition: opacity 0.4s;
        }
        .theme-card:hover .bell-wrap {
          transform: translate(-50%, 160px) scale(0.6);
          opacity: 0;
          transition: transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .tassel {
          transform: translateY(120px);
          opacity: 0;
          transition: transform 1.5s ease-in, opacity 0.8s;
        }
        .theme-card:hover .diya-wrap {
          transform: translate(-50%, 40px) scale(15);
          opacity: 0;
          transition: transform 1.5s ease-in, opacity 0.8s;
        }
        .theme-card:hover .diya-glow {
          opacity: 0;
          transition: opacity 0.6s;
        }
        .theme-card:hover .lp {
          transform: rotate(var(--lr)) translateY(-34px) scale(1) !important;
          opacity: 0.92 !important;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .water-diya {
          transform: translateY(30px);
          opacity: 0;
          transition: transform 1.2s ease-in, opacity 0.8s;
        }
        .theme-card:hover .palace-jaali {
          transform: translateX(-50%) scaleY(0);
          opacity: 0.15;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .red-carpet {
          height: 60px !important;
          opacity: 1 !important;
          transition: height 1.2s ease-out, opacity 0.6s;
        }
        .theme-card:hover .garland-wrap {
          transform: translateY(-120px);
          opacity: 0;
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s;
        }
        .theme-card:hover .mango-leaf {
          transform: translateY(80px);
          opacity: 0;
          transition: transform 1.2s ease-in, opacity 0.8s;
        }

        /* ── THEME 1: Elephant ── */
        .t1 {
          --a: #E8A84A;
          --a2: #FFDFA0;
          --deep: #170900;
          --mid: #3D1500;
          --glow: rgba(232,168,74,0.4);
          background: linear-gradient(160deg,#1D0D02,#0F0500);
        }
        .t1 .preview {
          background:
            radial-gradient(ellipse 500px 300px at 50% 100%,rgba(139,58,0,0.55),transparent 70%),
            radial-gradient(ellipse 700px 400px at 20% -10%,rgba(200,115,42,0.22),transparent 60%),
            linear-gradient(180deg,#3D1500 0%,#170900 75%,#0D0500 100%);
        }
        .t1-groundlight { position: absolute; bottom: 0; left: 0; right: 0; height: 150px; background: linear-gradient(to top,rgba(139,58,0,0.5),transparent); z-index: 1; }
        .marigold-petal { position: absolute; animation: petalFall linear infinite; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        @keyframes petalFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.5; }
          100% { transform: translateY(420px) rotate(360deg); opacity: 0; }
        }
        .sparkle { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #FFD700; animation: sparkleFly ease-in-out infinite; opacity: 0; box-shadow: 0 0 5px #FFD700; }
        @keyframes sparkleFly {
          0% { opacity: 0; transform: scale(0); }
          30% { opacity: 1; transform: scale(1); }
          70% { opacity: 0.5; }
          100% { opacity: 0; transform: scale(0) translate(var(--dx),var(--dy)); }
        }
        .elephant-l, .elephant-r {
          position: absolute;
          bottom: 38px;
          font-size: 0;
          z-index: 6;
          filter: drop-shadow(0 8px 14px rgba(0,0,0,0.55)) sepia(0.15);
          animation: elephantSway ease-in-out infinite alternate, elephantEnter 1.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .elephant-l { left: -14px; animation-duration: 3.2s, 1.1s; transform-origin: bottom center; }
        .elephant-l span { font-size: 76px; display: block; }
        .elephant-r { right: -14px; animation-duration: 3.6s, 1.1s; animation-direction: alternate-reverse, normal; transform-origin: bottom center; }
        .elephant-r span { font-size: 76px; display: block; transform: scaleX(-1); }
        @keyframes elephantSway {
          0% { transform: rotate(-3deg) translateY(0); }
          100% { transform: rotate(3deg) translateY(-7px); }
        }
        @keyframes elephantEnter {
          0% { opacity: 0; transform: translateX(var(--enter,-30px)); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .elephant-r { --enter: 30px; }
        .howdah-glint { position: absolute; bottom: 52px; width: 10px; height: 10px; border-radius: 50%; background: radial-gradient(circle,#FFE9B0,#E8A84A); box-shadow: 0 0 10px #FFD98A; animation: hglint 2.4s ease-in-out infinite; }
        .howdah-glint.l { left: 26px; }
        .howdah-glint.r { right: 24px; }
        @keyframes hglint {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .t1 .photo-frame { border-radius: 50% 50% 6px 6px / 62% 62% 6px 6px; box-shadow: 0 14px 40px rgba(0,0,0,0.55), 0 0 0 3px var(--deep), 0 0 0 5px var(--a), 0 0 26px 4px var(--glow); }
        .t1 .pf-fill { background: radial-gradient(ellipse at 32% 24%,rgba(255,224,170,0.24),transparent 55%), linear-gradient(155deg,#7A3A10,#2A0F02 78%); }
        .t1 .pf-finial { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 16px; z-index: 9; color: var(--a2); text-shadow: 0 0 8px var(--glow); animation: finialGlow 2.4s ease-in-out infinite; }
        @keyframes finialGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

        /* ── THEME 2: Sacred Knot ── */
        .t2 {
          --a: #F0708E;
          --a2: #FFD0D0;
          --deep: #0F0005;
          --mid: #3D0010;
          --glow: rgba(232,86,122,0.42);
          background: linear-gradient(160deg,#170007,#0A0004);
        }
        .t2 .preview { background: radial-gradient(ellipse at 50% 26%,#4A0016 0%,#150007 60%,#0A0004 100%); }
        .bell-wrap { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 9; animation: bellDrop 1.2s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes bellDrop { 0% { opacity: 0; transform: translate(-50%,-30px); } 100% { opacity: 1; transform: translate(-50%,0); } }
        .bell-string { width: 1px; height: 38px; background: linear-gradient(to bottom,rgba(255,200,100,0.7),rgba(255,200,100,0.25)); margin: 0 auto; }
        .bell-icon { font-size: 36px; display: block; animation: bellSwing 2.6s ease-in-out infinite; transform-origin: top center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); }
        @keyframes bellSwing { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
        .tassel { position: absolute; top: 118px; font-size: 9px; color: rgba(255,200,100,0.55); letter-spacing: -2px; animation: tassleWave ease-in-out infinite alternate; z-index: 4; }
        @keyframes tassleWave { 0% { transform: rotate(-5deg); } 100% { transform: rotate(5deg); } }
        .bindi { position: absolute; border-radius: 50%; background: radial-gradient(circle,#FF8FAB,#8B0000); animation: bindiFloat ease-in-out infinite alternate; z-index: 4; box-shadow: 0 0 6px rgba(255,143,171,0.4); }
        @keyframes bindiFloat { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-9px) scale(1.25); } }
        .t2 .photo-frame { border-radius: 50%; box-shadow: 0 14px 40px rgba(0,0,0,0.55), 0 0 0 3px var(--deep), 0 0 0 5px var(--a), 0 0 30px 4px var(--glow); }
        .t2 .pf-fill { background: radial-gradient(ellipse at 32% 26%,rgba(255,210,220,0.22),transparent 55%), linear-gradient(155deg,#7A0F30,#28000E 78%); }
        .knot-ring { position: absolute; inset: -9px; border-radius: 50%; border: 1.5px dashed rgba(240,112,142,0.35); animation: knotSpin 18s linear infinite; z-index: 7; }
        @keyframes knotSpin { to { transform: rotate(360deg); } }

        /* ── THEME 3: Midnight Diya ── */
        .t3 {
          --a: #FF9756;
          --a2: #FFD8A8;
          --deep: #08020F;
          --mid: #1A0830;
          --glow: rgba(255,140,66,0.45);
          background: linear-gradient(160deg,#09030F,#050008);
        }
        .t3 .preview { background: radial-gradient(ellipse at 50% 78%,#20103A 0%,#0A0414 55%,#040108 100%); }
        .moon { position: absolute; top: 22px; right: 26px; width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle at 35% 35%,#FFF6DE,#F0DFA0); box-shadow: 0 0 22px 4px rgba(255,244,214,0.35); z-index: 2; }
        .night-star { position: absolute; background: #fff; border-radius: 50%; animation: starTwink ease-in-out infinite alternate; z-index: 2; }
        @keyframes starTwink { 0% { opacity: 0.1; } 100% { opacity: 0.75; } }
        .diya-wrap { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 9; }
        .diya-flame { font-size: 34px; display: block; animation: flameDance 2.2s ease-in-out infinite; transform-origin: bottom center; filter: drop-shadow(0 0 10px rgba(255,150,60,0.7)); }
        @keyframes flameDance {
          0%,100% { transform: scaleX(1) scaleY(1) rotate(-2deg); }
          25% { transform: scaleX(0.9) scaleY(1.1) rotate(2deg); }
          50% { transform: scaleX(1.1) scaleY(0.95) rotate(-1deg); }
          75% { transform: scaleX(0.95) scaleY(1.05) rotate(1deg); }
        }
        .diya-glow { position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); width: 130px; height: 60px; border-radius: 50%; background: radial-gradient(ellipse,rgba(255,140,66,0.4) 0%,transparent 70%); filter: blur(10px); animation: glowPulse 1.8s ease-in-out infinite; z-index: 5; }
        @keyframes glowPulse {
          0%,100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }
        .firefly { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #FFD700; animation: fireflyFloat ease-in-out infinite; box-shadow: 0 0 6px #FFD700, 0 0 12px rgba(255,215,0,0.4); z-index: 6; }
        @keyframes fireflyFloat {
          0% { opacity: 0; transform: translate(0,0); }
          20% { opacity: 1; }
          50% { opacity: 0.7; transform: translate(var(--fx),var(--fy)); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--fx2),var(--fy2)); }
        }
        .t3 .photo-frame { border-radius: 50%; box-shadow: 0 0 0 3px var(--deep), 0 0 0 5px var(--a), 0 0 42px 8px var(--glow), 0 16px 40px rgba(0,0,0,0.6); }
        .t3 .pf-fill { background: radial-gradient(ellipse at 35% 30%,rgba(255,200,140,0.2),transparent 55%), linear-gradient(155deg,#3A1830,#0E0518 78%); }
        .diya-embers { position: absolute; inset: -10px; z-index: 7; pointer-events: none; }
        .ember { position: absolute; width: 2.5px; height: 2.5px; border-radius: 50%; background: #FFB870; box-shadow: 0 0 5px #FFB870; animation: emberRise linear infinite; opacity: 0; }
        @keyframes emberRise {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-60px) translateX(var(--ex)); }
        }

        /* ── THEME 4: Temple Lotus ── */
        .t4 {
          --a: #FF8FAB;
          --a2: #FFD0E8;
          --deep: #150008;
          --mid: #3D1030;
          --glow: rgba(255,143,171,0.4);
          background: linear-gradient(160deg,#1D0713,#0D0006);
        }
        .t4 .preview { background: linear-gradient(180deg,#3D1030 0%,#1A0010 55%,#080004 100%); }
        .ripple { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); border-radius: 50%; border: 1px solid rgba(255,143,171,0.28); animation: rippleOut ease-out infinite; z-index: 2; }
        @keyframes rippleOut {
          0% { width: 20px; height: 9px; opacity: 0.85; transform: translateX(-50%); }
          100% { width: 230px; height: 66px; opacity: 0; transform: translateX(-50%); }
        }
        .water-diya { position: absolute; bottom: 34px; font-size: 15px; animation: diyaDrift ease-in-out infinite; z-index: 4; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4)); }
        @keyframes diyaDrift {
          0%,100% { transform: translateX(0) rotate(-5deg); }
          50% { transform: translateX(8px) rotate(5deg); }
        }
        .t4 .photo-stage { width: 186px; height: 186px; }
        .lotus-ring { position: absolute; inset: 0; z-index: 7; }
        .lp {
          position: absolute;
          width: 34px;
          height: 52px;
          left: 50%;
          top: 50%;
          margin-left: -17px;
          margin-top: -26px;
          transform-origin: 50% 100%;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: lotusBloom 1.6s cubic-bezier(0.22,1,0.36,1) both, lotusSway 4s ease-in-out infinite 1.6s;
        }
        @keyframes lotusBloom {
          0% { transform: rotate(var(--lr)) translateY(6px) scale(0.15); opacity: 0; }
          100% { transform: rotate(var(--lr)) translateY(-64px) scale(1); opacity: 0.92; }
        }
        @keyframes lotusSway {
          0%,100% { transform: rotate(var(--lr)) translateY(-64px) scale(1); }
          50% { transform: rotate(calc(var(--lr) + 1.4deg)) translateY(-67px) scale(1.03); }
        }
        .t4 .photo-frame { width: 112px; height: 112px; left: 50%; top: 50%; transform: translate(-50%,-50%); border-radius: 50%; box-shadow: 0 0 0 3px var(--deep), 0 0 0 4px var(--a), 0 0 30px 4px var(--glow), 0 14px 34px rgba(0,0,0,0.55); z-index: 8; }
        .t4 .pf-fill { background: radial-gradient(ellipse at 34% 28%,rgba(255,210,230,0.22),transparent 55%), linear-gradient(155deg,#6E1440,#22040F 78%); }

        /* ── THEME 5: Royal Palace ── */
        .t5 {
          --a: #E8B86D;
          --a2: #FFE8B0;
          --deep: #160800;
          --mid: #3D1800;
          --glow: rgba(232,184,109,0.4);
          background: linear-gradient(160deg,#1E0D01,#0F0500);
        }
        .t5 .preview { background: linear-gradient(180deg,#3D1800 0%,#160700 70%,#0C0400 100%); }
        .palace-jaali {
          position: absolute; left: 50%; top: 34px; transform: translateX(-50%); width: 196px; height: 250px; z-index: 5;
          border: 2px solid rgba(232,184,109,0.4);
          border-radius: 98px 98px 10px 10px / 120px 120px 10px 10px;
          background:
            repeating-linear-gradient(45deg,rgba(232,184,109,0.07) 0 2px,transparent 2px 14px),
            repeating-linear-gradient(-45deg,rgba(232,184,109,0.07) 0 2px,transparent 2px 14px);
          -webkit-mask-image: linear-gradient(to bottom,black,black 60%,transparent 100%);
          mask-image: linear-gradient(to bottom,black,black 60%,transparent 100%);
          animation: jaaliReveal 1.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes jaaliReveal {
          0% { opacity: 0; transform: translateX(-50%) scaleY(0.7); }
          100% { opacity: 1; transform: translateX(-50%) scaleY(1); }
        }
        .palace-jaali::before { content: ''; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 0; border: 1px solid rgba(232,184,109,0.2); border-radius: 84px 84px 6px 6px / 100px 100px 6px 6px; }
        .red-carpet { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 66px; background: linear-gradient(to top,#7A0000,rgba(122,0,0,0.25)); z-index: 3; animation: carpetUnroll 5s ease-out infinite; }
        @keyframes carpetUnroll {
          0% { height: 0; opacity: 0; }
          25% { height: 90px; opacity: 1; }
          85% { height: 90px; opacity: 1; }
          100% { height: 0; opacity: 0; }
        }
        .palace-dust { position: absolute; font-size: 8px; color: #FFD700; animation: dustFall linear infinite; opacity: 0; z-index: 6; }
        @keyframes dustFall {
          0% { opacity: 0; transform: translateY(0) rotate(0); }
          20% { opacity: 0.85; }
          80% { opacity: 0.35; }
          100% { opacity: 0; transform: translateY(320px) rotate(180deg); }
        }
        .arch-light { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle,#FFD700,#FF8C00); box-shadow: 0 0 9px #FFD700; animation: lightBlink ease-in-out infinite alternate; z-index: 7; }
        @keyframes lightBlink { 0% { opacity: 0.3; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1.25); } }
        .t5 .photo-stage { top: 50%; width: 150px; height: 190px; }
        .t5 .photo-frame { border-radius: 75px 75px 8px 8px / 92px 92px 8px 8px; box-shadow: 0 0 0 3px var(--deep), 0 0 0 5px var(--a), 0 0 28px 4px var(--glow), 0 16px 40px rgba(0,0,0,0.6); }
        .t5 .pf-fill { background: radial-gradient(ellipse at 34% 22%,rgba(255,224,170,0.24),transparent 55%), linear-gradient(155deg,#6E3512,#220C02 78%); }
        .t5 .pf-finial { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 14px; z-index: 9; color: var(--a2); }

        /* ── THEME 6: Marigold Garland ── */
        .t6 {
          --a: #FFA500;
          --a2: #FFF3C0;
          --deep: #0A0F02;
          --mid: #1A2400;
          --glow: rgba(255,165,0,0.4);
          background: linear-gradient(160deg,#0D1303,#070A01);
        }
        .t6 .preview { background: linear-gradient(180deg,#1A2400 0%,#0A0F02 70%,#050700 100%); }
        .garland-wrap { position: absolute; top: 64px; left: 0; right: 0; height: 70px; overflow: visible; z-index: 9; }
        .garland-string { position: absolute; top: 0; left: 6%; right: 6%; height: 36px; border-bottom: 2px solid rgba(212,168,67,0.32); border-radius: 0 0 50% 50%; }
        .g-flower { position: absolute; top: -6px; font-size: 17px; animation: garlandSway ease-in-out infinite; transform-origin: top center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
        @keyframes garlandSway { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        .mango-leaf { position: absolute; top: 16px; font-size: 13px; animation: leafWave ease-in-out infinite alternate; z-index: 4; }
        @keyframes leafWave { 0% { transform: rotate(-8deg) translateY(0); } 100% { transform: rotate(8deg) translateY(-4px); } }
        .falling-flower { position: absolute; font-size: 11px; animation: flowerFall linear infinite; opacity: 0; z-index: 4; }
        @keyframes flowerFall {
          0% { opacity: 0; transform: translateY(-10px) rotate(0); }
          15% { opacity: 0.85; }
          85% { opacity: 0.35; }
          100% { opacity: 0; transform: translateY(400px) rotate(270deg); }
        }
        .t6 .photo-stage { width: 184px; height: 184px; }
        .marigold-ring { position: absolute; inset: 0; z-index: 7; animation: ringSpin 34s linear infinite; }
        .mf { position: absolute; font-size: 16px; left: 50%; top: 50%; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); }
        @keyframes ringSpin { to { transform: rotate(360deg); } }
        .t6 .photo-frame { width: 120px; height: 120px; left: 50%; top: 50%; transform: translate(-50%,-50%); border-radius: 50%; box-shadow: 0 0 0 3px var(--deep), 0 0 0 4px var(--a), 0 0 26px 4px var(--glow), 0 14px 34px rgba(0,0,0,0.55); z-index: 8; }
        .t6 .pf-fill { background: radial-gradient(ellipse at 34% 28%,rgba(255,240,190,0.22),transparent 55%), linear-gradient(155deg,#5A4A02,#141B00 78%); }

        /* ========================================================
           IPHONE SCALING OVERRIDES (FITS COVER PREVIEW IN BEZEL)
           ======================================================== */
        .showroom-phone-screen .preview {
          height: 100% !important;
          width: 100% !important;
        }
        .showroom-phone-screen .names-overlay {
          top: 18px !important;
        }
        .showroom-phone-screen .names-overlay.t2-top {
          top: 60px !important;
        }
        .showroom-phone-screen .names-overlay.t6-top {
          top: 100px !important;
        }
        .showroom-phone-screen .names-overlay.t5-top {
          top: 14px !important;
        }
        .showroom-phone-screen .no-tag {
          font-size: 6.5px !important;
          letter-spacing: 2px !important;
          margin-bottom: 2px !important;
        }
        .showroom-phone-screen .no-n1, 
        .showroom-phone-screen .no-n2 {
          font-size: 19px !important;
        }
        .showroom-phone-screen .no-w {
          font-size: 6px !important;
          letter-spacing: 1px !important;
          margin: 1px 0 !important;
        }
        .showroom-phone-screen .photo-stage {
          width: 90px !important;
          height: 90px !important;
          top: 53% !important;
        }
        .showroom-phone-screen .t4 .photo-stage {
          width: 98px !important;
          height: 98px !important;
          top: 55% !important;
        }
        .showroom-phone-screen .t5 .photo-stage {
          width: 80px !important;
          height: 100px !important;
          top: 55% !important;
        }
        .showroom-phone-screen .t6 .photo-stage {
          width: 96px !important;
          height: 96px !important;
          top: 64% !important;
        }
        .showroom-phone-screen .pf-mono {
          font-size: 8px !important;
        }
        .showroom-phone-screen .pf-mono small {
          font-size: 4px !important;
          letter-spacing: 1.5px !important;
          margin-top: 1px !important;
        }
        .showroom-phone-screen .pf-finial {
          font-size: 10px !important;
          top: -10px !important;
        }
        .showroom-phone-screen .date-strip {
          bottom: 26px !important;
          left: 10px !important;
          right: 10px !important;
          padding: 4px 8px !important;
        }
        .showroom-phone-screen .date-strip span {
          font-size: 5.5px !important;
          letter-spacing: 0.8px !important;
        }
        .showroom-phone-screen .act-prompt {
          bottom: 8px !important;
          font-size: 5px !important;
          letter-spacing: 1px !important;
        }
        .showroom-phone-screen .brand-strip {
          font-size: 5.5px !important;
          letter-spacing: 1.5px !important;
        }
        .theme-card:hover .showroom-phone-screen .brand-strip {
          height: 22px !important;
        }

        /* Elephant scaling */
        .showroom-phone-screen .elephant-l,
        .showroom-phone-screen .elephant-r {
          bottom: 24px !important;
        }
        .showroom-phone-screen .elephant-l span,
        .showroom-phone-screen .elephant-r span {
          font-size: 44px !important;
        }
        .showroom-phone-screen .howdah-glint {
          bottom: 32px !important;
          width: 6px !important;
          height: 6px !important;
        }
        .showroom-phone-screen .howdah-glint.l { left: 10px !important; }
        .showroom-phone-screen .howdah-glint.r { right: 8px !important; }

        /* Thread scaling */
        .showroom-phone-screen .bell-wrap {
          top: 10px !important;
        }
        .showroom-phone-screen .bell-string {
          height: 22px !important;
        }
        .showroom-phone-screen .bell-icon {
          font-size: 20px !important;
        }
        .showroom-phone-screen .tassel {
          top: 70px !important;
          font-size: 5.5px !important;
          letter-spacing: -1.5px !important;
        }

        /* Diya scaling */
        .showroom-phone-screen .moon {
          top: 12px !important;
          right: 14px !important;
          width: 14px !important;
          height: 14px !important;
        }
        .showroom-phone-screen .diya-wrap {
          bottom: 8px !important;
        }
        .showroom-phone-screen .diya-flame {
          font-size: 18px !important;
        }
        .showroom-phone-screen .diya-glow {
          bottom: 2px !important;
          width: 70px !important;
          height: 30px !important;
        }

        /* Lotus scaling */
        .showroom-phone-screen .ripple {
          bottom: 18px !important;
        }
        .showroom-phone-screen .water-diya {
          bottom: 22px !important;
          font-size: 9px !important;
        }
        .showroom-phone-screen .lp {
          width: 18px !important;
          height: 28px !important;
          margin-left: -9px !important;
          margin-top: -14px !important;
        }
        @keyframes lotusBloomPhone {
          0% { transform: rotate(var(--lr)) translateY(4px) scale(0.15); opacity: 0; }
          100% { transform: rotate(var(--lr)) translateY(-34px) scale(1); opacity: 0.92; }
        }
        @keyframes lotusSwayPhone {
          0%,100% { transform: rotate(var(--lr)) translateY(-34px) scale(1); }
          50% { transform: rotate(calc(var(--lr) + 1.4deg)) translateY(-36px) scale(1.03); }
        }
        .showroom-phone-screen .lp {
          animation: lotusBloomPhone 1.6s cubic-bezier(0.22,1,0.36,1) both, lotusSwayPhone 4s ease-in-out infinite 1.6s !important;
        }

        /* Palace scaling */
        .showroom-phone-screen .palace-jaali {
          top: 18px !important;
          width: 110px !important;
          height: 144px !important;
          border-radius: 55px 55px 6px 6px / 70px 70px 6px 6px !important;
        }
        .showroom-phone-screen .palace-jaali::before {
          top: 8px !important;
          left: 8px !important;
          right: 8px !important;
          border-radius: 47px 47px 4px 4px / 62px 62px 4px 4px !important;
        }
        .showroom-phone-screen .red-carpet {
          width: 38px !important;
        }
        @keyframes carpetUnrollPhone {
          0% { height: 0; opacity: 0; }
          25% { height: 50px; opacity: 1; }
          85% { height: 50px; opacity: 1; }
          100% { height: 0; opacity: 0; }
        }
        .showroom-phone-screen .red-carpet {
          animation: carpetUnrollPhone 5s ease-out infinite !important;
        }
        .showroom-phone-screen .arch-light {
          width: 3px !important;
          height: 3px !important;
        }

        /* Garland scaling */
        .showroom-phone-screen .garland-wrap {
          top: 36px !important;
          height: 40px !important;
        }
        .showroom-phone-screen .garland-string {
          height: 20px !important;
        }
        .showroom-phone-screen .g-flower {
          font-size: 10px !important;
          top: -4px !important;
        }
        .showroom-phone-screen .mango-leaf {
          top: 10px !important;
          font-size: 8px !important;
        }
        .showroom-phone-screen .marigold-ring {
          transform: scale(0.55) !important;
        }
      `}</style>

      {/* Showroom Title */}
      <div className="text-center space-y-2">
        <h3 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
          Explore Digital Invitations
        </h3>
        <p className="text-xs text-stone-400 max-w-sm mx-auto">
          Hover over the cover styles to watch live interactive animations. Choose a style to begin.
        </p>
      </div>

      {/* Showroom Grid */}
      <div className="showroom-grid">
        {themes.map((t) => (
          <div
            key={t.id}
            id={`theme-card-${t.id}`}
            onClick={() => handleDemoClick(t.id)}
            className="rounded-[32px] bg-white/5 border border-white/10 p-6 flex flex-col justify-between shadow-2xl hover:border-amber-400/40 transition-all duration-300 relative group overflow-hidden backdrop-blur-md"
          >
            {/* Phone Bezel Container */}
            <div className="w-full flex justify-center mb-6 pt-2">
              <div className="w-[180px] h-[320px] rounded-[36px] border-[5px] border-stone-800 bg-[#08000F] relative shadow-lg overflow-hidden flex flex-col justify-between">
                
                {/* Phone screen containing the visual preview */}
                <div className="showroom-phone-screen w-full h-full relative overflow-hidden">
                  {/* Common Backdrop Vignette and Grain */}
                  <div className="grain"></div>
                  <div className="vignette"></div>

                  {/* Visual Preview Motif inside Bezel */}
                  <div className={`preview ${t.class}`}>
                    {(() => {
                      switch (t.id) {
                        case "elephant":
                          return (
                            <>
                              <div className="t1-groundlight" />
                              <div id="petals1">
                                {[...Array(18)].map((_, i) => (
                                  <div
                                    key={`petal-${i}`}
                                    className="marigold-petal"
                                    style={{
                                      left: `${(i * 23 + 12) % 95}%`,
                                      top: "-20px",
                                      fontSize: `${10 + (i % 3) * 5}px`,
                                      animationDuration: `${3 + (i % 4)}s`,
                                      animationDelay: `${i * 0.25}s`,
                                    }}
                                  >
                                    {['🌼','🌸','🌺'][i % 3]}
                                  </div>
                                ))}
                              </div>
                              <div id="sparks1">
                                {[...Array(20)].map((_, i) => {
                                  const dx = ((i * 17) % 80) - 40;
                                  const dy = ((i * 23) % 80) - 40;
                                  return (
                                    <div
                                      key={`sparkle-${i}`}
                                      className="sparkle"
                                      style={{
                                        left: `${15 + (i * 7) % 70}%`,
                                        top: `${10 + (i * 11) % 30}%`,
                                        // @ts-ignore
                                        "--dx": `${dx}px`,
                                        "--dy": `${dy}px`,
                                        animationDuration: `${1.5 + (i % 3)}s`,
                                        animationDelay: `${i * 0.15}s`,
                                      }}
                                    />
                                  );
                                })}
                              </div>

                              <div className="elephant-l"><span>🐘</span></div>
                              <div className="howdah-glint l"></div>
                              <div className="elephant-r"><span>🐘</span></div>
                              <div className="howdah-glint r"></div>
                            </>
                          );
                        case "thread":
                          return (
                            <>
                              <div className="tassel" style={{ left: "10%" }}>🔴🟡🔴🟡🔴🟡</div>
                              <div className="tassel" style={{ left: "26%", animationDelay: "0.3s" }}>🟡🔴🟡🔴🟡</div>
                              <div className="tassel" style={{ left: "44%", animationDelay: "0.6s" }}>🔴🟡🔴🟡🔴🟡</div>
                              <div className="tassel" style={{ left: "62%", animationDelay: "0.9s" }}>🟡🔴🟡🔴🟡</div>
                              <div className="tassel" style={{ left: "80%", animationDelay: "0.4s" }}>🔴🟡🔴🟡🔴</div>

                              <div className="bell-wrap">
                                <div className="bell-string"></div>
                                <span className="bell-icon">🔔</span>
                              </div>
                              <div id="bindis2">
                                {[...Array(8)].map((_, i) => (
                                  <div
                                    key={`bindi-${i}`}
                                    className="bindi"
                                    style={{
                                      width: `${8 + (i % 3) * 3}px`,
                                      height: `${8 + (i % 3) * 3}px`,
                                      left: `${10 + (i * 13) % 80}%`,
                                      top: `${44 + (i * 7) % 35}%`,
                                      animationDuration: `${2 + (i % 3)}s`,
                                      animationDelay: `${i * 0.25}s`,
                                    }}
                                  />
                                ))}
                              </div>

                              <div className="knot-ring"></div>
                            </>
                          );
                        case "diya":
                          return (
                            <>
                              <div className="moon"></div>
                              <div id="stars3">
                                {[...Array(44)].map((_, i) => (
                                  <div
                                    key={`star-${i}`}
                                    className="night-star"
                                    style={{
                                      width: `${0.8 + (i % 3) * 0.6}px`,
                                      height: `${0.8 + (i % 3) * 0.6}px`,
                                      left: `${(i * 17 + 5) % 100}%`,
                                      top: `${(i * 23 + 2) % 65}%`,
                                      animationDuration: `${1.5 + (i % 4) * 0.8}s`,
                                      animationDelay: `${i * 0.1}s`,
                                    }}
                                  />
                                ))}
                              </div>
                              <div id="fireflies3">
                                {[...Array(12)].map((_, i) => {
                                  const fx = ((i * 11) % 60) - 30;
                                  const fy = ((i * 13) % 60) - 30;
                                  const fx2 = ((i * 17) % 80) - 40;
                                  const fy2 = ((i * 19) % 80) - 40;
                                  return (
                                    <div
                                      key={`firefly-${i}`}
                                      className="firefly"
                                      style={{
                                        left: `${10 + (i * 7) % 80}%`,
                                        top: `${16 + (i * 9) % 60}%`,
                                        // @ts-ignore
                                        "--fx": `${fx}px`,
                                        "--fy": `${fy}px`,
                                        "--fx2": `${fx2}px`,
                                        "--fy2": `${fy2}px`,
                                        animationDuration: `${3 + (i % 3)}s`,
                                        animationDelay: `${i * 0.3}s`,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                              <div id="embers3" className="diya-embers">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={`ember-${i}`}
                                    className="ember"
                                    style={{
                                      left: `${40 + (i * 7) % 20}%`,
                                      bottom: `${(i * 3) % 20}%`,
                                      // @ts-ignore
                                      "--ex": `${((i * 13) % 30) - 15}px`,
                                      animationDuration: `${2.5 + (i % 3)}s`,
                                      animationDelay: `${i * 0.3}s`,
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="diya-glow"></div>
                              <div className="diya-wrap"><span className="diya-flame">🪔</span></div>
                            </>
                          );
                        case "lotus":
                          return (
                            <>
                              <div className="ripple" style={{ animationDuration: "2.6s", animationDelay: "0s" }}></div>
                              <div className="ripple" style={{ animationDuration: "2.6s", animationDelay: "0.9s" }}></div>
                              <div className="ripple" style={{ animationDuration: "2.6s", animationDelay: "1.8s" }}></div>
                              <div className="water-diya" style={{ bottom: "30px", left: "16%" }}>🪔</div>
                              <div className="water-diya" style={{ bottom: "26px", left: "68%", animationDelay: "1s" }}>🪔</div>
                              <div className="lotus-ring">
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                  const colors = ['#FF8FAB','#FF6B9D','#E91E8C','#C2185B','#FF8FAB','#FF6B9D','#E91E8C','#C2185B'];
                                  return (
                                    <div
                                      key={`lotus-petal-${i}`}
                                      className="lp"
                                      style={{
                                        background: `linear-gradient(to top, ${colors[i]}, ${colors[i]}77)`,
                                        // @ts-ignore
                                        "--lr": `${angle}deg`,
                                        transform: `rotate(${angle}deg) translateY(6px) scale(0.15)`,
                                        animationDelay: `${0.2 + i * 0.08}s, ${1.6 + i * 0.08}s`,
                                        opacity: 0,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </>
                          );
                        case "jaipur":
                          return (
                            <>
                              <div id="dust5">
                                {[...Array(25)].map((_, i) => (
                                  <div
                                    key={`dust-${i}`}
                                    className="palace-dust"
                                    style={{
                                      left: `${(i * 13) % 100}%`,
                                      top: "-10px",
                                      animationDuration: `${2 + (i % 3)}s`,
                                      animationDelay: `${i * 0.15}s`,
                                    }}
                                  >
                                    {['✦','·','★','✧'][i % 4]}
                                  </div>
                                ))}
                              </div>
                              <div id="archlights5">
                                {[
                                  {l:'32%',t:'18%'},{l:'50%',t:'14%'},{l:'68%',t:'18%'},
                                  {l:'26%',t:'30%'},{l:'74%',t:'30%'},{l:'50%',t:'34%'}
                                ].map((pos, i) => (
                                  <div
                                    key={`light-${i}`}
                                    className="arch-light"
                                    style={{
                                      left: pos.l,
                                      top: pos.t,
                                      animationDuration: `${0.8 + i * 0.15}s`,
                                      animationDelay: `${i * 0.1}s`,
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="palace-jaali"></div>
                              <div className="red-carpet"></div>
                            </>
                          );
                        case "garland":
                          return (
                            <>
                              <div id="flowers6">
                                {[...Array(20)].map((_, i) => (
                                  <div
                                    key={`falling-flower-${i}`}
                                    className="falling-flower"
                                    style={{
                                      left: `${(i * 7 + 3) % 100}%`,
                                      top: "-15px",
                                      fontSize: `${9 + (i % 3) * 5}px`,
                                      animationDuration: `${3 + (i % 3)}s`,
                                      animationDelay: `${i * 0.25}s`,
                                    }}
                                  >
                                    {['🌼','🌺','🌸','🟡'][i % 4]}
                                  </div>
                                ))}
                              </div>
                              <div className="garland-wrap">
                                <div className="garland-string"></div>
                                <div className="g-flower" style={{ left: "6%" }}>🌼</div>
                                <div className="g-flower" style={{ left: "16%", animationDelay: "0.2s" }}>🟡</div>
                                <div className="g-flower" style={{ left: "26%", animationDelay: "0.4s" }}>🌼</div>
                                <div className="g-flower" style={{ left: "36%", animationDelay: "0.6s" }}>🟡</div>
                                <div className="g-flower" style={{ left: "46%", animationDelay: "0.8s" }}>🌼</div>
                                <div className="g-flower" style={{ left: "56%", animationDelay: "0.5s" }}>🟡</div>
                                <div className="g-flower" style={{ left: "66%", animationDelay: "0.3s" }}>🌼</div>
                                <div className="g-flower" style={{ left: "76%", animationDelay: "0.7s" }}>🟡</div>
                                <div className="g-flower" style={{ left: "86%", animationDelay: "0.1s" }}>🌼</div>
                              </div>
                              <div className="mango-leaf" style={{ top: "36px", left: "6%" }}>🍃</div>
                              <div className="mango-leaf" style={{ top: "46px", right: "8%", animationDelay: "0.5s" }}>🍃</div>
                              <div className="mango-leaf" style={{ top: "30px", left: "42%", animationDelay: "1s" }}>🍃</div>
                              <div className="marigold-ring">
                                {[...Array(14)].map((_, i) => {
                                  const angle = (360 / 14) * i;
                                  const rad = 84;
                                  const rx = Math.cos(angle * Math.PI / 180) * rad;
                                  const ry = Math.sin(angle * Math.PI / 180) * rad;
                                  return (
                                    <div
                                      key={`marigold-${i}`}
                                      className="mf"
                                      style={{
                                        transform: `translate(${rx - 8}px, ${ry - 8}px)`,
                                      }}
                                    >
                                      {i % 2 === 0 ? '🌼' : '🟡'}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}

                    {/* Names Overlay */}
                    <div 
                      className={`names-overlay ${t.id === "thread" ? "t2-top" : t.id === "garland" ? "t6-top" : t.id === "jaipur" ? "t5-top" : ""}`}
                    >
                      <div className="no-tag" style={{ color: t.id === "elephant" ? "#E8C56A" : t.id === "thread" ? "#FF8FAB" : t.id === "diya" ? "#FF8C42" : t.id === "lotus" ? "#FF8FAB" : t.id === "jaipur" ? "#E8B86D" : "#FFA500" }}>✦ YOU'RE INVITED ✦</div>
                      <div className="no-n1" style={{ color: t.id === "elephant" ? "#FFE5A0" : t.id === "thread" ? "#FFD0D0" : t.id === "diya" ? "#FFE0B0" : t.id === "lotus" ? "#FFD0E8" : t.id === "jaipur" ? "#FFE8B0" : "#FFF3C0" }}>{t.n1}</div>
                      <div className="no-w" style={{ color: t.id === "elephant" ? "#D4A843" : t.id === "thread" ? "#E8567A" : t.id === "diya" ? "#FF8C42" : t.id === "lotus" ? "#FF8FAB" : t.id === "jaipur" ? "#D4A843" : "#FFA500" }}>{t.w}</div>
                      <div className="no-n2" style={{ color: t.id === "elephant" ? "#FFE5A0" : t.id === "thread" ? "#FFD0D0" : t.id === "diya" ? "#FFE0B0" : t.id === "lotus" ? "#FFD0E8" : t.id === "jaipur" ? "#FFE8B0" : "#FFF3C0" }}>{t.n2}</div>
                    </div>

                    {/* Photo Stage */}
                    <div className="photo-stage">
                      <div className="photo-frame">
                        <img 
                          src={activePhoto} 
                          alt="Couple Photo Preview" 
                          className="w-full h-full object-cover"
                          style={{
                            borderRadius: t.id === "elephant" ? "50% 50% 6px 6px / 62% 62% 6px 6px" :
                                          t.id === "jaipur" ? "75px 75px 8px 8px / 92px 92px 8px 8px" :
                                          "50%"
                          }}
                        />
                        <div className="pf-shine"></div>
                      </div>
                      {t.finial && <div className="pf-finial">{t.finial}</div>}
                    </div>

                    {/* Date strip & prompt details */}
                    <div className="date-strip">
                      <span>{t.date.toUpperCase()}</span>
                    </div>
                    <div className="act-prompt">{t.prompt}</div>
                    <div className="brand-strip">GETSHAADILINK.IN</div>
                  </div>
                </div>

                {/* iPhone notch and dynamic bar */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-stone-900 rounded-full z-30" />
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-stone-900/40 rounded-full z-30" />
              </div>
            </div>

            {/* Meta details outside the phone bezel */}
            <div className="space-y-3">
              <h4 className="font-marcellus text-lg font-bold tracking-wide text-amber-400">
                {t.name}
              </h4>
              <p className="text-[12.5px] text-stone-300/80 leading-relaxed min-h-[36px] mt-1.5">
                {t.tagline}
              </p>
              
              {/* Pricing details */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuildClick(t.id);
                }}
                className="w-full py-3 rounded-xl font-cinzel font-bold text-[10px] tracking-wider uppercase text-stone-950 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Try This Design</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDemoClick(t.id);
                }}
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
