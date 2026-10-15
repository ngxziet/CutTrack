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
  FoodItem,
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
  clientRequestId?: string;
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

  // Idempotency check 1: If clientRequestId matches an existing item, return it
  if (formData.clientRequestId) {
    const existingById = slotData.items.find((i) => i.id === formData.clientRequestId);
    if (existingById) {
      return { success: true, item: existingById };
    }
  }

  const priceVnd = formData.customPriceVnd !== undefined ? formData.customPriceVnd : food.defaultPriceVnd;

  // Idempotency check 2: If the exact same food, grams, and price was added in the last 2 seconds, reuse it
  const now = Date.now();
  const existingRecent = slotData.items.find((i) => {
    if (i.foodId === food.id && i.grams === formData.grams && i.priceVnd === priceVnd) {
      const match = i.id.match(/^item-(\d+)/);
      if (match) {
        const itemTime = parseInt(match[1], 10);
        if (now - itemTime < 2000) return true;
      }
    }
    return false;
  });
  if (existingRecent) {
    return { success: true, item: existingRecent };
  }

  const edibleGrams = (formData.grams * food.edibleYieldPercent) / 100;
  const factor = edibleGrams / 100;

  const calories = Math.round(food.caloriesPer100g * factor);
  const protein = Math.round(food.proteinPer100g * factor * 10) / 10;
  const carbs = Math.round(food.carbsPer100g * factor * 10) / 10;
  const fat = Math.round(food.fatPer100g * factor * 10) / 10;

  const itemId = formData.clientRequestId || `item-${now}-${Math.random().toString(36).substring(2, 6)}`;

  const newItem: MealEntryItem = {
    id: itemId,
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

  slotData.items.push(newItem);

  // Recalculate totals
  slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
  slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
  slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
  slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
  slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);

  // Log into expenses (skip if identical expense was logged in last 2 seconds)
  const expenseTitle = `${food.name} (${formData.slot === "LUNCH" ? "Bữa trưa" : "Bữa tối"})`;
  const existingExp = state.expenses.find(
    (e) => e.date === formData.date && e.title === expenseTitle && Math.abs(e.amountVnd - priceVnd) < 1
  );
  if (!existingExp) {
    state.expenses.unshift({
      id: `exp-${now}`,
      date: formData.date,
      title: expenseTitle,
      amountVnd: priceVnd,
      category: formData.slot,
    });
  }

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  return { success: true, item: newItem };
}

export async function updateMealItemAction(formData: {
  date: string;
  slot: "LUNCH" | "DINNER";
  itemId: string;
  grams: number;
  customPriceVnd?: number;
  isHomePrepared?: boolean;
}) {
  const state = loadCutTrackState();
  if (!state.diary[formData.date] || !state.diary[formData.date][formData.slot]) {
    throw new Error("Không tìm thấy dữ liệu nhật ký của ngày này.");
  }

  const slotData = state.diary[formData.date][formData.slot];
  const itemIndex = slotData.items.findIndex((i) => i.id === formData.itemId);
  if (itemIndex === -1) {
    throw new Error("Không tìm thấy món ăn trong bữa.");
  }

  const existingItem = slotData.items[itemIndex];
  const food = state.foods.find((f) => f.id === existingItem.foodId);
  if (!food) {
    throw new Error("Không tìm thấy thông tin gốc của món ăn.");
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

  const priceVnd = formData.customPriceVnd !== undefined ? formData.customPriceVnd : existingItem.priceVnd;

  const updatedItem: MealEntryItem = {
    ...existingItem,
    grams: formData.grams,
    edibleGrams,
    calories,
    protein,
    carbs,
    fat,
    priceVnd,
    isHomePrepared: formData.slot === "DINNER" ? Boolean(formData.isHomePrepared) : false,
  };

  slotData.items[itemIndex] = updatedItem;

  // Recalculate totals
  slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
  slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
  slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
  slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
  slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);

  // Sync expense if exists
  const expenseTitle = `${food.name} (${formData.slot === "LUNCH" ? "Bữa trưa" : "Bữa tối"})`;
  const expense = state.expenses.find((e) => e.date === formData.date && e.title.includes(food.name));
  if (expense) {
    expense.amountVnd = priceVnd;
  }

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  return { success: true, item: updatedItem };
}

export async function deleteMealItemAction(date: string, slot: "LUNCH" | "DINNER", itemId: string) {
  const state = loadCutTrackState();
  if (!state.diary[date] || !state.diary[date][slot]) return { success: false };

  const slotData = state.diary[date][slot];
  const itemToDelete = slotData.items.find((i) => i.id === itemId);
  slotData.items = slotData.items.filter((i) => i.id !== itemId);

  slotData.totalCalories = slotData.items.reduce((s, i) => s + i.calories, 0);
  slotData.totalProtein = Math.round(slotData.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
  slotData.totalCarbs = Math.round(slotData.items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
  slotData.totalFat = Math.round(slotData.items.reduce((s, i) => s + i.fat, 0) * 10) / 10;
  slotData.totalCostVnd = slotData.items.reduce((s, i) => s + i.priceVnd, 0);

  // Also remove corresponding expense if found
  if (itemToDelete) {
    const expIdx = state.expenses.findIndex(
      (e) => e.date === date && e.category === slot && e.title.includes(itemToDelete.foodName)
    );
    if (expIdx !== -1) {
      state.expenses.splice(expIdx, 1);
    }
  }

  saveCutTrackState(state);
  revalidatePath("/diary");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  return { success: true };
}

export async function applyPlanToDiaryAction(data: {
  date: string;
  lunch: {
    foodId: string;
    portionGrams: number;
    priceVnd: number;
  };
  dinner: {
    foodId: string;
    portionGrams: number;
    priceVnd: number;
    isHomePrepared?: boolean;
  };
}) {
  const state = loadCutTrackState();
  const lunchFood = state.foods.find((f) => f.id === data.lunch.foodId);
  const dinnerFood = state.foods.find((f) => f.id === data.dinner.foodId);

  if (!lunchFood || !dinnerFood) {
    throw new Error("Không tìm thấy thông tin món ăn trong kế hoạch.");
  }

  const lunchEdible = (data.lunch.portionGrams * lunchFood.edibleYieldPercent) / 100;
  const lunchFactor = lunchEdible / 100;
  const lunchItem: MealEntryItem = {
    id: `item-${Date.now()}-plan-lunch`,
    foodId: lunchFood.id,
    foodName: lunchFood.name,
    grams: data.lunch.portionGrams,
    edibleGrams: lunchEdible,
    calories: Math.round(lunchFood.caloriesPer100g * lunchFactor),
    protein: Math.round(lunchFood.proteinPer100g * lunchFactor * 10) / 10,
    carbs: Math.round(lunchFood.carbsPer100g * lunchFactor * 10) / 10,
    fat: Math.round(lunchFood.fatPer100g * lunchFactor * 10) / 10,
    priceVnd: data.lunch.priceVnd,
    weightBasis: lunchFood.weightBasis,
    isHomePrepared: false,
  };

  const dinnerEdible = (data.dinner.portionGrams * dinnerFood.edibleYieldPercent) / 100;
  const dinnerFactor = dinnerEdible / 100;
  const dinnerItem: MealEntryItem = {
    id: `item-${Date.now()}-plan-dinner`,
    foodId: dinnerFood.id,
    foodName: dinnerFood.name,
    grams: data.dinner.portionGrams,
    edibleGrams: dinnerEdible,
    calories: Math.round(dinnerFood.caloriesPer100g * dinnerFactor),
    protein: Math.round(dinnerFood.proteinPer100g * dinnerFactor * 10) / 10,
    carbs: Math.round(dinnerFood.carbsPer100g * dinnerFactor * 10) / 10,
    fat: Math.round(dinnerFood.fatPer100g * dinnerFactor * 10) / 10,
    priceVnd: data.dinner.priceVnd,
    weightBasis: dinnerFood.weightBasis,
    isHomePrepared: Boolean(data.dinner.isHomePrepared),
  };

  state.diary[data.date] = {
    LUNCH: {
      slot: "LUNCH",
      slotName: "Bữa trưa (Suất quán)",
      items: [lunchItem],
      totalCalories: lunchItem.calories,
      totalProtein: lunchItem.protein,
      totalCarbs: lunchItem.carbs,
      totalFat: lunchItem.fat,
      totalCostVnd: lunchItem.priceVnd,
    },
    DINNER: {
      slot: "DINNER",
      slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
      items: [dinnerItem],
      totalCalories: dinnerItem.calories,
      totalProtein: dinnerItem.protein,
      totalCarbs: dinnerItem.carbs,
      totalFat: dinnerItem.fat,
      totalCostVnd: dinnerItem.priceVnd,
    },
  };

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

export interface CreateFoodInput {
  name: string;
  category: "STREET_FOOD" | "STAPLE" | "HOMEMADE_PROTEIN" | "SPECIAL_MEAL" | "BEVERAGE";
  defaultGrams: number;
  edibleYieldPercent: number;
  weightBasis: "RAW" | "COOKED" | "EDIBLE" | "BONE_IN";
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultPriceVnd: number;
  priceRequiresUserEntry?: boolean;
  thumbnailUrl?: string;
  detailUrl?: string;
  confidenceNote?: string;
  isHomePreparedAllowed?: boolean;
  isRestaurantFood?: boolean;
}

function generateFoodSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createFoodAction(input: CreateFoodInput) {
  const state = loadCutTrackState();
  let baseSlug = generateFoodSlug(input.name);
  if (!baseSlug) baseSlug = `mon-an-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;
  while (state.foods.some((f) => f.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const defaultThumb = input.thumbnailUrl?.trim() || "/media/foods/thumbnails/com-tam-suon.svg";
  const defaultDetail = input.detailUrl?.trim() || defaultThumb;

  const newFood: FoodItem = {
    id: `food-${slug}-${Date.now()}`,
    slug,
    name: input.name.trim(),
    category: input.category || "STREET_FOOD",
    defaultGrams: Number(input.defaultGrams) || 300,
    edibleYieldPercent: Number(input.edibleYieldPercent) || 100,
    weightBasis: input.weightBasis || "COOKED",
    caloriesPer100g: Number(input.caloriesPer100g) || 100,
    proteinPer100g: Math.round((Number(input.proteinPer100g) || 5) * 10) / 10,
    carbsPer100g: Math.round((Number(input.carbsPer100g) || 10) * 10) / 10,
    fatPer100g: Math.round((Number(input.fatPer100g) || 2) * 10) / 10,
    defaultPriceVnd: Number(input.defaultPriceVnd) || 0,
    priceRequiresUserEntry: input.priceRequiresUserEntry ?? (Number(input.defaultPriceVnd) === 0),
    thumbnailUrl: defaultThumb,
    detailUrl: defaultDetail,
    confidenceNote: input.confidenceNote?.trim() || "Món ăn do bạn tự thêm vào thư viện.",
    isHomePreparedAllowed: input.isHomePreparedAllowed ?? true,
    isRestaurantFood: input.isRestaurantFood ?? true,
  };

  state.foods.push(newFood);
  saveCutTrackState(state);

  revalidatePath("/foods");
  revalidatePath("/diary");
  revalidatePath("/meal-planner");

  return { success: true, food: newFood };
}

export async function updateFoodAction(slug: string, updates: Partial<CreateFoodInput>) {
  const state = loadCutTrackState();
  const food = state.foods.find((f) => f.slug === slug);
  if (!food) {
    return { success: false, message: "Không tìm thấy món ăn" };
  }

  if (updates.name) food.name = updates.name.trim();
  if (updates.category) food.category = updates.category;
  if (updates.defaultGrams !== undefined) food.defaultGrams = Number(updates.defaultGrams);
  if (updates.edibleYieldPercent !== undefined) food.edibleYieldPercent = Number(updates.edibleYieldPercent);
  if (updates.weightBasis) food.weightBasis = updates.weightBasis;
  if (updates.caloriesPer100g !== undefined) food.caloriesPer100g = Number(updates.caloriesPer100g);
  if (updates.proteinPer100g !== undefined) food.proteinPer100g = Math.round(Number(updates.proteinPer100g) * 10) / 10;
  if (updates.carbsPer100g !== undefined) food.carbsPer100g = Math.round(Number(updates.carbsPer100g) * 10) / 10;
  if (updates.fatPer100g !== undefined) food.fatPer100g = Math.round(Number(updates.fatPer100g) * 10) / 10;
  if (updates.defaultPriceVnd !== undefined) food.defaultPriceVnd = Number(updates.defaultPriceVnd);
  if (updates.thumbnailUrl) food.thumbnailUrl = updates.thumbnailUrl.trim();
  if (updates.detailUrl) food.detailUrl = updates.detailUrl.trim();
  if (updates.confidenceNote) food.confidenceNote = updates.confidenceNote.trim();

  saveCutTrackState(state);

  revalidatePath("/foods");
  revalidatePath(`/foods/${slug}`);
  revalidatePath("/diary");
  revalidatePath("/meal-planner");

  return { success: true, food };
}

export async function deleteFoodAction(slug: string) {
  const state = loadCutTrackState();
  const initialLength = state.foods.length;
  state.foods = state.foods.filter((f) => f.slug !== slug);

  if (state.foods.length === initialLength) {
    return { success: false, message: "Không tìm thấy món ăn để xóa" };
  }

  saveCutTrackState(state);

  revalidatePath("/foods");
  revalidatePath("/diary");
  revalidatePath("/meal-planner");

  return { success: true };
}

