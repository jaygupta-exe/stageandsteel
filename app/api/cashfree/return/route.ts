import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/orderFulfillment";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id") || searchParams.get("orderId");

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "stageandsteel.in";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    if (!orderId) {
      return NextResponse.redirect(new URL("/?payment_error=missing_order_id", baseUrl));
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || "SANDBOX";

    if (!appId || !secretKey) {
      console.warn("Cashfree return warning: credentials missing in env");
      return NextResponse.redirect(
        new URL(`/order-success?order_id=${encodeURIComponent(orderId)}&status=PENDING`, baseUrl)
      );
    }

    const cashfreeBaseUrl =
      environment.toUpperCase() === "PRODUCTION"
        ? `https://api.cashfree.com/pg/orders/${orderId}`
        : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    let orderStatus = "PENDING";
    let cashfreeData: any = null;

    try {
      const response = await fetch(cashfreeBaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
        },
        cache: "no-store",
      });

      if (response.ok) {
        cashfreeData = await response.json();
        orderStatus = cashfreeData.order_status || "PENDING";
      }
    } catch (err) {
      console.error("Error verifying order on return:", err);
    }

    // If order is PAID, trigger server-side fulfillment (Delhivery + Firestore + Email)
    if (orderStatus === "PAID") {
      try {
        await fulfillPaidOrder(orderId, cashfreeData);
      } catch (fulfillErr) {
        console.error("[Fulfillment] Return route fulfillment error:", fulfillErr);
      }
    }

    return NextResponse.redirect(
      new URL(
        `/order-success?order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(orderStatus)}`,
        baseUrl
      )
    );
  } catch (error: any) {
    console.error("Cashfree return route error:", error);
    const host = req.headers.get("host") || "stageandsteel.in";
    const baseUrl = host.includes("localhost") ? `http://${host}` : `https://${host}`;
    return NextResponse.redirect(new URL("/?payment_error=callback_failed", baseUrl));
  }
}
