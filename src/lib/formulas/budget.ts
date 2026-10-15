import {
  DAILY_BUDGET_MIN_VND,
  DAILY_BUDGET_MAX_VND,
  WEEKLY_BUDGET_MIN_VND,
  WEEKLY_BUDGET_MAX_VND,
  DEFAULT_PRICES_VND,
} from '../constants';
import { formatCurrencyVND } from '../utils';

export type BudgetStatusType =
  | 'UNDER_BUDGET'
  | 'ON_TRACK'
  | 'WARNING_NEAR_LIMIT'
  | 'OVER_BUDGET';

export interface DailyBudgetReport {
  spentVND: number;
  baseBudgetMaxVND: number;
  effectiveBudgetMaxVND: number;
  rolloverVND: number;
  remainingVND: number;
  status: BudgetStatusType;
  isOverBudget: boolean;
  isWarning: boolean;
  message: string;
}

export interface WeeklyBudgetReport {
  totalSpentVND: number;
  weeklyBudgetMinVND: number;
  weeklyBudgetMaxVND: number;
  remainingVND: number;
  averageDailySpentVND: number;
  status: BudgetStatusType;
  isOverBudget: boolean;
  isWarning: boolean;
  message: string;
}

/**
 * Ensures any money input is strictly an integer in VND.
 */
export function toIntegerVND(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.round(amount);
}

/**
 * Sum an array of VND amounts ensuring integer results.
 */
export function calculateTotalSpentVND(amounts: number[]): number {
  return amounts.reduce((sum, amt) => sum + toIntegerVND(amt), 0);
}

/**
 * Calculate daily budget consumption and warning status.
 * Evaluates spending against 70.000 - 80.000 VND daily targets.
 */
export function calculateDailyBudgetStatus({
  spentVND,
  dailyBudgetMin = DAILY_BUDGET_MIN_VND,
  dailyBudgetMax = DAILY_BUDGET_MAX_VND,
  rolloverVND = 0,
}: {
  spentVND: number;
  dailyBudgetMin?: number;
  dailyBudgetMax?: number;
  rolloverVND?: number;
}): DailyBudgetReport {
  const cleanSpent = toIntegerVND(spentVND);
  const cleanMin = toIntegerVND(dailyBudgetMin);
  const cleanMax = toIntegerVND(dailyBudgetMax);
  const cleanRollover = toIntegerVND(rolloverVND);

  const effectiveBudgetMax = cleanMax + cleanRollover;
  const remainingVND = effectiveBudgetMax - cleanSpent;

  let status: BudgetStatusType = 'UNDER_BUDGET';
  let isOverBudget = false;
  let isWarning = false;
  let message = '';

  if (cleanSpent > effectiveBudgetMax) {
    status = 'OVER_BUDGET';
    isOverBudget = true;
    const overAmount = cleanSpent - effectiveBudgetMax;
    message = `Vượt ngân sách ngày: Đã chi ${formatCurrencyVND(cleanSpent)}, vượt trần ${formatCurrencyVND(effectiveBudgetMax)} (+${formatCurrencyVND(overAmount)})`;
  } else if (cleanSpent > cleanMin) {
    status = 'WARNING_NEAR_LIMIT';
    isWarning = true;
    message = `Cảnh báo cận trần: Đã chi ${formatCurrencyVND(cleanSpent)}, tiệm cận mức tối đa ${formatCurrencyVND(effectiveBudgetMax)}. Còn lại ${formatCurrencyVND(remainingVND)}`;
  } else if (cleanSpent > 0) {
    status = 'ON_TRACK';
    message = `Trong ngân sách: Đã chi ${formatCurrencyVND(cleanSpent)}. Còn lại ${formatCurrencyVND(remainingVND)}`;
  } else {
    status = 'UNDER_BUDGET';
    message = `Chưa phát sinh chi tiêu hôm nay. Ngân sách khả dụng: ${formatCurrencyVND(effectiveBudgetMax)}`;
  }

  return {
    spentVND: cleanSpent,
    baseBudgetMaxVND: cleanMax,
    effectiveBudgetMaxVND: effectiveBudgetMax,
    rolloverVND: cleanRollover,
    remainingVND,
    status,
    isOverBudget,
    isWarning,
    message,
  };
}

/**
 * Calculate weekly budget status based on daily spendings (up to 7 days).
 */
export function calculateWeeklyBudgetStatus({
  dailySpendings,
  weeklyBudgetMin = WEEKLY_BUDGET_MIN_VND,
  weeklyBudgetMax = WEEKLY_BUDGET_MAX_VND,
}: {
  dailySpendings: number[];
  weeklyBudgetMin?: number;
  weeklyBudgetMax?: number;
}): WeeklyBudgetReport {
  const totalSpentVND = calculateTotalSpentVND(dailySpendings);
  const cleanMin = toIntegerVND(weeklyBudgetMin);
  const cleanMax = toIntegerVND(weeklyBudgetMax);
  const remainingVND = cleanMax - totalSpentVND;
  const daysCount = Math.max(1, dailySpendings.length);
  const averageDailySpentVND = Math.round(totalSpentVND / daysCount);

  let status: BudgetStatusType = 'UNDER_BUDGET';
  let isOverBudget = false;
  let isWarning = false;
  let message = '';

  if (totalSpentVND > cleanMax) {
    status = 'OVER_BUDGET';
    isOverBudget = true;
    const overAmount = totalSpentVND - cleanMax;
    message = `Vượt ngân sách tuần: Tổng chi ${formatCurrencyVND(totalSpentVND)}, vượt mức tối đa ${formatCurrencyVND(cleanMax)} (+${formatCurrencyVND(overAmount)})`;
  } else if (totalSpentVND > cleanMin) {
    status = 'WARNING_NEAR_LIMIT';
    isWarning = true;
    message = `Cảnh báo tuần: Tổng chi ${formatCurrencyVND(totalSpentVND)}, nằm trong khoảng cảnh báo (${formatCurrencyVND(cleanMin)} - ${formatCurrencyVND(cleanMax)}). Còn lại ${formatCurrencyVND(remainingVND)}`;
  } else {
    status = 'ON_TRACK';
    message = `Ngân sách tuần ổn định: Đã chi ${formatCurrencyVND(totalSpentVND)}. Còn lại ${formatCurrencyVND(remainingVND)}`;
  }

  return {
    totalSpentVND,
    weeklyBudgetMinVND: cleanMin,
    weeklyBudgetMaxVND: cleanMax,
    remainingVND,
    averageDailySpentVND,
    status,
    isOverBudget,
    isWarning,
    message,
  };
}

export interface DayBudgetRecord {
  date: string;
  budgetVND: number;
  spentVND: number;
}

/**
 * Calculate cumulative budget rollover surplus/deficit across consecutive days.
 * Rollover is positive if user saved money, negative if user overspent.
 */
export function calculateBudgetRollover(records: DayBudgetRecord[]): number {
  let netRollover = 0;
  for (const record of records) {
    const dailyDiff = toIntegerVND(record.budgetVND) - toIntegerVND(record.spentVND);
    netRollover += dailyDiff;
  }
  return netRollover;
}

export interface DishPriceResolution {
  foodSlug: string;
  priceVND: number | null;
  isDefaultPrice: boolean;
  isUserProvided: boolean;
  requiresUserInput: boolean;
}

/**
 * Resolve dish price according to CutTrack policy:
 * - Cơm tiệm: default 30.000 VND
 * - Bún riêu: default 25.000 VND
 * - Bún bò & others: MUST be provided by user, never fabricated.
 */
export function resolveDishPrice(
  foodSlug: string,
  userPriceVND?: number | null
): DishPriceResolution {
  if (userPriceVND != null && !isNaN(userPriceVND) && userPriceVND > 0) {
    return {
      foodSlug,
      priceVND: toIntegerVND(userPriceVND),
      isDefaultPrice: false,
      isUserProvided: true,
      requiresUserInput: false,
    };
  }

  const defaultPrice = DEFAULT_PRICES_VND[foodSlug] ?? null;

  if (defaultPrice != null) {
    return {
      foodSlug,
      priceVND: defaultPrice,
      isDefaultPrice: true,
      isUserProvided: false,
      requiresUserInput: false,
    };
  }

  return {
    foodSlug,
    priceVND: null,
    isDefaultPrice: false,
    isUserProvided: false,
    requiresUserInput: true,
  };
}
