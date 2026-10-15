/**
 * CUTTRACK - Domain Constants & Clinical / Budget Baselines
 * Derived from CutTrack Master Product & Engineering Specification VI_1.
 */

// ==========================================
// 1. USER PROFILE REFERENCE (Spec section 2)
// ==========================================
export const DEFAULT_USER_PROFILE = {
  gender: 'male' as const,
  ageYears: 23,
  heightCm: 168,
  currentWeightKg: 68,
  initialTargetWeightKg: 62,
  secondaryTargetWeightKg: 60,
  activityLevel: 'sedentary' as const,
  pushupMaxReps: 20,
  soccerMinutesPerWeek: 45,
} as const;

// Mifflin-St Jeor: 10 * 68 + 6.25 * 168 - 5 * 23 + 5 = 1620 kcal
export const REFERENCE_BMR_KCAL = 1620;
// Sedentary TDEE: 1620 * 1.2 = 1944 kcal (~1945 kcal)
export const REFERENCE_TDEE_KCAL = 1944;

// Calorie safety boundaries
export const EXTREME_DEFICIT_THRESHOLD_KCAL = 1400; // < 1400 kcal triggers deep deficit warning
export const USER_REQUESTED_LOW_TARGET_KCAL = 1300; // User-selected reference; not medical default
export const SAFE_DEFICIT_RANGE_MIN_KCAL = 1500;    // Recommended starting target min
export const SAFE_DEFICIT_RANGE_MAX_KCAL = 1650;    // Recommended starting target max

// Macro Caloric Densities (Atwater factors)
export const KCAL_PER_GRAM_PROTEIN = 4;
export const KCAL_PER_GRAM_CARBS = 4;
export const KCAL_PER_GRAM_FAT = 9;

// Activity Multipliers
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,       // Ít vận động (bàn giấy, không tập)
  lightlyActive: 1.375, // Vận động nhẹ (1-3 ngày/tuần)
  moderatelyActive: 1.55,// Vận động vừa (3-5 ngày/tuần)
  veryActive: 1.725,    // Năng động (6-7 ngày/tuần)
  extraActive: 1.9,     // Rất nặng / VĐV
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIERS;

// ==========================================
// 2. BUDGET CONSTANTS (Spec section 2 & 4.6)
// ==========================================
export const DAILY_BUDGET_MIN_VND = 70_000;
export const DAILY_BUDGET_MAX_VND = 80_000;

export const WEEKLY_BUDGET_MIN_VND = 490_000; // 7 * 70,000 VND
export const WEEKLY_BUDGET_MAX_VND = 560_000; // 7 * 80,000 VND

// Known default prices (VND integer)
export const PRICE_COM_TIEM_DEFAULT = 30_000; // Cơm tiệm / bình dân: ~30.000 VND
export const PRICE_BUN_RIEU_DEFAULT = 25_000; // Bún riêu: ~25.000 VND

/**
 * Dish price registry defaults.
 * Dishes without a specified default MUST be input by the user.
 * Do NOT fabricate fake prices for them.
 */
export const DEFAULT_PRICES_VND: Record<string, number | null> = {
  com_tiem: PRICE_COM_TIEM_DEFAULT,
  bun_rieu: PRICE_BUN_RIEU_DEFAULT,
  bun_bo_hue: null,      // User must input price
  com_ga_kho: null,      // User must input price
  com_ech_kho: null,     // User must input price
  com_dau_hu_kho: null,  // User must input price
  com_thit_kho_trung: null,// User must input price
  ga_nuong_nua_con: null,// User must input price
  ma_dui_ga_luoc: null,  // User must input price
  trung_ga_luoc: null,   // User must input price
  com_lam: null,         // User must input price
  banh_bao: null,        // User must input price
  yomost: null,          // User must input price
  pepsi_zero: null,      // User must input price
};

// ==========================================
// 3. DIETARY & CONSTRAINTS ENUMS
// ==========================================
export const WEIGHT_BASIS = {
  RAW: 'RAW',
  COOKED: 'COOKED',
  EDIBLE: 'EDIBLE',
  BONE_IN: 'BONE_IN',
} as const;

export type WeightBasis = (typeof WEIGHT_BASIS)[keyof typeof WEIGHT_BASIS];

export const NUTRITION_CONFIDENCE = {
  VERIFIED_LABEL: 'VERIFIED_LABEL',
  DATABASE: 'DATABASE',
  RESTAURANT_ESTIMATE: 'RESTAURANT_ESTIMATE',
  USER_ESTIMATE: 'USER_ESTIMATE',
} as const;

export type NutritionConfidence = (typeof NUTRITION_CONFIDENCE)[keyof typeof NUTRITION_CONFIDENCE];

export const MEAL_SLOT = {
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  CUSTOM: 'CUSTOM',
} as const;

export type MealSlot = (typeof MEAL_SLOT)[keyof typeof MEAL_SLOT];

export const FOOD_SOURCE = {
  RESTAURANT: 'RESTAURANT',
  HOME: 'HOME',
} as const;

export type FoodSource = (typeof FOOD_SOURCE)[keyof typeof FOOD_SOURCE];

// Typical Edible Yield Percentages (when bone-in is selected)
export const DEFAULT_EDIBLE_YIELDS = {
  BONE_IN_CHICKEN: 0.68,       // ~68% meat/skin, ~32% bone
  BONE_IN_PORK_KNUCKLE: 0.60,  // Giò heo: ~60% edible
  BONE_IN_PORK_RIB: 0.55,      // Sườn heo: ~55% edible
  BONE_IN_FISH: 0.70,          // Cá nguyên con: ~70% edible
} as const;

// Special Soccer Meal specifications (Spec 4.6)
export const SOCCER_SPECIAL_MEAL = {
  grilledChickenMinGrossWeightGrams: 400,
  grilledChickenMaxGrossWeightGrams: 500,
  defaultChickenEdibleYield: 0.68,
  includesComLam: true,
  includesBanhBao: true,
} as const;

// Timezone for CutTrack business logic
export const APP_TIMEZONE = 'Asia/Ho_Chi_Minh';
