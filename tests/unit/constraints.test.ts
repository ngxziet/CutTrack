import { describe, it, expect } from 'vitest';
import {
  validateMealSlotConstraints,
  validateSpecialSoccerMeal,
  type MealItemConstraintInput,
} from '@/lib/formulas/constraints';
import { calculateSoccerDayEnergy } from '@/lib/formulas/safety';
import { MEAL_SLOT, WEIGHT_BASIS } from '@/lib/constants';

describe('Dietary Constraints & Business Rules (Spec Section 2 & 4.6)', () => {
  describe('2-Meal Rule: Lunch Constraints', () => {
    it('accepts lunch with exactly 1 restaurant dish and NO home-prepared food', () => {
      const validLunch: MealItemConstraintInput[] = [
        {
          name: 'Cơm gà kho quán',
          foodSlug: 'com_ga_kho',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 350,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
      ];

      const result = validateMealSlotConstraints(MEAL_SLOT.LUNCH, validLunch);
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.info[0]).toContain('Bữa trưa hợp lệ');
    });

    it('rejects lunch if user tries to add home-prepared food', () => {
      const invalidLunch: MealItemConstraintInput[] = [
        {
          name: 'Cơm sườn quán',
          foodSlug: 'com_suon',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 350,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
        {
          name: 'Trứng gà luộc chuẩn bị ở nhà',
          foodSlug: 'trung_ga_luoc',
          isHomePrepared: true, // Home prepared addition!
          weightGrams: 55,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
      ];

      const result = validateMealSlotConstraints(MEAL_SLOT.LUNCH, invalidLunch);
      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]).toContain('không được thêm đồ tự chuẩn bị ở nhà');
    });

    it('rejects lunch if user logs multiple primary restaurant dishes', () => {
      const greedyLunch: MealItemConstraintInput[] = [
        {
          name: 'Cơm gà xối mỡ quán',
          foodSlug: 'com_ga',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 350,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
        {
          name: 'Bún riêu quán kế bên',
          foodSlug: 'bun_rieu',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 400,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
      ];

      const result = validateMealSlotConstraints(MEAL_SLOT.LUNCH, greedyLunch);
      expect(result.isValid).toBe(false);
      expect(result.violations[0]).toContain('Chỉ được chọn 1 suất quán duy nhất');
    });
  });

  describe('2-Meal Rule: Dinner Flexibility', () => {
    it('allows dinner with home-prepared protein additions (boiled egg, boiled chicken thigh)', () => {
      const dinnerWithHomeAdditions: MealItemConstraintInput[] = [
        {
          name: 'Bún riêu cua mua quán',
          foodSlug: 'bun_rieu',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 450,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
        {
          name: 'Trứng gà luộc tại nhà',
          foodSlug: 'trung_ga_luoc',
          isHomePrepared: true,
          isMainDish: false,
          weightGrams: 55,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
        {
          name: 'Má đùi gà luộc tại nhà',
          foodSlug: 'ma_dui_ga_luoc',
          isHomePrepared: true,
          isMainDish: false,
          weightGrams: 120,
          weightBasis: WEIGHT_BASIS.BONE_IN,
          edibleYieldPercent: 68,
        },
      ];

      const result = validateMealSlotConstraints(MEAL_SLOT.DINNER, dinnerWithHomeAdditions);
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.info[0]).toContain('Bữa tối bổ sung');
    });
  });

  describe('Special Soccer Day Meal & Exercise Double-Counting Safeguard', () => {
    it('validates the special meal: 400-500g bone-in grilled chicken, cơm lam, bánh bao', () => {
      const specialMealItems: MealItemConstraintInput[] = [
        {
          name: 'Nửa con gà nướng',
          foodSlug: 'ga_nuong_nua_con',
          isHomePrepared: false,
          isMainDish: true,
          weightGrams: 450, // within 400-500g range
          weightBasis: WEIGHT_BASIS.BONE_IN,
          edibleYieldPercent: 68, // 68% edible
        },
        {
          name: 'Cơm lam nướng',
          foodSlug: 'com_lam',
          isHomePrepared: false,
          weightGrams: 120,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
        {
          name: 'Bánh bao nhân thịt',
          foodSlug: 'banh_bao',
          isHomePrepared: false,
          weightGrams: 130,
          weightBasis: WEIGHT_BASIS.COOKED,
        },
      ];

      const validation = validateSpecialSoccerMeal(specialMealItems);

      expect(validation.isValidSpecialMeal).toBe(true);
      expect(validation.violations).toHaveLength(0);
      expect(validation.chickenGrossWeightGrams).toBe(450);
      // Edible meat is 450 * 0.68 = 306g, not 450g!
      expect(validation.chickenEdibleWeightGrams).toBe(306);
      expect(validation.hasComLam).toBe(true);
      expect(validation.hasBanhBao).toBe(true);
    });

    it('warns if grilled chicken is treated as EDIBLE without bone deduction', () => {
      const mealWithoutBone: MealItemConstraintInput[] = [
        {
          name: 'Nửa con gà nướng',
          foodSlug: 'ga_nuong_nua_con',
          isHomePrepared: false,
          weightGrams: 450,
          weightBasis: WEIGHT_BASIS.EDIBLE, // Missing bone-in classification
        },
        { name: 'Cơm lam', foodSlug: 'com_lam', isHomePrepared: false, weightGrams: 100, weightBasis: WEIGHT_BASIS.COOKED },
        { name: 'Bánh bao', foodSlug: 'banh_bao', isHomePrepared: false, weightGrams: 100, weightBasis: WEIGHT_BASIS.COOKED },
      ];

      const validation = validateSpecialSoccerMeal(mealWithoutBone);
      expect(validation.warnings.some((w) => w.includes('BONE_IN'))).toBe(true);
    });

    it('warns if grilled chicken portion is outside 400-500g range', () => {
      const mealWithSmallChicken: MealItemConstraintInput[] = [
        {
          name: 'Nửa con gà nướng',
          foodSlug: 'ga_nuong_nua_con',
          isHomePrepared: false,
          weightGrams: 250, // too small
          weightBasis: WEIGHT_BASIS.BONE_IN,
        },
        { name: 'Cơm lam', foodSlug: 'com_lam', isHomePrepared: false, weightGrams: 100, weightBasis: WEIGHT_BASIS.COOKED },
        { name: 'Bánh bao', foodSlug: 'banh_bao', isHomePrepared: false, weightGrams: 100, weightBasis: WEIGHT_BASIS.COOKED },
      ];

      const validation = validateSpecialSoccerMeal(mealWithSmallChicken);
      expect(validation.warnings.some((w) => w.includes('400g đến 500g'))).toBe(true);
    });

    it('ensures 45-minute soccer session does not double count exercise kcal into base daily TDEE', () => {
      const baseTarget = 1600;
      const soccerBurn = 350;

      const result = calculateSoccerDayEnergy({
        baseTargetCalories: baseTarget,
        soccerMinutes: 45,
        estimatedSoccerBurnKcal: soccerBurn,
        allowFullEatBack: false,
      });

      // Target should NOT be 1600 + 350 = 1950
      expect(result.recommendedIntakeKcal).toBeLessThan(baseTarget + soccerBurn);
      expect(result.preventionOfDoubleCountMessage).toContain('double-counting');
    });
  });
});
