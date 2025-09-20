// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Resend SDK requires Node runtime

const resend = new Resend(process.env.RESEND_API_KEY);

// small helper to sanitize/limit input
function pick(x?: string, n = 2000) {
  return (x ?? "").toString().trim().slice(0, n);
}

/** GET /api/contact  -> quick health check (no secrets) */
export async function GET() {
  const hasKey = !!process.env.RESEND_API_KEY;
  const hasTo = !!(process.env.EMAIL_TO || "").trim();
  const from = (process.env.EMAIL_FROM || "notifications@onresend.com").trim();
  return NextResponse.json({
    ok: true,
    runtime: "node",
    configured: { RESEND_API_KEY: hasKey, EMAIL_TO: hasTo, EMAIL_FROM: from },
  });
}

/** POST /api/contact -> form submit */
export async function POST(req: Request) {
  try {
    // accept JSON or form-encoded
    const ct = req.headers.get("content-type") || "";
    let data: Record<string, string> = {};
    if (ct.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();
      form.forEach((v, k) => (data[k] = String(v)));
    }

    // honeypot
    if (data._gotcha) return NextResponse.json({ ok: true });

    // fields
    const name = pick(data.name);
    const email = pick(data.email);
    const phone = pick(data.phone);
    const address = pick(data.address);
    const service = pick(data.service);
    const message = pick(data.message, 8000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // env checks
    const to = (process.env.EMAIL_TO || "").trim(); // your receiving inbox
    const from = (process.env.EMAIL_FROM || "notifications@onresend.com").trim(); // must be verified or onresend.com
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: RESEND_API_KEY missing" },
        { status: 500 }
      );
    }
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: EMAIL_TO missing" },
        { status: 500 }
      );
    }

    const html = `
      <h2>New Quote Request — Duck Works</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Address:</b> ${address || "-"}</p>
      <p><b>Service:</b> ${service || "-"}</p>
      <p><b>Message:</b></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const result = await resend.emails.send({
      from: `Duck Works <${from}>`, // ✅ FROM = your domain/alias (or notifications@onresend.com)
      to: [to],                     // ✅ TO = where you receive the lead
      replyTo: email,               // ✅ REPLY-TO = customer email (so “Reply” goes to them)
      subject: `New Quote Request from ${name}`,
      html,
      text:
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
        `Address: ${address}\nService: ${service}\n\n${message}`,
    });

    // v6 returns { data, error }
    if ("error" in result && result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { ok: false, error: `Email failed: ${result.error.message || "unknown"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
