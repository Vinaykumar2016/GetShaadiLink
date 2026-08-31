import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Calendar, MapPin, Heart, Image as ImageIcon, CheckCircle, 
  AlertCircle, Trash, Check, ChevronDown, ChevronUp, Lock, Users, 
  Palette, Gift, Ring, Wand2, ShieldCheck, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Invitation } from "../types";
import { playClickSound } from "../utils/soundUtils";

interface BuilderFormProps {
  onSuccess: (slug: string) => void;
  initialData?: Invitation | null;
  onCancelEdit?: () => void;
  preselectedTheme?: "elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland" | null;
}

export default function BuilderForm({ onSuccess, initialData, onCancelEdit, preselectedTheme }: BuilderFormProps) {
  // Wizard state control
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Accordion state for Step 1 sections (allows collapsing/expanding sections to keep UI compact)
  const [openSections, setOpenSections] = useState({
    couple: true,
    family: false,
    account: true,
    theme: false,
    shagun: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    playClickSound();
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Auto-scroll to top of form on step navigation
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }, [step]);

  // Field states
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [wdate, setWdate] = useState("");
  const [city, setCity] = useState("");
  const [vname, setVname] = useState("");
  const [vaddr, setVaddr] = useState("");
  const [lang, setLang] = useState("en");
  const [slug, setSlug] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [heroPhoto, setHeroPhoto] = useState<string>("");
  const [shagunOn, setShagunOn] = useState(false);
  const [upiId, setUpiId] = useState("");

  // New States for upgraded features
  const [editPassword, setEditPassword] = useState("");
  const [groomParents, setGroomParents] = useState("");
  const [brideParents, setBrideParents] = useState("");
  const [familyBlessings, setFamilyBlessings] = useState("");
  const [postWeddingPhotosUrl, setPostWeddingPhotosUrl] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [openingTheme, setOpeningTheme] = useState<"elephant" | "thread" | "diya" | "lotus" | "jaipur" | "garland">("elephant");
  const [religion, setReligion] = useState<"hindu" | "muslim" | "christian" | "sikh" | "other">("other");

  useEffect(() => {
    if (preselectedTheme) {
      setOpeningTheme(preselectedTheme);
    }
  }, [preselectedTheme]);

  // Timeline Event states
  const [e1n, setE1n] = useState("Haldi Ceremony");
  const [e1t, setE1t] = useState("");
  const [e2n, setE2n] = useState("Sangeet Night");
  const [e2t, setE2t] = useState("");
  const [e3n, setE3n] = useState("Wedding Ceremony");
  const [e3t, setE3t] = useState("");

  const [story, setStory] = useState("");

  // Populate from initialData when editing
  useEffect(() => {
    if (initialData) {
      setBride(initialData.bride || "");
      setGroom(initialData.groom || "");
      if (initialData.dateRaw) {
        setWdate(initialData.dateRaw);
      }
      setCity(initialData.city || "");
      setVname(initialData.vname || "");
      setVaddr(initialData.vaddr || "");
      setLang(initialData.lang || "en");
      setSlug(initialData.slug || "");
      setPhotos(initialData.photos || []);
      setHeroPhoto(initialData.heroPhoto || "");
      setShagunOn(!!initialData.shagunOn);
      setUpiId(initialData.upiId || "");
      setEditPassword(initialData.editPassword || "");
      setGroomParents(initialData.groomParents || "");
      setBrideParents(initialData.brideParents || "");
      setFamilyBlessings(initialData.familyBlessings || "");
      setPostWeddingPhotosUrl(initialData.postWeddingPhotosUrl || "");
      setStory(initialData.storyEnglish || "");
      setOwnerEmail(initialData.ownerEmail || "");
      setOpeningTheme(initialData.openingTheme || "elephant");
      setReligion(initialData.religion || "other");

      if (initialData.events && initialData.events[0]) {
        setE1n(initialData.events[0].name || "Haldi Ceremony");
        setE1t(initialData.events[0].time || "");
      }
      if (initialData.events && initialData.events[1]) {
        setE2n(initialData.events[1].name || "Sangeet Night");
        setE2t(initialData.events[1].time || "");
      }
      if (initialData.events && initialData.events[2]) {
        setE3n(initialData.events[2].name || "Wedding Ceremony");
        setE3t(initialData.events[2].time || "");
      }
    }
  }, [initialData]);

  // UI States
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugLoading, setSlugLoading] = useState(false);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [isHeroPhotoProcessing, setIsHeroPhotoProcessing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Query checking slug availability in real time
  useEffect(() => {
    if (!slug.trim()) {
      setSlugAvailable(null);
      return;
    }
    // If it's currently editing their active card, don't flag as taken
    if (initialData && slug.trim().toLowerCase() === initialData.slug.toLowerCase()) {
      setSlugAvailable(true);
      return;
    }

    const checkTimer = setTimeout(async () => {
      setSlugLoading(true);
      try {
        const res = await fetch(`/api/check-slug/${slug.trim().toLowerCase()}`);
        if (res.ok) {
          const data = await res.json();
          setSlugAvailable(data.available);
        }
      } catch (err) {
        console.error("Slug checking error", err);
      } finally {
        setSlugLoading(false);
      }
    }, 500);

    return () => clearTimeout(checkTimer);
  }, [slug, initialData]);

  // Optimize & Compress uploads in browser
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsPhotoProcessing(true);
    const newPhotos: string[] = [...photos];

    Array.from(files).forEach((file) => {
      if (newPhotos.length >= 8) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          newPhotos.push(compressedBase64);

          if (newPhotos.length === Math.min(photos.length + files.length, 8)) {
            setPhotos(newPhotos);
            setIsPhotoProcessing(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    playClickSound();
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsHeroPhotoProcessing(true);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        setHeroPhoto(compressedBase64);
        setIsHeroPhotoProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeHeroPhoto = () => {
    playClickSound();
    setHeroPhoto("");
  };

  const handleNextStep = () => {
    playClickSound();
    setErrorMessage("");

    if (step === 1) {
      if (!bride.trim() || !groom.trim() || !wdate.trim() || !city.trim() || !slug.trim()) {
        setErrorMessage("Please fill all required couple & venue details.");
        setOpenSections(prev => ({ ...prev, couple: true }));
        return;
      }
      if (slugAvailable === false) {
        setErrorMessage("This webpath slug name is already taken. Please choose another.");
        setOpenSections(prev => ({ ...prev, couple: true }));
        return;
      }
      if (!ownerEmail.trim() || !editPassword.trim()) {
        setErrorMessage("Owner email and edit passcode are required to protect your card.");
        setOpenSections(prev => ({ ...prev, account: true }));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!e1n.trim() || !e1t.trim() || !e2n.trim() || !e2t.trim() || !e3n.trim() || !e3t.trim()) {
        setErrorMessage("Please provide dates and timing parameters for all 3 events.");
        return;
      }
      setStep(3);
    }
  };

  const handleBackStep = () => {
    playClickSound();
    setErrorMessage("");
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleCompileWeddingInvitation = async () => {
    playClickSound();
    setErrorMessage("");

    if (!story.trim()) {
      setErrorMessage("Please share a short story of how you both met. AI will refine it!");
      return;
    }

    setIsCompiling(true);

    const executeSave = async (razorpayPaymentId?: string) => {
      const payload = {
        bride: bride.trim(),
        groom: groom.trim(),
        wdate: wdate.trim(),
        city: city.trim(),
        vname: vname.trim(),
        vaddr: vaddr.trim(),
        slug: slug.trim().toLowerCase(),
        lang,
        photos,
        shagunOn,
        upiId: shagunOn ? upiId.trim() : "",
        editPassword: editPassword.trim(),
        groomParents: groomParents.trim(),
        brideParents: brideParents.trim(),
        familyBlessings: familyBlessings.trim(),
        postWeddingPhotosUrl: postWeddingPhotosUrl.trim(),
        story: story.trim(),
        storyText: story.trim(),
        ownerEmail: ownerEmail.trim().toLowerCase(),
        openingTheme,
        religion,
        isEditMode: !!initialData,
        e1n: e1n.trim(),
        e1t: e1t.trim(),
        e2n: e2n.trim(),
        e2t: e2t.trim(),
        e3n: e3n.trim(),
        e3t: e3t.trim(),
        razorpayPaymentId: razorpayPaymentId || (initialData ? initialData.razorpayPaymentId : null),
        password: (initialData && initialData.editPassword) ? initialData.editPassword : editPassword.trim(),
        agency: localStorage.getItem("agency_ref") || null,
        heroPhoto: heroPhoto || null,
      };

      const endpoint = initialData ? `/api/invitations/${initialData.slug}/update` : "/api/invitations/generate";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Non-JSON response received:", jsonErr);
        throw new Error("Unable to parse server response. Please check server logs.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to process wedding invitation.");
      }

      try {
        localStorage.setItem("shaadi_auth_" + payload.slug, payload.editPassword);
      } catch (e) {
        console.warn("Failed to save passcode to localStorage:", e);
      }

      try {
        if ((window as any).fbq) {
          (window as any).fbq("track", "Lead", { content_name: payload.slug, currency: "INR", value: 999 });
        }
      } catch (fbErr) {
        console.warn("Meta Pixel tracking notice:", fbErr);
      }

      onSuccess(payload.slug);
    };

    try {
      await executeSave();
      setIsCompiling(false);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setIsCompiling(false);
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* Dynamic AI loader overlay spinner */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#060414]/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-amber-400/20 border-t-amber-400 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </motion.div>

            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-marcellus text-2xl font-bold text-white tracking-wide mb-2 text-center"
            >
              Crafting Your Digital Wedding Website...
            </motion.h3>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold tracking-widest text-amber-400 uppercase font-marcellus mb-2 text-center"
            >
              Enhancing narrative &amp; compiling interactive themes
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main interactive creation panel card form: 7 columns */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-[28px] overflow-hidden shadow-2xl">
          {/* Top header branding display */}
          <div ref={formTopRef} className="p-6 sm:p-8 bg-gradient-to-r from-[#701E06] via-[#8B2608] to-[#5C1603] text-white relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 font-marcellus text-[9.5px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                ✦ INDIA'S #1 DIGITAL SHAADI CARD
              </span>
            </div>
            <h2 className="font-marcellus font-bold text-2xl sm:text-3xl text-amber-300">
              {initialData ? "Edit Your Wedding Invitation" : "Design Your Free Wedding Invitation"}
            </h2>
            <p className="text-xs text-stone-200/90 mt-1.5 leading-relaxed font-sans">
              Enter your wedding details, choose custom themes, and preview your live website in seconds.
            </p>
          </div>

          {/* Stepper progressive indicator lines */}
          <div className="flex px-6 sm:px-8 py-4 justify-between items-center bg-stone-100/80 border-b border-stone-200 select-none">
            <button 
              type="button"
              onClick={() => { playClickSound(); setStep(1); }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 1 ? "bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/30" : "bg-emerald-600 text-white"
              }`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <span className={`text-[11px] font-marcellus tracking-wider uppercase font-bold hidden sm:inline ${step === 1 ? "text-stone-900" : "text-stone-500"}`}>
                Basic Details
              </span>
            </button>

            <div className={`flex-1 h-[2px] mx-3 transition-colors ${step > 1 ? "bg-emerald-500" : "bg-stone-300"}`} />

            <button 
              type="button"
              onClick={() => { playClickSound(); if(step > 1) setStep(2); }}
              className={`flex items-center gap-2 cursor-pointer group ${step < 2 ? "pointer-events-none" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 2 ? "bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/30" : step > 2 ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-500 border border-stone-300"
              }`}>
                {step > 2 ? "✓" : "2"}
              </div>
              <span className={`text-[11px] font-marcellus tracking-wider uppercase font-bold hidden sm:inline ${step === 2 ? "text-stone-900" : "text-stone-500"}`}>
                Timeline
              </span>
            </button>

            <div className={`flex-1 h-[2px] mx-3 transition-colors ${step > 2 ? "bg-emerald-500" : "bg-stone-300"}`} />

            <button 
              type="button"
              onClick={() => { playClickSound(); if(step === 3) setStep(3); }}
              className={`flex items-center gap-2 cursor-pointer group ${step < 3 ? "pointer-events-none" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 3 ? "bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/30" : "bg-stone-200 text-stone-500 border border-stone-300"
              }`}>
                3
              </div>
              <span className={`text-[11px] font-marcellus tracking-wider uppercase font-bold hidden sm:inline ${step === 3 ? "text-stone-900" : "text-stone-500"}`}>
                Love Story
              </span>
            </button>
          </div>

          <div className="p-6 sm:p-8 bg-[#FCFAF7]">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* STAGE 1: INVITATION METADATA (ACCORDION CARDS FOR STREAMLINED COMPACT UI) */}
              {step === 1 && (
                <div className="space-y-5">
                  
                  {/* ACCORDION BLOCK 1: COUPLE & VENUE BASICS */}
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300">
                    <button
                      type="button"
                      onClick={() => toggleSection("couple")}
                      className="w-full p-4 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between transition-colors text-left cursor-pointer border-b border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center font-bold text-sm">
                          💍
                        </div>
                        <div>
                          <h3 className="font-marcellus font-bold text-sm text-stone-900 tracking-wide uppercase">
                            Couple &amp; Venue Details <span className="text-amber-600 text-xs font-sans font-normal ml-1">*Required</span>
                          </h3>
                          <p className="text-[11px] text-stone-500">Names, wedding date, city, custom webpath &amp; venue location</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bride && groom && wdate && city && slug ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-marcellus">✓ Ready</span>
                        ) : null}
                        {openSections.couple ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                      </div>
                    </button>

                    {openSections.couple && (
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="bride-first-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Bride's First Name *
                            </label>
                            <input
                              id="bride-first-name"
                              type="text"
                              required
                              value={bride}
                              onChange={(e) => setBride(e.target.value)}
                              placeholder="e.g., Priya"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="groom-first-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Groom's First Name *
                            </label>
                            <input
                              id="groom-first-name"
                              type="text"
                              required
                              value={groom}
                              onChange={(e) => setGroom(e.target.value)}
                              placeholder="e.g., Arjun"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="wedding-date" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Wedding Date *
                            </label>
                            <div className="relative">
                              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                              <input
                                id="wedding-date"
                                type="date"
                                required
                                value={wdate}
                                onChange={(e) => setWdate(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="wedding-city" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Wedding City *
                            </label>
                            <input
                              id="wedding-city"
                              type="text"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g., Bengaluru or Jodhpur"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                        </div>

                        {/* CUSTOM PRETTY SUBDOMAIN-LIKE URL COMPONENT */}
                        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <label htmlFor="link-slug" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                            Custom Webpath Link *
                          </label>
                          <div className="flex flex-wrap sm:flex-nowrap items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15">
                            <span className="px-3.5 py-3 text-stone-500 bg-stone-100 border-r border-stone-200 select-none font-mono text-xs font-bold shrink-0">
                              getshaadilink.in/
                            </span>
                            <input
                              id="link-slug"
                              type="text"
                              required
                              value={slug}
                              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                              placeholder="priya-arjun"
                              className="flex-1 min-w-[120px] px-3.5 py-3 bg-transparent text-stone-900 outline-none font-mono text-xs font-semibold"
                            />
                            <div className="px-3 shrink-0">
                              {slugLoading ? (
                                <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-600 animate-spin rounded-full" />
                              ) : slugAvailable === true ? (
                                <span className="text-emerald-700 text-[10px] font-bold uppercase font-marcellus bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Available</span>
                              ) : slugAvailable === false ? (
                                <span className="text-rose-700 text-[10px] font-bold uppercase font-marcellus bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Taken</span>
                              ) : null}
                            </div>
                          </div>
                          <p className="text-[10px] text-stone-500">Guests will open your live invitation at this custom shareable URL.</p>
                        </div>

                        {/* VENUE COMPONENT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="venue-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Hall / Venue Name
                            </label>
                            <input
                              id="venue-name"
                              type="text"
                              value={vname}
                              onChange={(e) => setVname(e.target.value)}
                              placeholder="e.g., Royal Palace Convention Hall"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="venue-address" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Google Maps Full Address
                            </label>
                            <div className="relative">
                              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                              <input
                                id="venue-address"
                                type="text"
                                value={vaddr}
                                onChange={(e) => setVaddr(e.target.value)}
                                placeholder="Full address for map navigation"
                                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACCORDION BLOCK 2: FAMILY DETAILS & RELIGION / SCRIPT */}
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300">
                    <button
                      type="button"
                      onClick={() => toggleSection("family")}
                      className="w-full p-4 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between transition-colors text-left cursor-pointer border-b border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 flex items-center justify-center font-bold text-sm">
                          👨‍👩‍👧
                        </div>
                        <div>
                          <h3 className="font-marcellus font-bold text-sm text-stone-900 tracking-wide uppercase">
                            Family Details &amp; Language Script
                          </h3>
                          <p className="text-[11px] text-stone-500">Parents' names, greetings, religion style &amp; script language</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {openSections.family ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                      </div>
                    </button>

                    {openSections.family && (
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="bride-parents" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Bride's Parents &amp; Family
                            </label>
                            <input
                              id="bride-parents"
                              type="text"
                              value={brideParents}
                              onChange={(e) => setBrideParents(e.target.value)}
                              placeholder="e.g., Smt. Shaila & Sri. Shivakumar"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="groom-parents" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Groom's Parents &amp; Family
                            </label>
                            <input
                              id="groom-parents"
                              type="text"
                              value={groomParents}
                              onChange={(e) => setGroomParents(e.target.value)}
                              placeholder="e.g., Smt. Pushpa & Sri. Rajashekar"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="family-blessings" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                            Welcoming Families &amp; Greetings Header
                          </label>
                          <input
                            id="family-blessings"
                            type="text"
                            value={familyBlessings}
                            onChange={(e) => setFamilyBlessings(e.target.value)}
                            placeholder="e.g., With the blessings of our elders and divine grace"
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                          />
                        </div>

                        {/* RELIGION SELECTOR */}
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <label className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold block">
                            Religion / Tradition Style
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { code: "hindu", label: "Hindu" },
                              { code: "muslim", label: "Muslim" },
                              { code: "christian", label: "Christian" },
                              { code: "sikh", label: "Sikh" },
                              { code: "other", label: "General" },
                            ].map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => { playClickSound(); setReligion(item.code as any); }}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  religion === item.code
                                    ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm"
                                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SCRIPT / LANGUAGE SELECTOR */}
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <label className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold block">
                            Invitation Script / Regional Language
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                                onClick={() => { playClickSound(); setLang(item.code); }}
                                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  lang === item.code
                                    ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm"
                                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACCORDION BLOCK 3: ACCOUNT ACCESS & SECURITY */}
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300">
                    <button
                      type="button"
                      onClick={() => toggleSection("account")}
                      className="w-full p-4 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between transition-colors text-left cursor-pointer border-b border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          🔒
                        </div>
                        <div>
                          <h3 className="font-marcellus font-bold text-sm text-stone-900 tracking-wide uppercase">
                            Account Access &amp; Passcode <span className="text-amber-600 text-xs font-sans font-normal ml-1">*Required</span>
                          </h3>
                          <p className="text-[11px] text-stone-500">Email &amp; edit passcode to unlock &amp; edit your card later</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ownerEmail && editPassword ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-marcellus">✓ Ready</span>
                        ) : null}
                        {openSections.account ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                      </div>
                    </button>

                    {openSections.account && (
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="owner-email" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Owner Email Address *
                            </label>
                            <input
                              id="owner-email"
                              type="email"
                              required
                              value={ownerEmail}
                              onChange={(e) => setOwnerEmail(e.target.value)}
                              placeholder="couple@example.com"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs font-mono placeholder:text-stone-400"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-passcode" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Secret Edit Passcode *
                            </label>
                            <input
                              id="edit-passcode"
                              type="text"
                              required
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              placeholder="e.g. 2026 or secret7"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs font-mono placeholder:text-stone-400"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="drive-link" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                            Wedding Photo Album Link (Optional)
                          </label>
                          <input
                            id="drive-link"
                            type="text"
                            value={postWeddingPhotosUrl}
                            onChange={(e) => setPostWeddingPhotosUrl(e.target.value)}
                            placeholder="Google Drive, Photos or Dropbox link"
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs placeholder:text-stone-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACCORDION BLOCK 4: COVER THEME & PHOTOS */}
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300">
                    <button
                      type="button"
                      onClick={() => toggleSection("theme")}
                      className="w-full p-4 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between transition-colors text-left cursor-pointer border-b border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 flex items-center justify-center font-bold text-sm">
                          🎨
                        </div>
                        <div>
                          <h3 className="font-marcellus font-bold text-sm text-stone-900 tracking-wide uppercase">
                            Cover Theme &amp; Photos
                          </h3>
                          <p className="text-[11px] text-stone-500">Opening cover animation, hero cover picture &amp; gallery photos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {openSections.theme ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                      </div>
                    </button>

                    {openSections.theme && (
                      <div className="p-5 space-y-4">
                        {/* CHOOSE OPENING CEREMONY INTERACTIVE STYLE */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold block">
                            Select Interactive Cover Template
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { code: "elephant", label: "🐘 Royal Elephant" },
                              { code: "thread", label: "🧵 Sacred Knot" },
                              { code: "diya", label: "🪔 Midnight Diya" },
                              { code: "lotus", label: "🪷 Temple Lotus" },
                              { code: "jaipur", label: "🏰 Royal Palace" },
                              { code: "garland", label: "🌸 Marigold Garland" },
                            ].map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => { playClickSound(); setOpeningTheme(item.code as any); }}
                                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  openingTheme === item.code
                                    ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-sm"
                                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* HERO COVER PHOTO UPLOADER */}
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <label className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold block">
                            Hero Cover Photo (Recommended)
                          </label>
                          <div className="relative border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-5 text-center bg-stone-50 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroPhotoUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <ImageIcon className="w-6 h-6 text-amber-600" />
                              <p className="text-xs font-bold text-stone-800">Upload Hero Cover Picture</p>
                              <p className="text-[10px] text-stone-500">Main background photo for your invitation cover</p>
                            </div>
                          </div>

                          {isHeroPhotoProcessing && (
                            <div className="text-center text-xs text-amber-700 flex items-center justify-center gap-2 font-medium">
                              <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-600 animate-spin rounded-full" />
                              <span>Processing cover picture...</span>
                            </div>
                          )}

                          {heroPhoto && (
                            <div className="flex items-center gap-3 pt-1">
                              <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-stone-300 shadow-sm">
                                <img src={heroPhoto} alt="Hero Cover Thumbnail" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={removeHeroPhoto}
                                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-rose-600 text-white hover:bg-rose-500 shadow"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs text-emerald-700 font-bold font-marcellus">✓ Hero Cover Loaded</span>
                            </div>
                          )}
                        </div>

                        {/* GALLERY PHOTOS UPLOADER */}
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <label className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold block">
                            Photo Gallery (Up to 8 photos)
                          </label>
                          <div className="relative border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-5 text-center bg-stone-50 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                              disabled={photos.length >= 8}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <ImageIcon className="w-6 h-6 text-amber-600" />
                              <p className="text-xs font-bold text-stone-800">Tap to upload couple pictures</p>
                              <p className="text-[10px] text-stone-500">Auto-compressed on device · Max 8 photos</p>
                            </div>
                          </div>

                          {isPhotoProcessing && (
                            <div className="text-center text-xs text-amber-700 flex items-center justify-center gap-2 font-medium">
                              <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-600 animate-spin rounded-full" />
                              <span>Compressing gallery pictures...</span>
                            </div>
                          )}

                          {photos.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {photos.map((ph, idx) => (
                                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-300 shadow-sm">
                                  <img src={ph} alt="Gallery Thumbnail" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(idx)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-rose-600 text-white hover:bg-rose-500 shadow"
                                    title="Delete picture"
                                  >
                                    <Trash className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACCORDION BLOCK 5: DIGITAL SHAGUN UPI */}
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300">
                    <button
                      type="button"
                      onClick={() => toggleSection("shagun")}
                      className="w-full p-4 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between transition-colors text-left cursor-pointer border-b border-stone-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          🎁
                        </div>
                        <div>
                          <h3 className="font-marcellus font-bold text-sm text-stone-900 tracking-wide uppercase">
                            Digital Shagun UPI Gift System
                          </h3>
                          <p className="text-[11px] text-stone-500">Allow guests to send monetary blessings directly via UPI QR code</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {shagunOn && upiId ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-marcellus">✓ Enabled</span>
                        ) : null}
                        {openSections.shagun ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                      </div>
                    </button>

                    {openSections.shagun && (
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                          <div>
                            <span className="text-xs font-bold text-stone-900 font-marcellus uppercase">Enable Digital Shagun QR System</span>
                            <p className="text-[10px] text-stone-600">Generates instant UPI payment QR code for guests</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShagunOn(!shagunOn)}
                            className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                              shagunOn ? "bg-emerald-600" : "bg-stone-300"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${
                              shagunOn ? "translate-x-6" : "translate-x-0"
                            }`} />
                          </button>
                        </div>

                        {shagunOn && (
                          <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
                            <label htmlFor="upi-id" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                              Your Personal UPI ID *
                            </label>
                            <input
                              id="upi-id"
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g., 9876543210@paytm or couple@upi"
                              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-medium outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-xs font-mono placeholder:text-stone-400"
                            />
                            <p className="text-[10px] text-stone-500">100% direct bank transfer — no commission or middleman.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>


                  {/* STEP 1 NEXT BUTTON */}
                  <div className="pt-4 border-t border-stone-200 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-semibold">{errorMessage}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-bold text-xs tracking-wider uppercase text-stone-950 shadow-lg active:scale-98 transition-transform cursor-pointer font-marcellus"
                    >
                      <span>Continue: Celebration Timeline</span>
                      <Sparkles className="w-4 h-4 text-stone-950" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: CELEBRATION TIMELINE EVENTS PANEL */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <h4 className="font-marcellus font-bold text-base text-stone-900 mb-1">
                      Event Timeline &amp; Functions
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      Specify respective ceremony titles, dates, and exact timings for your wedding events.
                    </p>
                  </div>

                  {/* EVENT 1 */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-15 select-none">💛</div>
                    <span className="text-[10px] font-marcellus tracking-widest text-amber-700 uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      Function 1
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event1-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Event 1 Name *
                        </label>
                        <input
                          id="event1-name"
                          type="text"
                          required
                          value={e1n}
                          onChange={(e) => setE1n(e.target.value)}
                          placeholder="e.g., Haldi Ceremony"
                          className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs font-semibold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event1-time" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Date &amp; Timing *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                          <input
                            id="event1-time"
                            type="datetime-local"
                            required
                            value={e1t}
                            onChange={(e) => setE1t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EVENT 2 */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-15 select-none">💃</div>
                    <span className="text-[10px] font-marcellus tracking-widest text-amber-700 uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      Function 2
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event2-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Event 2 Name *
                        </label>
                        <input
                          id="event2-name"
                          type="text"
                          required
                          value={e2n}
                          onChange={(e) => setE2n(e.target.value)}
                          placeholder="e.g., Sangeet Night"
                          className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs font-semibold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event2-time" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Date &amp; Timing *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                          <input
                            id="event2-time"
                            type="datetime-local"
                            required
                            value={e2t}
                            onChange={(e) => setE2t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EVENT 3 */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-15 select-none">🌸</div>
                    <span className="text-[10px] font-marcellus tracking-widest text-amber-700 uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      Function 3
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event3-name" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Event 3 Name *
                        </label>
                        <input
                          id="event3-name"
                          type="text"
                          required
                          value={e3n}
                          onChange={(e) => setE3n(e.target.value)}
                          placeholder="e.g., Wedding Ceremony"
                          className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs font-semibold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event3-time" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                          Date &amp; Timing *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                          <input
                            id="event3-time"
                            type="datetime-local"
                            required
                            value={e3t}
                            onChange={(e) => setE3t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none text-xs focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-semibold">{errorMessage}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="px-6 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer font-marcellus"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-bold text-xs tracking-wider uppercase text-stone-950 shadow-lg cursor-pointer active:scale-98 transition-transform font-marcellus"
                      >
                        <span>Continue: Love Story</span>
                        <Sparkles className="w-4 h-4 text-stone-950" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: LOVE STORY AND DIRECT LIVE GENERATE */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="how-we-met" className="text-[11px] font-marcellus tracking-wider text-stone-800 uppercase font-bold">
                      How did you meet? (Your Love Story) *
                    </label>
                    <textarea
                      id="how-we-met"
                      required
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Write briefly in your own words — where you first met, what made you click, or when you decided to spend your lives together. AI will polish it into a beautiful narrative!"
                      className="w-full h-36 px-4 py-3.5 bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all resize-none text-xs leading-relaxed placeholder:text-stone-400 font-sans"
                    />
                    <p className="text-[10px] text-stone-500 text-right">{story.length} characters</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-marcellus text-xs font-bold tracking-wider text-stone-900 uppercase mb-1">
                        AI Narrative Polish &amp; Translation
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        Google Gemini AI will polish your story grammar, translate it to your chosen script ({lang.toUpperCase()}), and structure a dual-language emotional narrative for your card.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-semibold">{errorMessage}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="px-6 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer font-marcellus"
                      >
                        Back
                      </button>
                      {onCancelEdit && (
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="px-6 py-3 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer font-marcellus"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCompileWeddingInvitation}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 font-bold text-xs tracking-wider uppercase text-stone-950 shadow-xl cursor-pointer active:scale-98 transition-transform font-marcellus"
                      >
                        <span>{initialData ? "✦ Save & Update Website" : "✦ Compile & Preview Website"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Real-Time Live Preview Simulator Frame: 5 columns */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <div className="text-center mb-3 select-none">
            <span className="font-marcellus text-[10px] tracking-widest text-amber-400/80 uppercase font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              ⚡ LIVE PREVIEW SIMULATOR
            </span>
          </div>

          <div className="relative w-full max-w-[310px] aspect-[9/18.5] rounded-[36px] border-8 border-stone-850 bg-[#FAF6F0] shadow-2xl p-4 overflow-hidden flex flex-col justify-between">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-850 rounded-b-2xl z-20" />

            {/* Simulated preview screen visuals */}
            <div className="relative z-10 text-center mt-12">
              <span className="text-2xl opacity-40 select-none animate-pulse block">🌸</span>
              <h4 className="font-display italic text-2xl font-bold tracking-tight text-brand-rust mt-2">
                {bride || "Tanya"}
              </h4>
              <p className="text-brand-gold text-sm italic my-1">&amp;</p>
              <h4 className="font-display italic text-2xl font-bold tracking-tight text-brand-rust">
                {groom || "Rohan"}
              </h4>

              <div className="h-[1px] w-12 bg-brand-rust/10 mx-auto my-4" />

              <p className="text-[9.5px] tracking-widest font-marcellus text-brand-rust/60 font-bold">
                {wdate ? new Date(wdate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }).toUpperCase() : "DECEMBER 11, 2026"}
              </p>
              <p className="text-[8px] tracking-[3px] text-brand-rust/50 mt-1 uppercase font-bold">
                {city || "BENGALURU"}
              </p>
            </div>

            {/* Bottom event nodes summary mock */}
            <div className="relative z-10 bg-white border border-brand-rust/10 rounded-2xl p-3 mb-4 text-center shadow-sm">
              <p className="text-[8px] tracking-widest font-marcellus text-amber-700 uppercase mb-1 font-bold">Timeline events preview</p>
              <div className="flex justify-around text-[9px] text-brand-rust/70 gap-1 mt-1.5 font-sans font-semibold">
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/10">{e1n.split(' ')[0] || "Haldi"}</span>
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/10">{e2n.split(' ')[0] || "Sangeet"}</span>
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/10">{e3n.split(' ')[0] || "Wedding"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
