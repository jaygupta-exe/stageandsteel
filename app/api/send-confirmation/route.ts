import { NextResponse } from "next/server";

const WHATSAPP_NUMBER = "919779159169"; // Divesh Mehan

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      orderAmount,
      items,
      waybill,
      couponCode,
    } = body;

    let emailSent = false;

    // ─── 1. Send Email via Resend ───
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && customerEmail) {
      try {
        const itemsHtml = (items || [])
          .map(
            (item: any) =>
              `<tr>
                <td style="padding:8px 12px;border-bottom:1px solid #2e302b;color:#F4F4F1;font-size:13px;">${item.quantity}× ${item.name}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #2e302b;color:#9DB25E;font-size:13px;text-align:right;">₹${(item.numericPrice * item.quantity).toLocaleString("en-IN")}</td>
              </tr>`
          )
          .join("");

        const trackingHtml = waybill
          ? `<div style="margin:16px 0;padding:14px 16px;background:#1a1b18;border:1px solid #333530;border-radius:4px;">
              <p style="color:#9DB25E;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 6px 0;">🚚 DELHIVERY TRACKING</p>
              <p style="color:#F4F4F1;font-size:14px;font-weight:700;margin:0 0 8px 0;">AWB: ${waybill}</p>
              <a href="https://www.delhivery.com/track/package/${waybill}" style="display:inline-block;padding:8px 20px;background:#596238;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;border-radius:2px;">TRACK PACKAGE →</a>
            </div>`
          : "";

        const couponHtml = couponCode
          ? `<p style="color:#9DB25E;font-size:12px;margin:4px 0;">🏷️ Coupon Applied: <strong>${couponCode}</strong></p>`
          : "";

        const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0c0d0c;font-family:'Courier New',monospace;">
  <div style="max-width:600px;margin:0 auto;background:#161715;border:1px solid #333530;">
    <!-- Header -->
    <div style="background:linear-gradient(90deg,#596238,#75804c,#596238);height:4px;"></div>
    <div style="padding:28px 24px;text-align:center;border-bottom:1px solid #262824;">
      <h1 style="color:#F4F4F1;font-size:22px;font-weight:900;letter-spacing:4px;margin:0;">STAGE & STEEL</h1>
      <p style="color:#75804c;font-size:10px;letter-spacing:3px;margin:6px 0 0 0;">PREMIUM SPORTS NUTRITION</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="display:inline-block;width:50px;height:50px;border-radius:50%;background:rgba(89,98,56,0.2);border:2px solid #9DB25E;line-height:50px;font-size:24px;">✓</div>
        <h2 style="color:#F4F4F1;font-size:18px;font-weight:900;letter-spacing:2px;margin:12px 0 4px 0;">ORDER CONFIRMED</h2>
        <p style="color:#9c9e99;font-size:12px;margin:0;">Your high-purity stack is being prepared for express dispatch.</p>
      </div>

      <!-- Order Details -->
      <div style="background:#111210;border:1px solid #2b2d28;border-radius:4px;padding:16px;margin-bottom:16px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr><td style="padding:6px 0;color:#777873;">ORDER ID:</td><td style="padding:6px 0;color:#F4F4F1;font-weight:700;text-align:right;">${orderId}</td></tr>
          <tr><td style="padding:6px 0;color:#777873;">AMOUNT PAID:</td><td style="padding:6px 0;color:#9DB25E;font-weight:700;text-align:right;">₹${Number(orderAmount).toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:6px 0;color:#777873;">PAYMENT:</td><td style="padding:6px 0;color:#F4F4F1;font-weight:700;text-align:right;">CASHFREE PG (PAID)</td></tr>
        </table>
        ${couponHtml}
      </div>

      <!-- Items Table -->
      <table style="width:100%;border-collapse:collapse;background:#111210;border:1px solid #2b2d28;border-radius:4px;">
        <thead>
          <tr><th style="padding:10px 12px;text-align:left;color:#75804c;font-size:10px;letter-spacing:2px;border-bottom:1px solid #333530;">ITEM</th><th style="padding:10px 12px;text-align:right;color:#75804c;font-size:10px;letter-spacing:2px;border-bottom:1px solid #333530;">PRICE</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      ${trackingHtml}

      <!-- Footer -->
      <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid #262824;">
        <p style="color:#8e9089;font-size:11px;margin:0 0 8px 0;">Thank you for choosing Stage & Steel, ${customerName || "Athlete"}.</p>
        <p style="color:#777873;font-size:10px;margin:0;">Questions? Reply to this email or WhatsApp: +91 97791 59169</p>
        <p style="color:#596238;font-size:9px;letter-spacing:2px;margin:16px 0 0 0;">ENGINEERED FOR PERFORMANCE. BUILT ON DISCIPLINE.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

        const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@stageandsteel.in";

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Stage & Steel <${fromEmail}>`,
            to: [customerEmail],
            subject: `✅ Order Confirmed — ${orderId} | Stage & Steel`,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          console.log("Order confirmation email sent to:", customerEmail);
        } else {
          const errData = await resendRes.json();
          console.warn("Resend email error:", errData);
        }
      } catch (emailErr) {
        console.warn("Email send error:", emailErr);
      }
    }

    // ─── 2. Generate WhatsApp Deep Link ───
    const cleanPhone = (customerPhone || "").replace(/[^0-9]/g, "");
    const itemsSummary = (items || [])
      .map((item: any) => `${item.quantity}× ${item.name} (${item.flavor})`)
      .join(", ");

    const whatsappMessage = encodeURIComponent(
      `✅ *Stage & Steel Order Confirmed!*\n\n` +
        `📋 Order ID: *${orderId}*\n` +
        `💰 Amount Paid: ₹${Number(orderAmount).toLocaleString("en-IN")}\n` +
        `📦 Items: ${itemsSummary}\n` +
        (waybill ? `🚚 Delhivery AWB: ${waybill}\n` : "") +
        (couponCode ? `🏷️ Coupon: ${couponCode}\n` : "") +
        `\nThank you for choosing Stage & Steel! 💪`
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    return NextResponse.json({
      success: true,
      emailSent,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Send confirmation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error", emailSent: false, whatsappUrl: "" },
      { status: 500 }
    );
  }
}
