import { describe, it, expect } from 'vitest';
import {
  calculateBMR_MifflinStJeor,
  calculateTDEE,
  calculateEdibleWeight,
  convertRawToCooked,
  convertCookedToRaw,
  scaleNutrients,
  calculateItemNutrition,
  calculateMealNutrition,
  type NutritionItemInput,
} from '@/lib/formulas/nutrition';
import { WEIGHT_BASIS, NUTRITION_CONFIDENCE } from '@/lib/constants';

describe('Nutrition & Metabolic Formulas', () => {
  describe('Mifflin-St Jeor BMR & TDEE (User Profile: Male, 23yo, 168cm, 68kg)', () => {
    it('should calculate BMR correctly as 1620 kcal', () => {
      // 10 * 68 + 6.25 * 168 - 5 * 23 + 5 = 680 + 1050 - 115 + 5 = 1620
      const bmr = calculateBMR_MifflinStJeor({
        gender: 'male',
        weightKg: 68,
        heightCm: 168,
        ageYears: 23,
      });
      expect(bmr).toBe(1620);
    });

    it('should calculate sedentary TDEE correctly as 1944 kcal (~1945 kcal)', () => {
      const bmr = 1620;
      const tdee = calculateTDEE(bmr, 'sedentary');
      expect(tdee).toBe(1944);
    });

    it('should calculate TDEE with custom numeric multipliers', () => {
      const bmr = 1620;
      expect(calculateTDEE(bmr, 1.2)).toBe(1944);
      expect(calculateTDEE(bmr, 1.375)).toBe(2228);
    });
  });

  describe('Edible Yield & Bone-in Deductions', () => {
    it('should differentiate 100g bone-in chicken from 100g edible chicken', () => {
      const boneInYield = 68; // 68% edible
      const grossWeight = 100;

      const edibleFromBoneIn = calculateEdibleWeight(grossWeight, boneInYield);
      const pureEdible = calculateEdibleWeight(grossWeight, null);

      expect(edibleFromBoneIn).toBe(68);
      expect(pureEdible).toBe(100);
      expect(edibleFromBoneIn).not.toBe(pureEdible);
    });

    it('should handle ratio representation (0.68) as well as percentage (68)', () => {
      expect(calculateEdibleWeight(200, 0.68)).toBe(136);
      expect(calculateEdibleWeight(200, 68)).toBe(136);
    });

    it('should calculate gà kho cả xương vs gà kho nạc ăn được', () => {
      // Base: 100g edible gà kho = 200 kcal, 22g protein, 4g carbs, 10g fat
      const gaKhoBoneIn: NutritionItemInput = {
        name: 'Gà kho cả xương',
        weightGrams: 150,
        weightBasis: WEIGHT_BASIS.BONE_IN,
        edibleYieldPercent: 65, // 65% edible meat/skin, 35% bone
        caloriesPer100g: 200,
        proteinPer100g: 22,
        carbsPer100g: 4,
        fatPer100g: 10,
      };

      const result = calculateItemNutrition(gaKhoBoneIn);

      // Edible grams: 150 * 0.65 = 97.5g
      expect(result.grossWeightGrams).toBe(150);
      expect(result.edibleWeightGrams).toBe(97.5);
      // Scaled calories: 200 * 97.5 / 100 = 195 kcal
      expect(result.calories).toBe(195);
      // Scaled protein: 22 * 97.5 / 100 = 21.5g
      expect(result.protein).toBe(21.5);
    });
  });

  describe('Cooked vs Raw Conversions', () => {
    it('converts dry raw rice to cooked white rice using standard ratio (2.5x)', () => {
      const rawRiceGrams = 80;
      const cookedRiceGrams = convertRawToCooked(rawRiceGrams, 2.5);
      expect(cookedRiceGrams).toBe(200);

      const backToRaw = convertCookedToRaw(cookedRiceGrams, 2.5);
      expect(backToRaw).toBe(80);
    });
  });

  describe('Portion & Macro Scaling', () => {
    it('scales macros accurately for non-standard portions', () => {
      const base100g = {
        calories: 130, // 100g cooked rice
        protein: 2.7,
        carbs: 28.2,
        fat: 0.3,
      };

      const scaled150g = scaleNutrients(base100g, 150, 100);
      expect(scaled150g.calories).toBe(195);
      expect(scaled150g.protein).toBe(4.1);
      expect(scaled150g.carbs).toBe(42.3);
      expect(scaled150g.fat).toBe(0.5);
    });
  });

  describe('Vietnamese Noodle Bowls: Independent Noodles & Toppings', () => {
    it('calculates Bún riêu with 100g cooked noodle + separate toppings', () => {
      const bunRieuComponents: NutritionItemInput[] = [
        {
          name: 'Bún sợi chín',
          weightGrams: 100,
          weightBasis: WEIGHT_BASIS.COOKED,
          caloriesPer100g: 110,
          proteinPer100g: 1.7,
          carbsPer100g: 25.0,
          fatPer100g: 0.2,
        },
        {
          name: 'Riêu cua + huyết',
          weightGrams: 60,
          weightBasis: WEIGHT_BASIS.EDIBLE,
          caloriesPer100g: 150,
          proteinPer100g: 12.0,
          carbsPer100g: 2.0,
          fatPer100g: 10.0,
        },
        {
          name: 'Đậu hũ chiên',
          weightGrams: 40,
          weightBasis: WEIGHT_BASIS.EDIBLE,
          caloriesPer100g: 180,
          proteinPer100g: 14.0,
          carbsPer100g: 4.0,
          fatPer100g: 12.0,
        },
        {
          name: 'Nước dùng bún riêu',
          weightGrams: 250,
          weightBasis: WEIGHT_BASIS.COOKED,
          caloriesPer100g: 20,
          proteinPer100g: 1.0,
          carbsPer100g: 1.5,
          fatPer100g: 1.0,
        },
      ];

      const summary = calculateMealNutrition(bunRieuComponents);

      expect(summary.items).toHaveLength(4);
      // Noodle alone: 100g * 110/100 = 110 kcal
      expect(summary.items[0].calories).toBe(110);
      // Riêu cua: 60g * 150/100 = 90 kcal
      expect(summary.items[1].calories).toBe(90);
      // Đậu hũ: 40g * 180/100 = 72 kcal
      expect(summary.items[2].calories).toBe(72);
      // Nước dùng: 250g * 20/100 = 50 kcal
      expect(summary.items[3].calories).toBe(50);

      // Total calories = 110 + 90 + 72 + 50 = 322 kcal
      expect(summary.totalCalories).toBe(322);
      // Total protein = 1.7 + 7.2 + 5.6 + 2.5 = 17.0g
      expect(summary.totalProtein).toBe(17.0);
    });

    it('calculates Bún bò Huế with independent noodle grams and varied toppings (not defaulted to bún riêu)', () => {
      const bunBoHueComponents: NutritionItemInput[] = [
        {
          name: 'Bún sợi to chín',
          weightGrams: 160, // Custom 160g noodle, not forced to 100g
          weightBasis: WEIGHT_BASIS.COOKED,
          caloriesPer100g: 115,
          proteinPer100g: 1.8,
          carbsPer100g: 26.0,
          fatPer100g: 0.3,
        },
        {
          name: 'Bắp bò chín thái mỏng',
          weightGrams: 45,
          weightBasis: WEIGHT_BASIS.EDIBLE,
          caloriesPer100g: 215,
          proteinPer100g: 26.0,
          carbsPer100g: 0.0,
          fatPer100g: 12.0,
        },
        {
          name: 'Giò heo khoanh có xương',
          weightGrams: 110,
          weightBasis: WEIGHT_BASIS.BONE_IN,
          edibleYieldPercent: 60, // 60% edible meat/collagen, 40% bone
          caloriesPer100g: 240,
          proteinPer100g: 19.0,
          carbsPer100g: 0.5,
          fatPer100g: 18.0,
        },
        {
          name: 'Chả cua / chả Huế',
          weightGrams: 30,
          weightBasis: WEIGHT_BASIS.EDIBLE,
          caloriesPer100g: 200,
          proteinPer100g: 15.0,
          carbsPer100g: 5.0,
          fatPer100g: 13.0,
        },
        {
          name: 'Huyết heo luộc',
          weightGrams: 30,
          weightBasis: WEIGHT_BASIS.EDIBLE,
          caloriesPer100g: 45,
          proteinPer100g: 9.0,
          carbsPer100g: 0.5,
          fatPer100g: 0.2,
        },
        {
          name: 'Nước dùng bún bò (sa tế, mắm ruốc)',
          weightGrams: 300,
          weightBasis: WEIGHT_BASIS.COOKED,
          caloriesPer100g: 35,
          proteinPer100g: 1.5,
          carbsPer100g: 2.0,
          fatPer100g: 2.5,
          confidence: NUTRITION_CONFIDENCE.RESTAURANT_ESTIMATE,
        },
      ];

      const summary = calculateMealNutrition(bunBoHueComponents);

      // Verify noodle is calculated independently
      expect(summary.items[0].edibleWeightGrams).toBe(160);
      expect(summary.items[0].calories).toBe(Math.round((115 * 160) / 100)); // 184 kcal

      // Verify bone deduction on giò heo (110g * 0.6 = 66g edible)
      expect(summary.items[2].edibleWeightGrams).toBe(66);
      expect(summary.items[2].calories).toBe(Math.round((240 * 66) / 100)); // 158 kcal

      // Confidence reflects restaurant estimation presence
      expect(summary.overallConfidence).toBe(NUTRITION_CONFIDENCE.RESTAURANT_ESTIMATE);

      // Calorie range is present for restaurant uncertainty
      expect(summary.calorieRange.min).toBeLessThan(summary.totalCalories);
      expect(summary.calorieRange.max).toBeGreaterThan(summary.totalCalories);
    });
  });

  describe('Restaurant Dishes Min/Max Ranges', () => {
    it('applies +/- 15% range for RESTAURANT_ESTIMATE dishes without explicit min/max', () => {
      const item: NutritionItemInput = {
        name: 'Cơm sườn bì chả quán',
        weightGrams: 350,
        weightBasis: WEIGHT_BASIS.COOKED,
        caloriesPer100g: 210,
        proteinPer100g: 9,
        carbsPer100g: 28,
        fatPer100g: 7,
        confidence: NUTRITION_CONFIDENCE.RESTAURANT_ESTIMATE,
      };

      const result = calculateItemNutrition(item);
      const expectedNominal = Math.round((210 * 350) / 100); // 735 kcal

      expect(result.calories).toBe(expectedNominal);
      expect(result.minCalories).toBe(Math.round(expectedNominal * 0.85)); // 625 kcal
      expect(result.maxCalories).toBe(Math.round(expectedNominal * 1.15)); // 845 kcal
    });

    it('honors explicit min/max calories when specified by database/restaurant', () => {
      const item: NutritionItemInput = {
        name: 'Suất cơm tiệm bình dân',
        weightGrams: 400,
        weightBasis: WEIGHT_BASIS.COOKED,
        caloriesPer100g: 175, // 700 kcal
        minCaloriesPer100g: 150, // 600 kcal
        maxCaloriesPer100g: 200, // 800 kcal
        proteinPer100g: 6,
        carbsPer100g: 25,
        fatPer100g: 5,
        confidence: NUTRITION_CONFIDENCE.RESTAURANT_ESTIMATE,
      };

      const result = calculateItemNutrition(item);
      expect(result.calories).toBe(700);
      expect(result.minCalories).toBe(600);
      expect(result.maxCalories).toBe(800);
    });
  });
});
