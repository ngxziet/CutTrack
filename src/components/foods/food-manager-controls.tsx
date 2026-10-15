"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Sparkles, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { FoodItem } from "@/lib/store/cuttrack-store";
import { updateFoodAction, deleteFoodAction, CreateFoodInput } from "@/lib/server-actions";

interface FoodManagerControlsProps {
  food: FoodItem;
}

export function FoodManagerControls({ food }: FoodManagerControlsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit form state
  const [name, setName] = useState(food.name);
  const [category, setCategory] = useState<CreateFoodInput["category"]>(food.category);
  const [defaultGrams, setDefaultGrams] = useState(food.defaultGrams);
  const [edibleYieldPercent, setEdibleYieldPercent] = useState(food.edibleYieldPercent);
  const [weightBasis, setWeightBasis] = useState<CreateFoodInput["weightBasis"]>(food.weightBasis);
  const [caloriesPer100g, setCaloriesPer100g] = useState(food.caloriesPer100g);
  const [proteinPer100g, setProteinPer100g] = useState(food.proteinPer100g);
  const [carbsPer100g, setCarbsPer100g] = useState(food.carbsPer100g);
  const [fatPer100g, setFatPer100g] = useState(food.fatPer100g);
  const [defaultPriceVnd, setDefaultPriceVnd] = useState(food.defaultPriceVnd);
  const [confidenceNote, setConfidenceNote] = useState(food.confidenceNote);
  const [thumbnailUrl, setThumbnailUrl] = useState(food.thumbnailUrl);

  async function handleAiReEstimate() {
    setIsAiLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/foods/ai-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: name.trim(), notes: confidenceNote }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi khi gọi AI phân tích");
      }
      const d = json.data;
      if (d.caloriesPer100g !== undefined) setCaloriesPer100g(d.caloriesPer100g);
      if (d.proteinPer100g !== undefined) setProteinPer100g(d.proteinPer100g);
      if (d.carbsPer100g !== undefined) setCarbsPer100g(d.carbsPer100g);
      if (d.fatPer100g !== undefined) setFatPer100g(d.fatPer100g);
      if (d.defaultPriceVnd !== undefined) setDefaultPriceVnd(d.defaultPriceVnd);
      if (d.confidenceNote) setConfidenceNote(d.confidenceNote);
      setSuccessMessage("✨ AI đã cập nhật lại định lượng thành công!");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi phân tích AI");
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await updateFoodAction(food.slug, {
        name: name.trim(),
        category,
        defaultGrams,
        edibleYieldPercent,
        weightBasis,
        caloriesPer100g,
        proteinPer100g,
        carbsPer100g,
        fatPer100g,
        defaultPriceVnd,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        detailUrl: thumbnailUrl.trim() || undefined,
        confidenceNote: confidenceNote.trim(),
      });

      if (res.success) {
        setIsEditOpen(false);
        router.refresh();
      } else {
        setErrorMessage(res.message || "Cập nhật thất bại");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi khi cập nhật món ăn");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsSubmitting(true);
    try {
      const res = await deleteFoodAction(food.slug);
      if (res.success) {
        setIsDeleteOpen(false);
        router.push("/foods");
      } else {
        setErrorMessage(res.message || "Không thể xóa món ăn");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi khi xóa món ăn");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsEditOpen(true)}
        className="px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5 text-primary" />
        <span>Chỉnh sửa món</span>
      </button>

      <button
        onClick={() => setIsDeleteOpen(true)}
        className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        title="Xóa món ăn này khỏi thư viện"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Xóa món</span>
      </button>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Chỉnh Sửa Thông Tin Món Ăn</h3>
                <p className="text-xs text-muted-foreground">{food.name}</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tên món ăn</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAiReEstimate}
                    disabled={isAiLoading || !name.trim()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAiLoading ? "Đang tính..." : "✨ AI Tính Lại"}</span>
                  </button>
                </div>
              </div>

              {/* Nutrition Macros */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <span className="text-xs font-bold text-foreground block">Thành phần trên 100g phần ăn được</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] text-muted-foreground block">Calo (kcal)</label>
                    <input
                      type="number"
                      value={caloriesPer100g}
                      onChange={(e) => setCaloriesPer100g(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Đạm / Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={proteinPer100g}
                      onChange={(e) => setProteinPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sky-600 dark:text-sky-400 block">Tinh bột / Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={carbsPer100g}
                      onChange={(e) => setCarbsPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-sky-600 dark:text-sky-400 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-amber-600 dark:text-amber-400 block">Chất béo / Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fatPer100g}
                      onChange={(e) => setFatPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-amber-600 dark:text-amber-400 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Portion & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Khối lượng suất (g)</label>
                  <input
                    type="number"
                    value={defaultGrams}
                    onChange={(e) => setDefaultGrams(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Tỷ lệ ăn được (%)</label>
                  <input
                    type="number"
                    value={edibleYieldPercent}
                    onChange={(e) => setEdibleYieldPercent(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Giá tham khảo (VNĐ)</label>
                  <input
                    type="number"
                    step="1000"
                    value={defaultPriceVnd}
                    onChange={(e) => setDefaultPriceVnd(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Confidence Note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Lời khuyên dinh dưỡng & Ghi chú</label>
                <textarea
                  rows={2}
                  value={confidenceNote}
                  onChange={(e) => setConfidenceNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">URL Ảnh minh họa</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : "Cập Nhật Món Ăn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Xác nhận xóa món ăn?</h3>
                <p className="text-xs text-muted-foreground">Món <strong>"{food.name}"</strong> sẽ bị gỡ bỏ khỏi thư viện món ăn.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground"
              >
                Giữ Lại
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Đang xóa..." : "Xác Nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
