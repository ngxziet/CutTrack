"use server";

import { revalidatePath } from "next/cache";
import {
  loadCutTrackState,
  saveCutTrackState,
  MealEntryItem,
  MealSlotData,
  WorkoutSessionData,
  WeightEntry,
  UserProfileState,
  ExerciseConfig,
} from "./store/cuttrack-store";
import {
  REFERENCE_BMR_KCAL,
  REFERENCE_TDEE_KCAL,
  DAILY_BUDGET_MAX_VND,
} from "./constants";
import { checkCalorieTargetSafety } from "./formulas/safety";

export async function getAppState() {
  return loadCutTrackState();
}

export async function getDiaryForDate(dateStr: string) {
  const state = loadCutTrackState();
  const dayDiary = state.diary[dateStr] || {
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
  };
  return dayDiary;
}

export async function addFoodToMealAction(formData: {
  date: string;
  slot: "LUNCH" | "DINNER";
  foodId: string;
  grams: number;
  customPriceVnd?: number;
  isHomePrepared?: boolean;
}) {
  const state = loadCutTrackState();
  const food = state.foods.find((f) => f.id === formData.foodId);
  if (!food) {
    throw new Error("Không tìm thấy món ăn");
  }

  // Ràng buộc bữa trưa: không cho phép thêm đồ tự chuẩn bị
  if (formData.slot === "LUNCH" && formData.isHomePrepared) {
    throw new Error("Quy tắc bữa trưa: Đi làm chỉ ăn suất quán, không được thêm đồ chuẩn bị ở nhà.");
  }

  const edibleGrams = (formData.grams * food.edibleYieldPercent) / 100;
  const factor = edibleGrams / 100;

  const calories = Math.round(food.caloriesPer100g * factor);
  const protein = Math.round(food.proteinPer100g * factor * 10) / 10;
  const carbs = Math.round(food.carbsPer100g * factor * 10) / 10;
  const fat = Math.round(food.fatPer100g * factor * 10) / 10;

  const priceVnd = formData.customPriceVnd !== undefined ? formData.customPriceVnd : food.defaultPriceVnd;

  const newItem: MealEntryItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    foodId: food.id,
    foodName: food.name,
    grams: formData.grams,
    edibleGrams,
    calories,
    protein,
    carbs,
    fat,
    priceVnd,
    weightBasis: food.weightBasis,
    isHomePrepared: Boolean(formData.isHomePrepared),
  };

  if (!state.diary[formData.date]) {
    state.diary[formData.date] = {
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
    };
  }

  const slotData = state.diary[formData.date][formData.slot];
  slotData.items.push(newItem);

  // Recalculate totals
  slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
  slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
  slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
  slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
  slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);

  // Also log into expenses
  state.expenses.unshift({
    id: `exp-${Date.now()}`,
    date: formData.date,
    title: `${food.name} (${formData.slot === "LUNCH" ? "Bữa trưa" : "Bữa tối"})`,
    amountVnd: priceVnd,
    category: formData.slot,
  });

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  return { success: true, item: newItem };
}

export async function deleteMealItemAction(date: string, slot: "LUNCH" | "DINNER", itemId: string) {
  const state = loadCutTrackState();
  if (!state.diary[date] || !state.diary[date][slot]) return { success: false };

  const slotData = state.diary[date][slot];
  slotData.items = slotData.items.filter((i) => i.id !== itemId);

  slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
  slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
  slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
  slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
  slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  return { success: true };
}

export async function copyYesterdayMealAction(currentDate: string) {
  const state = loadCutTrackState();
  // Find yesterday or recent date
  const dates = Object.keys(state.diary).sort();
  const prevDate = dates.filter((d) => d < currentDate).pop();

  if (!prevDate || !state.diary[prevDate]) {
    throw new Error("Chưa có dữ liệu bữa ăn của ngày trước đó để sao chép.");
  }

  const prevDiary = state.diary[prevDate];
  state.diary[currentDate] = JSON.parse(JSON.stringify(prevDiary));

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function logWorkoutAction(workout: Omit<WorkoutSessionData, "id">) {
  const state = loadCutTrackState();
  const newWorkout: WorkoutSessionData = {
    ...workout,
    id: `w-${Date.now()}`,
  };

  state.workouts.unshift(newWorkout);
  saveCutTrackState(state);
  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  return { success: true, workout: newWorkout };
}

export async function logMeasurementAction(data: { date: string; weightKg: number; waistCm?: number; notes?: string }) {
  const state = loadCutTrackState();
  const newEntry: WeightEntry = {
    id: `m-${Date.now()}`,
    ...data,
  };

  state.measurements.push(newEntry);
  state.measurements.sort((a, b) => a.date.localeCompare(b.date));
  state.profile.currentWeightKg = data.weightKg;

  saveCutTrackState(state);
  revalidatePath("/progress");
  revalidatePath("/dashboard");
  return { success: true, measurement: newEntry };
}

export async function updateProfileGoalsAction(goals: Partial<UserProfileState>) {
  const state = loadCutTrackState();
  state.profile = { ...state.profile, ...goals };
  saveCutTrackState(state);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true, profile: state.profile };
}

export async function saveExerciseConfigAction(slug: string, config: ExerciseConfig) {
  const state = loadCutTrackState();
  if (!state.exerciseConfigs) {
    state.exerciseConfigs = {};
  }
  state.exerciseConfigs[slug] = config;
  saveCutTrackState(state);
  revalidatePath("/exercises");
  revalidatePath(`/exercises/${slug}`);
  return { success: true, config };
}

export async function getMealHistoryAction() {
  const state = loadCutTrackState();
  const dates = Object.keys(state.diary).sort((a, b) => b.localeCompare(a));
  const history = dates.map((date) => {
    const day = state.diary[date];
    const totalCalories = day.LUNCH.totalCalories + day.DINNER.totalCalories;
    const totalProtein = Math.round((day.LUNCH.totalProtein + day.DINNER.totalProtein) * 10) / 10;
    const totalCostVnd = day.LUNCH.totalCostVnd + day.DINNER.totalCostVnd;
    const lunchItems = day.LUNCH.items.map((i) => i.foodName);
    const dinnerItems = day.DINNER.items.map((i) => i.foodName);

    let status: "EXCELLENT" | "DEFICIT_SAFE" | "OVER_CALORIES" | "EMPTY" = "DEFICIT_SAFE";
    if (totalCalories === 0) {
      status = "EMPTY";
    } else if (totalCalories > state.profile.safeMaxCalories) {
      status = "OVER_CALORIES";
    } else if (totalProtein >= 70 && totalCostVnd <= state.profile.dailyBudgetVnd) {
      status = "EXCELLENT";
    }

    return {
      date,
      totalCalories,
      totalProtein,
      totalCostVnd,
      lunchItems,
      dinnerItems,
      lunchCost: day.LUNCH.totalCostVnd,
      dinnerCost: day.DINNER.totalCostVnd,
      status,
    };
  });

  return { success: true, history };
}

