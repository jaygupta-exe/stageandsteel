import { NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/lib/siteSettings";
import { db, doc, setDoc, getDoc } from "@/lib/firebase";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";

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

export async function GET() {
  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/site_settings/global?key=${FIREBASE_API_KEY}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const fields = data.fields || {};
          const settingsObj: Record<string, any> = {};
          for (const [k, v] of Object.entries(fields)) {
            settingsObj[k] = fromFirestoreValue(v);
          }
          return NextResponse.json({
            settings: { ...DEFAULT_SITE_SETTINGS, ...settingsObj },
            source: "firestore_rest",
          });
        }
      } catch (restErr) {
        console.warn("REST GET site_settings warning:", restErr);
      }
    }

    if (db) {
      try {
        const docRef = doc(db, "site_settings", "global");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return NextResponse.json({
            settings: { ...DEFAULT_SITE_SETTINGS, ...snap.data() },
            source: "firestore_sdk",
          });
        }
      } catch (sdkErr) {
        console.warn("SDK GET site_settings warning:", sdkErr);
      }
    }

    return NextResponse.json({ settings: DEFAULT_SITE_SETTINGS, source: "default" });
  } catch (error: any) {
    return NextResponse.json({ settings: DEFAULT_SITE_SETTINGS, error: error.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const settings: Partial<SiteSettings> = await req.json();
    const cleanSettings = JSON.parse(JSON.stringify(settings));

    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      try {
        const fields = toFirestoreValue(cleanSettings).mapValue?.fields || {};
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/site_settings/global?key=${FIREBASE_API_KEY}`;
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields }),
          cache: "no-store",
        });

        if (res.ok) {
          return NextResponse.json({ success: true, message: "Settings saved via REST." });
        }
      } catch (restErr) {
        console.warn("REST save settings failed, trying SDK:", restErr);
      }
    }

    if (db) {
      const docRef = doc(db, "site_settings", "global");
      const savePromise = setDoc(docRef, cleanSettings, { merge: true });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Save timed out")), 5000)
      );
      await Promise.race([savePromise, timeoutPromise]);
      return NextResponse.json({ success: true, message: "Settings saved via SDK." });
    }

    return NextResponse.json({ error: "Firestore not available." }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save settings." }, { status: 500 });
  }
}
