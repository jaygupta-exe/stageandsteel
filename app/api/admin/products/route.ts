import { NextResponse } from "next/server";
import { DEFAULT_PRODUCTS } from "@/lib/products";
import { ProductData } from "@/components/ProductModal";
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
async function saveProductViaRest(product: ProductData): Promise<boolean> {
  const cleanProduct = JSON.parse(JSON.stringify(product));
  const fields = toFirestoreValue(cleanProduct).mapValue?.fields || {};

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products/${encodeURIComponent(product.id)}?key=${FIREBASE_API_KEY}`;
  
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
async function deleteProductViaRest(id: string): Promise<boolean> {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products/${encodeURIComponent(id)}?key=${FIREBASE_API_KEY}`;
  const res = await fetch(url, { method: "DELETE", cache: "no-store" });
  if (!res.ok && res.status !== 404) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Firestore REST DELETE error ${res.status}`);
  }
  return true;
}

// GET /api/admin/products
export async function GET() {
  try {
    // Try REST first
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?key=${FIREBASE_API_KEY}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const docs = data.documents || [];
          const firestoreMap = new Map<string, ProductData>();

          docs.forEach((docItem: any) => {
            const id = docItem.name.split("/").pop();
            const fields = docItem.fields || {};
            const productObj: Record<string, any> = { id };
            for (const [k, v] of Object.entries(fields)) {
              productObj[k] = fromFirestoreValue(v);
            }
            productObj.id = id;
            firestoreMap.set(id, productObj as ProductData);
          });

          const allProducts: ProductData[] = [];
          const processedIds = new Set<string>();

          for (const defProd of DEFAULT_PRODUCTS) {
            if (firestoreMap.has(defProd.id)) {
              allProducts.push(firestoreMap.get(defProd.id)!);
            } else {
              allProducts.push(defProd);
            }
            processedIds.add(defProd.id);
          }

          firestoreMap.forEach((product, id) => {
            if (!processedIds.has(id)) {
              allProducts.push(product);
            }
          });

          return NextResponse.json({ products: allProducts, source: "firestore_rest" });
        }
      } catch (restErr) {
        console.warn("REST GET products warning:", restErr);
      }
    }

    // Fallback to DEFAULT_PRODUCTS
    return NextResponse.json({ products: DEFAULT_PRODUCTS, source: "default" });
  } catch (error: any) {
    console.error("API GET error:", error);
    return NextResponse.json({ products: DEFAULT_PRODUCTS, error: error.message }, { status: 200 });
  }
}

// POST /api/admin/products
export async function POST(req: Request) {
  try {
    const product: ProductData = await req.json();

    if (!product || !product.id || !product.name) {
      return NextResponse.json(
        { error: "Product ID (slug) and Name are required." },
        { status: 400 }
      );
    }

    // 1. Direct REST Save (Lightning fast, zero hang)
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        await saveProductViaRest(product);
        return NextResponse.json({
          success: true,
          id: product.id,
          message: "Product saved successfully via Firestore REST.",
        });
      } catch (restErr: any) {
        console.warn("REST save failed, attempting SDK save:", restErr.message);
      }
    }

    // 2. SDK fallback
    if (db) {
      const cleanProduct = JSON.parse(JSON.stringify(product));
      const docRef = doc(db, "products", product.id);
      await setDoc(docRef, cleanProduct, { merge: true });
      return NextResponse.json({
        success: true,
        id: product.id,
        message: "Product saved successfully via Firestore SDK.",
      });
    }

    return NextResponse.json(
      { error: "Firebase credentials missing or database unreachable." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("API POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save product." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        await deleteProductViaRest(id);
        return NextResponse.json({ success: true, id, message: "Product deleted via REST." });
      } catch (restErr) {
        console.warn("REST delete failed, trying SDK:", restErr);
      }
    }

    if (db) {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      return NextResponse.json({ success: true, id, message: "Product deleted via SDK." });
    }

    return NextResponse.json({ error: "Firestore not initialized." }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product." }, { status: 500 });
  }
}

// PUT /api/admin/products - Seed Default Products
export async function PUT() {
  try {
    let count = 0;
    for (const product of DEFAULT_PRODUCTS) {
      try {
        await saveProductViaRest(product);
        count++;
      } catch (err) {
        console.warn(`Failed to seed ${product.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      count,
      message: `Successfully synced ${count} products to Firestore!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to seed catalog." }, { status: 500 });
  }
}
