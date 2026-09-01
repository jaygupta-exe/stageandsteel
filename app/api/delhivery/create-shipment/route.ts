import { NextResponse } from "next/server";
import { createDelhiveryShipment } from "@/lib/orderFulfillment";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customer, shippingAddress, items } = body;

    if (!orderId || !customer || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required order/customer details" },
        { status: 400 }
      );
    }

    const shipResult = await createDelhiveryShipment({
      orderId,
      amount: amount || 0,
      customerName: customer.name || "Valued Athlete",
      customerPhone: customer.phone || "",
      customerEmail: customer.email || "",
      shippingAddress: {
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || "",
      },
      items: items || [],
    });

    // Update Firestore via REST PATCH immediately
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const patchUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders/${encodeURIComponent(
          orderId
        )}?updateMask.fieldPaths=waybill&updateMask.fieldPaths=delhiveryStatus&key=${FIREBASE_API_KEY}`;

        await fetch(patchUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              waybill: { stringValue: shipResult.waybill },
              delhiveryStatus: {
                stringValue: shipResult.success ? "MANIFESTED" : "MANUAL_REVIEW",
              },
            },
          }),
          cache: "no-store",
        });
      } catch (patchErr) {
        console.warn("[Delhivery Create Shipment] REST Patch warning:", patchErr);
      }
    }

    return NextResponse.json({
      success: shipResult.success,
      waybill: shipResult.waybill,
      orderId,
      status: shipResult.success ? "MANIFESTED" : "FALLBACK",
      error: shipResult.error || null,
      details: shipResult.rawResponse,
    });
  } catch (error: any) {
    console.error("Delhivery create shipment route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
