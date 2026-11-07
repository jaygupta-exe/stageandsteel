import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "@/lib/firebase";
import { normalizeCouponCode } from "@/lib/couponUsage";

export interface Coupon {
  code: string;
  type: "percentage" | "flat" | "bundle";
  value: number; // 10 for 10% or 200 for ₹200 or 798 / 1397 for bundle discount
  bundleTargetPrice?: number; // e.g. 1300 or 4200
  requiredBundle?: "creatine_amino" | "whey_creatine_amino" | string;
  minOrderAmount?: number;
  maxDiscount?: number; // Cap for percentage discounts
  description: string;
  isActive: boolean;
  onePerUser?: boolean; // If true, single user can only redeem once in lifetime
  aliases?: string[];
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: "DIWALI15",
    type: "percentage",
    value: 15,
    description: "Diwali Special: Flat 15% OFF across all products [Single Use Only]",
    isActive: true,
    onePerUser: true,
    aliases: ["DIWALI", "DIWALI-15"],
  },
  {
    code: "DUO1300",
    type: "bundle",
    value: 798,
    bundleTargetPrice: 1300,
    requiredBundle: "creatine_amino",
    minOrderAmount: 1300,
    description: "Creatine + Amino Combo: Get both for just ₹1,300 (Save ₹798) [Single Use Only]",
    isActive: true,
    onePerUser: true,
    aliases: ["CREAA1300", "POWERDUO", "DUOSTACK"],
  },
  {
    code: "TRIO4200",
    type: "bundle",
    value: 1397,
    bundleTargetPrice: 4200,
    requiredBundle: "whey_creatine_amino",
    minOrderAmount: 4200,
    description: "Whey Protein + Creatine + Amino Trio Stack: Get all 3 for ₹4,200 (Save ₹1,397) [Single Use Only]",
    isActive: true,
    onePerUser: true,
    aliases: ["WHEYTRIO", "TRIOSTACK", "STAGE4200"],
  },
  {
    code: "TEST1",
    type: "flat",
    value: 1,
    minOrderAmount: 1,
    description: "Tester Coupon: Pay ₹1 only for gateway verification",
    isActive: true,
    onePerUser: false,
  },
  {
    code: "RUPEE1",
    type: "flat",
    value: 1,
    minOrderAmount: 1,
    description: "Tester Coupon: Pay ₹1 only for gateway verification",
    isActive: true,
    onePerUser: false,
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
 * Item classification helpers for bundles
 */
export function isCreatineItem(item: { id?: string; name?: string }): boolean {
  const id = (item.id || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  return id.includes("creatine") || name.includes("creatine");
}

export function isAminoItem(item: { id?: string; name?: string }): boolean {
  const id = (item.id || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  return (
    id.includes("eaa") ||
    id.includes("amino") ||
    name.includes("eaa") ||
    name.includes("amino")
  );
}

export function isWheyItem(item: { id?: string; name?: string }): boolean {
  const id = (item.id || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  return (
    id.includes("whey") ||
    name.includes("whey") ||
    (id.includes("protein") && !id.includes("yeast"))
  );
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
  customCouponsList?: Coupon[],
  cartItems?: Array<{ id?: string; name?: string; price?: string; numericPrice?: number; quantity?: number }>
): ValidationResult {
  if (!inputCode || !inputCode.trim()) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: "Please enter a valid coupon code.",
    };
  }

  const rawCode = inputCode.trim().toUpperCase();
  const canonicalCode = normalizeCouponCode(rawCode);
  const couponsPool =
    customCouponsList && customCouponsList.length > 0 ? customCouponsList : DEFAULT_COUPONS;

  const matchFn = (c: Coupon) => {
    if (!c.isActive) return false;
    const cUpper = c.code.toUpperCase();
    if (cUpper === rawCode || cUpper === canonicalCode) return true;
    if (
      c.aliases &&
      c.aliases.some((a) => a.toUpperCase() === rawCode || a.toUpperCase() === canonicalCode)
    ) {
      return true;
    }
    return false;
  };

  let coupon = couponsPool.find(matchFn);
  if (!coupon) {
    coupon = DEFAULT_COUPONS.find(matchFn);
  }

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon code "${rawCode}" is invalid or expired.`,
    };
  }

  const cleanCode = coupon.code.toUpperCase();

  // 1. Bundle items verification (if cart items available)
  if (cartItems && cartItems.length > 0) {
    if (cleanCode === "DUO1300" || coupon.requiredBundle === "creatine_amino") {
      const hasCreatine = cartItems.some((i) => isCreatineItem(i) && (i.quantity || 1) >= 1);
      const hasAmino = cartItems.some((i) => isAminoItem(i) && (i.quantity || 1) >= 1);

      if (!hasCreatine || !hasAmino) {
        return {
          isValid: false,
          discountAmount: 0,
          finalAmount: subtotal,
          message: `Coupon "${coupon.code}" requires both Stage Creatine Monohydrate and EAA (Amino Acid) in your cart to claim the combo for ₹1,300.`,
        };
      }
    } else if (cleanCode === "TRIO4200" || coupon.requiredBundle === "whey_creatine_amino") {
      const hasWhey = cartItems.some((i) => isWheyItem(i) && (i.quantity || 1) >= 1);
      const hasCreatine = cartItems.some((i) => isCreatineItem(i) && (i.quantity || 1) >= 1);
      const hasAmino = cartItems.some((i) => isAminoItem(i) && (i.quantity || 1) >= 1);

      if (!hasWhey || !hasCreatine || !hasAmino) {
        return {
          isValid: false,
          discountAmount: 0,
          finalAmount: subtotal,
          message: `Coupon "${coupon.code}" requires Whey Protein, Creatine Monohydrate, and EAA (Amino Acid) in your cart to claim the trio stack for ₹4,200.`,
        };
      }
    }
  }

  // 2. Minimum order validation
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon requires a minimum order of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}.`,
    };
  }

  // 3. Discount calculation
  let discount = 0;
  if (cleanCode === "TEST1" || cleanCode === "RUPEE1") {
    // Special test coupon: make payable exactly ₹1
    discount = Math.max(0, subtotal - 1);
  } else if (cleanCode === "DUO1300" || coupon.requiredBundle === "creatine_amino") {
    // Creatine (899) + EAA (1199) = 2098 -> Combo price 1300 -> Discount = 798
    const duoDiscount = coupon.value || 798;
    discount = Math.min(duoDiscount, subtotal);
  } else if (cleanCode === "TRIO4200" || coupon.requiredBundle === "whey_creatine_amino") {
    // Whey (3499) + Creatine (899) + EAA (1199) = 5597 -> Combo price 4200 -> Discount = 1397
    const trioDiscount = coupon.value || 1397;
    discount = Math.min(trioDiscount, subtotal);
  } else if (coupon.type === "percentage") {
    discount = Math.round((subtotal * Number(coupon.value || 0)) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === "flat") {
    discount = Math.min(Number(coupon.value || 0), subtotal);
  }

  const finalAmount = Math.max(0, subtotal - discount);

  let successMsg = `Coupon "${coupon.code}" applied! You saved ₹${discount.toLocaleString("en-IN")}.`;
  if (cleanCode === "DIWALI15") {
    successMsg = `Diwali Special applied! 15% OFF across your order (You saved ₹${discount.toLocaleString("en-IN")}). [Single-use offer]`;
  } else 
  if (cleanCode === "DUO1300") {
    successMsg = `Creatine + Amino Combo applied! Stack discounted to ₹1,300 (You saved ₹${discount.toLocaleString("en-IN")}). [Single-use offer]`;
  } else if (cleanCode === "TRIO4200") {
    successMsg = `Whey + Creatine + Amino Trio Stack applied! All 3 discounted to ₹4,200 (You saved ₹${discount.toLocaleString("en-IN")}). [Single-use offer]`;
  } else if (cleanCode === "TEST1" || cleanCode === "RUPEE1") {
    successMsg = `Test Coupon "${coupon.code}" applied! Total Payable is ₹1 (for Gateway Testing).`;
  } else if (finalAmount === 0) {
    successMsg = `Promotional Coupon "${coupon.code}" applied! 100% Free Order (₹0 Payable).`;
  }

  return {
    isValid: true,
    coupon,
    discountAmount: discount,
    finalAmount,
    message: successMsg,
  };
}
