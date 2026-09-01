import { NextResponse } from "next/server";
import { createDelhiveryShipment } from "@/lib/orderFulfillment";
import { db, doc, updateDoc } from "@/lib/firebase";

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

    if (db) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          waybill: shipResult.waybill,
          delhiveryStatus: shipResult.success ? "MANIFESTED" : "MANUAL_REVIEW",
          delhiveryDetails: shipResult.rawResponse || null,
        });
      } catch (dbErr) {
        console.warn("[Delhivery API] Firestore update error:", dbErr);
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
