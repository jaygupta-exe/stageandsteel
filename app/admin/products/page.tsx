"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts, deleteProduct, seedProducts } from "@/lib/products";
import { ProductData } from "@/components/ProductModal";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Database,
  Filter,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const items = await getAllProducts();
      setProducts(items);
      setFilteredProducts(items);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== "ALL") {
      result = result.filter((p) => p.category.toUpperCase() === selectedCategory.toUpperCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}" (${id})?`)) return;

    setDeletingId(id);
    setMessage(null);
    try {
      await deleteProduct(id);
      setMessage({ type: "success", text: `Product "${name}" was deleted successfully.` });
      await loadProducts();
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to delete product: " + err.message });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will write the default Stage & Steel products to Firestore. Proceed?")) return;
    setSeeding(true);
    setMessage(null);
    try {
      const res = await seedProducts();
      setMessage({ type: "success", text: `Successfully synced ${res.count} products to Firestore!` });
      await loadProducts();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSeeding(false);
    }
  };

  const categories = ["ALL", "PROTEIN", "CREATINE", "EAA"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            Product Catalog & Inventory
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest">
            Manage supplements, nutritional specifications, batch codes & lab tests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            <span>Sync Default Catalog</span>
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Notification */}
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0e130f] border border-neutral-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or ID..."
            className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-black font-bold"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-[#0d120e] border border-neutral-800/80">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            Loading catalog from Firestore...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 font-mono text-xs">
            <Package className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                  <th className="pb-3 px-3">Product</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Price</th>
                  <th className="pb-3 px-3">Flavors</th>
                  <th className="pb-3 px-3">Batch Code</th>
                  <th className="pb-3 px-3">Lab Report</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-900/40 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                          {prod.thumbnail ? (
                            <Image
                              src={prod.thumbnail}
                              alt={prod.name}
                              width={48}
                              height={48}
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold font-sans text-sm tracking-wide">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono">{prod.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">
                        {prod.category}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-3">
                      <span className="text-emerald-400 font-bold">{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                          {prod.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Flavors */}
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1">
                        {prod.flavors?.map((flv, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              flv.inStock
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-900"
                                : "bg-red-950/60 text-red-400 border border-red-900"
                            }`}
                          >
                            {flv.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Batch Code */}
                    <td className="py-4 px-3 text-neutral-400 text-[11px]">
                      {prod.batchCode || "—"}
                    </td>

                    {/* Lab Report Link */}
                    <td className="py-4 px-3">
                      {prod.labReportUrl ? (
                        <a
                          href={prod.labReportUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                        >
                          COA Available <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-neutral-400">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${encodeURIComponent(prod.id)}`}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          disabled={deletingId === prod.id}
                          className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === prod.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
