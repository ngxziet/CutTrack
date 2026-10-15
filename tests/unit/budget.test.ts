import { describe, it, expect } from 'vitest';
import {
  toIntegerVND,
  calculateTotalSpentVND,
  calculateDailyBudgetStatus,
  calculateWeeklyBudgetStatus,
  calculateBudgetRollover,
  resolveDishPrice,
} from '@/lib/formulas/budget';
import {
  DAILY_BUDGET_MIN_VND,
  DAILY_BUDGET_MAX_VND,
  WEEKLY_BUDGET_MIN_VND,
  WEEKLY_BUDGET_MAX_VND,
  PRICE_COM_TIEM_DEFAULT,
  PRICE_BUN_RIEU_DEFAULT,
} from '@/lib/constants';

describe('Budget & Financial Formulas (VND Integer Precision)', () => {
  describe('VND Integer Guarantees', () => {
    it('always rounds to whole VND integers, preventing float inaccuracies', () => {
      expect(toIntegerVND(30000.4)).toBe(30000);
      expect(toIntegerVND(25000.6)).toBe(25001);
      expect(toIntegerVND(0.1 + 0.2)).toBe(0);
      expect(Number.isInteger(toIntegerVND(75000.333))).toBe(true);
    });

    it('sums an array of transactions in integer VND', () => {
      const spendings = [30000, 25000, 15000];
      expect(calculateTotalSpentVND(spendings)).toBe(70000);
    });
  });

  describe('Daily Budget Checks (70.000 - 80.000 VND)', () => {
    it('returns ON_TRACK when spending is under or at min budget (<= 70k)', () => {
      const status = calculateDailyBudgetStatus({
        spentVND: 55000,
        dailyBudgetMin: DAILY_BUDGET_MIN_VND,
        dailyBudgetMax: DAILY_BUDGET_MAX_VND,
      });

      expect(status.status).toBe('ON_TRACK');
      expect(status.isOverBudget).toBe(false);
      expect(status.isWarning).toBe(false);
      expect(status.remainingVND).toBe(25000); // 80k - 55k
    });

    it('returns WARNING_NEAR_LIMIT when spending is between 70k and 80k', () => {
      const status = calculateDailyBudgetStatus({
        spentVND: 75000,
        dailyBudgetMin: DAILY_BUDGET_MIN_VND,
        dailyBudgetMax: DAILY_BUDGET_MAX_VND,
      });

      expect(status.status).toBe('WARNING_NEAR_LIMIT');
      expect(status.isOverBudget).toBe(false);
      expect(status.isWarning).toBe(true);
      expect(status.remainingVND).toBe(5000); // 80k - 75k
    });

    it('returns OVER_BUDGET when spending exceeds 80k', () => {
      const status = calculateDailyBudgetStatus({
        spentVND: 95000,
        dailyBudgetMin: DAILY_BUDGET_MIN_VND,
        dailyBudgetMax: DAILY_BUDGET_MAX_VND,
      });

      expect(status.status).toBe('OVER_BUDGET');
      expect(status.isOverBudget).toBe(true);
      expect(status.remainingVND).toBe(-15000); // 80k - 95k
      expect(status.message).toContain('vượt trần 80.000');
    });

    it('handles zero spending properly', () => {
      const status = calculateDailyBudgetStatus({ spentVND: 0 });
      expect(status.status).toBe('UNDER_BUDGET');
      expect(status.remainingVND).toBe(80000);
    });
  });

  describe('Budget Rollover Mechanism', () => {
    it('calculates positive surplus rollover when user spends less than budget', () => {
      const day1To3 = [
        { date: '2026-10-12', budgetVND: 80000, spentVND: 60000 }, // +20k
        { date: '2026-10-13', budgetVND: 80000, spentVND: 55000 }, // +25k
        { date: '2026-10-14', budgetVND: 80000, spentVND: 70000 }, // +10k
      ];

      const cumulativeRollover = calculateBudgetRollover(day1To3);
      expect(cumulativeRollover).toBe(55000); // 20k + 25k + 10k
    });

    it('applies positive rollover to expand next day effective budget ceiling', () => {
      // Day 4 budget base is 80k, but with 20k surplus rolled over, effective ceiling is 100k
      const status = calculateDailyBudgetStatus({
        spentVND: 90000,
        dailyBudgetMin: 70000,
        dailyBudgetMax: 80000,
        rolloverVND: 20000,
      });

      // 90k is > base 80k, but <= effective 100k
      expect(status.effectiveBudgetMaxVND).toBe(100000);
      expect(status.isOverBudget).toBe(false);
      expect(status.remainingVND).toBe(10000);
    });

    it('accounts for negative deficit rollover when previous day overspent', () => {
      const days = [
        { date: '2026-10-12', budgetVND: 80000, spentVND: 100000 }, // -20k
      ];

      const rollover = calculateBudgetRollover(days);
      expect(rollover).toBe(-20000);

      const status = calculateDailyBudgetStatus({
        spentVND: 50000,
        dailyBudgetMax: 80000,
        rolloverVND: rollover, // -20k -> effective budget = 60k
      });

      expect(status.effectiveBudgetMaxVND).toBe(60000);
      expect(status.remainingVND).toBe(10000);
    });
  });

  describe('Weekly Budget Status (490.000 - 560.000 VND)', () => {
    it('evaluates weekly totals against 490k and 560k thresholds', () => {
      // 7 days of 60k = 420k (< 490k)
      const lightWeek = calculateWeeklyBudgetStatus({
        dailySpendings: [60000, 60000, 60000, 60000, 60000, 60000, 60000],
      });
      expect(lightWeek.totalSpentVND).toBe(420000);
      expect(lightWeek.status).toBe('ON_TRACK');
      expect(lightWeek.isOverBudget).toBe(false);

      // 7 days of 75k = 525k (between 490k and 560k)
      const warningWeek = calculateWeeklyBudgetStatus({
        dailySpendings: [75000, 75000, 75000, 75000, 75000, 75000, 75000],
      });
      expect(warningWeek.totalSpentVND).toBe(525000);
      expect(warningWeek.status).toBe('WARNING_NEAR_LIMIT');
      expect(warningWeek.isWarning).toBe(true);

      // 7 days of 90k = 630k (> 560k)
      const overWeek = calculateWeeklyBudgetStatus({
        dailySpendings: [90000, 90000, 90000, 90000, 90000, 90000, 90000],
      });
      expect(overWeek.totalSpentVND).toBe(630000);
      expect(overWeek.status).toBe('OVER_BUDGET');
      expect(overWeek.isOverBudget).toBe(true);
    });
  });

  describe('Price Registry & Unknown Price Integrity', () => {
    it('resolves cơm tiệm to default 30.000 VND', () => {
      const res = resolveDishPrice('com_tiem');
      expect(res.priceVND).toBe(PRICE_COM_TIEM_DEFAULT);
      expect(res.isDefaultPrice).toBe(true);
      expect(res.requiresUserInput).toBe(false);
    });

    it('resolves bún riêu to default 25.000 VND', () => {
      const res = resolveDishPrice('bun_rieu');
      expect(res.priceVND).toBe(PRICE_BUN_RIEU_DEFAULT);
      expect(res.isDefaultPrice).toBe(true);
      expect(res.requiresUserInput).toBe(false);
    });

    it('requires user input for bún bò Huế and does not fabricate a fake price', () => {
      const withoutUserPrice = resolveDishPrice('bun_bo_hue');
      expect(withoutUserPrice.priceVND).toBeNull();
      expect(withoutUserPrice.requiresUserInput).toBe(true);

      const withUserPrice = resolveDishPrice('bun_bo_hue', 45000);
      expect(withUserPrice.priceVND).toBe(45000);
      expect(withUserPrice.isUserProvided).toBe(true);
      expect(withUserPrice.requiresUserInput).toBe(false);
    });

    it('never fabricates default prices for unlisted dishes', () => {
      const randomDish = resolveDishPrice('mon_an_bat_ky');
      expect(randomDish.priceVND).toBeNull();
      expect(randomDish.requiresUserInput).toBe(true);
    });
  });
});
