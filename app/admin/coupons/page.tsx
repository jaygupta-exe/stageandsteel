"use client";

import React, { useEffect, useState } from "react";
import {
  getAllCoupons,
  saveCoupon,
  toggleCouponStatus,
  deleteCoupon,
  seedCoupons,
  Coupon,
} from "@/lib/coupons";
import {
  TicketPercent,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Database,
  X,
  Save,
  Sparkles,
} from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Coupon>({
    code: "",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    maxDiscount: undefined,
    description: "",
    isActive: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggle = async (code: string, currentStatus: boolean) => {
    setMessage(null);
    try {
      await toggleCouponStatus(code, !currentStatus);
      setMessage({
        type: "success",
        text: `Coupon ${code} is now ${!currentStatus ? "ACTIVE" : "INACTIVE"}.`,
      });
      await loadCoupons();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to update status: " + err.message });
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;

    setMessage(null);
    try {
      await deleteCoupon(code);
      setMessage({ type: "success", text: `Coupon ${code} deleted.` });
      await loadCoupons();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to delete coupon: " + err.message });
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will write the default Stage & Steel coupons to Firestore. Proceed?")) return;
    setSeeding(true);
    setMessage(null);
    try {
      const res = await seedCoupons();
      setMessage({ type: "success", text: `Successfully synced ${res.count} coupons to Firestore!` });
      await loadCoupons();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setMessage({ type: "error", text: "Coupon code is required." });
      return;
    }

    setSavingCoupon(true);
    setMessage(null);
    try {
      await saveCoupon(formData);
      setMessage({ type: "success", text: `Coupon ${formData.code.toUpperCase()} saved successfully!` });
      setModalOpen(false);
      setFormData({
        code: "",
        type: "percentage",
        value: 10,
        minOrderAmount: 0,
        maxDiscount: undefined,
        description: "",
        isActive: true,
      });
      await loadCoupons();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to save coupon: " + err.message });
    } finally {
      setSavingCoupon(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            Coupons & Referral Engine
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest">
            Create promotional discount codes, athlete stack codes & launch vouchers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            <span>Sync Default Codes</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between ${
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
            className="text-neutral-400 hover:text-white underline text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Coupons Table */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            Loading coupons from Firestore...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 font-mono text-xs">
            <TicketPercent className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            No coupons found. Click Create Coupon or Sync Default Codes to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Coupon Code</th>
                  <th className="pb-3 px-3">Discount Value</th>
                  <th className="pb-3 px-3">Min Order</th>
                  <th className="pb-3 px-3">Max Cap</th>
                  <th className="pb-3 px-3">Description</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-neutral-900/40 transition-colors">
                    {/* Code */}
                    <td className="py-4 px-3">
                      <span className="font-bold text-white text-sm bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 tracking-wider">
                        {c.code}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-4 px-3">
                      <span className="text-emerald-400 font-bold text-sm">
                        {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                      </span>
                    </td>

                    {/* Min Order */}
                    <td className="py-4 px-3 text-neutral-300">
                      {c.minOrderAmount && c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None (₹0)"}
                    </td>

                    {/* Max Cap */}
                    <td className="py-4 px-3 text-neutral-400">
                      {c.maxDiscount ? `₹${c.maxDiscount}` : "No Limit"}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-3 text-neutral-300 max-w-xs truncate">
                      {c.description || "—"}
                    </td>

                    {/* Status toggle */}
                    <td className="py-4 px-3">
                      <button
                        onClick={() => handleToggle(c.code, c.isActive)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          c.isActive
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/50"
                            : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800"
                        }`}
                      >
                        {c.isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>

                    {/* Delete Action */}
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => handleDelete(c.code)}
                        className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e130f] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black uppercase text-white font-sans mb-1">
              Create Promotional Coupon
            </h2>
            <p className="text-neutral-400 text-[11px] mb-6">
              Configure discount logic for customer checkout drawer
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                  Coupon Code (e.g. SUMMER20) *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="STAGE10"
                  className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none uppercase font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as "percentage" | "flat" })
                    }
                    className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="flat">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    placeholder={formData.type === "percentage" ? "10" : "200"}
                    className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                    Min. Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                    }
                    placeholder="0"
                    className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Optional"
                    className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Official 10% Member Stack Discount"
                  className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <span className="text-white font-semibold">Activate immediately</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCoupon}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {savingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
