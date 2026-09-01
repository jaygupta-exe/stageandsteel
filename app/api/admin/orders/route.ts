import { NextResponse } from "next/server";
import { db, doc, updateDoc, deleteDoc, getDocs, collection, query, orderBy } from "@/lib/firebase";
import { OrderRecord } from "@/lib/orders";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

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

// GET /api/admin/orders
export async function GET() {
  try {
    // 1. Direct REST Fetch
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/orders?key=${FIREBASE_API_KEY}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const docs = data.documents || [];
          const list: OrderRecord[] = [];

          docs.forEach((docItem: any) => {
            const id = docItem.name.split("/").pop() || "";
            const fields = docItem.fields || {};
            const orderObj: Record<string, any> = { id };
            for (const [k, v] of Object.entries(fields)) {
              orderObj[k] = fromFirestoreValue(v);
            }
            orderObj.id = id;
            list.push(orderObj as OrderRecord);
          });

          // Sort newest first
          list.sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return timeB - timeA;
          });

          if (list.length > 0) {
            return NextResponse.json({ orders: list, source: "firestore_rest" });
          }
        }
      } catch (restErr) {
        console.warn("REST GET orders warning:", restErr);
      }
    }

    // 2. SDK Fallback
    if (db) {
      try {
        const ordersRef = collection(db, "orders");
        const snapshot = await getDocs(ordersRef);
        const list: OrderRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as OrderRecord);
        });

        list.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return timeB - timeA;
        });

        return NextResponse.json({ orders: list, source: "firestore_sdk" });
      } catch (sdkErr) {
        console.warn("SDK GET orders warning:", sdkErr);
      }
    }

    return NextResponse.json({ orders: [], source: "empty" });
  } catch (error: any) {
    console.error("API GET orders error:", error);
    return NextResponse.json({ orders: [], error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/orders - Update status or waybill
export async function PATCH(req: Request) {
  try {
    const { orderId, status, waybill } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    if (db) {
      const docRef = doc(db, "orders", orderId);
      const updates: any = {};
      if (status) updates.status = status;
      if (waybill !== undefined) updates.waybill = waybill;
      await updateDoc(docRef, updates);
      return NextResponse.json({ success: true, orderId, updates });
    }

    return NextResponse.json({ error: "Database unreachable" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Update failed" }, { status: 500 });
  }
}

// DELETE /api/admin/orders - Delete order
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    if (db) {
      const docRef = doc(db, "orders", orderId);
      await deleteDoc(docRef);
      return NextResponse.json({ success: true, orderId, message: "Order deleted" });
    }

    return NextResponse.json({ error: "Database unreachable" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Delete failed" }, { status: 500 });
  }
}
