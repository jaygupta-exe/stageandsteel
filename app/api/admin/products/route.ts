import { NextResponse } from "next/server";
import { db, doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "@/lib/firebase";
import { ProductData } from "@/components/ProductModal";
import { DEFAULT_PRODUCTS } from "@/lib/products";

// GET /api/admin/products - fetch products
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ products: DEFAULT_PRODUCTS, source: "default" });
    }

    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return NextResponse.json({ products: DEFAULT_PRODUCTS, source: "default" });
    }

    const firestoreMap = new Map<string, ProductData>();
    snapshot.forEach((docSnap) => {
      firestoreMap.set(docSnap.id, {
        ...docSnap.data(),
        id: docSnap.id,
      } as ProductData);
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

    return NextResponse.json({ products: allProducts, source: "firestore" });
  } catch (error: any) {
    console.error("API GET products error:", error);
    return NextResponse.json({ products: DEFAULT_PRODUCTS, error: error.message }, { status: 200 });
  }
}

// POST /api/admin/products - save or update a product
export async function POST(req: Request) {
  try {
    const product: ProductData = await req.json();

    if (!product || !product.id || !product.name) {
      return NextResponse.json(
        { error: "Product ID (slug) and Name are required." },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Firestore is not configured. Please ensure Firebase environment variables are set." },
        { status: 500 }
      );
    }

    const cleanProduct = JSON.parse(JSON.stringify(product));
    const docRef = doc(db, "products", product.id);

    await setDoc(docRef, cleanProduct, { merge: true });

    return NextResponse.json({ success: true, id: product.id, message: "Product saved successfully." });
  } catch (error: any) {
    console.error("API POST save product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save product to Firestore." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products?id=... - delete a product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: "Firestore is not configured." }, { status: 500 });
    }

    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, id, message: "Product deleted successfully." });
  } catch (error: any) {
    console.error("API DELETE product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products - seed default catalog
export async function PUT() {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firestore is not configured." }, { status: 500 });
    }

    let count = 0;
    for (const product of DEFAULT_PRODUCTS) {
      const cleanProduct = JSON.parse(JSON.stringify(product));
      const docRef = doc(db, "products", product.id);
      await setDoc(docRef, cleanProduct, { merge: true });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully synced ${count} products.` });
  } catch (error: any) {
    console.error("API PUT seed error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed products." }, { status: 500 });
  }
}
