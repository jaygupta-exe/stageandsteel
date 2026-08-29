"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById, saveProduct } from "@/lib/products";
import { ProductData } from "@/components/ProductModal";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Package,
  Layers,
  ShieldCheck,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductData>({
    id: "",
    name: "",
    subtitle: "",
    category: "PROTEIN",
    price: "₹3,499",
    originalPrice: "₹4,299",
    servings: "30 Servings",
    netWeight: "1 KG (2.2 LBS)",
    thumbnail: "/belgium-chocolate-cutout.png",
    labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
    gallery: [
      { label: "01 FRONT PACKAGING", url: "/whey protein/belgium chocalte/front.png" },
    ],
    accentColor: "#596238",
    batchCode: "BATCH SS-2026",
    flavors: [{ name: "Standard", color: "#596238", inStock: true }],
    specs: [
      { label: "PROTEIN", value: "25", unit: "G" },
      { label: "SCOOP", value: "33", unit: "G" },
      { label: "ENERGY", value: "127.4", unit: "KCAL" },
    ],
    description: "",
    nutritionFacts: [
      { name: "Protein per Scoop", amount: "25g", dailyValue: "50%" },
    ],
    suggestedUse: "",
  });

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const prod = await getProductById(resolvedParams.id);
          if (prod) {
            setFormData(prod);
          } else {
            setError(`Product with ID "${resolvedParams.id}" not found.`);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isNew, resolvedParams.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.name.trim()) {
      setError("Product ID (slug) and Name are required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await saveProduct(formData);
      setSuccess("Product saved successfully to Firestore!");
      if (isNew) {
        setTimeout(() => {
          router.push(`/admin/products/${formData.id}`);
        }, 1200);
      }
    } catch (err: any) {
      setError("Failed to save product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Flavor helpers
  const addFlavor = () => {
    setFormData({
      ...formData,
      flavors: [...(formData.flavors || []), { name: "", color: "#596238", inStock: true }],
    });
  };

  const removeFlavor = (index: number) => {
    const updated = [...(formData.flavors || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, flavors: updated });
  };

  // Specs helpers
  const addSpec = () => {
    setFormData({
      ...formData,
      specs: [...(formData.specs || []), { label: "", value: "", unit: "" }],
    });
  };

  const removeSpec = (index: number) => {
    const updated = [...(formData.specs || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, specs: updated });
  };

  // Gallery helpers
  const addGalleryImage = () => {
    setFormData({
      ...formData,
      gallery: [...(formData.gallery || []), { label: `0${(formData.gallery?.length || 0) + 1} VIEW`, url: "" }],
    });
  };

  const removeGalleryImage = (index: number) => {
    const updated = [...(formData.gallery || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, gallery: updated });
  };

  // Nutrition Facts helpers
  const addNutritionRow = () => {
    setFormData({
      ...formData,
      nutritionFacts: [...(formData.nutritionFacts || []), { name: "", amount: "", dailyValue: "" }],
    });
  };

  const removeNutritionRow = (index: number) => {
    const updated = [...(formData.nutritionFacts || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, nutritionFacts: updated });
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        Loading product details...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">
              {isNew ? "Create New Product" : `Edit Product: ${formData.name}`}
            </h1>
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              {isNew ? "Configure formulas & specifications" : `ID: ${formData.id}`}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Save className="w-4 h-4 text-black" />
          )}
          <span>Save Product Data</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Section 1: Basic Identifiers */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <Package className="w-4 h-4" /> Basic Information & Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Unique Product ID (Slug) *
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="e.g. whey-belgian-chocolate"
              disabled={!isNew}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white disabled:opacity-60 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="STAGE WHEY - BELGIAN CHOCOLATE"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            >
              <option value="PROTEIN">PROTEIN</option>
              <option value="CREATINE">CREATINE</option>
              <option value="EAA">EAA</option>
              <option value="L-CARNITINE">L-CARNITINE</option>
              <option value="PRE-WORKOUT">PRE-WORKOUT</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isComingSoon"
              checked={Boolean(formData.isComingSoon)}
              onChange={(e) => setFormData({ ...formData, isComingSoon: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 bg-[#141a15]"
            />
            <label htmlFor="isComingSoon" className="text-neutral-300 font-mono text-xs cursor-pointer select-none">
              Mark as Coming Soon (Lab Pipeline)
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Subtitle / Formulation Tag
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="MICROFILTERED 100% PURE WHEY // RICH COCOA"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Accent Color (Hex)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-full bg-[#141a15] border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Selling Price (Formatted)
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="₹3,499"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Original Price (Strikethrough)
            </label>
            <input
              type="text"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="₹4,299"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Servings Count
            </label>
            <input
              type="text"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              placeholder="30 Servings"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Net Weight
            </label>
            <input
              type="text"
              value={formData.netWeight}
              onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
              placeholder="1 KG (2.2 LBS)"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Batch Code
            </label>
            <input
              type="text"
              value={formData.batchCode}
              onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
              placeholder="BATCH SS-2026-BC"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Media & Lab Reports */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Media & Verification (COA)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Thumbnail / Cutout Image Path
            </label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="/belgium-chocolate-cutout.png"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Lab Test Report URL (PDF or Image)
            </label>
            <input
              type="text"
              value={formData.labReportUrl || ""}
              onChange={(e) => setFormData({ ...formData, labReportUrl: e.target.value })}
              placeholder="/lab-reports/belgian-salted-caramel-test-report.png"
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Gallery Image List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
              Gallery Slides
            </span>
            <button
              type="button"
              onClick={addGalleryImage}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          <div className="space-y-2">
            {formData.gallery?.map((slide, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="text"
                  value={slide.label}
                  onChange={(e) => {
                    const updated = [...formData.gallery];
                    updated[idx].label = e.target.value;
                    setFormData({ ...formData, gallery: updated });
                  }}
                  placeholder="01 FRONT VIEW"
                  className="w-1/3 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={slide.url}
                  onChange={(e) => {
                    const updated = [...formData.gallery];
                    updated[idx].url = e.target.value;
                    setFormData({ ...formData, gallery: updated });
                  }}
                  placeholder="/images/front.png"
                  className="flex-1 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-900/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Flavors & Key Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flavors */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Flavor Options
            </h2>
            <button
              type="button"
              onClick={addFlavor}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Flavor
            </button>
          </div>

          <div className="space-y-2">
            {formData.flavors?.map((flv, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="text"
                  value={flv.name}
                  onChange={(e) => {
                    const updated = [...formData.flavors];
                    updated[idx].name = e.target.value;
                    setFormData({ ...formData, flavors: updated });
                  }}
                  placeholder="Belgian Chocolate"
                  className="flex-1 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="color"
                  value={flv.color}
                  onChange={(e) => {
                    const updated = [...formData.flavors];
                    updated[idx].color = e.target.value;
                    setFormData({ ...formData, flavors: updated });
                  }}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                />
                <label className="flex items-center gap-1.5 bg-[#141a15] px-3 py-2 rounded-xl border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flv.inStock}
                    onChange={(e) => {
                      const updated = [...formData.flavors];
                      updated[idx].inStock = e.target.checked;
                      setFormData({ ...formData, flavors: updated });
                    }}
                    className="accent-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-300">In Stock</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeFlavor(idx)}
                  className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-900/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Hero Specs Badges
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Spec
            </button>
          </div>

          <div className="space-y-2">
            {formData.specs?.map((spc, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="text"
                  value={spc.label}
                  onChange={(e) => {
                    const updated = [...formData.specs];
                    updated[idx].label = e.target.value;
                    setFormData({ ...formData, specs: updated });
                  }}
                  placeholder="PROTEIN"
                  className="w-1/3 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={spc.value}
                  onChange={(e) => {
                    const updated = [...formData.specs];
                    updated[idx].value = e.target.value;
                    setFormData({ ...formData, specs: updated });
                  }}
                  placeholder="25"
                  className="w-1/3 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={spc.unit || ""}
                  onChange={(e) => {
                    const updated = [...formData.specs];
                    updated[idx].unit = e.target.value;
                    setFormData({ ...formData, specs: updated });
                  }}
                  placeholder="G"
                  className="w-1/4 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(idx)}
                  className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-900/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Nutrition Facts & Descriptions */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0d120e] border border-neutral-800 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Nutrition Facts Table & Descriptions
        </h2>

        {/* Nutrition table rows */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
              Nutrient Rows
            </span>
            <button
              type="button"
              onClick={addNutritionRow}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Nutrient
            </button>
          </div>

          <div className="space-y-2">
            {formData.nutritionFacts?.map((nutr, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono text-xs">
                <input
                  type="text"
                  value={nutr.name}
                  onChange={(e) => {
                    const updated = [...formData.nutritionFacts];
                    updated[idx].name = e.target.value;
                    setFormData({ ...formData, nutritionFacts: updated });
                  }}
                  placeholder="Protein per Scoop (33g)"
                  className="flex-1 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={nutr.amount}
                  onChange={(e) => {
                    const updated = [...formData.nutritionFacts];
                    updated[idx].amount = e.target.value;
                    setFormData({ ...formData, nutritionFacts: updated });
                  }}
                  placeholder="25g"
                  className="w-1/4 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={nutr.dailyValue || ""}
                  onChange={(e) => {
                    const updated = [...formData.nutritionFacts];
                    updated[idx].dailyValue = e.target.value;
                    setFormData({ ...formData, nutritionFacts: updated });
                  }}
                  placeholder="50%"
                  className="w-1/5 bg-[#141a15] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeNutritionRow(idx)}
                  className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-900/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Full Product Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Pure microfiltered Belgian Chocolate whey concentrate delivering..."
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl p-4 text-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-1.5">
              Suggested Usage / Directions
            </label>
            <textarea
              rows={3}
              value={formData.suggestedUse}
              onChange={(e) => setFormData({ ...formData, suggestedUse: e.target.value })}
              placeholder="Mix 1 rounded scoop (33g) with 200–250ml cold water in a shaker..."
              className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl p-4 text-white focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
