import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request sizes for base64 photo uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Data storage directories
const DATA_DIR = path.join(process.cwd(), "data");
const INVITATIONS_DIR = path.join(DATA_DIR, "invitations");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(INVITATIONS_DIR)) {
  fs.mkdirSync(INVITATIONS_DIR);
}

// Lazy load Gemini Client to prevent crashing on launch if the key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini features will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_BUILD",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Check if slug is available
app.get("/api/check-slug/:slug", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!slug) {
    res.json({ available: false });
    return;
  }
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);
  const exists = fs.existsSync(filePath);
  res.json({ available: !exists });
});

// API: Fetch live invitation statistics
app.get("/api/stats", (req, res) => {
  try {
    const files = fs.readdirSync(INVITATIONS_DIR);
    const jsonFilesCount = files.filter((f) => f.endsWith(".json")).length;
    res.json({
      totalGenerated: jsonFilesCount,
      rating: 4.9,
    });
  } catch (error) {
    res.json({ totalGenerated: 0, rating: 4.9 });
  }
});

// API: Fetch an invitation by slug
app.get("/api/invitations/:slug", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(rawData);
    
    // Increment view count unless requested by dashboard/admin preview
    if (req.query.admin !== "true") {
      parsed.views = (parsed.views || 0) + 1;
      fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
    }

    res.json(parsed);
  } catch (error) {
    console.error("Error reading invitation file:", error);
    res.status(500).json({ error: "Failed to read invitation" });
  }
});

// API: Auth / Login verifying passcode for invitation
app.post("/api/invitations/:slug/auth", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password } = req.body;
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "No invitation exists with this link path." });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    
    // Check password
    const storedPassword = data.editPassword || "";
    if (password && storedPassword && password.trim() === storedPassword.trim()) {
      res.json({ success: true, data });
    } else if (!storedPassword) {
      res.json({ success: true, data });
    } else {
      res.status(401).json({ error: "Invalid passcode. Please try again." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server authentication error." });
  }
});

// API: Unified account login checking email & password and returning all owned invitation metadata
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Please enter both Email and Password." });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  try {
    const files = fs.readdirSync(INVITATIONS_DIR);
    const matchedInvitations: any[] = [];

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(INVITATIONS_DIR, file);
        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const parsed = JSON.parse(raw);
          if (
            parsed.ownerEmail &&
            parsed.ownerEmail.trim().toLowerCase() === cleanEmail &&
            parsed.editPassword &&
            parsed.editPassword.trim() === cleanPassword
          ) {
            // Light mapping: exclude base64 photos to speed up login payload size
            const { photos, ...lightweightRecord } = parsed;
            matchedInvitations.push(lightweightRecord);
          }
        } catch (err) {
          console.error(`Error reading card JSON file ${file}:`, err);
        }
      }
    });

    if (matchedInvitations.length === 0) {
      res.status(401).json({ error: "No invitations match this Email and Passcode/Password combination." });
      return;
    }

    res.json({ success: true, invitations: matchedInvitations });
  } catch (error: any) {
    console.error("Account login lookup failed:", error);
    res.status(500).json({ error: "Internal server validation failure." });
  }
});

// API: Direct update for an x-invitation after creations
app.post("/api/invitations/:slug/update", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password, editPassword, ...fields } = req.body;
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found to update." });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    const storedPassword = data.editPassword || "";
    const isAuthorized = !storedPassword || 
      (password && password.trim() === storedPassword.trim()) || 
      (editPassword && editPassword.trim() === storedPassword.trim());

    if (!isAuthorized) {
      res.status(401).json({ error: "Invalid passcode. Update unauthorized." });
      return;
    }

    // Merge modified fields while maintaining integrity of guestbook & events
    const updatedRecord = {
      ...data,
      ...fields,
      slug,
      editPassword: editPassword !== undefined ? editPassword.trim() : storedPassword,
      ownerEmail: fields.ownerEmail !== undefined ? fields.ownerEmail.trim().toLowerCase() : data.ownerEmail,
      openingTheme: fields.openingTheme !== undefined ? fields.openingTheme : data.openingTheme,
      views: data.views || 0,
      guestbookNotes: fields.guestbookNotes !== undefined ? fields.guestbookNotes : (data.guestbookNotes || []),
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedRecord, null, 2), "utf-8");
    res.json({ success: true, slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update invitation." });
  }
});

// API: Guest submits a blessing note onto the digital wall
app.post("/api/invitations/:slug/add-note", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { name, note, amount } = req.body;
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Wedding page not found." });
    return;
  }

  const noteText = (note || req.body.message || "").trim();
  if (!name || name.trim() === "" || !noteText) {
    res.status(400).json({ error: "Please enter your name and a heartfelt blessing." });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    if (!data.guestbookNotes) {
      data.guestbookNotes = [];
    }

    const newNote = {
      id: "note_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      note: noteText,
      amount: amount ? String(amount).trim() : undefined,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    data.guestbookNotes.push(newNote);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, note: newNote, notes: data.guestbookNotes });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to register blessing." });
  }
});

// API: Submit a support/contact query
app.post("/api/contact/submit", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Please fill out all fields in the contact form." });
    return;
  }
  
  try {
    const queriesPath = path.join(DATA_DIR, "support_queries.json");
    let queries: any[] = [];
    if (fs.existsSync(queriesPath)) {
      const raw = fs.readFileSync(queriesPath, "utf-8");
      queries = JSON.parse(raw);
    }
    
    const newQuery = {
      id: "query_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    };
    
    queries.push(newQuery);
    fs.writeFileSync(queriesPath, JSON.stringify(queries, null, 2), "utf-8");
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save support query:", err);
    res.status(500).json({ error: "Failed to submit your support message." });
  }
});

// API: Generate invitation using Gemini and persist it
app.post("/api/invitations/generate", async (req, res) => {
  try {
    const {
      bride,
      groom,
      wdate,
      city,
      vname,
      vaddr,
      lang,
      story,
      storyText,
      upiId,
      shagunOn,
      photos,
      e1n,
      e1t,
      e2n,
      e2t,
      e3n,
      e3t,
      slug,
      editPassword,
      groomParents,
      brideParents,
      familyBlessings,
      postWeddingPhotosUrl,
      ownerEmail,
      openingTheme,
      razorpayPaymentId,
    } = req.body;

    const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!formattedSlug) {
      res.status(400).json({ error: "A valid URL path is required" });
      return;
    }

    if (!bride || !groom || !wdate || !city || !vname || !vaddr) {
      res.status(400).json({ error: "Please provide all required wedding details." });
      return;
    }

    const parsedDate = new Date(wdate);
    const niceDate = parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const langMap: Record<string, string> = {
      en: "English",
      kn: "Kannada",
      hi: "Hindi",
      ta: "Tamil",
      te: "Telugu",
      ml: "Malayalam",
    };

    const targetLangName = langMap[lang] || "English";
    const seed = Math.floor(Math.random() * 9999);
    const rawStory = (story || storyText || "").trim() || "We met, fell in love, and decided to marry.";

    let parsedAiResult = null;
    const key = process.env.GEMINI_API_KEY;

    if (key && key !== "MOCK_KEY_FOR_BUILD") {
      try {
        const ai = getGeminiClient();
        const promptText = `Generate custom written components for an Indian wedding invitation.
Couple: Bride is "${bride}", Groom is "${groom}"
Wedding Date: ${niceDate}
Location City: ${city}
Target Regional Language: ${targetLangName}
Couple's raw story: "${rawStory}"
Random seed for design variant: ${seed}

Instructions:
1. Write storyEnglish: Write a warm, polished, and interesting romantic version of the couple's raw story in 3-4 sentences. Retain all context and details from the user's raw story (like names, specific timeline details, or locations), but refine the flow and style to make it sound simple, premium, and engaging.
2. Write storyRegional: Translate the polished storyEnglish version into the script of the target regional language (${targetLangName}) (e.g. if target is Kannada write in Kannada script, if Hindi write in Devanagari script). Ensure the translation is natural and warm. If the target regional language is English, write a highly poetic alternative English version of the story.
3. Create tagline: A short romantic heading (8-12 words).
4. Translate e1n, e2n, e3n into ${targetLangName} script for eventRegional strings (event1Regional, event2Regional, event3Regional).
5. Create a gorgeous, warm Indian wedding palette for the UI:
   - primary: deep celebratory hex (e.g., silk magenta #9B1B6A, ruby #BA1A4B, crimson)
   - secondary: royal gold lustre hex (e.g., #D4A843, #E6C252)
   - accent: cool jewel tint hex (e.g., #2CB5B0, #14B8A6)
   - bg: deep cosmic backdrop hex (e.g., #08000F, #0E001A, #120124)
   - heroEmoji: selection of romantic flower or accessory emoji (e.g., 🌸, 🌺, 💍, 🪔)`;

        const geminiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                storyEnglish: { type: Type.STRING },
                storyRegional: { type: Type.STRING },
                tagline: { type: Type.STRING },
                event1Regional: { type: Type.STRING },
                event2Regional: { type: Type.STRING },
                event3Regional: { type: Type.STRING },
                theme: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    primary: { type: Type.STRING },
                    secondary: { type: Type.STRING },
                    accent: { type: Type.STRING },
                    bg: { type: Type.STRING },
                    heroEmoji: { type: Type.STRING },
                  },
                  required: ["name", "primary", "secondary", "accent", "bg", "heroEmoji"],
                },
              },
              required: [
                "storyEnglish",
                "storyRegional",
                "tagline",
                "event1Regional",
                "event2Regional",
                "event3Regional",
                "theme",
              ],
            },
          },
        });

        const aiOutputText = geminiRes.text;
        if (aiOutputText) {
          parsedAiResult = JSON.parse(aiOutputText);
        }
      } catch (err) {
        console.warn("WARNING: Gemini AI generation failed. Falling back to local templates. Error:", err);
      }
    }

    if (!parsedAiResult) {
      // Local fallback generation with basic translation and polishing
      const polishedEnglish = `The journey of ${bride} and ${groom} is a beautiful testament to love and partnership. ` +
        (rawStory.length > 5 ? rawStory : `We met, fell in love, and decided to share our lives forever.`) +
        ` Guided by trust and shared dreams, we are taking our next beautiful step together on ${niceDate} in ${city}.`;

      let polishedRegional = polishedEnglish;
      let ev1Reg = e1n || "Haldi Ceremony";
      let ev2Reg = e2n || "Sangeet Night";
      let ev3Reg = e3n || "Wedding Ceremony";

      if (lang === "hi") {
        polishedRegional = `${bride} और ${groom} का यह सफर प्यार और साझेदारी की एक सुंदर कहानी है। ` +
          (rawStory.length > 5 ? `हमारा सफर: "${rawStory}"। ` : `हम मिले, हमें प्यार हुआ, और हमने हमेशा के लिए एक होने का फैसला किया। `) +
          `विश्वास और सपनों के साथ, हम ${niceDate} को ${city} में अपने जीवन के इस नए सफर की शुरुआत कर रहे हैं।`;
        ev1Reg = e1n === "Haldi Ceremony" ? "हल्दी रस्म" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "संगीत संध्या" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "शुभ विवाह" : e3n;
      } else if (lang === "kn") {
        polishedRegional = `${bride} ಮತ್ತು ${groom} ರವರ ಈ ಪಯಣವು ಪ್ರೀತಿ ಮತ್ತು ಒಡನಾಟದ ಸುಂದರ ಕಥೆಯಾಗಿದೆ. ` +
          (rawStory.length > 5 ? `ನಮ್ಮ ಕಥೆ: "${rawStory}"। ` : `ನಾವು ಭೇಟಿಯಾದೆವು, ಪ್ರೀತಿಯಲ್ಲಿ ಬಿದ್ದೆವು ಮತ್ತು ನಮ್ಮ ಜೀವನವನ್ನು ಎಂದೆಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಲು ನಿರ್ಧರಿಸಿದೆವು. `) +
          `ನಂಬಿಕೆ ಮತ್ತು ಹಂಚಿಕೊಂಡ ಕನಸುಗಳೊಂದಿಗೆ, ನಾವು ${niceDate} ರಂದು ${city} ನಲ್ಲಿ ನಮ್ಮ ಜೀವನದ ಹೊಸ ಹೆಜ್ಜೆಯನ್ನು ಇಡುತ್ತಿದ್ದೇವೆ.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "ಹಳದಿ ಶಾಸ್ತ್ರ" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "ಸಂಗೀತ ಸಂಜೆ" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "ಶುಭ ವಿವಾಹ" : e3n;
      } else if (lang === "ta") {
        polishedRegional = `${bride} மற்றும் ${groom} இன் இந்த பயணம் காதல் மற்றும் துணையின் அழகான கதையாகும். ` +
          (rawStory.length > 5 ? `எங்கள் கதை: "${rawStory}"। ` : `நாங்கள் சந்தித்தோம், காதலித்தோம், எங்கள் வாழ்க்கையை என்றென்றும் பகிர்ந்து கொள்ள முடிவு செய்தோம். `) +
          `நம்பிக்கை மற்றும் பகிரப்பட்ட கனவுகளுடன், நாம் ${niceDate} அன்று ${city} இல் எங்கள் புதிய வாழ்க்கையைத் தொடங்குகிறோம்.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "நலங்கு / மஞ்சள் நீராட்டு" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "சங்கீத் விழா" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "திருமணம் / சுപ முகூர்த்தம்" : e3n;
      } else if (lang === "te") {
        polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
          (rawStory.length > 5 ? `మా కథ: "${rawStory}"। ` : `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. `) +
          `నమ్మకం మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "హల్దీ వేడుక" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "സംഗీത് సంధ్యా" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "శుభ కళ్యాణం" : e3n;
      } else if (lang === "ml") {
        polishedRegional = `${bride} യുടെയും ${groom} ന്റെയും ഈ യാത്ര സ്നേഹത്തിന്റെയും കൂട്ടുകെട്ടിന്റെയും മനോഹരമായ കഥയാണ്. ` +
          (rawStory.length > 5 ? `ഞങ്ങളുടെ കഥ: "${rawStory}"। ` : `ഞങ്ങൾ കണ്ടുമുട്ടി, പ്രണയത്തിലായി, ഞങ്ങളുടെ ജീവിതം എന്നെന്നേക്കുമായി പങ്കിടാൻ തീരുമാനിച്ചു. `) +
          `വിശ്വാസത്തോടെയും സ്വപ്നങ്ങളോടെയും, ഞങ്ങൾ ${niceDate}-ൽ ${city}-ൽ ഞങ്ങളുടെ പുതിയ ജീവിതം ആരംഭിക്കുന്നു.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "ഹൽദി ചടങ്ങ്" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "സംഗീത് സന്ധ്യ" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "മംഗല്യ ചടങ്ങ്" : e3n;
      }

      parsedAiResult = {
        storyEnglish: polishedEnglish,
        storyRegional: polishedRegional,
        tagline: `${bride} & ${groom}'s Sacred Wedding Celebration`,
        event1Regional: ev1Reg,
        event2Regional: ev2Reg,
        event3Regional: ev3Reg,
        theme: {
          name: "Standard Saffron",
          primary: "#8A3A1A",
          secondary: "#C5A880",
          accent: "#E6C252",
          bg: "#FAF6F0",
          heroEmoji: "🌸",
        },
      };
    }

    // Merge and finalize the record to persist database on disk
    const invitationRecord = {
      slug: formattedSlug,
      bride,
      groom,
      niceDate,
      city,
      vname,
      vaddr,
      storyEnglish: parsedAiResult.storyEnglish,
      storyRegional: parsedAiResult.storyRegional,
      tagline: parsedAiResult.tagline,
      lang,
      langNative: {
        en: "English",
        kn: "ಕನ್ನಡ",
        hi: "हिंदी",
        ta: "தமிழ்",
        te: "తెలుగు",
        ml: "മലയാളം",
      }[lang] || "English",
      events: [
        { name: e1n || "Haldi Ceremony", regional: parsedAiResult.event1Regional, time: e1t || "", emoji: "💛" },
        { name: e2n || "Sangeet Night", regional: parsedAiResult.event2Regional, time: e2t || "", emoji: "💃" },
        { name: e3n || "Wedding Ceremony", regional: parsedAiResult.event3Regional, time: e3t || "", emoji: "🌸" },
      ],
      shagunOn: !!shagunOn,
      upiId: (upiId || "").trim(),
      dateRaw: wdate,
      photos: photos || [],
      theme: parsedAiResult.theme || {
        name: "Standard Saffron",
        primary: "#C2185B",
        secondary: "#D4A843",
        accent: "#2CB5B0",
        bg: "#08000F",
        heroEmoji: "🌸",
      },
      editPassword: (editPassword || "").trim(),
      groomParents: (groomParents || "").trim(),
      brideParents: (brideParents || "").trim(),
      familyBlessings: (familyBlessings || "").trim(),
      postWeddingPhotosUrl: (postWeddingPhotosUrl || "").trim(),
      ownerEmail: (ownerEmail || "").trim().toLowerCase(),
      views: 0,
      openingTheme: openingTheme || "elephant",
      razorpayPaymentId: razorpayPaymentId || null,
      guestbookNotes: [],
      createdAt: new Date().toISOString(),
    };

    const targetFilePath = path.join(INVITATIONS_DIR, `${formattedSlug}.json`);
    fs.writeFileSync(targetFilePath, JSON.stringify(invitationRecord, null, 2), "utf-8");

    res.json({ success: true, slug: formattedSlug });
  } catch (error: any) {
    console.error("AI Generation & storage failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate wedding invitation." });
  }
});

// Vite middleware integration for live development and production static build routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite dev server
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static build assets serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const slug = req.path.replace(/^\//, "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const indexPath = path.join(distPath, "index.html");
      
      if (!fs.existsSync(indexPath)) {
        res.status(404).send("Build index.html not found.");
        return;
      }
      
      let html = fs.readFileSync(indexPath, "utf-8");
      
      if (slug) {
        const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);
        if (fs.existsSync(filePath)) {
          try {
            const rawData = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(rawData);
            
            const title = `${data.bride} & ${data.groom}'s Wedding Invitation | GetShaadiLink`;
            const description = `Join us to celebrate our wedding at ${data.vname}, ${data.city} on ${data.niceDate}. Click to view details and RSVP.`;
            const ogImage = data.photos && data.photos.length > 0 ? data.photos[0] : `${req.protocol}://${req.get("host")}/samples/couple1.jpg`;
            
            // Replace Title
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            
            // Inject Meta Tags
            const metaTags = `
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              <meta property="og:image" content="${ogImage}" />
              <meta property="og:url" content="${req.protocol}://${req.get("host")}/${slug}" />
              <meta property="og:type" content="website" />
              <meta name="twitter:title" content="${title}" />
              <meta name="twitter:description" content="${description}" />
              <meta name="twitter:image" content="${ogImage}" />
            `;
            
            // Inject into head
            html = html.replace("</head>", `${metaTags}</head>`);
          } catch (err) {
            console.error("Error injecting metadata:", err);
          }
        }
      }
      
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server powered by Gemini running on http://localhost:${PORT}`);
  });
}

startServer();
