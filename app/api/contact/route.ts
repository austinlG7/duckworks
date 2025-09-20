import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function pick(x?: string, n = 2000) {
  return (x ?? "").toString().trim().slice(0, n);
}

export async function POST(req: Request) {
  try {
    // accept JSON or form-encoded
    let data: Record<string, string> = {};
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) data = await req.json();
    else {
      const form = await req.formData();
      form.forEach((v, k) => (data[k] = String(v)));
    }

    // simple honeypot
    if (data._gotcha) return NextResponse.json({ ok: true });

    const name = pick(data.name);
    const email = pick(data.email);
    const phone = pick(data.phone);
    const address = pick(data.address);
    const message = pick(data.message, 8000);

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <h2>New Quote Request — Duck Works</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Address:</b> ${address || "-"}</p>
      <p><b>Message:</b></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const { error } = await resend.emails.send({
      from: `Duck Works <${process.env.EMAIL_FROM || "notifications@onresend.com"}>`,
      to: [process.env.EMAIL_TO || ""],
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Email failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
