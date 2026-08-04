import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Required for req.ip to reflect the real client when running behind a
// reverse proxy (Nginx, Render, Railway, Cloudflare).
app.set("trust proxy", 1);

app.use(express.json());

// Simple in-memory rate limit for the public email endpoint, so it cannot be
// used to spam the inbox. Resets on restart, which is fine for a single node.
const DEMO_RATE_WINDOW_MS = 60 * 60 * 1000;
const DEMO_RATE_MAX = 5;
const demoRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (demoRequestLog.get(ip) || []).filter(
    (t) => now - t < DEMO_RATE_WINDOW_MS
  );

  if (recent.length >= DEMO_RATE_MAX) {
    demoRequestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  demoRequestLog.set(ip, recent);
  return false;
}

// API route to send demo request emails using Resend
app.post("/api/book-demo", async (req, res) => {
  try {
    if (isRateLimited(req.ip || "unknown")) {
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }

    const { institutionName, type, contactName, phone, email, board } = req.body;

    if (!institutionName || !contactName || !phone || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set. See .env.example.");
      return res.status(500).json({ error: "Email service is not configured" });
    }

    const resend = new Resend(apiKey);

    const emailSubject = `New Demo Request: ${institutionName} (${type || 'School/Coaching'})`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #eae7de; border-radius: 12px; background-color: #faf9f6;">
        <div style="margin-bottom: 20px; border-bottom: 2px solid #FF6321; padding-bottom: 12px;">
          <h2 style="color: #FF6321; margin: 0; font-size: 20px;">ClassMap Free Demo Request</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #444;">A new institution has submitted a free demo request on ClassMap:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #555; width: 150px;">Institution Name:</td>
            <td style="padding: 10px 0; color: #111; font-weight: 600;">${institutionName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Type:</td>
            <td style="padding: 10px 0; color: #111;">${type}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Contact Person:</td>
            <td style="padding: 10px 0; color: #111; font-weight: 600;">${contactName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone Number:</td>
            <td style="padding: 10px 0; color: #111;"><a href="tel:${phone}" style="color: #FF6321; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Email Address:</td>
            <td style="padding: 10px 0; color: #111;"><a href="mailto:${email}" style="color: #FF6321; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Board / Curriculum:</td>
            <td style="padding: 10px 0; color: #111;">${board}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
          Sent automatically from ClassMap Web Platform
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      // onboarding@resend.dev is Resend's test sender and only delivers to the
      // account owner. Set RESEND_FROM_EMAIL to an address on a domain verified
      // in Resend before going live.
      from: process.env.RESEND_FROM_EMAIL || "ClassMap Demo <onboarding@resend.dev>",
      to: [process.env.DEMO_NOTIFY_EMAIL || "info@classmap.in"],
      subject: emailSubject,
      html: htmlContent,
      replyTo: email,
    });

    console.log("Resend API response:", data);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email via Resend:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Resolved relative to the bundle (build/server.cjs), not the working
    // directory, so the server works when started from anywhere.
    const distPath = process.env.DIST_PATH
      ? path.resolve(process.env.DIST_PATH)
      : path.resolve(__dirname, "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const mode = isProduction ? "production (serving dist/)" : "development (Vite middleware)";
    console.log(`Server running on http://0.0.0.0:${PORT} in ${mode}`);

    if (!process.env.RESEND_API_KEY) {
      console.warn("Warning: RESEND_API_KEY is not set — /api/book-demo will return 500.");
    }
  });
}

startServer();
