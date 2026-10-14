"use client";

import {
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "@/lib/firebase";

export interface TrackedProduct {
  id: string;
  name: string;
  subtitle?: string;
  category?: string;
  price: string;
  numericPrice: number;
  thumbnail: string;
  viewedAt: string; // ISO string for portability
}

export interface TrackedCartItem {
  id: string;
  name: string;
  flavor?: string;
  quantity: number;
  price: string;
  numericPrice: number;
  thumbnail: string;
}

const LOCAL_STORAGE_KEY = "stage_steel_recent_views";
const MAX_TRACKED_ITEMS = 8;

/**
 * Get recent product views stored locally in browser storage.
 */
export function getLocalProductViews(): TrackedProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[VisitorTracking] Error reading local product views:", err);
    return [];
  }
}

/**
 * Save product view into browser localStorage (works even before user logs in).
 */
export function recordLocalProductView(product: {
  id: string;
  name: string;
  subtitle?: string;
  category?: string;
  price: string;
  thumbnail: string;
}): TrackedProduct[] {
  if (typeof window === "undefined" || !product?.id) return [];

  try {
    const existing = getLocalProductViews();
    const numericPrice = parseInt(product.price.replace(/[^0-9]/g, ""), 10) || 0;

    const newEntry: TrackedProduct = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      numericPrice,
      thumbnail: product.thumbnail,
      viewedAt: new Date().toISOString(),
    };

    // Filter out previous entry for same product id, prepend new one
    const updated = [newEntry, ...existing.filter((item) => item.id !== product.id)].slice(
      0,
      MAX_TRACKED_ITEMS
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("[VisitorTracking] Error saving local product view:", err);
    return [];
  }
}

/**
 * Sync product view directly to user's Firestore profile if authenticated.
 * Updates:
 * - `viewedProducts` (deduplicated list of recent viewed products)
 * - `lastActiveAt` (server timestamp)
 * - `reminderStatus` ("pending" if not already converted)
 */
export async function trackProductView(
  product: {
    id: string;
    name: string;
    subtitle?: string;
    category?: string;
    price: string;
    thumbnail: string;
  },
  userId?: string | null,
  userEmail?: string | null
): Promise<void> {
  // 1. Always record in local storage for fast client access & fallback
  const localList = recordLocalProductView(product);

  // 2. If user is logged in and Firestore is initialized, sync to Cloud Firestore
  if (!db || !userId) return;

  try {
    const userRef = doc(db, "users", userId);
    const numericPrice = parseInt(product.price.replace(/[^0-9]/g, ""), 10) || 0;

    const newViewEntry: TrackedProduct = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      numericPrice,
      thumbnail: product.thumbnail,
      viewedAt: new Date().toISOString(),
    };

    // Fetch existing doc to merge viewed items without wiping history
    const userSnap = await getDoc(userRef);
    const existingData = userSnap.exists() ? userSnap.data() : {};
    const existingViews: TrackedProduct[] = Array.isArray(existingData.viewedProducts)
      ? existingData.viewedProducts
      : [];

    const mergedViews = [
      newViewEntry,
      ...existingViews.filter((p) => p.id !== product.id),
    ].slice(0, MAX_TRACKED_ITEMS);

    const updatePayload: Record<string, any> = {
      lastActiveAt: serverTimestamp(),
      viewedProducts: mergedViews,
      lastViewedProduct: newViewEntry,
    };

    if (userEmail && !existingData.email) {
      updatePayload.email = userEmail;
    }

    // Keep reminderStatus as 'pending' unless user already converted in this session
    if (existingData.reminderStatus !== "converted") {
      updatePayload.reminderStatus = "pending";
    }

    await setDoc(userRef, updatePayload, { merge: true });
  } catch (err) {
    console.warn("[VisitorTracking] Failed to sync product view to Firestore:", err);
  }
}

/**
 * Sync active cart state to user document so recovery email can show exact cart items
 */
export async function syncCartActivity(
  userId: string,
  items: TrackedCartItem[],
  subtotal: number
): Promise<void> {
  if (!db || !userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        cartItems: items.map((i) => ({
          id: i.id,
          name: i.name,
          flavor: i.flavor || "",
          quantity: i.quantity,
          price: i.price,
          numericPrice: i.numericPrice,
          thumbnail: i.thumbnail,
        })),
        cartSubtotal: subtotal,
        cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
        lastActiveAt: serverTimestamp(),
        reminderStatus: items.length > 0 ? "pending" : "idle",
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[VisitorTracking] Failed to sync cart activity to Firestore:", err);
  }
}

/**
 * Flush any product views captured in localStorage prior to login into the user's Firestore document.
 */
export async function flushLocalViewsToFirestore(
  userId: string,
  userEmail?: string | null
): Promise<void> {
  if (!db || !userId) return;

  const localViews = getLocalProductViews();
  if (localViews.length === 0) return;

  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const existingData = snap.exists() ? snap.data() : {};
    const existingViews: TrackedProduct[] = Array.isArray(existingData.viewedProducts)
      ? existingData.viewedProducts
      : [];

    // Merge unique by product ID
    const seenIds = new Set<string>();
    const merged: TrackedProduct[] = [];

    for (const item of [...localViews, ...existingViews]) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        merged.push(item);
      }
    }

    const payload: Record<string, any> = {
      viewedProducts: merged.slice(0, MAX_TRACKED_ITEMS),
      lastActiveAt: serverTimestamp(),
    };

    if (userEmail && !existingData.email) {
      payload.email = userEmail;
    }

    if (existingData.reminderStatus !== "converted") {
      payload.reminderStatus = "pending";
    }

    await setDoc(userRef, payload, { merge: true });
  } catch (err) {
    console.warn("[VisitorTracking] Error flushing local views to Firestore:", err);
  }
}

/**
 * Mark a user's reminder as converted after a successful order.
 * This guarantees they won't receive a reminder email for recently viewed products.
 */
export async function markUserPurchaseConverted(userId: string): Promise<void> {
  if (!db || !userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        reminderStatus: "converted",
        lastPurchasedAt: serverTimestamp(),
        cartItems: [],
        cartSubtotal: 0,
        cartCount: 0,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[VisitorTracking] Error marking user purchase converted:", err);
  }
}
