import { NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/orderFulfillment";
import { db, doc, getDoc } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || "SANDBOX";

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: "Cashfree credentials missing" },
        { status: 400 }
      );
    }

    const cashfreeBaseUrl =
      environment.toUpperCase() === "PRODUCTION"
        ? `https://api.cashfree.com/pg/orders/${orderId}`
        : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const response = await fetch(cashfreeBaseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch order status", details: data },
        { status: response.status }
      );
    }

    let waybill: string | null = null;
    let whatsappUrl: string | null = null;
    let dbOrder: any = null;

    if (data.order_status === "PAID") {
      try {
        const fulfillPromise = fulfillPaidOrder(orderId, data);
        const timeoutPromise = new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error("Fulfillment timeout")), 5000)
        );
        const fulfillRes = await Promise.race([fulfillPromise, timeoutPromise]);
        if (fulfillRes) {
          waybill = fulfillRes.waybill;
          whatsappUrl = fulfillRes.whatsappUrl;
        }
      } catch (fErr) {
        console.error("[Verify Order] Fulfillment error (non-fatal):", fErr);
      }
    }

    if (db) {
      try {
        const snapPromise = getDoc(doc(db, "orders", orderId));
        const timeoutPromise = new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error("Firestore read timeout")), 2000)
        );
        const snap = await Promise.race([snapPromise, timeoutPromise]);
        if (snap && snap.exists()) {
          dbOrder = snap.data();
          if (!waybill) waybill = dbOrder.waybill;
        }
      } catch (snapErr) {
        console.warn("[Verify Order] Snapshot read warning:", snapErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderStatus: data.order_status, // "PAID", "ACTIVE", "EXPIRED", "FAILED"
      orderId: data.order_id,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      paymentDetails: data,
      waybill,
      whatsappUrl,
      order: dbOrder,
    });
  } catch (error: any) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
