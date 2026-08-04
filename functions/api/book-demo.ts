/**
 * Cloudflare Pages Function — POST /api/book-demo
 *
 * The site deploys to Pages as a static Vite build, so there is no Node server
 * in production. This file runs on Cloudflare's edge and is what actually
 * handles the demo request form once deployed. The Express route in server.ts
 * is the local-development equivalent; keep the two in step.
 *
 * The Resend API key is a real credential — anyone holding it can send mail as
 * you — so it stays here, server-side, and never reaches the browser.
 *
 * Required environment variables (Pages → Settings → Environment variables):
 *   RESEND_API_KEY      secret, from resend.com/api-keys
 *   DEMO_NOTIFY_EMAIL   inbox that should receive demo requests
 *   RESEND_FROM_EMAIL   optional. Must be on a domain verified with Resend.
 *                       Falls back to Resend's test sender, which can only
 *                       deliver to your own account address.
 */

interface Env {
  RESEND_API_KEY: string;
  DEMO_NOTIFY_EMAIL: string;
  RESEND_FROM_EMAIL?: string;
}

/** Trim, coerce to string, and cap the length. */
function field(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Submitted text goes into an HTML email, so it has to be escaped. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * Per-IP submission times.
 *
 * Best-effort only. Each Worker isolate keeps its own copy and they are
 * short-lived, so this catches naive floods rather than a determined attacker.
 * A KV namespace would be the real fix if it ever matters.
 */
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }

  hits.push(now);
  recent.set(ip, hits);
  return false;
}

/**
 * The response shape the modal in src/components/BookAuditModal.tsx reads:
 * it checks `data.success` and displays `data.error`.
 */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const data = (body ?? {}) as Record<string, unknown>;

  // Honeypot — hidden from people, filled by bots. Report success so the bot
  // doesn't come back probing for the real check, but send nothing.
  if (field(data.botcheck, 200)) {
    return json({ success: true });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (rateLimited(ip)) {
    return json(
      { success: false, error: "Too many requests just now. Please try again shortly." },
      429,
    );
  }

  const institutionName = field(data.institutionName, 190);
  const contactName = field(data.contactName, 120);
  const phone = field(data.phone, 30);
  const email = field(data.email, 190);
  const type = field(data.type, 60) || "School/Coaching";
  const board = field(data.board, 60);

  if (!institutionName || !contactName || !phone || !email) {
    return json({ success: false, error: "Missing required fields" }, 400);
  }

  // Deliberately loose — real addresses take shapes strict patterns reject.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: "Enter a valid email address." }, 400);
  }

  // Count digits rather than match a shape; written formats vary too much.
  if (phone.replace(/\D/g, "").length < 10) {
    return json({ success: false, error: "Enter a valid phone number." }, 400);
  }

  if (!env.RESEND_API_KEY || !env.DEMO_NOTIFY_EMAIL) {
    // 503 rather than 500 so a missing-configuration failure can be told apart
    // from an unexpected one without exposing which variable, or its value.
    console.error(
      `[book-demo] not configured — RESEND_API_KEY:${env.RESEND_API_KEY ? "set" : "MISSING"} DEMO_NOTIFY_EMAIL:${env.DEMO_NOTIFY_EMAIL ? "set" : "MISSING"}`,
    );
    return json({ success: false, error: "Could not send your request. Please try again." }, 503);
  }

  const from = env.RESEND_FROM_EMAIL ?? "ClassMap Demo <onboarding@resend.dev>";

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #eae7de; border-radius: 12px; background-color: #faf9f6;">
      <div style="margin-bottom: 20px; border-bottom: 2px solid #FF6321; padding-bottom: 12px;">
        <h2 style="color: #FF6321; margin: 0; font-size: 20px;">ClassMap Free Demo Request</h2>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #444;">A new institution has submitted a free demo request on ClassMap:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: bold; color: #555; width: 150px;">Institution Name:</td>
          <td style="padding: 10px 0; color: #111; font-weight: 600;">${escapeHtml(institutionName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">Type:</td>
          <td style="padding: 10px 0; color: #111;">${escapeHtml(type)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">Contact Person:</td>
          <td style="padding: 10px 0; color: #111; font-weight: 600;">${escapeHtml(contactName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone Number:</td>
          <td style="padding: 10px 0; color: #111;"><a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color: #FF6321; text-decoration: none;">${escapeHtml(phone)}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: bold; color: #555;">Email Address:</td>
          <td style="padding: 10px 0; color: #111;"><a href="mailto:${escapeHtml(email)}" style="color: #FF6321; text-decoration: none;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #555;">Board / Curriculum:</td>
          <td style="padding: 10px 0; color: #111;">${escapeHtml(board)}</td>
        </tr>
      </table>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
        Sent automatically from ClassMap Web Platform
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [env.DEMO_NOTIFY_EMAIL],
        subject: `New Demo Request: ${institutionName} (${type})`,
        // So hitting reply in your mail client writes back to the enquirer.
        reply_to: email,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[book-demo] resend rejected the send:", res.status, detail);
      return json({ success: false, error: "Could not send your request. Please try again." }, 502);
    }

    return json({ success: true });
  } catch (err) {
    console.error("[book-demo] send failed:", err);
    return json({ success: false, error: "Could not send your request. Please try again." }, 500);
  }
}
