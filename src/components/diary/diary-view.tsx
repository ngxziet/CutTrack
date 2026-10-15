"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle2,
  Flame,
  Wallet,
  ShieldAlert,
} from "lucide-react";
import { FoodItem, MealSlotData } from "@/lib/store/cuttrack-store";
import { addFoodToMealAction, deleteMealItemAction, copyYesterdayMealAction } from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";

interface DiaryViewProps {
  initialDate: string;
  initialDiary: { LUNCH: MealSlotData; DINNER: MealSlotData };
  foods: FoodItem[];
  dailyBudgetVnd: number;
  dailyTargetCalories: number;
}

export function DiaryView({
  initialDate,
  initialDiary,
  foods,
  dailyBudgetVnd,
  dailyTargetCalories,
}: DiaryViewProps) {
  const [diary, setDiary] = useState(initialDiary);
  const [selectedSlot, setSelectedSlot] = useState<"LUNCH" | "DINNER" | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(foods[0]?.id || "");
  const [grams, setGrams] = useState<number>(300);
  const [customPrice, setCustomPrice] = useState<string>("");
  const [isHomePrepared, setIsHomePrepared] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedFood = foods.find((f) => f.id === selectedFoodId);

  const totalCalories = diary.LUNCH.totalCalories + diary.DINNER.totalCalories;
  const totalProtein = Math.round((diary.LUNCH.totalProtein + diary.DINNER.totalProtein) * 10) / 10;
  const totalCost = diary.LUNCH.totalCostVnd + diary.DINNER.totalCostVnd;

  async function handleAddFood(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !selectedFood) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Validate lunch rule
      if (selectedSlot === "LUNCH" && isHomePrepared) {
        throw new Error("Quy tắc bữa trưa: Đi làm chỉ ăn suất quán, không được thêm đồ chuẩn bị ở nhà.");
      }

      const priceVal = customPrice !== "" ? parseInt(customPrice, 10) : selectedFood.defaultPriceVnd;

      const res = await addFoodToMealAction({
        date: initialDate,
        slot: selectedSlot,
        foodId: selectedFood.id,
        grams: Number(grams),
        customPriceVnd: isNaN(priceVal) ? selectedFood.defaultPriceVnd : priceVal,
        isHomePrepared: selectedSlot === "DINNER" ? isHomePrepared : false,
      });

      if (res.success) {
        // Update local state
        setDiary((prev) => {
          const next = { ...prev };
          const slotData = next[selectedSlot];
          slotData.items = [...slotData.items, res.item];
          slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
          slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
          slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);
          return next;
        });

        setSuccessMessage(`Đã thêm ${selectedFood.name} vào ${selectedSlot === "LUNCH" ? "Bữa Trưa" : "Bữa Tối"}`);
        setSelectedSlot(null);
        setCustomPrice("");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Có lỗi xảy ra khi thêm món");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteItem(slot: "LUNCH" | "DINNER", itemId: string) {
    try {
      await deleteMealItemAction(initialDate, slot, itemId);
      setDiary((prev) => {
        const next = { ...prev };
        const slotData = next[slot];
        slotData.items = slotData.items.filter((i) => i.id !== itemId);
        slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
        slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
        slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCopyYesterday() {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await copyYesterdayMealAction(initialDate);
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể sao chép bữa hôm qua");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Copy Yesterday */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
            Nhật Ký Ăn Uống — 2 Bữa Mặc Định
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ngày: <span className="font-semibold text-foreground">{initialDate}</span> • Quy tắc nghiêm ngặt: Trưa ăn quán 1 phần, tối được thêm trứng/gà luộc.
          </p>
        </div>

        <button
          onClick={handleCopyYesterday}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-sm font-medium transition-colors"
        >
          <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Sao chép bữa hôm qua
        </button>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-border bg-card">
        <div>
          <span className="text-xs text-muted-foreground">Tổng calo nạp</span>
          <p className="text-xl font-extrabold text-foreground">
            {totalCalories} <span className="text-xs font-normal text-muted-foreground">/ {dailyTargetCalories} kcal</span>
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Tổng đạm (Protein)</span>
          <p className="text-xl font-extrabold text-foreground">
            {totalProtein}g
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Tổng chi phí</span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyVND(totalCost)}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Ngân sách còn lại</span>
          <p className="text-xl font-extrabold text-foreground">
            {formatCurrencyVND(Math.max(0, dailyBudgetVnd - totalCost))}
          </p>
        </div>
      </div>

      {/* 2 Meal Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SLOT 1: BỮA TRƯA */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="font-bold text-base text-foreground">Bữa Trưa (Suất Quán)</h2>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Chỉ ăn món quán, 1 suất • Không mang đồ tự làm từ nhà
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSlot("LUNCH");
                setIsHomePrepared(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-95"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm món trưa
            </button>
          </div>

          {/* List items */}
          {diary.LUNCH.items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs bg-secondary/30 rounded-xl border border-dashed border-border">
              Chưa có món nào cho bữa trưa. Nhấn "Thêm món trưa" để chọn suất quán.
            </div>
          ) : (
            <div className="space-y-2.5">
              {diary.LUNCH.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-sm text-foreground block">{item.foodName}</span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {item.grams}g ({item.weightBasis}) • <strong>{item.calories} kcal</strong> • {item.protein}g Protein • {item.carbs}g C • {item.fat}g F
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      {formatCurrencyVND(item.priceVnd)}
                    </span>
                    <button
                      onClick={() => handleDeleteItem("LUNCH", item.id)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-between text-xs text-muted-foreground border-t border-border">
            <span>Tổng calo trưa: <strong className="text-foreground">{diary.LUNCH.totalCalories} kcal</strong></span>
            <span>Chi phí: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrencyVND(diary.LUNCH.totalCostVnd)}</strong></span>
          </div>
        </div>

        {/* SLOT 2: BỮA TỐI */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="font-bold text-base text-foreground">Bữa Tối (+ Đạm Tại Nhà)</h2>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Cho phép bổ sung trứng gà luộc, má đùi gà luộc tại nhà
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSlot("DINNER");
                setIsHomePrepared(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-95"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm món tối
            </button>
          </div>

          {/* List items */}
          {diary.DINNER.items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs bg-secondary/30 rounded-xl border border-dashed border-border">
              Chưa có món nào cho bữa tối. Nhấn "Thêm món tối" để thêm đạm hoặc đồ ăn.
            </div>
          ) : (
            <div className="space-y-2.5">
              {diary.DINNER.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{item.foodName}</span>
                      {item.isHomePrepared && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          Nhà làm
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {item.grams}g ({item.weightBasis}) • <strong>{item.calories} kcal</strong> • {item.protein}g Protein • {item.carbs}g C • {item.fat}g F
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      {formatCurrencyVND(item.priceVnd)}
                    </span>
                    <button
                      onClick={() => handleDeleteItem("DINNER", item.id)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-between text-xs text-muted-foreground border-t border-border">
            <span>Tổng calo tối: <strong className="text-foreground">{diary.DINNER.totalCalories} kcal</strong></span>
            <span>Chi phí: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrencyVND(diary.DINNER.totalCostVnd)}</strong></span>
          </div>
        </div>
      </div>

      {/* Modal / Dialog for Adding Food */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground">
                Thêm món vào {selectedSlot === "LUNCH" ? "Bữa Trưa" : "Bữa Tối"}
              </h3>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFood} className="space-y-4">
              {/* Select Food */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Chọn món ăn từ thư viện
                </label>
                <select
                  value={selectedFoodId}
                  onChange={(e) => {
                    const fId = e.target.value;
                    setSelectedFoodId(fId);
                    const f = foods.find((item) => item.id === fId);
                    if (f) {
                      setGrams(f.defaultGrams);
                      if (f.defaultPriceVnd > 0) setCustomPrice(f.defaultPriceVnd.toString());
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
                >
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name} ({food.category === "HOMEMADE_PROTEIN" ? "Đạm nhà làm" : "Món quán"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Portion in Grams */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Khối lượng (gram)
                  </label>
                  <input
                    type="number"
                    value={grams}
                    min={10}
                    max={2000}
                    onChange={(e) => setGrams(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Độ ăn được: {selectedFood?.edibleYieldPercent}% ({selectedFood?.weightBasis})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Giá tiền (VND)
                  </label>
                  <input
                    type="number"
                    placeholder={selectedFood?.defaultPriceVnd ? selectedFood.defaultPriceVnd.toString() : "Tự nhập giá quán"}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    {selectedFood?.priceRequiresUserEntry ? "Bắt buộc nhập theo hóa đơn quán" : "Mặc định theo khảo sát"}
                  </span>
                </div>
              </div>

              {/* Home prepared toggle (Only for Dinner) */}
              {selectedSlot === "DINNER" ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                  <input
                    type="checkbox"
                    id="isHomePrepared"
                    checked={isHomePrepared}
                    onChange={(e) => setIsHomePrepared(e.target.checked)}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <label htmlFor="isHomePrepared" className="text-xs text-foreground cursor-pointer">
                    Món tự chuẩn bị / nấu tại nhà (Trứng luộc, má đùi gà luộc)
                  </label>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Quy tắc bữa trưa: Hệ thống khóa tùy chọn đồ nhà. Suất trưa cố định theo khẩu phần quán.
                  </span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-opacity"
                >
                  {isSubmitting ? "Đang lưu..." : "Xác nhận thêm món"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
