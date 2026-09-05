import { NextResponse } from "next/server";
import { savePendingOrder } from "@/lib/orderFulfillment";

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

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || "SANDBOX";

    if (!appId || !secretKey) {
      return NextResponse.json(
        {
          error: "Cashfree API credentials are not configured in .env.local",
          isConfigured: false,
        },
        { status: 400 }
      );
    }

    if (!orderAmount || orderAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Clean and validate customer details
    const customerPhone = customerDetails?.phone?.replace(/[^0-9]/g, "") || "9999999999";
    const customerEmail = customerDetails?.email || "athlete@stageandsteel.com";
    const customerName = customerDetails?.name || "Stage & Steel Athlete";
    const customerId = customerDetails?.customerId || `cust_${Date.now()}`;

    // Unique Order ID (max 45 chars alphanumeric)
    const orderId = `SS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const cashfreeBaseUrl =
      environment.toUpperCase() === "PRODUCTION"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    const originHeader = req.headers.get("origin");
    const hostHeader = req.headers.get("host");
    let baseUrl = "https://stageandsteel.in";

    if (originHeader && originHeader.startsWith("https://")) {
      baseUrl = originHeader;
    } else if (hostHeader && !hostHeader.includes("localhost") && !hostHeader.includes("127.0.0.1")) {
      baseUrl = `https://${hostHeader}`;
    } else if (environment.toUpperCase() !== "PRODUCTION" && originHeader) {
      baseUrl = originHeader;
    }

    const payload = {
      order_id: orderId,
      order_amount: Number(orderAmount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId.substring(0, 45),
        customer_name: customerName.substring(0, 100),
        customer_email: customerEmail,
        customer_phone: customerPhone.length === 10 ? customerPhone : "9999999999",
      },
      order_meta: {
        return_url: `${baseUrl}/api/cashfree/return?order_id={order_id}`,
        notify_url: `${baseUrl}/api/cashfree/webhook`,
      },
      order_note: `Stage & Steel Order: ${items?.length || 1} items${couponCode ? ` (Coupon: ${couponCode})` : ""}`,
    };

    const response = await fetch(cashfreeBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create Cashfree order", details: data },
        { status: response.status }
      );
    }

    // Pre-save pending order in Firestore asynchronously (non-blocking)
    savePendingOrder({
      orderId: data.order_id,
      userId: customerId,
      customerName,
      customerEmail,
      customerPhone,
      subtotal: subtotal || orderAmount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      finalTotal: Number(orderAmount),
      items: (items || []).map((i: any) => ({
        id: i.id,
        name: i.name,
        flavor: i.flavor || "Default",
        price: i.price,
        numericPrice: i.numericPrice,
        quantity: i.quantity || 1,
        thumbnail: i.thumbnail || "",
      })),
      shippingAddress: shippingAddress || {
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
    }).catch((saveErr) => {
      console.warn("Non-blocking savePendingOrder warning:", saveErr);
    });

    return NextResponse.json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderAmount: data.order_amount,
      environment,
    });
  } catch (error: any) {
    console.error("Order creation internal error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
