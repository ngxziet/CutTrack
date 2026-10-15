"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { FoodItem } from "@/lib/store/cuttrack-store";
import { addFoodToMealAction } from "@/lib/server-actions";

export function FoodDetailScaler({ food }: { food: FoodItem }) {
  const router = useRouter();
  const [grams, setGrams] = useState<number>(food.defaultGrams);
  const [targetSlot, setTargetSlot] = useState<"LUNCH" | "DINNER">("LUNCH");
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const edibleGrams = (grams * food.edibleYieldPercent) / 100;
  const factor = edibleGrams / 100;

  const currentCalories = Math.round(food.caloriesPer100g * factor);
  const currentProtein = Math.round(food.proteinPer100g * factor * 10) / 10;
  const currentCarbs = Math.round(food.carbsPer100g * factor * 10) / 10;
  const currentFat = Math.round(food.fatPer100g * factor * 10) / 10;

  async function handleQuickAdd() {
    setIsAdding(true);
    setSuccess(false);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

    try {
      await addFoodToMealAction({
        date: today,
        slot: targetSlot,
        foodId: food.id,
        grams: Number(grams),
        customPriceVnd: food.defaultPriceVnd,
        isHomePrepared: targetSlot === "DINNER" && food.category === "HOMEMADE_PROTEIN",
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/diary");
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Không thể thêm món");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Bộ Tính Khẩu Phần & Macros</h2>
          <p className="text-xs text-muted-foreground">Kéo thanh trượt để thay đổi khối lượng nạp vào</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setGrams(100)}
            className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground"
          >
            100g chuẩn
          </button>
          <button
            onClick={() => setGrams(food.defaultGrams)}
            className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground"
          >
            1 suất quán ({food.defaultGrams}g)
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-semibold text-foreground">
          <span>Khối lượng cả món:</span>
          <span className="text-primary font-extrabold text-base">{grams}g</span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={10}
          value={grams}
          onChange={(e) => setGrams(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-secondary rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>50g</span>
          <span>Thực ăn được: <strong>{Math.round(edibleGrams)}g</strong></span>
          <span>1.000g</span>
        </div>
      </div>

      {/* 4 Macros Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 block">Năng lượng</span>
          <span className="text-2xl font-black text-foreground">{currentCalories}</span>
          <span className="text-[11px] text-muted-foreground block">kcal</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">Đạm (Protein)</span>
          <span className="text-2xl font-black text-foreground">{currentProtein}g</span>
          <span className="text-[11px] text-muted-foreground block">{Math.round(currentProtein * 4)} kcal</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 block">Tinh bột (Carbs)</span>
          <span className="text-2xl font-black text-foreground">{currentCarbs}g</span>
          <span className="text-[11px] text-muted-foreground block">{Math.round(currentCarbs * 4)} kcal</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block">Chất béo (Fat)</span>
          <span className="text-2xl font-black text-foreground">{currentFat}g</span>
          <span className="text-[11px] text-muted-foreground block">{Math.round(currentFat * 9)} kcal</span>
        </div>
      </div>

      {/* Quick Add to Meal Action */}
      <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-foreground shrink-0">Thêm vào:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetSlot("LUNCH")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                targetSlot === "LUNCH"
                  ? "bg-amber-500 text-amber-950 font-bold"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              Bữa Trưa (Quán)
            </button>
            <button
              onClick={() => setTargetSlot("DINNER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                targetSlot === "DINNER"
                  ? "bg-emerald-500 text-emerald-950 font-bold"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              Bữa Tối
            </button>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-primary/20"
        >
          {success ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Đã thêm thành công! Đang chuyển trang...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> Thêm món này vào Nhật ký
            </>
          )}
        </button>
      </div>
    </div>
  );
}
