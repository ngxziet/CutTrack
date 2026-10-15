import {
  ACTIVITY_MULTIPLIERS,
  type ActivityLevel,
  type WeightBasis,
  type NutritionConfidence,
  KCAL_PER_GRAM_PROTEIN,
  KCAL_PER_GRAM_CARBS,
  KCAL_PER_GRAM_FAT,
} from '../constants';
import { roundTo } from '../utils';

export interface BMRParams {
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  ageYears: number;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * Male: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
export function calculateBMR_MifflinStJeor({ gender, weightKg, heightCm, ageYears }: BMRParams): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) {
    throw new Error('Weight, height, and age must be positive values.');
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE).
 * Multiplies BMR by activity factor.
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel | number = 'sedentary'
): number {
  if (bmr <= 0) {
    throw new Error('BMR must be a positive number.');
  }

  const multiplier =
    typeof activityLevel === 'number'
      ? activityLevel
      : (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2);

  return Math.round(bmr * multiplier);
}

/**
 * Deduct bone or non-edible parts to get edible portion weight in grams.
 * @param grossWeightGrams Gross weight as purchased or served (including bone/shell)
 * @param edibleYieldPercent Edible yield percentage (e.g., 68 for 68% or 0.68)
 */
export function calculateEdibleWeight(
  grossWeightGrams: number,
  edibleYieldPercent?: number | null
): number {
  if (grossWeightGrams < 0) return 0;
  if (edibleYieldPercent == null || isNaN(edibleYieldPercent)) {
    return grossWeightGrams;
  }

  // Handle both 0.68 and 68 format
  const ratio = edibleYieldPercent > 1 ? edibleYieldPercent / 100 : edibleYieldPercent;
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return roundTo(grossWeightGrams * clampedRatio, 1);
}

/**
 * Convert raw food weight to cooked weight using a cooking yield/ratio.
 * E.g., 100g raw dry rice * 2.5 = 250g cooked rice.
 */
export function convertRawToCooked(rawWeightGrams: number, cookingYieldRatio: number): number {
  if (rawWeightGrams <= 0 || cookingYieldRatio <= 0) return 0;
  return roundTo(rawWeightGrams * cookingYieldRatio, 1);
}

/**
 * Convert cooked food weight back to equivalent raw weight.
 * E.g., 250g cooked rice / 2.5 = 100g raw rice.
 */
export function convertCookedToRaw(cookedWeightGrams: number, cookingYieldRatio: number): number {
  if (cookedWeightGrams <= 0 || cookingYieldRatio <= 0) return 0;
  return roundTo(cookedWeightGrams / cookingYieldRatio, 1);
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Scale nutritional values from a reference portion (default 100g) to a target edible weight.
 */
export function scaleNutrients(
  baseNutrients: MacroNutrients,
  targetGrams: number,
  baseServingGrams: number = 100
): MacroNutrients {
  if (baseServingGrams <= 0 || targetGrams <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const factor = targetGrams / baseServingGrams;
  return {
    calories: Math.round(baseNutrients.calories * factor),
    protein: roundTo(baseNutrients.protein * factor, 1),
    carbs: roundTo(baseNutrients.carbs * factor, 1),
    fat: roundTo(baseNutrients.fat * factor, 1),
  };
}

export interface NutritionItemInput {
  name: string;
  weightGrams: number;
  weightBasis: WeightBasis;
  edibleYieldPercent?: number | null; // e.g. 68 for 68%
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  confidence?: NutritionConfidence;
  minCaloriesPer100g?: number | null;
  maxCaloriesPer100g?: number | null;
  isHomePrepared?: boolean;
  isMainDish?: boolean;
}

export interface NutritionItemResult {
  name: string;
  grossWeightGrams: number;
  edibleWeightGrams: number;
  calories: number;
  minCalories: number;
  maxCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: NutritionConfidence;
}

/**
 * Calculate nutrition for a single food item, taking into account bone-in weight,
 * edible yield, and restaurant estimation uncertainties.
 */
export function calculateItemNutrition(item: NutritionItemInput): NutritionItemResult {
  const isBoneIn = item.weightBasis === 'BONE_IN';
  const edibleGrams = isBoneIn
    ? calculateEdibleWeight(item.weightGrams, item.edibleYieldPercent)
    : item.weightGrams;

  const scaled = scaleNutrients(
    {
      calories: item.caloriesPer100g,
      protein: item.proteinPer100g,
      carbs: item.carbsPer100g,
      fat: item.fatPer100g,
    },
    edibleGrams,
    100
  );

  const confidence = item.confidence ?? 'DATABASE';

  // Calculate min/max calorie boundaries
  let minCalories: number;
  let maxCalories: number;

  if (item.minCaloriesPer100g != null && item.maxCaloriesPer100g != null) {
    minCalories = Math.round((item.minCaloriesPer100g * edibleGrams) / 100);
    maxCalories = Math.round((item.maxCaloriesPer100g * edibleGrams) / 100);
  } else if (confidence === 'RESTAURANT_ESTIMATE') {
    // Restaurant estimate default uncertainty margin (+/- 15%)
    minCalories = Math.round(scaled.calories * 0.85);
    maxCalories = Math.round(scaled.calories * 1.15);
  } else {
    minCalories = scaled.calories;
    maxCalories = scaled.calories;
  }

  return {
    name: item.name,
    grossWeightGrams: item.weightGrams,
    edibleWeightGrams: edibleGrams,
    calories: scaled.calories,
    minCalories,
    maxCalories,
    protein: scaled.protein,
    carbs: scaled.carbs,
    fat: scaled.fat,
    confidence,
  };
}

export interface MealNutritionSummary {
  items: NutritionItemResult[];
  totalCalories: number;
  calorieRange: {
    min: number;
    max: number;
  };
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalGrossWeightGrams: number;
  totalEdibleWeightGrams: number;
  overallConfidence: NutritionConfidence;
}

/**
 * Aggregate an array of nutrition items into a complete meal nutrition summary.
 */
export function calculateMealNutrition(items: NutritionItemInput[]): MealNutritionSummary {
  const itemResults = items.map(calculateItemNutrition);

  let totalCalories = 0;
  let minCalories = 0;
  let maxCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalGrossWeight = 0;
  let totalEdibleWeight = 0;

  let hasRestaurantEstimate = false;
  let hasUserEstimate = false;
  let allVerified = true;

  for (const res of itemResults) {
    totalCalories += res.calories;
    minCalories += res.minCalories;
    maxCalories += res.maxCalories;
    totalProtein += res.protein;
    totalCarbs += res.carbs;
    totalFat += res.fat;
    totalGrossWeight += res.grossWeightGrams;
    totalEdibleWeight += res.edibleWeightGrams;

    if (res.confidence === 'RESTAURANT_ESTIMATE') hasRestaurantEstimate = true;
    if (res.confidence === 'USER_ESTIMATE') hasUserEstimate = true;
    if (res.confidence !== 'VERIFIED_LABEL') allVerified = false;
  }

  let overallConfidence: NutritionConfidence = 'DATABASE';
  if (allVerified && itemResults.length > 0) {
    overallConfidence = 'VERIFIED_LABEL';
  } else if (hasRestaurantEstimate) {
    overallConfidence = 'RESTAURANT_ESTIMATE';
  } else if (hasUserEstimate) {
    overallConfidence = 'USER_ESTIMATE';
  }

  return {
    items: itemResults,
    totalCalories,
    calorieRange: {
      min: minCalories,
      max: maxCalories,
    },
    totalProtein: roundTo(totalProtein, 1),
    totalCarbs: roundTo(totalCarbs, 1),
    totalFat: roundTo(totalFat, 1),
    totalGrossWeightGrams: roundTo(totalGrossWeight, 1),
    totalEdibleWeightGrams: roundTo(totalEdibleWeight, 1),
    overallConfidence,
  };
}
