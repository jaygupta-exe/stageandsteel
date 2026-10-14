import { NextResponse } from "next/server";
import { generateVisitorReminderEmailHtml } from "@/lib/visitorEmailTemplate";
import { db, collection, getDocs, doc, setDoc, serverTimestamp } from "@/lib/firebase";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stageandsteel-a179f";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stageandsteel.in";
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "orders@stageandsteel.in";

// Helpers to parse Firestore REST values
function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return val.booleanValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return parseFloat(val.doubleValue);
  if ("stringValue" in val) return val.stringValue;
  if ("timestampValue" in val) return val.timestampValue;
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

function parseDateMs(val: any): number {
  if (!val) return 0;
  if (typeof val?.toDate === "function") return val.toDate().getTime();
  if (typeof val === "string") {
    const ms = new Date(val).getTime();
    return isNaN(ms) ? 0 : ms;
  }
  if (typeof val === "number") return val;
  return 0;
}

interface ScannedUser {
  id: string;
  name?: string;
  email?: string;
  reminderStatus?: string;
  lastActiveAt?: any;
  lastReminderSentAt?: any;
  lastPurchasedAt?: any;
  viewedProducts?: any[];
  cartItems?: any[];
  cartSubtotal?: number;
}

/**
 * Fetch all users from Firestore (dual: REST primary, SDK fallback)
 */
async function fetchAllUsers(): Promise<ScannedUser[]> {
  // 1. Direct REST Fetch
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users?key=${FIREBASE_API_KEY}&pageSize=100`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const docs = data.documents || [];
        const users: ScannedUser[] = [];

        for (const d of docs) {
          const id = d.name.split("/").pop() || "";
          const fields = d.fields || {};
          const userObj: Record<string, any> = { id };
          for (const [k, v] of Object.entries(fields)) {
            userObj[k] = fromFirestoreValue(v);
          }
          userObj.id = id;
          users.push(userObj as ScannedUser);
        }
        return users;
      }
    } catch (restErr) {
      console.warn("[Cron] REST users fetch warning:", restErr);
    }
  }

  // 2. Fallback: Firebase Web SDK
  if (db) {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      })) as ScannedUser[];
    } catch (sdkErr) {
      console.warn("[Cron] SDK users fetch warning:", sdkErr);
    }
  }

  return [];
}

/**
 * Update user reminder status in Firestore
 */
async function markReminderSent(userId: string): Promise<void> {
  const nowIso = new Date().toISOString();

  // 1. REST Update
  if (FIREBASE_PROJECT_ID && FIREBASE_API_KEY) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=reminderStatus&updateMask.fieldPaths=lastReminderSentAt&key=${FIREBASE_API_KEY}`;
      await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            reminderStatus: { stringValue: "sent" },
            lastReminderSentAt: { timestampValue: nowIso },
          },
        }),
      });
      return;
    } catch (e) {
      console.warn("[Cron] REST update reminder status warning:", e);
    }
  }

  // 2. SDK fallback
  if (db) {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          reminderStatus: "sent",
          lastReminderSentAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("[Cron] SDK update reminder status warning:", e);
    }
  }
}

/**
 * Main cron handler (GET for Vercel Cron, POST for manual/admin triggers)
 */
async function handleVisitorReminder(req: Request) {
  const { searchParams } = new URL(req.url);

  // Optional security check if CRON_SECRET is defined in env
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // If request has manual test query or bypass key
    const queryKey = searchParams.get("key");
    if (queryKey !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 });
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json(
      {
        error: "RESEND_API_KEY is not configured",
        tip: "Add RESEND_API_KEY in .env.local to enable email sending",
      },
      { status: 500 }
    );
  }

  // Configurations & thresholds
  // minInactiveMinutes: defaults to 30 mins (can be set to 0 for immediate dry-run testing)
  const minInactiveMinutes = parseInt(searchParams.get("minInactiveMinutes") || "30", 10);
  const maxInactiveHours = parseInt(searchParams.get("maxInactiveHours") || "48", 10);
  const dryRun = searchParams.get("dryRun") === "true";
  const forceEmail = searchParams.get("testEmail"); // Optional: send test copy to specific email

  const now = Date.now();
  const minInactiveMs = minInactiveMinutes * 60 * 1000;
  const maxInactiveMs = maxInactiveHours * 60 * 60 * 1000;
  const spamCooldownMs = 24 * 60 * 60 * 1000; // 24 hours between reminders

  const allUsers = await fetchAllUsers();
  const dispatchResults: Array<{
    userId: string;
    email: string;
    name?: string;
    status: "sent" | "skipped" | "failed";
    reason?: string;
  }> = [];

  for (const user of allUsers) {
    const userEmail = forceEmail || user.email;

    // 1. Must have a valid email
    if (!userEmail || !userEmail.includes("@")) {
      continue;
    }

    // 2. If user already converted (placed order), skip
    if (user.reminderStatus === "converted") {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "skipped",
        reason: "User already completed a purchase (converted)",
      });
      continue;
    }

    // 3. Must have viewed products or cart items
    const viewedProducts = Array.isArray(user.viewedProducts) ? user.viewedProducts : [];
    const cartItems = Array.isArray(user.cartItems) ? user.cartItems : [];

    if (viewedProducts.length === 0 && cartItems.length === 0) {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "skipped",
        reason: "No viewed products or cart items recorded",
      });
      continue;
    }

    // 4. Inactivity check
    const lastActiveMs = parseDateMs(user.lastActiveAt);
    if (!lastActiveMs) {
      // If no activity timestamp, skip
      continue;
    }

    const elapsedMs = now - lastActiveMs;
    if (elapsedMs < minInactiveMs) {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "skipped",
        reason: `Still active recently (${Math.round(elapsedMs / 60000)}m ago, min threshold: ${minInactiveMinutes}m)`,
      });
      continue;
    }

    if (elapsedMs > maxInactiveMs) {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "skipped",
        reason: `Activity too old (${Math.round(elapsedMs / 3600000)}h ago, max threshold: ${maxInactiveHours}h)`,
      });
      continue;
    }

    // 5. Anti-spam 24h frequency cap
    const lastReminderMs = parseDateMs(user.lastReminderSentAt);
    if (lastReminderMs && now - lastReminderMs < spamCooldownMs) {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "skipped",
        reason: "Reminder already sent within the last 24 hours",
      });
      continue;
    }

    // 6. Generate dynamic personalized email
    const { html, subject } = generateVisitorReminderEmailHtml({
      customerName: user.name,
      customerEmail: userEmail,
      viewedProducts,
      cartItems,
      cartSubtotal: user.cartSubtotal || 0,
      siteUrl: SITE_URL,
    });

    if (dryRun) {
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "sent",
        reason: "DRY-RUN (Email preview generated but not dispatched)",
      });
      continue;
    }

    // 7. Send Email via Resend
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Stage & Steel <${DEFAULT_FROM_EMAIL}>`,
          to: [userEmail],
          subject,
          html,
        }),
      });

      if (resendRes.ok) {
        await markReminderSent(user.id);
        dispatchResults.push({
          userId: user.id,
          email: userEmail,
          name: user.name,
          status: "sent",
        });
        console.log(`[Visitor Reminder] Dispatched reminder email to: ${userEmail}`);
      } else {
        const errJson = await resendRes.json();
        console.warn(`[Visitor Reminder] Resend error for ${userEmail}:`, errJson);
        dispatchResults.push({
          userId: user.id,
          email: userEmail,
          status: "failed",
          reason: errJson.message || "Resend API error",
        });
      }
    } catch (sendErr: any) {
      console.warn(`[Visitor Reminder] Send exception for ${userEmail}:`, sendErr);
      dispatchResults.push({
        userId: user.id,
        email: userEmail,
        status: "failed",
        reason: sendErr.message || "Network exception",
      });
    }
  }

  const sentCount = dispatchResults.filter((r) => r.status === "sent").length;
  const skippedCount = dispatchResults.filter((r) => r.status === "skipped").length;
  const failedCount = dispatchResults.filter((r) => r.status === "failed").length;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    scannedTotal: allUsers.length,
    sentCount,
    skippedCount,
    failedCount,
    minInactiveMinutes,
    dryRun,
    results: dispatchResults,
  });
}

export async function GET(req: Request) {
  return handleVisitorReminder(req);
}

export async function POST(req: Request) {
  return handleVisitorReminder(req);
}
