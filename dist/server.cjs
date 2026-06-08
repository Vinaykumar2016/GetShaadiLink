var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
app.use(import_express.default.urlencoded({ limit: "25mb", extended: true }));
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var INVITATIONS_DIR = import_path.default.join(DATA_DIR, "invitations");
var REVIEWS_FILE = import_path.default.join(DATA_DIR, "reviews.json");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR);
}
if (!import_fs.default.existsSync(INVITATIONS_DIR)) {
  import_fs.default.mkdirSync(INVITATIONS_DIR);
}
if (!import_fs.default.existsSync(REVIEWS_FILE)) {
  import_fs.default.writeFileSync(REVIEWS_FILE, "[]", "utf-8");
}
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini features will fail.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_BUILD",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.get("/api/check-slug/:slug", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!slug) {
    res.json({ available: false });
    return;
  }
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  const exists = import_fs.default.existsSync(filePath);
  res.json({ available: !exists });
});
function readReviews() {
  try {
    if (!import_fs.default.existsSync(REVIEWS_FILE)) return [];
    return JSON.parse(import_fs.default.readFileSync(REVIEWS_FILE, "utf-8")) || [];
  } catch {
    return [];
  }
}
function writeReviews(reviews) {
  import_fs.default.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}
function computeStats() {
  const approved = readReviews().filter((r) => r.status === "approved");
  const avg = approved.length > 0 ? approved.reduce((sum, r) => sum + (r.stars || 5), 0) / approved.length : 0;
  return { totalReviews: approved.length, averageRating: Math.round(avg * 10) / 10 };
}
app.get("/api/stats", (req, res) => {
  try {
    const files = import_fs.default.readdirSync(INVITATIONS_DIR);
    const jsonFilesCount = files.filter((f) => f.endsWith(".json")).length;
    const { totalReviews, averageRating } = computeStats();
    res.json({
      totalGenerated: jsonFilesCount,
      rating: averageRating > 0 ? averageRating : 4.9,
      // fallback until first review
      totalReviews
    });
  } catch (error) {
    res.json({ totalGenerated: 0, rating: 4.9, totalReviews: 0 });
  }
});
app.get("/api/reviews", (req, res) => {
  try {
    const approved = readReviews().filter((r) => r.status === "approved");
    approved.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ success: true, reviews: approved });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});
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
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    reviews.push(newReview);
    writeReviews(reviews);
    res.json({ success: true, message: "Thank you! Your review has been submitted and will appear after approval." });
  } catch (err) {
    res.status(500).json({ error: "Failed to save review." });
  }
});
app.get("/api/invitations/:slug", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  if (!import_fs.default.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }
  try {
    const rawData = import_fs.default.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(rawData);
    if (req.query.admin !== "true") {
      parsed.views = (parsed.views || 0) + 1;
      import_fs.default.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
    }
    res.json(parsed);
  } catch (error) {
    console.error("Error reading invitation file:", error);
    res.status(500).json({ error: "Failed to read invitation" });
  }
});
app.post("/api/invitations/:slug/auth", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password } = req.body;
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  if (!import_fs.default.existsSync(filePath)) {
    res.status(404).json({ error: "No invitation exists with this link path." });
    return;
  }
  try {
    const raw = import_fs.default.readFileSync(filePath, "utf-8");
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
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please enter both Email and Password." });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  try {
    const files = import_fs.default.readdirSync(INVITATIONS_DIR);
    const matchedInvitations = [];
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const filePath = import_path.default.join(INVITATIONS_DIR, file);
        try {
          const raw = import_fs.default.readFileSync(filePath, "utf-8");
          const parsed = JSON.parse(raw);
          if (parsed.ownerEmail && parsed.ownerEmail.trim().toLowerCase() === cleanEmail && parsed.editPassword && parsed.editPassword.trim() === cleanPassword) {
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
  } catch (error) {
    console.error("Account login lookup failed:", error);
    res.status(500).json({ error: "Internal server validation failure." });
  }
});
app.post("/api/invitations/:slug/update", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { password, editPassword, ...fields } = req.body;
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  if (!import_fs.default.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found to update." });
    return;
  }
  try {
    const raw = import_fs.default.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const storedPassword = data.editPassword || "";
    const isAuthorized = !storedPassword || password && password.trim() === storedPassword.trim() || editPassword && editPassword.trim() === storedPassword.trim();
    if (!isAuthorized) {
      res.status(401).json({ error: "Invalid passcode. Update unauthorized." });
      return;
    }
    const updatedRecord = {
      ...data,
      ...fields,
      slug,
      editPassword: editPassword !== void 0 ? editPassword.trim() : storedPassword,
      ownerEmail: fields.ownerEmail !== void 0 ? fields.ownerEmail.trim().toLowerCase() : data.ownerEmail,
      openingTheme: fields.openingTheme !== void 0 ? fields.openingTheme : data.openingTheme,
      views: data.views || 0,
      guestbookNotes: fields.guestbookNotes !== void 0 ? fields.guestbookNotes : data.guestbookNotes || []
    };
    import_fs.default.writeFileSync(filePath, JSON.stringify(updatedRecord, null, 2), "utf-8");
    res.json({ success: true, slug });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update invitation." });
  }
});
app.post("/api/invitations/:slug/add-note", (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { name, note, amount } = req.body;
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  if (!import_fs.default.existsSync(filePath)) {
    res.status(404).json({ error: "Wedding page not found." });
    return;
  }
  const noteText = (note || req.body.message || "").trim();
  if (!name || name.trim() === "" || !noteText) {
    res.status(400).json({ error: "Please enter your name and a heartfelt blessing." });
    return;
  }
  try {
    const raw = import_fs.default.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (!data.guestbookNotes) {
      data.guestbookNotes = [];
    }
    const newNote = {
      id: "note_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      note: noteText,
      amount: amount ? String(amount).trim() : void 0,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };
    data.guestbookNotes.push(newNote);
    import_fs.default.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, note: newNote, notes: data.guestbookNotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to register blessing." });
  }
});
app.post("/api/contact/submit", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Please fill out all fields in the contact form." });
    return;
  }
  try {
    const queriesPath = import_path.default.join(DATA_DIR, "support_queries.json");
    let queries = [];
    if (import_fs.default.existsSync(queriesPath)) {
      const raw = import_fs.default.readFileSync(queriesPath, "utf-8");
      queries = JSON.parse(raw);
    }
    const newQuery = {
      id: "query_" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      date: (/* @__PURE__ */ new Date()).toISOString()
    };
    queries.push(newQuery);
    import_fs.default.writeFileSync(queriesPath, JSON.stringify(queries, null, 2), "utf-8");
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const transporter = import_nodemailer.default.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === "465",
        // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
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
Date: ${(/* @__PURE__ */ new Date()).toLocaleString()}
Query ID: ${newQuery.id}`
      };
      transporter.sendMail(mailOptions).catch((err) => {
        console.error("Failed to send support email via SMTP:", err);
      });
    } else {
      console.warn("SMTP email variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) not fully configured. Email was not sent, but query was saved to disk.");
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save support query:", err);
    res.status(500).json({ error: "Failed to submit your support message." });
  }
});
var requireAdminAuth = (req, res, next) => {
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
app.get("/api/admin/reviews", requireAdminAuth, (req, res) => {
  try {
    const reviews = readReviews();
    reviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});
app.post("/api/admin/reviews/:id/approve", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const reviews = readReviews();
    const review = reviews.find((r) => r.id === id);
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
app.delete("/api/admin/reviews/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const reviews = readReviews();
    const idx = reviews.findIndex((r) => r.id === id);
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
app.get("/api/admin/stats", requireAdminAuth, (req, res) => {
  try {
    let totalInvitations = 0;
    let totalViews = 0;
    let totalQueries = 0;
    if (import_fs.default.existsSync(INVITATIONS_DIR)) {
      const files = import_fs.default.readdirSync(INVITATIONS_DIR);
      totalInvitations = files.filter((f) => f.endsWith(".json")).length;
      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = import_fs.default.readFileSync(import_path.default.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);
            totalViews += data.views || 0;
          } catch (e) {
          }
        }
      }
    }
    const queriesPath = import_path.default.join(DATA_DIR, "support_queries.json");
    if (import_fs.default.existsSync(queriesPath)) {
      try {
        const raw = import_fs.default.readFileSync(queriesPath, "utf-8");
        const queries = JSON.parse(raw);
        totalQueries = Array.isArray(queries) ? queries.length : 0;
      } catch (e) {
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
app.get("/api/admin/invitations", requireAdminAuth, (req, res) => {
  try {
    const list = [];
    if (import_fs.default.existsSync(INVITATIONS_DIR)) {
      const files = import_fs.default.readdirSync(INVITATIONS_DIR);
      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = import_fs.default.readFileSync(import_path.default.join(INVITATIONS_DIR, file), "utf-8");
            const data = JSON.parse(raw);
            list.push({
              slug: data.slug,
              bride: data.bride,
              groom: data.groom,
              wdate: data.wdate,
              city: data.city,
              ownerEmail: data.ownerEmail || "",
              views: data.views || 0,
              createdDate: data.createdDate || data.date || ""
            });
          } catch (e) {
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
app.delete("/api/admin/invitations/:slug", requireAdminAuth, (req, res) => {
  const slug = req.params.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
  if (!import_fs.default.existsSync(filePath)) {
    res.status(404).json({ error: "Invitation not found" });
    return;
  }
  try {
    import_fs.default.unlinkSync(filePath);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    res.status(500).json({ error: "Failed to delete invitation" });
  }
});
app.get("/api/admin/queries", requireAdminAuth, (req, res) => {
  try {
    const queriesPath = import_path.default.join(DATA_DIR, "support_queries.json");
    let queries = [];
    if (import_fs.default.existsSync(queriesPath)) {
      const raw = import_fs.default.readFileSync(queriesPath, "utf-8");
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
app.post("/api/admin/queries/:id/update", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "Status field is required" });
    return;
  }
  try {
    const queriesPath = import_path.default.join(DATA_DIR, "support_queries.json");
    if (!import_fs.default.existsSync(queriesPath)) {
      res.status(404).json({ error: "No queries exist" });
      return;
    }
    const raw = import_fs.default.readFileSync(queriesPath, "utf-8");
    const queries = JSON.parse(raw);
    const query = queries.find((q) => q.id === id);
    if (!query) {
      res.status(404).json({ error: "Query not found" });
      return;
    }
    query.status = status;
    import_fs.default.writeFileSync(queriesPath, JSON.stringify(queries, null, 2), "utf-8");
    res.json({ success: true, query });
  } catch (error) {
    console.error("Failed to update query status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/admin/queries/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  try {
    const queriesPath = import_path.default.join(DATA_DIR, "support_queries.json");
    if (!import_fs.default.existsSync(queriesPath)) {
      res.status(404).json({ error: "No queries exist" });
      return;
    }
    const raw = import_fs.default.readFileSync(queriesPath, "utf-8");
    const queries = JSON.parse(raw);
    const index = queries.findIndex((q) => q.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Query not found" });
      return;
    }
    queries.splice(index, 1);
    import_fs.default.writeFileSync(queriesPath, JSON.stringify(queries, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete support query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
      razorpayPaymentId
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
      year: "numeric"
    });
    const langMap = {
      en: "English",
      kn: "Kannada",
      hi: "Hindi",
      ta: "Tamil",
      te: "Telugu",
      ml: "Malayalam"
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
   - heroEmoji: selection of romantic flower or accessory emoji (e.g., \u{1F338}, \u{1F33A}, \u{1F48D}, \u{1FA94})`;
        const geminiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai.Type.OBJECT,
              properties: {
                storyEnglish: { type: import_genai.Type.STRING },
                storyRegional: { type: import_genai.Type.STRING },
                tagline: { type: import_genai.Type.STRING },
                event1Regional: { type: import_genai.Type.STRING },
                event2Regional: { type: import_genai.Type.STRING },
                event3Regional: { type: import_genai.Type.STRING },
                theme: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    name: { type: import_genai.Type.STRING },
                    primary: { type: import_genai.Type.STRING },
                    secondary: { type: import_genai.Type.STRING },
                    accent: { type: import_genai.Type.STRING },
                    bg: { type: import_genai.Type.STRING },
                    heroEmoji: { type: import_genai.Type.STRING }
                  },
                  required: ["name", "primary", "secondary", "accent", "bg", "heroEmoji"]
                }
              },
              required: [
                "storyEnglish",
                "storyRegional",
                "tagline",
                "event1Regional",
                "event2Regional",
                "event3Regional",
                "theme"
              ]
            }
          }
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
      const polishedEnglish = `The journey of ${bride} and ${groom} is a beautiful testament to love and partnership. ` + (rawStory.length > 5 ? rawStory : `We met, fell in love, and decided to share our lives forever.`) + ` Guided by trust and shared dreams, we are taking our next beautiful step together on ${niceDate} in ${city}.`;
      let polishedRegional = polishedEnglish;
      let ev1Reg = e1n || "Haldi Ceremony";
      let ev2Reg = e2n || "Sangeet Night";
      let ev3Reg = e3n || "Wedding Ceremony";
      if (lang === "hi") {
        polishedRegional = `${bride} \u0914\u0930 ${groom} \u0915\u093E \u092F\u0939 \u0938\u092B\u0930 \u092A\u094D\u092F\u093E\u0930 \u0914\u0930 \u0938\u093E\u091D\u0947\u0926\u093E\u0930\u0940 \u0915\u0940 \u090F\u0915 \u0938\u0941\u0902\u0926\u0930 \u0915\u0939\u093E\u0928\u0940 \u0939\u0948\u0964 ` + (rawStory.length > 5 ? `\u0939\u092E\u093E\u0930\u093E \u0938\u092B\u0930: "${rawStory}"\u0964 ` : `\u0939\u092E \u092E\u093F\u0932\u0947, \u0939\u092E\u0947\u0902 \u092A\u094D\u092F\u093E\u0930 \u0939\u0941\u0906, \u0914\u0930 \u0939\u092E\u0928\u0947 \u0939\u092E\u0947\u0936\u093E \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0939\u094B\u0928\u0947 \u0915\u093E \u092B\u0948\u0938\u0932\u093E \u0915\u093F\u092F\u093E\u0964 `) + `\u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0914\u0930 \u0938\u092A\u0928\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925, \u0939\u092E ${niceDate} \u0915\u094B ${city} \u092E\u0947\u0902 \u0905\u092A\u0928\u0947 \u091C\u0940\u0935\u0928 \u0915\u0947 \u0907\u0938 \u0928\u090F \u0938\u092B\u0930 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964`;
        ev1Reg = e1n === "Haldi Ceremony" ? "\u0939\u0932\u094D\u0926\u0940 \u0930\u0938\u094D\u092E" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "\u0938\u0902\u0917\u0940\u0924 \u0938\u0902\u0927\u094D\u092F\u093E" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "\u0936\u0941\u092D \u0935\u093F\u0935\u093E\u0939" : e3n;
      } else if (lang === "kn") {
        polishedRegional = `${bride} \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 ${groom} \u0CB0\u0CB5\u0CB0 \u0C88 \u0CAA\u0CAF\u0CA3\u0CB5\u0CC1 \u0CAA\u0CCD\u0CB0\u0CC0\u0CA4\u0CBF \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C92\u0CA1\u0CA8\u0CBE\u0C9F\u0CA6 \u0CB8\u0CC1\u0C82\u0CA6\u0CB0 \u0C95\u0CA5\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6. ` + (rawStory.length > 5 ? `\u0CA8\u0CAE\u0CCD\u0CAE \u0C95\u0CA5\u0CC6: "${rawStory}"\u0964 ` : `\u0CA8\u0CBE\u0CB5\u0CC1 \u0CAD\u0CC7\u0C9F\u0CBF\u0CAF\u0CBE\u0CA6\u0CC6\u0CB5\u0CC1, \u0CAA\u0CCD\u0CB0\u0CC0\u0CA4\u0CBF\u0CAF\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CBF\u0CA6\u0CCD\u0CA6\u0CC6\u0CB5\u0CC1 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA8\u0CAE\u0CCD\u0CAE \u0C9C\u0CC0\u0CB5\u0CA8\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C8E\u0C82\u0CA6\u0CC6\u0C82\u0CA6\u0CBF\u0C97\u0CC2 \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CB2\u0CC1 \u0CA8\u0CBF\u0CB0\u0CCD\u0CA7\u0CB0\u0CBF\u0CB8\u0CBF\u0CA6\u0CC6\u0CB5\u0CC1. `) + `\u0CA8\u0C82\u0CAC\u0CBF\u0C95\u0CC6 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CCA\u0C82\u0CA1 \u0C95\u0CA8\u0CB8\u0CC1\u0C97\u0CB3\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6, \u0CA8\u0CBE\u0CB5\u0CC1 ${niceDate} \u0CB0\u0C82\u0CA6\u0CC1 ${city} \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CA8\u0CAE\u0CCD\u0CAE \u0C9C\u0CC0\u0CB5\u0CA8\u0CA6 \u0CB9\u0CCA\u0CB8 \u0CB9\u0CC6\u0C9C\u0CCD\u0C9C\u0CC6\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0C87\u0CA1\u0CC1\u0CA4\u0CCD\u0CA4\u0CBF\u0CA6\u0CCD\u0CA6\u0CC7\u0CB5\u0CC6.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "\u0CB9\u0CB3\u0CA6\u0CBF \u0CB6\u0CBE\u0CB8\u0CCD\u0CA4\u0CCD\u0CB0" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "\u0CB8\u0C82\u0C97\u0CC0\u0CA4 \u0CB8\u0C82\u0C9C\u0CC6" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "\u0CB6\u0CC1\u0CAD \u0CB5\u0CBF\u0CB5\u0CBE\u0CB9" : e3n;
      } else if (lang === "ta") {
        polishedRegional = `${bride} \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD ${groom} \u0B87\u0BA9\u0BCD \u0B87\u0BA8\u0BCD\u0BA4 \u0BAA\u0BAF\u0BA3\u0BAE\u0BCD \u0B95\u0BBE\u0BA4\u0BB2\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BC1\u0BA3\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0B85\u0BB4\u0B95\u0BBE\u0BA9 \u0B95\u0BA4\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD. ` + (rawStory.length > 5 ? `\u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BA4\u0BC8: "${rawStory}"\u0964 ` : `\u0BA8\u0BBE\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BBF\u0BA4\u0BCD\u0BA4\u0BCB\u0BAE\u0BCD, \u0B95\u0BBE\u0BA4\u0BB2\u0BBF\u0BA4\u0BCD\u0BA4\u0BCB\u0BAE\u0BCD, \u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BBE\u0BB4\u0BCD\u0B95\u0BCD\u0B95\u0BC8\u0BAF\u0BC8 \u0B8E\u0BA9\u0BCD\u0BB1\u0BC6\u0BA9\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BCA\u0BB3\u0BCD\u0BB3 \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BCB\u0BAE\u0BCD. `) + `\u0BA8\u0BAE\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BC8 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B95\u0BA9\u0BB5\u0BC1\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD, \u0BA8\u0BBE\u0BAE\u0BCD ${niceDate} \u0B85\u0BA9\u0BCD\u0BB1\u0BC1 ${city} \u0B87\u0BB2\u0BCD \u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BB5\u0BBE\u0BB4\u0BCD\u0B95\u0BCD\u0B95\u0BC8\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "\u0BA8\u0BB2\u0B99\u0BCD\u0B95\u0BC1 / \u0BAE\u0B9E\u0BCD\u0B9A\u0BB3\u0BCD \u0BA8\u0BC0\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "\u0B9A\u0B99\u0BCD\u0B95\u0BC0\u0BA4\u0BCD \u0BB5\u0BBF\u0BB4\u0BBE" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3\u0BAE\u0BCD / \u0B9A\u0BC1\u0D2A \u0BAE\u0BC1\u0B95\u0BC2\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD" : e3n;
      } else if (lang === "te") {
        polishedRegional = `${bride} \u0C2E\u0C30\u0C3F\u0C2F\u0C41 ${groom} \u0C32 \u0C08 \u0C2A\u0C4D\u0C30\u0C2F\u0C3E\u0C23\u0C02 \u0C2A\u0C4D\u0C30\u0C47\u0C2E \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2C\u0C02\u0C27\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C12\u0C15 \u0C05\u0C02\u0C26\u0C2E\u0C48\u0C28 \u0C28\u0C3F\u0C26\u0C30\u0C4D\u0C36\u0C28\u0C02. ` + (rawStory.length > 5 ? `\u0C2E\u0C3E \u0C15\u0C25: "${rawStory}"\u0964 ` : `\u0C2E\u0C47\u0C2E\u0C41 \u0C15\u0C32\u0C41\u0C38\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C2E\u0C41, \u0C2A\u0C4D\u0C30\u0C47\u0C2E\u0C32\u0C4B \u0C2A\u0C21\u0C4D\u0C21\u0C3E\u0C2E\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2E\u0C3E \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C3E\u0C32\u0C28\u0C41 \u0C0E\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40 \u0C2A\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C3E\u0C32\u0C28\u0C3F \u0C28\u0C3F\u0C30\u0C4D\u0C23\u0C2F\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C2E\u0C41. `) + `\u0C28\u0C2E\u0C4D\u0C2E\u0C15\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C15\u0C32\u0C32\u0C24\u0C4B, \u0C2E\u0C47\u0C2E\u0C41 ${niceDate} \u0C28 ${city} \u0C32\u0C4B \u0C2E\u0C3E \u0C1C\u0C40\u0C35\u0C3F\u0C24 \u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C05\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C2E\u0C41.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "\u0C39\u0C32\u0C4D\u0C26\u0C40 \u0C35\u0C47\u0C21\u0C41\u0C15" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "\u0D38\u0D02\u0D17\u0C40\u0D24\u0D4D \u0C38\u0C02\u0C27\u0C4D\u0C2F\u0C3E" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "\u0C36\u0C41\u0C2D \u0C15\u0C33\u0C4D\u0C2F\u0C3E\u0C23\u0C02" : e3n;
      } else if (lang === "ml") {
        polishedRegional = `${bride} \u0D2F\u0D41\u0D1F\u0D46\u0D2F\u0D41\u0D02 ${groom} \u0D28\u0D4D\u0D31\u0D46\u0D2F\u0D41\u0D02 \u0D08 \u0D2F\u0D3E\u0D24\u0D4D\u0D30 \u0D38\u0D4D\u0D28\u0D47\u0D39\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D4D\u0D31\u0D46\u0D2F\u0D41\u0D02 \u0D15\u0D42\u0D1F\u0D4D\u0D1F\u0D41\u0D15\u0D46\u0D1F\u0D4D\u0D1F\u0D3F\u0D28\u0D4D\u0D31\u0D46\u0D2F\u0D41\u0D02 \u0D2E\u0D28\u0D4B\u0D39\u0D30\u0D2E\u0D3E\u0D2F \u0D15\u0D25\u0D2F\u0D3E\u0D23\u0D4D. ` + (rawStory.length > 5 ? `\u0D1E\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D15\u0D25: "${rawStory}"\u0964 ` : `\u0D1E\u0D19\u0D4D\u0D19\u0D7E \u0D15\u0D23\u0D4D\u0D1F\u0D41\u0D2E\u0D41\u0D1F\u0D4D\u0D1F\u0D3F, \u0D2A\u0D4D\u0D30\u0D23\u0D2F\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D3E\u0D2F\u0D3F, \u0D1E\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D1C\u0D40\u0D35\u0D3F\u0D24\u0D02 \u0D0E\u0D28\u0D4D\u0D28\u0D46\u0D28\u0D4D\u0D28\u0D47\u0D15\u0D4D\u0D15\u0D41\u0D2E\u0D3E\u0D2F\u0D3F \u0D2A\u0D19\u0D4D\u0D15\u0D3F\u0D1F\u0D3E\u0D7B \u0D24\u0D40\u0D30\u0D41\u0D2E\u0D3E\u0D28\u0D3F\u0D1A\u0D4D\u0D1A\u0D41. `) + `\u0D35\u0D3F\u0D36\u0D4D\u0D35\u0D3E\u0D38\u0D24\u0D4D\u0D24\u0D4B\u0D1F\u0D46\u0D2F\u0D41\u0D02 \u0D38\u0D4D\u0D35\u0D2A\u0D4D\u0D28\u0D19\u0D4D\u0D19\u0D33\u0D4B\u0D1F\u0D46\u0D2F\u0D41\u0D02, \u0D1E\u0D19\u0D4D\u0D19\u0D7E ${niceDate}-\u0D7D ${city}-\u0D7D \u0D1E\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D1C\u0D40\u0D35\u0D3F\u0D24\u0D02 \u0D06\u0D30\u0D02\u0D2D\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D41.`;
        ev1Reg = e1n === "Haldi Ceremony" ? "\u0D39\u0D7D\u0D26\u0D3F \u0D1A\u0D1F\u0D19\u0D4D\u0D19\u0D4D" : e1n;
        ev2Reg = e2n === "Sangeet Night" ? "\u0D38\u0D02\u0D17\u0D40\u0D24\u0D4D \u0D38\u0D28\u0D4D\u0D27\u0D4D\u0D2F" : e2n;
        ev3Reg = e3n === "Wedding Ceremony" ? "\u0D2E\u0D02\u0D17\u0D32\u0D4D\u0D2F \u0D1A\u0D1F\u0D19\u0D4D\u0D19\u0D4D" : e3n;
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
          heroEmoji: "\u{1F338}"
        }
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
        kn: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1",
        hi: "\u0939\u093F\u0902\u0926\u0940",
        ta: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD",
        te: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",
        ml: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02"
      }[lang] || "English",
      events: [
        { name: e1n || "Haldi Ceremony", regional: parsedAiResult.event1Regional, time: e1t || "", emoji: "\u{1F49B}" },
        { name: e2n || "Sangeet Night", regional: parsedAiResult.event2Regional, time: e2t || "", emoji: "\u{1F483}" },
        { name: e3n || "Wedding Ceremony", regional: parsedAiResult.event3Regional, time: e3t || "", emoji: "\u{1F338}" }
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
        heroEmoji: "\u{1F338}"
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const targetFilePath = import_path.default.join(INVITATIONS_DIR, `${formattedSlug}.json`);
    import_fs.default.writeFileSync(targetFilePath, JSON.stringify(invitationRecord, null, 2), "utf-8");
    res.json({ success: true, slug: formattedSlug });
  } catch (error) {
    console.error("AI Generation & storage failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate wedding invitation." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      const slug = req.path.replace(/^\//, "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const indexPath = import_path.default.join(distPath, "index.html");
      if (!import_fs.default.existsSync(indexPath)) {
        res.status(404).send("Build index.html not found.");
        return;
      }
      let html = import_fs.default.readFileSync(indexPath, "utf-8");
      if (slug) {
        const filePath = import_path.default.join(INVITATIONS_DIR, `${slug}.json`);
        if (import_fs.default.existsSync(filePath)) {
          try {
            const rawData = import_fs.default.readFileSync(filePath, "utf-8");
            const data = JSON.parse(rawData);
            const title = `${data.bride} & ${data.groom}'s Wedding Invitation | GetShaadiLink`;
            const description = `Join us to celebrate our wedding at ${data.vname}, ${data.city} on ${data.niceDate}. Click to view details and RSVP.`;
            const ogImage = data.photos && data.photos.length > 0 ? data.photos[0] : `${req.protocol}://${req.get("host")}/samples/couple1.jpg`;
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
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
//# sourceMappingURL=server.cjs.map
