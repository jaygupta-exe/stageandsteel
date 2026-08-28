import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "@/lib/firebase";
import { ProductData } from "@/components/ProductModal";

export const DEFAULT_PRODUCTS: ProductData[] = [
  {
    id: "whey-belgian-chocolate",
    name: "STAGE WHEY - BELGIAN CHOCOLATE",
    subtitle: "MICROFILTERED 100% PURE WHEY // RICH COCOA",
    category: "PROTEIN",
    price: "₹3,499",
    originalPrice: "₹4,299",
    servings: "30 Servings",
    netWeight: "1 KG (2.2 LBS)",
    thumbnail: "/belgium-chocolate-cutout.png",
    labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
    gallery: [
      {
        label: "01 FRONT PACKAGING",
        url: "/whey protein/belgium chocalte/front.png",
      },
      {
        label: "02 SUPPLEMENT FACTS",
        url: "/whey protein/belgium chocalte/belgium chocalte.PNG",
      },
      {
        label: "03 AMINO & DIRECTIONS",
        url: "/whey protein/belgium chocalte/belgium chocalte2.PNG",
      },
      {
        label: "04 LAB TEST REPORT (COA)",
        url: "/lab-reports/belgian-salted-caramel-test-report.png",
      },
    ],
    accentColor: "#596238",
    batchCode: "BATCH SS-2026-BC",
    flavors: [
      { name: "Belgian Chocolate", color: "#5C3A21", inStock: true },
    ],
    specs: [
      { label: "PROTEIN", value: "25", unit: "G" },
      { label: "SCOOP", value: "33", unit: "G" },
      { label: "ENERGY", value: "127.4", unit: "KCAL" },
    ],
    description:
      "Pure microfiltered Belgian Chocolate whey concentrate delivering 25g ultra-pure protein per 33g scoop (127.4 kcal) with decadent European cocoa. Formulated for rapid bio-availability, accelerated muscular hypertrophy, and optimal recovery.",
    nutritionFacts: [
      { name: "Protein per Scoop (33g)", amount: "25g", dailyValue: "50%" },
      { name: "Energy / Calories", amount: "127.4 kcal" },
      { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
      { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
      { name: "Total Carbohydrates", amount: "2.4g" },
      { name: "Dietary Fat", amount: "1.5g" },
      { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
    ],
    suggestedUse:
      "Mix 1 rounded scoop (33g) with 200–250ml cold water or skimmed milk in a shaker cup. Consume immediately post-workout or between meals for optimal protein synthesis.",
  },
  {
    id: "yeast-mocha-protein",
    name: "STAGE YEAST PROTEIN - CAFE MOCHA",
    subtitle: "BIO-FERMENTED PURE YEAST PROTEIN // COFFEE INFUSION",
    category: "PROTEIN",
    price: "₹2,599",
    originalPrice: "₹4,299",
    servings: "28 Servings",
    netWeight: "1 KG (2.2 LBS)",
    thumbnail: "/mocha-protein-cutout.png",
    gallery: [
      {
        label: "01 FRONT PACKAGING",
        url: "/whey protein/mocha protein/front.png",
      },
      {
        label: "02 SUPPLEMENT FACTS",
        url: "/whey protein/mocha protein/mocha protein 2.PNG",
      },
      {
        label: "03 AMINO & DIRECTIONS",
        url: "/whey protein/mocha protein/mocha protein 3.PNG",
      },
    ],
    accentColor: "#596238",
    batchCode: "BATCH SS-2026-MC",
    flavors: [
      { name: "Cafe Mocha", color: "#6F4E37", inStock: true },
    ],
    specs: [
      { label: "PROTEIN", value: "24.6", unit: "G" },
      { label: "SCOOP", value: "35", unit: "G" },
      { label: "ENERGY", value: "124.61", unit: "KCAL" },
    ],
    description:
      "Artisanal roast Cafe Mocha bio-fermented yeast protein combining 24.6g ultra-clean sustainable protein per 35g scoop (124.61 kcal) with authentic coffee aroma. 28 servings per box. Naturally sweetened with premium Monk Fruit extract for clean bio-availability without sugar spikes.",
    nutritionFacts: [
      { name: "Protein per Scoop (35g)", amount: "24.6g", dailyValue: "49%" },
      { name: "Protein Source", amount: "Bio-Fermented Yeast Protein" },
      { name: "Energy / Calories", amount: "124.61 kcal" },
      { name: "Servings per Box", amount: "28 Servings" },
      { name: "Scoop Size", amount: "35g" },
      { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
      { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
      { name: "Total Carbohydrates", amount: "2.2g" },
      { name: "Dietary Fat", amount: "1.4g" },
      { name: "Sweetener", amount: "Natural Monk Fruit Extract" },
      { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
    ],
    suggestedUse:
      "Mix 1 scoop (35g) with 200–250ml ice-cold water or plant milk in a shaker cup. Perfect as a morning kickstarter or high-octane post-workout fuel.",
  },
  {
    id: "whey-salted-caramel",
    name: "STAGE WHEY - SALTED CARAMEL",
    subtitle: "MICROFILTERED 100% PURE WHEY",
    category: "PROTEIN",
    price: "₹3,499",
    originalPrice: "₹4,299",
    servings: "30 Servings",
    netWeight: "1 KG (2.2 LBS)",
    thumbnail: "/salted-caramel-cutout.png",
    labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
    gallery: [
      {
        label: "01 FRONT PACKAGING",
        url: "/salted-caramel/front.png",
      },
      {
        label: "02 NUTRITION & AMINO PROFILE",
        url: "/salted-caramel/nutrition.png",
      },
      {
        label: "03 INGREDIENTS & USAGE",
        url: "/salted-caramel/directions.png",
      },
      {
        label: "04 LAB TEST REPORT (COA)",
        url: "/lab-reports/belgian-salted-caramel-test-report.png",
      },
    ],
    accentColor: "#DE8A36",
    batchCode: "BATCH SS-2026-SC",
    flavors: [
      { name: "Salted Caramel", color: "#DE8A36", inStock: true },
    ],
    specs: [
      { label: "PROTEIN", value: "25", unit: "G" },
      { label: "SCOOP", value: "33", unit: "G" },
      { label: "ENERGY", value: "127.4", unit: "KCAL" },
    ],
    description:
      "Pure microfiltered whey protein blend delivering 25g ultra-clean protein per 33g scoop (127.4 kcal) with 6.1g BCAAs in rich, decadent European Salted Caramel flavor. Fast-digesting formula designed for rapid muscular recovery and accelerated hypertrophy.",
    nutritionFacts: [
      { name: "Protein per Scoop (33g)", amount: "25g", dailyValue: "50%" },
      { name: "Energy / Calories", amount: "127.4 kcal" },
      { name: "Scoop Size", amount: "33g" },
      { name: "BCAAs (Leucine 2.9g, Isoleucine 1.6g, Valine 1.6g)", amount: "6.1g" },
      { name: "Essential Amino Acids (Lysine, Threonine, etc.)", amount: "6.55g" },
      { name: "Total Carbohydrates", amount: "4.0g" },
      { name: "Dietary Fat", amount: "1.8g" },
      { name: "Potassium / Sodium", amount: "230mg / 150mg" },
    ],
    suggestedUse:
      "Mix 1 level scoop (33g) with 200–250ml chilled water or skimmed milk in a shaker cup. Shake vigorously for 30 seconds. Consume immediately post-workout or between meals.",
  },
  {
    id: "creapure-creatine",
    name: "STAGE CREATINE MONOHYDRATE",
    subtitle: "GERMAN MICRONIZED MONOHYDRATE (200 MESH)",
    category: "CREATINE",
    price: "₹899",
    originalPrice: "₹1,299",
    servings: "85 Servings",
    netWeight: "300G (0.66 LBS)",
    thumbnail: "/creatine-cutout.png",
    flavorThumbnails: {
      "Orange": "/creatine-cutout.png",
      "Pineapple": "/pineapple-creatine-cutout.png",
    },
    gallery: [
      {
        label: "01 FRONT PACKAGING (ORANGE)",
        url: "/creatine/front.png",
      },
      {
        label: "02 NUTRITION FACTS",
        url: "/creatine/nutrition.png",
      },
      {
        label: "03 DIRECTIONS & USAGE",
        url: "/creatine/usage.png",
      },
    ],
    flavorGalleries: {
      "Orange": [
        {
          label: "01 FRONT PACKAGING (ORANGE)",
          url: "/creatine/front.png",
        },
        {
          label: "02 NUTRITION FACTS",
          url: "/creatine/nutrition.png",
        },
        {
          label: "03 DIRECTIONS & USAGE",
          url: "/creatine/usage.png",
        },
      ],
      "Pineapple": [
        {
          label: "01 FRONT PACKAGING (PINEAPPLE)",
          url: "/creatine/pineapple-front.png",
        },
        {
          label: "02 NUTRITION FACTS",
          url: "/creatine/nutrition.png",
        },
        {
          label: "03 DIRECTIONS & USAGE",
          url: "/creatine/usage.png",
        },
      ],
    },
    accentColor: "#DE8A36",
    batchCode: "BATCH CR-2026-GER",
    flavors: [
      { name: "Orange", color: "#FF7A00", inStock: true },
      { name: "Pineapple", color: "#FFD000", inStock: true },
    ],
    specs: [
      { label: "CREATINE", value: "3000", unit: "MG" },
      { label: "VITAMIN C", value: "40", unit: "MG" },
      { label: "SERVINGS", value: "85", unit: "SCOOPS" },
    ],
    description:
      "Stage & Steel Premium Grade Micronized Creatine Monohydrate in refreshing Orange & Pineapple flavors. Enhanced with 40mg Vitamin C per scoop to combat oxidative stress, improve absorption, and power explosive ATP muscular endurance across 85 full servings.",
    nutritionFacts: [
      { name: "Creatine Monohydrate (Pure Micronized)", amount: "3,000mg" },
      { name: "Vitamin C (Antioxidant Complex)", amount: "40mg (50% RDA)" },
      { name: "Carbohydrates", amount: "0.1g" },
      { name: "Energy / Calories", amount: "0.4 kcal" },
      { name: "Protein / Dietary Fat", amount: "0g" },
      { name: "Sodium", amount: "0mg" },
    ],
    suggestedUse:
      "Mix 1 scoop (3.5g) with 200–250ml cold water or your preferred beverage. Consume once daily, preferably post-workout or at any convenient time on non-training days.",
  },
  {
    id: "stage-eaa-cola",
    name: "STAGE ESSENTIAL AMINO ACIDS (EAA)",
    subtitle: "FULL SPECTRUM 9 EAAS // ELECTROLYTE HYDRATION",
    category: "EAA",
    price: "₹1,199",
    originalPrice: "₹1,599",
    servings: "30 Servings",
    netWeight: "255G (0.56 LBS)",
    thumbnail: "/eaa-cutout.png",
    gallery: [
      {
        label: "01 FRONT PACKAGING",
        url: "/eaa/front.png",
      },
      {
        label: "02 AMINO & FACTS",
        url: "/eaa/nutrition.png",
      },
      {
        label: "03 USAGE & DIRECTIONS",
        url: "/eaa/usage.png",
      },
      {
        label: "04 3D BOTTLE VIEW",
        url: "/eaa/trio.png",
      },
    ],
    accentColor: "#8B1E0F",
    batchCode: "BATCH EAA-2026-COLA",
    flavors: [
      { name: "Cola Flavor", color: "#63170D", inStock: true },
    ],
    specs: [
      { label: "EAAS", value: "6.45", unit: "G" },
      { label: "BCAAS", value: "4000", unit: "MG" },
      { label: "HYDRATION", value: "ELECTROLYTES" },
    ],
    description:
      "Stage & Steel Premium Grade Essential Amino Acids (EAA) in refreshing Cola Flavor. Scientifically formulated blend of all 9 essential amino acids with crucial electrolytes (Sodium & Potassium) designed to fuel intra-workout endurance, prevent muscle breakdown, and accelerate recovery.",
    nutritionFacts: [
      { name: "L-Leucine (Instantized BCAA)", amount: "2,000mg" },
      { name: "L-Isoleucine (BCAA)", amount: "1,000mg" },
      { name: "L-Valine (BCAA)", amount: "1,000mg" },
      { name: "L-Lysine", amount: "950mg" },
      { name: "L-Threonine", amount: "825mg" },
      { name: "L-Histidine", amount: "275mg" },
      { name: "L-Methionine", amount: "150mg" },
      { name: "L-Phenylalanine", amount: "125mg" },
      { name: "L-Tryptophan", amount: "125mg" },
      { name: "Sodium Chloride (Hydration)", amount: "200mg" },
      { name: "Potassium Chloride (Electrolyte)", amount: "175mg" },
      { name: "Energy / Sugars", amount: "0.6 kcal / 0g" },
    ],
    suggestedUse:
      "Mix 1 scoop (8.5g) with 300–400ml cold water in your shaker during or immediately after high-intensity training. Sip throughout workout for sustained muscular endurance.",
  },
];

/**
 * Fetch all products from Firestore, falling back to DEFAULT_PRODUCTS if Firestore is empty or unconfigured.
 */
export async function getAllProducts(): Promise<ProductData[]> {
  if (!db) return DEFAULT_PRODUCTS;

  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return DEFAULT_PRODUCTS;
    }

    const items: ProductData[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        ...docSnap.data(),
        id: docSnap.id,
      } as ProductData);
    });

    return items;
  } catch (error) {
    console.warn("Error fetching products from Firestore, using default catalog:", error);
    return DEFAULT_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id: string): Promise<ProductData | null> {
  if (!db) {
    return DEFAULT_PRODUCTS.find((p) => p.id === id) || null;
  }

  try {
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as ProductData;
    }
    return DEFAULT_PRODUCTS.find((p) => p.id === id) || null;
  } catch (err) {
    console.warn(`Error getting product ${id}:`, err);
    return DEFAULT_PRODUCTS.find((p) => p.id === id) || null;
  }
}

/**
 * Create or update a product in Firestore.
 */
export async function saveProduct(product: ProductData): Promise<boolean> {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  try {
    const docRef = doc(db, "products", product.id);
    await setDoc(docRef, product, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving product to Firestore:", error);
    throw error;
  }
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}

/**
 * Pre-populate Firestore with the initial default products if collection is empty.
 */
export async function seedProducts(): Promise<{ count: number }> {
  if (!db) throw new Error("Firestore not initialized.");

  let count = 0;
  for (const product of DEFAULT_PRODUCTS) {
    const docRef = doc(db, "products", product.id);
    await setDoc(docRef, product, { merge: true });
    count++;
  }
  return { count };
}
