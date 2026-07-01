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
    const activePhoto = photo || "/samples/couple_realistic.png";
    return (
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{
          bottom: "16%",
          right: "4%",
          width: "90px",
          height: "90px",
          willChange: "transform, opacity",
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
    const activeCoverPhoto = heroPhoto || photo || "/samples/couple_realistic.png";

    // Dynamic font size calculator for cursive wedding names
    const getFontSizeForName = (name: string) => {
      const len = name ? name.length : 0;
      if (len > 22) return "text-2xl xs:text-3xl sm:text-4xl";
      if (len > 15) return "text-3xl xs:text-4xl sm:text-5xl";
      if (len > 8) return "text-4xl xs:text-5xl sm:text-6xl";
      return "text-5xl xs:text-6xl sm:text-7xl";
    };

    return (
      <div 
        className="relative w-full max-w-[390px] h-[86vh] max-h-[740px] min-h-[480px] xs:min-h-[520px] rounded-[36px] flex flex-col justify-between p-4 xs:p-6 overflow-hidden shadow-paper-deep border border-white/10 select-none text-center bg-stone-950"
      >
        {/* Full-bleed background photo layer with slow Ken Burns zoom */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${activeCoverPhoto})` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Color overlay matching theme gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-80 mix-blend-multiply transition-all duration-300"
          style={{ background: bgGradient }}
        />

        {/* Floating Ambient Sparks / Fireflies Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-200/50 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              style={{
                top: `${20 + i * 11}%`,
                left: `${15 + (i * 27) % 70}%`,
                willChange: "transform, opacity",
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Top Header Card Info: Glassmorphic panel with Great Vibes cursive */}
        <div className="mt-4 xs:mt-5 z-20 w-[94%] mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-[28px] p-4 xs:p-5 shadow-2xl flex flex-col items-center pointer-events-none">
          <h2 className={`font-great-vibes font-normal tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${getFontSizeForName(bride)}`} style={{ color: "#ffffff" }}>
            {bride}
          </h2>
          <span className="font-cormorant italic text-xl xs:text-2xl my-0.5 block text-amber-300/90 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            {t("weds")}
          </span>
          <h2 className={`font-great-vibes font-normal tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${getFontSizeForName(groom)}`} style={{ color: "#ffffff" }}>
            {groom}
          </h2>
          <div className="w-12 h-[1px] my-2 bg-white/20" />
          {renderCountdown("#ffffff")}
        </div>

        {/* Dynamic Theme Interactive Core */}
        <div className="flex-1 flex items-center justify-center relative my-2 xs:my-3 overflow-visible z-20">
          {interactiveEl}
        </div>

        {/* Footer prompts: Glassmorphic date badge */}
        <div className="mb-2 xs:mb-4 z-20 flex flex-col items-center">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
            <p className="text-[10px] font-marcellus tracking-[2.5px] uppercase font-bold text-white leading-none">
              {niceDate} • {city}
            </p>
          </div>
          <div className="mt-3.5">
            <motion.span 
              animate={activated ? { opacity: [1, 0.3, 1] } : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-marcellus text-[11px] tracking-[2px] block uppercase font-bold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
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
      "linear-gradient(to bottom, rgba(138,58,26,0.3) 0%, rgba(138,58,26,0.7) 60%, rgba(20,0,0,0.9) 100%)",
      <div className="w-full flex items-center justify-center overflow-hidden relative h-56">
        {/* Left Palace Door */}
        <motion.div
          initial={{ x: 0 }}
          animate={activated ? { x: -140, opacity: 0 } : { x: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute left-6 z-10 w-24 h-40 shadow-xl flex items-center justify-end overflow-hidden"
        >
          <svg viewBox="0 0 100 160" className="w-full h-full">
            {/* Arched wooden panel */}
            <path d="M 0,160 L 100,160 L 100,0 C 70,25 30,30 0,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
            {/* Gold border/inlay */}
            <path d="M 8,150 L 92,150 L 92,10 C 65,30 35,35 8,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Traditional dome arch carvings */}
            <path d="M 50,60 C 40,55 35,45 35,35 C 45,35 50,50 50,60" fill="none" stroke="#FFD54F" strokeWidth="1" />
            <path d="M 50,60 C 60,55 65,45 65,35 C 55,35 50,50 50,60" fill="none" stroke="#FFD54F" strokeWidth="1" />
            {/* Golden studs */}
            <circle cx="25" cy="65" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="65" r="2.5" fill="#FFD54F" />
            <circle cx="25" cy="100" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="100" r="2.5" fill="#FFD54F" />
            <circle cx="25" cy="135" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="135" r="2.5" fill="#FFD54F" />
            {/* Center handle */}
            <path d="M 94,80 A 6,6 0 0,0 94,92" fill="none" stroke="#FFD54F" strokeWidth="2.5" />
          </svg>
        </motion.div>

        {/* Right Palace Door */}
        <motion.div
          initial={{ x: 0 }}
          animate={activated ? { x: 140, opacity: 0 } : { x: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute right-6 z-10 w-24 h-40 shadow-xl flex items-center justify-start overflow-hidden"
        >
          <svg viewBox="0 0 100 160" className="w-full h-full">
            {/* Arched wooden panel */}
            <path d="M 100,160 L 0,160 L 0,0 C 30,25 70,30 100,45 Z" fill="#8A3A1A" stroke="#D4A843" strokeWidth="2.5" />
            {/* Gold border/inlay */}
            <path d="M 92,150 L 8,150 L 8,10 C 35,30 65,35 92,48 Z" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Traditional dome arch carvings */}
            <path d="M 50,60 C 40,55 35,45 35,35 C 45,35 50,50 50,60" fill="none" stroke="#FFD54F" strokeWidth="1" />
            <path d="M 50,60 C 60,55 65,45 65,35 C 55,35 50,50 50,60" fill="none" stroke="#FFD54F" strokeWidth="1" />
            {/* Golden studs */}
            <circle cx="25" cy="65" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="65" r="2.5" fill="#FFD54F" />
            <circle cx="25" cy="100" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="100" r="2.5" fill="#FFD54F" />
            <circle cx="25" cy="135" r="2.5" fill="#FFD54F" />
            <circle cx="75" cy="135" r="2.5" fill="#FFD54F" />
            {/* Center handle */}
            <path d="M 6,80 A 6,6 0 0,1 6,92" fill="none" stroke="#FFD54F" strokeWidth="2.5" />
          </svg>
        </motion.div>

        {/* Text in the Middle when doors open */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={activated ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="absolute text-center z-0"
          style={{ willChange: "transform, opacity" }}
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
        {/* Warm glow pulse behind diya - optimized to use radial gradient instead of slow filter blur */}
        <motion.div
          className="absolute w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,160,0,0.18) 0%, rgba(255,111,0,0.08) 45%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rotating golden mandala ring */}
        <svg viewBox="0 0 100 100" className="w-40 h-40 fill-none stroke-amber-400/25 stroke-[0.8] animate-spin-slow absolute" style={{ willChange: "transform" }}>
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
            style={{ transformOrigin: "bottom center", willChange: "transform, opacity" }}
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
              willChange: "transform, opacity",
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
      "linear-gradient(to bottom, rgba(10,4,19,0.5) 0%, rgba(23,12,42,0.8) 70%, rgba(15,9,30,0.95) 100%)",
      interactiveDiya,
      "#F4EFE6",
      t("mandalaSealPrompt"),
      true
    );
  };

  // 3. IVORY LOTUS COVER: Full blooming lotus with 7 petals radiating from center
  const renderLotusTheme = () => {
    // 7 petals arranged radially — evenly distributed at 360/7 ≈ 51.43° apart
    const petalAngles = [0, 51.43, 102.86, 154.29, 205.71, 257.14, 308.57];
    const petalColors = [
      "#F48FB1", "#F06292", "#E91E8C", "#F48FB1",
      "#E91E63", "#F06292", "#F48FB1"
    ];

    const interactiveLotus = (
      <div className="w-full h-64 relative flex items-center justify-center">
        {/* Soft glow backdrop - optimized to use radial gradient instead of filter blur */}
        <motion.div
          className="absolute w-36 h-36 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(244, 143, 177, 0.25) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          animate={activated ? { opacity: 0 } : { scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Water ripple rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-pink-300/20 pointer-events-none"
            style={{ width: 48 + i * 32, height: 48 + i * 32, willChange: "transform, opacity" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
          />
        ))}

        {/* SVG lotus — all petals + center, properly centered viewBox */}
        <motion.svg
          viewBox="-60 -60 120 120"
          className="w-44 h-44 absolute"
          style={{ overflow: "visible", willChange: "transform" }}
          animate={activated ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {petalAngles.map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const tx = Math.sin(rad) * 32;
            const ty = -Math.cos(rad) * 32;
            return (
              <motion.g
                key={idx}
                initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                animate={
                  activated
                    ? { scale: 0.2, opacity: 0, x: tx * 1.6, y: ty * 1.6 }
                    : { scale: 1, opacity: 1, x: 0, y: 0 }
                }
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: idx * 0.08 }}
                style={{ transformOrigin: "0px 0px", willChange: "transform, opacity" }}
              >
                <g transform={`rotate(${angle}) translate(0, -24)`}>
                  <ellipse cx="0" cy="-14" rx="8" ry="18"
                    fill={petalColors[idx]}
                    opacity="0.92"
                  />
                  {/* Petal vein */}
                  <line x1="0" y1="-2" x2="0" y2="-28"
                    stroke="white" strokeWidth="0.6" opacity="0.35"
                    strokeDasharray="2,2"
                  />
                </g>
              </motion.g>
            );
          })}

          {/* Inner petals (shorter, lighter) — offset for layered look */}
          {[25.71, 77.14, 128.57, 180, 231.43, 282.86, 334.29].map((angle, idx) => (
            <motion.g
              key={`inner-${idx}`}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={
                activated
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 0.8 }
              }
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 + idx * 0.04 }}
              style={{ transformOrigin: "0px 0px", willChange: "transform, opacity" }}
            >
              <g transform={`rotate(${angle}) translate(0, -14)`}>
                <ellipse cx="0" cy="-8" rx="5.5" ry="12"
                  fill="#FCE4EC"
                  opacity="0.85"
                />
              </g>
            </motion.g>
          ))}

          {/* Golden center stamen */}
          <motion.circle
            cx="0" cy="0" r="8"
            fill="#FFD54F"
            initial={{ scale: 1, opacity: 1 }}
            animate={activated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.circle
            cx="0" cy="0" r="4"
            fill="#FF8F00"
            initial={{ scale: 1, opacity: 1 }}
            animate={activated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          />
          {/* Stamen dots */}
          {[0, 72, 144, 216, 288].map((a, i) => (
            <motion.circle
              key={i}
              cx={Math.sin((a * Math.PI) / 180) * 6}
              cy={-Math.cos((a * Math.PI) / 180) * 6}
              r="1.2"
              fill="#FFF8E1"
              initial={{ opacity: 1 }}
              animate={activated ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </motion.svg>

        {/* Lotus leaf base — positioned below the lotus, not overlapping button */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ bottom: "28%", willChange: "transform, opacity" }}
          initial={{ opacity: 1 }}
          animate={activated ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg viewBox="0 0 80 30" className="w-28 h-10 fill-green-600/40 stroke-green-700/20 stroke-[0.5]">
            <ellipse cx="40" cy="18" rx="38" ry="14" />
            <line x1="40" y1="4" x2="40" y2="30" />
            <path d="M40,18 Q20,10 6,18" />
            <path d="M40,18 Q60,10 74,18" />
          </svg>
        </motion.div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute bottom-0 z-20 py-2.5 px-7 rounded-full border-2 border-pink-400 bg-pink-500 hover:bg-pink-400 text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer active:scale-95 shadow-lg shadow-pink-300/30 transition-all"
          >
            {t("unfoldCard")}
          </button>
        )}
      </div>
    );

    return renderEnvelopeFrame(
      "linear-gradient(to bottom, rgba(255,182,193,0.3) 0%, rgba(194,24,91,0.6) 60%, rgba(121,12,56,0.9) 100%)",
      interactiveLotus,
      "#880E4F",
      t("archwayPrompt"),
      false
    );
  };

  // 4. ROYAL ELEPHANT COVER: Splitting face-to-face decorated elephants
  const renderElephantTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(to bottom, rgba(138,58,26,0.2) 0%, rgba(232,216,204,0.5) 60%, rgba(40,20,10,0.85) 100%)",
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
          style={{ opacity: activated ? undefined : 0.06, willChange: "transform, opacity" }}
        >
          <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
          <circle cx="50" cy="50" r="32" strokeDasharray="2,5" />
        </motion.svg>

        {/* Left Elephant (Bows & Slides Left) */}
        <motion.div
          initial={{ x: -20, rotate: 0, opacity: 1 }}
          animate={activated ? { rotate: -15, x: -220, opacity: 0 } : { x: -20, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute z-10 w-28 h-28"
          style={{ left: "10%", transformOrigin: "bottom left", willChange: "transform, opacity" }}
        >
          <svg viewBox="0 0 120 100" className="w-full h-full">
            <defs>
              <linearGradient id="sandstone-elephant-right" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAD8B7" />
                <stop offset="50%" stopColor="#D49A6A" />
                <stop offset="100%" stopColor="#9E6738" />
              </linearGradient>
            </defs>
            {/* Elephant base */}
            <path 
              d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" 
              fill="url(#sandstone-elephant-right)" 
              stroke="#825229"
              strokeWidth="0.8"
            />
            {/* Trunk — animated sway */}
            <motion.path
              d="M92,15 Q95,12 97,14"
              stroke="#D49A6A" strokeWidth="1.2" fill="none"
              animate={activated ? {} : { d: ["M92,15 Q95,12 97,14", "M92,15 Q96,10 98,13", "M92,15 Q94,14 96,15", "M92,15 Q95,12 97,14"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Ear contours */}
            <path d="M42,38 C35,38 32,44 32,52 C32,60 36,64 42,64" fill="none" stroke="#825229" strokeWidth="0.8" />
            <path d="M40,40 C35,40 33,44 33,50 C33,56 36,60 40,60" fill="none" stroke="#FFD54F" strokeWidth="0.5" opacity="0.3" />
            {/* Jhool */}
            <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#D32F2F" stroke="#825229" strokeWidth="0.5" />
            <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#FFB300" />
            {/* Forehead Ornament */}
            <path d="M76,32 Q82,24 88,32 Q85,42 80,45 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="0.5" />
            <circle cx="82" cy="35" r="0.8" fill="#D32F2F" />
            <circle cx="80" cy="40" r="0.8" fill="#D32F2F" />
            {/* Tusks */}
            <path d="M86,43 Q93,46 95,43 L91,40 Z" fill="#FFFFFF" stroke="#825229" strokeWidth="0.5" />
            {/* Eye */}
            <circle cx="78" cy="32" r="1" fill="#FFF" />
            <circle cx="78" cy="32" r="0.5" fill="#000" />
            {/* Howdah */}
            <path d="M38,28 L50,28 L48,22 L40,22 Z" fill="#FFB300" stroke="#825229" strokeWidth="0.5" />
            <path d="M41,22 Q44,15 47,22 Z" fill="#D32F2F" />
            {/* Anklets */}
            <circle cx="21" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="31" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="43" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="57" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="69" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="81" cy="80" r="1.2" fill="#FFD54F" />
          </svg>
        </motion.div>

        {/* Right Elephant (Bows & Slides Right) — with idle trunk sway */}
        <motion.div
          initial={{ x: 20, scaleX: -1, rotate: 0, opacity: 1 }}
          animate={activated ? { rotate: -15, x: 220, opacity: 0 } : { x: 20, scaleX: -1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute z-10 w-28 h-28"
          style={{ right: "10%", transformOrigin: "bottom right", willChange: "transform, opacity" }}
        >
          <svg viewBox="0 0 120 100" className="w-full h-full">
            <defs>
              <linearGradient id="sandstone-elephant-right" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAD8B7" />
                <stop offset="50%" stopColor="#D49A6A" />
                <stop offset="100%" stopColor="#9E6738" />
              </linearGradient>
            </defs>
            {/* Elephant base */}
            <path 
              d="M10,65 C10,55 12,48 22,42 C28,38 35,38 42,38 C46,38 48,34 50,30 C53,24 58,22 62,22 C65,22 68,26 68,30 C68,35 65,40 68,45 C72,50 82,48 88,38 C92,32 94,22 92,15 C92,13 95,12 96,15 C98,22 96,35 90,45 C86,52 82,55 82,60 C82,68 85,75 85,82 C85,84 82,84 81,82 C80,78 78,72 76,72 C74,72 73,78 73,82 C73,84 70,84 69,82 C68,76 66,70 64,70 C62,70 61,76 61,82 C61,84 58,84 57,82 C56,76 54,70 51,70 C48,70 47,76 47,82 C47,84 44,84 43,82 C42,76 40,70 38,70 C36,70 35,76 35,82 C35,84 32,84 31,82 C30,76 28,70 25,70 C22,70 21,76 21,82 C21,84 18,84 17,82 C16,76 14,70 12,70 C10,70 10,68 10,65 Z" 
              fill="url(#sandstone-elephant-right)" 
              stroke="#825229"
              strokeWidth="0.8"
            />
            {/* Trunk — animated sway */}
            <motion.path
              d="M92,15 Q95,12 97,14"
              stroke="#D49A6A" strokeWidth="1.2" fill="none"
              animate={activated ? {} : { d: ["M92,15 Q95,12 97,14", "M92,15 Q96,10 98,13", "M92,15 Q94,14 96,15", "M92,15 Q95,12 97,14"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Ear contours */}
            <path d="M42,38 C35,38 32,44 32,52 C32,60 36,64 42,64" fill="none" stroke="#825229" strokeWidth="0.8" />
            <path d="M40,40 C35,40 33,44 33,50 C33,56 36,60 40,60" fill="none" stroke="#FFD54F" strokeWidth="0.5" opacity="0.3" />
            {/* Jhool */}
            <path d="M35,38 C40,38 48,39 52,38 C55,42 56,48 56,54 C56,56 54,58 50,58 C44,58 40,56 36,54 C36,48 35,42 35,38 Z" fill="#D32F2F" stroke="#825229" strokeWidth="0.5" />
            <path d="M40,42 C43,42 46,43 48,42 C50,44 50,47 50,50 C50,51 49,52 47,52 C44,52 42,51 40,50 C40,47 40,44 40,42 Z" fill="#FFB300" />
            {/* Forehead Ornament */}
            <path d="M76,32 Q82,24 88,32 Q85,42 80,45 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="0.5" />
            <circle cx="82" cy="35" r="0.8" fill="#D32F2F" />
            <circle cx="80" cy="40" r="0.8" fill="#D32F2F" />
            {/* Tusks */}
            <path d="M86,43 Q93,46 95,43 L91,40 Z" fill="#FFFFFF" stroke="#825229" strokeWidth="0.5" />
            {/* Eye */}
            <circle cx="78" cy="32" r="1" fill="#FFF" />
            <circle cx="78" cy="32" r="0.5" fill="#000" />
            {/* Howdah */}
            <path d="M38,28 L50,28 L48,22 L40,22 Z" fill="#FFB300" stroke="#825229" strokeWidth="0.5" />
            <path d="M41,22 Q44,15 47,22 Z" fill="#D32F2F" />
            {/* Anklets */}
            <circle cx="21" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="31" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="43" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="57" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="69" cy="80" r="1.2" fill="#FFD54F" />
            <circle cx="81" cy="80" r="1.2" fill="#FFD54F" />
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
      "linear-gradient(to bottom, rgba(255,152,0,0.15) 0%, rgba(255,243,224,0.4) 60%, rgba(139,0,0,0.85) 100%)",
      <div className="w-full h-56 relative flex flex-col items-center justify-start pt-0 overflow-visible">
        {/* Decorative Toran arch at top — flowers sway gently */}
        <div className="w-48 flex justify-center items-center gap-0 absolute top-0">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              style={{ marginTop: i % 2 === 0 ? 0 : 6, willChange: "transform" }}
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
          style={{ willChange: "transform, opacity" }}
        >
          {/* Thread attachment knob */}
          <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-amber-300 shadow-md mb-0.5" />
          {/* Bell body */}
          <motion.div
            className="w-20 h-28 flex items-center justify-center"
            animate={{ rotate: threadY > 10 ? [-6, 6, -4, 4, 0] : 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 100 140" className="w-full h-full">
              {/* Kalava threads dangling from above the bell */}
              <path d="M 50,0 Q 48,15 49,30" stroke="#D32F2F" strokeWidth="2.5" fill="none" />
              <path d="M 50,0 Q 52,15 51,30" stroke="#FFB300" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
              
              {/* Knot loops */}
              <path d="M 45,30 C 35,25 35,40 48,35 C 60,30 60,45 50,40" stroke="#D32F2F" strokeWidth="3.5" fill="none" />
              <path d="M 55,30 C 65,25 65,40 52,35 C 40,30 40,45 50,40" stroke="#FFB300" strokeWidth="2" fill="none" />
              
              {/* Hanging cords to bell */}
              <path d="M 50,40 L 50,55" stroke="#D32F2F" strokeWidth="2" fill="none" />
              
              <g transform="translate(50, 50)">
                {/* Loop */}
                <circle cx="0" cy="8" r="5" fill="none" stroke="#FFB300" strokeWidth="2" />
                {/* Bell cap */}
                <path d="M -12,25 C -12,12 12,12 12,25 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="1" />
                {/* Bell body */}
                <path d="M -12,25 L -16,48 C -16,51 16,51 16,48 L 12,25 Z" fill="#FFB300" stroke="#FFE082" strokeWidth="1" />
                {/* Clapper */}
                <motion.circle 
                  cx="0" cy="51" r="3" fill="#FFE082" 
                  animate={{ x: [-2, 2, -2] }} 
                  transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }} 
                />
                {/* Ring detail */}
                <rect x="-16" y="46" width="32" height="2" fill="#FFE082" />
              </g>
            </svg>
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
          style={{ willChange: "transform, opacity" }}
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
      "linear-gradient(to bottom, rgba(27,94,32,0.25) 0%, rgba(241,248,233,0.4) 60%, rgba(10,35,12,0.85) 100%)",
      <div className="w-full h-56 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Hanging toran row — staggered bounce + rises on activate */}
        <motion.div
          className="absolute top-0 w-full flex justify-between px-2 z-20"
          animate={activated ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              style={{ marginTop: i % 2 === 0 ? 0 : 8, willChange: "transform" }}
              animate={activated ? {} : { y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 3 : -3, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 border border-yellow-300 shadow flex items-center justify-center text-[7px]">🌻</div>
              <div className="w-[2.5px] h-7 bg-green-700/80 rounded-b-full" />
              <motion.div
                className="w-2 h-2 rounded-full bg-red-600"
                style={{ willChange: "transform" }}
                animate={activated ? {} : { scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Silk background behind the garland */}
        <div className="w-52 h-36 relative rounded-xl overflow-hidden shadow-xl mt-6 border border-amber-900/20 bg-[#1A0005] flex items-center justify-center">
          {/* Revealed center glow behind garland */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={activated ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="text-3xl">🌸</span>
            <span className="font-marcellus text-[8px] tracking-widest text-amber-300 uppercase">Welcome</span>
            <h4 className="font-cursive text-2xl text-amber-100 mt-1 leading-tight">{bride} &amp; {groom}</h4>
          </motion.div>

          {/* Draped Garland that lifts up */}
          <motion.div
            className="absolute inset-0 z-10 w-full h-full"
            animate={activated ? { y: -150, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* The SVG Garland */}
            <svg viewBox="0 0 200 140" className="w-full h-full">
              {/* Velvet red backsheet */}
              <rect x="0" y="0" width="200" height="140" fill="#8B0000" />
              {/* Decorative border */}
              <rect x="5" y="5" width="190" height="130" fill="none" stroke="#FFB300" strokeWidth="1" strokeDasharray="3,3" />

              {/* Draped string */}
              <path d="M 0,20 Q 50,85 100,85 Q 150,85 200,20" fill="none" stroke="#FF8F00" strokeWidth="6" strokeLinecap="round" />
              <path d="M 0,20 Q 50,85 100,85 Q 150,85 200,20" fill="none" stroke="#FFC107" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" />
              
              {/* Mango leaves hanging */}
              <path d="M 20,32 Q 20,55 23,60 Q 26,55 26,34 Z" fill="#2E7D32" />
              <path d="M 50,54 Q 50,75 53,80 Q 56,75 56,56 Z" fill="#2E7D32" />
              <path d="M 80,72 Q 80,95 83,100 Q 86,95 86,74 Z" fill="#2E7D32" />
              <path d="M 120,74 Q 120,95 117,100 Q 114,95 114,72 Z" fill="#2E7D32" />
              <path d="M 150,56 Q 150,75 147,80 Q 144,75 144,54 Z" fill="#2E7D32" />
              <path d="M 180,34 Q 180,55 177,60 Q 174,55 174,32 Z" fill="#2E7D32" />

              {/* Marigold flowers */}
              <circle cx="15" cy="27" r="5" fill="#FF6F00" />
              <circle cx="15" cy="27" r="3" fill="#FFC107" />
              
              <circle cx="35" cy="40" r="5.5" fill="#FF8F00" />
              <circle cx="35" cy="40" r="3.5" fill="#FFD54F" />

              <circle cx="60" cy="62" r="6" fill="#FF6F00" />
              <circle cx="60" cy="62" r="3.5" fill="#FFC107" />

              <circle cx="85" cy="78" r="6.5" fill="#FF8F00" />
              <circle cx="85" cy="78" r="4" fill="#FFD54F" />

              <circle cx="100" cy="80" r="7" fill="#FF6F00" />
              <circle cx="100" cy="80" r="4" fill="#FFC107" />

              <circle cx="115" cy="78" r="6.5" fill="#FF8F00" />
              <circle cx="115" cy="78" r="4" fill="#FFD54F" />

              <circle cx="140" cy="62" r="6" fill="#FF6F00" />
              <circle cx="140" cy="62" r="3.5" fill="#FFC107" />

              <circle cx="165" cy="40" r="5.5" fill="#FF8F00" />
              <circle cx="165" cy="40" r="3.5" fill="#FFD54F" />

              <circle cx="185" cy="27" r="5" fill="#FF6F00" />
              <circle cx="185" cy="27" r="3" fill="#FFC107" />
            </svg>
          </motion.div>
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
      style={{ willChange: "transform, opacity" }}
    >
      {/* Background soft light accent - optimized to use radial gradient only and skip heavy CSS filter blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
        }}
      />
      
      {/* Outer borders */}
      <div className="absolute inset-3 border border-brand-rust/5 rounded-[40px] pointer-events-none" />

      {/* Center envelope wrapper */}
      <motion.div
        animate={activated ? { y: 35, scale: 0.95, opacity: 0 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="z-10 w-full flex justify-center items-center"
        style={{ willChange: "transform, opacity" }}
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
