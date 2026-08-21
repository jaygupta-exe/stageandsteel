import {
  db,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
} from "@/lib/firebase";

export interface OrderItem {
  id: string;
  name: string;
  flavor: string;
  price: string;
  numericPrice: number;
  quantity: number;
  thumbnail: string;
}

export interface OrderRecord {
  id?: string; // Firestore doc ID (auto-set after read)
  orderId: string; // Cashfree order ID (e.g., SS_17293...)
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  finalTotal: number;
  status: "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentGateway: string;
  waybill: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: any; // Firestore Timestamp
}

/**
 * Save a completed order to Firestore `orders` collection.
 */
export async function saveOrder(order: Omit<OrderRecord, "id" | "createdAt">): Promise<string | null> {
  if (!db) {
    console.warn("Firestore not initialized — order not saved.");
    return null;
  }

  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Failed to save order to Firestore:", err);
    return null;
  }
}

/**
 * Get all orders for a specific user, sorted by date (newest first).
 */
export async function getUserOrders(userId: string): Promise<OrderRecord[]> {
  if (!db || !userId) return [];

  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as OrderRecord[];
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    return [];
  }
}
