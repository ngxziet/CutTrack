"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit3,
  Copy,
  AlertCircle,
  CheckCircle2,
  Flame,
  Wallet,
  ShieldAlert,
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { FoodItem, MealSlotData, MealEntryItem } from "@/lib/store/cuttrack-store";
import {
  addFoodToMealAction,
  updateMealItemAction,
  deleteMealItemAction,
  copyYesterdayMealAction,
} from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";

interface DiaryViewProps {
  initialDate: string;
  todayDate: string;
  initialDiary: { LUNCH: MealSlotData; DINNER: MealSlotData };
  allDiaryDates?: Record<string, { LUNCH: MealSlotData; DINNER: MealSlotData }>;
  foods: FoodItem[];
  dailyBudgetVnd: number;
  dailyTargetCalories: number;
}

export function DiaryView({
  initialDate,
  todayDate,
  initialDiary,
  allDiaryDates = {},
  foods,
  dailyBudgetVnd,
  dailyTargetCalories,
}: DiaryViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [activeTab, setActiveTab] = useState<"LOG" | "HISTORY">("LOG");
  const [diary, setDiary] = useState(initialDiary);
  const [selectedSlot, setSelectedSlot] = useState<"LUNCH" | "DINNER" | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(foods[0]?.id || "");
  const [grams, setGrams] = useState<number>(300);
  const [customPrice, setCustomPrice] = useState<string>("");
  const [isHomePrepared, setIsHomePrepared] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef(false);

  // Edit item state
  const [editingItem, setEditingItem] = useState<{
    slot: "LUNCH" | "DINNER";
    item: MealEntryItem;
  } | null>(null);
  const [editGrams, setEditGrams] = useState<number>(300);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editHomePrepared, setEditHomePrepared] = useState<boolean>(false);
  const [isEditingSubmitting, setIsEditingSubmitting] = useState<boolean>(false);
  const isEditingRef = useRef(false);

  // Sync state if allDiaryDates or initialDiary changes
  useEffect(() => {
    if (allDiaryDates[currentDate]) {
      setDiary(allDiaryDates[currentDate]);
    } else if (currentDate === initialDate) {
      setDiary(initialDiary);
    }
  }, [allDiaryDates, currentDate, initialDate, initialDiary]);

  // Helper to change date
  function handleDateChange(newDate: string) {
    setCurrentDate(newDate);
    if (allDiaryDates[newDate]) {
      setDiary(allDiaryDates[newDate]);
    } else {
      setDiary({
        LUNCH: {
          slot: "LUNCH",
          slotName: "Bữa trưa (Suất quán)",
          items: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalCostVnd: 0,
        },
        DINNER: {
          slot: "DINNER",
          slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
          items: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalCostVnd: 0,
        },
      });
    }
    startTransition(() => {
      router.push(`/diary?date=${newDate}`);
    });
  }

  function shiftDate(offsetDays: number) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offsetDays);
    const newStr = d.toISOString().split("T")[0];
    handleDateChange(newStr);
  }

  const selectedFood = foods.find((f) => f.id === selectedFoodId);

  const totalCalories = diary.LUNCH.totalCalories + diary.DINNER.totalCalories;
  const totalProtein = Math.round((diary.LUNCH.totalProtein + diary.DINNER.totalProtein) * 10) / 10;
  const totalCost = diary.LUNCH.totalCostVnd + diary.DINNER.totalCostVnd;

  async function handleAddFood(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !selectedFood || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate lunch rule
      if (selectedSlot === "LUNCH" && isHomePrepared) {
        throw new Error("Quy tắc bữa trưa: Đi làm chỉ ăn suất quán, không được thêm đồ chuẩn bị ở nhà.");
      }

      const priceVal = customPrice !== "" ? parseInt(customPrice, 10) : selectedFood.defaultPriceVnd;
      const clientReqId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const res = await addFoodToMealAction({
        date: currentDate,
        slot: selectedSlot,
        foodId: selectedFood.id,
        grams: Number(grams),
        customPriceVnd: isNaN(priceVal) ? selectedFood.defaultPriceVnd : priceVal,
        isHomePrepared: selectedSlot === "DINNER" ? isHomePrepared : false,
        clientRequestId: clientReqId,
      });

      if (res.success && res.item) {
        // Update local state without duplicating
        setDiary((prev) => {
          const next = { ...prev };
          const slotData = next[selectedSlot];
          if (!slotData.items.some((i) => i.id === res.item.id)) {
            slotData.items = [...slotData.items, res.item];
            slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
            slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
            slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
            slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
            slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);
          }
          return next;
        });

        setSuccessMessage(`Đã thêm ${selectedFood.name} vào ${selectedSlot === "LUNCH" ? "Bữa Trưa" : "Bữa Tối"}`);
        setSelectedSlot(null);
        setCustomPrice("");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Có lỗi xảy ra khi thêm món");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleOpenEditModal(slot: "LUNCH" | "DINNER", item: MealEntryItem) {
    setEditingItem({ slot, item });
    setEditGrams(item.grams);
    setEditPrice(item.priceVnd.toString());
    setEditHomePrepared(item.isHomePrepared || false);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem || isEditingRef.current) return;

    isEditingRef.current = true;
    setIsEditingSubmitting(true);
    setErrorMessage(null);

    try {
      const priceVal = editPrice !== "" ? parseInt(editPrice, 10) : editingItem.item.priceVnd;
      const res = await updateMealItemAction({
        date: currentDate,
        slot: editingItem.slot,
        itemId: editingItem.item.id,
        grams: Number(editGrams),
        customPriceVnd: isNaN(priceVal) ? editingItem.item.priceVnd : priceVal,
        isHomePrepared: editingItem.slot === "DINNER" ? editHomePrepared : false,
      });

      if (res.success && res.item) {
        setDiary((prev) => {
          const next = { ...prev };
          const slotData = next[editingItem.slot];
          const idx = slotData.items.findIndex((i) => i.id === editingItem.item.id);
          if (idx !== -1) {
            slotData.items[idx] = res.item;
          }
          slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
          slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
          slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
          slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
          slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);
          return next;
        });

        setSuccessMessage(`Đã cập nhật món ${editingItem.item.foodName} thành công!`);
        setEditingItem(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi khi cập nhật món ăn");
    } finally {
      isEditingRef.current = false;
      setIsEditingSubmitting(false);
    }
  }

  async function handleDeleteItem(slot: "LUNCH" | "DINNER", itemId: string) {
    try {
      await deleteMealItemAction(currentDate, slot, itemId);
      setDiary((prev) => {
        const next = { ...prev };
        const slotData = next[slot];
        slotData.items = slotData.items.filter((i) => i.id !== itemId);
        slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
        slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
        slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
        slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
        slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);
        return next;
      });
      setSuccessMessage("Đã xóa món ăn khỏi thực đơn.");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCopyYesterday() {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await copyYesterdayMealAction(currentDate);
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể sao chép bữa hôm qua");
    }
  }

  // Calculate history entries
  const historyDates = Object.keys(allDiaryDates).sort((a, b) => b.localeCompare(a));
  const hasHistory = historyDates.length > 0;

  return (
    <div className="space-y-6">
      {/* Main Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("LOG")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "LOG"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Nhật Ký Hôm Nay / Theo Ngày
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "HISTORY"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            Lịch Sử Ăn Uống
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-background/80 font-bold border border-border">
              {historyDates.length}
            </span>
          </button>
        </div>

        {activeTab === "LOG" && (
          <button
            onClick={handleCopyYesterday}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Sao chép bữa hôm qua
          </button>
        )}
      </div>

      {/* Date Navigation Bar (Visible in LOG tab) */}
      {activeTab === "LOG" && (
        <div className="p-3.5 rounded-2xl border border-border bg-card flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftDate(-1)}
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Ngày trước đó"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => e.target.value && handleDateChange(e.target.value)}
                className="bg-transparent text-foreground font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => shiftDate(1)}
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Ngày tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentDate === todayDate ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hôm nay (Bắt đầu theo dõi)
              </span>
            ) : (
              <button
                onClick={() => handleDateChange(todayDate)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary hover:bg-accent text-foreground border border-border transition-colors"
              >
                Về hôm nay ({todayDate})
              </button>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Trưa chỉ ăn quán 1 phần • Tối tự làm thêm đạm
            </span>
          </div>
        </div>
      )}

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

      {/* VIEW 1: ACTIVE DAY LOG */}
      {activeTab === "LOG" && (
        <>
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {formatCurrencyVND(item.priceVnd)}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal("LUNCH", item)}
                      className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                      title="Chỉnh sửa lượng & giá"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {formatCurrencyVND(item.priceVnd)}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal("DINNER", item)}
                      className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                      title="Chỉnh sửa lượng & giá"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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

      {/* Modal / Dialog for Editing Food Item */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" />
                  Điều Chỉnh Món Ăn ({editingItem.slot === "LUNCH" ? "Bữa Trưa" : "Bữa Tối"})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thay đổi khối lượng và giá tiền theo thực tế bạn ăn
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {(() => {
              const currentFood = foods.find((f) => f.id === editingItem.item.foodId);
              const edibleYield = currentFood ? currentFood.edibleYieldPercent : 100;
              const weightBasis = currentFood ? currentFood.weightBasis : editingItem.item.weightBasis;
              const edibleG = (editGrams * edibleYield) / 100;
              const f = edibleG / 100;
              const liveCal = currentFood ? Math.round(currentFood.caloriesPer100g * f) : 0;
              const livePro = currentFood ? Math.round(currentFood.proteinPer100g * f * 10) / 10 : 0;
              const liveCarbs = currentFood ? Math.round(currentFood.carbsPer100g * f * 10) / 10 : 0;
              const liveFat = currentFood ? Math.round(currentFood.fatPer100g * f * 10) / 10 : 0;

              return (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {/* Food Info Header */}
                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-foreground">{editingItem.item.foodName}</span>
                      <p className="text-[11px] text-muted-foreground">
                        Trạng thái cân: <span className="font-semibold text-foreground uppercase">{weightBasis}</span> • Tỷ lệ ăn được: <span className="font-semibold text-foreground">{edibleYield}%</span>
                      </p>
                    </div>
                    {currentFood && (
                      <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                        {currentFood.category === "HOMEMADE_PROTEIN" ? "Đạm nhà" : "Món quán"}
                      </span>
                    )}
                  </div>

                  {/* Portion Slider & Number Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Khối lượng phần ăn (gram)
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[100, 150, 250, 350, 500].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setEditGrams(preset)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              editGrams === preset
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                            }`}
                          >
                            {preset}g
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={30}
                        max={1000}
                        step={5}
                        value={editGrams}
                        onChange={(e) => setEditGrams(Number(e.target.value))}
                        className="flex-1 accent-primary h-2 bg-secondary rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min={10}
                        max={2000}
                        value={editGrams}
                        onChange={(e) => setEditGrams(Number(e.target.value))}
                        className="w-24 p-2 text-center rounded-xl border border-border bg-background text-sm font-bold text-foreground"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Phần thực tế ăn được nạp vào cơ thể: <strong className="text-foreground">{Math.round(edibleG * 10) / 10}g</strong>
                    </p>
                  </div>

                  {/* Custom Price Input */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Giá tiền bữa ăn (VND)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={1000}
                        min={0}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder={editingItem.item.priceVnd.toString()}
                        className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">
                        VNĐ
                      </span>
                    </div>
                  </div>

                  {/* Home Prepared Toggle (For Dinner) */}
                  {editingItem.slot === "DINNER" ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                      <input
                        type="checkbox"
                        id="editHomePrepared"
                        checked={editHomePrepared}
                        onChange={(e) => setEditHomePrepared(e.target.checked)}
                        className="w-4 h-4 rounded text-primary"
                      />
                      <label htmlFor="editHomePrepared" className="text-xs text-foreground cursor-pointer">
                        Món tự chuẩn bị / nấu tại nhà (Trứng luộc, má đùi gà luộc)
                      </label>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Quy tắc bữa trưa: Đi làm chỉ ăn suất quán.</span>
                    </div>
                  )}

                  {/* Live Recalculated Macros Preview */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 block">Năng lượng</span>
                      <strong className="text-sm text-foreground">{liveCal}</strong>
                      <span className="text-[9px] text-muted-foreground block">kcal</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">Đạm</span>
                      <strong className="text-sm text-emerald-600 dark:text-emerald-400">{livePro}g</strong>
                      <span className="text-[9px] text-muted-foreground block">protein</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 block">Tinh bột</span>
                      <strong className="text-sm text-foreground">{liveCarbs}g</strong>
                      <span className="text-[9px] text-muted-foreground block">carbs</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 block">Chất béo</span>
                      <strong className="text-sm text-foreground">{liveFat}g</strong>
                      <span className="text-[9px] text-muted-foreground block">fat</span>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isEditingSubmitting}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-opacity"
                    >
                      {isEditingSubmitting ? "Đang lưu..." : "Lưu điều chỉnh món"}
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
        </>
      )}

      {/* VIEW 2: MEAL HISTORY ARCHIVE */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          {/* History Header & Summary Stats */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Kho Lịch Sử Ăn Uống — Bắt Đầu Từ Hôm Nay ({todayDate})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Theo dõi sự kiên trì từng ngày. Đảm bảo thâm hụt calo chuẩn và không vượt ngân sách 70k - 80k VNĐ.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Đã ghi chép: {historyDates.length} ngày
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-[11px] text-muted-foreground font-medium">Trung bình Calo nạp</span>
                <p className="text-lg font-extrabold text-foreground mt-0.5">
                  {Math.round(
                    historyDates.reduce(
                      (acc, d) =>
                        acc +
                        (allDiaryDates[d]?.LUNCH?.totalCalories || 0) +
                        (allDiaryDates[d]?.DINNER?.totalCalories || 0),
                      0
                    ) / Math.max(1, historyDates.length)
                  )}{" "}
                  <span className="text-xs font-normal text-muted-foreground">kcal/ngày</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-[11px] text-muted-foreground font-medium">Trung bình Đạm nạp</span>
                <p className="text-lg font-extrabold text-foreground mt-0.5">
                  {Math.round(
                    historyDates.reduce(
                      (acc, d) =>
                        acc +
                        (allDiaryDates[d]?.LUNCH?.totalProtein || 0) +
                        (allDiaryDates[d]?.DINNER?.totalProtein || 0),
                      0
                    ) / Math.max(1, historyDates.length)
                  )}{" "}
                  <span className="text-xs font-normal text-muted-foreground">g/ngày</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-[11px] text-muted-foreground font-medium">Trung bình Chi phí</span>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrencyVND(
                    Math.round(
                      historyDates.reduce(
                        (acc, d) =>
                          acc +
                          (allDiaryDates[d]?.LUNCH?.totalCostVnd || 0) +
                          (allDiaryDates[d]?.DINNER?.totalCostVnd || 0),
                        0
                      ) / Math.max(1, historyDates.length)
                    )
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Day Cards Timeline */}
          <div className="space-y-4">
            {historyDates.map((dateStr) => {
              const dayData = allDiaryDates[dateStr];
              if (!dayData) return null;

              const dayCalories = (dayData.LUNCH?.totalCalories || 0) + (dayData.DINNER?.totalCalories || 0);
              const dayProtein = Math.round(((dayData.LUNCH?.totalProtein || 0) + (dayData.DINNER?.totalProtein || 0)) * 10) / 10;
              const dayCost = (dayData.LUNCH?.totalCostVnd || 0) + (dayData.DINNER?.totalCostVnd || 0);
              const isToday = dateStr === todayDate;

              return (
                <div
                  key={dateStr}
                  className={`p-5 rounded-2xl border transition-all ${
                    isToday
                      ? "border-primary/50 bg-card shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-card/70 hover:border-border/80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {dateStr.slice(8, 10)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">
                            Ngày {dateStr}
                          </h3>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Hôm nay
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {isToday ? "Bắt đầu chu trình theo dõi chính thức" : "Nhật ký lưu trữ"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Calorie Status */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          dayCalories <= dailyTargetCalories
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {dayCalories} / {dailyTargetCalories} kcal
                      </span>

                      {/* Cost Status */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          dayCost <= dailyBudgetVnd
                            ? "bg-secondary text-foreground border border-border"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                        }`}
                      >
                        {formatCurrencyVND(dayCost)}
                      </span>

                      {/* Jump to day button */}
                      <button
                        onClick={() => {
                          handleDateChange(dateStr);
                          setActiveTab("LOG");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1 shrink-0"
                      >
                        Chi tiết <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Meals Breakdown for this Day */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    {/* Lunch */}
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Trưa quán ({dayData.LUNCH?.items.length || 0} món):
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatCurrencyVND(dayData.LUNCH?.totalCostVnd || 0)}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-[11px]">
                        {dayData.LUNCH?.items.length > 0 ? (
                          dayData.LUNCH.items.map((i) => i.foodName).join(", ")
                        ) : (
                          <span className="italic">Chưa có món</span>
                        )}
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Tối nhà ({dayData.DINNER?.items.length || 0} món):
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatCurrencyVND(dayData.DINNER?.totalCostVnd || 0)}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-[11px]">
                        {dayData.DINNER?.items.length > 0 ? (
                          dayData.DINNER.items.map((i) => i.foodName).join(", ")
                        ) : (
                          <span className="italic">Chưa có món</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
