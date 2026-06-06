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
          className="absolute left-6 z-10 w-24 h-40 bg-[#8A3A1A] border-r-4 border-brand-gold rounded-l-2xl shadow-lg flex items-center justify-end pr-1.5"
        >
          <div className="w-18 h-36 border border-brand-gold/40 border-dashed rounded-l flex items-center justify-center text-brand-gold/30 font-serif">
            囍
          </div>
        </motion.div>

        {/* Right Palace Door */}
        <motion.div
          initial={{ x: 0 }}
          animate={activated ? { x: 140, opacity: 0 } : { x: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute right-6 z-10 w-24 h-40 bg-[#8A3A1A] border-l-4 border-brand-gold rounded-r-2xl shadow-lg flex items-center justify-start pl-1.5"
        >
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
        {/* Glowing aura behind diya */}
        <div className="absolute w-36 h-36 rounded-full bg-orange-500/10 filter blur-xl animate-pulse" />
        
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

        {/* Activated gold circular screen wipe */}
        {activated && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 12, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-transparent pointer-events-none mix-blend-screen z-25"
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

  // 3. IVORY ARCHWAY COVER (lotus mapping): Blooming lotus in center
  const renderLotusTheme = () => {
    const lotusPetalLeftVariants = {
      idle: { rotate: 0, x: 0, opacity: 1 },
      activated: { rotate: -45, x: -40, y: 15, opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }
    };
    const lotusPetalRightVariants = {
      idle: { rotate: 0, x: 0, opacity: 1 },
      activated: { rotate: 45, x: 40, y: 15, opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }
    };
    const lotusCenterVariants = {
      idle: { scale: 1, opacity: 1 },
      activated: { scale: 0.7, opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }
    };

    const interactiveLotus = (
      <div className="w-full h-56 relative flex items-center justify-center overflow-visible">
        {/* Arch Backdrop */}
        <div className="w-48 h-40 border-[6px] border-white/60 bg-[#FAF8F5] rounded-t-full relative flex items-end justify-center shadow-paper border-b-2 border-b-brand-rust/20 overflow-hidden">
          {/* Floral border decor at arch crest */}
          <div className="absolute -top-3 w-16 h-4 flex justify-around">
            <span className="text-[6px] text-brand-gold">🌸</span>
            <span className="text-[6px] text-brand-gold">🌸</span>
            <span className="text-[6px] text-brand-gold">🌸</span>
          </div>

          {/* Couple Silhouette (Revealed inside arch) */}
          <svg viewBox="0 0 100 100" className="w-24 h-24 absolute bottom-0 fill-[#8A3A1A]/20">
            <path d="M30,100 C30,70 42,60 42,48 L58,48 C58,60 70,70 70,100 Z" />
            <circle cx="50" cy="40" r="4.5" />
          </svg>
        </div>
        {/* Layered Lotus Flower Bud (Covers silhouette, opens on tap) */}
        <div className="absolute w-36 h-32 flex items-end justify-center z-10 bottom-4 pointer-events-none overflow-visible">
          {/* Left Petal */}
          <motion.svg
            variants={lotusPetalLeftVariants}
            animate={activated ? "activated" : "idle"}
            viewBox="0 0 60 120" className="w-12 h-24 absolute text-pink-500 fill-current drop-shadow-md"
            style={{ transformOrigin: "bottom center", left: "12%" }}
          >
            <path d="M30,120 C12,110 2,85 2,55 C2,30 18,5 30,0 C42,5 58,30 58,55 C58,85 48,110 30,120 Z" />
            <path d="M30,0 L30,95" stroke="#FFF" strokeWidth="0.8" opacity="0.35" strokeDasharray="3,3" />
          </motion.svg>

          {/* Right Petal */}
          <motion.svg
            variants={lotusPetalRightVariants}
            animate={activated ? "activated" : "idle"}
            viewBox="0 0 60 120" className="w-12 h-24 absolute text-pink-500 fill-current drop-shadow-md"
            style={{ transformOrigin: "bottom center", right: "12%", transform: "scaleX(-1)" }}
          >
            <path d="M30,120 C12,110 2,85 2,55 C2,30 18,5 30,0 C42,5 58,30 58,55 C58,85 48,110 30,120 Z" />
            <path d="M30,0 L30,95" stroke="#FFF" strokeWidth="0.8" opacity="0.35" strokeDasharray="3,3" />
          </motion.svg>

          {/* Center Main Petal */}
          <motion.svg
            variants={lotusCenterVariants}
            animate={activated ? "activated" : "idle"}
            viewBox="0 0 60 120" className="w-14 h-24 absolute text-pink-600 fill-current drop-shadow-lg"
            style={{ transformOrigin: "bottom center" }}
          >
            <path d="M30,120 C12,110 2,85 2,55 C2,30 18,5 30,0 C42,5 58,30 58,55 C58,85 48,110 30,120 Z" />
            <path d="M30,0 L30,95" stroke="#FFF" strokeWidth="0.8" opacity="0.35" strokeDasharray="3,3" />
          </motion.svg>
        </div>
        {!activated && (
          <button
            onClick={handleActivate}
            className="absolute z-20 py-2.5 px-6 rounded-full border-2 border-brand-rust bg-brand-rust text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer active:scale-95 shadow-md transition-transform"
          >
            {t("unfoldCard")}
          </button>
        )}
      </div>
    );

    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #F4EFE6 0%, #FAF8F5 50%, #FAF6F0 100%)",
      interactiveLotus,
      "#8A3A1A",
      t("archwayPrompt"),
      false
    );
  };

  // 4. ROYAL ELEPHANT COVER: Splitting face-to-face decorated elephants
  const renderElephantTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #FAF6F0 0%, #F5EFEB 60%, #E8D8CC 100%)",
      <div className="w-full h-56 relative flex items-center justify-center overflow-hidden">
        {/* Rotating gold mandala sun behind text (revealed on open) */}
        <motion.svg
          initial={{ rotate: 0, opacity: 0 }}
          animate={activated ? { rotate: 360, opacity: 0.15 } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" className="absolute w-36 h-36 fill-none stroke-brand-gold stroke-[0.8]"
        >
          <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
        </motion.svg>

        {/* Left Elephant (Bows & Slides Left) */}
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
            <path d="M92,15 Q95,12 97,14" stroke="#FFE082" strokeWidth="1" fill="none" />
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

        {/* Right Elephant (Bows & Slides Right) */}
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
            <path d="M92,15 Q95,12 97,14" stroke="#FFE082" strokeWidth="1" fill="none" />
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

  // 5. SACRED THREAD PULL: Kalava string pull layout
  const renderThreadTheme = () => {
    const handleDrag = (e: any, info: any) => {
      setThreadY(info.offset.y);
      if (info.offset.y > 100 && !activated) {
        handleActivate();
      }
    };

    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #FAF8F5 0%, #F5EFEB 100%)",
      <div className="w-full h-56 relative flex flex-col items-center overflow-visible">
        {/* Top Toran */}
        <div className="w-40 h-5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full border border-amber-200/25 flex items-center justify-around">
          <span className="text-[7px]">🌻</span>
          <span className="text-[7px]">🌻</span>
          <span className="text-[7px]">🌻</span>
        </div>

        {/* Thread line */}
        <svg className="absolute top-5 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none" width="10" height="150">
          <line x1="5" y1="0" x2="5" y2={40 + threadY} stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
          <line x1="5" y1="0" x2="5" y2={40 + threadY} stroke="#FFB300" strokeWidth="1.2" strokeDasharray="3,3" strokeLinecap="round" />
        </svg>

        {/* Draggable gold amulet handle */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 110 }}
          dragElastic={0.15}
          onDrag={handleDrag}
          onDragEnd={() => setThreadY(0)}
          style={{ y: 30 }}
          animate={activated ? { y: 150, scale: 0.9, opacity: 0 } : {}}
          transition={activated ? { duration: 0.5 } : { type: "spring", stiffness: 300, damping: 15 }}
          className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center"
        >
          <div className="w-3.5 h-3.5 bg-amber-500 rounded-full border border-amber-300 shadow-inner" />
          <div 
            className="w-14 h-14 rounded-full border-4 flex flex-col items-center justify-center shadow-md hover:scale-105"
            style={{
              background: `radial-gradient(circle, #FFE082 0%, #D84315 100%)`,
              borderColor: "#FFF9C4",
            }}
          >
            <span className="text-xl">🔔</span>
          </div>
          {!activated && (
            <span className="text-[8px] font-marcellus text-brand-rust font-bold tracking-widest mt-1 block">PULL ↓</span>
          )}
        </motion.div>

        {/* Target Ring */}
        <div className="w-18 h-18 rounded-full border border-dashed border-brand-rust/20 absolute bottom-4 flex items-center justify-center bg-brand-rust/5">
          <span className="text-[8px] font-marcellus text-brand-rust/30 tracking-wider">KNOT SEAL</span>
        </div>
      </div>,
      "#8A3A1A",
      t("dragBell"),
      false
    );
  };

  // 6. TORAN GARLAND COVER: Garland swag curtains
  const renderGarlandTheme = () => {
    return renderEnvelopeFrame(
      "linear-gradient(to bottom, #E8F5E9 0%, #FAF6F0 100%)",
      <div className="w-full h-56 relative flex flex-col items-center overflow-visible">
        {/* Toran loops hanging */}
        <motion.div
          animate={activated ? { y: -45, opacity: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-between px-6 absolute top-0 z-20 pointer-events-none"
        >
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-400 shadow-sm flex items-center justify-center text-[8px]">🌻</div>
              <div className="w-[3px] h-6 bg-emerald-600 rounded-b-full mt-0.5" />
            </div>
          ))}
        </motion.div>

        {/* Crimson silk screen cards */}
        <div className="w-48 h-32 bg-[#4A000A] rounded-2xl border border-brand-gold/20 relative overflow-hidden shadow-inner flex mt-6">
          {/* Left drape */}
          <motion.div 
            animate={activated ? { x: -75, opacity: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-1/2 h-full bg-[#800010] border-r border-[#60000A] shadow-md relative"
          >
            <div className="absolute inset-1 border border-[#4A000A] border-dashed rounded" />
          </motion.div>
          {/* Right drape */}
          <motion.div 
            animate={activated ? { x: 75, opacity: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-1/2 h-full bg-[#800010] shadow-md relative"
          >
            <div className="absolute inset-1 border border-[#4A000A] border-dashed rounded" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center bg-[#2C0005] z-0">
            <span className="text-2xl animate-pulse">🌸</span>
          </div>
        </div>

        {!activated && (
          <button
            onClick={handleActivate}
            className="py-2.5 px-6 rounded-full border-2 border-brand-rust bg-[#8A3A1A] hover:bg-[#782E13] text-white font-marcellus text-[10.5px] uppercase tracking-widest font-bold cursor-pointer absolute bottom-4 z-20 shadow-md"
          >
            {t("liftGarland")}
          </button>
        )}
      </div>,
      "#8A3A1A",
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
