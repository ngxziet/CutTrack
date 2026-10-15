import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer number into Vietnamese Dong (VND) currency string.
 * Example: 30000 -> "30.000 ₫"
 */
export function formatCurrencyVND(amount: number): string {
  const integerAmount = Math.round(amount);
  return `${new Intl.NumberFormat('vi-VN').format(integerAmount)} ₫`;
}

/**
 * Format a percentage value.
 * Accepts either a ratio (0 - 1) or percentage (1 - 100).
 * If value <= 1 and value > 0, it treats it as ratio (e.g. 0.65 -> "65%").
 * If value > 1, it treats it as direct percentage (e.g. 65 -> "65%").
 */
export function formatPercent(value: number, decimals: number = 0): string {
  const percentage = value <= 1 && value > 0 ? value * 100 : value;
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(percentage * factor) / factor;
  return `${rounded.toFixed(decimals).replace(/\.0+$/, '')}%`;
}

/**
 * Round a number to a specified number of decimal places.
 */
export function roundTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Clamps a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
