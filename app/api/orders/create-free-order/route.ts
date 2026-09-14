import { NextResponse } from "next/server";
import { savePendingOrder, fulfillPaidOrder } from "@/lib/orderFulfillment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderAmount,
      subtotal,
      discountAmount,
      customerDetails,
      items,
      couponCode,
      shippingAddress,
    } = body;

    // Validate that order is genuinely a 100% discounted free order
    if (Number(orderAmount) > 0) {
      return NextResponse.json(
        { error: "This endpoint is only for 100% promotional discount orders (₹0)." },
        { status: 400 }
      );
    }

    // Clean and validate customer details
    const customerPhone = (customerDetails?.phone || "").replace(/[^0-9]/g, "");
    const customerEmail = (customerDetails?.email || "").trim() || "athlete@stageandsteel.com";
    const customerName = (customerDetails?.name || "").trim() || "Stage & Steel Athlete";
    const customerId = customerDetails?.customerId || `cust_${Date.now()}`;

    if (customerPhone.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit mobile number is required for dispatch updates." },
        { status: 400 }
      );
    }

    if (!shippingAddress?.address || shippingAddress.address.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            "Complete delivery address with House/Flat No. & Street is required (minimum 10 characters).",
        },
        { status: 400 }
      );
    }

    const cleanPincode = (shippingAddress?.pincode || "").replace(/[^0-9]/g, "");
    if (cleanPincode.length !== 6) {
      return NextResponse.json(
        { error: "A valid 6-digit PIN code is required for courier routing." },
        { status: 400 }
      );
    }

    // Unique Order ID for Free Promotional Orders
    const orderId = `SS_PROMO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderPayload = {
      orderId,
      userId: customerId,
      customerName,
      customerEmail,
      customerPhone,
      subtotal: Number(subtotal) || Number(discountAmount) || 0,
      discountAmount: Number(discountAmount) || Number(subtotal) || 0,
      couponCode: couponCode || "FREE_PROMO",
      finalTotal: 0,
      items: (items || []).map((i: any) => ({
        id: i.id,
        name: i.name,
        flavor: i.flavor || "Default",
        price: i.price,
        numericPrice: i.numericPrice,
        quantity: i.quantity || 1,
        thumbnail: i.thumbnail || "",
      })),
      shippingAddress: {
        address: (shippingAddress.address || "").trim(),
        city: (shippingAddress.city || "").trim(),
        state: (shippingAddress.state || "").trim(),
        pincode: cleanPincode,
      },
    };

    // 1. Save order to Firestore as PENDING
    await savePendingOrder(orderPayload);

    // 2. Fulfill immediately: Dispatch Delhivery shipment & send confirmation emails
    const fulfillResult = await fulfillPaidOrder(orderId, {
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_amount: 0,
      order_tags: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: cleanPincode,
      },
    });

    return NextResponse.json({
      success: true,
      isFreeOrder: true,
      orderId,
      amount: 0,
      waybill: fulfillResult.waybill,
      whatsappUrl: fulfillResult.whatsappUrl,
    });
  } catch (error: any) {
    console.error("Free order fulfillment internal error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error while placing free order" },
      { status: 500 }
    );
  }
}
