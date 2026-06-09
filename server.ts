import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import mongoose, { Schema, Document, Model } from "mongoose";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Increase request sizes for base64 photo uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// ─────────────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || "";

function sanitizeMongodbUri(uri: string): string {
  if (!uri) return uri;
  try {
    const prefixMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!prefixMatch) return uri;
    const [_, protocol, rest] = prefixMatch;
    
    const lastAtIdx = rest.lastIndexOf('@');
    if (lastAtIdx === -1) return uri;
    
    const credentials = rest.substring(0, lastAtIdx);
    const hostAndParams = rest.substring(lastAtIdx + 1);
    
    const colonIdx = credentials.indexOf(':');
    if (colonIdx === -1) return uri;
    
    const username = credentials.substring(0, colonIdx);
    const password = credentials.substring(colonIdx + 1);
    
    const decodedPassword = decodeURIComponent(password);
    const encodedPassword = encodeURIComponent(decodedPassword);
    
    const decodedUsername = decodeURIComponent(username);
    const encodedUsername = encodeURIComponent(decodedUsername);
    
    return `${protocol}${encodedUsername}:${encodedPassword}@${hostAndParams}`;
  } catch (err) {
    console.error("Error sanitizing MongoDB URI:", err);
    return uri;
  }
}

async function connectDB(): Promise<boolean> {
  const sanitizedUri = sanitizeMongodbUri(MONGODB_URI);
  if (!sanitizedUri) {
    console.error("❌ MONGODB_URI is not set in Environment Variables. Database features will not work.");
    return false;
  }
  // Retry up to 5 times with increasing delay
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await mongoose.connect(sanitizedUri, {
        dbName: "getshaadilink",
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log("✅ Connected to MongoDB Atlas successfully.");
      return true;
    } catch (err: any) {
      console.error(`❌ MongoDB connection attempt ${attempt}/5 failed:`, err?.message || err);
      if (attempt < 5) {
        const delay = attempt * 3000;
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error("❌ All MongoDB connection attempts failed. Server will start but database features will not work.");
  return false;
}

// ─────────────────────────────────────────────
// Mongoose Schemas & Models
// ─────────────────────────────────────────────

// Invitation — uses strict:false to allow all AI-generated dynamic fields
const invitationSchema = new Schema(
  {
    slug:         { type: String, required: true, unique: true, index: true },
    bride:        String,
    groom:        String,
    wdate:        String,
    niceDate:     String,
    city:         String,
    vname:        String,
    vaddr:        String,
    ownerEmail:   { type: String, default: "" },
    editPassword: { type: String, default: "" },
    openingTheme: { type: String, default: "elephant" },
    views:        { type: Number, default: 0 },
    guestbookNotes: { type: Array, default: [] },
    createdAt:    { type: String, default: () => new Date().toISOString() },
  },
  { strict: false }
);
const Invitation: Model<Document> = mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);

// Review
const reviewSchema = new Schema({
  id:          { type: String, required: true, unique: true, index: true },
  name:        String,
  location:    { type: String, default: "" },
  stars:       { type: Number, default: 5 },
  text:        String,
  status:      { type: String, default: "pending" },
  submittedAt: { type: String, default: () => new Date().toISOString() },
});
const Review: Model<Document> = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// Support Query
const supportQuerySchema = new Schema({
  id:      { type: String, required: true, unique: true, index: true },
  name:    String,
  email:   String,
  subject: String,
  message: String,
  date:    { type: String, default: () => new Date().toISOString() },
  status:  { type: String, default: "open" },
});
const SupportQuery: Model<Document> = mongoose.models.SupportQuery || mongoose.model("SupportQuery", supportQuerySchema);

// ─────────────────────────────────────────────
// Lazy-load Gemini Client
// ─────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Gemini features will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_BUILD",
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

// ─────────────────────────────────────────────
// API: Check if slug is available
// ─────────────────────────────────────────────
app.get("/api/check-slug/:slug", async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!slug) { res.json({ available: false }); return; }
  try {
    const exists = await Invitation.exists({ slug });
    res.json({ available: !exists });
  } catch {
    res.json({ available: false });
  }
});

// ─────────────────────────────────────────────
// API: Public stats
// ─────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
  try {
    const totalGenerated = await Invitation.countDocuments();
    const approvedReviews = await Review.find({ status: "approved" }).lean();
    const totalReviews = approvedReviews.length;
    const avg = totalReviews > 0
      ? (approvedReviews as any[]).reduce((s, r) => s + (r.stars || 5), 0) / totalReviews
      : 0;
    const averageRating = Math.round(avg * 10) / 10;
    res.json({
      totalGenerated,
      rating: averageRating > 0 ? averageRating : 4.9,
      totalReviews,
    });
  } catch {
    res.json({ totalGenerated: 0, rating: 4.9, totalReviews: 0 });
  }
});

// ─────────────────────────────────────────────
// API: Public — fetch approved reviews
// ─────────────────────────────────────────────
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ submittedAt: -1 })
      .lean();
    res.json({ success: true, reviews });
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// ─────────────────────────────────────────────
// API: Public — submit a new review
// ─────────────────────────────────────────────
app.post("/api/reviews/submit", async (req, res) => {
  const { name, location, stars, text } = req.body;
  if (!name || !text || !stars) {
    res.status(400).json({ error: "Please fill in all required fields." });
    return;
  }
  const starsNum = Math.min(5, Math.max(1, parseInt(stars, 10)));
  if (isNaN(starsNum)) { res.status(400).json({ error: "Invalid star rating." }); return; }
  if (text.trim().length < 20) {
    res.status(400).json({ error: "Please write at least 20 characters in your review." });
    return;
  }
  try {
    const newReview = new Review({
      id: "rev_" + Date.now() + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      location: (location || "").trim(),
      stars: starsNum,
      text: text.trim(),
      status: "pending",
      submittedAt: new Date().toISOString(),
    });
    await newReview.save();
    res.json({ success: true, message: "Thank you! Your review has been submitted and will appear after approval." });
  } catch {
    res.status(500).json({ error: "Failed to save review." });
  }
});

// ─────────────────────────────────────────────
// API: Fetch an invitation by slug
// ─────────────────────────────────────────────
app.get("/api/invitations/:slug", async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  try {
    const invitation = await Invitation.findOne({ slug }).lean() as any;
    if (!invitation) {
      res.status(404).json({ error: "Invitation not found" });
      return;
    }
    // Increment view count unless admin preview
    if (req.query.admin !== "true") {
      await Invitation.updateOne({ slug }, { $inc: { views: 1 } });
      invitation.views = (invitation.views || 0) + 1;
    }
    res.json(invitation);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    res.status(500).json({ error: "Failed to read invitation" });
  }
});

// ─────────────────────────────────────────────
// API: Auth / Login for invitation by slug + password
// ─────────────────────────────────────────────
app.post("/api/invitations/:slug/auth", async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password } = req.body;
  try {
    const invitation = await Invitation.findOne({ slug }).lean() as any;
    if (!invitation) {
      res.status(404).json({ error: "No invitation exists with this link path." });
      return;
    }
    const storedPassword = invitation.editPassword || "";
    if (password && storedPassword && password.trim() === storedPassword.trim()) {
      res.json({ success: true, data: invitation });
    } else if (!storedPassword) {
      res.json({ success: true, data: invitation });
    } else {
      res.status(401).json({ error: "Invalid passcode. Please try again." });
    }
  } catch {
    res.status(500).json({ error: "Server authentication error." });
  }
});

// ─────────────────────────────────────────────
// API: Unified account login — finds all owned invitations by email+password
// ─────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please enter both Email and Password." });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  try {
    const invitations = await Invitation.find({
      ownerEmail: cleanEmail,
      editPassword: cleanPassword,
    }).select("-photos").lean();

    if (!invitations || invitations.length === 0) {
      res.status(401).json({ error: "No invitations match this Email and Passcode/Password combination." });
      return;
    }
    res.json({ success: true, invitations });
  } catch (error) {
    console.error("Account login lookup failed:", error);
    res.status(500).json({ error: "Internal server validation failure." });
  }
});

// ─────────────────────────────────────────────
// API: Update an invitation (after auth)
// ─────────────────────────────────────────────
app.post("/api/invitations/:slug/update", async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password, editPassword, ...fields } = req.body;
  try {
    const invitation = await Invitation.findOne({ slug }).lean() as any;
    if (!invitation) {
      res.status(404).json({ error: "Invitation not found to update." });
      return;
    }
    const storedPassword = invitation.editPassword || "";
    const isAuthorized = !storedPassword ||
      (password && password.trim() === storedPassword.trim()) ||
      (editPassword && editPassword.trim() === storedPassword.trim());

    if (!isAuthorized) {
      res.status(401).json({ error: "Invalid passcode. Update unauthorized." });
      return;
    }

    const updateData: any = {
      ...fields,
      slug,
      editPassword: editPassword !== undefined ? editPassword.trim() : storedPassword,
      ownerEmail: fields.ownerEmail !== undefined ? fields.ownerEmail.trim().toLowerCase() : invitation.ownerEmail,
      openingTheme: fields.openingTheme !== undefined ? fields.openingTheme : invitation.openingTheme,
      guestbookNotes: fields.guestbookNotes !== undefined ? fields.guestbookNotes : (invitation.guestbookNotes || []),
    };
    delete updateData._id;

    await Invitation.updateOne({ slug }, { $set: updateData });
    res.json({ success: true, slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update invitation." });
  }
});

// ─────────────────────────────────────────────
// API: Guest submits a guestbook blessing note
// ─────────────────────────────────────────────
app.post("/api/invitations/:slug/add-note", async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { name, note, amount } = req.body;
  const noteText = (note || req.body.message || "").trim();
  if (!name || name.trim() === "" || !noteText) {
    res.status(400).json({ error: "Please enter your name and a heartfelt blessing." });
    return;
  }
  try {
    const invitation = await Invitation.findOne({ slug });
    if (!invitation) {
      res.status(404).json({ error: "Wedding page not found." });
      return;
    }
    const newNote = {
      id: "note_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      note: noteText,
      amount: amount ? String(amount).trim() : undefined,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    const current = (invitation as any).guestbookNotes || [];
    const updated = [...current, newNote];
    await Invitation.updateOne({ slug }, { $set: { guestbookNotes: updated } });
    res.json({ success: true, note: newNote, notes: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to register blessing." });
  }
});

// ─────────────────────────────────────────────
// API: Submit a support/contact query
// ─────────────────────────────────────────────
app.post("/api/contact/submit", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Please fill out all fields in the contact form." });
    return;
  }
  try {
    const newQuery = new SupportQuery({
      id: "query_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    });
    await newQuery.save();

    // Try to send email notification via SMTP
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: SMTP_PORT === "465",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      transporter.sendMail({
        from: `"${name.trim()} via GetShaadiLink" <${SMTP_USER}>`,
        to: "support@getshaadilink.in",
        replyTo: email.trim(),
        subject: `[Support Query] ${subject.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\n${message.trim()}`,
      }).catch((err) => console.error("SMTP email failed:", err));
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to submit your support message." });
  }
});

// ─────────────────────────────────────────────
// Admin Authorization Middleware
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Admin: Login
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Admin: Fetch all reviews (pending + approved)
// ─────────────────────────────────────────────
app.get("/api/admin/reviews", requireAdminAuth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ submittedAt: -1 }).lean();
    res.json({ success: true, reviews });
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// ─────────────────────────────────────────────
// Admin: Approve / toggle a review
// ─────────────────────────────────────────────
app.post("/api/admin/reviews/:id/approve", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findOne({ id }).lean() as any;
    if (!review) { res.status(404).json({ error: "Review not found." }); return; }
    const newStatus = review.status === "approved" ? "pending" : "approved";
    await Review.updateOne({ id }, { $set: { status: newStatus } });
    res.json({ success: true, review: { ...review, status: newStatus } });
  } catch {
    res.status(500).json({ error: "Failed to update review." });
  }
});

// ─────────────────────────────────────────────
// Admin: Delete a review
// ─────────────────────────────────────────────
app.delete("/api/admin/reviews/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Review.deleteOne({ id });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Review not found." }); return; }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete review." });
  }
});

// ─────────────────────────────────────────────
// Admin: Dashboard Stats
// ─────────────────────────────────────────────
app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
  try {
    const totalInvitations = await Invitation.countDocuments();
    const viewsAgg = await Invitation.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].total : 0;
    const totalQueries = await SupportQuery.countDocuments();
    res.json({ success: true, stats: { totalInvitations, totalViews, totalQueries } });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// Admin: List all invitations
// ─────────────────────────────────────────────
app.get("/api/admin/invitations", requireAdminAuth, async (req, res) => {
  try {
    const invitations = await Invitation.find()
      .select("slug bride groom wdate city ownerEmail views createdAt")
      .sort({ views: -1 })
      .lean();
    res.json({ success: true, invitations });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// Admin: Delete an invitation
// ─────────────────────────────────────────────
app.delete("/api/admin/invitations/:slug", requireAdminAuth, async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  try {
    const result = await Invitation.deleteOne({ slug });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Invitation not found" }); return; }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete invitation" });
  }
});

// ─────────────────────────────────────────────
// Admin: List support queries
// ─────────────────────────────────────────────
app.get("/api/admin/queries", requireAdminAuth, async (req, res) => {
  try {
    const queries = await SupportQuery.find().sort({ date: -1 }).lean();
    res.json({ success: true, queries });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// Admin: Update support query status
// ─────────────────────────────────────────────
app.post("/api/admin/queries/:id/update", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "Status field is required" }); return; }
  try {
    const result = await SupportQuery.updateOne({ id }, { $set: { status } });
    if (result.matchedCount === 0) { res.status(404).json({ error: "Query not found" }); return; }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// Admin: Delete support query
// ─────────────────────────────────────────────
app.delete("/api/admin/queries/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SupportQuery.deleteOne({ id });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Query not found" }); return; }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete query" });
  }
});

// ─────────────────────────────────────────────
// API: Generate invitation using Gemini AI and save to MongoDB
// ─────────────────────────────────────────────
app.post("/api/invitations/generate", async (req, res) => {
  try {
    const {
      bride, groom, wdate, city, vname, vaddr, lang, story, storyText,
      upiId, shagunOn, photos, e1n, e1t, e2n, e2t, e3n, e3t,
      slug, editPassword, groomParents, brideParents, familyBlessings,
      postWeddingPhotosUrl, ownerEmail, openingTheme, razorpayPaymentId,
    } = req.body;

    const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!formattedSlug) { res.status(400).json({ error: "A valid URL path is required" }); return; }
    if (!bride || !groom || !wdate || !city || !vname || !vaddr) {
      res.status(400).json({ error: "Please provide all required wedding details." });
      return;
    }

    const parsedDate = new Date(wdate);
    const niceDate = parsedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const langMap: Record<string, string> = {
      en: "English", kn: "Kannada", hi: "Hindi", ta: "Tamil", te: "Telugu", ml: "Malayalam",
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
                storyEnglish:    { type: Type.STRING },
                storyRegional:   { type: Type.STRING },
                tagline:         { type: Type.STRING },
                event1Regional:  { type: Type.STRING },
                event2Regional:  { type: Type.STRING },
                event3Regional:  { type: Type.STRING },
                theme: {
                  type: Type.OBJECT,
                  properties: {
                    name:      { type: Type.STRING },
                    primary:   { type: Type.STRING },
                    secondary: { type: Type.STRING },
                    accent:    { type: Type.STRING },
                    bg:        { type: Type.STRING },
                    heroEmoji: { type: Type.STRING },
                  },
                  required: ["name", "primary", "secondary", "accent", "bg", "heroEmoji"],
                },
              },
              required: ["storyEnglish", "storyRegional", "tagline", "event1Regional", "event2Regional", "event3Regional", "theme"],
            },
          },
        });

        const aiOutputText = geminiRes.text;
        if (aiOutputText) parsedAiResult = JSON.parse(aiOutputText);
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
        ev3Reg = e3n === "Wedding Ceremony" ? "திருமணம் / சுபமுகூர்த்தம்" : e3n;
      } else if (lang === "te") {
        polishedRegional = `${bride} మరియు ${groom} ల ఈ ప్రయాణం ప్రేమ మరియు బంధానికి ఒక అందమైన నిదర్శనం. ` +
          (rawStory.length > 5 ? `మా కథ: "${rawStory}"। ` : `మేము కలుసుకున్నాము, ప్రేమలో పడ్డాము మరియు మా జీవితాలను ఎప్పటికీ పంచుకోవాలని నిర్ణయించుకున్నాము. `) +
          `నమ్మకం మరియు కలలతో, మేము ${niceDate} న ${city} లో మా జీవిత కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "హల్దీ వేడుక" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "సంగీత్ సంధ్యా" : e2n;
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

    // Build invitation record and save to MongoDB
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
      langNative: { en: "English", kn: "ಕನ್ನಡ", hi: "हिंदी", ta: "தமிழ்", te: "తెలుగు", ml: "മലയാളം" }[lang] || "English",
      events: [
        { name: e1n || "Haldi Ceremony", regional: parsedAiResult.event1Regional, time: e1t || "", emoji: "💛" },
        { name: e2n || "Sangeet Night",   regional: parsedAiResult.event2Regional, time: e2t || "", emoji: "💃" },
        { name: e3n || "Wedding Ceremony",regional: parsedAiResult.event3Regional, time: e3t || "", emoji: "🌸" },
      ],
      shagunOn: !!shagunOn,
      upiId: (upiId || "").trim(),
      dateRaw: wdate,
      photos: photos || [],
      theme: parsedAiResult.theme || {
        name: "Standard Saffron",
        primary: "#C2185B", secondary: "#D4A843", accent: "#2CB5B0", bg: "#08000F", heroEmoji: "🌸",
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

    // Upsert: update if slug exists (re-generation), insert if new
    await Invitation.findOneAndUpdate(
      { slug: formattedSlug },
      { $set: invitationRecord },
      { upsert: true, new: true }
    );

    res.json({ success: true, slug: formattedSlug });
  } catch (error: any) {
    console.error("AI Generation & MongoDB storage failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate wedding invitation." });
  }
});

// ─────────────────────────────────────────────
// Vite / Static file serving + OG meta injection
// ─────────────────────────────────────────────
async function startServer() {
  // Connect to MongoDB first
  await connectDB();

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve from dist/ (same directory as server.cjs)
    const distPath = (() => {
      try { return path.dirname(__filename); } catch { return path.join(process.cwd(), "dist"); }
    })();
    console.log("[Static] Serving from:", distPath);
    app.use(express.static(distPath));

    app.get("*", async (req, res) => {
      const slug = req.path.replace(/^\//, "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const indexPath = path.join(distPath, "index.html");

      if (!fs.existsSync(indexPath)) {
        res.status(404).send("Build index.html not found.");
        return;
      }

      let html = fs.readFileSync(indexPath, "utf-8");

      if (slug) {
        try {
          const invitation = await Invitation.findOne({ slug }).select("bride groom vname city niceDate photos").lean() as any;
          if (invitation) {
            const title = `${invitation.bride} & ${invitation.groom}'s Wedding Invitation | GetShaadiLink`;
            const description = `Join us to celebrate our wedding at ${invitation.vname}, ${invitation.city} on ${invitation.niceDate}. Click to view details and RSVP.`;
            const ogImage = invitation.photos && invitation.photos.length > 0
              ? invitation.photos[0]
              : `${req.protocol}://${req.get("host")}/samples/couple1.jpg`;

            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            html = html.replace("</head>", `
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              <meta property="og:image" content="${ogImage}" />
              <meta property="og:url" content="${req.protocol}://${req.get("host")}/${slug}" />
              <meta property="og:type" content="website" />
              <meta name="twitter:title" content="${title}" />
              <meta name="twitter:description" content="${description}" />
              <meta name="twitter:image" content="${ogImage}" />
            </head>`);
          }
        } catch (err) {
          console.error("Error injecting OG metadata:", err);
        }
      }

      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GetShaadiLink server running on http://localhost:${PORT}`);
  });
}

startServer();
