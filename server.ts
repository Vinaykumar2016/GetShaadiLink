import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import os from "os";
import compression from "compression";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Enable Gzip compression to minimize asset transfer sizes with balanced CPU usage
app.use(compression({
  level: 6, // Easing CPU overhead on hostinger node server
  threshold: 1024, // Only compress responses that are larger than 1KB
  filter: (req, res) => {
    const contentType = res.getHeader("Content-Type");
    if (contentType && typeof contentType === "string") {
      // Do not compress images or audio/video files (they are already compressed)
      if (contentType.match(/image|audio|video|zip/)) {
        return false;
      }
    }
    // Fall back to standard filter (compress text/html/css/json/javascript)
    return compression.filter(req, res);
  }
}));

// SEO: 301 redirect www to non-www for canonical domain consolidation
app.use((req, res, next) => {
  const host = req.get("host") || "";
  if (host.startsWith("www.")) {
    return res.redirect(301, `${req.protocol}://${host.replace(/^www\./, "")}${req.originalUrl}`);
  }
  next();
});

// Set Cache-Control headers for static directory and public assets
const cacheMaxAge = 31536000; // 1 Year in seconds for immutable assets
const shortCacheMaxAge = 86400; // 1 day for HTML/Data assets

// Increase request sizes for base64 photo uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Data storage directories
// Persistent data storage directory outside the git deployment folder on production.
// Production: /home/u236692637/getshaadilink_data
// Development: local data/ folder in project root
const DATA_DIR = (() => {
  if (process.env.NODE_ENV === "production") {
    return path.join(os.homedir(), "getshaadilink_data");
  } else {
    return process.env.DATA_PATH
      ? path.resolve(process.env.DATA_PATH)
      : path.join(process.cwd(), "data");
  }
})();

const INVITATIONS_DIR = path.join(DATA_DIR, "invitations");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const QUERIES_FILE = path.join(DATA_DIR, "support_queries.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(INVITATIONS_DIR)) {
  fs.mkdirSync(INVITATIONS_DIR, { recursive: true });
}
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, "[]", "utf-8");
}
if (!fs.existsSync(QUERIES_FILE)) {
  fs.writeFileSync(QUERIES_FILE, "[]", "utf-8");
}

console.log("[Storage] Data directory:", DATA_DIR);

// Seeding logic to copy missing cards from Git to persistent storage on startup
function seedDataIfMissing() {
  try {
    const seedDir = path.resolve(__dirname, "..", "seed_data");
    const seedInvitationsDir = path.join(seedDir, "invitations");
    const seedReviewsFile = path.join(seedDir, "reviews.json");
    const seedQueriesFile = path.join(seedDir, "support_queries.json");

    console.log(`[Seeding] Checking seed data from: ${seedDir}`);

    // Seed invitations
    if (fs.existsSync(seedInvitationsDir)) {
      const files = fs.readdirSync(seedInvitationsDir).filter(f => f.endsWith(".json"));
      for (const file of files) {
        const destPath = path.join(INVITATIONS_DIR, file);
        if (!fs.existsSync(destPath)) {
          const srcPath = path.join(seedInvitationsDir, file);
          fs.copyFileSync(srcPath, destPath);
          console.log(`[Seeding] Copied missing invitation: ${file}`);
        }
      }
    }

    // Seed reviews
    if (fs.existsSync(seedReviewsFile) && !fs.existsSync(REVIEWS_FILE)) {
      fs.copyFileSync(seedReviewsFile, REVIEWS_FILE);
      console.log(`[Seeding] Copied reviews.json`);
    }

    // Seed support queries
    if (fs.existsSync(seedQueriesFile) && !fs.existsSync(QUERIES_FILE)) {
      fs.copyFileSync(seedQueriesFile, QUERIES_FILE);
      console.log(`[Seeding] Copied support_queries.json`);
    }
  } catch (err: any) {
    console.error("[Seeding] Error seeding persistent storage:", err?.message || err);
  }
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

// API: Dynamic sitemap.xml for SEO search engines
app.get("/sitemap.xml", (req, res) => {
  try {
    const host = req.get("host") || "getshaadilink.in";
    const domainUrl = `${req.protocol}://${host}`;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // 1. Home page
    xml += `  <url>\n`;
    xml += `    <loc>${domainUrl}/</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;
    
    // 2. Query paid invitations from directory
    if (fs.existsSync(INVITATIONS_DIR)) {
      const files = fs.readdirSync(INVITATIONS_DIR).filter(f => f.endsWith(".json"));
      for (const file of files) {
        try {
          const filePath = path.join(INVITATIONS_DIR, file);
          const stats = fs.statSync(filePath);
          const rawData = fs.readFileSync(filePath, "utf-8");
          const parsed = JSON.parse(rawData);
          
          // Only index paid invitations
          const isPaid = !!parsed.razorpayPaymentId || parsed.isDemoMode;
          if (isPaid) {
            const slug = file.replace(/\.json$/, "");
            const lastmod = stats.mtime.toISOString().split("T")[0]; // YYYY-MM-DD
            xml += `  <url>\n`;
            xml += `    <loc>${domainUrl}/${slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          }
        } catch (e) {
          // Skip corrupt or unreadable files silently
        }
      }
    }
    
    xml += `</urlset>`;
    
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// API: robots.txt dynamic route to point to the correct sitemap location
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "getshaadilink.in";
  const domainUrl = `${req.protocol}://${host}`;
  const content = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: ${domainUrl}/sitemap.xml\n`;
  res.header("Content-Type", "text/plain");
  res.send(content);
});

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

// Helper: read reviews from disk
function readReviews(): any[] {
  try {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8")) || [];
  } catch { return []; }
}

// Helper: write reviews to disk
function writeReviews(reviews: any[]) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

// Helper: compute average rating from approved reviews
function computeStats() {
  const approved = readReviews().filter((r: any) => r.status === "approved");
  const avg = approved.length > 0
    ? approved.reduce((sum: number, r: any) => sum + (r.stars || 5), 0) / approved.length
    : 0;
  return { totalReviews: approved.length, averageRating: Math.round(avg * 10) / 10 };
}

// API: Fetch live invitation statistics (rating now dynamic)
app.get("/api/stats", (req, res) => {
  try {
    const files = fs.readdirSync(INVITATIONS_DIR);
    const jsonFilesCount = files.filter((f) => f.endsWith(".json")).length;
    const { totalReviews, averageRating } = computeStats();
    res.json({
      totalGenerated: jsonFilesCount,
      rating: averageRating > 0 ? averageRating : 4.9,  // fallback until first review
      totalReviews,
    });
  } catch (error) {
    res.json({ totalGenerated: 0, rating: 4.9, totalReviews: 0 });
  }
});

// API: Public — fetch approved reviews
app.get("/api/reviews", (req, res) => {
  try {
    const approved = readReviews().filter((r: any) => r.status === "approved");
    approved.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ success: true, reviews: approved });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// API: Public — submit a new review (goes to pending)
app.post("/api/reviews/submit", (req, res) => {
  const { name, location, stars, text } = req.body;
  if (!name || !text || !stars) {
    res.status(400).json({ error: "Please fill in all required fields." });
    return;
  }
  const starsNum = Math.min(5, Math.max(1, parseInt(stars, 10)));
  if (isNaN(starsNum)) {
    res.status(400).json({ error: "Invalid star rating." });
    return;
  }
  if (text.trim().length < 20) {
    res.status(400).json({ error: "Please write at least 20 characters in your review." });
    return;
  }
  try {
    const reviews = readReviews();
    const newReview = {
      id: "rev_" + Date.now() + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      location: (location || "").trim(),
      stars: starsNum,
      text: text.trim(),
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    writeReviews(reviews);
    res.json({ success: true, message: "Thank you! Your review has been submitted and will appear after approval." });
  } catch (err) {
    res.status(500).json({ error: "Failed to save review." });
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

    // Determine payment status
    const isPaid = !!parsed.razorpayPaymentId || parsed.isDemoMode;

    // Retrieve passcode from query, headers, or body
    const passcode = (req.query.passcode || req.headers["x-passcode"] || "").toString().trim();
    const isOwner = passcode && parsed.editPassword && passcode === parsed.editPassword.trim();
    const isAdmin = req.query.admin === "true";

    // If unpaid and not owner/admin, return restricted info
    if (!isPaid && !isOwner && !isAdmin) {
      res.json({
        restricted: true,
        slug: parsed.slug,
        bride: parsed.bride,
        groom: parsed.groom,
        niceDate: parsed.niceDate,
        theme: parsed.theme,
      });
      return;
    }
    
    // Increment view count unless requested by dashboard/admin/owner preview
    if (req.query.admin !== "true" && !isOwner) {
      parsed.views = (parsed.views || 0) + 1;
      fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
    }

    // Strip passcode and email from public response for security
    if (!isOwner && !isAdmin) {
      delete parsed.editPassword;
      delete parsed.ownerEmail;
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
app.post("/api/invitations/:slug/update", async (req, res) => {
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

    let parsedAiResult = null;
    let niceDate = data.niceDate;

    const wdate = fields.wdate || fields.dateRaw || data.dateRaw;
    if (wdate) {
      const parsedDate = new Date(wdate);
      niceDate = parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const bride = fields.bride !== undefined ? fields.bride : data.bride;
    const groom = fields.groom !== undefined ? fields.groom : data.groom;
    const city = fields.city !== undefined ? fields.city : data.city;
    const lang = fields.lang !== undefined ? fields.lang : data.lang;
    const storyVal = fields.story || fields.storyText || data.story || data.storyText || "";
    const e1n = fields.e1n !== undefined ? fields.e1n : (data.events && data.events[0]?.name) || "Haldi Ceremony";
    const e2n = fields.e2n !== undefined ? fields.e2n : (data.events && data.events[1]?.name) || "Sangeet Night";
    const e3n = fields.e3n !== undefined ? fields.e3n : (data.events && data.events[2]?.name) || "Wedding Ceremony";
    const e1t = fields.e1t !== undefined ? fields.e1t : (data.events && data.events[0]?.time) || "";
    const e2t = fields.e2t !== undefined ? fields.e2t : (data.events && data.events[1]?.time) || "";
    const e3t = fields.e3t !== undefined ? fields.e3t : (data.events && data.events[2]?.time) || "";

    if (
      fields.story !== undefined || 
      fields.storyText !== undefined || 
      fields.lang !== undefined || 
      fields.bride !== undefined || 
      fields.groom !== undefined || 
      fields.wdate !== undefined || 
      fields.city !== undefined
    ) {
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
      const rawStory = storyVal.trim() || "We met, fell in love, and decided to marry.";
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
1. Write storyEnglish: Read the couple's raw story, correct any spelling, grammatical, or phrasing errors, and rewrite it into a beautifully polished, elegant, and romantic story of 3-4 sentences in perfect English. Keep all names, dates, and locations, but make it sound premium and warm.
2. Write storyRegional: Translate ONLY the polished storyEnglish version you created in Step 1 into the script of the target regional language (${targetLangName}) (e.g. if target is Kannada write in Kannada script, if Hindi write in Devanagari script). Do NOT directly translate the unpolished raw story, and ensure no raw English words or grammatical errors are carried over.
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
        const polishedEnglish = `The journey of ${bride} and ${groom} is a beautiful testament to love and partnership. ` +
          (rawStory.length > 5 ? rawStory : `We met, fell in love, and decided to share our lives forever.`) +
          ` Guided by trust and shared dreams, we are taking our next beautiful step together on ${niceDate} in ${city}.`;

        let polishedRegional = polishedEnglish;
        let ev1Reg = e1n || "Haldi Ceremony";
        let ev2Reg = e2n || "Sangeet Night";
        let ev3Reg = e3n || "Wedding Ceremony";

        if (lang === "hi") {
          polishedRegional = `${bride} और ${groom} का यह सफर प्यार, अटूट विश्वास और साझेदारी की एक सुंदर कहानी है। ` +
            `हम मिले, हमें एक-दूसरे से लगाव हुआ, और हमने हमेशा के लिए एक होने का फैसला किया। ` +
            `अपने सुंदर सपनों और अपनों के आशीर्वाद के साथ, हम ${niceDate} को ${city} में अपने जीवन के इस नए और पावन सफर की शुरुआत कर रहे हैं।`;
          ev1Reg = e1n === "Haldi Ceremony" ? "हल्दी रस्म" : e1n;
          ev2Reg = e2n === "Sangeet Night" ? "संगीत संध्या" : e2n;
          ev3Reg = e3n === "Wedding Ceremony" ? "शुभ विवाह" : e3n;
        } else if (lang === "kn") {
          polishedRegional = `${bride} ಮತ್ತು ${groom} ರವರ ಈ ಪಯಣವು ಪ್ರೀತಿ, ಪರಸ್ಪರ ನಂಬಿಕೆ ಮತ್ತು ಸುಂದರ ಒಡನಾಟದ ಕಥೆಯಾಗಿದೆ. ` +
            `ನಾವು ಭೇಟಿಯಾದೆವು, ಪ್ರೀತಿಯಲ್ಲಿ ಬಿದ್ದೆವು ಮತ್ತು ನಮ್ಮ ಜೀವನವನ್ನು ಎಂದೆಂದಿಗೂ ಒಟ್ಟಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ನಿರ್ಧರಿಸಿದೆವು. ` +
            `ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಮತ್ತು ಹಂಚಿಕೊಂಡ ಕನಸುಗಳೊಂದಿಗೆ, ನಾವು ${niceDate} ರಂದು ${city} ನಲ್ಲಿ ನಮ್ಮ ಜೀವನದ ಹೊಸ ಹೆಜ್ಜೆಯನ್ನು ಇಡುತ್ತಿದ್ದೇವೆ.`;
          ev1Reg = e1n === "Haldi Ceremony" ? "ಹಳದಿ ಶಾಸ್ತ್ರ" : e1n;
          ev2Reg = e2n === "Sangeet Night" ? "ಸಂಗೀತ ಸಂಜೆ" : e2n;
          ev3Reg = e3n === "Wedding Ceremony" ? "ಶುಭ ವಿವಾಹ" : e3n;
        } else if (lang === "ta") {
          polishedRegional = `${bride} மற்றும் ${groom} இன் இந்த பயணம் காதல், பரஸ்பர நம்பிக்கை மற்றும் துணையின் அழகான கதையாகும். ` +
            `நாங்கள் சந்தித்தோம், காதலித்தோம், எங்கள் வாழ்க்கையை என்றென்றும் பகிர்ந்து கொள்ள முடிவு செய்தோம். ` +
            `அன்பானவர்களின் ஆசி மற்றும் பகிரப்பட்ட கனவுகளுடன், நாம் ${niceDate} அன்று ${city} இல் எங்கள் புதிய வாழ்க்கையைத் தொடங்குகிறோம்.`;
          ev1Reg = e1n === "Haldi Ceremony" ? "நலங்கு / மஞ்சள் நீராட்டு" : e1n;
          ev2Reg = e2n === "Sangeet Night" ? "சங்கீத் விழா" : e2n;
          ev3Reg = e3n === "Wedding Ceremony" ? "திருமணம் / சுப முகூர்த்தம்" : e3n;
        } else if (lang === "te") {
          polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ, నమ్మకం మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
            `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. ` +
            `పెద్దల ఆశీస్సులు మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
          ev1Reg = e1n === "Haldi Ceremony" ? "హల్దీ వేడుక" : e1n;
          ev2Reg = e2n === "Sangeet Night" ? "సంగీత్ సంధ్యా" : e2n;
          ev3Reg = e3n === "Wedding Ceremony" ? "శుభ కళ్యాణం" : e3n;
        } else if (lang === "ml") {
          polishedRegional = `${bride} യുടെയും ${groom} ന്റെയും ഈ യാത്ര സ്നേഹത്തിന്റെയും പരസ്പര വിശ്വാസത്തിന്റെയും മനോഹരമായ കഥയാണ്. ` +
            `ഞങ്ങൾ കണ്ടുമുട്ടി, പ്രണയത്തിലായി, ഞങ്ങളുടെ ജീവിതം എന്നെന്നേക്കുമായി പങ്കിടാൻ തീരുമാനിച്ചു. ` +
            `പ്രിയപ്പെട്ടവരുടെ അനുഗ്രഹത്തോടെയും സ്വപ്നങ്ങളോടെയും, ഞങ്ങൾ ${niceDate}-ൽ ${city}-ൽ ഞങ്ങളുടെ പുതിയ ജീവിതം ആരംഭിക്കുന്നു.`;
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
          theme: data.theme || {
            name: "Standard Saffron",
            primary: "#8A3A1A",
            secondary: "#C5A880",
            accent: "#E6C252",
            bg: "#FAF6F0",
            heroEmoji: "🌸",
          },
        };
      }
    }

    const updatedRecord = {
      ...data,
      ...fields,
      razorpayPaymentId: data.razorpayPaymentId || fields.razorpayPaymentId || null,
      slug,
      editPassword: editPassword !== undefined ? editPassword.trim() : storedPassword,
      ownerEmail: fields.ownerEmail !== undefined ? fields.ownerEmail.trim().toLowerCase() : data.ownerEmail,
      openingTheme: fields.openingTheme !== undefined ? fields.openingTheme : data.openingTheme,
      views: data.views || 0,
      guestbookNotes: fields.guestbookNotes !== undefined ? fields.guestbookNotes : (data.guestbookNotes || []),
    };

    if (parsedAiResult) {
      updatedRecord.storyEnglish = parsedAiResult.storyEnglish;
      updatedRecord.storyRegional = parsedAiResult.storyRegional;
      updatedRecord.tagline = parsedAiResult.tagline;
      updatedRecord.niceDate = niceDate;
      updatedRecord.langNative = {
        en: "English",
        kn: "ಕನ್ನಡ",
        hi: "हिंदी",
        ta: "தமிழ்",
        te: "ತೆಲುಗು",
        ml: "മലയാളം",
      }[lang] || "English";
      updatedRecord.events = [
        { name: e1n, regional: parsedAiResult.event1Regional, time: e1t, emoji: "💛" },
        { name: e2n, regional: parsedAiResult.event2Regional, time: e2t, emoji: "💃" },
        { name: e3n, regional: parsedAiResult.event3Regional, time: e3t, emoji: "🌸" },
      ];
      updatedRecord.theme = data.theme || parsedAiResult.theme;
    }

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
    let queries: any[] = [];
    if (fs.existsSync(QUERIES_FILE)) {
      const raw = fs.readFileSync(QUERIES_FILE, "utf-8");
      queries = JSON.parse(raw);
    }
    
    const newQuery = {
      id: "query_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
      status: "open",
    };
    
    queries.push(newQuery);
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2), "utf-8");

    // Try to send email notification using SMTP if configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${name.trim()} via GetShaadiLink" <${smtpUser}>`,
        to: "support@getshaadilink.in",
        replyTo: email.trim(),
        subject: `[Support Query] ${subject.trim()}`,
        text: `You have received a new support query via GetShaadiLink contact form.

Name: ${name.trim()}
Email: ${email.trim()}
Subject: ${subject.trim()}

Message:
${message.trim()}

---
Date: ${new Date().toLocaleString()}
Query ID: ${newQuery.id}`,
      };

      transporter.sendMail(mailOptions).catch((err) => {
        console.error("Failed to send support email via SMTP:", err);
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save support query:", err);
    res.status(500).json({ error: "Failed to submit your support message." });
  }
});

// Admin Authorization Middleware
const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No authentication token provided." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const expectedPassword = process.env.ADMIN_PASSWORD || "Vinay@admin";
  if (token !== expectedPassword) {
    res.status(403).json({ error: "Access denied. Invalid authentication token." });
    return;
  }
  next();
};

// API: Admin — fetch all reviews (pending + approved)
app.get("/api/admin/reviews", requireAdminAuth, (req, res) => {
  try {
    const reviews = readReviews();
    reviews.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// API: Admin — approve a review
app.post("/api/admin/reviews/:id/approve", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const reviews = readReviews();
    const review = reviews.find((r: any) => r.id === id);
    if (!review) {
      res.status(404).json({ error: "Review not found." });
      return;
    }
    review.status = review.status === "approved" ? "pending" : "approved";
    writeReviews(reviews);
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: "Failed to update review." });
  }
});

// API: Admin — delete a review
app.delete("/api/admin/reviews/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const reviews = readReviews();
    const idx = reviews.findIndex((r: any) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Review not found." });
      return;
    }
    reviews.splice(idx, 1);
    writeReviews(reviews);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review." });
  }
});

// API: Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const expectedUsername = process.env.ADMIN_USERNAME || "VinayMathad";
  const expectedPassword = process.env.ADMIN_PASSWORD || "Vinay@admin";

  if (username === expectedUsername && password === expectedPassword) {
    res.json({ success: true, token: expectedPassword });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// API: Admin Dashboard Stats
app.get("/api/admin/stats", requireAdminAuth, (req, res) => {
  try {
    let totalInvitations = 0;
    let totalViews = 0;
    let totalQueries = 0;

    if (fs.existsSync(INVITATIONS_DIR)) {
      const files = fs.readdirSync(INVITATIONS_DIR);
      totalInvitations = files.filter(f => f.endsWith(".json")).length;

      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = fs.readFileSync(path.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);
            totalViews += (data.views || 0);
          } catch (e) {
            // ignore malformed
          }
        }
      }
    }

    if (fs.existsSync(QUERIES_FILE)) {
      try {
        const raw = fs.readFileSync(QUERIES_FILE, "utf-8");
        const queries = JSON.parse(raw);
        totalQueries = Array.isArray(queries) ? queries.length : 0;
      } catch (e) {
        // ignore
      }
    }

    res.json({
      success: true,
      stats: {
        totalInvitations,
        totalViews,
        totalQueries
      }
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin List Invitations
app.get("/api/admin/invitations", requireAdminAuth, (req, res) => {
  try {
    const list: any[] = [];
    if (fs.existsSync(INVITATIONS_DIR)) {
      const files = fs.readdirSync(INVITATIONS_DIR);
      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = fs.readFileSync(path.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);
            list.push({
              slug: data.slug,
              bride: data.bride,
              groom: data.groom,
              wdate: data.wdate,
              city: data.city,
              ownerEmail: data.ownerEmail || "",
              views: data.views || 0,
              createdDate: data.createdDate || data.date || data.createdAt || "",
            });
          } catch (e) {
            // ignore
          }
        }
      }
    }
    list.sort((a, b) => b.views - a.views);
    res.json({ success: true, invitations: list });
  } catch (error) {
    console.error("Failed to list invitations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin Delete Invitation
app.delete("/api/admin/invitations/:slug", requireAdminAuth, (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    res.status(500).json({ error: "Failed to delete invitation" });
  }
});

// API: Admin List Support Queries
app.get("/api/admin/queries", requireAdminAuth, (req, res) => {
  try {
    let queries: any[] = [];
    if (fs.existsSync(QUERIES_FILE)) {
      const raw = fs.readFileSync(QUERIES_FILE, "utf-8");
      queries = JSON.parse(raw);
    }
    if (Array.isArray(queries)) {
      queries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    res.json({ success: true, queries });
  } catch (error) {
    console.error("Failed to list queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin Update Support Query Status
app.post("/api/admin/queries/:id/update", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: "Status field is required" });
    return;
  }

  try {
    if (!fs.existsSync(QUERIES_FILE)) {
      res.status(404).json({ error: "No queries exist" });
      return;
    }

    const raw = fs.readFileSync(QUERIES_FILE, "utf-8");
    const queries = JSON.parse(raw);
    const query = queries.find((q: any) => q.id === id);

    if (!query) {
      res.status(404).json({ error: "Query not found" });
      return;
    }

    query.status = status;
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2), "utf-8");
    res.json({ success: true, query });
  } catch (error) {
    console.error("Failed to update query status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin Delete Support Query
app.delete("/api/admin/queries/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;

  try {
    if (!fs.existsSync(QUERIES_FILE)) {
      res.status(404).json({ error: "No queries exist" });
      return;
    }

    const raw = fs.readFileSync(QUERIES_FILE, "utf-8");
    const queries = JSON.parse(raw);
    const index = queries.findIndex((q: any) => q.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Query not found" });
      return;
    }

    queries.splice(index, 1);
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete support query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Generate invitation using Gemini and persist it
app.post("/api/invitations/generate", async (req, res) => {
  try {
    const {
      bride, groom, wdate, city, vname, vaddr, lang, story, storyText,
      upiId, shagunOn, photos, e1n, e1t, e2n, e2t, e3n, e3t,
      slug, editPassword, groomParents, brideParents, familyBlessings,
      postWeddingPhotosUrl, ownerEmail, openingTheme, razorpayPaymentId,
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
1. Write storyEnglish: Read the couple's raw story, correct any spelling, grammatical, or phrasing errors, and rewrite it into a beautifully polished, elegant, and romantic story of 3-4 sentences in perfect English. Keep all names, dates, and locations, but make it sound premium and warm.
2. Write storyRegional: Translate ONLY the polished storyEnglish version you created in Step 1 into the script of the target regional language (${targetLangName}) (e.g. if target is Kannada write in Kannada script, if Hindi write in Devanagari script). Do NOT directly translate the unpolished raw story, and ensure no raw English words or grammatical errors are carried over.
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
      const polishedEnglish = `The journey of ${bride} and ${groom} is a beautiful testament to love and partnership. ` +
        (rawStory.length > 5 ? rawStory : `We met, fell in love, and decided to share our lives forever.`) +
        ` Guided by trust and shared dreams, we are taking our next beautiful step together on ${niceDate} in ${city}.`;

      let polishedRegional = polishedEnglish;
      let ev1Reg = e1n || "Haldi Ceremony";
      let ev2Reg = e2n || "Sangeet Night";
      let ev3Reg = e3n || "Wedding Ceremony";

      if (lang === "hi") {
        polishedRegional = `${bride} और ${groom} का यह सफर प्यार, अटूट विश्वास और साझेदारी की एक सुंदर कहानी है। ` +
          `हम मिले, हमें एक-दूसरे से लगाव हुआ, और हमने हमेशा के लिए एक होने का फैसला किया। ` +
          `अपने सुंदर सपनों और अपनों के आशीर्वाद के साथ, हम ${niceDate} को ${city} में अपने जीवन के इस नए और पावन सफर की शुरुआत कर रहे हैं।`;
        ev1Reg = e1n === "Haldi Ceremony" ? "हल्दी रस्म" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "संगीत संध्या" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "शुभ विवाह" : e3n;
      } else if (lang === "kn") {
        polishedRegional = `${bride} ಮತ್ತು ${groom} ರವರ ಈ ಪಯಣವು ಪ್ರೀತಿ, ಪರಸ್ಪರ ನಂಬಿಕೆ ಮತ್ತು ಸುಂದರ ಒಡನಾಟದ ಕಥೆಯಾಗಿದೆ. ` +
          `ನಾವು ಭೇಟಿಯಾದೆವು, ಪ್ರೀತಿಯಲ್ಲಿ ಬಿದ್ದೆವು ಮತ್ತು ನಮ್ಮ ಜೀವನವನ್ನು ಎಂದೆಂದಿಗೂ ಒಟ್ಟಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ನಿರ್ಧರಿಸಿದೆವು. ` +
          `ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಮತ್ತು ಹಂಚಿಕೊಂಡ ಕನಸುಗಳೊಂದಿಗೆ, ನಾವು ${niceDate} ರಂದು ${city} ನಲ್ಲಿ ನಮ್ಮ ಜೀವನದ ಹೊಸ ಹೆಜ್ಜೆಯನ್ನು ಇಡುತ್ತಿದ್ದೇವೆ.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "ಹಳದಿ ಶಾಸ್ತ್ರ" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "ಸಂಗೀತ ಸಂಜೆ" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "ಶುಭ ವಿವಾಹ" : e3n;
      } else if (lang === "ta") {
        polishedRegional = `${bride} மற்றும் ${groom} இன் இந்த பயணம் காதல், பரஸ்பர நம்பிக்கை மற்றும் துணையின் அழகான கதையாகும். ` +
          `நாங்கள் சந்தித்தோம், காதலித்தோம், எங்கள் வாழ்க்கையை என்றென்றும் பகிர்ந்து கொள்ள முடிவு செய்தோம். ` +
          `அன்பானவர்களின் ஆசி மற்றும் பகிரப்பட்ட கனவுகளுடன், நாம் ${niceDate} அன்று ${city} இல் எங்கள் புதிய வாழ்க்கையைத் தொடங்குகிறோம்.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "நலங்கு / மஞ்சள் நீராட்டு" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "சங்கீத் விழா" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "திருமணம் / சுப முகூர்த்தம்" : e3n;
      } else if (lang === "te") {
        polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ, నమ్మకం మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
          `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. ` +
          `పెద్దల ఆశీస్సులు మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "హల్దీ వేడుక" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "సంగీత్ సంధ్యా" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "శుభ కళ్యాణం" : e3n;
      } else if (lang === "ml") {
        polishedRegional = `${bride} യുടെയും ${groom} ന്റെയും ഈ യാത്ര സ്നേഹത്തിന്റെയും പരസ്പര വിശ്വാസത്തിന്റെയും മനോഹരമായ കഥയാണ്. ` +
          `ഞങ്ങൾ കണ്ടുമുട്ടി, പ്രണയത്തിലായി, ഞങ്ങളുടെ ജീവിതം എന്നെന്നേക്കുമായി പങ്കിടാൻ തീരുമാനിച്ചു. ` +
          `പ്രിയപ്പെട്ടവരുടെ അനുഗ്രഹത്തോടെയും സ്വപ്നങ്ങളോടെയും, ഞങ്ങൾ ${niceDate}-ൽ ${city}-ൽ ഞങ്ങളുടെ പുതിയ ജീവിതം ആരംഭിക്കുന്നു.`;
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
  // Run seeding on boot
  seedDataIfMissing();

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = process.env.DIST_PATH ||
      (() => {
        try { return path.join(path.dirname(__filename), "."); } catch { return path.join(process.cwd(), "dist"); }
      })();
    console.log("[Static] Serving from:", distPath);
    app.use(express.static(distPath, {
      maxAge: cacheMaxAge * 1000, // Serve static files with 1 Year cache headers
      setHeaders: (res, filePath) => {
        // If it's index.html, do not cache aggressively so dynamic updates/Meta tag injections take effect immediately
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (filePath.match(/\.(js|css|woff2?|eot|ttf|otf)$/)) {
          // Vite hashed bundles are immutable
          res.setHeader("Cache-Control", `public, max-age=${cacheMaxAge}, immutable`);
        } else {
          // Images, samples, audio, manifest
          res.setHeader("Cache-Control", `public, max-age=${shortCacheMaxAge}`);
        }
      }
    }));
    app.get("*", (req, res) => {
      const slug = req.path.replace(/^\//, "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const indexPath = path.join(distPath, "index.html");
      
      if (!fs.existsSync(indexPath)) {
        res.status(404).send("Build index.html not found.");
        return;
      }
      
      // Ensure the generated HTML is not cached dynamically
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
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
            
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);
            
            const metaTags = `
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              <meta property="og:image" content="${ogImage}" />
              <meta property="og:url" content="${req.protocol}://${req.get("host")}/${slug}" />
              <meta property="og:type" content="website" />
              <meta name="twitter:title" content="${title}" />
              <meta name="twitter:description" content="${description}" />
              <meta name="twitter:image" content="${ogImage}" />
              <link rel="canonical" href="${req.protocol}://${req.get("host")}/${slug}" />
            `;
            
            html = html.replace("</head>", `${metaTags}</head>`);
          } catch (err) {
            console.error("Error injecting metadata:", err);
          }
        }
      } else {
        // SEO: Inject enhanced home page meta tags + JSON-LD structured data
        const homeHost = req.get("host") || "getshaadilink.in";
        const homeUrl = `${req.protocol}://${homeHost}/`;
        const homeSeo = `
          <link rel="canonical" href="${homeUrl}" />
          <meta property="og:url" content="${homeUrl}" />
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GetShaadiLink",
            "url": "${homeUrl}",
            "description": "Create premium digital wedding invitations with AI love stories, interactive covers, Bollywood music, UPI Shagun gifts, and Google Maps. Free to build, ₹999 to activate.",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "999",
              "priceCurrency": "INR",
              "description": "One-time payment for lifetime access with unlimited edits"
            },
            "creator": {
              "@type": "Organization",
              "name": "GetShaadiLink",
              "url": "${homeUrl}",
              "sameAs": ["https://www.instagram.com/getshaadilink.in"]
            }
          }
          </script>
        `;
        html = html.replace("</head>", `${homeSeo}</head>`);
      }
      
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server powered by Gemini running on http://localhost:${PORT}`);
  });
}

startServer();
