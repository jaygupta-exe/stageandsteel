import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "@/lib/firebase";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

export interface UserIdentifier {
  phone?: string | null;
  email?: string | null;
  userId?: string | null;
}

/**
 * Normalize coupon codes and resolve known aliases
 */
export function normalizeCouponCode(code: string): string {
  const c = (code || "").trim().toUpperCase();
  if (c === "CREAA1300" || c === "POWERDUO" || c === "DUOSTACK" || c === "DUO1300") {
    return "DUO1300";
  }
  if (c === "WHEYTRIO" || c === "TRIOSTACK" || c === "STAGE4200" || c === "TRIO4200") {
    return "TRIO4200";
  }
  if (c === "DIWALI" || c === "DIWALI-15" || c === "DIWALI15") {
    return "DIWALI15";
  }
  return c;
}

/**
 * Extract clean 10-digit Indian phone number
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Clean & lowercase email address
 */
export function cleanEmailAddress(email?: string | null): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

/**
 * Convert email to safe Firestore Document ID key
 */
function emailToKey(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/**
 * Check if a document exists in Firestore (via REST with SDK fallback)
 */
async function checkDocExists(collectionName: string, docId: string): Promise<boolean> {
  if (!docId) return false;

  // 1. Direct REST point-check (Fast, O(1), no indexes required)
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 200) {
        return true;
      }
      if (res.status === 404) {
        return false;
      }
    } catch (restErr) {
      console.warn(`[CouponUsage] REST doc check warning for ${docId}:`, restErr);
    }
  }

  // 2. Client/Server SDK Fallback
  if (db) {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapPromise = getDoc(docRef);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore getDoc timeout")), 2500)
      );
      const snap: any = await Promise.race([snapPromise, timeoutPromise]);
      return snap && snap.exists ? snap.exists() : false;
    } catch (sdkErr) {
      console.warn(`[CouponUsage] SDK doc check warning for ${docId}:`, sdkErr);
    }
  }

  return false;
}

/**
 * Save a document in Firestore (via REST with SDK fallback)
 */
async function saveDocRestOrSdk(collectionName: string, docId: string, data: any): Promise<boolean> {
  if (!docId) return false;

  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const fields: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v === null || v === undefined) {
          fields[k] = { nullValue: null };
        } else if (typeof v === "string") {
          fields[k] = { stringValue: v };
        } else if (typeof v === "number") {
          fields[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
        } else if (typeof v === "boolean") {
          fields[k] = { booleanValue: v };
        } else if (v instanceof Date) {
          fields[k] = { timestampValue: v.toISOString() };
        }
      }
      // Add timestamp
      fields.updatedAt = { timestampValue: new Date().toISOString() };

      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
        cache: "no-store",
      });
      if (res.ok) return true;
    } catch (rErr) {
      console.warn(`[CouponUsage] REST save warning for ${docId}:`, rErr);
    }
  }

  if (db) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch (sErr) {
      console.warn(`[CouponUsage] SDK save warning for ${docId}:`, sErr);
    }
  }

  return false;
}

/**
 * Check if a single user has already redeemed this coupon.
 * High priority, multi-vector verification:
 *   Vector 1: Phone Number (10 digits)
 *   Vector 2: Email Address
 *   Vector 3: Firebase Auth UID
 *   Vector 4: Paid Orders History in Firestore
 */
export async function checkCouponUsage(
  couponCode: string,
  user: UserIdentifier
): Promise<{ alreadyUsed: boolean; reason?: string; matchedBy?: string }> {
  if (!couponCode) return { alreadyUsed: false };

  const canonical = normalizeCouponCode(couponCode);
  const cleanPhone = cleanPhoneNumber(user.phone);
  const cleanEmail = cleanEmailAddress(user.email);
  const userId = user.userId && !user.userId.startsWith("cust_") ? user.userId.trim() : null;

  // 1. Check coupon_usages collection via point-read (Instant O(1))
  const checks: Array<{ key: string; label: string; value: string }> = [];

  if (cleanPhone && cleanPhone.length === 10) {
    checks.push({
      key: `${canonical}_phone_${cleanPhone}`,
      label: `mobile number (${cleanPhone})`,
      value: cleanPhone,
    });
  }

  if (cleanEmail && cleanEmail.includes("@")) {
    checks.push({
      key: `${canonical}_email_${emailToKey(cleanEmail)}`,
      label: `email address (${cleanEmail})`,
      value: cleanEmail,
    });
  }

  if (userId) {
    checks.push({
      key: `${canonical}_user_${userId}`,
      label: "account",
      value: userId,
    });
  }

  for (const check of checks) {
    const exists = await checkDocExists("coupon_usages", check.key);
    if (exists) {
      return {
        alreadyUsed: true,
        reason: `Coupon "${canonical}" has already been redeemed by your ${check.label}. This special offer is limited to 1 use per customer.`,
        matchedBy: check.label,
      };
    }
  }

  // 2. Secondary Safeguard: Search existing paid orders in Firestore
  if (db && (cleanPhone || cleanEmail || userId)) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("couponCode", "==", canonical));
      const snapPromise = getDocs(q);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("orders lookup timeout")), 2500)
      );
      const snap: any = await Promise.race([snapPromise, timeoutPromise]);

      if (snap && !snap.empty) {
        for (const docSnap of snap.docs) {
          const order = docSnap.data();
          const orderStatus = (order.status || "").toUpperCase();

          // Only consider confirmed / paid orders
          if (["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(orderStatus)) {
            const orderPhone = cleanPhoneNumber(order.customerPhone);
            const orderEmail = cleanEmailAddress(order.customerEmail);
            const orderUid = order.userId;

            const phoneMatch = cleanPhone && orderPhone && orderPhone === cleanPhone;
            const emailMatch = cleanEmail && orderEmail && orderEmail === cleanEmail;
            const uidMatch = userId && orderUid && orderUid === userId;

            if (phoneMatch || emailMatch || uidMatch) {
              const matchedLabel = phoneMatch
                ? `mobile number (${cleanPhone})`
                : emailMatch
                ? `email address (${cleanEmail})`
                : "account";

              // Self-heal: backfill coupon_usages so subsequent checks are instant O(1)
              void recordCouponUsage({
                orderId: order.orderId || docSnap.id,
                couponCode: canonical,
                customerPhone: order.customerPhone,
                customerEmail: order.customerEmail,
                userId: order.userId,
                finalTotal: order.finalTotal,
              });

              return {
                alreadyUsed: true,
                reason: `Coupon "${canonical}" was previously redeemed on order #${order.orderId || docSnap.id} by your ${matchedLabel}. Single-use per customer limit applied.`,
                matchedBy: matchedLabel,
              };
            }
          }
        }
      }
    } catch (orderErr) {
      console.warn("[CouponUsage] Orders history check warning:", orderErr);
    }
  }

  return { alreadyUsed: false };
}

/**
 * Permanently record coupon redemption in Firestore upon successful payment/order creation.
 * Writes records under phone, email, and user ID keys.
 */
export async function recordCouponUsage(order: {
  orderId: string;
  couponCode: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  userId?: string | null;
  finalTotal?: number;
}): Promise<boolean> {
  if (!order.couponCode) return false;

  const canonical = normalizeCouponCode(order.couponCode);
  const cleanPhone = cleanPhoneNumber(order.customerPhone);
  const cleanEmail = cleanEmailAddress(order.customerEmail);
  const userId = order.userId && !order.userId.startsWith("cust_") ? order.userId.trim() : null;

  const baseData = {
    couponCode: canonical,
    orderId: order.orderId,
    phone: cleanPhone || null,
    email: cleanEmail || null,
    userId: userId || null,
    finalTotal: Number(order.finalTotal) || 0,
    usedAt: new Date().toISOString(),
  };

  const tasks: Promise<boolean>[] = [];

  if (cleanPhone && cleanPhone.length === 10) {
    const docId = `${canonical}_phone_${cleanPhone}`;
    tasks.push(saveDocRestOrSdk("coupon_usages", docId, baseData));
  }

  if (cleanEmail && cleanEmail.includes("@")) {
    const docId = `${canonical}_email_${emailToKey(cleanEmail)}`;
    tasks.push(saveDocRestOrSdk("coupon_usages", docId, baseData));
  }

  if (userId) {
    const docId = `${canonical}_user_${userId}`;
    tasks.push(saveDocRestOrSdk("coupon_usages", docId, baseData));
  }

  try {
    await Promise.all(tasks);
    console.log(`[CouponUsage] Successfully recorded usage for coupon "${canonical}" (Order: ${order.orderId})`);
    return true;
  } catch (err) {
    console.error("[CouponUsage] Error recording coupon usage:", err);
    return false;
  }
}

