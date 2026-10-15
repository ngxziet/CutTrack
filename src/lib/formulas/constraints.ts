import {
  MEAL_SLOT,
  type MealSlot,
  WEIGHT_BASIS,
  type WeightBasis,
  SOCCER_SPECIAL_MEAL,
  DEFAULT_EDIBLE_YIELDS,
} from '../constants';
import { calculateEdibleWeight } from './nutrition';

export interface MealItemConstraintInput {
  name: string;
  foodSlug?: string;
  isHomePrepared: boolean;
  isMainDish?: boolean;
  weightGrams: number;
  weightBasis: WeightBasis;
  edibleYieldPercent?: number | null;
}

export interface MealValidationResult {
  isValid: boolean;
  violations: string[];
  warnings: string[];
  info: string[];
}

/**
 * Validates meal items against CutTrack core dining constraints:
 * - Lunch: Workday lunch MUST be 1 restaurant dish only, NO home-prepared additions.
 * - Dinner: Home additions (e.g. boiled eggs, boiled chicken thigh) are explicitly allowed.
 */
export function validateMealSlotConstraints(
  slot: MealSlot,
  items: MealItemConstraintInput[]
): MealValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (items.length === 0) {
    return {
      isValid: true,
      violations: [],
      warnings: ['Bữa ăn chưa có món nào.'],
      info: [],
    };
  }

  if (slot === MEAL_SLOT.LUNCH) {
    // 1. No home-prepared additions in lunch
    const homeItems = items.filter((item) => item.isHomePrepared);
    if (homeItems.length > 0) {
      violations.push(
        `Quy định bữa trưa: Đi làm chỉ ăn suất quán, không được thêm đồ tự chuẩn bị ở nhà (phát hiện ${homeItems.map((i) => i.name).join(', ')}).`
      );
    }

    // 2. Exactly or at most 1 primary restaurant portion
    const mainDishes = items.filter((item) => item.isMainDish !== false && !item.isHomePrepared);
    if (mainDishes.length > 1) {
      violations.push(
        `Quy định bữa trưa: Chỉ được chọn 1 suất quán duy nhất, không gọi nhiều phần chính (${mainDishes.map((i) => i.name).join(', ')}).`
      );
    }

    if (violations.length === 0) {
      info.push('Bữa trưa hợp lệ: 1 suất quán duy nhất, tuân thủ nguyên tắc không mang thêm đồ nhà.');
    }
  } else if (slot === MEAL_SLOT.DINNER) {
    // Dinner allows home-prepared protein supplements (boiled eggs, chicken thigh)
    const homeProteinItems = items.filter(
      (item) =>
        item.isHomePrepared &&
        (item.foodSlug === 'trung_ga_luoc' ||
          item.foodSlug === 'ma_dui_ga_luoc' ||
          item.name.toLowerCase().includes('trứng') ||
          item.name.toLowerCase().includes('gà'))
    );

    if (homeProteinItems.length > 0) {
      info.push(
        `Bữa tối bổ sung: Đã thêm ${homeProteinItems.map((i) => i.name).join(', ')} tự luộc tại nhà để đạt mục tiêu protein.`
      );
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    warnings,
    info,
  };
}

export interface SpecialSoccerMealValidation {
  isValidSpecialMeal: boolean;
  chickenGrossWeightGrams: number;
  chickenEdibleWeightGrams: number;
  hasComLam: boolean;
  hasBanhBao: boolean;
  violations: string[];
  warnings: string[];
}

/**
 * Validate the special meal on weekly soccer day (Spec section 4.6):
 * - Half grilled chicken: 400-500g gross weight (BONE_IN / skin-on), distinguishing edible portion
 * - Cơm lam
 * - Bánh bao
 */
export function validateSpecialSoccerMeal(
  items: MealItemConstraintInput[]
): SpecialSoccerMealValidation {
  const violations: string[] = [];
  const warnings: string[] = [];

  const chickenItem = items.find(
    (item) =>
      item.foodSlug === 'ga_nuong_nua_con' ||
      item.name.toLowerCase().includes('gà nướng')
  );

  let chickenGross = 0;
  let chickenEdible = 0;

  if (!chickenItem) {
    violations.push('Thiếu món nửa con gà nướng trong bữa đặc biệt ngày đá banh.');
  } else {
    chickenGross = chickenItem.weightGrams;

    // Check bone-in status
    if (chickenItem.weightBasis !== WEIGHT_BASIS.BONE_IN) {
      warnings.push(
        'Gà nướng nửa con được tính cả xương/da (BONE_IN). Hãy chỉ định trọng lượng cả xương và tỷ lệ phần ăn được để tính calo chính xác.'
      );
    }

    // Check weight range (400 - 500g gross)
    if (
      chickenGross < SOCCER_SPECIAL_MEAL.grilledChickenMinGrossWeightGrams ||
      chickenGross > SOCCER_SPECIAL_MEAL.grilledChickenMaxGrossWeightGrams
    ) {
      warnings.push(
        `Khẩu phần nửa con gà nướng thường dao động từ ${SOCCER_SPECIAL_MEAL.grilledChickenMinGrossWeightGrams}g đến ${SOCCER_SPECIAL_MEAL.grilledChickenMaxGrossWeightGrams}g cả xương (hiện tại: ${chickenGross}g).`
      );
    }

    const yieldPercent =
      chickenItem.edibleYieldPercent ??
      SOCCER_SPECIAL_MEAL.defaultChickenEdibleYield;

    chickenEdible = calculateEdibleWeight(chickenGross, yieldPercent);
  }

  const hasComLam = items.some(
    (item) =>
      item.foodSlug === 'com_lam' || item.name.toLowerCase().includes('cơm lam')
  );
  if (!hasComLam) {
    violations.push('Thiếu món Cơm lam trong bữa đặc biệt ngày đá banh.');
  }

  const hasBanhBao = items.some(
    (item) =>
      item.foodSlug === 'banh_bao' || item.name.toLowerCase().includes('bánh bao')
  );
  if (!hasBanhBao) {
    violations.push('Thiếu món Bánh bao trong bữa đặc biệt ngày đá banh.');
  }

  return {
    isValidSpecialMeal: violations.length === 0,
    chickenGrossWeightGrams: chickenGross,
    chickenEdibleWeightGrams: chickenEdible,
    hasComLam,
    hasBanhBao,
    violations,
    warnings,
  };
}
