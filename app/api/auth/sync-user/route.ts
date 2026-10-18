import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const { uid, email, name, photoURL } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ error: "UID and email required" }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const userPayload = {
      uid,
      email,
      name: name || email.split("@")[0] || "Athlete",
      photoURL: photoURL || null,
      lastActiveAt: nowIso,
      lastLoginAt: nowIso,
      reminderStatus: "pending",
    };

    if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
      const fields = toFirestoreValue(userPayload).mapValue?.fields || {};
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(uid)}?key=${FIREBASE_API_KEY}`;
      
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
        cache: "no-store",
      });

      if (res.ok) {
        return NextResponse.json({ success: true, message: "User synced via REST" });
      }
    }

    return NextResponse.json({ success: true, message: "Processed" });
  } catch (error: any) {
    console.error("Sync user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
