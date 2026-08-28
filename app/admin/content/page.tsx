"use client";

import React, { useEffect, useState } from "react";
import {
  getSiteSettings,
  saveSiteSettings,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/siteSettings";
import {
  Sliders,
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Layers,
  Phone,
  RotateCcw,
} from "lucide-react";

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveSiteSettings(settings);
      setMessage({ type: "success", text: "Site content & banners updated in Firestore!" });
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to save: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset form values to default Stage & Steel settings?")) {
      setSettings(DEFAULT_SITE_SETTINGS);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        Loading site content...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white font-sans">
            Site Content & Banners CMS
          </h1>
          <p className="text-neutral-400 mt-1 uppercase tracking-widest">
            Control live ticker headlines, promotional badges, and contact details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4" />}
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-neutral-400 hover:text-white underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Announcement Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-sans font-bold">
            <Megaphone className="w-4 h-4" /> Top Announcement Bar Ticker
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showAnnouncement}
              onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
              className="accent-emerald-500 w-4 h-4"
            />
            <span className="text-white font-semibold">Show Announcement Ticker</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Ticker Text
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              placeholder="🔥 NUTRACEUTICAL GRADE FORMULATION // FREE EXPRESS SHIPPING"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Action Link Text
            </label>
            <input
              type="text"
              value={settings.announcementLinkText || ""}
              onChange={(e) => setSettings({ ...settings, announcementLinkText: e.target.value })}
              placeholder="SHOP STACK"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Section Headlines */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-sans font-bold">
          <Sparkles className="w-4 h-4" /> Hero Headlines & Badges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              placeholder="ENGINEERED FOR THE"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Hero Highlight Word
            </label>
            <input
              type="text"
              value={settings.heroHighlight}
              onChange={(e) => setSettings({ ...settings, heroHighlight: e.target.value })}
              placeholder="RELENTLESS"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Promo Badge Pill Text
            </label>
            <input
              type="text"
              value={settings.promoBadgeText}
              onChange={(e) => setSettings({ ...settings, promoBadgeText: e.target.value })}
              placeholder="OFFICIAL 2026 LAUNCH // 100% PURE"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Launch Modal Offer Text
            </label>
            <input
              type="text"
              value={settings.launchModalDiscountText}
              onChange={(e) =>
                setSettings({ ...settings, launchModalDiscountText: e.target.value })
              }
              placeholder="GET 10% OFF ON YOUR FIRST ORDER"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Hero Subtitle Description
            </label>
            <textarea
              rows={2}
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 3. Support & Social Information */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-sans font-bold">
          <Phone className="w-4 h-4" /> Customer Support & Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Support Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Support Phone
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              WhatsApp Widget Number
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
