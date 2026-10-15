"use client";

import React, { useState } from "react";
import { PlusCircle, Sparkles, X, CheckCircle2, AlertCircle, Loader2, Utensils, Image as ImageIcon } from "lucide-react";
import { createFoodAction, CreateFoodInput } from "@/lib/server-actions";

export function AddFoodModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CreateFoodInput["category"]>("STREET_FOOD");
  const [defaultGrams, setDefaultGrams] = useState<number>(350);
  const [edibleYieldPercent, setEdibleYieldPercent] = useState<number>(100);
  const [weightBasis, setWeightBasis] = useState<CreateFoodInput["weightBasis"]>("COOKED");
  const [caloriesPer100g, setCaloriesPer100g] = useState<number>(120);
  const [proteinPer100g, setProteinPer100g] = useState<number>(6.0);
  const [carbsPer100g, setCarbsPer100g] = useState<number>(15.0);
  const [fatPer100g, setFatPer100g] = useState<number>(3.0);
  const [defaultPriceVnd, setDefaultPriceVnd] = useState<number>(35000);
  const [confidenceNote, setConfidenceNote] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [aiSource, setAiSource] = useState<"GEMINI_CLOUD" | "EXPERT_KNOWLEDGE_ENGINE" | null>(null);

  async function handleAiEstimate() {
    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập tên món ăn trước khi gọi AI phân tích!");
      return;
    }

    setErrorMessage("");
    setIsAiLoading(true);
    setAiSuccessMessage("");

    try {
      const res = await fetch("/api/foods/ai-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: name.trim(), notes: confidenceNote }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Không thể phân tích món ăn");
      }

      const d = json.data;
      setAiSource(d.aiSource);
      if (d.category) setCategory(d.category);
      if (d.defaultGrams) setDefaultGrams(d.defaultGrams);
      if (d.edibleYieldPercent) setEdibleYieldPercent(d.edibleYieldPercent);
      if (d.weightBasis) setWeightBasis(d.weightBasis);
      if (d.caloriesPer100g !== undefined) setCaloriesPer100g(d.caloriesPer100g);
      if (d.proteinPer100g !== undefined) setProteinPer100g(d.proteinPer100g);
      if (d.carbsPer100g !== undefined) setCarbsPer100g(d.carbsPer100g);
      if (d.fatPer100g !== undefined) setFatPer100g(d.fatPer100g);
      if (d.defaultPriceVnd !== undefined) setDefaultPriceVnd(d.defaultPriceVnd);
      if (d.confidenceNote) setConfidenceNote(d.confidenceNote);

      setAiSuccessMessage(
        d.aiSource === "GEMINI_CLOUD"
          ? "🟢 Đã kết nối và phân tích thành công bởi Google Gemini Flash AI!"
          : "⚡ Đã tính toán thành công bởi Bộ quy tắc Dinh dưỡng Quốc gia (NIN)! (Thêm GEMINI_API_KEY vào .env để gọi trực tiếp Gemini Cloud AI)"
      );

      setTimeout(() => setAiSuccessMessage(""), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi khi gọi AI phân tích món ăn.");
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập tên món ăn!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await createFoodAction({
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
        priceRequiresUserEntry: defaultPriceVnd === 0,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        detailUrl: thumbnailUrl.trim() || undefined,
        confidenceNote: confidenceNote.trim() || "Món ăn do bạn tạo trong thư viện CutTrack.",
        isHomePreparedAllowed: category === "HOMEMADE_PROTEIN" || category === "STAPLE",
        isRestaurantFood: category !== "HOMEMADE_PROTEIN",
      });

      if (res.success) {
        setIsOpen(false);
        // Reset form
        setName("");
        setConfidenceNote("");
        setThumbnailUrl("");
      } else {
        setErrorMessage("Không thể tạo món ăn. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi máy chủ khi tạo món ăn");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:opacity-95 shadow-md shadow-primary/20 flex items-center gap-2 transition-all shrink-0"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Thêm Món Ăn Mới</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Thêm Món Ăn Mới Vào Thư Viện</h2>
                  <p className="text-xs text-muted-foreground">Tự nhập hoặc dùng AI tự động bóc tách calo, đạm, carb, béo và giá tiền</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success notification */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {aiSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            {/* Engine Information Banner */}
            <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                <span className="font-bold text-foreground block text-xs">
                  Cơ chế hoạt động của nút "AI Điền Tự Động":
                </span>
                <p>
                  • <strong className="text-foreground">Google Gemini 2.0 / 1.5 Flash (AI Thật)</strong>: Tự động kích hoạt khi bạn cấu hình <code>GEMINI_API_KEY</code> trong file <code>.env</code> (lấy miễn phí tại Google AI Studio).
                </p>
                <p>
                  • <strong className="text-foreground">Bộ Quy Tắc Dinh Dưỡng Viện NIN (Cục Bộ)</strong>: Khi chưa có API Key, hệ thống tự động bóc tách nguyên liệu (xương/thịt/tinh bột) và tính calo chuẩn theo Viện Dinh Dưỡng Quốc Gia, <em>hoàn toàn không phải random số ngẫu nhiên</em>.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dish Name & AI Action Bar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Tên Món Ăn <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-muted-foreground">Ví dụ: Bún chả Hà Nội, Cơm sườn ốp la, Ức gà nướng tiêu...</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên món ăn..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAiEstimate}
                    disabled={isAiLoading || !name.trim()}
                    className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                    title="AI sẽ tự động tính toán calo, protein, carbs, fat, giá và lời khuyên"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{isAiLoading ? "AI đang tính..." : "✨ AI Điền Tự Động"}</span>
                  </button>
                </div>
              </div>

              {/* Category & Weight Basis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phân loại món</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="STREET_FOOD">Món quán bình dân (Bún, Phở, Cơm tấm...)</option>
                    <option value="HOMEMADE_PROTEIN">Đạm luộc / Nấu tại nhà (Ức gà, Trứng, Bò...)</option>
                    <option value="STAPLE">Tinh bột nền tảng (Cơm trắng, Khoai, Yến mạch...)</option>
                    <option value="SPECIAL_MEAL">Bữa tiệc đá banh / Liên hoan</option>
                    <option value="BEVERAGE">Đồ uống & Tráng miệng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Trạng thái cân</label>
                  <select
                    value={weightBasis}
                    onChange={(e) => setWeightBasis(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="COOKED">Đã nấu chín (COOKED)</option>
                    <option value="EDIBLE">Phần ăn được thực tế (EDIBLE)</option>
                    <option value="BONE_IN">Cân cả xương (BONE_IN)</option>
                    <option value="RAW">Thực phẩm sống chưa nấu (RAW)</option>
                  </select>
                </div>
              </div>

              {/* Nutrition Macros (100g) */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Thông Số Dinh Dưỡng Trên 100g Phần Ăn</span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Năng lượng tính theo 4P + 4C + 9F
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Calo (kcal)</label>
                    <input
                      type="number"
                      min="0"
                      max="900"
                      value={caloriesPer100g}
                      onChange={(e) => setCaloriesPer100g(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Đạm / Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={proteinPer100g}
                      onChange={(e) => setProteinPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Tinh bột / Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={carbsPer100g}
                      onChange={(e) => setCarbsPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-sky-600 dark:text-sky-400 text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Chất béo / Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={fatPer100g}
                      onChange={(e) => setFatPer100g(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-amber-600 dark:text-amber-400 text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Portions, Edible Yield & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Khối lượng 1 suất (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={defaultGrams}
                    onChange={(e) => setDefaultGrams(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">Ví dụ: 450g cho tô bún</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Tỷ lệ ăn được (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={edibleYieldPercent}
                    onChange={(e) => setEdibleYieldPercent(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">100% nếu không xương</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Giá tham khảo (VNĐ)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={defaultPriceVnd}
                    onChange={(e) => setDefaultPriceVnd(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">0 nếu muốn tự nhập lúc ăn</span>
                </div>
              </div>

              {/* Nutritional advice & notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lời khuyên dinh dưỡng & Ghi chú (AI gợi ý)</label>
                <textarea
                  rows={2}
                  value={confidenceNote}
                  onChange={(e) => setConfidenceNote(e.target.value)}
                  placeholder="Ghi chú cách ăn khi siết cơ, thành phần nước dùng hoặc cách nấu..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Optional custom image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Đường dẫn ảnh minh họa (Tùy chọn)</span>
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://... (để trống nếu dùng ảnh mặc định hoặc tạo sau bằng AI)"
                  className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Đang lưu..." : "Lưu Món Ăn Vào Thư Viện"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
