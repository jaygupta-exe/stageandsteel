import { NextResponse } from "next/server";
import { DEFAULT_COUPONS, Coupon } from "@/lib/coupons";
import { db, doc, setDoc, deleteDoc, getDocs, collection } from "@/lib/firebase";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

// Convert JS Object to Firestore REST Format
function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

// Convert Firestore REST Format to JS Object
function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return val.booleanValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return parseFloat(val.doubleValue);
  if ("stringValue" in val) return val.stringValue;
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

// Direct REST save to Firestore
async function saveCouponViaRest(coupon: Coupon): Promise<boolean> {
  const cleanCode = coupon.code.trim().toUpperCase();
  const cleanCoupon = JSON.parse(JSON.stringify({ ...coupon, code: cleanCode }));
  const fields = toFirestoreValue(cleanCoupon).mapValue?.fields || {};

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/coupons/${encodeURIComponent(cleanCode)}?key=${FIREBASE_API_KEY}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Firestore REST API error ${res.status}: ${res.statusText}`);
  }

  return true;
}

// Direct REST delete from Firestore
async function deleteCouponViaRest(code: string): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/coupons/${encodeURIComponent(cleanCode)}?key=${FIREBASE_API_KEY}`;
  const res = await fetch(url, { method: "DELETE", cache: "no-store" });
  if (!res.ok && res.status !== 404) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Firestore REST DELETE error ${res.status}`);
  }
  return true;
}

// Direct REST toggle status
async function toggleCouponViaRest(code: string, isActive: boolean): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/coupons/${encodeURIComponent(cleanCode)}?updateMask.fieldPaths=isActive&key=${FIREBASE_API_KEY}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        isActive: { booleanValue: isActive },
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Firestore REST error ${res.status}`);
  }

  return true;
}

// GET /api/admin/coupons
export async function GET() {
  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/coupons?key=${FIREBASE_API_KEY}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const docs = data.documents || [];
          const list: Coupon[] = [];

          docs.forEach((docItem: any) => {
            const code = docItem.name.split("/").pop() || "";
            const fields = docItem.fields || {};
            const couponObj: Record<string, any> = { code };
            for (const [k, v] of Object.entries(fields)) {
              couponObj[k] = fromFirestoreValue(v);
            }
            couponObj.code = code;
            list.push(couponObj as Coupon);
          });

          if (list.length > 0) {
            return NextResponse.json({ coupons: list, source: "firestore_rest" });
          }
        }
      } catch (restErr) {
        console.warn("REST GET coupons warning:", restErr);
      }
    }

    if (db) {
      try {
        const couponsRef = collection(db, "coupons");
        const snapshot = await getDocs(couponsRef);
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Coupon);
          });
          return NextResponse.json({ coupons: list, source: "firestore_sdk" });
        }
      } catch (sdkErr) {
        console.warn("SDK GET coupons warning:", sdkErr);
      }
    }

    return NextResponse.json({ coupons: DEFAULT_COUPONS, source: "default" });
  } catch (error: any) {
    console.error("API GET coupons error:", error);
    return NextResponse.json({ coupons: DEFAULT_COUPONS, error: error.message }, { status: 200 });
  }
}

// POST /api/admin/coupons - Save / Create coupon
export async function POST(req: Request) {
  try {
    const coupon: Coupon = await req.json();

    if (!coupon || !coupon.code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = coupon.code.trim().toUpperCase();
    const cleanCoupon = { ...coupon, code: cleanCode };

    // 1. Direct REST Save
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        await saveCouponViaRest(cleanCoupon);
        return NextResponse.json({
          success: true,
          code: cleanCode,
          message: "Coupon saved successfully via REST.",
        });
      } catch (restErr: any) {
        console.warn("REST save coupon failed, attempting SDK save:", restErr.message);
      }
    }

    // 2. SDK fallback with timeout
    if (db) {
      const docRef = doc(db, "coupons", cleanCode);
      const savePromise = setDoc(docRef, cleanCoupon, { merge: true });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timed out")), 5000)
      );
      await Promise.race([savePromise, timeoutPromise]);
      return NextResponse.json({
        success: true,
        code: cleanCode,
        message: "Coupon saved successfully via SDK.",
      });
    }

    return NextResponse.json(
      { error: "Firebase credentials missing or database unreachable." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("API POST coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save coupon." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/coupons - Toggle active status
export async function PATCH(req: Request) {
  try {
    const { code, isActive } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        await toggleCouponViaRest(cleanCode, Boolean(isActive));
        return NextResponse.json({ success: true, code: cleanCode, isActive });
      } catch (restErr) {
        console.warn("REST toggle failed, trying SDK:", restErr);
      }
    }

    if (db) {
      const docRef = doc(db, "coupons", cleanCode);
      await setDoc(docRef, { isActive: Boolean(isActive) }, { merge: true });
      return NextResponse.json({ success: true, code: cleanCode, isActive });
    }

    return NextResponse.json({ error: "Firestore not initialized." }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to toggle status." }, { status: 500 });
  }
}

// DELETE /api/admin/coupons - Delete coupon
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        await deleteCouponViaRest(cleanCode);
        return NextResponse.json({ success: true, code: cleanCode, message: "Coupon deleted." });
      } catch (restErr) {
        console.warn("REST delete failed, trying SDK:", restErr);
      }
    }

    if (db) {
      const docRef = doc(db, "coupons", cleanCode);
      await deleteDoc(docRef);
      return NextResponse.json({ success: true, code: cleanCode, message: "Coupon deleted." });
    }

    return NextResponse.json({ error: "Firestore not initialized." }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete coupon." }, { status: 500 });
  }
}

// PUT /api/admin/coupons - Seed default coupons
export async function PUT() {
  try {
    let count = 0;
    for (const coupon of DEFAULT_COUPONS) {
      try {
        if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
          await saveCouponViaRest(coupon);
        } else if (db) {
          const docRef = doc(db, "coupons", coupon.code.toUpperCase());
          await setDoc(docRef, coupon, { merge: true });
        }
        count++;
      } catch (err) {
        console.warn(`Failed to seed coupon ${coupon.code}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      count,
      message: `Successfully synced ${count} coupons to Firestore!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to seed coupons." }, { status: 500 });
  }
}
