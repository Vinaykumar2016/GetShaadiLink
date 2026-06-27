import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, MapPin, Heart, Image as ImageIcon, CheckCircle, AlertCircle, Trash, Copy, Check, ExternalLink } from "lucide-react";
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

  // Optimize & Compress uploads in browser to prevent large payloads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    playClickSound();

    const fileList = Array.from(files);
    if (photos.length + fileList.length > 8) {
      alert("Maximum of 8 photos allowed.");
      return;
    }

    setIsPhotoProcessing(true);
    let processedCount = 0;
    const incomingPhotos: string[] = [];

    fileList.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Scale images downwards to avoid payload limits
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Get lower compression base64 string
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          incomingPhotos.push(compressedBase64);
          processedCount++;

          if (processedCount === fileList.length) {
            setPhotos((prev) => [...prev, ...incomingPhotos]);
            setIsPhotoProcessing(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    playClickSound();
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNextStep = () => {
    playClickSound();
    setErrorMessage("");

    if (step === 1) {
      if (!bride.trim() || !groom.trim() || !wdate.trim() || !city.trim() || !slug.trim()) {
        setErrorMessage("Please fill all required couple details.");
        return;
      }
      if (slugAvailable === false) {
        setErrorMessage("This webpath slug name is already taken. Please choose another.");
        return;
      }
      if (!ownerEmail.trim() || !editPassword.trim()) {
        setErrorMessage("Owner email and edit password are required.");
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
        throw new Error("Unable to parse server response. If you just hosted this application, please ensure that the backend Node/Express server is active and running on port 3000 (not just static Vite files) and is reachable.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to process wedding invitation.");
      }

      try {
        localStorage.setItem("shaadi_auth_" + payload.slug, payload.editPassword);
      } catch (e) {
        console.warn("Failed to save passcode to localStorage:", e);
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
            className="fixed inset-0 z-[1000] bg-[#FAF6F0]/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-4 border-brand-rust/20 border-t-brand-rust rounded-full mb-6"
            />
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display italic text-3xl font-bold text-brand-rust mb-2"
            >
              Composing Your Masterpiece
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs font-bold tracking-widest text-brand-gold uppercase font-cinzel mb-8"
            >
              Structuring your bespoke love story narrative...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main interactive creation panel card form: 7 columns */}
        <div className="lg:col-span-7 bg-white border border-brand-rust/10 rounded-[32px] overflow-hidden shadow-paper">
          {/* Top header branding display */}
          <div className="p-6 sm:p-8 bg-[#FAF6F0] border-b border-brand-rust/10 relative">
            <span className="font-cinzel text-[10px] font-bold tracking-widest text-brand-gold mb-2 block uppercase">
              ✦ INDIAS #1 DIGITAL SHAADI CARD
            </span>
            <h2 className="font-display italic font-bold text-3xl text-brand-rust">
              Create Your Invitation
            </h2>
            <p className="text-xs text-brand-rust/60 mt-2 leading-relaxed">
              Fill details, upload custom visuals, and create a beautiful custom animated website for ₹999 one-time.
            </p>

            <span className="absolute top-6 right-6 font-cinzel font-bold text-sm text-brand-rust bg-brand-rust/5 border border-brand-rust/10 px-4 py-1.5 rounded-full select-none">
              ₹999
            </span>
          </div>

          {/* Stepper progressive indicator lines */}
          <div className="flex px-6 sm:px-8 pt-6 justify-between items-center bg-[#FAF6F0]/20">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                step === 1 ? "bg-brand-rust text-white shadow-sm" : "bg-emerald-600 text-white"
              }`}>
                1
              </div>
              <span className={`text-[10px] font-cinzel tracking-wider uppercase font-semibold hidden sm:inline ${step === 1 ? "text-brand-rust" : "text-brand-rust/50"}`}>Couple Details</span>
            </div>

            <div className={`flex-1 h-[1px] mx-2 ${step > 1 ? "bg-emerald-600" : "bg-brand-rust/10"}`} />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                step === 2 ? "bg-brand-rust text-white shadow-sm" : step > 2 ? "bg-emerald-600 text-white" : "bg-brand-rust/5 text-brand-rust/40 border border-brand-rust/10"
              }`}>
                2
              </div>
              <span className={`text-[10px] font-cinzel tracking-wider uppercase font-semibold hidden sm:inline ${step === 2 ? "text-brand-rust" : "text-brand-rust/40"}`}>Timeline</span>
            </div>

            <div className={`flex-1 h-[1px] mx-2 ${step > 2 ? "bg-emerald-600" : "bg-brand-rust/10"}`} />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                step === 3 ? "bg-brand-rust text-white shadow-sm" : "bg-brand-rust/5 text-brand-rust/40 border border-brand-rust/10"
              }`}>
                3
              </div>
              <span className={`text-[10px] font-cinzel tracking-wider uppercase font-semibold hidden sm:inline ${step === 3 ? "text-brand-rust" : "text-brand-rust/40"}`}>Love Story</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* STAGE 1: INVITATION METADATA (COUPLE COMPONENT MODULE) */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="bride-first-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Bride's First Name</label>
                      <input
                        id="bride-first-name"
                        type="text"
                        value={bride}
                        onChange={(e) => setBride(e.target.value)}
                        placeholder="e.g., Priya"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="groom-first-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Groom's First Name</label>
                      <input
                        id="groom-first-name"
                        type="text"
                        value={groom}
                        onChange={(e) => setGroom(e.target.value)}
                        placeholder="e.g., Arjun"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="wedding-date" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Wedding Date</label>
                      <div className="relative">
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-rust/35 pointer-events-none" />
                        <input
                          id="wedding-date"
                          type="date"
                          value={wdate}
                          onChange={(e) => setWdate(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs picker-white"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="wedding-city" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Wedding City</label>
                      <input
                        id="wedding-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Jodhpur"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* CUSTOM PRETTY SUBDOMAIN-LIKE URL COMPONENT */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-brand-rust/5 border border-brand-rust/10">
                    <label htmlFor="link-slug" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Custom Link Webpath</label>
                    <div className="flex items-center bg-white border border-brand-rust/10 rounded-xl overflow-hidden focus-within:border-brand-rust/50 text-sm">
                      <span className="px-4 py-3 text-brand-rust/40 bg-brand-rust/5 border-r border-brand-rust/5 select-none font-mono text-xs font-semibold">
                        getshaadilink.in/
                      </span>
                      <input
                        id="link-slug"
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="priya-arjun"
                        className="flex-1 px-4 py-3 bg-transparent text-brand-rust outline-none font-mono text-xs"
                      />
                      <div className="px-3">
                        {slugLoading ? (
                          <div className="w-4 h-4 border-2 border-brand-rust/20 border-t-brand-rust animate-spin rounded-full" />
                        ) : slugAvailable === true ? (
                          <span className="text-emerald-700 text-[10px] font-bold uppercase font-cinzel">Available</span>
                        ) : slugAvailable === false ? (
                          <span className="text-red-700 text-[10px] font-bold uppercase font-cinzel">Taken</span>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-[9.5px] text-brand-rust/40">Guests can visit your invitation straight via this unique web path.</p>
                  </div>

                  {/* VENUE COMPONENT */}
                  <div className="space-y-4 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-3 uppercase font-bold">Venue details</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="venue-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Hall / Venue Name</label>
                      <input
                        id="venue-name"
                        type="text"
                        value={vname}
                        onChange={(e) => setVname(e.target.value)}
                        placeholder="e.g., Umaid Bhawan Palace"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="venue-address" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Full Address for Google Maps</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-rust/35 pointer-events-none" />
                        <input
                          id="venue-address"
                          type="text"
                          value={vaddr}
                          onChange={(e) => setVaddr(e.target.value)}
                          placeholder="e.g., Circuit House Rd, Cantt Area, Jodhpur, Rajasthan 342006"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TRADITIONAL LAGNA PATRIKA DETAILS */}
                  <div className="space-y-4 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block uppercase font-bold">Family Details & Greetings</span>
                      </div>
                      <p className="text-[10px] text-brand-rust/45 mt-1">Feature family names respectfully on the invitation card layout.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="bride-parents" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Bride's Parents & Family</label>
                        <input
                          id="bride-parents"
                          type="text"
                          value={brideParents}
                          onChange={(e) => setBrideParents(e.target.value)}
                          placeholder="e.g., Smt. Shaila & Sri. Shivakumar Sharma"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="groom-parents" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Groom's Parents & Family</label>
                        <input
                          id="groom-parents"
                          type="text"
                          value={groomParents}
                          onChange={(e) => setGroomParents(e.target.value)}
                          placeholder="e.g., Smt. Pushpa & Sri. Rajashekar Kapoor"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="family-blessings" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Welcoming Families & Greetings</label>
                      <input
                        id="family-blessings"
                        type="text"
                        value={familyBlessings}
                        onChange={(e) => setFamilyBlessings(e.target.value)}
                        placeholder="e.g., With the blessings of the divine and the love of our families"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* RELIGION SELECTOR */}
                  <div className="space-y-3 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-1 uppercase font-bold">Religion / Wedding Style</span>
                    </div>
                    <p className="text-[10.5px] text-brand-rust/60 mb-3">Adjusts terminology throughout the invitation cards automatically (e.g. Lagna Patrika for Hindu, Nikah Nama for Muslim, etc.).</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { code: "hindu", label: "Hindu" },
                        { code: "muslim", label: "Muslim" },
                        { code: "christian", label: "Christian" },
                        { code: "sikh", label: "Sikh" },
                        { code: "other", label: "Other / General" },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setReligion(item.code as any)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                            religion === item.code
                              ? "bg-brand-rust/10 border-brand-rust text-brand-rust font-bold"
                              : "bg-white border-brand-rust/15 text-brand-rust/60"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COMPREHENSIVE LANGUAGE COMPONENT SELECTOR */}
                  <div className="space-y-3 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-1 uppercase font-bold">Invitation Script/Language</span>
                    </div>
                    <p className="text-[10.5px] text-brand-rust/60 mb-3">Narrations and timeline events will render in English + selected script!</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { code: "en", label: "🇬🇧 English" },
                        { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
                        { code: "hi", label: "हिंदी (Hindi)" },
                        { code: "ta", label: "தமிழ் (Tamil)" },
                        { code: "te", label: "ತೆಲುಗು (Telugu)" },
                        { code: "ml", label: "മലയാളം (Malayalam)" },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setLang(item.code)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                            lang === item.code
                              ? "bg-brand-rust/10 border-brand-rust text-brand-rust font-bold"
                              : "bg-white border-brand-rust/15 text-brand-rust/60"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECURE PASSCODE & EMAIL CONFIG */}
                  <div className="space-y-4 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-1 uppercase font-bold">Account Security & Access</span>
                      <p className="text-[9.5px] text-brand-rust/45 mb-3">Provide credentials to access your dashboard to check views or make updates later.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="owner-email" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Owner Email Address</label>
                        <input
                          id="owner-email"
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="couple@example.com"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-passcode" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Secret Edit Passcode</label>
                        <input
                          id="edit-passcode"
                          type="text"
                          required
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="e.g., 2026 or secret7"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="drive-link" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Wedding Drive Link (Optional)</label>
                      <input
                        id="drive-link"
                        type="text"
                        value={postWeddingPhotosUrl}
                        onChange={(e) => setPostWeddingPhotosUrl(e.target.value)}
                        placeholder="Google Drive, Photos or Dropbox link"
                        className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* CHOOSE OPENING CEREMONY INTERACTIVE STYLE */}
                  <div className="space-y-3 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-1 uppercase font-bold">Select Template Cover Animation</span>
                    </div>
                    <p className="text-[10px] text-brand-rust/50 mb-3">Choose the interactive screen guests see first.</p>
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
                          className={`px-3 py-2.5 rounded-xl text-[10.5px] font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                            openingTheme === item.code
                              ? "bg-brand-rust/10 border-brand-rust text-brand-rust font-bold"
                              : "bg-white border-brand-rust/15 text-brand-rust/60"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MULTIIMAGE PHOTO UPLOADER */}
                  <div className="space-y-4 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4">
                      <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block mb-3 uppercase font-bold">Gallery Photos (Optional)</span>
                    </div>
                    <div className="relative border-2 border-dashed border-brand-rust/15 hover:border-brand-rust/35 rounded-2xl p-6 text-center bg-brand-rust/5 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        disabled={photos.length >= 8}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-rust/10">
                          <ImageIcon className="w-5 h-5 text-brand-rust" />
                        </div>
                        <p className="text-sm font-semibold text-brand-rust">Tap to upload couple photos</p>
                        <p className="text-[10px] text-brand-rust/40">Select up to 8 images · Max 5MB each (auto-compressed on device)</p>
                      </div>
                    </div>

                    {isPhotoProcessing && (
                      <div className="text-center text-xs text-brand-rust flex items-center justify-center gap-2 font-medium">
                        <div className="w-4 h-4 border-2 border-brand-rust/20 border-t-brand-rust animate-spin rounded-full" />
                        <span>Scaling and optimizing pictures...</span>
                      </div>
                    )}

                    {photos.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {photos.map((ph, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-rust/10">
                            <img src={ph} alt="Upload Thumbnail" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-500 transition-colors shadow"
                              title="Delete picture"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DIGITAL SHAGUN UPI COMPONENT */}
                  <div className="space-y-4 pt-2">
                    <div className="border-t border-brand-rust/10 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-cinzel tracking-widest text-brand-rust/40 block uppercase font-bold">digital shagun QR (optional)</span>
                        <p className="text-[10px] text-brand-rust/50 mt-0.5">Enable guests to scan and transfer blessings straight to your Account</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShagunOn(!shagunOn)}
                        className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                          shagunOn ? "bg-emerald-700" : "bg-brand-rust/15"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${
                          shagunOn ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {shagunOn && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5 p-4 rounded-xl bg-brand-rust/5 border border-brand-rust/10 overflow-hidden"
                        >
                          <label htmlFor="upi-id" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Your Personal UPI ID</label>
                          <input
                            id="upi-id"
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g., wedding@upi or 9876543210@paytm"
                            className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 text-xs font-mono"
                          />
                          <p className="text-[9px] text-brand-rust/40">Secure payments are directly processed via standard bank integrations.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 border-t border-brand-rust/10 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-500/20 text-red-700 text-xs flex items-start gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-rust hover:bg-brand-rust/95 font-semibold text-xs tracking-wider uppercase text-white shadow active:scale-95 transition-all text-center cursor-pointer"
                    >
                      <span>Continue: Celebration Timeline</span>
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: CELEBRATION TIMELINE EVENTS PANEL */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-brand-rust/5 border border-brand-rust/10">
                    <h4 className="font-display italic text-lg text-brand-rust mb-1">Event Timeline Details</h4>
                    <p className="text-[10.5px] text-brand-rust/50 leading-relaxed">
                      Pre-set ceremony names can be modified. Specify respective date, timing, hall name, and poetic descriptions.
                    </p>
                  </div>

                  {/* EVENT 1 */}
                  <div className="p-4 rounded-2xl bg-brand-rust/5 border border-brand-rust/10 relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-10">💛</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event1-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Event 1 Name</label>
                        <input
                          id="event1-name"
                          type="text"
                          value={e1n}
                          onChange={(e) => setE1n(e.target.value)}
                          placeholder="e.g., Haldi Ceremony"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs font-medium focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event1-time" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Date &amp; Timing</label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-rust/35 pointer-events-none" />
                          <input
                            id="event1-time"
                            type="datetime-local"
                            value={e1t}
                            onChange={(e) => setE1t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 picker-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EVENT 2 */}
                  <div className="p-4 rounded-2xl bg-brand-rust/5 border border-brand-rust/10 relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-10">💃</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event2-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Event 2 Name</label>
                        <input
                          id="event2-name"
                          type="text"
                          value={e2n}
                          onChange={(e) => setE2n(e.target.value)}
                          placeholder="e.g., Sangeet Night"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs font-medium focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event2-time" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Date &amp; Timing</label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-rust/35 pointer-events-none" />
                          <input
                            id="event2-time"
                            type="datetime-local"
                            value={e2t}
                            onChange={(e) => setE2t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 picker-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EVENT 3 */}
                  <div className="p-4 rounded-2xl bg-brand-rust/5 border border-brand-rust/10 relative overflow-hidden space-y-4">
                    <div className="absolute right-4 top-4 text-3xl opacity-10">🌸</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event3-name" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Event 3 Name</label>
                        <input
                          id="event3-name"
                          type="text"
                          value={e3n}
                          onChange={(e) => setE3n(e.target.value)}
                          placeholder="e.g., Wedding Ceremony"
                          className="w-full px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs font-medium focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="event3-time" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">Date &amp; Timing</label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-rust/35 pointer-events-none" />
                          <input
                            id="event3-time"
                            type="datetime-local"
                            value={e3t}
                            onChange={(e) => setE3t(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none text-xs focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 picker-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-rust/10 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-500/20 text-red-700 text-xs flex items-start gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="px-6 py-3 rounded-full border border-brand-rust/20 text-brand-rust/70 hover:bg-brand-rust/5 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-brand-rust hover:bg-brand-rust/95 font-semibold text-xs tracking-wider uppercase text-white shadow cursor-pointer"
                      >
                        <span>Continue: Love Story</span>
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: LOVE STORY AND DIRECT LIVE GENERATE */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="how-we-met" className="text-[10px] font-cinzel tracking-widest text-brand-rust/80 uppercase font-semibold">How did you meet? (Raw story detail)</label>
                    <textarea
                      id="how-we-met"
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Write briefly in your own words — where you first crossed paths, what made you click, or when you decided to spend the rest of your lives together. Our design engine will refine it into a beautiful, poetic narrative script!"
                      className="w-full h-32 px-4 py-3 bg-white border border-brand-rust/10 rounded-xl text-brand-rust outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 transition-all duration-200 resize-none text-xs leading-relaxed placeholder:text-brand-rust/35"
                    />
                    <p className="text-[9.5px] text-brand-rust/40">Auto-translates, refines grammar, and designs a poetic narrative block!</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-brand-gold/5 border border-brand-gold/20 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-brand-rust shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-cinzel text-[9.5px] font-bold tracking-widest text-brand-rust uppercase mb-1">
                        Bespoke Love Story Narrative
                      </h4>
                      <p className="text-xs text-brand-rust/60 leading-relaxed">
                        Our digital design engine will translate your story, structure custom event timelines, compose a beautiful dual-language emotional narrative, and package your personalized invitation site.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-rust/10 space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-500/20 text-red-700 text-xs flex items-start gap-2.5 animate-bounce">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="px-6 py-3 rounded-full border border-brand-rust/20 text-brand-rust/70 hover:bg-brand-rust/5 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Back
                      </button>
                      {onCancelEdit && (
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="px-6 py-3 rounded-full border border-red-200 text-red-700 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCompileWeddingInvitation}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-brand-rust hover:bg-brand-rust/95 font-bold text-xs tracking-wider uppercase text-white shadow cursor-pointer active:scale-98 transition-transform"
                      >
                        <span>{initialData ? "✦ Save & Update" : "✦ Compile & Activate Card"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Real-Time Live Preview Simulator Frame: 5 columns */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-4 select-none">
            <span className="font-cinzel text-[10px] tracking-widest text-brand-rust/40 block uppercase font-bold">
              LIVE PREVIEW SIMULATOR
            </span>
          </div>

          <div className="relative w-full max-w-[310px] aspect-[9/18.5] rounded-[36px] border-8 border-stone-850 bg-[#FAF6F0] shadow-paper-deep p-4 overflow-hidden flex flex-col justify-between">
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

              <p className="text-[9.5px] tracking-widest font-cinzel text-brand-rust/50 font-bold">
                {wdate ? new Date(wdate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }).toUpperCase() : "DECEMBER 11, 2026"}
              </p>
              <p className="text-[8px] tracking-[3px] text-brand-rust/40 mt-1 uppercase font-bold">
                {city || "JODHPUR"}
              </p>
            </div>

            {/* Bottom event nodes summary mock */}
            <div className="relative z-10 bg-white border border-brand-rust/10 rounded-2xl p-3 mb-4 text-center">
              <p className="text-[8px] tracking-widest font-cinzel text-brand-gold uppercase mb-1 font-bold">Timeline events preview</p>
              <div className="flex justify-around text-[9px] text-brand-rust/50 gap-1 mt-1.5 font-sans">
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/5">Haldi</span>
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/5">Sangeet</span>
                <span className="bg-brand-rust/5 px-2 py-0.5 rounded border border-brand-rust/5">Wedding</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
