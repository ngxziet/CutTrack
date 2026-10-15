import { describe, it, expect } from 'vitest';
import {
  checkCalorieTargetSafety,
  calculateSoccerDayEnergy,
} from '@/lib/formulas/safety';
import {
  REFERENCE_BMR_KCAL,
  REFERENCE_TDEE_KCAL,
  EXTREME_DEFICIT_THRESHOLD_KCAL,
  USER_REQUESTED_LOW_TARGET_KCAL,
  SAFE_DEFICIT_RANGE_MIN_KCAL,
  SAFE_DEFICIT_RANGE_MAX_KCAL,
} from '@/lib/constants';

describe('Safety & Clinical Boundary Formulas', () => {
  describe('User-Requested Low Calorie Target (1.300 kcal/day)', () => {
    it('triggers deep deficit warning when target is 1300 kcal (< 1400 kcal threshold)', () => {
      const result = checkCalorieTargetSafety(USER_REQUESTED_LOW_TARGET_KCAL);

      expect(result.targetCalories).toBe(1300);
      expect(result.isDeepDeficit).toBe(true);
      expect(result.isBelowBmr).toBe(true);
      expect(result.isSafeRecommendation).toBe(false);
      expect(result.severity).toBe('CRITICAL_EXTREME_DEFICIT');

      // Deficit compared to sedentary TDEE (~1944 kcal)
      expect(result.deficitCalories).toBe(REFERENCE_TDEE_KCAL - 1300); // 644 kcal
      expect(result.deficitPercent).toBeGreaterThanOrEqual(30); // ~33% deficit

      // Warning message includes BMR and TDEE figures
      expect(result.warningMessage).toContain('1.400');
      expect(result.warningMessage).toContain('BMR ước tính');
      expect(result.warningMessage).toContain('TDEE');

      // Recommends safe range 1500 - 1650 kcal
      expect(result.recommendedRange.min).toBe(SAFE_DEFICIT_RANGE_MIN_KCAL);
      expect(result.recommendedRange.max).toBe(SAFE_DEFICIT_RANGE_MAX_KCAL);
    });

    it('contains informative, non-stigmatizing neutral tone with disclaimer', () => {
      const result = checkCalorieTargetSafety(1300);

      expect(result.warningTitle).toBe('Cảnh báo: Mục tiêu thâm hụt calo quá sâu');
      expect(result.disclaimer).toContain('Mifflin-St Jeor');
      expect(result.disclaimer).toContain('không thay thế cho tư vấn y khoa');
    });

    it('flags moderate deficit for targets between 1400 and 1500 kcal', () => {
      const result = checkCalorieTargetSafety(1450);

      expect(result.isDeepDeficit).toBe(false);
      expect(result.isSafeRecommendation).toBe(false);
      expect(result.severity).toBe('MODERATE_DEFICIT');
    });

    it('marks 1500 - 1650 kcal as optimal safe deficit', () => {
      const minResult = checkCalorieTargetSafety(SAFE_DEFICIT_RANGE_MIN_KCAL);
      const maxResult = checkCalorieTargetSafety(SAFE_DEFICIT_RANGE_MAX_KCAL);

      expect(minResult.severity).toBe('OPTIMAL_SAFE_DEFICIT');
      expect(minResult.isSafeRecommendation).toBe(true);

      expect(maxResult.severity).toBe('OPTIMAL_SAFE_DEFICIT');
      expect(maxResult.isSafeRecommendation).toBe(true);
    });

    it('recognizes maintenance and surplus targets correctly', () => {
      const maintenance = checkCalorieTargetSafety(REFERENCE_TDEE_KCAL);
      expect(maintenance.severity).toBe('MAINTENANCE');

      const surplus = checkCalorieTargetSafety(2200);
      expect(surplus.severity).toBe('SURPLUS');
    });
  });

  describe('Soccer Day Exercise Calorie Adjustment & Double Count Prevention', () => {
    it('prevents automatic full eat-back of soccer calories to avoid double-counting TDEE', () => {
      const baseTarget = 1600;
      const soccerCaloriesBurned = 350;

      const adjustment = calculateSoccerDayEnergy({
        baseTargetCalories: baseTarget,
        soccerMinutes: 45,
        estimatedSoccerBurnKcal: soccerCaloriesBurned,
        allowFullEatBack: false,
      });

      // Does not blindly add 350 kcal
      expect(adjustment.recommendedIntakeKcal).toBeLessThan(baseTarget + soccerCaloriesBurned);
      // Only modest recovery allowance (max 150 kcal)
      expect(adjustment.recommendedIntakeKcal).toBe(baseTarget + Math.min(150, Math.round(350 * 0.3)));
      // Contains explicit educational rationale
      expect(adjustment.preventionOfDoubleCountMessage).toContain('double-counting');
    });

    it('allows full eat-back only when explicitly requested by user', () => {
      const baseTarget = 1600;
      const soccerCaloriesBurned = 350;

      const adjustment = calculateSoccerDayEnergy({
        baseTargetCalories: baseTarget,
        soccerMinutes: 45,
        estimatedSoccerBurnKcal: soccerCaloriesBurned,
        allowFullEatBack: true,
      });

      expect(adjustment.recommendedIntakeKcal).toBe(baseTarget + soccerCaloriesBurned);
    });
  });
});
