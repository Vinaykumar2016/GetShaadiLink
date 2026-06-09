import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
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
}: OpeningThemesProps) {
  const [activated, setActivated] = useState(false);
  const [animState, setAnimState] = useState<string>("idle");
  const [threadY, setThreadY] = useState(0);

  // Countdown timer logic based on target wedding date
  const [timeLeft, setTimeLeft] = useState({ days: 190, hours: 7, minutes: 45, seconds: 43 });

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
      days: "Days",
      hrs: "Hrs",
      min: "Min",
      sec: "Sec",
      weds: "weds",
      unveilingInvite: "Unveiling Invitation...",
      openPalaceDoors: "🚪 Open Palace Doors",
      lightUpCelebration: "🪔 Light Up Celebration",
      unfoldCard: "🪷 Unfold Card",
      enterCelebration: "🐘 Enter Celebration",
      liftGarland: "🌸 Lift Garland",
      dragBell: "DRAG THE GOLDEN BELL DOWN TO TIE THE KNOT",
      palaceDoorsPrompt: "TAP DOORS TO ENTER ROYAL CELEBRATION",
      mandalaSealPrompt: "TAP MANDALA SEAL TO UNLOCK CARD",
      archwayPrompt: "TAP ARCHWAY TO REVEAL DETAILS",
      sealInvitationPrompt: "TAP SEAL TO REVEAL INVITATION",
      medallionGarlandPrompt: "TAP THE MEDALLION TO LIFT GARLAND"
    },
    hi: {
      days: "दिन",
      hrs: "घंटे",
      min: "मिनट",
      sec: "सेकंड",
      weds: "संग",
      unveilingInvite: "निमंत्रण पत्र खोला जा रहा है...",
      openPalaceDoors: "🚪 महल के द्वार खोलें",
      lightUpCelebration: "🪔 उत्सव की दीप जलाएं",
      unfoldCard: "🪷 आमंत्रण पत्र खोलें",
      enterCelebration: "🐘 उत्सव में प्रवेश करें",
      liftGarland: "🌸 वरमाला उठाएं",
      dragBell: "गठबंधन के लिए सोने की घंटी नीचे खींचें",
      palaceDoorsPrompt: "शाही उत्सव में प्रवेश के लिए द्वार छुएं",
      mandalaSealPrompt: "कार्ड खोलने के लिए मंडला सील छुएं",
      archwayPrompt: "विवरण देखने के लिए मेहराब छुएं",
      sealInvitationPrompt: "निमंत्रण पत्र देखने के लिए सील छुएं",
      medallionGarlandPrompt: "वरमाला उठाने के लिए पदक छुएं"
    },
    kn: {
      days: "ದಿನಗಳು",
      hrs: "ಗಂಟೆಗಳು",
      min: "ನಿಮಿಷಗಳು",
      sec: "ಸೆಕೆಂಡುಗಳು",
      weds: "ಮತ್ತು",
      unveilingInvite: "ಆಮಂತ್ರಣವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ...",
      openPalaceDoors: "🚪 ಅರಮನೆಯ ಬಾಗಿಲು ತೆರೆಯಿರಿ",
      lightUpCelebration: "🪔 ದೀಪ ಬೆಳಗಿಸಿ ಸಂಭ್ರಮಿಸಿ",
      unfoldCard: "🪷 ಪತ್ರಿಕೆಯನ್ನು ತೆರೆಯಿರಿ",
      enterCelebration: "🐘 ಸಂಭ್ರಮಕ್ಕೆ ಪ್ರವೇಶಿಸಿ",
      liftGarland: "🌸 ಹಾರವನ್ನು ಎತ್ತಿ",
      dragBell: "ಮದುವೆ ಬಂಧನಕ್ಕಾಗಿ ಚಿನ್ನದ ಗಂಟೆಯನ್ನು ಕೆಳಗೆ ಎಳೆಯಿರಿ",
      palaceDoorsPrompt: "ರಾಜಮನೆತನದ ಆಚರಣೆಗೆ ಪ್ರವೇಶಿಸಲು ಬಾಗಿಲು ಒತ್ತಿ",
      mandalaSealPrompt: "ಕಾರ್ಡ್ ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಮಂಡಲ ಮುದ್ರೆ ಒತ್ತಿ",
      archwayPrompt: "ವಿವರಗಳನ್ನು ನೋಡಲು ಕಮಾನು ಒತ್ತಿ",
      sealInvitationPrompt: "ಆಮಂತ್ರಣವನ್ನು ನೋಡಲು ಮುದ್ರೆ ಒತ್ತಿ",
      medallionGarlandPrompt: "ಹಾರವನ್ನು ಎತ್ತಲು ಪದಕ ಒತ್ತಿ"
    },
    ta: {
      days: "நாட்கள்",
      hrs: "மணி",
      min: "நிமிடம்",
      sec: "நொடி",
      weds: "மற்றும்",
      unveilingInvite: "அழைப்பிதழ் திறக்கப்படுகிறது...",
      openPalaceDoors: "🚪 அரண்மனை கதவை திறக்க",
      lightUpCelebration: "🪔 வேடுகையை ஒளிரச் செய்க",
      unfoldCard: "🪷 அழைப்பிதழை திறக்க",
      enterCelebration: "🐘 வேடுகையில் நுழைக",
      liftGarland: "🌸 மாலையை உயர்த்துக",
      dragBell: "முடிச்சு போட தங்க மணியை கீழே இழுக்கவும்",
      palaceDoorsPrompt: "ராஜ அலங்கார கொண்டாட்டத்தில் நுழைய கதவைத் தட்டவும்",
      mandalaSealPrompt: "அழைப்பிதழை திறக்க மண்டல முத்திரையை தட்டவும்",
      archwayPrompt: "விவரங்களைக் காண வளைவைத் தட்டவும்",
      sealInvitationPrompt: "அழைப்பிதழைக் காண முத்திரையைத் தட்டவும்",
      medallionGarlandPrompt: "மாலையை உயர்த்த பதக்கத்தை தட்டவும்"
    },
    te: {
      days: "రోజులు",
      hrs: "గంటలు",
      min: "నిమిషాలు",
      sec: "సెకన్లు",
      weds: "మరియు",
      unveilingInvite: "ఆహ్వాన పత్రిక తెరవబడుతోంది...",
      openPalaceDoors: "🚪 భవనం తలుపులు తెరవండి",
      lightUpCelebration: "🪔 వేడుకను వెలిగించండి",
      unfoldCard: "🪷 ఆహ్వాన పత్రిక తెరవండి",
      enterCelebration: "🐘 వేడుకలోకి ప్రవేశించండి",
      liftGarland: "🌸 పూలదండ ఎత్తండి",
      dragBell: "ముడి వేయడానికి బంగారు గంటను కిందకు లాగండి",
      palaceDoorsPrompt: "రాజరికం వేడుకలోకి ప్రవేశించడానికి తలుపులు తాకండి",
      mandalaSealPrompt: "పత్రికను తెరవడానికి మండల ముద్రను తాకండి",
      archwayPrompt: "వివరాలు తెలుసుకోవడానికి కమాను తాకండి",
      sealInvitationPrompt: "ఆహ్వాన పత్రిక చూడటానికి ముద్రను తాకండి",
      medallionGarlandPrompt: "పూలదండ ఎత్తడానికి లాకెట్ తాకండి"
    },
    ml: {
      days: "ദിവസങ്ങൾ",
      hrs: "മണിക്കൂർ",
      min: "മിനിറ്റ്",
      sec: "സെക്കൻഡ്",
      weds: "ഒപ്പം",
      unveilingInvite: "ക്ഷണപത്രം തുറക്കുന്നു...",
      openPalaceDoors: "🚪 കൊട്ടാരവാതിൽ തുറക്കുക",
      lightUpCelebration: "🪔 ആഘോഷം പ്രകാശപൂരിതമാക്കൂ",
      unfoldCard: "🪷 ക്ഷണപത്രം തുറക്കുക",
      enterCelebration: "🐘 ആഘോഷത്തിൽ പങ്കുചേരുക",
      liftGarland: "🌸 മാല ഉയർത്തുക",
      dragBell: "ബന്ധം സ്ഥാപിക്കാൻ സ്വർണ്ണ മണി താഴേക്ക് വലിക്കുക",
      palaceDoorsPrompt: "രാജകീയ ആഘോഷത്തിൽ പ്രവേശിക്കാൻ വാതിലിൽ ക്ലിക്ക് ചെയ്യുക",
      mandalaSealPrompt: "ക്ഷണപത്രം തുറക്കാനായി മണ്ഡല ചിഹ്നത്തിൽ ക്ലിക്ക് ചെയ്യുക",
      archwayPrompt: "വിവരങ്ങൾ അറിയാനായി കമാനത്തിൽ ക്ലിക്ക് ചെയ്യുക",
      sealInvitationPrompt: "ക്ഷണപത്രം കാണാനായി ചിഹ്നത്തിൽ ക്ലിക്ക് ചെയ്യുക",
      medallionGarlandPrompt: "മാല ഉയർത്താൻ മെഡലിൽ ക്ലിക്ക് ചെയ്യുക"
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
    onOpen();
  };
  // Giphy couple sticker cutout overlay component
  const GiphyCoupleSticker = () => {
    const activePhoto = photo || "/samples/couple1.jpg";
    return (
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{
          bottom: "16%",
          right: "4%",
          width: "90px",
          height: "90px",
        }}
        animate={{
          y: [0, -8, 0],
          rotate: [-6, 6, -6],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div 
          className="w-full h-full overflow-hidden border-[4px] border-white shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
          style={{
            borderRadius: "60% 40% 55% 45% / 45% 55% 40% 60%", // Irregular organic cutout shape
            transform: "rotate(-5deg)",
          }}
        >
          <img 
            src={activePhoto} 
            alt="Couple Sticker" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Sparkle badge decorator */}
        <div className="absolute -top-1.5 -right-1.5 text-xs animate-bounce" style={{ animationDuration: '2s' }}>
          ✨
        </div>
      </motion.div>
    );
  };

  // Renders the standard countdown block below names
  const renderCountdown = (textColor: string) => {
    return (
      <div className="flex gap-4 justify-center my-3.5 select-none" style={{ color: textColor }}>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-cormorant font-bold leading-none">{String(timeLeft.days).padStart(3, "0")}</span>
          <span className="text-[7.5px] uppercase tracking-widest font-marcellus font-bold opacity-70 mt-1">{t("days")}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-cormorant font-bold leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[7.5px] uppercase tracking-widest font-marcellus font-bold opacity-70 mt-1">{t("hrs")}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-cormorant font-bold leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[7.5px] uppercase tracking-widest font-marcellus font-bold opacity-70 mt-1">{t("min")}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-cormorant font-bold leading-none">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[7.5px] uppercase tracking-widest font-marcellus font-bold opacity-70 mt-1">{t("sec")}</span>
        </div>
      </div>
    );
  };

  // Overarching Envelope Wrapper Layout
  const renderEnvelopeFrame = (
    bgGradient: string,
    interactiveEl: React.ReactNode,
    textColor: string,
    tapPrompt: string,
    isDark: boolean
  ) => {
    return (
      <div 
        className="relative w-full max-w-[390px] h-[86vh] max-h-[740px] min-h-[580px] rounded-[36px] flex flex-col justify-between p-6 overflow-hidden shadow-paper-deep border border-brand-rust/10 select-none text-center"
        style={{ background: bgGradient }}
      >
        {/* Floating Sparks Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: isDark ? "rgba(255,224,130,0.3)" : "rgba(138,58,26,0.1)",
                top: `${15 + i * 14}%`,
                left: `${10 + (i * 29) % 80}%`,
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.1, 0.7, 0.1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Top Header Card Info */}
        <div className="mt-8 z-10 flex flex-col items-center">
          <h2 className="font-cursive font-normal text-6xl tracking-wide leading-tight" style={{ color: textColor }}>
            {bride}
          </h2>
          <span className="font-cormorant italic text-2xl my-1.5 block" style={{ color: isDark ? "#FFE082" : "#8A3A1A" }}>
            {t("weds")}
          </span>
          <h2 className="font-cursive font-normal text-6xl tracking-wide leading-tight" style={{ color: textColor }}>
            {groom}
          </h2>
          {renderCountdown(textColor)}
          <div className="w-10 h-[1.5px] mt-1 opacity-20" style={{ backgroundColor: textColor }} />
        </div>

        {/* Dynamic Theme Interactive Core */}
        <div className="flex-1 flex items-center justify-center relative my-4 overflow-visible">
          {interactiveEl}
        </div>

        {/* Floating Giphy Couple Sticker */}
        <GiphyCoupleSticker />

        {/* Footer prompts */}
        <div className="mb-6 z-10 flex flex-col items-center">
          <p className="text-[9.5px] font-marcellus tracking-widest uppercase font-bold" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            {niceDate} • {city}
          </p>
          <div className="mt-5">
            <motion.span 
              animate={activated ? { opacity: [1, 0.3, 1] } : { scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-marcellus text-[10.5px] tracking-widest block uppercase font-bold"
              style={{ color: isDark ? "#FFE082" : "#8A3A1A" }}
            >
              {activated ? t("unveilingInvite") : tapPrompt}
            </motion.span>
          </div>
        </div>
      </div>
    );
  };

  // 1. JAIPUR PALACE COVER: Pastels, arches, sliding doors
  const renderJaipurTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #FFD5B4 0%, #FFB3A7 50%, #FAF6F0 100%)",
      <div className="w-full flex items-center justify-center overflow-hidden relative h-56">
        {/* Left Palace Door */}
        <motion.div
          initial={{ x: 0 }}
          animate={activated ? { x: -140, opacity: 0 } : { x: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-6 z-10 w-24 h-40 bg-[#8A3A1A] border-r-4 border-brand-gold rounded-l-2xl shadow-lg flex items-center justify-end pr-1.5 overflow-hidden"
        >
          {/* Gold shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.15) 45%, rgba(255,215,0,0.25) 50%, rgba(255,215,0,0.15) 55%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          />
          <div className="w-18 h-36 border border-brand-gold/40 border-dashed rounded-l flex items-center justify-center text-brand-gold/30 font-serif">
            囍
          </div>
        </motion.div>

        {/* Right Palace Door */}
        <motion.div
          initial={{ x: 0 }}
          animate={activated ? { x: 140, opacity: 0 } : { x: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute right-6 z-10 w-24 h-40 bg-[#8A3A1A] border-l-4 border-brand-gold rounded-r-2xl shadow-lg flex items-center justify-start pl-1.5 overflow-hidden"
        >
          {/* Gold shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.15) 45%, rgba(255,215,0,0.25) 50%, rgba(255,215,0,0.15) 55%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
          />
          <div className="w-18 h-36 border border-brand-gold/40 border-dashed rounded-r flex items-center justify-center text-brand-gold/30 font-serif">
            囍
          </div>
        </motion.div>

        {/* Text in the Middle when doors open */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={activated ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="absolute text-center z-0"
        >
          <span className="font-marcellus text-[9px] tracking-[4px] uppercase text-brand-rust font-bold block mb-1">Palace Doors Open</span>
          <h4 className="font-cursive text-3xl text-brand-rust leading-tight">{bride} &amp; {groom}</h4>
        </motion.div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute z-20 py-2.5 px-6 rounded-full border-2 border-brand-rust bg-brand-rust hover:bg-brand-rust/95 text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer shadow-md active:scale-95 transition-transform"
          >
            {t("openPalaceDoors")}
          </button>
        )}
      </div>,
      "#8A3A1A",
      t("palaceDoorsPrompt"),
      false
    );
  };

  // 2. MIDNIGHT AFFAIR COVER (diya mapping): Midnight blue, glowing domes, golden moon
  const renderDiyaTheme = () => {
    const diyaFlameVariants = {
      flicker: {
        scale: [1, 1.15, 0.95, 1.05, 1],
        rotate: [0, 2, -2, 1, 0],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      },
      activated: {
        scale: 25,
        opacity: [1, 0.8, 0],
        transition: { duration: 1.6, ease: "easeOut" }
      }
    };

    const interactiveDiya = (
      <div className="w-full flex flex-col items-center justify-center relative h-56 overflow-visible">
        {/* Warm glow pulse behind diya */}
        <motion.div
          className="absolute w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,160,0,0.18) 0%, rgba(255,111,0,0.08) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rotating golden mandala ring */}
        <svg viewBox="0 0 100 100" className="w-40 h-40 fill-none stroke-amber-400/25 stroke-[0.8] animate-spin-slow absolute">
          <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
          <path d="M50,10 A40,40 0 0,0 10,50 A40,40 0 0,0 50,90 A40,40 0 0,0 90,50 Z" />
        </svg>

        {/* Earthen Diya body */}
        <div className="relative w-32 h-24 flex items-center justify-center overflow-visible">
          {/* Amulet base */}
          <svg viewBox="0 0 100 60" className="w-24 h-16 text-amber-800 fill-current drop-shadow-lg absolute bottom-2">
            <path d="M10,20 C10,20 20,50 50,50 C80,50 90,20 90,20 C90,20 75,35 50,35 C25,35 10,20 10,20 Z" />
            <path d="M25,28 Q50,38 75,28" stroke="#FFE082" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>

          {/* Flickering Flame */}
          <motion.div
            variants={diyaFlameVariants}
            animate={activated ? "activated" : "flicker"}
            className="absolute top-2 w-7 h-11 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-t-full shadow-[0_0_20px_#FFA000]"
            style={{ transformOrigin: "bottom center" }}
          />
        </div>

        {/* Activated gold radial wipe (no mix-blend-mode for cross-device compat) */}
        {activated && (
          <motion.div
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 12, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-12 h-12 rounded-full pointer-events-none z-25"
            style={{
              background: "radial-gradient(circle, rgba(255,193,7,0.9) 0%, rgba(255,152,0,0.6) 40%, rgba(255,111,0,0.2) 70%, transparent 100%)",
            }}
          />
        )}

        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute z-20 py-2.5 px-6 rounded-full border border-amber-300 bg-amber-400 hover:bg-amber-300 text-stone-900 font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            {t("lightUpCelebration")}
          </button>
        )}
      </div>
    );

    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #0A0413 0%, #170C2A 70%, #0F091E 100%)",
      interactiveDiya,
      "#F4EFE6",
      t("mandalaSealPrompt"),
      true
    );
  };

  // 3. IVORY ROSE SEAL COVER: Floating rose petals around a golden wax seal that cracks open
  const renderLotusTheme = () => {
    // Floating petal positions — simple absolute positions that drift gently
    const floatingPetals = [
      { emoji: "🌸", size: 18, top: "8%", left: "15%", dur: 5, delay: 0, dx: 12, dy: 8 },
      { emoji: "🪷", size: 14, top: "18%", left: "75%", dur: 6, delay: 0.5, dx: -10, dy: 6 },
      { emoji: "🌸", size: 16, top: "35%", left: "8%", dur: 5.5, delay: 1, dx: 8, dy: -10 },
      { emoji: "💮", size: 12, top: "60%", left: "82%", dur: 7, delay: 0.3, dx: -14, dy: -6 },
      { emoji: "🌸", size: 20, top: "72%", left: "20%", dur: 6.5, delay: 1.5, dx: 10, dy: -12 },
      { emoji: "🪷", size: 13, top: "50%", left: "88%", dur: 5, delay: 0.8, dx: -8, dy: 10 },
      { emoji: "💮", size: 15, top: "85%", left: "60%", dur: 6, delay: 0.2, dx: -6, dy: -8 },
      { emoji: "🌸", size: 11, top: "15%", left: "50%", dur: 7.5, delay: 1.2, dx: 6, dy: 12 },
    ];

    const interactiveSeal = (
      <div className="w-full h-56 relative flex items-center justify-center overflow-hidden">
        {/* Floating rose petals drifting around */}
        {floatingPetals.map((p, i) => (
          <motion.span
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ top: p.top, left: p.left, fontSize: p.size }}
            animate={activated
              ? { opacity: 0, scale: 0, y: -30 }
              : {
                  x: [0, p.dx, -p.dx * 0.5, 0],
                  y: [0, p.dy, -p.dy * 0.7, 0],
                  rotate: [0, 15, -10, 0],
                  opacity: [0.5, 0.8, 0.6, 0.5],
                }
            }
            transition={activated
              ? { duration: 0.6, delay: i * 0.05 }
              : { duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }
            }
          >
            {p.emoji}
          </motion.span>
        ))}

        {/* Soft pink glow behind the seal */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(236,64,122,0.15) 0%, transparent 70%)" }}
          animate={activated
            ? { scale: 3, opacity: 0 }
            : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
          }
          transition={activated
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />

        {/* Golden wax seal — the main interactive element */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={activated
            ? { scale: 1.3, opacity: 0, rotate: 15 }
            : { scale: [1, 1.02, 1] }
          }
          transition={activated
            ? { duration: 1, ease: "easeOut" }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Outer ring glow */}
          <motion.div
            className="absolute w-28 h-28 rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(212,175,55,0.3)",
              boxShadow: "0 0 20px rgba(212,175,55,0.15), inset 0 0 20px rgba(212,175,55,0.08)",
            }}
            animate={activated ? {} : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Seal body */}
          <div
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl relative overflow-hidden"
            style={{
              background: "radial-gradient(circle at 40% 35%, #E8B86D 0%, #C9963C 35%, #9B6B2F 70%, #7A4F1E 100%)",
              border: "3px solid #D4AF37",
              boxShadow: "0 4px 20px rgba(139,90,43,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            }}
          >
            {/* Embossed "S" monogram */}
            <span className="text-3xl font-cursive text-amber-100/90 drop-shadow-sm select-none" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              शुभ
            </span>
            <span className="text-[7px] font-marcellus text-amber-200/70 tracking-[3px] uppercase mt-0.5 select-none">
              विवाह
            </span>

            {/* Wax texture shine sweep */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              }}
              animate={activated ? {} : { x: ["-100%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
          </div>

          {/* Decorative dots around seal */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const r = 58;
            const x = Math.cos((angle * Math.PI) / 180) * r;
            const y = Math.sin((angle * Math.PI) / 180) * r;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/40 pointer-events-none"
                style={{ left: `calc(50% + ${x}px - 3px)`, top: `calc(50% + ${y}px - 3px)` }}
                animate={activated
                  ? { scale: 0, opacity: 0 }
                  : { scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }
                }
                transition={activated
                  ? { duration: 0.4, delay: i * 0.03 }
                  : { duration: 2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }
                }
              />
            );
          })}
        </motion.div>

        {/* Activation: golden light burst */}
        {activated && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-16 h-16 rounded-full pointer-events-none z-20"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.2) 40%, transparent 70%)",
            }}
          />
        )}

        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute bottom-1 z-20 py-2.5 px-7 rounded-full border-2 border-pink-400 bg-pink-500 hover:bg-pink-400 text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer active:scale-95 shadow-lg shadow-pink-300/30 transition-all"
          >
            {t("unfoldCard")}
          </button>
        )}
      </div>
    );

    return renderEnvelopeFrame(
      "linear-gradient(160deg, #FFF0F5 0%, #FCE4EC 40%, #F8EFF8 70%, #FFF8F0 100%)",
      interactiveSeal,
      "#880E4F",
      t("sealInvitationPrompt"),
      false
    );
  };

  // 4. ROYAL ELEPHANT COVER: Splitting face-to-face decorated elephants
  const renderElephantTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #FAF6F0 0%, #F5EFEB 60%, #E8D8CC 100%)",
      <div className="w-full h-56 relative flex items-center justify-center overflow-hidden">
        {/* Rotating gold mandala sun behind text (revealed on open) — smooth linear rotation */}
        <motion.svg
          initial={{ rotate: 0, opacity: 0 }}
          animate={activated ? { rotate: 360, opacity: 0.15 } : { rotate: 360 }}
          transition={activated
            ? { rotate: { duration: 20, repeat: Infinity, ease: "linear" }, opacity: { duration: 1.2, ease: "easeOut" } }
            : { rotate: { duration: 30, repeat: Infinity, ease: "linear" } }
          }
          viewBox="0 0 100 100" className="absolute w-36 h-36 fill-none stroke-brand-gold stroke-[0.8]"
          style={{ opacity: activated ? undefined : 0.06 }}
        >
          <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
          <circle cx="50" cy="50" r="32" strokeDasharray="2,5" />
        </motion.svg>

        {/* Left Elephant (Bows & Slides Left) — with idle trunk sway */}
        <motion.div
          initial={{ x: -20, rotate: 0, opacity: 1 }}
          animate={activated ? { rotate: -15, x: -220, opacity: 0 } : { x: -20, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute z-10 w-28 h-28"
          style={{ left: "10%", transformOrigin: "bottom left" }}
        >
          <svg viewBox="0 0 120 100" className="w-full h-full text-[#963E1C]">
            <path 
              d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" 
              fill="#963E1C" 
            />
            {/* Trunk — animated sway */}
            <motion.path
              d="M92,15 Q95,12 97,14"
              stroke="#FFE082" strokeWidth="1" fill="none"
              animate={activated ? {} : { d: ["M92,15 Q95,12 97,14", "M92,15 Q96,10 98,13", "M92,15 Q94,14 96,15", "M92,15 Q95,12 97,14"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#FFE082" />
            <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#D32F2F" />
            <path d="M38,28 L50,28 L50,38 L38,38 Z" fill="#FFE082" stroke="#963E1C" strokeWidth="0.5" />
            <path d="M41,20 Q44,14 47,20 L49,28 L39,28 Z" fill="#FFE082" opacity="0.9" />
            <path d="M86,43 Q90,46 92,44" stroke="#FFF" strokeWidth="1.5" fill="none" />
            <circle cx="80" cy="35" r="1.5" fill="#FFF" />
            <circle cx="80" cy="35" r="0.7" fill="#000" />
            <circle cx="39" cy="56" r="1.5" fill="#FFE082" />
            <circle cx="44" cy="57" r="1.5" fill="#FFE082" />
            <circle cx="49" cy="57" r="1.5" fill="#FFE082" />
            <circle cx="53" cy="56" r="1.5" fill="#FFE082" />
          </svg>
        </motion.div>

        {/* Right Elephant (Bows & Slides Right) — with idle trunk sway */}
        <motion.div
          initial={{ x: 20, scaleX: -1, rotate: 0, opacity: 1 }}
          animate={activated ? { rotate: -15, x: 220, opacity: 0 } : { x: 20, scaleX: -1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute z-10 w-28 h-28"
          style={{ right: "10%", transformOrigin: "bottom right" }}
        >
          <svg viewBox="0 0 120 100" className="w-full h-full text-[#963E1C]">
            <path 
              d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" 
              fill="#963E1C" 
            />
            {/* Trunk — animated sway */}
            <motion.path
              d="M92,15 Q95,12 97,14"
              stroke="#FFE082" strokeWidth="1" fill="none"
              animate={activated ? {} : { d: ["M92,15 Q95,12 97,14", "M92,15 Q94,14 96,15", "M92,15 Q96,10 98,13", "M92,15 Q95,12 97,14"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#FFE082" />
            <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#D32F2F" />
            <path d="M38,28 L50,28 L50,38 L38,38 Z" fill="#FFE082" stroke="#963E1C" strokeWidth="0.5" />
            <path d="M41,20 Q44,14 47,20 L49,28 L39,28 Z" fill="#FFE082" opacity="0.9" />
            <path d="M86,43 Q90,46 92,44" stroke="#FFF" strokeWidth="1.5" fill="none" />
            <circle cx="80" cy="35" r="1.5" fill="#FFF" />
            <circle cx="80" cy="35" r="0.7" fill="#000" />
            <circle cx="39" cy="56" r="1.5" fill="#FFE082" />
            <circle cx="44" cy="57" r="1.5" fill="#FFE082" />
            <circle cx="49" cy="57" r="1.5" fill="#FFE082" />
            <circle cx="53" cy="56" r="1.5" fill="#FFE082" />
          </svg>
        </motion.div>

        {/* Revealed Names & Invitation in the Middle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={activated ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="absolute text-center z-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <span className="font-marcellus text-[9px] tracking-[4px] uppercase text-brand-rust font-bold block mb-1">
            SHUBH VIVAH
          </span>
          <h4 className="font-cursive text-3.5xl text-brand-rust leading-tight">
            {bride}
            <span className="text-xl text-[#D4A843] italic block my-0.5">&amp;</span>
            {groom}
          </h4>
        </motion.div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute z-20 py-2.5 px-6 rounded-full border-2 border-brand-gold bg-[#963E1C] hover:bg-[#8A3A1A] text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer active:scale-95 shadow-lg transition-transform"
          >
            {t("enterCelebration")}
          </button>
        )}
      </div>,
      "#8A3A1A",
      t("sealInvitationPrompt"),
      false
    );
  };

  // 5. SACRED THREAD PULL: Kalava string pull — beautifully centered
  const renderThreadTheme = () => {
    const handleDrag = (e: any, info: any) => {
      setThreadY(info.offset.y);
      if (info.offset.y > 90 && !activated) {
        handleActivate();
      }
    };

    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #FFF8EE 0%, #FFF3E0 50%, #FAF6F0 100%)",
      <div className="w-full h-56 relative flex flex-col items-center justify-start pt-0 overflow-visible">
        {/* Decorative Toran arch at top — flowers sway gently */}
        <div className="w-48 flex justify-center items-center gap-0 absolute top-0">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              style={{ marginTop: i % 2 === 0 ? 0 : 6 }}
              animate={{ rotate: [0, i % 2 === 0 ? 4 : -4, 0], y: [0, i % 2 === 0 ? -2 : 2, 0] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border border-yellow-300 shadow-sm flex items-center justify-center text-[6px]">🌻</div>
              <div className="w-[2px] h-5 bg-green-700 rounded-b-full" />
            </motion.div>
          ))}
        </div>

        {/* The hanging thread — smoother cubic bezier curve reacts to drag */}
        <svg
          className="absolute pointer-events-none z-0"
          style={{ top: 20, left: "50%", transform: "translateX(-50%)" }}
          width="12"
          height="170"
          overflow="visible"
        >
          {/* Red kalava thread — smooth cubic bezier */}
          <motion.path
            d={`M6,0 C${6 + (threadY > 0 ? threadY * 0.15 : 0)},${15 + threadY * 0.2} ${6 + (threadY > 0 ? threadY * 0.25 : 0)},${35 + threadY * 0.4} 6,${50 + Math.min(threadY, 100)}`}
            stroke="#C62828"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Gold shimmer thread */}
          <motion.path
            d={`M6,0 C${6 + (threadY > 0 ? threadY * 0.15 : 0)},${15 + threadY * 0.2} ${6 + (threadY > 0 ? threadY * 0.25 : 0)},${35 + threadY * 0.4} 6,${50 + Math.min(threadY, 100)}`}
            stroke="#FFD600"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4,4"
            opacity="0.7"
          />
        </svg>

        {/* Draggable Bell */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.12}
          onDrag={handleDrag}
          onDragEnd={() => !activated && setThreadY(0)}
          initial={{ y: 22 }}
          animate={
            activated
              ? { y: 160, scale: 0.6, opacity: 0 }
              : { y: 22 }
          }
          transition={activated
            ? { duration: 0.6, ease: "easeIn" }
            : { type: "spring", stiffness: 280, damping: 18 }
          }
          className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center"
        >
          {/* Thread attachment knob */}
          <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-amber-300 shadow-md mb-0.5" />
          {/* Bell body */}
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FFE082 0%, #F9A825 55%, #E65100 100%)",
              border: "3px solid #FFD54F",
              boxShadow: "0 0 18px rgba(255,193,7,0.4), inset 0 -4px 8px rgba(0,0,0,0.2)",
            }}
            animate={{ rotate: threadY > 10 ? [-6, 6, -4, 4, 0] : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-2xl select-none">🔔</span>
          </motion.div>
          {!activated && (
            <motion.span
              className="text-[8px] font-marcellus text-brand-rust font-bold tracking-widest mt-1.5 block"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              PULL ↓
            </motion.span>
          )}
        </motion.div>

        {/* Target landing ring */}
        <motion.div
          className="absolute bottom-6 flex flex-col items-center"
          animate={activated ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              border: "2px dashed rgba(138,58,26,0.3)",
              background: "rgba(138,58,26,0.04)",
              boxShadow: "0 0 0 6px rgba(138,58,26,0.04)",
            }}
          >
            <span className="text-[9px] font-marcellus text-brand-rust/40 tracking-wider text-center leading-tight">KNOT<br/>HERE</span>
          </div>
        </motion.div>
      </div>,
      "#7B3F00",
      t("dragBell"),
      false
    );
  };

  // 6. TORAN GARLAND COVER: Grand silk curtain reveal with animated toran
  const renderGarlandTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(160deg, #E8F5E9 0%, #F1F8E9 30%, #FAF6F0 100%)",
      <div className="w-full h-56 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Hanging toran row — staggered bounce + rises on activate */}
        <motion.div
          className="absolute top-0 w-full flex justify-between px-2 z-20"
          animate={activated ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              style={{ marginTop: i % 2 === 0 ? 0 : 8 }}
              animate={activated ? {} : { y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 3 : -3, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 border border-yellow-300 shadow flex items-center justify-center text-[7px]">🌻</div>
              <div className="w-[2.5px] h-7 bg-green-700/80 rounded-b-full" />
              <motion.div
                className="w-2 h-2 rounded-full bg-red-600"
                animate={activated ? {} : { scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Silk curtain panels */}
        <div className="w-52 h-36 relative flex rounded-xl overflow-hidden shadow-xl mt-6 border border-amber-900/20">
          {/* Left silk panel — with fabric shimmer */}
          <motion.div
            className="w-1/2 h-full relative flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #8B0000 0%, #6D0000 50%, #4A000A 100%)",
              borderRight: "1px solid rgba(212,168,67,0.3)",
            }}
            animate={activated ? { x: -90, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeInOut", delay: 0.1 }}
          >
            {/* Fabric shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(110deg, transparent 30%, rgba(255,215,0,0.08) 45%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 55%, transparent 70%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            />
            {/* Embroidery pattern */}
            <svg viewBox="0 0 50 80" className="w-full h-full absolute inset-0 opacity-20">
              <path d="M5,5 Q25,20 45,5 Q25,40 5,5" fill="#FFD700" />
              <path d="M5,40 Q25,55 45,40" stroke="#FFD700" fill="none" strokeWidth="1" />
              <circle cx="25" cy="65" r="6" fill="#FFD700" opacity="0.5" />
            </svg>
            <div className="absolute inset-2 border border-dashed border-amber-500/20 rounded" />
            <span className="text-amber-300/40 text-2xl font-serif select-none">❋</span>
          </motion.div>
          {/* Right silk panel — with fabric shimmer */}
          <motion.div
            className="w-1/2 h-full relative flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(225deg, #8B0000 0%, #6D0000 50%, #4A000A 100%)",
            }}
            animate={activated ? { x: 90, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeInOut", delay: 0.1 }}
          >
            {/* Fabric shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(110deg, transparent 30%, rgba(255,215,0,0.08) 45%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 55%, transparent 70%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
            <svg viewBox="0 0 50 80" className="w-full h-full absolute inset-0 opacity-20">
              <path d="M45,5 Q25,20 5,5 Q25,40 45,5" fill="#FFD700" />
              <path d="M45,40 Q25,55 5,40" stroke="#FFD700" fill="none" strokeWidth="1" />
              <circle cx="25" cy="65" r="6" fill="#FFD700" opacity="0.5" />
            </svg>
            <div className="absolute inset-2 border border-dashed border-amber-500/20 rounded" />
            <span className="text-amber-300/40 text-2xl font-serif select-none">❋</span>
          </motion.div>

          {/* Revealed center glow behind curtains */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A0005] z-[-1]">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={activated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-3xl">💐</span>
              <span className="font-marcellus text-[8px] tracking-widest text-amber-300 uppercase">Welcome</span>
            </motion.div>
          </div>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="py-2.5 px-7 rounded-full border-2 border-amber-400 bg-[#6D0000] hover:bg-[#8B0000] text-amber-200 font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer absolute bottom-2 z-20 shadow-lg transition-all active:scale-95"
          >
            {t("liftGarland")}
          </button>
        )}
      </div>,
      "#4A000A",
      t("medallionGarlandPrompt"),
      false
    );
  };

  const getThemeRenderer = () => {
    switch (theme) {
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
      case "elephant":
      default:
        return renderElephantTheme();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center p-4 bg-[#FAF6F0]"
    >
      {/* Background soft light accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full filter blur-[120px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 75%)`,
        }}
      />
      
      {/* Outer borders */}
      <div className="absolute inset-3 border border-brand-rust/5 rounded-[40px] pointer-events-none" />

      {/* Center envelope wrapper */}
      <motion.div
        animate={activated ? { y: 35, scale: 0.95, opacity: 0 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="z-10 w-full flex justify-center items-center"
      >
        {getThemeRenderer()}
      </motion.div>

      {/* Mini Watermark Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 py-1 px-3 bg-[#FAF6F0] border border-brand-rust/10 rounded-full text-[8px] tracking-[2px] uppercase font-marcellus text-brand-rust font-bold select-none z-20">
        <span>囍 getshaadilink.in</span>
      </div>
    </motion.div>
  );
}
