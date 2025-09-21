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
  const bcc = (process.env.EMAIL_BCC || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  return NextResponse.json({
    ok: true,
    runtime: "node",
    configured: { RESEND_API_KEY: hasKey, EMAIL_TO: hasTo, EMAIL_FROM: from, EMAIL_BCC: bcc },
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

    // honeypot (return 200 but do nothing)
    if (data._gotcha) {
      console.warn("Honeypot triggered; returning ok.");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

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
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: RESEND_API_KEY missing" },
        { status: 500 }
      );
    }

    const to = (process.env.EMAIL_TO || "").trim(); // receiving inbox
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Server not configured: EMAIL_TO missing" },
        { status: 500 }
      );
    }

    const from = (process.env.EMAIL_FROM || "notifications@onresend.com").trim(); // verified sender or onresend.com
    const bccList = (process.env.EMAIL_BCC || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

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

    // --- send the email ---
    const result = await resend.emails.send({
      from: `Duck Works <${from}>`,
      to: [to],
      ...(bccList.length ? { bcc: bccList } : {}),
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html,
      text:
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
        `Address: ${address}\nService: ${service}\n\n${message}`,
    });

    // --- v6 shape: { data, error }  -> return useful info for debugging ---
    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { ok: false, error: result.error.message || "unknown", to, from, bcc: bccList },
        { status: 500 }
      );
    }

    // success: include message id and where it was sent
    return NextResponse.json(
      { ok: true, id: result.data?.id ?? null, to, from, bcc: bccList },
      { status: 200 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Server error";
    console.error("Contact API error:", e);
    return NextResponse.json({ ok: false, error: String(msg) }, { status: 500 });
  }
}
