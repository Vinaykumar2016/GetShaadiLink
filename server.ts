import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import os from "os";
import compression from "compression";
import crypto from "crypto";

dotenv.config();

const app = express();

// Security Hardening: Hide server footprint & enforce OWASP security headers
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://maps.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "media-src 'self' blob:; " +
    "connect-src 'self' https://api.razorpay.com https://generativelanguage.googleapis.com; " +
    "frame-src https://checkout.razorpay.com https://maps.google.com https://www.google.com;"
  );
  next();
});

// In-Memory Rate Limiter to prevent brute-force attacks on sensitive auth routes
const authAttemptTracker = new Map<string, { count: number; resetTime: number }>();
function rateLimitAuthMiddleware(req: any, res: any, next: any) {
  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString().split(",")[0].trim();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 20; // max 20 attempts per 15 mins

  const record = authAttemptTracker.get(clientIp);
  if (!record || now > record.resetTime) {
    authAttemptTracker.set(clientIp, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxAttempts) {
    return res.status(429).json({ error: "Too many authentication attempts. Please try again in 15 minutes." });
  }

  record.count += 1;
  next();
}
const PORT = parseInt(process.env.PORT || "3000", 10);

// Trust first proxy (Hostinger/Cloudflare) so X-Forwarded-For IP extraction is reliable
app.set("trust proxy", 1);

// Purge stale rate-limit entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of authAttemptTracker.entries()) {
    if (now > record.resetTime) authAttemptTracker.delete(ip);
  }
}, 5 * 60 * 1000);

// HTML entity escaper — prevents XSS when injecting user data into HTML
function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
// Default body parser — 2MB limit for standard routes
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
// 25MB payload limit for photo-upload routes
app.use(["/api/invitations/generate", "/api/invitations/:slug/update"], express.json({ limit: "25mb" }));

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

// Helper: Translate event names in fallback templates to selected regional language
function translateEventName(name: string, lang: string): string {
  if (!name) return "";
  const lower = name.toLowerCase();
  
  if (lang === "hi") {
    if (lower.includes("haldi")) return "हल्दी रस्म";
    if (lower.includes("sangeet")) return "संगीत संध्या";
    if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("ceremony") || lower.includes("phera") || lower.includes("lagna") || lower.includes("shubh")) return "शुभ विवाह";
    if (lower.includes("reception")) return "प्रीतिभोज / रिसेप्शन";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "मेहंदी रस्म";
    return name;
  }
  if (lang === "kn") {
    if (lower.includes("haldi")) return "ಹಳದಿ ಶಾಸ್ತ್ರ";
    if (lower.includes("sangeet")) return "ಸಂಗೀತ ಸಂಜೆ";
    if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("ceremony") || lower.includes("phera") || lower.includes("lagna") || lower.includes("shubh") || lower.includes("maduve")) return "ಶುಭ ವಿವಾಹ";
    if (lower.includes("reception")) return "ಸ್ವಾಗತ ಸಮಾರಂಭ";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "ಮೆಹೆಂದಿ ಶಾಸ್ತ್ರ";
    return name;
  }
  if (lang === "ta") {
    if (lower.includes("haldi")) return "நலங்கு / மஞ்சள் நீராட்டு";
    if (lower.includes("sangeet")) return "சங்கீத் விழா";
    if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("ceremony") || lower.includes("phera") || lower.includes("lagna") || lower.includes("shubh") || lower.includes("muhurtham")) return "திருமணம் / சுப முகூர்த்தம்";
    if (lower.includes("reception")) return "வரவேற்பு நிகழ்ச்சி";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "மெஹந்தி விழா";
    return name;
  }
  if (lang === "te") {
    if (lower.includes("haldi")) return "హల్దీ వేడుక";
    if (lower.includes("sangeet")) return "సంగీత్ సంధ్యా";
    if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("ceremony") || lower.includes("phera") || lower.includes("lagna") || lower.includes("shubh") || lower.includes("kalyanam")) return "శుభ కళ్యాణం";
    if (lower.includes("reception")) return "విందు / రిసెప్షన్";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "మెహందీ వేడుక";
    return name;
  }
  if (lang === "ml") {
    if (lower.includes("haldi")) return "ഹൽദി ചടങ്ങ്";
    if (lower.includes("sangeet")) return "സംഗീത് സന്ധ്യ";
    if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("ceremony") || lower.includes("phera") || lower.includes("lagna") || lower.includes("shubh") || lower.includes("mangalyam")) return "മംഗല്യ ചടങ്ങ്";
    if (lower.includes("reception")) return "വിരുന്ന് / റിസപ്ഷൻ";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "മെഹന്തി ചടങ്ങ്";
    return name;
  }
  return name;
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
app.post("/api/reviews/submit", rateLimitAuthMiddleware, (req, res) => {
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

    // Admin bypass via query param removed — security hardening
    // If unpaid and not owner, return restricted info
    if (!isPaid && !isOwner) {
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
    if (!isOwner) {
      parsed.views = (parsed.views || 0) + 1;
      
      // Update dailyViews
      const todayStr = new Date().toISOString().split("T")[0];
      parsed.dailyViews = parsed.dailyViews || {};
      parsed.dailyViews[todayStr] = (parsed.dailyViews[todayStr] || 0) + 1;
      
      // Update trafficSources
      let source = (req.query.source || "").toString().trim().toLowerCase();
      if (!source) {
        const referer = req.headers["referer"] || "";
        if (referer.includes("wa.me") || referer.includes("whatsapp")) {
          source = "whatsapp";
        } else if (referer.includes("instagram.com") || referer.includes("instagram")) {
          source = "instagram";
        } else if (referer.includes("facebook.com") || referer.includes("facebook")) {
          source = "facebook";
        } else if (referer.includes("google.com") || referer.includes("google")) {
          source = "google";
        } else if (referer) {
          try {
            const urlObj = new URL(referer);
            source = urlObj.hostname.replace("www.", "");
          } catch (e) {
            source = "other";
          }
        } else {
          source = "direct";
        }
      }
      source = source.replace(/[^a-z0-9.-]/g, "") || "direct";
      parsed.trafficSources = parsed.trafficSources || {};
      parsed.trafficSources[source] = (parsed.trafficSources[source] || 0) + 1;

      fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
    }

    // Strip passcode and email from public response for security
    if (!isOwner) {
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
app.post("/api/invitations/:slug/auth", rateLimitAuthMiddleware, (req, res) => {
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
      fields.city !== undefined ||
      fields.e1n !== undefined ||
      fields.e2n !== undefined ||
      fields.e3n !== undefined
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

Input Event Names to Translate:
- Event 1: "${e1n || 'Haldi Ceremony'}"
- Event 2: "${e2n || 'Sangeet Night'}"
- Event 3: "${e3n || 'Wedding Ceremony'}"

Instructions:
1. Write storyEnglish: Read the couple's raw story, correct any spelling, grammatical, or phrasing errors, and rewrite it into a beautifully polished, elegant, and romantic story of 3-4 sentences in perfect English. Keep all names, dates, and locations, but make it sound premium and warm.
2. Write storyRegional: Translate ONLY the polished storyEnglish version you created in Step 1 into the script of the target regional language (${targetLangName}) (e.g. if target is Kannada write in Kannada script, if Hindi write in Devanagari script). Do NOT directly translate the unpolished raw story, and ensure no raw English words or grammatical errors are carried over.
3. Create tagline: A short romantic heading (8-12 words).
4. Translate the Input Event Names into the target regional language (${targetLangName}) script:
   - Translate Event 1 Name ("${e1n || 'Haldi Ceremony'}") -> save as event1Regional
   - Translate Event 2 Name ("${e2n || 'Sangeet Night'}") -> save as event2Regional
   - Translate Event 3 Name ("${e3n || 'Wedding Ceremony'}") -> save as event3Regional
   If the target regional language is English, make sure event1Regional, event2Regional, event3Regional match the input event names exactly.
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
        if (lang === "hi") {
          polishedRegional = `${bride} और ${groom} का यह सफर प्यार, अटूट विश्वास और साझेदारी की एक सुंदर कहानी है। ` +
            `हम मिले, हमें एक-दूसरे से लगाव हुआ, और हमने हमेशा के लिए एक होने का फैसला किया। ` +
            `अपने सुंदर सपनों और अपनों के आशीर्वाद के साथ, हम ${niceDate} को ${city} में अपने जीवन के इस नए और पावन सफर की शुरुआत कर रहे हैं।`;
        } else if (lang === "kn") {
          polishedRegional = `${bride} ಮತ್ತು ${groom} ರವರ ಈ ಪಯಣವು ಪ್ರೀತಿ, ಪರಸ್ಪರ ನಂಬಿಕೆ ಮತ್ತು ಸುಂದರ ಒಡನಾಟದ ಕಥೆಯಾಗಿದೆ. ` +
            `ನಾವು ಭೇಟಿಯಾದೆವು, ಪ್ರೀತಿಯಲ್ಲಿ ಬಿದ್ದೆವು ಮತ್ತು ನಮ್ಮ ಜೀವನವನ್ನು ಎಂದೆಂದಿಗೂ ಒಟ್ಟಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ನಿರ್ಧರಿಸಿದೆವು. ` +
            `ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಮತ್ತು ಹಂಚಿಕೊಂಡ ಕನಸುಗಳೊಂದಿಗೆ, ನಾವು ${niceDate} ರಂದು ${city} ನಲ್ಲಿ ನಮ್ಮ ಜೀವನದ ಹೊಸ ಹೆಜ್ಜೆಯನ್ನು ಇಡುತ್ತಿದ್ದೇವೆ.`;
        } else if (lang === "ta") {
          polishedRegional = `${bride} மற்றும் ${groom} இன் இந்த பயணம் காதல், பரಸ್ಪர நம்பிக்கை மற்றும் துணையின் அழகான கதையாகும். ` +
            `நாங்கள் சந்தித்தோம், காதலித்தோம், எங்கள் வாழ்க்கையை என்றென்றும் பகிர்ந்து கொள்ள முடிவு செய்தோம். ` +
            `அன்பானவர்களின் ஆசி மற்றும் பகிரப்பட்ட கனவுகளுடன், நாம் ${niceDate} அன்று ${city} இல் எங்கள் புதிய வாழ்க்கையைத் தொடங்குகிறோம்.`;
        } else if (lang === "te") {
          polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ, నమ్మకం మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
            `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. ` +
            `పెద్దల ఆశీస్సులు మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
        } else if (lang === "ml") {
          polishedRegional = `${bride} യുടെയും ${groom} ന്റെയും ഈ യാത്ര സ്നേഹത്തിന്റെയും പരസ്പര വിശ്വാസത്തിന്റെയും മനോഹരമായ കഥയാണ്. ` +
            `ഞങ്ങൾ കണ്ടുമുട്ടി, പ്രണയത്തിലായി, ഞങ്ങളുടെ ജീവിതം എന്നെന്നേക്കുമായി പങ്കിടാൻ തീരുമാനിച്ചു. ` +
            `പ്രിയപ്പെട്ടവരുടെ അനുഗ്രഹത്തോടെയും സ്വപ്നങ്ങളോടെയും, ഞങ്ങൾ ${niceDate}-ൽ ${city}-ൽ ഞങ്ങളുടെ പുതിയ ജീവിതം ആരംഭിക്കുന്നു.`;
        }

        parsedAiResult = {
          storyEnglish: polishedEnglish,
          storyRegional: polishedRegional,
          tagline: `${bride} & ${groom}'s Sacred Wedding Celebration`,
          event1Regional: translateEventName(e1n || "Haldi Ceremony", lang),
          event2Regional: translateEventName(e2n || "Sangeet Night", lang),
          event3Regional: translateEventName(e3n || "Wedding Ceremony", lang),
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

    const oldPaid = !!data.razorpayPaymentId;
    
    // Razorpay HMAC signature verification & direct payment ID recognition
    let verifiedNewPaymentId: string | null = null;
    if (fields.razorpayPaymentId && typeof fields.razorpayPaymentId === "string") {
      const pId = fields.razorpayPaymentId.trim();
      const { razorpayOrderId, razorpaySignature } = fields;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

      if (razorpayOrderId && razorpaySignature && keySecret) {
        const expectedSig = crypto
          .createHmac("sha256", keySecret)
          .update(`${razorpayOrderId}|${pId}`)
          .digest("hex");
        if (expectedSig === razorpaySignature) {
          verifiedNewPaymentId = pId;
        } else {
          res.status(400).json({ error: "Payment verification failed. Invalid signature." });
          return;
        }
      } else if (pId.startsWith("pay_")) {
        // Valid Razorpay Payment ID string from client-side checkout
        verifiedNewPaymentId = pId;
      }
    }
    
    const newPaidId = data.razorpayPaymentId || verifiedNewPaymentId || null;
    const newPaid = !!newPaidId;
    let paidAt = data.paidAt || null;
    if (newPaid && !oldPaid) {
      paidAt = new Date().toISOString();
    }

    const updatedRecord = {
      ...data,
      ...fields,
      razorpayPaymentId: newPaidId,
      paidAt: paidAt,
      agency: data.agency !== undefined ? data.agency : (fields.agency || null),
      dailyViews: data.dailyViews || {},
      trafficSources: data.trafficSources || {},
      slug,
      editPassword: editPassword !== undefined ? editPassword.trim() : storedPassword,
      ownerEmail: fields.ownerEmail !== undefined ? fields.ownerEmail.trim().toLowerCase() : data.ownerEmail,
      openingTheme: fields.openingTheme !== undefined ? fields.openingTheme : data.openingTheme,
      views: data.views || 0,
      guestbookNotes: fields.guestbookNotes !== undefined ? fields.guestbookNotes : (data.guestbookNotes || []),
      niceDate,
      langNative: {
        en: "English",
        kn: "ಕನ್ನಡ",
        hi: "हिंदी",
        ta: "தமிழ்",
        te: "ತೆಲುಗು",
        ml: "മലയാളം",
      }[lang] || "English",
    };

    // Reconstruct regional translations for events.
    // If AI was triggered and succeeded, we use its translations.
    // Otherwise, we reuse existing translation if the event name and language haven't changed,
    // or fall back to local translation helper.
    const getEventRegional = (index: number, newName: string, aiReg?: string) => {
      if (aiReg) return aiReg;
      const oldEv = data.events && data.events[index];
      if (lang === data.lang && oldEv && oldEv.name === newName && oldEv.regional) {
        return oldEv.regional;
      }
      return translateEventName(newName, lang);
    };

    updatedRecord.events = [
      {
        name: e1n,
        regional: getEventRegional(0, e1n, parsedAiResult?.event1Regional),
        time: e1t,
        emoji: (data.events && data.events[0]?.emoji) || "💛"
      },
      {
        name: e2n,
        regional: getEventRegional(1, e2n, parsedAiResult?.event2Regional),
        time: e2t,
        emoji: (data.events && data.events[1]?.emoji) || "💃"
      },
      {
        name: e3n,
        regional: getEventRegional(2, e3n, parsedAiResult?.event3Regional),
        time: e3t,
        emoji: (data.events && data.events[2]?.emoji) || "🌸"
      },
    ];

    if (parsedAiResult) {
      updatedRecord.storyEnglish = parsedAiResult.storyEnglish;
      updatedRecord.storyRegional = parsedAiResult.storyRegional;
      updatedRecord.tagline = parsedAiResult.tagline;
      updatedRecord.theme = data.theme || parsedAiResult.theme;
    }

    fs.writeFileSync(filePath, JSON.stringify(updatedRecord, null, 2), "utf-8");

    if (newPaid && !oldPaid) {
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
      sendPaymentReceiptEmail(updatedRecord, appUrl).catch((e) => console.error("[Email Receipt] Update route dispatch error:", e));
    }

    res.json({ success: true, slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update invitation." });
  }
});

// API: Dedicated Razorpay payment verification & card activation endpoint
app.post("/api/invitations/:slug/verify-payment", rateLimitAuthMiddleware, async (req, res) => {
  try {
    const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!razorpayPaymentId || typeof razorpayPaymentId !== "string" || !razorpayPaymentId.startsWith("pay_")) {
      res.status(400).json({ error: "Valid Razorpay Payment ID is required." });
      return;
    }

    const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Invitation not found." });
      return;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    // Verify HMAC signature if signature and secret are present
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    if (razorpayOrderId && razorpaySignature && keySecret) {
      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
      if (expectedSig !== razorpaySignature) {
        res.status(400).json({ error: "Payment signature verification failed." });
        return;
      }
    }

    data.razorpayPaymentId = razorpayPaymentId;
    if (!data.paidAt) {
      data.paidAt = new Date().toISOString();
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[Payment Verified] Activated card for ${slug} with Payment ID: ${razorpayPaymentId}`);

    // Asynchronously dispatch payment receipt email
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    sendPaymentReceiptEmail(data, appUrl).catch((emailErr) => {
      console.error("[Email Receipt] Async dispatch error:", emailErr);
    });

    res.json({ success: true, isPaid: true, slug, razorpayPaymentId: data.razorpayPaymentId, paidAt: data.paidAt });
  } catch (err: any) {
    console.error("Failed to verify payment:", err);
    res.status(500).json({ error: "Failed to process payment verification." });
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
app.post("/api/contact/submit", rateLimitAuthMiddleware, async (req, res) => {
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
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    res.status(500).json({ error: "Server misconfiguration: admin credentials not set." });
    return;
  }
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

// API: Agency Dashboard Stats (Read-Only)
app.get("/api/agency/:agencyId/stats", (req, res) => {
  const { agencyId } = req.params;
  const passcode = (req.query.password || req.headers["x-passcode"] || "").toString().trim();

  // Validate credentials specifically for maddozcreative
  if (agencyId.trim().toLowerCase() === "maddozcreative") {
    if (passcode !== "maddoz@vishwas2026") {
      res.status(401).json({ error: "Invalid agency credentials" });
      return;
    }
  } else {
    // For safety, require a passcode for other custom agencies or block them
    res.status(404).json({ error: "Agency not found or not configured" });
    return;
  }

  try {
    let createdCount = 0;
    let paidCount = 0;
    let salesThisMonth = 0;
    let revenueThisMonth = 0;

    const now = new Date();
    // YYYY-MM in local/server time
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const trafficSourcesAggregate: Record<string, number> = {};
    const dailyViewsAggregate: Record<string, number> = {};
    const agencyCards: any[] = [];

    if (fs.existsSync(INVITATIONS_DIR)) {
      const files = fs.readdirSync(INVITATIONS_DIR);
      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = fs.readFileSync(path.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);

            // Filter cards matching this agency
            if (data.agency && data.agency.trim().toLowerCase() === agencyId.trim().toLowerCase()) {
              createdCount++;

              const isPaid = !!data.razorpayPaymentId;
              if (isPaid) {
                paidCount++;
              }

              // Aggregate traffic sources
              if (data.trafficSources) {
                for (const [source, count] of Object.entries(data.trafficSources)) {
                  trafficSourcesAggregate[source] = (trafficSourcesAggregate[source] || 0) + (count as number);
                }
              }

              // Aggregate daily views
              if (data.dailyViews) {
                for (const [dateStr, count] of Object.entries(data.dailyViews)) {
                  dailyViewsAggregate[dateStr] = (dailyViewsAggregate[dateStr] || 0) + (count as number);
                }
              }

              // Determine if paid this month and calculate amount
              let amt = 0;
              if (isPaid) {
                const isManual = typeof data.razorpayPaymentId === "string" && data.razorpayPaymentId.startsWith("pay_admin_unlock_");
                amt = data.paymentAmount !== undefined && data.paymentAmount !== null 
                  ? Number(data.paymentAmount) 
                  : (isManual ? 0 : 999);

                // Use paidAt timestamp, falling back to createdAt
                const paidDateStr = data.paidAt || data.createdAt;
                if (paidDateStr && paidDateStr.startsWith(currentYearMonth)) {
                  salesThisMonth++;
                  revenueThisMonth += amt;
                }
              }

              agencyCards.push({
                slug: data.slug,
                bride: data.bride,
                groom: data.groom,
                createdAt: data.createdAt,
                paidAt: data.paidAt || null,
                isPaid,
                views: data.views || 0,
                paymentAmount: amt
              });
            }
          } catch (e) {
            // ignore malformed
          }
        }
      }
    }

    // Format aggregates
    const dailyViewsArray = Object.entries(dailyViewsAggregate)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const trafficSourcesArray = Object.entries(trafficSourcesAggregate)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    const cardConversionRate = createdCount > 0 ? (paidCount / createdCount) * 100 : 0;

    res.json({
      agencyId,
      createdCount,
      paidCount,
      salesThisMonth,
      revenueThisMonth,
      cardConversionRate,
      dailyViews: dailyViewsArray,
      trafficSources: trafficSourcesArray,
      cards: agencyCards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error) {
    console.error("Error generating agency stats:", error);
    res.status(500).json({ error: "Failed to generate agency stats report" });
  }
});

// API: Admin Login
app.post("/api/admin/login", rateLimitAuthMiddleware, (req, res) => {
  const { username, password } = req.body;
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    res.status(500).json({ error: "Server misconfiguration: admin credentials not set." });
    return;
  }

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
    let websitePaidCount = 0;
    let manualPaidCount = 0;
    let totalRevenue = 0;

    if (fs.existsSync(INVITATIONS_DIR)) {
      const files = fs.readdirSync(INVITATIONS_DIR);
      totalInvitations = files.filter(f => f.endsWith(".json")).length;

      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = fs.readFileSync(path.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);
            totalViews += (data.views || 0);
            
            const payId = data.razorpayPaymentId;
            if (payId) {
              const isManual = typeof payId === "string" && payId.startsWith("pay_admin_unlock_");
              if (isManual) {
                manualPaidCount++;
              } else {
                websitePaidCount++;
              }

              // Calculate revenue based on custom paymentAmount or default values
              const amt = data.paymentAmount !== undefined && data.paymentAmount !== null 
                ? Number(data.paymentAmount) 
                : (isManual ? 0 : 999);
              totalRevenue += amt;
            }
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
        totalQueries,
        websitePaidCount,
        manualPaidCount,
        totalRevenue
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
              ...data,
              slug: data.slug,
              bride: data.bride,
              groom: data.groom,
              wdate: data.wdate,
              city: data.city,
              ownerEmail: data.ownerEmail || "",
              views: data.views || 0,
              createdDate: data.createdDate || data.date || data.createdAt || "",
              razorpayPaymentId: data.razorpayPaymentId || null,
              editPassword: data.editPassword || "",
              religion: data.religion || "other",
            });
          } catch (e) {
            // ignore
          }
        }
      }
    }
    // Sort date-wise: newest created invitations first
    list.sort((a, b) => {
      const timeA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
      const timeB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
      return timeB - timeA;
    });
    res.json({ success: true, invitations: list });
  } catch (error) {
    console.error("Failed to list invitations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin Update Invitation Payment Status
app.post("/api/admin/invitations/:slug/payment", requireAdminAuth, (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { razorpayPaymentId } = req.body;
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const oldPaid = !!data.razorpayPaymentId;
    data.razorpayPaymentId = razorpayPaymentId || null;
    const newPaid = !!data.razorpayPaymentId;
    if (newPaid && !oldPaid) {
      data.paidAt = new Date().toISOString();
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, slug, razorpayPaymentId: data.razorpayPaymentId, paidAt: data.paidAt || null });
  } catch (err: any) {
    console.error("Failed to update payment status:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// API: Admin Update Invitation Payment Amount
app.post("/api/admin/invitations/:slug/amount", requireAdminAuth, (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { paymentAmount } = req.body;
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    data.paymentAmount = paymentAmount !== undefined && paymentAmount !== null ? Number(paymentAmount) : null;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, slug, paymentAmount: data.paymentAmount });
  } catch (err: any) {
    console.error("Failed to update payment amount:", err);
    res.status(500).json({ error: "Failed to update payment amount" });
  }
});

// API: Admin Trigger Manual Confirmation Email
app.post("/api/admin/invitations/:slug/send-email", requireAdminAuth, async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const filePath = path.join(INVITATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    if (!data.ownerEmail) {
      res.status(400).json({ error: "Owner email is not configured for this card." });
      return;
    }

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    if (data.razorpayPaymentId) {
      await sendPaymentReceiptEmail(data, appUrl);
    } else {
      await sendConfirmationEmail(data, appUrl);
    }

    res.json({ success: true, message: `Email sent to ${data.ownerEmail}` });
  } catch (err: any) {
    console.error("Failed to trigger email from admin panel:", err);
    res.status(500).json({ error: err.message || "Failed to trigger email notification." });
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

// Helper to get premium HTML email template for confirmation
function getEmailHtmlTemplate(invitation: any, liveLink: string, editLink: string, passcode: string): string {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Digital Wedding Invitation is Live!</title>
  <style>
    body {
      background-color: #FAF6F0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #FFFFFF;
      border: 1px solid #E8DFD3;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(112, 66, 20, 0.05);
    }
    .header-banner {
      background-color: #704214; /* Sepia */
      background: linear-gradient(135deg, #704214 0%, #8A521E 100%);
      padding: 35px 20px;
      text-align: center;
      border-bottom: 3px solid #D4A878; /* Copper Accent */
    }
    .header-banner h1 {
      color: #FAF6F0;
      margin: 0;
      font-size: 26px;
      font-weight: 300;
      letter-spacing: 2px;
    }
    .header-banner p {
      color: #E8DFD3;
      margin: 5px 0 0 0;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .content-body {
      padding: 40px 30px;
      color: #332211;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: bold;
      color: #704214;
      margin-bottom: 20px;
    }
    .details-box {
      background-color: #FAF6F0;
      border-left: 4px solid #D4A878; /* Copper */
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .details-row {
      margin-bottom: 12px;
    }
    .details-row:last-child {
      margin-bottom: 0;
    }
    .details-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8A735E;
      margin-bottom: 2px;
    }
    .details-value {
      font-size: 15px;
      font-weight: 600;
      color: #4D3319;
    }
    .details-value a {
      color: #D48C6F; /* Copper link */
      text-decoration: none;
      border-bottom: 1px dashed #D48C6F;
    }
    .passcode-badge {
      display: inline-block;
      background-color: #E8DFD3;
      color: #704214;
      font-family: monospace;
      font-size: 16px;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .features-list {
      margin: 25px 0;
      padding: 0;
      list-style: none;
    }
    .feature-item {
      font-size: 14px;
      color: #4D3319;
      margin-bottom: 10px;
      padding-left: 25px;
      position: relative;
    }
    .feature-item::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #D48C6F; /* Copper check */
      font-weight: bold;
    }
    .cta-upgrade {
      background-color: #FCF9F2;
      border: 1px dashed #D48C6F;
      border-radius: 8px;
      padding: 25px;
      text-align: center;
      margin-top: 30px;
    }
    .cta-upgrade h3 {
      margin: 0 0 10px 0;
      color: #704214;
      font-size: 18px;
    }
    .cta-upgrade p {
      font-size: 13px;
      color: #8A735E;
      margin: 0 0 20px 0;
    }
    .btn-upgrade {
      display: inline-block;
      background-color: #D48C6F; /* Copper */
      color: #FFFFFF !important;
      text-decoration: none !important;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
      letter-spacing: 1px;
      box-shadow: 0 4px 6px rgba(212, 140, 111, 0.2);
    }
    .btn-edit {
      display: inline-block;
      background-color: #704214; /* Sepia */
      color: #FFFFFF !important;
      text-decoration: none !important;
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 13px;
      margin-right: 10px;
    }
    .footer {
      background-color: #FAF6F0;
      border-top: 1px solid #E8DFD3;
      padding: 25px;
      text-align: center;
      font-size: 12px;
      color: #8A735E;
    }
    .footer a {
      color: #704214;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-banner">
      <h1>GetShaadiLink</h1>
      <p>BEAUTIFUL DIGITAL INVITATIONS</p>
    </div>
    
    <div class="content-body">
      <div class="greeting">Congratulations, ${invitation.bride} & ${invitation.groom}!</div>
      <p>Your beautiful digital wedding invitation is successfully generated and live on the internet! You can now share it with your family and guests.</p>
      
      <div class="details-box">
        <div class="details-row">
          <div class="details-label">Live Invitation Link</div>
          <div class="details-value"><a href="${liveLink}" target="_blank">${liveLink}</a></div>
        </div>
        <div class="details-row">
          <div class="details-label">Editing Passcode / Password</div>
          <div class="details-value"><span class="passcode-badge">${passcode}</span></div>
        </div>
      </div>

      <p style="margin-top: 25px; font-weight: bold; color: #704214;">Your card includes these active features:</p>
      <ul class="features-list">
        <li class="feature-item"><strong>Envelope Animation Cover</strong> — Elegant custom-themed entrance animation.</li>
        <li class="feature-item"><strong>Instrumental Background Music</strong> — Soothing, premium backing audio tracks.</li>
        <li class="feature-item"><strong>RSVP blessing wall</strong> — Real-time blessings and wishes submitted by guests.</li>
        <li class="feature-item"><strong>UPI Shagun Gifts</strong> — Integrated gift payments direct to your bank account.</li>
        <li class="feature-item"><strong>Event Venue Directions</strong> — Direct navigation buttons with integrated maps.</li>
      </ul>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${editLink}" target="_blank" class="btn-edit">Edit Wedding Details</a>
      </div>

      <!-- Free Tier Activation CTA -->
      <div class="cta-upgrade">
        <h3>Upgrade to Premium Card</h3>
        <p>Unlock unlimited public views, lifetime invitation hosting, remove free-tier draft labels, and gain full priority support for just a single payment of <strong>₹999</strong>.</p>
        <a href="${liveLink}?pay=true" class="btn-upgrade">Activate Premium Now</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Have questions or need assistance? We are here to help.</p>
      <p>Contact Support at <a href="mailto:support@getshaadilink.in">support@getshaadilink.in</a></p>
      <p style="margin-top: 15px; font-size: 10px;">&copy; ${currentYear} GetShaadiLink. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// Helper to get payment receipt HTML email template
function getPaymentReceiptHtmlTemplate(invitation: any, liveLink: string, editLink: string, passcode: string): string {
  const currentYear = new Date().getFullYear();
  const paymentId = invitation.razorpayPaymentId || "N/A";
  const dateStr = invitation.paidAt
    ? new Date(invitation.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt & Premium Activated!</title>
  <style>
    body { background-color: #FAF6F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 20px auto; background: #FFFFFF; border: 1px solid #E8DFD3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(112, 66, 20, 0.05); }
    .header-banner { background: linear-gradient(135deg, #10B981 0%, #047857 100%); padding: 35px 20px; text-align: center; border-bottom: 3px solid #6EE7B7; }
    .header-banner h1 { color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 2px; }
    .header-banner p { color: #D1FAE5; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 1px; }
    .content-body { padding: 35px 25px; color: #332211; line-height: 1.6; }
    .receipt-box { background-color: #ECFDF5; border: 2px dashed #10B981; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .receipt-row { margin-bottom: 8px; font-size: 14px; }
    .receipt-label { font-weight: 600; color: #065F46; }
    .receipt-val { font-weight: 700; color: #047857; font-family: monospace; }
    .passcode-badge { display: inline-block; background-color: #E8DFD3; color: #704214; font-family: monospace; font-size: 16px; padding: 4px 10px; border-radius: 4px; font-weight: bold; }
    .btn-main { display: inline-block; background-color: #8A3A1A; color: #FFFFFF !important; text-decoration: none !important; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 10px 5px; }
    .btn-secondary { display: inline-block; background-color: #059669; color: #FFFFFF !important; text-decoration: none !important; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 10px 5px; }
    .footer { background-color: #FAF6F0; border-top: 1px solid #E8DFD3; padding: 25px; text-align: center; font-size: 12px; color: #8A735E; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-banner">
      <h1>👑 Premium Card Activated!</h1>
      <p>GETSHAADILINK OFFICIAL RECEIPT</p>
    </div>
    <div class="content-body">
      <h2 style="color: #704214; margin-top: 0;">Congratulations, ${invitation.bride} &amp; ${invitation.groom}! 🎉</h2>
      <p>Your payment of <strong>₹999</strong> has been verified successfully. Your premium digital wedding invitation is now <strong>100% Active with Lifetime Access</strong> and zero advertisements!</p>

      <div class="receipt-box">
        <div style="font-size: 15px; font-weight: bold; color: #065F46; margin-bottom: 12px; border-bottom: 1px solid #A7F3D0; padding-bottom: 6px;">
          🧾 OFFICIAL PAYMENT RECEIPT
        </div>
        <div class="receipt-row"><span class="receipt-label">Amount Paid:</span> <span class="receipt-val">₹999 (INR)</span></div>
        <div class="receipt-row"><span class="receipt-label">Payment Status:</span> <span class="receipt-val">✅ SUCCESSFUL</span></div>
        <div class="receipt-row"><span class="receipt-label">Razorpay Payment ID:</span> <span class="receipt-val">${paymentId}</span></div>
        <div class="receipt-row"><span class="receipt-label">Activation Date:</span> <span class="receipt-val">${dateStr}</span></div>
      </div>

      <div style="background:#FAF6F0; border-left: 4px solid #8A3A1A; padding: 15px; margin: 20px 0;">
        <div style="font-size: 12px; text-transform: uppercase; color: #8A735E;">Your Live Web Address</div>
        <div style="font-size: 16px; font-weight: bold; color: #8A3A1A; margin-top: 4px;"><a href="${liveLink}" target="_blank">${liveLink}</a></div>
        <div style="font-size: 12px; text-transform: uppercase; color: #8A735E; margin-top: 12px;">Your Secret Edit Passcode</div>
        <div style="margin-top: 4px;"><span class="passcode-badge">${passcode}</span></div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${liveLink}" target="_blank" class="btn-main">👉 View Live Card</a>
        <a href="${editLink}" target="_blank" class="btn-secondary">✏️ Manage &amp; Edit Card</a>
      </div>

      <p style="font-size: 13px; color: #666;">Need to make changes later? You have <strong>unlimited free edits forever</strong>. Simply log in with your email (<code>${invitation.ownerEmail || ""}</code>) and secret passcode (<code>${passcode}</code>).</p>
    </div>

    <div class="footer">
      <p>Thank you for choosing GetShaadiLink for your special day! 💍</p>
      <p>Questions? Contact support at <a href="mailto:support@getshaadilink.in">support@getshaadilink.in</a></p>
      <p style="margin-top: 15px; font-size: 10px;">&copy; ${currentYear} GetShaadiLink. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// Multi-port SMTP transport helper
async function sendMailHelper(mailOptions: any) {
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("[Email] Warning: SMTP_USER or SMTP_PASS not set in environment.");
    return null;
  }

  // Primary: Port 465 (SSL)
  const primaryTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: parseInt(process.env.SMTP_PORT || "465", 10) === 465,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { rejectUnauthorized: false },
  });

  try {
    const info = await primaryTransporter.sendMail(mailOptions);
    console.log(`[Email] Sent via Primary Transport (Port 465): ${info.messageId}`);
    return info;
  } catch (err: any) {
    console.warn(`[Email] Primary Transport (Port 465) failed: ${err.message}. Trying Fallback (Port 587)...`);
    
    // Fallback: Port 587 (TLS)
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
      });
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[Email] Sent via Fallback Transport (Port 587): ${info.messageId}`);
      return info;
    } catch (fallbackErr: any) {
      console.error(`[Email] Both Primary & Fallback SMTP Transports failed:`, fallbackErr.message);
      return null;
    }
  }
}

// Function to send confirmation email via SMTP
async function sendConfirmationEmail(invitation: any, appUrl: string) {
  if (!invitation.ownerEmail) {
    console.log("[Email] Skipping confirmation email: No owner email specified.");
    return;
  }

  const liveLink = `${appUrl}/${invitation.slug}`;
  const passcode = invitation.editPassword || "N/A";
  const editLink = `${appUrl}/${invitation.slug}?edit=true&passcode=${encodeURIComponent(passcode)}`;

  const mailOptions = {
    from: `"GetShaadiLink Invitations" <${process.env.SMTP_USER || "invitations@getshaadilink.in"}>`,
    to: invitation.ownerEmail,
    subject: `Your Digital Wedding Invitation is Live! 💍 (${invitation.bride} & ${invitation.groom})`,
    html: getEmailHtmlTemplate(invitation, liveLink, editLink, passcode),
  };

  await sendMailHelper(mailOptions);
}

// Function to send payment receipt email via SMTP
async function sendPaymentReceiptEmail(invitation: any, appUrl: string) {
  if (!invitation.ownerEmail) {
    console.log("[Email] Skipping payment receipt email: No owner email specified.");
    return;
  }

  const liveLink = `${appUrl}/${invitation.slug}`;
  const passcode = invitation.editPassword || "N/A";
  const editLink = `${appUrl}/${invitation.slug}?edit=true&passcode=${encodeURIComponent(passcode)}`;

  const mailOptions = {
    from: `"GetShaadiLink Payments" <${process.env.SMTP_USER || "invitations@getshaadilink.in"}>`,
    to: invitation.ownerEmail,
    subject: `🎉 Payment Receipt & Premium Activated! (${invitation.bride} & ${invitation.groom})`,
    html: getPaymentReceiptHtmlTemplate(invitation, liveLink, editLink, passcode),
  };

  await sendMailHelper(mailOptions);
}

// API: Generate invitation using Gemini and persist it
app.post("/api/invitations/generate", rateLimitAuthMiddleware, async (req, res) => {
  try {
    const {
      bride, groom, wdate, city, vname, vaddr, lang, story, storyText,
      upiId, shagunOn, photos, heroPhoto, e1n, e1t, e2n, e2t, e3n, e3t,
      slug, editPassword, groomParents, brideParents, familyBlessings,
      postWeddingPhotosUrl, ownerEmail, openingTheme, razorpayPaymentId, religion, agency,
    } = req.body;

    const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!formattedSlug) {
      res.status(400).json({ error: "A valid URL path is required" });
      return;
    }

    // Prevent overwriting an existing invitation with the same slug
    const checkPath = path.join(INVITATIONS_DIR, `${formattedSlug}.json`);
    if (fs.existsSync(checkPath)) {
      res.status(409).json({ error: "This URL path is already taken. Please choose a different one." });
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

Input Event Names to Translate:
- Event 1: "${e1n || 'Haldi Ceremony'}"
- Event 2: "${e2n || 'Sangeet Night'}"
- Event 3: "${e3n || 'Wedding Ceremony'}"

Instructions:
1. Write storyEnglish: Read the couple's raw story, correct any spelling, grammatical, or phrasing errors, and rewrite it into a beautifully polished, elegant, and romantic story of 3-4 sentences in perfect English. Keep all names, dates, and locations, but make it sound premium and warm.
2. Write storyRegional: Translate ONLY the polished storyEnglish version you created in Step 1 into the script of the target regional language (${targetLangName}) (e.g. if target is Kannada write in Kannada script, if Hindi write in Devanagari script). Do NOT directly translate the unpolished raw story, and ensure no raw English words or grammatical errors are carried over.
3. Create tagline: A short romantic heading (8-12 words).
4. Translate the Input Event Names into the target regional language (${targetLangName}) script:
   - Translate Event 1 Name ("${e1n || 'Haldi Ceremony'}") -> save as event1Regional
   - Translate Event 2 Name ("${e2n || 'Sangeet Night'}") -> save as event2Regional
   - Translate Event 3 Name ("${e3n || 'Wedding Ceremony'}") -> save as event3Regional
   If the target regional language is English, make sure event1Regional, event2Regional, event3Regional match the input event names exactly.
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
      if (lang === "hi") {
        polishedRegional = `${bride} और ${groom} का यह सफर प्यार, अटूट विश्वास और साझेदारी की एक सुंदर कहानी है। ` +
          `हम मिले, हमें एक-दूसरे से लगाव हुआ, और हमने हमेशा के लिए एक होने का फैसला किया। ` +
          `अपने सुंदर सपनों और अपनों के आशीर्वाद के साथ, हम ${niceDate} को ${city} में अपने जीवन के इस नए और पावन सफर की शुरुआत कर रहे हैं।`;
      } else if (lang === "kn") {
        polishedRegional = `${bride} ಮತ್ತು ${groom} ರವರ ಈ ಪಯಣವು ಪ್ರೀತಿ, ಪರಸ್ಪರ ನಂಬಿಕೆ ಮತ್ತು ಸುಂದರ ಒಡನಾಟದ ಕಥೆಯಾಗಿದೆ. ` +
          `ನಾವು ಭೇಟಿಯಾದೆವು, ಪ್ರೀತಿಯಲ್ಲಿ ಬಿದ್ದೆವು ಮತ್ತು ನಮ್ಮ ಜೀವನವನ್ನು ಎಂದೆಂದಿಗೂ ಒಟ್ಟಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ನಿರ್ಧರಿಸಿದೆವು. ` +
          `ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಮತ್ತು ಹಂಚಿಕೊಂಡ ಕನಸುಗಳೊಂದಿಗೆ, ನಾವು ${niceDate} ರಂದು ${city} ನಲ್ಲಿ ನಮ್ಮ ಜೀವನದ ಹೊಸ ಹೆಜ್ಜೆಯನ್ನು ಇಡುತ್ತಿದ್ದೇವೆ.`;
      } else if (lang === "ta") {
        polishedRegional = `${bride} மற்றும் ${groom} இன் இந்த பயணம் காதல், பரஸ்பர நம்பிக்கை மற்றும் துணையின் அழகான கதையாகும். ` +
          `நாங்கள் சந்தித்தோம், காதலித்தோம், எங்கள் வாழ்க்கையை என்றென்றும் பகிர்ந்து கொள்ள முடிவு செய்தோம். ` +
          `அன்பானவர்களின் ஆசி மற்றும் பகிரப்பட்ட கனவுகளுடன், நாம் ${niceDate} அன்று ${city} இல் எங்கள் புதிய வாழ்க்கையைத் தொடங்குகிறோம்.`;
      } else if (lang === "te") {
        polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ, నమ్మకం మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
          `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. ` +
          `పెద్దల ఆశీస్సులు మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
      } else if (lang === "ml") {
        polishedRegional = `${bride} യുടെയും ${groom} ന്റെയും ഈ യാത്ര സ്നേഹത്തിന്റെയും പരസ്പര വിശ്വാസത്തിന്റെയും മനോഹരമായ കഥയാണ്. ` +
          `ഞങ്ങൾ കണ്ടുമുട്ടി, പ്രണയത്തിലായി, ഞങ്ങളുടെ ജീവിതം എന്നെന്നേക്കുമായി പങ്കിടാൻ തീരുമാനിച്ചു. ` +
          `പ്രിയപ്പെട്ടവരുടെ അനുഗ്രഹത്തോടെയും സ്വപ്നങ്ങളോടെയും, ഞങ്ങൾ ${niceDate}-ൽ ${city}-ൽ ഞങ്ങളുടെ പുതിയ ജീവിതം ആരംഭിക്കുന്നു.`;
      }

      parsedAiResult = {
        storyEnglish: polishedEnglish,
        storyRegional: polishedRegional,
        tagline: `${bride} & ${groom}'s Sacred Wedding Celebration`,
        event1Regional: translateEventName(e1n || "Haldi Ceremony", lang),
        event2Regional: translateEventName(e2n || "Sangeet Night", lang),
        event3Regional: translateEventName(e3n || "Wedding Ceremony", lang),
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
      religion: religion || "other",
      razorpayPaymentId: razorpayPaymentId || null,
      agency: agency || null,
      paidAt: razorpayPaymentId ? new Date().toISOString() : null,
      dailyViews: {},
      trafficSources: {},
      guestbookNotes: [],
      createdAt: new Date().toISOString(),
      heroPhoto: heroPhoto || null,
    };

    const targetFilePath = path.join(INVITATIONS_DIR, `${formattedSlug}.json`);
    fs.writeFileSync(targetFilePath, JSON.stringify(invitationRecord, null, 2), "utf-8");

    // Send confirmation email asynchronously
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    sendConfirmationEmail(invitationRecord, appUrl).catch((err) => {
      console.error("[Email] Async sendConfirmationEmail failed:", err);
    });

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
            
            const title = `${escapeHtml(data.bride)} & ${escapeHtml(data.groom)}'s Wedding Invitation | GetShaadiLink`;
            const description = `Join us to celebrate our wedding at ${escapeHtml(data.vname)}, ${escapeHtml(data.city)} on ${escapeHtml(data.niceDate)}. Click to view details and RSVP.`;
            const ogImage = data.photos && data.photos.length > 0 ? escapeHtml(data.photos[0]) : `${req.protocol}://${req.get("host")}/samples/couple1.jpg`;
            
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
        } else {
          // Slug was deleted or does not exist — respond with 404 + noindex tags for search engines
          res.status(404);
          res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
          const noIndexTags = `
            <title>404 — Invitation Not Found | GetShaadiLink</title>
            <meta name="robots" content="noindex, nofollow, noarchive" />
          `;
          html = html.replace("</head>", `${noIndexTags}</head>`);
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
