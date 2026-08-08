import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { playClickSound } from "../utils/soundUtils";

interface OpeningThemesProps {
  theme: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland";
  bride: string;
  groom: string;
  niceDate: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgStyle: string;
  heroEmoji: string;
  onOpen: () => void;
  lang?: string;
  photo?: string;
  heroPhoto?: string;
}

export default function OpeningThemes({
  theme,
  bride,
  groom,
  niceDate,
  city,
  primaryColor,
  secondaryColor,
  accentColor,
  bgStyle,
  heroEmoji,
  onOpen,
  lang = "en",
  photo,
  heroPhoto,
}: OpeningThemesProps) {
  const [activated, setActivated] = useState(false);
  const [animState, setAnimState] = useState<string>("idle");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let target = new Date(niceDate);
    if (isNaN(target.getTime())) {
      target = new Date("2026-12-11T18:00:00");
    }

    const updateCountdown = () => {
      const difference = +target - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [niceDate]);

  const localTranslations: Record<string, Record<string, string>> = {
    en: {
      days: "D",
      hrs: "H",
      min: "M",
      sec: "S",
      weds: "weds",
      unveilingInvite: "Unveiling Invitation...",
      openPalaceDoors: "🚪 Open Palace Doors",
      lightUpCelebration: "🪔 Light Up Celebration",
      unfoldCard: "🪷 Unfold Card",
      enterCelebration: "🐘 Enter Celebration",
      liftGarland: "🌸 Lift Garland",
      tieKnot: "🔔 Tie The Knot",
      dragBell: "TAP BELL TO TIE THE KNOT",
      palaceDoorsPrompt: "TAP DOORS TO ENTER ROYAL CELEBRATION",
      mandalaSealPrompt: "TAP DIYA TO LIGHT CELEBRATION",
      archwayPrompt: "TAP LOTUS TO UNFOLD CARD",
      sealInvitationPrompt: "TAP BUTTON TO ENTER CELEBRATION",
      medallionGarlandPrompt: "TAP BUTTON TO LIFT GARLAND"
    },
    hi: {
      days: "दिन",
      hrs: "घं",
      min: "मि",
      sec: "से",
      weds: "संग",
      unveilingInvite: "निमंत्रण पत्र खोला जा रहा है...",
      openPalaceDoors: "🚪 महल के द्वार खोलें",
      lightUpCelebration: "🪔 उत्सव की दीप जलाएं",
      unfoldCard: "🪷 आमंत्रण पत्र खोलें",
      enterCelebration: "🐘 उत्सव में प्रवेश करें",
      liftGarland: "🌸 वरमाला उठाएं",
      tieKnot: "🔔 गठबंधन करें",
      dragBell: "गठबंधन के लिए घंटी दबाएं",
      palaceDoorsPrompt: "शाही उत्सव में प्रवेश के लिए द्वार छुएं",
      mandalaSealPrompt: "उत्सव के लिए दीप छुएं",
      archwayPrompt: "कार्ड खोलने के लिए कमल छुएं",
      sealInvitationPrompt: "निमंत्रण पत्र देखने के लिए बटन दबाएं",
      medallionGarlandPrompt: "वरमाला उठाने के लिए बटन दबाएं"
    },
    kn: {
      days: "ದಿನ",
      hrs: "ಗಂ",
      min: "ನಿ",
      sec: "ಸೆ",
      weds: "ಮತ್ತು",
      unveilingInvite: "ಆಮಂತ್ರಣವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ...",
      openPalaceDoors: "🚪 ಅರಮನೆಯ ಬಾಗಿಲು ತೆರೆಯಿರಿ",
      lightUpCelebration: "🪔 ದೀಪ ಬೆಳಗಿಸಿ ಸಂಭ್ರಮಿಸಿ",
      unfoldCard: "🪷 ಪತ್ರಿಕೆಯನ್ನು ತೆರೆಯಿರಿ",
      enterCelebration: "🐘 ಸಂಭ್ರಮಕ್ಕೆ ಪ್ರವೇಶಿಸಿ",
      liftGarland: "🌸 ಹಾರವನ್ನು ಎತ್ತಿ",
      tieKnot: "🔔 ಗಂಟು ಹಾಕಿ",
      dragBell: "ಮದುವೆ ಬಂಧನಕ್ಕಾಗಿ ಗಂಟೆ ಒತ್ತಿ",
      palaceDoorsPrompt: "ರಾಜಮನೆತನದ ಆಚರಣೆಗೆ ಪ್ರವೇಶಿಸಲು ಬಾಗಿಲು ಒತ್ತಿ",
      mandalaSealPrompt: "ದೀಪ ಬೆಳಗಿಸಲು ಒತ್ತಿ",
      archwayPrompt: "ಕಾರ್ಡ್ ತೆರೆಯಲು ಕಮಲ ಒತ್ತಿ",
      sealInvitationPrompt: "ಆಮಂತ್ರಣ ನೋಡಲು ಬಟನ್ ಒತ್ತಿ",
      medallionGarlandPrompt: "ಹಾರವನ್ನು ಎತ್ತಲು ಬಟನ್ ಒತ್ತಿ"
    },
    ta: {
      days: "நாள்",
      hrs: "மணி",
      min: "நிமி",
      sec: "நொடி",
      weds: "மற்றும்",
      unveilingInvite: "அழைப்பிதழ் திறக்கப்படுகிறது...",
      openPalaceDoors: "🚪 அரண்மனை கதவை திறக்க",
      lightUpCelebration: "🪔 வேடுகையை ஒளிரச் செய்க",
      unfoldCard: "🪷 அழைப்பிதழை திறக்க",
      enterCelebration: "🐘 வேடுகையில் நுழைக",
      liftGarland: "🌸 மாலையை உயர்த்துக",
      tieKnot: "🔔 முடிச்சு போடுக",
      dragBell: "முடிச்சு போட மணியைத் தட்டவும்",
      palaceDoorsPrompt: "கொண்டாட்டத்தில் நுழைய கதவைத் தட்டவும்",
      mandalaSealPrompt: "தீபம் ஏற்ற தட்டவும்",
      archwayPrompt: "அழைப்பிதழை திறக்க தாமரையை தட்டவும்",
      sealInvitationPrompt: "அழைப்பிதழைக் காண பொத்தானைத் தட்டவும்",
      medallionGarlandPrompt: "மாலையை உயர்த்த பொத்தானைத் தட்டவும்"
    },
    te: {
      days: "రోజు",
      hrs: "గం",
      min: "నిమి",
      sec: "సెకన్",
      weds: "మరియు",
      unveilingInvite: "ఆహ్వాన పత్రిక తెరవబడుతోంది...",
      openPalaceDoors: "🚪 రాజభవన ద్వారాలు తెరవండి",
      lightUpCelebration: "🪔 దీపం వెలిగించి సంబరాలు జరుపుకోండి",
      unfoldCard: "🪷 ఆహ్వాన పత్రికను తెరవండి",
      enterCelebration: "🐘 సంబరాలలోకి ప్రవేశించండి",
      liftGarland: "🌸 పూలదండను ఎత్తండి",
      tieKnot: "🔔 ముడి వేయండి",
      dragBell: "కళ్యాణ బంధం కోసం గంట నొక్కండి",
      palaceDoorsPrompt: "సంబరాలలోకి ప్రవేశించడానికి ద్వారాలను తాకండి",
      mandalaSealPrompt: "దీపం వెలిగించడానికి తాకండి",
      archwayPrompt: "కార్డ్ తెరవడానికి తామర పువ్వు తాకండి",
      sealInvitationPrompt: "ఆహ్వాన పత్రిక చూడటానికి బటన్ నొక్కండి",
      medallionGarlandPrompt: "పూలదండ ఎత్తడానికి బటన్ నొక్కండి"
    }
  };

  const t = (key: string): string => {
    const dict = localTranslations[lang] || localTranslations.en;
    return dict[key] || localTranslations.en[key] || "";
  };

  const handleActivate = () => {
    if (activated) return;
    playClickSound();
    setActivated(true);
    setAnimState("animating");
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  // Outer Envelope Frame Container - Capped and perfectly proportional
  const renderEnvelopeFrame = (
    bgGradient: string,
    interactiveEl: React.ReactNode,
    tapPrompt: string,
    isDark: boolean
  ) => {
    return (
      <div 
        className="relative w-full max-w-[350px] h-[84vh] max-h-[640px] min-h-[490px] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 select-none text-center flex flex-col justify-between"
        style={{ background: bgGradient }}
      >
        {/* Subtle Grain & Vignette */}
        <div className="grain" />
        <div className="vignette" />

        {/* Dynamic Theme Interactive Core */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {interactiveEl}

          {/* Date Strip at bottom */}
          <div className="date-strip">
            <span>{niceDate.toUpperCase()} · {city.toUpperCase()}</span>
          </div>

          {/* Action prompt text */}
          <div className="act-prompt">
            {activated ? t("unveilingInvite").toUpperCase() : tapPrompt.toUpperCase()}
          </div>

          {/* Bottom Branding */}
          <div className="brand-strip pointer-events-none opacity-40 !h-[28px] !flex items-center justify-center">
            GETSHAADILINK.IN
          </div>
        </div>
      </div>
    );
  };

  // Compact, single-row sleek countdown timer component
  const renderCountdown = (color: string) => {
    return (
      <div className="flex gap-2 text-center mt-1 z-20 pointer-events-none justify-center items-center opacity-90">
        <span className="text-xs font-marcellus font-bold tracking-wider" style={{ color }}>
          {timeLeft.days}<span className="text-[8px] opacity-70 ml-0.5">{t("days")}</span>
        </span>
        <span className="text-xs opacity-40" style={{ color }}>·</span>
        <span className="text-xs font-marcellus font-bold tracking-wider" style={{ color }}>
          {timeLeft.hours}<span className="text-[8px] opacity-70 ml-0.5">{t("hrs")}</span>
        </span>
        <span className="text-xs opacity-40" style={{ color }}>·</span>
        <span className="text-xs font-marcellus font-bold tracking-wider" style={{ color }}>
          {timeLeft.minutes}<span className="text-[8px] opacity-70 ml-0.5">{t("min")}</span>
        </span>
        <span className="text-xs opacity-40" style={{ color }}>·</span>
        <span className="text-xs font-marcellus font-bold tracking-wider" style={{ color }}>
          {timeLeft.seconds}<span className="text-[8px] opacity-70 ml-0.5">{t("sec")}</span>
        </span>
      </div>
    );
  };

  // 1. ROYAL ELEPHANT THEME
  const renderElephantTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";
    const marigoldPetals = ['🌼', '🌸', '🌺', '🌼', '🌸', '🌺', '🌼', '🌸', '🌺', '🌼', '🌸', '🌺'];
    return renderEnvelopeFrame(
      "linear-gradient(180deg, #3D1500 0%, #170900 75%, #0D0500 100%)",
      <div className="absolute inset-0 w-full h-full t1">
        <div className="t1-groundlight" />
        
        {/* Falling marigold petals */}
        {!activated && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {marigoldPetals.map((petal, i) => (
              <div
                key={`petal-${i}`}
                className="marigold-petal"
                style={{
                  left: `${6 + (i * 8.5) % 90}%`,
                  top: "-20px",
                  fontSize: `${10 + (i % 3) * 5}px`,
                  animationDuration: `${3.5 + (i % 4) * 1}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {petal}
              </div>
            ))}
          </div>
        )}

        {/* Gold sparkles */}
        {!activated && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="sparkle"
                style={{
                  left: `${15 + (i * 19) % 70}%`,
                  top: `${10 + (i * 23) % 30}%`,
                  animationDuration: `${1.5 + (i % 3) * 0.6}s`,
                  animationDelay: `${i * 0.25}s`,
                  "--dx": `${(i % 2 === 0 ? 30 : -30)}px`,
                  "--dy": `${-30 - (i % 3) * 12}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Left Elephant Clipart */}
        <motion.div 
          initial={{ x: 60 }}
          animate={activated ? { x: -160, opacity: 0 } : { x: 60 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="elephant-l absolute"
        >
           <span>🐘</span>
        </motion.div>
        
        {!activated && <div className="howdah-glint l" style={{ left: "95px" }} />}

        {/* Right Elephant Clipart */}
        <motion.div 
          initial={{ x: -60 }}
          animate={activated ? { x: 160, opacity: 0 } : { x: -60 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="elephant-r absolute"
        >
           <span>🐘</span>
        </motion.div>

        {!activated && <div className="howdah-glint r" style={{ right: "95px" }} />}

        {/* Names Overlay */}
        <div className="names-overlay">
          <div className="no-tag" style={{ color: "#E8C56A" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFE5A0" }}>{bride}</div>
          <div className="no-w" style={{ color: "#D4A843" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFE5A0" }}>{groom}</div>
          {renderCountdown("#FFE5A0")}
        </div>

        {/* Center Photo Frame (Static & Visible) */}
        <div className="photo-stage">
          <div className="photo-frame">
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "50% 50% 6px 6px / 62% 62% 6px 6px" }}
            />
            <div className="pf-shine" />
          </div>
          <div className="pf-finial">👑</div>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("enterCelebration").toUpperCase()}
          </button>
        )}
      </div>,
      t("sealInvitationPrompt"),
      false
    );
  };

  // 2. SACRED KNOT / THREAD THEME
  const renderThreadTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";
    const bindis = [...Array(8)].map((_, i) => ({
      left: `${10 + (i * 12 + 5) % 80}%`,
      top: `${44 + (i * 11 + 3) % 35}%`,
      size: 5 + (i % 3) * 3,
    }));

    return renderEnvelopeFrame(
      "radial-gradient(ellipse at 50% 26%, #4A0016 0%, #150007 60%, #0A0004 100%)",
      <div className="absolute inset-0 w-full h-full t2">
        {/* Hanging tassels at top */}
        {!activated && (
          <>
            <div className="tassel" style={{ left: "10%" }}>🔴🟡🔴🟡</div>
            <div className="tassel" style={{ left: "30%", animationDelay: "0.3s" }}>🟡🔴🟡</div>
            <div className="tassel" style={{ left: "50%", animationDelay: "0.6s" }}>🔴🟡🔴🟡</div>
            <div className="tassel" style={{ left: "70%", animationDelay: "0.9s" }}>🟡🔴🟡</div>
            <div className="tassel" style={{ left: "90%", animationDelay: "0.4s" }}>🔴🟡🔴</div>
          </>
        )}

        {/* Temple Bell */}
        {!activated && (
          <motion.div
            className="bell-wrap cursor-pointer"
            onClick={handleActivate}
            initial={{ x: "-50%", y: 0 }}
            animate={activated ? { x: "-50%", y: 220, opacity: 0 } : { x: "-50%", y: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="bell-string" />
            <span className="bell-icon">🔔</span>
          </motion.div>
        )}

        {/* Floating pink bindi dots */}
        {!activated && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {bindis.map((bindi, i) => (
              <div
                key={i}
                className="bindi"
                style={{
                  left: bindi.left,
                  top: bindi.top,
                  width: bindi.size,
                  height: bindi.size,
                  animationDuration: `${2 + (i % 2) * 2}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Names Overlay */}
        <div className="names-overlay" style={{ top: "45px" }}>
          <div className="no-tag" style={{ color: "#FF8FAB" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFD0D0" }}>{bride}</div>
          <div className="no-w" style={{ color: "#E8567A" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFD0D0" }}>{groom}</div>
          {renderCountdown("#FFD0D0")}
        </div>

        {/* Couple Photo Frame inside spinning dashed ring (Static & Visible) */}
        <div className="photo-stage" style={{ top: "52%" }}>
          <div className="knot-ring" />
          <div className="photo-frame">
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "50%" }}
            />
            <div className="pf-shine" />
          </div>
        </div>

        {/* Sound Waves on Open */}
        {activated && (
          <motion.div
            className="absolute z-10 w-28 h-28 border border-pink-400/50 rounded-full left-1/2 -translate-x-1/2"
            style={{ top: "52%", marginTop: "-14px" }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("tieKnot").toUpperCase()}
          </button>
        )}
      </div>,
      t("dragBell"),
      false
    );
  };

  // 3. MIDNIGHT DIYA THEME
  const renderDiyaTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";
    const diyaFlameVariants = {
      flicker: {
        scale: [1, 1.18, 0.92, 1.12, 0.96, 1],
        rotate: [0, 2, -2, 1, -1, 0],
        transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
      },
      activated: {
        scale: 30,
        opacity: [1, 0.8, 0],
        transition: { duration: 0.9, ease: "easeOut" }
      }
    };

    const starPositions = [...Array(32)].map((_, i) => ({
      left: `${(i * 17 + 7) % 95}%`,
      top: `${(i * 13 + 3) % 65}%`,
      size: i % 5 === 0 ? 2 : 0.8,
      delay: (i * 0.15) % 3,
      duration: 1.5 + (i % 4) * 0.5,
    }));

    return renderEnvelopeFrame(
      "radial-gradient(ellipse at 50% 78%, #20103A 0%, #0A0414 55%, #040108 100%)",
      <div className="absolute inset-0 w-full h-full t3">
        
        {/* Full-screen warm light-up flash on click */}
        {activated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 z-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,160,0,0.7) 0%, rgba(255,111,0,0.3) 50%, transparent 100%)"
            }}
          />
        )}

        {/* Crescent Moon */}
        {!activated && (
          <div className="moon" />
        )}

        {/* Twinkling stars */}
        {!activated && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {starPositions.map((star, i) => (
              <div
                key={`star-${i}`}
                className="night-star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  animationDuration: `${star.duration}s`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating fireflies */}
        {!activated && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={`firefly-${i}`}
                className="firefly"
                style={{
                  left: `${10 + (i * 19) % 80}%`,
                  top: `${16 + (i * 23) % 60}%`,
                  animationDuration: `${3 + (i % 3) * 1}s`,
                  animationDelay: `${i * 0.4}s`,
                  "--fx": `${(i % 3 === 0 ? 25 : -25)}px`,
                  "--fy": `${-18 - (i % 2) * 8}px`,
                  "--fx2": `${(i % 2 === 0 ? -30 : 30)}px`,
                  "--fy2": `${-30 - (i % 3) * 12}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Names Overlay */}
        <div className="names-overlay">
          <div className="no-tag" style={{ color: "#FF8C42" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFE0B0" }}>{bride}</div>
          <div className="no-w" style={{ color: "#FF8C42" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFE0B0" }}>{groom}</div>
          {renderCountdown("#FFE0B0")}
        </div>

        {/* Center photo frame (Static & Visible) */}
        <div className="photo-stage" style={{ top: "48%" }}>
          <div id="embers3" className="diya-embers">
            {!activated && [...Array(8)].map((_, i) => (
              <div
                key={`ember-${i}`}
                className="ember"
                style={{
                  left: `${40 + (i * 11) % 20}%`,
                  bottom: `${(i * 3) % 20}%`,
                  animationDuration: `${2.5 + (i % 2) * 1}s`,
                  animationDelay: `${i * 0.3}s`,
                  "--ex": `${(i % 2 === 0 ? 12 : -12)}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="photo-frame">
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "50%" }}
            />
            <div className="pf-shine" />
          </div>
        </div>

        {/* Earthen Diya body */}
        <div className="diya-glow" />
        <div className="diya-wrap cursor-pointer" onClick={handleActivate}>
          <motion.span
            variants={diyaFlameVariants}
            animate={activated ? "activated" : "flicker"}
            className="diya-flame"
            style={{ willChange: "transform, opacity" }}
          >
            🪔
          </motion.span>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("lightUpCelebration").toUpperCase()}
          </button>
        )}
      </div>,
      t("mandalaSealPrompt"),
      true
    );
  };

  // 4. TEMPLE LOTUS THEME
  const renderLotusTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";
    const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    const colors = ['#FF8FAB', '#FF6B9D', '#E91E8C', '#C2185B', '#FF8FAB', '#FF6B9D', '#E91E8C', '#C2185B'];

    const currentPetalRad = activated ? -150 : -46;
    const currentPetalScale = activated ? 0.1 : 1;
    const currentPetalOpacity = activated ? 0 : 0.92;

    return renderEnvelopeFrame(
      "linear-gradient(180deg, #3D1030 0%, #1A0010 55%, #080004 100%)",
      <div className="absolute inset-0 w-full h-full t4">
        {/* Ripples */}
        {!activated && (
          <>
            <div className="ripple" style={{ animationDuration: "2.6s", animationDelay: "0s" }} />
            <div className="ripple" style={{ animationDuration: "2.6s", animationDelay: "0.9s" }} />
          </>
        )}

        {/* Water diyas */}
        {!activated && (
          <>
            <div className="water-diya" style={{ bottom: "28px", left: "16%" }}>🪔</div>
            <div className="water-diya" style={{ bottom: "24px", left: "68%", animationDelay: "1s" }}>🪔</div>
          </>
        )}

        {/* Names Overlay */}
        <div className="names-overlay">
          <div className="no-tag" style={{ color: "#FF8FAB" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFD0E8" }}>{bride}</div>
          <div className="no-w" style={{ color: "#FF8FAB" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFD0E8" }}>{groom}</div>
          {renderCountdown("#FFD0E8")}
        </div>

        {/* Couple Photo Frame inside blooming ring (Static & Visible) */}
        <div className="photo-stage cursor-pointer" onClick={handleActivate} style={{ top: "48%", width: "150px", height: "150px" }}>
          <div className="lotus-ring">
            {petalAngles.map((angle, i) => (
              <div
                key={i}
                className="lp"
                style={{
                  background: `linear-gradient(to top, ${colors[i % colors.length]}, ${colors[i % colors.length]}77)`,
                  "--lr": `${angle}deg`,
                  transform: `rotate(${angle}deg) translateY(${currentPetalRad}px) scale(${currentPetalScale})`,
                  opacity: currentPetalOpacity,
                  transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s",
                  transitionDelay: `${i * 0.03}s`
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="photo-frame" style={{ width: "102px", height: "102px", left: "50%", top: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%", boxShadow: "0 0 0 3px #150008, 0 0 0 4px #FF8FAB, 0 0 24px 4px rgba(255,143,171,0.4)", zIndex: 8 }}>
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "50%" }}
            />
            <div className="pf-shine" />
          </div>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("unfoldCard").toUpperCase()}
          </button>
        )}
      </div>,
      t("archwayPrompt"),
      false
    );
  };

  // 5. ROYAL PALACE / JAIPUR THEME
  const renderJaipurTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";

    return renderEnvelopeFrame(
      "linear-gradient(180deg, #3D1800 0%, #160700 70%, #0C0400 100%)",
      <div className="absolute inset-0 w-full h-full t5">
        {/* Ornate jaali lattice arch */}
        {!activated && (
          <div className="palace-jaali" />
        )}

        {/* Twinkling arch lights */}
        {!activated && (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="arch-light" style={{ left: '32%', top: '18%', animationDelay: '0.1s' }} />
            <div className="arch-light" style={{ left: '50%', top: '14%', animationDelay: '0.3s' }} />
            <div className="arch-light" style={{ left: '68%', top: '18%', animationDelay: '0.5s' }} />
          </div>
        )}

        {/* Falling gold dust */}
        {!activated && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {[...Array(18)].map((_, i) => (
              <div
                key={`dust-${i}`}
                className="palace-dust"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animationDuration: `${2 + (i % 3) * 1}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {['✦', '·', '★', '✧'][i % 4]}
              </div>
            ))}
          </div>
        )}

        {/* Red carpet */}
        {!activated && (
          <div className="red-carpet" />
        )}

        {/* Names Overlay */}
        <div className="names-overlay">
          <div className="no-tag" style={{ color: "#E8B86D" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFE8B0" }}>{bride}</div>
          <div className="no-w" style={{ color: "#D4A843" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFE8B0" }}>{groom}</div>
          {renderCountdown("#FFE8B0")}
        </div>

        {/* Arch-shaped Photo Frame inside (Static & Visible) */}
        <div className="photo-stage" style={{ top: "48%", width: "120px", height: "154px" }}>
          <div className="photo-frame">
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "60px 60px 8px 8px / 75px 75px 8px 8px" }}
            />
            <div className="pf-shine" />
          </div>
          <div className="pf-finial">☀</div>
        </div>

        {/* Left Palace Door (Swings open on click) — sits behind photo */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={activated ? { rotateY: -80, x: -100, opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onClick={handleActivate}
          style={{ transformPerspective: 800, transformOrigin: "left", willChange: "transform, opacity" }}
          className="absolute left-1/2 -translate-x-[75px] z-[6] w-[55px] h-[154px] top-[48%] -translate-y-1/2 shadow-xl flex items-center justify-end overflow-hidden cursor-pointer"
        >
          <svg viewBox="0 0 100 160" className="w-full h-full">
            <path d="M 0,160 L 100,160 L 100,0 C 70,25 30,30 0,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
            <path d="M 8,150 L 92,150 L 92,10 C 65,30 35,35 8,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>
        </motion.div>

        {/* Right Palace Door (Swings open on click) — sits behind photo */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={activated ? { rotateY: 80, x: 100, opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onClick={handleActivate}
          style={{ transformPerspective: 800, transformOrigin: "right", willChange: "transform, opacity" }}
          className="absolute left-1/2 translate-x-[20px] z-[6] w-[55px] h-[154px] top-[48%] -translate-y-1/2 shadow-xl flex items-center justify-start overflow-hidden cursor-pointer"
        >
          <svg viewBox="0 0 100 160" className="w-full h-full">
            <path d="M 100,160 L 0,160 L 0,0 C 30,25 70,30 100,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
            <path d="M 92,150 L 8,150 L 8,10 C 35,30 65,35 92,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>
        </motion.div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("openPalaceDoors").toUpperCase()}
          </button>
        )}
      </div>,
      t("palaceDoorsPrompt"),
      false
    );
  };

  // 6. MARIGOLD GARLAND THEME
  const renderGarlandTheme = () => {
    const activePhoto = heroPhoto || photo || "/samples/couple_realistic.png";
    const fallingFlowers = ["🌼", "🌺", "🌸", "🟡", "🌼", "🌺", "🌸", "🟡", "🌼", "🌺", "🌸", "🟡"];

    return renderEnvelopeFrame(
      "linear-gradient(180deg, #1A2400 0%, #0A0F02 70%, #050700 100%)",
      <div className="absolute inset-0 w-full h-full t6">
        
        {/* Garland string (lifts away on click) */}
        {!activated && (
          <motion.div 
            className="garland-wrap"
            initial={{ y: 0 }}
            animate={activated ? { y: -120, opacity: 0 } : { y: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="garland-string"></div>
            <div className="g-flower" style={{ left: "6%" }}>🌼</div>
            <div className="g-flower" style={{ left: "20%", animationDelay: "0.2s" }}>🟡</div>
            <div className="g-flower" style={{ left: "34%", animationDelay: "0.4s" }}>🌼</div>
            <div className="g-flower" style={{ left: "48%", animationDelay: "0.6s" }}>🟡</div>
            <div className="g-flower" style={{ left: "62%", animationDelay: "0.8s" }}>🌼</div>
            <div className="g-flower" style={{ left: "76%", animationDelay: "0.5s" }}>🟡</div>
            <div className="g-flower" style={{ left: "90%", animationDelay: "0.3s" }}>🌼</div>
          </motion.div>
        )}

        {/* Mango leaves */}
        {!activated && (
          <>
            <div className="mango-leaf" style={{ top: "26px", left: "6%" }}>🍃</div>
            <div className="mango-leaf" style={{ top: "32px", right: "8%", animationDelay: "0.5s" }}>🍃</div>
          </>
        )}

        {/* Falling flowers */}
        {!activated && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {fallingFlowers.map((flower, i) => (
              <div
                key={`falling-${i}`}
                className="falling-flower"
                style={{
                  left: `${Math.random() * 95}%`,
                  top: "-15px",
                  fontSize: `${9 + (i % 3) * 4}px`,
                  animationDuration: `${3 + (i % 3) * 1.2}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {flower}
              </div>
            ))}
          </div>
        )}

        {/* Names Overlay */}
        <div className="names-overlay" style={{ top: "45px" }}>
          <div className="no-tag" style={{ color: "#FFA500" }}>✦ YOU'RE INVITED ✦</div>
          <div className="no-n1" style={{ color: "#FFF3C0" }}>{bride}</div>
          <div className="no-w" style={{ color: "#FFA500" }}>weds</div>
          <div className="no-n2" style={{ color: "#FFF3C0" }}>{groom}</div>
          {renderCountdown("#FFF3C0")}
        </div>

        {/* Photo Frame inside spinning marigold ring (Static & Visible) */}
        <div className="photo-stage cursor-pointer" onClick={handleActivate} style={{ top: "52%", width: "150px", height: "150px" }}>
          <div className="marigold-ring">
            {[...Array(12)].map((_, i) => {
              const angle = (360 / 12) * i;
              const rad = 66;
              const currentRad = activated ? rad * 2.2 : rad;
              const rx = Math.cos(angle * Math.PI / 180) * currentRad;
              const ry = Math.sin(angle * Math.PI / 180) * currentRad;
              const currentScale = activated ? 0.2 : 1;
              const currentOpacity = activated ? 0 : 1;

              return (
                <div
                  key={i}
                  className="mf"
                  style={{
                    transform: `translate(${rx - 8}px, ${ry - 8}px) scale(${currentScale})`,
                    opacity: currentOpacity,
                    transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s"
                  }}
                >
                  {i % 2 === 0 ? "🌼" : "🟡"}
                </div>
              );
            })}
          </div>
          <div className="photo-frame" style={{ width: "102px", height: "102px", left: "50%", top: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%", boxShadow: "0 0 0 3px #0A0F02, 0 0 0 4px #FFA500, 0 0 22px 3px rgba(255,165,0,0.4)", zIndex: 8 }}>
            <div className="pf-fill" />
            <img 
              src={activePhoto} 
              className="w-full h-full object-cover absolute inset-0 z-10" 
              style={{ borderRadius: "50%" }}
            />
            <div className="pf-shine" />
          </div>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="try-btn absolute bottom-[56px] left-1/2 -translate-x-1/2 z-20"
          >
            {t("liftGarland").toUpperCase()}
          </button>
        )}
      </div>,
      t("medallionGarlandPrompt"),
      false
    );
  };

  const getThemeRenderer = () => {
    switch (theme) {
      case "elephant":
        return renderElephantTheme();
      case "thread":
        return renderThreadTheme();
      case "diya":
        return renderDiyaTheme();
      case "lotus":
        return renderLotusTheme();
      case "jaipur":
        return renderJaipurTheme();
      case "garland":
        return renderGarlandTheme();
      default:
        return renderElephantTheme();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center p-3 bg-[#0A0709]/95 backdrop-blur-md"
      style={{ willChange: "transform, opacity" }}
    >
      {/* CSS style block containing theme layout rules */}
      <style>{`
        /* ══ AMBIENT PAGE BACKDROP ══ */
        .grain{
          position:absolute;inset:0;z-index:20;pointer-events:none;opacity:0.4;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/></svg>");
        }
        .vignette{position:absolute;inset:0;z-index:19;pointer-events:none;box-shadow:inset 0 0 80px 20px rgba(0,0,0,0.55);}
        
        /* Fixed Absolute Positioning matching Choice Your Theme HTML Mockup */
        .names-overlay{position:absolute;top:16px;left:0;right:0;text-align:center;z-index:11;pointer-events:none;}
        .no-tag{font-family:'Italiana',serif;font-size:8px;letter-spacing:3.5px;margin-bottom:3px;opacity:0.75;}
        .no-n1{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;font-weight:600;line-height:1.1;text-shadow:0 2px 14px rgba(0,0,0,0.75);}
        .no-w{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2.5px;margin:2px 0;opacity:0.8;}
        .no-n2{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;font-weight:600;line-height:1.1;text-shadow:0 2px 14px rgba(0,0,0,0.75);}

        .photo-stage{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);z-index:8;width:140px;height:140px;}
        .photo-frame{
          position:absolute;inset:0;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
          animation:frameReveal 1.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes frameReveal{0%{opacity:0;transform:scale(0.7);filter:blur(6px);}100%{opacity:1;transform:scale(1);filter:blur(0);}}
        .pf-fill{position:absolute;inset:0;}
        .pf-shine{position:absolute;inset:0;z-index:3;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,0.16) 50%,transparent 60%);background-size:250% 250%;animation:pfShine 5s ease-in-out infinite;}
        @keyframes pfShine{0%{background-position:120% 0%;}50%{background-position:-20% 100%;}100%{background-position:120% 0%;}}

        .date-strip{
          position:absolute;bottom:28px;left:16px;right:16px;
          background:rgba(0,0,0,0.45);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          border-radius:100px;padding:6px 12px;
          display:flex;align-items:center;justify-content:center;gap:4px;
          border:1px solid rgba(255,255,255,0.08);z-index:12;
        }
        .date-strip span{font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:1.8px;color:rgba(245,236,215,0.7);}
        .act-prompt{
          position:absolute;bottom:8px;left:0;right:0;text-align:center;
          font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;
          color:rgba(245,236,215,0.4);z-index:12;
          animation:hintPulse 2.6s ease-in-out infinite;
        }
        @keyframes hintPulse{0%,100%{opacity:0.35;}50%{opacity:0.85;}}
        .brand-strip{
          position:absolute;bottom:0;left:0;right:0;
          display:flex;align-items:center;justify-content:center;
          background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);
          border-top:1px solid rgba(255,255,255,0.06);
          font-family:'Cinzel',serif;font-size:8px;letter-spacing:2.5px;
          color:rgba(245,236,215,0.32);
          z-index:15;
        }

        .try-btn{
          padding:9px 20px;border-radius:100px;border:none;cursor:pointer;
          font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:1.8px;
          transition:all 0.25s;flex-shrink:0;box-shadow:0 4px 14px rgba(0,0,0,0.4);
        }
        .try-btn:hover{transform:translateX(-50%) scale(1.04);}

        /* ══ THEME 1 — ROYAL ELEPHANT ══ */
        .t1-groundlight{position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(to top,rgba(139,58,0,0.45),transparent);z-index:1;}
        .marigold-petal{position:absolute;animation:petalFall linear infinite;opacity:0;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));}
        @keyframes petalFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0;}10%{opacity:0.85;}90%{opacity:0.5;}100%{transform:translateY(420px) rotate(360deg);opacity:0;}}
        .sparkle{position:absolute;width:3px;height:3px;border-radius:50%;background:#FFD700;animation:sparkleFly ease-in-out infinite;opacity:0;box-shadow:0 0 5px #FFD700;}
        @keyframes sparkleFly{0%{opacity:0;transform:scale(0);}30%{opacity:1;transform:scale(1);}70%{opacity:0.5;}100%{opacity:0;transform:scale(0) translate(var(--dx),var(--dy));}}

        .elephant-l,.elephant-r{position:absolute;bottom:45px;font-size:0;z-index:6;filter:drop-shadow(0 6px 12px rgba(0,0,0,0.55)) sepia(0.15);animation:elephantSway ease-in-out infinite alternate;}
        .elephant-l{left:-14px;animation-duration:3.2s,1.1s;transform-origin:bottom center;}
        .elephant-l span{font-size:62px;display:block;}
        .elephant-r{right:-14px;animation-duration:3.6s,1.1s;animation-direction:alternate-reverse,normal;transform-origin:bottom center;}
        .elephant-r span{font-size:62px;display:block;transform:scaleX(-1);}
        @keyframes elephantSway{0%{transform:rotate(-3deg) translateY(0);}100%{transform:rotate(3deg) translateY(-5px);}}
        .howdah-glint{position:absolute;bottom:58px;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle,#FFE9B0,#E8A84A);box-shadow:0 0 9px #FFD98A;animation:hglint 2.4s ease-in-out infinite;z-index:7;}
        @keyframes hglint{0%,100%{opacity:0.4;transform:scale(0.85);}50%{opacity:1;transform:scale(1.15);}}

        .t1 .photo-frame{border-radius:50% 50% 6px 6px / 62% 62% 6px 6px;box-shadow:0 10px 30px rgba(0,0,0,0.55),0 0 0 3px #170900,0 0 0 5px #E8A84A,0 0 22px 3px rgba(232,168,74,0.4);}
        .t1 .pf-fill{background:radial-gradient(ellipse at 32% 24%,rgba(255,224,170,0.24),transparent 55%),linear-gradient(155deg,#7A3A10,#2A0F02 78%);}
        .t1 .pf-finial{position:absolute;top:-15px;left:50%;transform:translateX(-50%);font-size:14px;z-index:9;color:#FFDFA0;text-shadow:0 0 8px rgba(232,168,74,0.4);}
        .t1 .try-btn{background:linear-gradient(135deg,#C8732A,#8B3A00);color:#FFF5E0;}

        /* ══ THEME 2 — SACRED KNOT ══ */
        .bell-wrap{position:absolute;top:0;left:50%;transform:translateX(-50%);text-align:center;z-index:12;}
        .bell-string{width:1px;height:24px;background:linear-gradient(to bottom,rgba(255,200,100,0.7),rgba(255,200,100,0.25));margin:0 auto;}
        .bell-icon{font-size:28px;display:block;animation:bellSwing 2.6s ease-in-out infinite;transform-origin:top center;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));}
        @keyframes bellSwing{0%,100%{transform:rotate(-10deg);}50%{transform:rotate(10deg);}}

        .tassel{position:absolute;top:0px;font-size:8px;color:rgba(255,200,100,0.55);letter-spacing:-2px;animation:tassleWave ease-in-out infinite alternate;z-index:4;}
        @keyframes tassleWave{0%{transform:rotate(-5deg);}100%{transform:rotate(5deg);}}
        .bindi{position:absolute;border-radius:50%;background:radial-gradient(circle,#FF8FAB,#8B0000);animation:bindiFloat ease-in-out infinite alternate;z-index:4;box-shadow:0 0 6px rgba(255,143,171,0.4);}
        @keyframes bindiFloat{0%{transform:translateY(0) scale(1);}100%{transform:translateY(-8px) scale(1.2);}}

        .t2 .photo-frame{border-radius:50%;box-shadow:0 10px 30px rgba(0,0,0,0.55),0 0 0 3px #0F0005,0 0 0 5px #F0708E,0 0 24px 3px rgba(232,86,122,0.42);}
        .t2 .pf-fill{background:radial-gradient(ellipse at 32% 26%,rgba(255,210,220,0.22),transparent 55%),linear-gradient(155deg,#7A0F30,#28000E 78%);}
        .knot-ring{position:absolute;inset:-8px;border-radius:50%;border:1.5px dashed rgba(240,112,142,0.35);animation:knotSpin 18s linear infinite;z-index:7;}
        @keyframes knotSpin{to{transform:rotate(360deg);}}
        .t2 .try-btn{background:linear-gradient(135deg,#8B0000,#C2185B);color:#FFE0E0;}

        /* ══ THEME 3 — MIDNIGHT DIYA ══ */
        .moon{position:absolute;top:14px;right:18px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFF6DE,#F0DFA0);box-shadow:0 0 18px 3px rgba(255,244,214,0.35);z-index:2;}
        .night-star{position:absolute;background:#fff;border-radius:50%;animation:starTwink ease-in-out infinite alternate;z-index:2;}
        @keyframes starTwink{0%{opacity:0.1;}100%{opacity:0.75;}}
        .diya-wrap{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);text-align:center;z-index:12;}
        .diya-flame{font-size:30px;display:block;animation:flameDance 2.2s ease-in-out infinite;transform-origin:bottom center;filter:drop-shadow(0 0 10px rgba(255,150,60,0.7));}
        @keyframes flameDance{0%,100%{transform:scaleX(1) scaleY(1) rotate(-2deg);}25%{transform:scaleX(0.9) scaleY(1.1) rotate(2deg);}50%{transform:scaleX(1.1) scaleY(0.95) rotate(-1deg);}75%{transform:scaleX(0.95) scaleY(1.05) rotate(1deg);}}
        .diya-glow{position:absolute;bottom:38px;left:50%;transform:translateX(-50%);width:110px;height:50px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,140,66,0.4) 0%,transparent 70%);filter:blur(8px);animation:glowPulse 1.8s ease-in-out infinite;z-index:5;}
        @keyframes glowPulse{0%,100%{opacity:0.6;transform:translateX(-50%) scale(1);}50%{opacity:1;transform:translateX(-50%) scale(1.2);}}
        .firefly{position:absolute;width:3.5px;height:3.5px;border-radius:50%;background:#FFD700;animation:fireflyFloat ease-in-out infinite;box-shadow:0 0 6px #FFD700;z-index:6;}
        @keyframes fireflyFloat{0%{opacity:0;transform:translate(0,0);}20%{opacity:1;}50%{opacity:0.7;transform:translate(var(--fx),var(--fy));}80%{opacity:1;}100%{opacity:0;transform:translate(var(--fx2),var(--fy2));}}
        .t3 .photo-frame{border-radius:50%;box-shadow:0 0 0 3px #08020F,0 0 0 5px #FF9756,0 0 32px 6px rgba(255,140,66,0.45),0 12px 30px rgba(0,0,0,0.6);}
        .t3 .pf-fill{background:radial-gradient(ellipse at 35% 30%,rgba(255,200,140,0.2),transparent 55%),linear-gradient(155deg,#3A1830,#0E0518 78%);}
        .diya-embers{position:absolute;inset:-8px;z-index:7;pointer-events:none;}
        .ember{position:absolute;width:2px;height:2px;border-radius:50%;background:#FFB870;box-shadow:0 0 4px #FFB870;animation:emberRise linear infinite;opacity:0;}
        @keyframes emberRise{0%{opacity:0;transform:translateY(0);}20%{opacity:0.9;}100%{opacity:0;transform:translateY(-50px) translateX(var(--ex));}}
        .t3 .try-btn{background:linear-gradient(135deg,#E65100,#FF8C42);color:#fff;}

        /* ══ THEME 4 — TEMPLE LOTUS ══ */
        .ripple{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);border-radius:50%;border:1px solid rgba(255,143,171,0.28);animation:rippleOut ease-out infinite;z-index:2;}
        @keyframes rippleOut{0%{width:16px;height:8px;opacity:0.85;transform:translateX(-50%);}100%{width:200px;height:55px;opacity:0;transform:translateX(-50%);}}
        .water-diya{position:absolute;bottom:24px;font-size:13px;animation:diyaDrift ease-in-out infinite;z-index:4;filter:drop-shadow(0 3px 5px rgba(0,0,0,0.4));}
        @keyframes diyaDrift{0%,100%{transform:translateX(0) rotate(-5deg);}50%{transform:translateX(6px) rotate(5deg);}}
        .lotus-ring{position:absolute;inset:0;z-index:7;}
        .lp{position:absolute;width:28px;height:44px;left:50%;top:50%;margin-left:-14px;margin-top:-22px;transform-origin:50% 100%;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;}
        .t4 .photo-frame{left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 0 3px #150008,0 0 0 4px #FF8FAB,0 0 24px 4px rgba(255,143,171,0.4),0 12px 28px rgba(0,0,0,0.55);z-index:8;}
        .t4 .pf-fill{background:radial-gradient(ellipse at 34% 28%,rgba(255,210,230,0.22),transparent 55%),linear-gradient(155deg,#6E1440,#22040F 78%);}
        .t4 .try-btn{background:linear-gradient(135deg,#C2185B,#FF6B9D);color:#fff;}

        /* ══ THEME 5 — ROYAL PALACE ══ */
        .palace-jaali{position:absolute;left:50%;top:20px;transform:translateX(-50%);width:160px;height:210px;z-index:5;
          border:2px solid rgba(232,184,109,0.35);
          border-radius:80px 80px 8px 8px / 100px 100px 8px 8px;
          background:
            repeating-linear-gradient(45deg,rgba(232,184,109,0.07) 0 2px,transparent 2px 12px),
            repeating-linear-gradient(-45deg,rgba(232,184,109,0.07) 0 2px,transparent 2px 12px);
          -webkit-mask-image:linear-gradient(to bottom,black,black 60%,transparent 100%);
          mask-image:linear-gradient(to bottom,black,black 60%,transparent 100%);
        }
        .red-carpet{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:54px;background:linear-gradient(to top,#7A0000,rgba(122,0,0,0.25));z-index:3;animation:carpetUnroll 5s ease-out infinite;}
        @keyframes carpetUnroll{0%{height:0;opacity:0;}25%{height:75px;opacity:1;}85%{height:75px;opacity:1;}100%{height:0;opacity:0;}}
        .palace-dust{position:absolute;font-size:7px;color:#FFD700;animation:dustFall linear infinite;opacity:0;z-index:6;}
        @keyframes dustFall{0%{opacity:0;transform:translateY(0) rotate(0);}20%{opacity:0.85;}80%{opacity:0.35;}100%{opacity:0;transform:translateY(280px) rotate(180deg);}}
        .arch-light{position:absolute;width:4.5px;height:4.5px;border-radius:50%;background:radial-gradient(circle,#FFD700,#FF8C00);box-shadow:0 0 8px #FFD700;animation:lightBlink ease-in-out infinite alternate;z-index:7;}
        @keyframes lightBlink{0%{opacity:0.3;transform:scale(0.8);}100%{opacity:1;transform:scale(1.2);}}
        .t5 .photo-frame{border-radius:60px 60px 8px 8px / 75px 75px 8px 8px;box-shadow:0 0 0 3px #160800,0 0 0 4px #E8B86D,0 0 24px 3px rgba(232,184,109,0.4),0 12px 30px rgba(0,0,0,0.6);}
        .t5 .pf-fill{background:radial-gradient(ellipse at 34% 22%,rgba(255,224,170,0.22),transparent 55%),linear-gradient(155deg,#6E3512,#220C02 78%);}
        .t5 .pf-finial{position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:13px;z-index:9;color:#FFE8B0;}
        .t5 .try-btn{background:linear-gradient(135deg,#8B3A1C,#C8722A);color:#FFF5E0;}

        /* ══ THEME 6 — MARIGOLD GARLAND ══ */
        .garland-wrap{position:absolute;top:0;left:0;right:0;height:45px;overflow:visible;z-index:9;}
        .garland-string{position:absolute;top:0;left:6%;right:6%;height:28px;border-bottom:2px solid rgba(212,168,67,0.32);border-radius:0 0 50% 50%;}
        .g-flower{position:absolute;top:-5px;font-size:15px;animation:garlandSway ease-in-out infinite;transform-origin:top center;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));}
        @keyframes garlandSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        .mango-leaf{position:absolute;top:20px;font-size:12px;animation:leafWave ease-in-out infinite alternate;z-index:4;}
        @keyframes leafWave{0%{transform:rotate(-8deg) translateY(0);}100%{transform:rotate(8deg) translateY(-3px);}}
        .falling-flower{position:absolute;font-size:10px;animation:flowerFall linear infinite;opacity:0;z-index:4;}
        @keyframes flowerFall{0%{opacity:0;transform:translateY(-10px) rotate(0);}15%{opacity:0.85;}85%{opacity:0.35;}100%{opacity:0;transform:translateY(360px) rotate(270deg);}}
        .marigold-ring{position:absolute;inset:0;z-index:7;animation:ringSpin 34s linear infinite;}
        .mf{position:absolute;font-size:15px;left:50%;top:50%;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));}
        .t6 .photo-frame{left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 0 3px #0A0F02,0 0 0 4px #FFA500,0 0 22px 3px rgba(255,165,0,0.4),0 12px 28px rgba(0,0,0,0.55);z-index:8;}
        .t6 .pf-fill{background:radial-gradient(ellipse at 34% 28%,rgba(255,240,190,0.22),transparent 55%),linear-gradient(155deg,#5A4A02,#141B00 78%);}
        .t6 .try-btn{background:linear-gradient(135deg,#E65100,#FFA500);color:#0A0F02;font-weight:600;}
      `}</style>

      {/* Center envelope wrapper */}
      <motion.div
        animate={activated ? { y: 35, scale: 0.95, opacity: 0 } : {}}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="z-10 w-full flex justify-center items-center"
        style={{ willChange: "transform, opacity" }}
      >
        {getThemeRenderer()}
      </motion.div>
    </motion.div>
  );
}
