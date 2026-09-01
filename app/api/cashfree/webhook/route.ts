import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/orderFulfillment";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      body = {};
    }

    console.log("[Cashfree Webhook] Event received:", body?.type || "unknown event");

    // Cashfree sends events such as PAYMENT_SUCCESS_WEBHOOK, ORDER_PAID
    const eventType = body?.type;
    const orderData = body?.data?.order || body?.data;
    const orderId = orderData?.order_id || orderData?.orderId;
    const orderStatus =
      orderData?.order_status ||
      (eventType === "PAYMENT_SUCCESS_WEBHOOK" || eventType === "ORDER_PAID" ? "PAID" : null);

    if (orderId && (orderStatus === "PAID" || eventType === "PAYMENT_SUCCESS_WEBHOOK")) {
      console.log(`[Cashfree Webhook] Order ${orderId} is PAID. Fulfilling order...`);
      try {
        await fulfillPaidOrder(orderId, orderData);
      } catch (err) {
        console.error("[Cashfree Webhook] Fulfillment error:", err);
      }
    }

    return NextResponse.json({ status: "OK", received: true });
  } catch (error: any) {
    console.error("[Cashfree Webhook] Error:", error);
    return NextResponse.json({ status: "ERROR", message: error?.message }, { status: 500 });
  }
}
