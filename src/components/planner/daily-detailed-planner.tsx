"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Flame,
  Wallet,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  TrendingDown,
  Sun,
  Moon,
  Dumbbell,
  Utensils,
  ChevronRight,
  HelpCircle,
  Shuffle,
  Edit3,
  BookmarkCheck,
} from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { calculateBMR_MifflinStJeor, calculateTDEE } from "@/lib/formulas/nutrition";
import { evaluateWeeklyProgress } from "@/lib/formulas/progress-assessment";
import { FoodItem } from "@/lib/store/cuttrack-store";
import { applyPlanToDiaryAction } from "@/lib/server-actions";

export interface MealSlotItem {
  foodId: string;
  name: string;
  slug: string;
  portionGrams: number;
  edibleGrams: number;
  weightBasis: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  priceVnd: number;
  notes: string;
  thumbnailUrl: string;
}

export interface DaySchedule {
  dayName: string;
  dayShort: string;
  theme: string;
  workoutType: string;
  workoutTime: string;
  isSoccerDay: boolean;
  timeSchedule: {
    morningWeighIn: string;
    lunchTime: string;
    workoutTime: string;
    dinnerTime: string;
    bedTime: string;
  };
  lunch: MealSlotItem;
  dinner: MealSlotItem;
  specialRecovery?: {
    title: string;
    items: string;
    calories: number;
    protein: number;
    priceVnd: number;
    notes: string;
  };
}

const initialDaysSchedule: DaySchedule[] = [
  {
    dayName: "Thứ Hai",
    dayShort: "T2",
    theme: "Khởi động tuần mới • Tập Ngực & Bụng",
    workoutType: "Kháng lực thân trên (Push-up 3 hiệp x 12, Plank 3 hiệp x 45s)",
    workoutTime: "17:45 - 18:25 (40 phút)",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "06:30 - 06:45 (Cân sau khi đi vệ sinh, uống 350ml nước ấm)",
      lunchTime: "11:45 - 12:30 (Bữa trưa quán khi đi làm)",
      workoutTime: "17:45 - 18:25 (Tập kháng lực tại nhà)",
      dinnerTime: "19:00 - 19:45 (Bữa tối đạm luộc)",
      bedTime: "22:45 - 23:00 (Ngủ sâu 7.5 tiếng)",
    },
    lunch: {
      foodId: "food-com-ga-kho",
      name: "Cơm gà kho sả (Suất quán)",
      slug: "com-ga-kho",
      portionGrams: 350,
      edibleGrams: 262.5,
      weightBasis: "BONE_IN",
      calories: 575,
      protein: 31.8,
      carbs: 59.5,
      fat: 22.7,
      priceVnd: 30000,
      notes: "Suất cơm tiệm 30k. Dặn quán chan ít nước sốt béo, ăn kèm dưa leo.",
      thumbnailUrl: "/media/foods/thumbnails/com-ga-kho.svg",
    },
    dinner: {
      foodId: "food-ma-dui-ga-luoc",
      name: "Má đùi gà luộc (150g) + 2 trứng luộc + Cơm nhỏ",
      slug: "ma-dui-ga-luoc",
      portionGrams: 410,
      edibleGrams: 357.5,
      weightBasis: "BONE_IN + EDIBLE",
      calories: 599,
      protein: 47.8,
      carbs: 43.2,
      fat: 24.4,
      priceVnd: 23000,
      notes: "Đạm luộc tại nhà (má đùi 16k + 2 trứng 7k). No lâu, không ngấy.",
      thumbnailUrl: "/media/foods/thumbnails/ma-dui-ga-luoc.svg",
    },
  },
  {
    dayName: "Thứ Ba",
    dayShort: "T3",
    theme: "Ngày hồi phục nhẹ nhàng • Món bún thanh đạm",
    workoutType: "Đi bộ nhẹ nhàng / Giãn cơ (Active Recovery)",
    workoutTime: "18:00 - 18:30 (30 phút)",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "06:30 - 06:45 (Cân sáng)",
      lunchTime: "12:00 - 12:45 (Tô bún riêu quán)",
      workoutTime: "18:00 - 18:30 (Đi bộ nhẹ)",
      dinnerTime: "19:15 - 20:00 (Bữa tối)",
      bedTime: "22:45 - 23:00 (Nghỉ ngơi)",
    },
    lunch: {
      foodId: "food-bun-rieu",
      name: "Bún riêu cua bình dân (Tô 25k)",
      slug: "bun-rieu",
      portionGrams: 450,
      edibleGrams: 382.5,
      weightBasis: "COOKED",
      calories: 425,
      protein: 21.6,
      carbs: 56.2,
      fat: 13.5,
      priceVnd: 25000,
      notes: "100g bún chín + huyết + đậu hũ + gạch riêu. Mẹo: Không húp cạn nước dùng để tránh tích nước do muối.",
      thumbnailUrl: "/media/foods/thumbnails/bun-rieu.svg",
    },
    dinner: {
      foodId: "food-com-dau-hu-kho",
      name: "Cơm đậu hũ kho + 2 trứng gà luộc tại nhà",
      slug: "com-dau-hu-kho",
      portionGrams: 460,
      edibleGrams: 460,
      weightBasis: "COOKED",
      calories: 675,
      protein: 35.5,
      carbs: 69.1,
      fat: 28.6,
      priceVnd: 35000,
      notes: "Cơm đậu kho 28k + 2 quả trứng 7k bù đủ đạm cho ngày nghỉ.",
      thumbnailUrl: "/media/foods/thumbnails/com-dau-hu-kho.svg",
    },
  },
  {
    dayName: "Thứ Tư",
    dayShort: "T4",
    theme: "Tập Chân & Mông Tự Thân (Squat / Lunge)",
    workoutType: "Bodyweight Squat 4x15, Reverse Lunge 3x10/chân, Glute Bridge 3x15",
    workoutTime: "17:45 - 18:30 (45 phút)",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "06:30 - 06:45 (Cân sáng)",
      lunchTime: "11:45 - 12:30 (Suất quán trưa)",
      workoutTime: "17:45 - 18:30 (Tập cơ đùi mông)",
      dinnerTime: "19:00 - 19:45 (Bữa tối đạm gà)",
      bedTime: "22:45 - 23:00 (Nghỉ ngơi)",
    },
    lunch: {
      foodId: "food-com-ech-kho",
      name: "Cơm ếch kho sả ớt (Suất quán)",
      slug: "com-ech-kho",
      portionGrams: 340,
      edibleGrams: 238,
      weightBasis: "BONE_IN",
      calories: 493,
      protein: 32.3,
      carbs: 59.5,
      fat: 14.3,
      priceVnd: 35000,
      notes: "Thịt ếch giàu đạm, ít chất béo, phù hợp cho ngày tập cơ đùi lớn.",
      thumbnailUrl: "/media/foods/thumbnails/com-ech-kho.svg",
    },
    dinner: {
      foodId: "food-ma-dui-ga-luoc",
      name: "Má đùi gà luộc + 2 trứng luộc + Cơm trắng",
      slug: "ma-dui-ga-luoc",
      portionGrams: 410,
      edibleGrams: 357.5,
      weightBasis: "BONE_IN + EDIBLE",
      calories: 599,
      protein: 47.8,
      carbs: 43.2,
      fat: 24.4,
      priceVnd: 23000,
      notes: "Nạp đạm hỗ trợ cơ bắp phục hồi sau các hiệp Squat.",
      thumbnailUrl: "/media/foods/thumbnails/ma-dui-ga-luoc.svg",
    },
  },
  {
    dayName: "Thứ Năm",
    dayShort: "T5",
    theme: "Tập Lưng Xô & Bụng Sâu (Backpack Row / Dead Bug)",
    workoutType: "Backpack Row 4x12, Dead Bug 3x10/bên, Reverse Crunch 3x12",
    workoutTime: "17:45 - 18:25 (40 phút)",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "06:30 - 06:45 (Cân sáng)",
      lunchTime: "11:45 - 12:30 (Suất quán trưa)",
      workoutTime: "17:45 - 18:25 (Tập lưng & bụng)",
      dinnerTime: "19:00 - 19:45 (Bữa tối ít tinh bột)",
      bedTime: "22:45 - 23:00 (Nghỉ ngơi)",
    },
    lunch: {
      foodId: "food-com-ga-kho",
      name: "Cơm gà kho sả 30k + Pepsi Zero 10k",
      slug: "com-ga-kho",
      portionGrams: 670,
      edibleGrams: 582.5,
      weightBasis: "BONE_IN + EDIBLE",
      calories: 575,
      protein: 31.8,
      carbs: 59.5,
      fat: 22.7,
      priceVnd: 40000,
      notes: "Pepsi Zero 0 calo giúp đã khát, giải tỏa cảm giác thèm ngọt giữa ngày.",
      thumbnailUrl: "/media/foods/thumbnails/com-ga-kho.svg",
    },
    dinner: {
      foodId: "food-ma-dui-ga-luoc",
      name: "Má đùi gà luộc 150g + 2 quả trứng gà luộc",
      slug: "ma-dui-ga-luoc",
      portionGrams: 260,
      edibleGrams: 207.5,
      weightBasis: "BONE_IN + EDIBLE",
      calories: 404,
      protein: 43.8,
      carbs: 0.9,
      fat: 23.9,
      priceVnd: 23000,
      notes: "Bữa tối dồn năng lượng vào phục hồi khối cơ lưng xô.",
      thumbnailUrl: "/media/foods/thumbnails/ma-dui-ga-luoc.svg",
    },
  },
  {
    dayName: "Thứ Sáu",
    dayShort: "T6",
    theme: "Dưỡng sức tích trữ Glycogen trước trận bóng đá",
    workoutType: "Nghỉ ngơi hoàn toàn (Rest Day)",
    workoutTime: "Nghỉ ngơi chuẩn bị thể lực",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "06:30 - 06:45 (Cân sáng)",
      lunchTime: "12:00 - 12:45 (Bún bò Huế tiệm)",
      workoutTime: "Nghỉ ngơi thả lỏng",
      dinnerTime: "19:00 - 19:45 (Cơm + Trứng luộc)",
      bedTime: "22:30 - 23:00 (Ngủ sớm)",
    },
    lunch: {
      foodId: "food-bun-bo-hue",
      name: "Bún bò Huế (Tô quán 35k)",
      slug: "bun-bo-hue",
      portionGrams: 500,
      edibleGrams: 375,
      weightBasis: "BONE_IN",
      calories: 575,
      protein: 34.0,
      carbs: 60.0,
      fat: 22.0,
      priceVnd: 35000,
      notes: "Thịt bắp bò nạc, giò heo gân và chả cua nạp năng lượng dồi dào.",
      thumbnailUrl: "/media/foods/thumbnails/bun-bo-hue.svg",
    },
    dinner: {
      foodId: "food-trung-ga-luoc",
      name: "Cơm trắng (200g) + 3 quả trứng gà luộc tại nhà",
      slug: "trung-ga-luoc",
      portionGrams: 365,
      edibleGrams: 365,
      weightBasis: "COOKED + EDIBLE",
      calories: 495,
      protein: 26.1,
      carbs: 57.6,
      fat: 16.0,
      priceVnd: 10500,
      notes: "Bữa tối siêu tiết kiệm chỉ 10.500đ, nạp đủ tinh bột sạch tích vào gan/cơ.",
      thumbnailUrl: "/media/foods/thumbnails/trung-ga-luoc.svg",
    },
  },
  {
    dayName: "Thứ Bảy",
    dayShort: "T7",
    theme: "TRẬN ĐÁ BANH 45 PHÚT + BỮA TIỆC PHỤC HỒI",
    workoutType: "Thi đấu bóng đá sân 7 cỏ nhân tạo (45 phút cường độ cao)",
    workoutTime: "16:30 - 17:30 (45 phút thi đấu)",
    isSoccerDay: true,
    timeSchedule: {
      morningWeighIn: "07:00 - 07:15 (Cân sáng cuối tuần)",
      lunchTime: "11:30 - 12:15 (Cơm gà kho 30k)",
      workoutTime: "16:30 - 17:30 (Khởi động & Đá bóng 45p)",
      dinnerTime: "19:00 - 20:30 (Tiệc gà nướng + Cơm lam + Bánh bao)",
      bedTime: "23:00 - 23:30 (Ngủ hồi phục cơ bắp)",
    },
    lunch: {
      foodId: "food-com-ga-kho",
      name: "Cơm gà kho quán 30k + 1 hộp Yomost 8.5k",
      slug: "com-ga-kho",
      portionGrams: 520,
      edibleGrams: 432.5,
      weightBasis: "BONE_IN + EDIBLE",
      calories: 685,
      protein: 33.5,
      carbs: 84.1,
      fat: 23.5,
      priceVnd: 38500,
      notes: "Uống Yomost trước trận 1-2 tiếng để nạp đường hấp thu nhanh.",
      thumbnailUrl: "/media/foods/thumbnails/com-ga-kho.svg",
    },
    dinner: {
      foodId: "food-nua-con-ga-nuong",
      name: "Nửa con gà nướng (450g có xương) + Cơm lam + Bánh bao",
      slug: "nua-con-ga-nuong",
      portionGrams: 720,
      edibleGrams: 562.5,
      weightBasis: "BONE_IN + COOKED",
      calories: 1295,
      protein: 88.5,
      carbs: 110.0,
      fat: 55.0,
      priceVnd: 131000,
      notes: "Bữa tiệc phục hồi hoành tráng! Thịt ăn được ~292g, bù đắp toàn bộ glycogen cạn kiệt.",
      thumbnailUrl: "/media/foods/thumbnails/nua-con-ga-nuong.svg",
    },
  },
  {
    dayName: "Chủ Nhật",
    dayShort: "CN",
    theme: "Cân đối bù trừ ngân sách & Nghỉ ngơi trọn vẹn",
    workoutType: "Nghỉ ngơi hoàn toàn (Rest Day)",
    workoutTime: "Nghỉ ngơi, ngủ đủ giấc",
    isSoccerDay: false,
    timeSchedule: {
      morningWeighIn: "07:30 - 08:00 (Cân sáng & Đánh giá tổng tuần)",
      lunchTime: "12:00 - 12:45 (Tô hủ tiếu sườn quán)",
      workoutTime: "Nghỉ ngơi / Thư giãn",
      dinnerTime: "19:00 - 19:45 (Cơm trắng + 3 trứng luộc)",
      bedTime: "22:30 - 23:00 (Chuẩn bị tuần mới)",
    },
    lunch: {
      foodId: "food-hu-tieu-nuoc",
      name: "Hủ tiếu nước sườn nạc (Tô quán 30k)",
      slug: "hu-tieu-nuoc",
      portionGrams: 450,
      edibleGrams: 360,
      weightBasis: "BONE_IN",
      calories: 441,
      protein: 24.8,
      carbs: 58.5,
      fat: 12.6,
      priceVnd: 30000,
      notes: "Tô hủ tiếu thanh đạm, ấm bụng ngày cuối tuần.",
      thumbnailUrl: "/media/foods/thumbnails/hu-tieu-nuoc.svg",
    },
    dinner: {
      foodId: "food-trung-ga-luoc",
      name: "Cơm trắng + 3 quả trứng gà luộc tại nhà",
      slug: "trung-ga-luoc",
      portionGrams: 365,
      edibleGrams: 365,
      weightBasis: "COOKED + EDIBLE",
      calories: 495,
      protein: 26.1,
      carbs: 57.6,
      fat: 16.0,
      priceVnd: 10500,
      notes: "Bữa tối chỉ 10.500đ giúp chốt sổ tuần xuất sắc dưới ngân sách 560k.",
      thumbnailUrl: "/media/foods/thumbnails/trung-ga-luoc.svg",
    },
  },
];

interface DailyDetailedPlannerProps {
  availableFoods: FoodItem[];
}

export function DailyDetailedPlanner({ availableFoods }: DailyDetailedPlannerProps) {
  // Height & Weight Inputs
  const [heightCm, setHeightCm] = useState<number>(168);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(68.0);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(62.0);

  // Weekly Plan Schedule State (Editable by user)
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialDaysSchedule);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Edit Dish Modal State
  const [editingSlot, setEditingSlot] = useState<"LUNCH" | "DINNER" | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(availableFoods[0]?.id || "");
  const [customGrams, setCustomGrams] = useState<number>(350);
  const [customPriceVnd, setCustomPriceVnd] = useState<number>(30000);

  // Morning Weekly Weigh-in Check State
  const [previousWeekAvg, setPreviousWeekAvg] = useState<number>(68.2);
  const [currentWeekAvg, setCurrentWeekAvg] = useState<number>(67.6);
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  // Apply to diary feedback
  const [isApplyingPlan, setIsApplyingPlan] = useState<boolean>(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);

  // Recalculate BMR and TDEE dynamically
  const bmr = calculateBMR_MifflinStJeor({
    gender: "male",
    weightKg: currentWeightKg,
    heightCm: heightCm,
    ageYears: 23,
  });
  const tdee = calculateTDEE(bmr, "sedentary");
  const safeMin = Math.round(tdee - 450);
  const safeMax = Math.round(tdee - 300);

  // Evaluate weekly progress
  const progressAssessment = evaluateWeeklyProgress(previousWeekAvg, currentWeekAvg, targetWeightKg);

  const selectedDay = schedule[selectedDayIndex];

  // Daily totals for selected day
  const dailyCalories = selectedDay.lunch.calories + selectedDay.dinner.calories;
  const dailyProtein = Math.round((selectedDay.lunch.protein + selectedDay.dinner.protein) * 10) / 10;
  const dailyCost = selectedDay.lunch.priceVnd + selectedDay.dinner.priceVnd;
  const dailyDeficit = tdee - dailyCalories;
  const proteinPerKg = Math.round((dailyProtein / currentWeightKg) * 10) / 10;

  // Apply current day plan to diary
  async function handleApplyPlanToDiary() {
    setIsApplyingPlan(true);
    setApplyMessage(null);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

    try {
      await applyPlanToDiaryAction({
        date: today,
        lunch: {
          foodId: selectedDay.lunch.foodId,
          portionGrams: selectedDay.lunch.portionGrams,
          priceVnd: selectedDay.lunch.priceVnd,
        },
        dinner: {
          foodId: selectedDay.dinner.foodId,
          portionGrams: selectedDay.dinner.portionGrams,
          priceVnd: selectedDay.dinner.priceVnd,
          isHomePrepared: true,
        },
      });
      setApplyMessage(`Đã áp dụng thực đơn ${selectedDay.dayName} vào Nhật ký hôm nay (${today}) thành công!`);
    } catch (err: any) {
      setApplyMessage(err.message || "Không thể áp dụng thực đơn");
    } finally {
      setIsApplyingPlan(false);
    }
  }

  // Open Swap Dish Modal
  function openEditModal(slot: "LUNCH" | "DINNER") {
    setEditingSlot(slot);
    const currentItem = slot === "LUNCH" ? selectedDay.lunch : selectedDay.dinner;
    setSelectedFoodId(currentItem.foodId);
    setCustomGrams(currentItem.portionGrams);
    setCustomPriceVnd(currentItem.priceVnd);
  }

  // Handle Save Swapped Dish
  function handleSaveSwappedDish() {
    const chosenFood = availableFoods.find((f) => f.id === selectedFoodId);
    if (!chosenFood || !editingSlot) return;

    const edibleGrams = (customGrams * chosenFood.edibleYieldPercent) / 100;
    const factor = edibleGrams / 100;
    const calories = Math.round(chosenFood.caloriesPer100g * factor);
    const protein = Math.round(chosenFood.proteinPer100g * factor * 10) / 10;
    const carbs = Math.round(chosenFood.carbsPer100g * factor * 10) / 10;
    const fat = Math.round(chosenFood.fatPer100g * factor * 10) / 10;

    const updatedItem: MealSlotItem = {
      foodId: chosenFood.id,
      name: chosenFood.name,
      slug: chosenFood.slug,
      portionGrams: customGrams,
      edibleGrams,
      weightBasis: chosenFood.weightBasis,
      calories,
      protein,
      carbs,
      fat,
      priceVnd: customPriceVnd,
      notes: chosenFood.confidenceNote,
      thumbnailUrl: chosenFood.thumbnailUrl,
    };

    setSchedule((prev) => {
      const copy = [...prev];
      const day = { ...copy[selectedDayIndex] };
      if (editingSlot === "LUNCH") {
        day.lunch = updatedItem;
      } else {
        day.dinner = updatedItem;
      }
      copy[selectedDayIndex] = day;
      return copy;
    });

    setEditingSlot(null);
  }

  // Auto-shuffle / Smart Re-generate
  function handleSmartRegenerate() {
    // Generate fresh variations of lunch and dinner
    const lunchPool = availableFoods.filter((f) => f.isRestaurantFood);
    const dinnerPool = availableFoods.filter((f) => f.isHomePreparedAllowed);

    setSchedule((prev) => {
      return prev.map((day, idx) => {
        if (day.isSoccerDay) return day; // Preserve Saturday soccer feast
        const randomLunch = lunchPool[idx % lunchPool.length];
        const randomDinner = dinnerPool[(idx + 1) % dinnerPool.length];

        const lunchEdible = (randomLunch.defaultGrams * randomLunch.edibleYieldPercent) / 100;
        const lunchCal = Math.round(randomLunch.caloriesPer100g * (lunchEdible / 100));
        const lunchPro = Math.round(randomLunch.proteinPer100g * (lunchEdible / 100) * 10) / 10;

        const dinnerEdible = (randomDinner.defaultGrams * randomDinner.edibleYieldPercent) / 100;
        const dinnerCal = Math.round(randomDinner.caloriesPer100g * (dinnerEdible / 100));
        const dinnerPro = Math.round(randomDinner.proteinPer100g * (dinnerEdible / 100) * 10) / 10;

        return {
          ...day,
          lunch: {
            foodId: randomLunch.id,
            name: `${randomLunch.name} (Suất quán)`,
            slug: randomLunch.slug,
            portionGrams: randomLunch.defaultGrams,
            edibleGrams: lunchEdible,
            weightBasis: randomLunch.weightBasis,
            calories: lunchCal,
            protein: lunchPro,
            carbs: Math.round(randomLunch.carbsPer100g * (lunchEdible / 100)),
            fat: Math.round(randomLunch.fatPer100g * (lunchEdible / 100)),
            priceVnd: randomLunch.defaultPriceVnd > 0 ? randomLunch.defaultPriceVnd : 35000,
            notes: randomLunch.confidenceNote,
            thumbnailUrl: randomLunch.thumbnailUrl,
          },
          dinner: {
            foodId: randomDinner.id,
            name: `${randomDinner.name} tại nhà`,
            slug: randomDinner.slug,
            portionGrams: randomDinner.defaultGrams,
            edibleGrams: dinnerEdible,
            weightBasis: randomDinner.weightBasis,
            calories: dinnerCal,
            protein: dinnerPro,
            carbs: Math.round(randomDinner.carbsPer100g * (dinnerEdible / 100)),
            fat: Math.round(randomDinner.fatPer100g * (dinnerEdible / 100)),
            priceVnd: randomDinner.defaultPriceVnd > 0 ? randomDinner.defaultPriceVnd : 15000,
            notes: randomDinner.confidenceNote,
            thumbnailUrl: randomDinner.thumbnailUrl,
          },
        };
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTROL: Live Height & Weight Selector */}
      <div className="p-6 rounded-3xl border border-primary/20 bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Chọn Cân Nặng & Chiều Cao Hiện Tại Để Thiết Lập Năng Lượng
            </h2>
            <p className="text-xs text-muted-foreground">
              Công thức Mifflin-St Jeor tự động tính lại BMR, TDEE và đề xuất mức thâm hụt giảm mỡ an toàn.
            </p>
          </div>
          <button
            onClick={handleSmartRegenerate}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-accent text-foreground text-xs font-semibold transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-primary" />
            Tự động đổi mới thực đơn tuần
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Chiều cao hiện tại (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              min={140}
              max={210}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng hiện tại (kg)
            </label>
            <input
              type="number"
              step="0.5"
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
              min={45}
              max={150}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              BMR Trao đổi chất cơ bản
            </label>
            <div className="p-2.5 rounded-xl bg-secondary/50 border border-border text-sm font-extrabold text-foreground">
              {bmr} <span className="text-xs font-normal text-muted-foreground">kcal/ngày</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              TDEE Ít vận động (x1.2)
            </label>
            <div className="p-2.5 rounded-xl bg-secondary/50 border border-border text-sm font-extrabold text-orange-500">
              {tdee} <span className="text-xs font-normal text-muted-foreground">kcal/ngày</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            Khuyến nghị mức ăn an toàn cho người <strong>{currentWeightKg}kg / {heightCm}cm</strong>:
          </span>
          <span className="font-bold text-sm">
            {safeMin} – {safeMax} kcal/ngày (Thâm hụt 300 - 450 kcal/ngày)
          </span>
        </div>
      </div>

      {/* 2. WEEKLY MORNING WEIGH-IN ASSESSMENT ENGINE */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Đánh Giá Cân Nặng Buổi Sáng Hàng Tuần (Kiểm Tra Tiến Độ Thực Tế)
            </h2>
            <p className="text-xs text-muted-foreground">
              So sánh cân nặng trung bình buổi sáng giữa 2 tuần liên tiếp để xác định tốc độ giảm mỡ và nguy cơ mất cơ.
            </p>
          </div>
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" /> Tiêu chuẩn cân buổi sáng
          </button>
        </div>

        {/* Inputs for previous & current morning weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng sáng tuần trước (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={previousWeekAvg}
              onChange={(e) => setPreviousWeekAvg(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng sáng tuần này (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={currentWeekAvg}
              onChange={(e) => setCurrentWeekAvg(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-black text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tốc độ thay đổi (7 ngày)
            </label>
            <div className={`p-2.5 rounded-xl border text-sm font-black flex items-center justify-between ${
              progressAssessment.badgeColor === "emerald"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : progressAssessment.badgeColor === "amber"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                : "bg-blue-500/10 border-blue-500/30 text-blue-600"
            }`}>
              <span>{progressAssessment.weightChangeKg > 0 ? `+${progressAssessment.weightChangeKg}` : `${progressAssessment.weightChangeKg}`} kg / tuần</span>
              <span className="text-xs font-bold uppercase">{progressAssessment.status}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Card */}
        <div className={`p-5 rounded-2xl border space-y-2.5 ${
          progressAssessment.badgeColor === "emerald"
            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200"
            : progressAssessment.badgeColor === "amber"
            ? "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200"
            : "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200"
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>{progressAssessment.statusTitleVi}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            {progressAssessment.diagnosisVi}
          </p>

          <div className="pt-2 border-t border-border/40 text-xs space-y-1">
            <strong className="block font-semibold">Lời khuyên điều chỉnh cho tuần tiếp theo:</strong>
            <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90">
              {progressAssessment.recommendationsVi.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-xs flex justify-between items-center text-muted-foreground">
            <span>Dự kiến số tuần còn lại về mốc 62kg:</span>
            <strong className="text-foreground text-sm font-bold">~{progressAssessment.estimatedWeeksToTarget} tuần nữa</strong>
          </div>
        </div>

        {/* Morning Weigh-in Protocol Checklist */}
        {showChecklist && (
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs space-y-2">
            <h4 className="font-bold text-foreground">Bộ Quy Tắc Vàng Cân Cân Nặng Buổi Sáng:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {progressAssessment.waterRetentionChecklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. DAY SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Chọn từng ngày để xem lịch trình giờ giấc & thực đơn:
          </span>
          <span className="text-xs text-muted-foreground">
            Bạn có thể bấm <strong>"Đổi món"</strong> ở bất kỳ bữa nào
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {schedule.map((d, index) => (
            <button
              key={index}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDayIndex === index
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>{d.dayName}</span>
              {d.isSoccerDay && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-amber-950 font-black">
                  ⚽ Đá banh
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDED TIMELINE SCHEDULE FOR THE SELECTED DAY */}
      <div className="p-5 rounded-3xl border border-border bg-card shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Thời Gian Đề Xuất Sinh Hoạt Trong Ngày ({selectedDay.dayName})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              🌅 06:30 - 06:45
            </span>
            <p className="font-semibold text-foreground">Cân sáng & Nước ấm</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Uống 350ml nước lọc, đi vệ sinh trước khi cân.</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold block mb-1">
              ☀️ 11:45 - 12:30
            </span>
            <p className="font-semibold text-foreground">Bữa Trưa Suất Quán</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Cố định 1 suất quán tiệm, uống Pepsi Zero/nước lọc.</p>
          </div>

          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-[10px] text-sky-700 dark:text-sky-400 uppercase font-bold block mb-1">
              ⚡ {selectedDay.isSoccerDay ? "16:30 - 17:30" : "17:45 - 18:25"}
            </span>
            <p className="font-semibold text-foreground">{selectedDay.isSoccerDay ? "Đá bóng 45p" : "Tập kháng lực"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{selectedDay.workoutType}</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block mb-1">
              🌙 19:00 - 19:45
            </span>
            <p className="font-semibold text-foreground">Bữa Tối Đạm Nhà</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Nạp má đùi gà luộc / trứng luộc phục hồi cơ.</p>
          </div>

          <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              💤 22:45 - 23:00
            </span>
            <p className="font-semibold text-foreground">Đi ngủ phục hồi</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ngủ sâu 7.5 tiếng để cơ thể sản sinh testosterone.</p>
          </div>
        </div>
      </div>

      {/* 5. DETAILED DAILY MENU WITH SWAP DISH BUTTONS */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-foreground">
                Chi Tiết Thực Đơn: {selectedDay.dayName}
              </h2>
              {selectedDay.isSoccerDay && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Ngày Đá Banh + Tiệc Phục Hồi
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{selectedDay.theme}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px]">Tổng Calo:</span>
              <strong className="text-sm text-foreground">{dailyCalories} kcal</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Tổng Đạm:</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400">{dailyProtein}g</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Chi Phí:</span>
              <strong className="text-sm text-foreground">{formatCurrencyVND(dailyCost)}</strong>
            </div>

            <button
              onClick={handleApplyPlanToDiary}
              disabled={isApplyingPlan}
              className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-primary/20 hover:opacity-95 transition-opacity ml-auto"
            >
              <BookmarkCheck className="w-4 h-4" />
              {isApplyingPlan ? "Đang lưu vào nhật ký..." : `Áp dụng vào Nhật ký hôm nay`}
            </button>
          </div>
        </div>

        {applyMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
            <span>✓ {applyMessage}</span>
            <a href="/diary" className="underline font-bold hover:opacity-80">
              Xem Nhật ký ngay →
            </a>
          </div>
        )}

        {/* 2 Meal Cards: Lunch & Dinner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LUNCH CARD */}
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Bữa Trưa (Suất Quán — Cố Định 1 Phần)
              </span>
              <button
                onClick={() => openEditModal("LUNCH")}
                className="px-2.5 py-1.5 rounded-xl bg-background border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Điều chỉnh & Đổi món
              </button>
            </div>

            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border">
                <img
                  src={selectedDay.lunch.thumbnailUrl}
                  alt={selectedDay.lunch.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">{selectedDay.lunch.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Khẩu phần: <strong>{selectedDay.lunch.portionGrams}g</strong> ({selectedDay.lunch.weightBasis}) • Ăn được: {selectedDay.lunch.edibleGrams}g
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="font-bold text-orange-500">{selectedDay.lunch.calories} kcal</span>
                  <span>Đạm: <strong className="text-foreground">{selectedDay.lunch.protein}g</strong></span>
                  <span>Giá: <strong className="text-foreground">{formatCurrencyVND(selectedDay.lunch.priceVnd)}</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic bg-background/60 p-2.5 rounded-xl border border-border">
              💡 {selectedDay.lunch.notes}
            </p>
          </div>

          {/* DINNER CARD */}
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Bữa Tối (+ Đạm Chuẩn Bị Tại Nhà)
              </span>
              <button
                onClick={() => openEditModal("DINNER")}
                className="px-2.5 py-1.5 rounded-xl bg-background border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs font-semibold hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Điều chỉnh & Đổi món
              </button>
            </div>

            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border">
                <img
                  src={selectedDay.dinner.thumbnailUrl}
                  alt={selectedDay.dinner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">{selectedDay.dinner.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Khẩu phần: <strong>{selectedDay.dinner.portionGrams}g</strong> ({selectedDay.dinner.weightBasis}) • Ăn được: {selectedDay.dinner.edibleGrams}g
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="font-bold text-orange-500">{selectedDay.dinner.calories} kcal</span>
                  <span>Đạm: <strong className="text-foreground">{selectedDay.dinner.protein}g</strong></span>
                  <span>Giá: <strong className="text-foreground">{formatCurrencyVND(selectedDay.dinner.priceVnd)}</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic bg-background/60 p-2.5 rounded-xl border border-border">
              🍳 {selectedDay.dinner.notes}
            </p>
          </div>
        </div>

        {/* 6. DAILY NUTRITIONAL & BUDGET VERDICT */}
        <div className="p-6 rounded-3xl border border-border bg-secondary/30 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Đánh Giá Dinh Dưỡng & Ngân Sách Ngày {selectedDay.dayName}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">
                Mức Thâm Hụt Năng Lượng
              </span>
              <p className="text-base font-extrabold text-foreground">
                {dailyDeficit > 0 ? `Thâm hụt -${dailyDeficit} kcal` : `Dư +${Math.abs(dailyDeficit)} kcal`}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                {dailyCalories <= safeMax && dailyCalories >= safeMin
                  ? "✓ Nằm trong dải chuẩn vàng giảm mỡ"
                  : dailyCalories > tdee
                  ? "✓ Bù trừ cho buổi chạy 45 phút"
                  : "✓ Kiểm soát calo an toàn"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">
                Hàm Lượng Protein / Thể Trọng
              </span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {proteinPerKg} g/kg <span className="text-xs text-muted-foreground font-normal">({dailyProtein}g)</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {proteinPerKg >= 1.8 ? "✓ Đạt mốc 1.8-2.0g/kg bảo tồn cơ nạc" : "Mức vừa đủ cho ngày nghỉ"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">
                Hạn Mức Chi Tiêu (80k)
              </span>
              <p className="text-base font-extrabold text-foreground">
                {formatCurrencyVND(dailyCost)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                {dailyCost <= 80000
                  ? `✓ Dư dôi ${formatCurrencyVND(80000 - dailyCost)} tích lũy`
                  : "Bù trừ từ các ngày dư dôi trong tuần"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
            💬 <strong>Lời khuyên chuyên môn cho ngày {selectedDay.dayName}:</strong>{" "}
            {selectedDay.isSoccerDay
              ? "Hôm nay là ngày đá banh, việc nạp nhiều tinh bột và đạm từ gà nướng vào buổi tối là chiến lược dinh dưỡng thể thao chuẩn xác để hồi phục cơ bắp và nạp đầy kho dự trữ Glycogen, hoàn toàn không gây tích tụ mỡ nếu tổng tuần vẫn âm calo."
              : "Với 2 bữa chính (Trưa quán 30k + Tối trứng/gà tự luộc), bạn vừa tiết kiệm tối đa thời gian nấu nướng buổi trưa khi đi làm, vừa kiểm soát được 100% chất lượng nguồn đạm sạch vào bữa tối."}
          </div>
        </div>
      </div>

      {/* SWAP DISH MODAL */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" />
                  Điều Chỉnh Món Ăn Cho {editingSlot === "LUNCH" ? "Bữa Trưa" : "Bữa Tối"} ({selectedDay.dayName})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tùy chỉnh khẩu phần, giá tiền hoặc đổi sang món ăn khác
                </p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {(() => {
              const chosenFood = availableFoods.find((f) => f.id === selectedFoodId);
              const edibleYield = chosenFood ? chosenFood.edibleYieldPercent : 100;
              const edibleG = (customGrams * edibleYield) / 100;
              const factor = edibleG / 100;
              const liveCal = chosenFood ? Math.round(chosenFood.caloriesPer100g * factor) : 0;
              const livePro = chosenFood ? Math.round(chosenFood.proteinPer100g * factor * 10) / 10 : 0;
              const liveCarbs = chosenFood ? Math.round(chosenFood.carbsPer100g * factor * 10) / 10 : 0;
              const liveFat = chosenFood ? Math.round(chosenFood.fatPer100g * factor * 10) / 10 : 0;

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Chọn món ăn ({editingSlot === "LUNCH" ? "Chỉ hiển thị món quán" : "Tất cả món"}):
                    </label>
                    <select
                      value={selectedFoodId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedFoodId(id);
                        const food = availableFoods.find((item) => item.id === id);
                        if (food) {
                          setCustomGrams(food.defaultGrams);
                          setCustomPriceVnd(food.defaultPriceVnd > 0 ? food.defaultPriceVnd : 35000);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
                    >
                      {availableFoods
                        .filter((item) => (editingSlot === "LUNCH" ? item.isRestaurantFood : true))
                        .map((food) => (
                          <option key={food.id} value={food.id}>
                            {food.name} ({food.caloriesPer100g} kcal/100g • {food.defaultPriceVnd > 0 ? formatCurrencyVND(food.defaultPriceVnd) : "Tự nhập giá"})
                          </option>
                        ))}
                    </select>
                  </div>

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
                            onClick={() => setCustomGrams(preset)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              customGrams === preset
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                            }`}
                          >
                            {preset}g
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          value={customGrams}
                          onChange={(e) => setCustomGrams(Number(e.target.value))}
                          min={50}
                          max={1000}
                          className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold"
                        />
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          Ăn được thực tế: <strong>{Math.round(edibleG * 10) / 10}g</strong> ({edibleYield}%)
                        </span>
                      </div>

                      <div>
                        <input
                          type="number"
                          step="1000"
                          value={customPriceVnd}
                          onChange={(e) => setCustomPriceVnd(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold"
                        />
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          Giá tiền (VNĐ)
                        </span>
                      </div>
                    </div>
                  </div>

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

                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditingSlot(null)}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSwappedDish}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-opacity"
                    >
                      Xác nhận đổi món & Tính lại
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
