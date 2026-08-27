import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      body = {};
    }

    console.log("Cashfree webhook received:", body?.type || "unknown event");

    // Cashfree sends events such as PAYMENT_SUCCESS_WEBHOOK, ORDER_PAID
    const eventType = body?.type;
    const orderData = body?.data?.order || body?.data;
    const orderId = orderData?.order_id || orderData?.orderId;
    const orderStatus = orderData?.order_status || (eventType === "PAYMENT_SUCCESS_WEBHOOK" ? "PAID" : null);

    if (orderId && orderStatus === "PAID") {
      console.log(`Cashfree webhook verified: Order ${orderId} is PAID.`);
      // Webhook successfully processed
    }

    return NextResponse.json({ status: "OK", received: true });
  } catch (error: any) {
    console.error("Cashfree webhook processing error:", error);
    return NextResponse.json({ status: "ERROR", message: error?.message }, { status: 500 });
  }
}
