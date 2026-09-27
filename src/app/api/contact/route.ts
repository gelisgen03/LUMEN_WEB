import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactField, type ContactInput } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

/** Submissions faster than this after page load are treated as bots. */
const MIN_FILL_MS = 2500;

/**
 * Contact form endpoint. Nothing is stored: the message is forwarded by email
 * through Resend and then discarded. Accepts JSON (fetch) and classic form posts (no JS).
 */
export async function POST(req: NextRequest) {
  const isJson = req.headers.get("content-type")?.includes("application/json");
  const raw: Record<string, unknown> = isJson
    ? await req.json().catch(() => ({}))
    : Object.fromEntries((await req.formData()).entries());

  const locale = raw.locale === "en" ? "en" : "fr";
  const respond = (status: number, body: Record<string, unknown>) => {
    if (isJson) return NextResponse.json(body, { status });
    const state = body.ok ? "sent" : String(body.error ?? "server");
    return NextResponse.redirect(new URL(`/${locale}/contact?etat=${state}`, req.url), 303);
  };

  // Honeypot + timing trap: pretend success so bots learn nothing.
  const startedAt = Number(raw.startedAt);
  if (raw.website || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    return respond(200, { ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    const res = respond(429, { ok: false, error: "rateLimited" });
    res.headers.set("Retry-After", String(limit.retryAfter));
    return res;
  }

  const parsed = contactSchema.safeParse({
    ...raw,
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
  });
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => i.path[0]))].filter(Boolean) as ContactField[];
    return respond(400, { ok: false, error: "validation", fields });
  }

  try {
    await sendEmail(parsed.data);
    return respond(200, { ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err instanceof Error ? err.message : err);
    return respond(502, { ok: false, error: "server" });
  }
}

async function sendEmail(data: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  const text = [
    `Objet : ${data.reason}`,
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    `Structure : ${data.organization || "-"}`,
    `Langue du site : ${data.locale}`,
    "",
    data.message,
  ].join("\n");

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set, message not sent:\n" + text);
      return;
    }
    throw new Error("Contact email is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL).");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `[Site LUMEN] ${data.reason} – ${data.name}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}
