import { db, doc, getDoc, setDoc } from "@/lib/firebase";

export interface SiteSettings {
  announcementText: string;
  showAnnouncement: boolean;
  announcementLinkText?: string;
  announcementLinkUrl?: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  promoBadgeText: string;
  showLaunchModal: boolean;
  launchModalDiscountText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: "🔥 NUTRACEUTICAL GRADE FORMULATION // FREE EXPRESS SHIPPING ON ALL ORDERS",
  showAnnouncement: true,
  announcementLinkText: "SHOP STACK",
  announcementLinkUrl: "#products",
  heroHeadline: "ENGINEERED FOR THE",
  heroHighlight: "RELENTLESS",
  heroSubtitle: "Zero fillers. Highest biological value. Lab-verified purity tailored for supreme athletic hypertrophy and recovery.",
  promoBadgeText: "OFFICIAL 2026 LAUNCH // 100% PURE",
  showLaunchModal: true,
  launchModalDiscountText: "GET 10% OFF ON YOUR FIRST ORDER",
  contactEmail: "support@stageandsteel.com",
  contactPhone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
};

/**
 * Fetch live site settings from Firestore
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!db) return DEFAULT_SITE_SETTINGS;

  try {
    const docRef = doc(db, "site_settings", "global");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn("Error fetching site settings, using default:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Save site settings to Firestore
 */
export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  if (!db) throw new Error("Firestore not initialized.");

  try {
    const cleanSettings = JSON.parse(JSON.stringify(settings));
    const docRef = doc(db, "site_settings", "global");
    await setDoc(docRef, cleanSettings, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving site settings:", error);
    throw error;
  }
}
