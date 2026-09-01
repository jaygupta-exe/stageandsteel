import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "@/lib/firebase";

export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number; // 10 for 10% or 200 for ₹200
  minOrderAmount?: number;
  maxDiscount?: number; // Cap for percentage discounts
  description: string;
  isActive: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: "LAUNCH10",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    description: "Launch Special: 10% OFF on all Stage & Steel products",
    isActive: true,
  },
];

export const AVAILABLE_COUPONS: Coupon[] = DEFAULT_COUPONS;

export interface ValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

/**
 * Fetch all coupons from Firestore / API, falling back to DEFAULT_COUPONS
 */
export async function getAllCoupons(): Promise<Coupon[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/coupons", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons && data.coupons.length > 0) {
          return data.coupons;
        }
      }
    } catch (apiErr) {
      console.warn("API GET coupons error, trying Firestore direct:", apiErr);
    }
  }

  if (!db) return DEFAULT_COUPONS;

  try {
    const couponsRef = collection(db, "coupons");
    const getPromise = getDocs(couponsRef);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore fetch timed out")), 4000)
    );

    const snapshot = await Promise.race([getPromise, timeoutPromise]);

    if (snapshot.empty) {
      return DEFAULT_COUPONS;
    }

    const list: Coupon[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Coupon);
    });
    return list;
  } catch (error) {
    console.warn("Error fetching coupons from Firestore, using default coupons:", error);
    return DEFAULT_COUPONS;
  }
}

/**
 * Save or update a coupon
 */
export async function saveCoupon(coupon: Coupon): Promise<boolean> {
  const cleanCode = coupon.code.trim().toUpperCase();
  const cleanPayload = JSON.parse(JSON.stringify({ ...coupon, code: cleanCode }));

  // 1. Try API Route (REST backend - fast and avoids client hanging)
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save coupon via API.");
      }
      return true;
    } catch (apiErr: any) {
      console.warn("API route save failed, attempting direct Firestore save:", apiErr);
      if (!db) throw apiErr;
    }
  }

  // 2. Direct Firestore fallback with timeout
  if (!db) throw new Error("Firestore is not initialized.");

  try {
    const docRef = doc(db, "coupons", cleanCode);
    const savePromise = setDoc(docRef, cleanPayload, { merge: true });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Direct Firestore save timed out.")), 6000)
    );

    await Promise.race([savePromise, timeoutPromise]);
    return true;
  } catch (err: any) {
    console.error("Direct save error:", err);
    throw err;
  }
}

/**
 * Toggle coupon active status
 */
export async function toggleCouponStatus(code: string, isActive: boolean): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle status via API.");
      }
      return true;
    } catch (apiErr) {
      console.warn("API route toggle failed, attempting direct Firestore toggle:", apiErr);
      if (!db) throw apiErr;
    }
  }

  if (!db) throw new Error("Firestore is not initialized.");

  const docRef = doc(db, "coupons", cleanCode);
  const updatePromise = updateDoc(docRef, { isActive });
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Update timed out")), 5000)
  );

  await Promise.race([updatePromise, timeoutPromise]);
  return true;
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(code: string): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(cleanCode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete coupon via API.");
      }
      return true;
    } catch (apiErr) {
      console.warn("API route delete failed, attempting direct Firestore delete:", apiErr);
      if (!db) throw apiErr;
    }
  }

  if (!db) throw new Error("Firestore is not initialized.");

  const docRef = doc(db, "coupons", cleanCode);
  const deletePromise = deleteDoc(docRef);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Delete timed out")), 5000)
  );

  await Promise.race([deletePromise, timeoutPromise]);
  return true;
}

/**
 * Seed initial coupons into Firestore
 */
export async function seedCoupons(): Promise<{ count: number }> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to seed coupons.");
      }
      return { count: data.count || DEFAULT_COUPONS.length };
    } catch (apiErr) {
      console.warn("API seed failed, attempting direct seed:", apiErr);
      if (!db) throw apiErr;
    }
  }

  if (!db) throw new Error("Firestore not initialized.");

  let count = 0;
  for (const coupon of DEFAULT_COUPONS) {
    const docRef = doc(db, "coupons", coupon.code.toUpperCase());
    await setDoc(docRef, coupon, { merge: true });
    count++;
  }
  return { count };
}

/**
 * Validate coupon against a specific coupons list or default list
 */
export function validateCoupon(
  inputCode: string,
  subtotal: number,
  customCouponsList?: Coupon[]
): ValidationResult {
  if (!inputCode || !inputCode.trim()) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: "Please enter a valid coupon code.",
    };
  }

  const cleanCode = inputCode.trim().toUpperCase();
  const couponsPool = customCouponsList && customCouponsList.length > 0 ? customCouponsList : DEFAULT_COUPONS;
  const coupon = couponsPool.find(
    (c) => c.code.toUpperCase() === cleanCode && c.isActive
  );

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon code "${cleanCode}" is invalid or expired.`,
    };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon requires a minimum order of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === "flat") {
    discount = Math.min(coupon.value, subtotal);
  }

  const finalAmount = Math.max(0, subtotal - discount);

  return {
    isValid: true,
    coupon,
    discountAmount: discount,
    finalAmount,
    message: `Coupon "${coupon.code}" applied! You saved ₹${discount.toLocaleString("en-IN")}.`,
  };
}
