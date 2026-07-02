import React, { useState, useEffect, useRef, useCallback } from "react";
import { Invitation } from "./types";
import BuilderForm from "./components/BuilderForm";
import InvitationView from "./components/InvitationView";
import ThemeShowroom from "./components/ThemeShowroom";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AgencyDashboard from "./components/AgencyDashboard";
import RestrictedPaywall from "./components/RestrictedPaywall";
import { playClickSound } from "./utils/soundUtils";
import { Sparkles, Heart, Check, Copy, Share2, ArrowRight, Eye, EyeOff, Star, Quote, ChevronDown, Minus } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";


const landingTranslations = {
  en: {
    heroParagraph: "Make a premium mobile-friendly wedding website to share with your guests. It comes with beautiful opening cover animations, traditional background music, Google Maps venue directions, RSVP forms, a live blessings wall, and direct UPI Shagun gift collections.\n\nIt is 100% free to build and preview. You only pay a one-time activation fee of ₹999 when you are ready to publish it. Includes lifetime hosting with unlimited edits so you can change dates or themes anytime for free!",
    stepsTitle: "How It Works — Get Your Live Card",
    stepsSub: "EASY 3-STEP PROCESS",
    steps: [
      { step: "01", title: "Enter Wedding & Venue Details", desc: "Enter bride & groom names, date, venue details with full Google Maps address, select your cover animation theme, and upload couple photos." },
      { step: "02", title: "Add Functions & Timeline", desc: "Add individual functions like Haldi Ceremony, Sangeet Night, or Reception with exact timings, descriptions, and custom symbols." },
      { step: "03", title: "Write Love Story & Generate", desc: "Write down your raw love story, choose a regional language script, and let Gemini AI enhance it into a beautiful narrative. Hit generate to preview instantly!" }
    ]
  },
  kn: {
    heroParagraph: "ನಿಮ್ಮ ಅತಿಥಿಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಪ್ರೀಮಿಯಂ ಮೊಬೈಲ್-ಸ್ನೇಹಿ ವೆಡ್ಡಿಂಗ್ ವೆಬ್‌ಸೈಟ್ ರಚಿಸಿ. ಇದು ಸುಂದರವಾದ ಲಕೋಟೆ ತೆರೆಯುವ ಅನಿಮೇಷನ್‌ಗಳು, ಸಾಂಪ್ರದಾಯಿಕ ಹಿನ್ನೆಲೆ ಸಂಗೀತ, ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಸ್ಥಳ ನಿರ್ದೇಶನಗಳು, ಆರ್ಎಸ್ವಿಪಿ ಫಾರ್ಮ್‌ಗಳು, ಲೈವ್ ಆಶೀರ್ವಾದಗಳ ಗೋಡೆ ಮತ್ತು ನೇರ ಯುಪಿಐ ಶಗುನ್ ಉಡುಗೊರೆ ಸಂಗ್ರಹಣೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.\n\nಇದನ್ನು ರಚಿಸಲು ಮತ್ತು ಮುನ್ನೋಟ ವೀಕ್ಷಿಸಲು 100% ಉಚಿತವಾಗಿದೆ. ನೀವು ಪ್ರಕಟಿಸಲು ಸಿದ್ಧರಾದಾಗ ಒಮ್ಮೆ ಮಾತ್ರ ₹999 ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ. ಜೀವಿತಾವಧಿಯ ಹೋಸ್ಟಿಂಗ್ ಜೊತೆಗೆ ಅನಿಯಮಿತ ಸಂಪಾದನೆಗಳು ಉಚಿತ!",
    stepsTitle: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ — ನಿಮ್ಮ ಲೈವ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ",
    stepsSub: "ಸುಲಭವಾದ 3 ಹಂತಗಳು",
    steps: [
      { step: "01", title: "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ", desc: "ವರ ಮತ್ತು ವಧುವಿನ ಹೆಸರುಗಳು, ಮದುವೆಯ ದಿನಾಂಕ, ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ವಿಳಾಸದೊಂದಿಗೆ ವೇದಿಕೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ, ಕವರ್ ಥೀಮ್ ಆರಿಸಿ ಮತ್ತು ಜೋಡಿಯ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ." },
      { step: "02", title: "ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಸೇರಿಸಿ", desc: "ಹಳದಿ ಶಾಸ್ತ್ರ, ಸಂಗೀತ ಸಂಜೆ ಅಥವಾ ಸ್ವಾಗತ ಸಮಾರಂಭದಂತಹ ವಿಭಿನ್ನ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನಿಖರವಾದ ಸಮಯ ಮತ್ತು ವಿವರಗಳೊಂದಿಗೆ ಸೇರಿಸಿ." },
      { step: "03", title: "ಪ್ರೀತಿಯ ಕಥೆ ಮತ್ತು ಜನರೇಟ್", desc: "ನಿಮ್ಮ ಪ್ರೀತಿಯ ಕಥೆಯನ್ನು ಬರೆಯಿರಿ, ಪ್ರಾದೇಶिक ಭಾಷೆಯನ್ನು ಆರಿಸಿ, ಮತ್ತು ಜೆಮಿನಿ ಎಐ ಅದನ್ನು ಸುಂದರವಾದ ನಿರೂಪಣೆಯಾಗಿ ಪರಿವರ್ತಿಸಲು ಬಿಡಿ. ತಕ್ಷಣವೇ ಮುನ್ನೋಟ ವೀಕ್ಷಿಸಲು ಜನರೇಟ್ ಮಾಡಿ!" }
    ]
  },
  hi: {
    heroParagraph: "अपने मेहमानों के साथ साझा करने के लिए एक प्रीमियम मोबाइल-फ्रेंडली वेडिंग वेबसाइट बनाएं। यह सुंदर लिफाफा खुलने वाले एनिमेशन, पारंपरिक पृष्ठभूमि संगीत, गूगल मैप्स स्थान निर्देश, आरएसवीपी फॉर्म, लाइव आशीर्वाद दीवार और सीधे यूपीआई शगुन उपहार संग्रह के साथ आता है।\n\nइसे बनाना और पूर्वावलोकन करना 100% मुफ्त है। जब आप इसे लाइव करने के लिए तैयार हों, तो केवल ₹999 का एक बार भुगतान करें। आजीवन होस्टिंग और असीमित बदलाव मुफ्त!",
    stepsTitle: "यह कैसे काम करता है — अपना लाइव कार्ड प्राप्त करें",
    stepsSub: "आसान 3-चरण प्रक्रिया",
    steps: [
      { step: "01", title: "विवरण और वेन्यू दर्ज करें", desc: "दूल्हा और दुल्हन का नाम, शादी की तारीख, गूगल मैप्स पते के साथ वेन्यू का विवरण दर्ज करें, कवर थीम चुनें और कपल की तस्वीरें अपलोड करें।" },
      { step: "02", title: "कार्यक्रम और टाइमलाइन जोड़ें", desc: "सटीक समय और विवरण के साथ हल्दी रस्म, संगीत संध्या या प्रीतिभोज जैसे अलग-अलग कार्यक्रम जोड़ें।" },
      { step: "03", title: "प्रेम कहानी लिखें और जनरेट करें", desc: "अपनी प्रेम कहानी लिखें, एक क्षेत्रीय भाषा चुनें, और जेमिनी एआई को इसे एक सुंदर कहानी में बदलने दें। तुरंत पूर्वावलोकन देखने के लिए जनरेट करें।" }
    ]
  },
  ta: {
    heroParagraph: "உங்கள் விருந்தினர்களுடன் பகிர்ந்து கொள்ள பிரீமியம் மொபைல்-நண்பன் திருமண வலைத்தளத்தை உருவாக்குங்கள். இது அழகான உறை திறக்கும் அனிமேஷன்கள், பாரம்பரிய பின்னணி இசை, கூகுள் மேப்ஸ் இருப்பிட வழிகாட்டுதல்கள், ஆர்எஸ்விபி படிவங்கள், நேரடி வாழ்த்து சுவர் மற்றும் நேரடி யுபிഐ ஷகன் பரிசு சேகரிப்புகளுடன் வருகிறது.\n\nஇதை உருவாக்குவதும் முன்னோட்டம் பார்ப்பதும் 100% இலவசம். நீங்கள் வெளியிட தயாராக இருக்கும்போது ஒரு முறை மட்டும் ₹999 செலுத்தினால் போதும். வாழ்நாள் ஹோஸ்டிங் மற்றும் வரம்பற்ற திருத்தங்கள் இலவசம்!",
    stepsTitle: "எவ்வாறு செயல்படுகிறது — உங்கள் நேரடி கார்டைப் பெறுங்கள்",
    stepsSub: "எளிதான 3-படி செயல்முறை",
    steps: [
      { step: "01", title: "திருமண & மண்டப விவரங்கள்", desc: "மணமகன் & மணமகள் பெயர்கள், தேதி, கூகுள் மேப்ஸ் முகவரியுடன் திருமண மண்டப விவரங்களை உள்ளிட்டு, அனிமேஷன் கவரைத் தேர்ந்தெடுத்து புகைப்படங்களைப் பதிவேற்றவும்." },
      { step: "02", title: "நிகழ்வுகள் & காலவரிசை", desc: "ஹல்தி விழா, சங்கீத் அல்லது வரவேற்பு போன்ற நிகழ்வுகளை துல்லியமான நேரம் மற்றும் விவரங்களுடன் சேர்க்கவும்." },
      { step: "03", title: "காதல் கதை & உருவாக்குதல்", desc: "உங்கள் காதல் கதையை எழுதுங்கள், ஒரு மொழியைத் தேர்ந்தெடுக்கவும், ஜெமினி ஐ அதை ஒரு அழகான கதையாக மாற்ற அனுமதிக்கவும். உடனடியாக முன்னோட்டம் பார்க்க ஜனரேட் செய்யவும்!" }
    ]
  },
  te: {
    heroParagraph: "మీ అతిథులతో పంచుకోవడానికి ప్రీమియం మొబైల్-ఫ్రెండ్లీ వెడ్డింగ్ వెబ్‌సైట్‌ను తయారు చేయండి. ఇది అందమైన కవరు తెరుచుకునే యానిమేషన్‌లు, సాంప్రదాయ నేపథ్య సంగీతం, గూగుల్ మ్యాప్స్ వేదిక దిశలు, RSVP ఫారమ్‌లు, లైవ్ ఆశీర్వాదాల గోడ మరియు నేరుగా UPI షగున్ బహుమతి సేకరణలతో వస్తుంది.\n\nఇది తయారు చేయడానికి మరియు ప్రివ్యూ చూడటానికి 100% ఉచితం. మీరు ప్రచురించడానికి సిద్ధంగా ఉన్నప్పుడు ఒకే ఒక్కసారి ₹999 చెల్లిస్తే సరిపోతుంది. అపరిమిత మార్పులతో లైఫ్‌టైమ్ హోస్టింగ్ ఉచితం!",
    stepsTitle: "ఎలా పనిచేస్తుంది — మీ లైవ్ కార్డ్ పొందండి",
    stepsSub: "సులువైన 3-దశల ప్రక్రియ",
    steps: [
      { step: "01", title: "వివాహ & వేదిక వివరాలు", desc: "వధూవరుల పేర్లు, తేదీ, గూగుల్ మ్యాప్స్ వేదిక దిశలు మరియు చిరునామాను నమోదు చేయండి, కవర్ థీమ్ ఎంచుకోండి మరియు ఫోటోలను అప్‌లోడ్ చేయండి." },
      { step: "02", title: "కార్యక్రమాలు & టైమ్‌లైన్", desc: "హల్దీ వేడుక, సంగీత్ సంధ్యా లేదా రిసెప్షన్ వంటి కార్యక్రమాలను ఖచ్చితమైన సమయాలు మరియు వివరాలతో జోడించండి." },
      { step: "03", title: "ప్రేమ కథ రాయండి & జనరేట్", desc: "మీ ప్రేమ కథను రాయండి, ఒక భాషను ఎంచుకోండి మరియు జెమిని AI దానిని అందమైన కథగా మార్చడానికి అనుమతించండి. తక్షణమే ప్రివ్యూ చూడటానికి జనరేట్ చేయండి!" }
    ]
  },
  ml: {
    heroParagraph: "നിങ്ങളുടെ അതിഥികളുമായി പങ്കിട്ടാൻ ഒരു പ്രീമിയം മൊബൈൽ ഫ്രണ്ട്‌ലി വെഡ്ഡിംഗ് വെബ്സൈറ്റ് നിർമ്മിക്കുക. ഇത് മനോഹരമായ കവർ ആനിമേഷനുകൾ, പരമ്പരാഗത പശ്ചാത്തല സംഗീതം, ഗൂഗിൾ മാപ്‌സ് ലൊക്കേഷൻ നിർദ്ദേശങ്ങൾ, RSVP ഫോമുകൾ, തത്സമയ അനുഗ്രഹ മതിൽ, നേരിട്ടുള്ള UPI ഷഗുൺ സമ്മാന ശേഖരണം എന്നിവയോടെയാണ് വരുന്നത്.\n\nഇത് നിർമ്മിക്കുന്നതും പ്രിവ്യൂ കാണുന്നതും 100% സൌജന്യമാണ്. പ്രസിദ്ധീകരിക്കാൻ തയ്യാറാകുമ്പോൾ ₹999 ഒരു തവണ മാത്രം നൽകുക. അൺലിമിറ്റഡ് എഡിറ്റുകളോടെ ലൈഫ് ടൈം ഹോസ്റ്റിംഗ് സൌയന്യമാണ്!",
    stepsTitle: "എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത് — നിങ്ങളുടെ ലൈവ് കാർഡ് സ്വന്തമാക്കൂ",
    stepsSub: "ലളിതമായ 3 ഘട്ടങ്ങൾ",
    steps: [
      { step: "01", title: "വിവാഹ & വേദി വിവരങ്ങൾ", desc: "വധൂവരന്മാരുടെ പേരുകൾ, തീയതി, ഗൂഗിൾ മാപ്‌സ് വിലാസത്തോടൊപ്പം വേദി വിവരങ്ങൾ നൽകുക, കവർ തീം തിരഞ്ഞെടുത്ത് ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക." },
      { step: "02", title: "ചടങ്ങുകൾ & സമയക്രമം", desc: "ഹൽദി ചടങ്ങ്, സംഗീത് സന്ധ്യ അല്ലെങ്കിൽ റിസപ്ഷൻ തുടങ്ങിയ ചടങ്ങുകൾ കൃത്യമായ സമയത്തോടും വിവരങ്ങളോടും കൂടി ചേർക്കുക." },
      { step: "03", title: "പ്രണയകഥ & ജനറേറ്റ്", desc: "നിങ്ങളുടെ പ്രണയകഥ എഴുതുക, ഒരു ഭാഷ തിരഞ്ഞെടുക്കുക, ജെമിനി AI അതിനെ മനോഹരമായ ഒരു കഥയായി മാറ്റാൻ അനുവദിക്കുക. തൽക്ഷണം പ്രിവ്യൂ കാണാൻ ജനറേറ്റ് ചെയ്യുക!" }
    ]
  }
};

export default function App() {
  // Simple state-based router based on location path
  const [slug, setSlug] = useState<string | null>(null);
  const [adminActive, setAdminActive] = useState(false);
  const [activeAgencyId, setActiveAgencyId] = useState<string | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<"pricing" | "terms" | "privacy" | "refund" | null>(null);
  const [invitationData, setInvitationData] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState("");

  // Management Login Portal States
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginSlug, setLoginSlug] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [editingData, setEditingData] = useState<Invitation | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Account Dashboard upgraded states
  const [loginMode, setLoginMode] = useState<"slug" | "email">("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [dashboardUserCards, setDashboardUserCards] = useState<any[]>([]);
  const [loggedInCardData, setLoggedInCardData] = useState<Invitation | null>(null);

  // Theme Showcase showroom selections
  const [preselectedFormTheme, setPreselectedFormTheme] = useState<"elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland" | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [stats, setStats] = useState<{ totalGenerated: number; rating: number; totalReviews: number }>({
    totalGenerated: 0,
    rating: 4.9,
    totalReviews: 0,
  });
  // Dynamic reviews from API
  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  // Review submission modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", location: "", stars: 5, text: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hero interactive simulator selected theme
  const [heroActiveTheme, setHeroActiveTheme] = useState<"elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland">("jaipur");
  const [landingLang, setLandingLang] = useState<string>("en");

  // Falling petals canvas ref on landing page
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-cycling bezel simulator states & helpers
  const [simSlide, setSimSlide] = useState(0);
  const [savedScrollY, setSavedScrollY] = useState(0);
  const [lastPreviewedTheme, setLastPreviewedTheme] = useState<string | null>(null);

  useEffect(() => {
    const themes = ["jaipur", "diya", "lotus", "elephant", "thread", "garland"] as const;
    const interval = setInterval(() => {
      setHeroActiveTheme((prev) => {
        const currentIndex = themes.indexOf(prev);
        return themes[(currentIndex + 1) % themes.length];
      });
      setSimSlide(0);
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
    const activeSim = heroSimulatorConfig[heroActiveTheme as keyof typeof heroSimulatorConfig] || heroSimulatorConfig.jaipur;
    const brideName = "Aditi";
    const groomName = "Karan";
    const dateStr = "11 December 2026";
    const cityStr = "Jodhpur";

    switch (simSlide) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="slide1_steps"
            className="absolute inset-0 bg-[#0F0C1B] overflow-hidden"
          >
            {/* Dark background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-rust/20 to-transparent opacity-30" />
            
            {/* Top Status Bar (fake) */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-[#0F0C1B]/80 backdrop-blur-md z-30 flex items-center justify-center border-b border-white/5">
              <span className="text-[7px] text-white/40 tracking-widest uppercase font-mono">Create Invite</span>
            </div>

            {/* Continuous Scrolling Container */}
            <motion.div 
              className="absolute top-6 left-0 right-0 w-full flex flex-col gap-6 px-4 py-8"
              animate={{ y: [0, -600] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {/* Step 1: Add Details */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[8px] font-bold">1</div>
                  <span className="text-[10px] text-white/90 font-marcellus">Add Details</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                    <span className="text-[6px] text-stone-400 uppercase tracking-widest block mb-0.5">Bride Name</span>
                    <motion.div 
                      className="text-[11px] text-white font-medium"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 13 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      Aditi Sharma
                    </motion.div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                    <span className="text-[6px] text-stone-400 uppercase tracking-widest block mb-0.5">Groom Name</span>
                    <motion.div 
                      className="text-[11px] text-white font-medium"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 13 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      Karan Singh
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Step 2: Choose Theme */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[8px] font-bold">2</div>
                  <span className="text-[10px] text-white/90 font-marcellus">Select Theme</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-lg bg-cover bg-center border border-white/10 opacity-50" style={{ backgroundImage: "url(/samples/mandap.jpg)" }} />
                  <motion.div 
                    className="h-16 rounded-lg bg-cover bg-center border-2 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)] relative"
                    style={{ backgroundImage: "url(/samples/couple1.jpg)" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 13 }}
                  >
                    <div className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </motion.div>
                  <div className="h-16 rounded-lg bg-cover bg-center border border-white/10 opacity-50" style={{ backgroundImage: "url(/samples/couple2.jpg)" }} />
                  <div className="h-16 rounded-lg bg-cover bg-center border border-white/10 opacity-50" style={{ backgroundImage: "url(/samples/flowers.jpg)" }} />
                </div>
              </div>

              {/* Step 3: Generating */}
              <div className="flex flex-col items-center justify-center py-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full mb-2"
                />
                <span className="text-[8px] text-amber-300 font-marcellus tracking-widest uppercase">Creating Magic...</span>
              </div>

              {/* Step 4: Preview Result */}
              <div className="bg-stone-900 border border-white/20 rounded-2xl h-64 shadow-2xl overflow-hidden relative mt-2">
                 <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url(/samples/couple1.jpg)" }} />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                 
                 <div className="absolute top-4 left-0 right-0 flex flex-col items-center">
                   <span className="text-[6px] text-amber-300 tracking-[2px] uppercase">✦ You're Invited ✦</span>
                   <h3 className="font-great-vibes text-white text-xl mt-1">Aditi</h3>
                   <span className="text-amber-400 text-[8px] italic my-0.5">weds</span>
                   <h3 className="font-great-vibes text-white text-xl">Karan</h3>
                 </div>
                 
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                   <div className="bg-amber-600/90 text-white text-[8px] px-4 py-1.5 rounded-full border border-amber-400 font-bold uppercase tracking-widest shadow-lg">
                     Open Invitation
                   </div>
                 </div>
              </div>
              
              {/* Extra spacing for continuous loop padding */}
              <div className="h-24" />
            </motion.div>

            {/* Fade overlays for the scroll area */}
            <div className="absolute top-6 left-0 right-0 h-10 bg-gradient-to-b from-[#0F0C1B] to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0F0C1B] via-[#0F0C1B]/80 to-transparent z-20 pointer-events-none flex items-end justify-center pb-4">
              <span className="text-[9px] font-marcellus text-amber-400 tracking-widest uppercase font-bold animate-pulse">Live Preview</span>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="slide2"
            className="absolute inset-0 flex flex-col justify-between p-3.5 pt-8 select-none text-left bg-stone-950 overflow-hidden"
          >
            {/* Blurred couple background matching inside card preview */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-[1.1] z-0 opacity-30 pointer-events-none"
              style={{ backgroundImage: `url(${activeSim.photo})` }}
            />
            
            {/* Color tint matching theme */}
            <div 
              className="absolute inset-0 z-0 opacity-70 mix-blend-multiply"
              style={{ background: activeStyle.bg }}
            />

            <div className="text-center z-10 mt-1">
              <span className="text-[7.5px] tracking-[2.5px] uppercase block font-marcellus text-amber-300 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">CELEBRATION TIME</span>
              
              <div className="flex gap-2 justify-center my-2 text-white font-semibold">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold leading-none font-mono">190</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-marcellus font-bold opacity-75 mt-0.5">Days</span>
                </div>
                <span className="text-xs font-bold leading-none font-mono">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold leading-none font-mono">07</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-marcellus font-bold opacity-75 mt-0.5">Hrs</span>
                </div>
                <span className="text-xs font-bold leading-none font-mono">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold leading-none font-mono">45</span>
                  <span className="text-[5.5px] uppercase tracking-wider font-marcellus font-bold opacity-75 mt-0.5">Min</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-[210px] mx-auto relative pl-4 pr-1 py-1 space-y-2.5 mt-0.5 overflow-hidden z-10">
              <div className="absolute left-1.5 top-0 bottom-4 w-[1px] bg-white/20" />
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 relative text-[7.5px] shadow"
              >
                <div className="absolute left-[-15.5px] top-2.5 w-2 h-2 rounded-full bg-amber-400 border border-white shadow" />
                <h5 className="font-bold font-marcellus text-amber-300 text-[8.5px]">Haldi Ceremony</h5>
                <p className="text-white font-medium font-marcellus mt-0.5">Dec 11, 10:00 AM</p>
                <p className="text-stone-300 font-cormorant leading-tight mt-0.5">Golden saffron paste and family laughter.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 relative text-[7.5px] shadow"
              >
                <div className="absolute left-[-15.5px] top-2.5 w-2 h-2 rounded-full bg-red-400 border border-white shadow" />
                <h5 className="font-bold font-marcellus text-amber-300 text-[8.5px]">Wedding Muhurtham</h5>
                <p className="text-white font-medium font-marcellus mt-0.5">Dec 12, 06:30 PM</p>
                <p className="text-stone-300 font-cormorant leading-tight mt-0.5">Sacred vows and Shehnai under the stars.</p>
              </motion.div>
            </div>

            <div className="mb-4 text-center select-none z-10">
              <span className="text-[7.5px] font-marcellus tracking-[1.5px] text-white/60 font-bold uppercase block">
                RSVP, Maps, Music & Shagun
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

    // Also fetch approved reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setLiveReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setReviewSubmitting(true);
    setReviewSuccess("");
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error || "Submission failed");
      setReviewSuccess(parsed.message || "Thank you! Your review is awaiting approval.");
      setReviewForm({ name: "", location: "", stars: 5, text: "" });
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

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
    // Capture referral code if present
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref") || urlParams.get("agency");
    if (refCode) {
      try {
        localStorage.setItem("agency_ref", refCode.trim());
      } catch (e) {
        console.warn("Failed to save agency_ref:", e);
      }
    }

    const path = window.location.pathname;
    const cleanSlug = path.split("/").filter(Boolean)[0];
    const ignoredSlugs = ["index.html", "index", "api", "assets", "favicon.ico", "vite", "admin", "agency"];

    if (cleanSlug && cleanSlug.toLowerCase() === "admin") {
      setAdminActive(true);
      setLoading(false);
    } else if (cleanSlug && cleanSlug.toLowerCase() === "agency") {
      const parts = path.split("/").filter(Boolean);
      const agencyIdVal = parts[1] || "";
      setActiveAgencyId(agencyIdVal);
      setLoading(false);
    } else if (cleanSlug && !ignoredSlugs.includes(cleanSlug.toLowerCase()) && !cleanSlug.includes(".")) {
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
        const urlParams = new URLSearchParams(window.location.search);
        const editParam = urlParams.get("edit") === "true";
        let passcode = urlParams.get("passcode") || "";
        if (!passcode) {
          passcode = localStorage.getItem("shaadi_auth_" + slug) || "";
        }

        const res = await fetch(`/api/invitations/${slug}?passcode=${encodeURIComponent(passcode)}`);
        if (res.ok) {
          const parsed = await res.json();
          
          if (editParam && parsed.editPassword && passcode.trim() === parsed.editPassword.trim()) {
            // Store valid passcode in localStorage
            localStorage.setItem("shaadi_auth_" + slug, passcode.trim());
            // Open card in editor
            setEditingData(parsed);
            // Revert slug to null so we render the landing page editor
            setSlug(null);
            // Clean URL query parameters
            window.history.replaceState({}, "", "/");
          } else {
            setInvitationData(parsed);
          }
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setContactSubmitting(true);
    setContactSuccessMsg("");

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error || "Failed to submit message.");

      setContactSuccessMsg("Your support message has been sent successfully! We will get back to you shortly. ✨");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      alert("Error sending message: " + err.message);
    } finally {
      setContactSubmitting(false);
    }
  };

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

        try {
          localStorage.setItem("shaadi_auth_" + parsed.data.slug, loginPassword.trim());
        } catch (e) {
          console.warn("Failed to save passcode to localStorage:", e);
        }

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
        if (parsed.editPassword && loginPassword && parsed.editPassword.trim() === loginPassword.trim()) {
          try {
            localStorage.setItem("shaadi_auth_" + parsed.slug, loginPassword.trim());
          } catch (e) {
            console.warn("Failed to save passcode to localStorage:", e);
          }
          setLoggedInCardData(parsed);
        // Clear password from state after a successful login to avoid reuse issues
        setLoginPassword('');
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
        "/samples/couple_realistic.png",
        "/samples/couple_realistic.png",
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

  // Admin View
  if (adminActive) {
    return (
      <AdminDashboard 
        onClose={() => {
          setAdminActive(false);
          window.history.pushState({}, "", "/");
        }}
      />
    );
  }

  // Agency View
  if (activeAgencyId) {
    return (
      <AgencyDashboard 
        agencyId={activeAgencyId}
        onClose={() => {
          setActiveAgencyId(null);
          window.history.pushState({}, "", "/");
        }}
      />
    );
  }

  // Draw full dynamic Invitation View if slug successfully checked and loaded
  if (slug && invitationData) {
    if ((invitationData as any).restricted) {
      return (
        <RestrictedPaywall
          data={invitationData as any}
          onAccessGranted={(freshData) => {
            setInvitationData(freshData);
          }}
          onBackHome={() => {
            setSlug(null);
            setInvitationData(null);
            window.history.pushState({}, "", "/");
          }}
        />
      );
    }
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
    jaipur: { name: "Karan & Aditi", photo: "/samples/couple_realistic.png", tag: "Royal Palace", detail: "Traditional arches with soft sunset glow.", style: "bg-rose-100/70 text-amber-900 border-amber-700/20" },
    diya: { name: "Kabir & Riya", photo: "/samples/couple_realistic.png", tag: "Midnight Diya", detail: "Celestial stars and floating orange sky lanterns.", style: "bg-indigo-950/80 text-amber-200 border-indigo-700/30" },
    lotus: { name: "Dev & Ishika", photo: "/samples/couple_realistic.png", tag: "Temple Lotus", detail: "Blooming lotuses and falling pink rose petals.", style: "bg-orange-50/50 text-[#8A3A1A] border-[#8A3A1A]/10" },
    elephant: { name: "Arjun & Priyanka", photo: "/samples/couple_realistic.png", tag: "Royal Elephant", detail: "Sandstone carvings with marigold curtains.", style: "bg-amber-50/65 text-[#8A3A1A] border-amber-800/10" },
    thread: { name: "Vikram & Pooja", photo: "/samples/couple_realistic.png", tag: "Sacred Knot", detail: "Cotton tassels with swinging golden bells.", style: "bg-yellow-50/60 text-[#8B0000] border-[#8B0000]/10" },
    garland: { name: "Arjun & Priyanka", photo: "/samples/couple_realistic.png", tag: "Marigold Garland", detail: "Orange-yellow flowers and mango leaves.", style: "bg-emerald-50/60 text-[#FFA500] border-emerald-800/10" },
  };
  const activeSim = heroSimulatorConfig[heroActiveTheme as keyof typeof heroSimulatorConfig] || heroSimulatorConfig.jaipur;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060414] via-[#100D26] to-[#181236] text-[#F3EFE0] font-sans overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200 relative">
      {/* Background Falling Petals Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />

      {/* Ambient background glows */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full filter blur-[140px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-purple-800/5 pointer-events-none z-0" />
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full filter blur-[150px] bg-brand-rust/10 pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[500px] h-[500px] rounded-full filter blur-[160px] bg-amber-500/10 pointer-events-none" />

      {/* Success generated modal popup with confetti burst */}
      {successSlug && (
        <div className="fixed inset-0 z-[700] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#120E2B]/95 rounded-[28px] border border-white/10 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Confetti burst particles */}
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="confetti-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 30}%`,
                  backgroundColor: ['#F59E0B','#EF4444','#10B981','#6366F1','#EC4899','#F97316'][i % 6],
                  animationDelay: `${Math.random() * 0.6}s`,
                  animationDuration: `${1.2 + Math.random() * 0.8}s`,
                  borderRadius: i % 3 === 0 ? '50%' : '2px',
                  width: `${6 + Math.random() * 6}px`,
                  height: `${6 + Math.random() * 6}px`,
                }}
              />
            ))}
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
      <nav className="border-b border-amber-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] bg-[#060414]/85 sticky top-0 z-50 backdrop-blur-md">
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
            <span className="text-[7.5px] sm:text-[9px] tracking-wider sm:tracking-widest font-marcellus text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full select-none font-bold">
              <span className="inline md:hidden">Free Preview</span>
              <span className="hidden md:inline">FREE TO BUILD &amp; PREVIEW</span>
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
              aria-label="Close card management portal"
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
                  onClick={() => { playClickSound(); setLoginMode("email"); }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${
                    loginMode === "email" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-300 hover:text-white"
                  }`}
                >
                  Email Login
                </button>
                <button
                  onClick={() => { playClickSound(); setLoginMode("slug"); }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-marcellus ${
                    loginMode === "slug" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-300 hover:text-white"
                  }`}
                >
                  Direct Link
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
                      <label htmlFor="login-slug" className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Invitation Link Path Name</label>
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden text-sm focus-within:border-amber-400/40">
                        <span className="px-3.5 py-2.5 text-stone-400 bg-white/5 border-r border-white/5 select-none font-mono font-bold">/</span>
                        <input
                          id="login-slug"
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
                      <label htmlFor="login-email" className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Owner Email Address</label>
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="couple@example.com"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs font-mono placeholder:text-stone-600"
                      />
                    </div>
                  )}

                  <div className="flex flex-col text-left gap-1">
                    <label htmlFor="login-password" className="text-[10px] font-marcellus tracking-widest text-stone-400 uppercase font-semibold">Secret Passcode / Password</label>
                    <div className="relative w-full">
                      <input
                        id="login-password"
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
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
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

              <h1 className="font-marcellus font-medium text-3xl sm:text-5xl lg:text-7xl leading-tight text-white">
                Create a Beautiful
                <span className="block mt-1 font-cursive text-amber-400 font-normal normal-case text-4xl sm:text-6xl lg:text-8xl">
                  Digital Wedding Card
                </span>
                in 2 Minutes for Free
              </h1>

              
              <p className="text-sm sm:text-base text-stone-300/90 tracking-wide leading-relaxed max-w-xl font-cormorant whitespace-pre-line">
                {landingTranslations[landingLang as keyof typeof landingTranslations].heroParagraph}
              </p>

              {/* Landing Page Language Selector Toggle */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5 select-none">
                <span className="text-[9.5px] font-marcellus tracking-widest text-amber-400/60 uppercase font-bold">
                  Read Info & Steps in:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: "en", label: "🇬🇧 English" },
                    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
                    { code: "hi", label: "हिंदी (Hindi)" },
                    { code: "ta", label: "தமிழ் (Tamil)" },
                    { code: "te", label: "తెలుగు (Telugu)" },
                    { code: "ml", label: "മലയാളം (Malayalam)" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setLandingLang(item.code);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
                        landingLang === item.code
                          ? "bg-amber-400/10 border-amber-400 text-amber-300 font-bold scale-[1.02]"
                          : "bg-white/5 border-white/10 text-stone-350 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* Quick Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-2 select-none">
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">100% Free to Build & Preview</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">Music, RSVP, Venue Maps & UPI</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">No Ads or Company Branding</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span className="text-xs font-semibold">Pay ₹999 Once for Lifetime Access</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 select-none">
                <button 
                  onClick={() => {
                    playClickSound();
                    document.getElementById("form-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="btn-pulse-ring py-3.5 px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-marcellus text-xs tracking-[2px] uppercase font-bold hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/30 text-center"
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
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/18.5] rounded-[48px] border-[10px] border-stone-800 bg-[#0F021A] shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] border-b-[12px] border-b-stone-850">
                {/* Dynamic island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-800 rounded-full z-30 flex items-center justify-between px-3 text-[9.5px] text-white/40">
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

          {/* STEP-BY-STEP INTERACTIVE WORKFLOW */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12 z-10 select-none"
          >
            <div className="p-6 sm:p-10 rounded-[36px] bg-gradient-to-r from-brand-rust/20 to-[#120E2B]/95 border border-brand-rust/20 relative overflow-hidden backdrop-blur-md">
              <div className="absolute right-0 top-0 w-44 h-44 bg-brand-rust/10 filter blur-[80px] rounded-full pointer-events-none" />
              
              <div className="text-center max-w-sm mx-auto mb-10">
                <span className="text-[10px] font-marcellus text-amber-400 font-bold uppercase tracking-widest block mb-1">
                  {landingTranslations[landingLang as keyof typeof landingTranslations].stepsSub}
                </span>
                <h2 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wider text-white">
                  {landingTranslations[landingLang as keyof typeof landingTranslations].stepsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {landingTranslations[landingLang as keyof typeof landingTranslations].steps.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="flex flex-col gap-2.5 relative"
                  >
                    <span className="font-marcellus text-4xl text-amber-400/40 font-bold leading-none">{item.step}</span>
                    <h4 className="text-sm font-bold tracking-wider text-white font-marcellus">{item.title}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-cormorant">{item.desc}</p>
                    {idx < 2 && <div className="hidden md:block absolute top-4 right-[-20px] text-amber-400/20 text-xl font-bold font-mono">→</div>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Unified Creation Form */}
          <section id="form-container" className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 z-10">
            <div className="relative p-6 sm:p-10 rounded-[36px] bg-gradient-to-r from-brand-rust/20 to-[#120E2B]/95 border border-amber-500/20 backdrop-blur-md shadow-2xl shadow-amber-500/5 overflow-hidden">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/35 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/35 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/35 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/35 rounded-br-2xl pointer-events-none" />
              
              <div className="text-center space-y-2 mb-10 max-w-md mx-auto">
                <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase">
                  ✨ WEDDING CARD CREATOR
                </span>
                <h2 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wider text-white">
                  Enter Details & Preview Instantly
                </h2>
                <p className="text-xs text-stone-400 font-cormorant leading-relaxed">
                  Fill in your details below. Your beautiful digital wedding invitation website will be ready to preview instantly in real-time.
                </p>
              </div>

              <BuilderForm
                onSuccess={(updatedSlug) => {
                  setEditingData(null);
                  handleCreateSuccess(updatedSlug);
                }}
                initialData={editingData}
                onCancelEdit={() => { playClickSound(); setEditingData(null); }}
                preselectedTheme={preselectedFormTheme}
              />
            </div>
          </section>

          {/* SOCIAL PROOF MARQUEE TICKER */}
          <section className="w-full overflow-hidden border-y border-amber-500/10 bg-amber-500/5 py-3 mb-8 z-10 select-none">
            <div className="animate-marquee gap-0">
              {[...Array(2)].map((_, repeatIdx) => (
                <div key={repeatIdx} className="flex items-center gap-10 pr-10">
                  {[
                    { icon: "★", text: `${stats.rating.toFixed(1)} Star Rating` },
                    { icon: "💍", text: `${stats.totalGenerated.toLocaleString()}+ Invitations Created` },
                    { icon: "🎵", text: "Bollywood Instrumental Music" },
                    { icon: "🆓", text: "100% Free to Build & Preview" },
                    { icon: "📍", text: "Google Maps Integration" },
                    { icon: "💸", text: "₹999 One-Time — No Renewals" },
                    { icon: "✏️", text: "Unlimited Lifetime Edits" },
                    { icon: "📜", text: "Live Guestbook Blessings Wall" },
                    { icon: "🎁", text: "UPI Shagun Gift System" },
                  ].map((item, i) => (
                    <span key={i} className="flex items-center gap-2 text-[10.5px] font-marcellus font-bold text-amber-300/80 whitespace-nowrap tracking-wider uppercase">
                      <span className="text-amber-400">{item.icon}</span>
                      {item.text}
                      <span className="text-amber-500/30 ml-6">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* THEME SHOWROOM */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 z-10"
          >
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
          </motion.section>

          {/* SALES FEATURES PERSUASIVE GRID */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 z-10 select-none"
          >
            <div className="text-center space-y-2 mb-12">
              <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase">
                🌸 EVERYTHING INCLUDED IN YOUR CARD
              </span>
              <h2 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
                Everything Included For ₹999
              </h2>
              <p className="text-xs text-stone-400 max-w-sm mx-auto font-cormorant leading-relaxed">
                Unlock a premium interactive experience for your guests with a one-time payment. Edit details, change themes, or add Google Drive links anytime for free.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Bollywood Instrumentals", icon: "🎵", desc: "Select from popular romantic Bollywood instrumental melodies to play in the background.", featured: true },
                { title: "Interactive Covers", icon: "🚪", desc: "Guests interact with elegant opening templates (arched doors, tasselled strings, or lighting lamps).", featured: false },
                { title: "Google Maps Integration", icon: "📍", desc: "Embed exact venue locations so guests can navigate directly using Google Maps with one tap.", featured: false },
                { title: "UPI Shagun Gift System", icon: "🎁", desc: "Receive monetary blessings direct to your account. Guests enter custom amounts to generate secure UPI QR codes.", featured: false },
                { title: "Blessing Guestbook Wall", icon: "📜", desc: "A live wedding guestbook wall where guests submit love notes that post dynamically.", featured: false },
                { title: "One-Time Pay, Lifetime Edits", icon: "🔑", desc: "Pay once. Update timings, parent details, change cover templates, or add drive links at any time for free.", featured: false }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`shimmer-card p-5 sm:p-6 border rounded-[24px] flex flex-col gap-3 group cursor-default backdrop-blur-md shadow-lg transition-shadow duration-300 ${
                    item.featured
                      ? "bg-gradient-to-br from-amber-500/15 to-amber-500/5 border-amber-400/40 shadow-amber-500/10"
                      : "bg-white/5 border-white/10 hover:border-amber-400/25 hover:shadow-amber-500/5"
                  }`}
                >
                  {item.featured && (
                    <span className="self-start text-[8px] font-marcellus font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      ⭐ Fan Favourite
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-widest font-marcellus text-amber-400">{item.title}</h4>
                    <p className="text-[10px] sm:text-xs text-stone-300/70 mt-1.5 leading-relaxed font-cormorant">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── TESTIMONIALS SECTION (DYNAMIC) ─────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 z-10 select-none"
          >
            <div className="text-center mb-12">
              <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase mb-2">
                💬 REAL COUPLES, REAL LOVE
              </span>
              <h2 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
                Couples Who Trusted ShaadiLink
              </h2>
              {stats.totalReviews > 0 && (
                <p className="text-xs text-stone-400 mt-3 font-cormorant">
                  {stats.totalReviews} verified {stats.totalReviews === 1 ? "review" : "reviews"} · {stats.rating.toFixed(1)} ★ average
                </p>
              )}
            </div>

            {liveReviews.length === 0 ? (
              <div className="flex flex-col items-center gap-6 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl">
                  💬
                </div>
                <div>
                  <p className="font-marcellus text-lg font-bold text-white">Be the First to Review!</p>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs font-cormorant">
                    No reviews yet. If you've used ShaadiLink for your wedding, share your experience!
                  </p>
                </div>
                <button
                  onClick={() => { playClickSound(); setReviewOpen(true); setReviewSuccess(""); }}
                  className="py-3 px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider font-marcellus cursor-pointer active:scale-95 transition-all"
                >
                  ✍️ Write a Review
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveReviews.map((t: any, idx: number) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (idx % 6) * 0.1 }}
                      className="testimonial-card p-6 bg-white/5 border border-white/10 rounded-[24px] flex flex-col gap-4 backdrop-blur-md transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/20 flex items-center justify-center text-sm font-bold text-amber-400 font-marcellus flex-shrink-0">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < t.stars ? "fill-amber-400 text-amber-400" : "text-stone-600"}`} />
                          ))}
                        </div>
                      </div>
                      <Quote className="w-5 h-5 text-amber-400/25" />
                      <p className="text-xs sm:text-sm text-stone-300/85 leading-relaxed font-cormorant italic flex-1">
                        {t.text}
                      </p>
                      <div className="border-t border-white/8 pt-3">
                        <p className="text-xs font-bold text-amber-300 font-marcellus">{t.name}</p>
                        {t.location && <p className="text-[10px] text-stone-500 font-marcellus tracking-wider mt-0.5">{t.location}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Write a review CTA */}
                <div className="text-center mt-10">
                  <button
                    onClick={() => { playClickSound(); setReviewOpen(true); setReviewSuccess(""); }}
                    className="py-3 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/30 text-white font-bold text-xs uppercase tracking-wider font-marcellus cursor-pointer active:scale-95 transition-all"
                  >
                    ✍️ Write a Review
                  </button>
                </div>
              </>
            )}
          </motion.section>

          {/* ── COMPARISON CHART SECTION ─────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16 z-10 select-none"
          >
            <div className="text-center mb-12">
              <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase mb-2">
                📊 SEE THE DIFFERENCE
              </span>
              <h2 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
                Why Choose ShaadiLink?
              </h2>
              <p className="text-xs text-stone-400 mt-3 font-cormorant max-w-md mx-auto leading-relaxed">
                Compare us with traditional invitation methods. One link, every feature, at a fraction of the cost.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden shadow-2xl">
              {/* Column Headers */}
              <div className="grid grid-cols-5 border-b border-white/10">
                <div className="p-3 sm:p-5" />
                {[
                  { icon: "🖨️", label: "Printed Cards" },
                  { icon: "📸", label: "Photo Invite" },
                  { icon: "🎬", label: "Video Invite" },
                  { icon: "💎", label: "ShaadiLink", featured: true },
                ].map((col, i) => (
                  <div
                    key={i}
                    className={`p-3 sm:p-5 text-center flex flex-col items-center gap-1.5 ${
                      col.featured
                        ? "bg-gradient-to-b from-amber-500/15 to-transparent border-x border-amber-400/20"
                        : ""
                    }`}
                  >
                    <span className="text-lg sm:text-2xl">{col.icon}</span>
                    <span
                      className={`text-[8px] sm:text-[10px] font-marcellus font-bold tracking-wider uppercase leading-tight ${
                        col.featured ? "text-amber-400" : "text-stone-400"
                      }`}
                    >
                      {col.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              {[
                { feature: "Cost", values: ["₹50–200", "₹500–2K", "₹3K–10K", "₹999"], note: "per invite vs one-time" },
                { feature: "AI Love Story", values: [false, false, false, true] },
                { feature: "Live Countdown", values: [false, false, false, true] },
                { feature: "Venue Map", values: [false, false, false, true] },
                { feature: "Background Music", values: [false, false, true, true] },
                { feature: "UPI Shagun Gifts", values: [false, false, false, true] },
                { feature: "Blessing Guestbook", values: [false, false, false, true] },
                { feature: "Interactive Covers", values: [false, false, false, true] },
                { feature: "Easy to Share", values: [false, true, true, true] },
                { feature: "Regional Languages", values: [true, false, false, true] },
                { feature: "Eco-friendly", values: [false, true, true, true] },
                { feature: "Lifetime Free Edits", values: [false, false, false, true] },
              ].map((row, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`grid grid-cols-5 items-center ${
                    idx % 2 === 0 ? "bg-white/[0.02]" : ""
                  } ${idx < 11 ? "border-b border-white/5" : ""}`}
                >
                  <div className="p-3 sm:p-4 sm:pl-6">
                    <span className="text-[10px] sm:text-xs font-marcellus font-bold tracking-wider text-stone-300">
                      {row.feature}
                    </span>
                    {row.note && (
                      <span className="block text-[8px] text-stone-500 font-cormorant mt-0.5">{row.note}</span>
                    )}
                  </div>
                  {row.values.map((val, vi) => (
                    <div
                      key={vi}
                      className={`p-3 sm:p-4 text-center ${
                        vi === 3
                          ? "bg-amber-500/[0.06] border-x border-amber-400/10"
                          : ""
                      }`}
                    >
                      {typeof val === "string" ? (
                        <span
                          className={`text-[10px] sm:text-xs font-bold font-marcellus tracking-wider ${
                            vi === 3 ? "text-amber-400" : "text-stone-400"
                          }`}
                        >
                          {val}
                        </span>
                      ) : val ? (
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full mx-auto flex items-center justify-center ${
                            vi === 3
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25"
                              : "bg-emerald-500/20 border border-emerald-400/30"
                          }`}
                        >
                          <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${vi === 3 ? "text-stone-950" : "text-emerald-400"}`} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
                          <Minus className="w-3 h-3 text-stone-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}

              {/* Bottom CTA row */}
              <div className="grid grid-cols-5 border-t border-white/10">
                <div className="col-span-4 p-4 sm:p-5 sm:pl-6 flex items-center">
                  <p className="text-[10px] sm:text-xs text-stone-400 font-cormorant">
                    <span className="text-amber-400 font-bold font-marcellus">12 premium features</span> — all included in a single ₹999 payment
                  </p>
                </div>
                <div className="p-4 sm:p-5 bg-amber-500/[0.06] border-x border-amber-400/10 flex items-center justify-center">
                  <button
                    onClick={() => {
                      playClickSound();
                      document.getElementById("form-container")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[8px] sm:text-[10px] font-marcellus font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-3 sm:px-4 py-2 rounded-full cursor-pointer active:scale-95 transition-all hover:shadow-lg hover:shadow-amber-500/25 whitespace-nowrap"
                  >
                    Start Free →
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── FAQ SECTION ───────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 z-10 select-none"
          >
            <div className="text-center mb-12">
              <span className="text-[10px] font-marcellus tracking-widest text-amber-400 font-bold block uppercase mb-2">
                ❓ HAVE QUESTIONS?
              </span>
              <h2 className="font-marcellus text-3xl sm:text-4xl font-bold tracking-wider text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-stone-400 mt-3 font-cormorant max-w-sm mx-auto leading-relaxed">
                Everything you need to know about creating your digital wedding invitation.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "Is it really free to build and preview my invitation?",
                  a: "Yes! You can enter all your wedding details, write your love story, choose themes, preview your full interactive invitation — all completely free. You only pay ₹999 when you're ready to activate the shareable live link."
                },
                {
                  q: "What does the ₹999 payment include?",
                  a: "One payment of ₹999 unlocks everything: your permanent shareable link, background music, interactive cover animations, Google Maps venue integration, UPI Shagun gift system, blessing guestbook wall, and unlimited free edits to your card details forever."
                },
                {
                  q: "Can I edit my card after paying?",
                  a: "Absolutely! After activation, you can change your love story, update event timings, swap cover themes, modify venue details, or add Google Drive photo links — all for free, as many times as you want. Changes reflect instantly on your live card."
                },
                {
                  q: "How do guests receive the invitation?",
                  a: "You get a unique shareable link (like getshaadilink.in/priya-rahul) that you can send via WhatsApp, Instagram, email, or any messaging app. Guests simply tap the link to view your full interactive invitation — no app download needed."
                },
                {
                  q: "What is the AI Love Story feature?",
                  a: "When you write your love story in simple words, our AI (powered by Google Gemini) polishes it into a beautiful, cinematic narrative and translates it into your chosen regional language (Hindi, Kannada, Tamil, Telugu, or Malayalam) automatically."
                },
                {
                  q: "How does the UPI Shagun gift system work?",
                  a: "Guests can send monetary blessings directly from your invitation page. They enter a custom amount, and a secure UPI QR code is generated linked to your UPI ID. The gift goes straight to your account — no middleman, no commission."
                },
                {
                  q: "What if I need to change the wedding date?",
                  a: "No problem at all. Log into your Card Management Portal using your email or card link, and update any details including the wedding date. The live countdown on your card will automatically recalculate."
                },
                {
                  q: "Is my personal information safe?",
                  a: "Yes. We only store the details you provide for your invitation card. We do not share, sell, or use your data for anything else. Payments are processed securely through Razorpay's PCI-compliant gateway."
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-[20px] border backdrop-blur-md overflow-hidden transition-all duration-300 ${
                    openFaq === idx
                      ? "bg-amber-500/[0.06] border-amber-400/25 shadow-lg shadow-amber-500/5"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => {
                      playClickSound();
                      setOpenFaq(openFaq === idx ? null : idx);
                    }}
                    className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer text-left group"
                  >
                    <span
                      className={`text-xs sm:text-sm font-bold font-marcellus tracking-wider pr-4 transition-colors ${
                        openFaq === idx ? "text-amber-400" : "text-white group-hover:text-amber-300"
                      }`}
                    >
                      {item.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                        openFaq === idx
                          ? "bg-amber-400 rotate-180"
                          : "bg-white/10 group-hover:bg-white/15"
                      }`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-colors ${
                          openFaq === idx ? "text-stone-950" : "text-stone-400"
                        }`}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <div className="h-px bg-amber-400/15 mb-4" />
                          <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed font-cormorant">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Still have questions CTA */}
            <div className="text-center mt-10">
              <p className="text-xs text-stone-500 font-cormorant mb-4">Still have questions?</p>
              <button
                onClick={() => { playClickSound(); setContactOpen(true); setContactSuccessMsg(""); }}
                className="py-3 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/30 text-white font-bold text-xs uppercase tracking-wider font-marcellus cursor-pointer active:scale-95 transition-all"
              >
                📩 Contact Us
              </button>
            </div>
          </motion.section>

          {/* ── DECORATIVE DIVIDER ──────────────────────────────── */}
          <div className="w-full max-w-3xl px-8 py-4 flex items-center gap-6 z-10 select-none">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="flex items-center gap-2 text-amber-400/40">
              <span className="text-lg">🌸</span>
              <svg viewBox="0 0 80 20" className="w-20 h-5 fill-none stroke-amber-400/25 stroke-[0.8]">
                <path d="M0,10 Q20,2 40,10 Q60,18 80,10" />
                <path d="M0,12 Q20,4 40,12 Q60,20 80,12" />
              </svg>
              <span className="text-lg">🌸</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>

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


        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060414]/90 py-16 text-center select-none text-stone-400 relative z-20">
        <p className="font-marcellus font-bold text-amber-400 tracking-[4px] text-lg uppercase mb-1">
          ShaadiLink
        </p>
        <p className="text-[10px] text-stone-500 mt-1 tracking-widest font-semibold font-marcellus">Premium Interactive Digital Wedding Invitations</p>

        {/* Instagram Follow */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/getshaadilink.in"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClickSound()}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-amber-500/20 hover:border-pink-400/30 transition-all duration-300 cursor-pointer active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-stone-400 group-hover:text-pink-400 transition-colors" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span className="text-[10px] font-marcellus font-bold tracking-wider uppercase text-stone-400 group-hover:text-white transition-colors">
              Follow us on Instagram
            </span>
          </a>
        </div>
        
        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-4 text-[9.5px] tracking-wider font-semibold uppercase text-stone-500 mt-6 font-marcellus select-none">
          <button onClick={() => { playClickSound(); setActivePolicyModal("pricing"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Pricing Details</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("terms"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Terms & Conditions</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("privacy"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setActivePolicyModal("refund"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Refund/Cancellation</button>
          <span>•</span>
          <button onClick={() => { playClickSound(); setContactOpen(true); setContactSuccessMsg(""); }} className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us</button>
        </div>

        <p className="text-[9px] text-stone-600 mt-8 tracking-widest uppercase font-semibold">
          © 2026 ShaadiLink · GetShaadilink.in · Made with ❤️ in Bengaluru 🇮🇳
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
                aria-label="Close policy modal"
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

      {/* Contact Support Modal */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#0F0B26] border border-white/10 rounded-[32px] p-6 sm:p-8 relative text-[#FAF6F0] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => { playClickSound(); setContactOpen(false); }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer font-bold text-xs"
                aria-label="Close contact modal"
              >
                ✕
              </button>

              <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3 mb-6">✉️ Contact Support</h3>
              
              {/* Contact Info Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-stone-300">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-marcellus">Support Email</span>
                  <a href="mailto:support@getshaadilink.in" className="block text-white font-semibold hover:underline">support@getshaadilink.in</a>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-marcellus">WhatsApp Helpline</span>
                  <a href="https://wa.me/917026201620" target="_blank" rel="noopener noreferrer" className="block text-white font-semibold hover:underline">+91 7026201620</a>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-marcellus">Operating Address</span>
                  <p className="text-white leading-relaxed font-cormorant font-bold">
                    S/O Mahantesh Mathad, Padki Puram, Savadatti, Belgaum, Karnataka - 591126
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                {contactSuccessMsg ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    {contactSuccessMsg}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="contact-name" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your Name"
                          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="contact-email" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your@email.com"
                          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="contact-subject" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="What do you need help with?"
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="contact-message" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Message</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Write your query here..."
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md select-none cursor-pointer disabled:opacity-50 active:scale-95 transition-all font-marcellus"
                    >
                      {contactSubmitting ? "Sending Query..." : "✉️ Send Message"}
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Review Submission Modal ─────────────────────────────── */}
      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0F0B26] border border-white/10 rounded-[32px] p-6 sm:p-8 relative text-[#FAF6F0] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { playClickSound(); setReviewOpen(false); }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer font-bold text-xs"
                aria-label="Close review modal"
              >
                ✕
              </button>

              <h3 className="font-marcellus text-2xl font-bold tracking-wider text-amber-400 border-b border-white/10 pb-3 mb-6">
                ✍️ Share Your Experience
              </h3>

              {reviewSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="text-5xl">🎊</div>
                  <p className="font-marcellus text-lg font-bold text-white">Thank You!</p>
                  <p className="text-xs text-stone-300/80 font-cormorant leading-relaxed max-w-xs mx-auto">
                    {reviewSuccess}
                  </p>
                  <button
                    onClick={() => { playClickSound(); setReviewOpen(false); setReviewSuccess(""); }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="review-name" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Your Name *</label>
                      <input
                        id="review-name"
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Priya & Arjun"
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="review-location" className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">City</label>
                      <input
                        id="review-location"
                        type="text"
                        value={reviewForm.location}
                        onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                        placeholder="e.g. Bengaluru"
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs"
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Your Rating *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => { playClickSound(); setReviewForm({ ...reviewForm, stars: star }); }}
                          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              star <= reviewForm.stars ? "fill-amber-400 text-amber-400" : "text-stone-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-amber-400 font-bold font-marcellus ml-2">
                        {reviewForm.stars}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                      Your Review * <span className="text-stone-600 normal-case">(min. 20 characters)</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      placeholder="Share your experience with ShaadiLink — what did you love most?"
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400/40 text-xs resize-none font-cormorant"
                    />
                    <p className="text-[9px] text-stone-600 text-right">{reviewForm.text.length} chars</p>
                  </div>

                  <p className="text-[9px] text-stone-500 font-cormorant">
                    Your review will appear publicly after admin approval. We do not share your contact information.
                  </p>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md select-none cursor-pointer disabled:opacity-50 active:scale-95 transition-all font-marcellus"
                  >
                    {reviewSubmitting ? "Submitting..." : "⭐ Submit Review"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
