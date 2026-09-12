import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "@/lib/firebase";

const WHATSAPP_NUMBER = "919779159169"; // Divesh Mehan (Stage & Steel Owner)
const OWNER_EMAIL = "Stageandsteel26@gmail.com";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

function toFirestoreFields(obj: any): any {
  if (obj === null || obj === undefined) return { nullValue: null };
  if (typeof obj === "boolean") return { booleanValue: obj };
  if (typeof obj === "number") {
    return Number.isInteger(obj) ? { integerValue: String(obj) } : { doubleValue: obj };
  }
  if (typeof obj === "string") return { stringValue: obj };
  if (obj instanceof Date) return { timestampValue: obj.toISOString() };
  if (Array.isArray(obj)) {
    return { arrayValue: { values: obj.map(toFirestoreFields) } };
  }
  if (typeof obj === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        fields[k] = toFirestoreFields(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(obj) };
}

function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return val.booleanValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return parseFloat(val.doubleValue);
  if ("stringValue" in val) return val.stringValue;
  if ("timestampValue" in val) return { toDate: () => new Date(val.timestampValue) };
  if ("arrayValue" in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in val) {
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

function fromFirestoreFields(fields: any): any {
  const obj: Record<string, any> = {};
  for (const [k, v] of Object.entries(fields || {})) {
    obj[k] = fromFirestoreValue(v);
  }
  return obj;
}

export interface PendingOrderPayload {
  orderId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  finalTotal: number;
  items: Array<{
    id: string;
    name: string;
    flavor: string;
    price: string;
    numericPrice: number;
    quantity: number;
    thumbnail?: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

/**
 * 1. Save Pending Order to Firestore (called in /api/cashfree/create-order)
 */
export async function savePendingOrder(payload: PendingOrderPayload): Promise<boolean> {
  const orderDocData = {
    orderId: payload.orderId,
    userId: payload.userId || `cust_${Date.now()}`,
    customerName: payload.customerName || "Stage & Steel Athlete",
    customerEmail: payload.customerEmail || "",
    customerPhone: (payload.customerPhone || "").replace(/[^0-9]/g, ""),
    subtotal: Number(payload.subtotal) || Number(payload.finalTotal),
    discountAmount: Number(payload.discountAmount) || 0,
    couponCode: payload.couponCode || null,
    finalTotal: Number(payload.finalTotal),
    items: payload.items || [],
    shippingAddress: payload.shippingAddress || {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    status: "PENDING",
    paymentGateway: "CASHFREE",
    waybill: null,
    createdAt: new Date().toISOString(),
  };

  // 1. Primary: REST API save (Direct & 100% reliable on server)
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const restUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders/${encodeURIComponent(payload.orderId)}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(restUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: toFirestoreFields(orderDocData).mapValue.fields,
        }),
        cache: "no-store",
      });
      if (res.ok) {
        console.log(`[Fulfillment] Pending order ${payload.orderId} saved via REST.`);
        return true;
      }
    } catch (restErr) {
      console.warn("[Fulfillment] REST pending save warning:", restErr);
    }
  }

  // 2. Fallback: Firebase Web SDK
  if (db) {
    try {
      const orderDocRef = doc(db, "orders", payload.orderId);
      const savePromise = setDoc(
        orderDocRef,
        {
          ...orderDocData,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore save timeout")), 3000)
      );

      await Promise.race([savePromise, timeoutPromise]);
      console.log(`[Fulfillment] Pending order ${payload.orderId} saved via SDK.`);
      return true;
    } catch (error) {
      console.warn("[Fulfillment] Save pending order SDK warning:", error);
    }
  }

  return false;
}

/**
 * 2. Create Delhivery CMU Shipment
 */
export async function createDelhiveryShipment(order: {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{ name: string; flavor?: string; quantity: number }>;
}): Promise<{ success: boolean; waybill: string; rawResponse?: any; error?: string }> {
  const token = process.env.DELHIVERY_API_TOKEN;
  const clientName = process.env.DELHIVERY_CLIENT_NAME || "SANDS NUTRITION SURFACE";

  const fallbackWaybill = `DELHIVERY_EXP_${order.orderId}`;

  if (!token) {
    console.warn("[Delhivery] API token missing. Using fallback waybill:", fallbackWaybill);
    return { success: false, waybill: fallbackWaybill, error: "Delhivery token missing" };
  }

  const cleanPhone = (order.customerPhone || "").replace(/[^0-9]/g, "").slice(-10);
  const cleanPin = (order.shippingAddress?.pincode || "").replace(/[^0-9]/g, "").slice(0, 6);

  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const formattedOrderDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const shipmentData = {
    shipments: [
      {
        name: order.customerName || "Valued Athlete",
        add: order.shippingAddress?.address || "Delivery Address",
        pin: cleanPin,
        city: order.shippingAddress?.city || "Delhi",
        state: order.shippingAddress?.state || "Delhi",
        country: "India",
        phone: cleanPhone.length === 10 ? cleanPhone : "9999193383",
        order: order.orderId,
        payment_mode: "Prepaid",
        return_name: "STAGE & STEEL LABS",
        return_pin: "110063",
        return_city: "Delhi",
        return_phone: "9999193383",
        return_add: "D-74 Shubham Enclave Paschim Vihar",
        return_state: "Delhi",
        return_country: "India",
        products_desc:
          order.items?.map((i) => `${i.name} (${i.flavor || ""})`).join(", ") ||
          "Stage & Steel Sports Nutrition Stack",
        hsn_code: "",
        cod_amount: "0",
        order_date: formattedOrderDate,
        total_amount: String(order.amount || 0),
        seller_add: "D-74 Shubham Enclave Paschim Vihar, Delhi 110063",
        seller_name: "STAGE & STEEL LABS",
        seller_inv: "",
        quantity: String(order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1),
        waybill: "",
        shipment_width: "15",
        shipment_height: "22",
        shipment_length: "15",
        weight: String(1.2 * (order.items?.length || 1)),
        seller_gst_tin: "",
        shipping_mode: "Surface",
        address_type: "home",
      },
    ],
    pickup_location: {
      name: clientName,
    },
  };

  try {
    const formData = new URLSearchParams();
    formData.append("format", "json");
    formData.append("data", JSON.stringify(shipmentData));

    const response = await fetch("https://track.delhivery.com/api/cmu/create.json", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    console.log("[Delhivery] Create shipment response:", data);

    const packages = data?.packages || [];
    const firstPkg = packages[0];

    if (firstPkg && firstPkg.waybill && firstPkg.status?.toLowerCase() !== "fail") {
      return {
        success: true,
        waybill: firstPkg.waybill,
        rawResponse: data,
      };
    }

    // If Delhivery returns remarks or issues
    const errorRmk =
      firstPkg?.remarks?.join("; ") ||
      data.rmk ||
      (typeof data.error === "string" ? data.error : JSON.stringify(data.error || data)) ||
      "Manifest issue";
    return {
      success: false,
      waybill: fallbackWaybill,
      rawResponse: data,
      error: errorRmk,
    };
  } catch (err: any) {
    console.error("[Delhivery] Shipment creation API error:", err);
    return {
      success: false,
      waybill: fallbackWaybill,
      error: err?.message,
    };
  }
}

/**
 * 3. Send Resend Confirmation Email to Customer & Owner
 */
export async function sendOrderEmails(order: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  finalTotal: number;
  waybill?: string | null;
  couponCode?: string | null;
  items: Array<{ name: string; flavor?: string; quantity: number; numericPrice: number }>;
  shippingAddress: { address: string; city: string; state: string; pincode: string };
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@stageandsteel.in";
  const itemsHtml = (order.items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #2e302b;color:#F4F4F1;font-size:13px;">${item.quantity}× ${item.name} (${item.flavor || "Default"})</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2e302b;color:#9DB25E;font-size:13px;text-align:right;">₹${(item.numericPrice * item.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const trackingHtml = order.waybill
    ? `<div style="margin:16px 0;padding:14px 16px;background:#1a1b18;border:1px solid #333530;border-radius:4px;">
        <p style="color:#9DB25E;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 6px 0;">🚚 DELHIVERY TRACKING</p>
        <p style="color:#F4F4F1;font-size:14px;font-weight:700;margin:0 0 8px 0;">AWB: ${order.waybill}</p>
        <a href="https://www.delhivery.com/track/package/${order.waybill}" style="display:inline-block;padding:8px 20px;background:#596238;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;border-radius:2px;">TRACK PACKAGE →</a>
      </div>`
    : "";

  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0c0d0c;font-family:'Courier New',monospace;">
  <div style="max-width:600px;margin:0 auto;background:#161715;border:1px solid #333530;">
    <div style="background:linear-gradient(90deg,#596238,#75804c,#596238);height:4px;"></div>
    <div style="padding:28px 24px;text-align:center;border-bottom:1px solid #262824;">
      <h1 style="color:#F4F4F1;font-size:22px;font-weight:900;letter-spacing:4px;margin:0;">STAGE & STEEL</h1>
      <p style="color:#75804c;font-size:10px;letter-spacing:3px;margin:6px 0 0 0;">PREMIUM SPORTS NUTRITION</p>
    </div>
    <div style="padding:24px;">
      <div style="text-align:center;margin-bottom:20px;">
        <h2 style="color:#F4F4F1;font-size:18px;font-weight:900;letter-spacing:2px;margin:12px 0 4px 0;">ORDER CONFIRMED & PAID</h2>
        <p style="color:#9c9e99;font-size:12px;margin:0;">Payment verified via Cashfree PG. Shipment dispatched via Delhivery Express.</p>
      </div>
      <div style="background:#111210;border:1px solid #2b2d28;border-radius:4px;padding:16px;margin-bottom:16px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr><td style="padding:6px 0;color:#777873;">ORDER ID:</td><td style="padding:6px 0;color:#F4F4F1;font-weight:700;text-align:right;">${order.orderId}</td></tr>
          <tr><td style="padding:6px 0;color:#777873;">CUSTOMER:</td><td style="padding:6px 0;color:#F4F4F1;font-weight:700;text-align:right;">${order.customerName} (${order.customerPhone})</td></tr>
          <tr><td style="padding:6px 0;color:#777873;">AMOUNT PAID:</td><td style="padding:6px 0;color:#9DB25E;font-weight:700;text-align:right;">₹${Number(order.finalTotal).toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:6px 0;color:#777873;">DELIVERY ADDRESS:</td><td style="padding:6px 0;color:#F4F4F1;font-weight:700;text-align:right;">${order.shippingAddress?.address || ""}, ${order.shippingAddress?.city || ""} - ${order.shippingAddress?.pincode || ""}</td></tr>
        </table>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#111210;border:1px solid #2b2d28;border-radius:4px;">
        <thead>
          <tr><th style="padding:10px 12px;text-align:left;color:#75804c;font-size:10px;letter-spacing:2px;border-bottom:1px solid #333530;">ITEM</th><th style="padding:10px 12px;text-align:right;color:#75804c;font-size:10px;letter-spacing:2px;border-bottom:1px solid #333530;">PRICE</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      ${trackingHtml}
    </div>
  </div>
</body>
</html>`;

  // Send to Customer
  if (order.customerEmail && order.customerEmail.includes("@")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Stage & Steel Orders <${fromEmail}>`,
          to: [order.customerEmail],
          subject: `⚡ Order Confirmed: ${order.orderId} | Stage & Steel`,
          html: emailHtml,
        }),
      });
      const data = await res.json();
      console.log("[Resend] Customer email dispatch status:", data);
    } catch (cErr) {
      console.warn("[Resend] Customer email error:", cErr);
    }
  }

  // Send to Owner
  if (OWNER_EMAIL) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Stage & Steel Orders <${fromEmail}>`,
          to: [OWNER_EMAIL],
          subject: `🛒 New Paid Order: ${order.orderId} - ₹${order.finalTotal} (${order.customerName})`,
          html: emailHtml,
        }),
      });
      const data = await res.json();
      console.log("[Resend] Owner notification status:", data);
    } catch (oErr) {
      console.warn("[Resend] Owner notification email error:", oErr);
    }
  }
}

// In-flight fulfillment locks to prevent race conditions across parallel webhook & client verify requests
const inFlightFulfillments = new Map<
  string,
  Promise<{
    success: boolean;
    orderId: string;
    status: string;
    waybill: string;
    whatsappUrl: string;
  }>
>();

/**
 * 4. Master Fulfillment Function
 * Idempotently fulfills any paid order:
 *  - Verifies or loads order from Firestore / Cashfree
 *  - Dispatches Delhivery CMU AWB (single dispatch guarantee)
 *  - Marks Firestore status as "PAID"
 *  - Sends confirmation emails and returns WhatsApp deep link
 */
export async function fulfillPaidOrder(
  orderId: string,
  paymentDetails?: any
): Promise<{
  success: boolean;
  orderId: string;
  status: string;
  waybill: string;
  whatsappUrl: string;
}> {
  if (!orderId) {
    return {
      success: false,
      orderId: "",
      status: "INVALID",
      waybill: "",
      whatsappUrl: "",
    };
  }

  // If already processing in-flight for this order, reuse the same promise to prevent duplicate Delhivery AWBs
  if (inFlightFulfillments.has(orderId)) {
    console.log(`[Fulfillment] Fulfillment for ${orderId} already in flight. Awaiting shared promise...`);
    return await inFlightFulfillments.get(orderId)!;
  }

  const fulfillmentPromise = executeFulfillment(orderId, paymentDetails);
  inFlightFulfillments.set(orderId, fulfillmentPromise);

  try {
    return await fulfillmentPromise;
  } finally {
    inFlightFulfillments.delete(orderId);
  }
}

async function executeFulfillment(
  orderId: string,
  paymentDetails?: any
): Promise<{
  success: boolean;
  orderId: string;
  status: string;
  waybill: string;
  whatsappUrl: string;
}> {
  let orderData: any = null;

  // 1. Primary: REST read
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const restUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders/${encodeURIComponent(orderId)}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(restUrl, { cache: "no-store" });
      if (res.ok) {
        const docData = await res.json();
        if (docData && docData.fields) {
          orderData = fromFirestoreFields(docData.fields);
        }
      }
    } catch (rErr) {
      console.warn("[Fulfillment] REST read order warning:", rErr);
    }
  }

  // 2. Fallback: SDK read
  if (!orderData && db) {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      const snapPromise = getDoc(orderDocRef);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore getDoc timeout")), 3000)
      );
      const orderSnap: any = await Promise.race([snapPromise, timeoutPromise]);
      orderData = orderSnap && orderSnap.exists() ? orderSnap.data() : null;
    } catch (readErr) {
      console.warn("[Fulfillment] Order snapshot read warning:", readErr);
    }
  }

  // If order was not yet pre-saved in Firestore, reconstruct from Cashfree payment details
  if (!orderData && paymentDetails) {
    const cust = paymentDetails.customer_details || {};
    const tags = paymentDetails.order_tags || {};
    orderData = {
      orderId,
      userId: cust.customer_id || `cust_${Date.now()}`,
      customerName: cust.customer_name || "Stage & Steel Athlete",
      customerEmail: cust.customer_email || "",
      customerPhone: cust.customer_phone || "",
      finalTotal: paymentDetails.order_amount || 0,
      subtotal: paymentDetails.order_amount || 0,
      discountAmount: 0,
      couponCode: null,
      status: "PAID",
      paymentGateway: "CASHFREE",
      items: [
        {
          id: "sports-nutrition-stack",
          name: "Stage & Steel Sports Nutrition Stack",
          flavor: "Standard",
          price: `₹${paymentDetails.order_amount}`,
          numericPrice: paymentDetails.order_amount,
          quantity: 1,
        },
      ],
      shippingAddress: {
        address: tags.address || "Delivery Address",
        city: tags.city || "Delhi",
        state: tags.state || "Delhi",
        pincode: tags.pincode || "110001",
      },
    };
  }

  if (!orderData) {
    console.warn(`[Fulfillment] Order ${orderId} not found in Firestore or Cashfree.`);
    return {
      success: false,
      orderId,
      status: "NOT_FOUND",
      waybill: "",
      whatsappUrl: "",
    };
  }

  // Idempotency: if already paid and has valid Delhivery waybill, return directly
  if (orderData.status === "PAID" && orderData.waybill && !orderData.waybill.startsWith("DELHIVERY_EXP_")) {
    console.log(`[Fulfillment] Order ${orderId} is already fulfilled with AWB ${orderData.waybill}`);
    return {
      success: true,
      orderId,
      status: "PAID",
      waybill: orderData.waybill,
      whatsappUrl: generateWhatsAppUrl(orderData, orderData.waybill),
    };
  }

  // 1. Generate Delhivery Shipment (Only once)
  const shipResult = await createDelhiveryShipment({
    orderId,
    amount: orderData.finalTotal,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    customerEmail: orderData.customerEmail,
    shippingAddress: orderData.shippingAddress,
    items: orderData.items,
  });

  const waybill = shipResult.waybill;

  const updatedPayload = {
    ...orderData,
    status: "PAID",
    waybill,
    delhiveryStatus: shipResult.success ? "MANIFESTED" : "MANUAL_REVIEW",
    delhiveryDetails: shipResult.rawResponse || null,
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 2. Update Firestore Order Record via REST (Primary)
  let savedViaRest = false;
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const restUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders/${encodeURIComponent(orderId)}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(restUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: toFirestoreFields(updatedPayload).mapValue.fields,
        }),
        cache: "no-store",
      });
      if (res.ok) {
        savedViaRest = true;
        console.log(`[Fulfillment] Order ${orderId} marked PAID via REST with Waybill: ${waybill}`);
      }
    } catch (patchErr) {
      console.warn("[Fulfillment] REST fulfillment save warning:", patchErr);
    }
  }

  // Fallback: SDK
  if (!savedViaRest && db) {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      const updatePromise = setDoc(
        orderDocRef,
        {
          ...orderData,
          status: "PAID",
          waybill,
          delhiveryStatus: shipResult.success ? "MANIFESTED" : "MANUAL_REVIEW",
          delhiveryDetails: shipResult.rawResponse || null,
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore setDoc timeout")), 2500)
      );
      await Promise.race([updatePromise, timeoutPromise]);
      console.log(`[Fulfillment] Order ${orderId} marked PAID in Firestore via SDK with Waybill: ${waybill}`);
    } catch (saveErr) {
      console.warn("[Fulfillment] Firestore save warning:", saveErr);
    }
  }

  // 3. Send Notification Emails (asynchronously to avoid blocking verification response)
  sendOrderEmails({
    orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    finalTotal: orderData.finalTotal,
    waybill,
    couponCode: orderData.couponCode,
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
  }).catch((emailErr) => console.warn("[Fulfillment] Email sending warning:", emailErr));

  // 4. WhatsApp deep link
  const whatsappUrl = generateWhatsAppUrl(orderData, waybill);

  return {
    success: true,
    orderId,
    status: "PAID",
    waybill,
    whatsappUrl,
  };
}

function generateWhatsAppUrl(orderData: any, waybill?: string): string {
  const itemsText = (orderData.items || [])
    .map((i: any) => `${i.quantity}x ${i.name} (${i.flavor || "Default"})`)
    .join(", ");

  const whatsappMessage = encodeURIComponent(
    `✅ *Stage & Steel Order Confirmed!*\n\n` +
      `📋 Order ID: *${orderData.orderId}*\n` +
      `👤 Customer: *${orderData.customerName}* (${orderData.customerPhone})\n` +
      `💰 Amount: *₹${Number(orderData.finalTotal).toLocaleString("en-IN")}*\n` +
      `📦 Items: ${itemsText}\n` +
      `📍 Delivery To: ${orderData.shippingAddress?.address || ""}, ${orderData.shippingAddress?.city || ""} - ${orderData.shippingAddress?.pincode || ""}\n` +
      (waybill ? `🚚 Delhivery AWB: *${waybill}*\n` : "") +
      `\nReady for lab packaging & express dispatch! 💪`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
}
