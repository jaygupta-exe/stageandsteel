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
 * Fetch all coupons from Firestore, falling back to DEFAULT_COUPONS
 */
export async function getAllCoupons(): Promise<Coupon[]> {
  if (!db) return DEFAULT_COUPONS;

  try {
    const couponsRef = collection(db, "coupons");
    const snapshot = await getDocs(couponsRef);

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
  if (!db) throw new Error("Firestore is not initialized.");

  const cleanCode = coupon.code.trim().toUpperCase();
  const cleanPayload = JSON.parse(JSON.stringify({ ...coupon, code: cleanCode }));
  const docRef = doc(db, "coupons", cleanCode);
  await setDoc(docRef, cleanPayload, { merge: true });
  return true;
}

/**
 * Toggle coupon active status
 */
export async function toggleCouponStatus(code: string, isActive: boolean): Promise<boolean> {
  if (!db) throw new Error("Firestore is not initialized.");

  const docRef = doc(db, "coupons", code.toUpperCase());
  await updateDoc(docRef, { isActive });
  return true;
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(code: string): Promise<boolean> {
  if (!db) throw new Error("Firestore is not initialized.");

  const docRef = doc(db, "coupons", code.toUpperCase());
  await deleteDoc(docRef);
  return true;
}

/**
 * Seed initial coupons into Firestore (clears obsolete codes)
 */
export async function seedCoupons(): Promise<{ count: number }> {
  if (!db) throw new Error("Firestore not initialized.");

  // Delete all existing documents in coupons collection
  try {
    const couponsRef = collection(db, "coupons");
    const snapshot = await getDocs(couponsRef);
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
  } catch (err) {
    console.warn("Error cleaning old coupons:", err);
  }

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
