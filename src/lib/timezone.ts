import { APP_TIMEZONE } from './constants';

const VN_OFFSET_HOURS = 7;
const VN_OFFSET_MS = VN_OFFSET_HOURS * 60 * 60 * 1000;

export interface ZonedDateParts {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  hour: number;  // 0-23
  minute: number;// 0-59
  second: number;// 0-59
}

/**
 * Extract date parts of a timestamp in Asia/Ho_Chi_Minh timezone.
 */
export function getDatePartsVN(dateInput: Date | string | number): ZonedDateParts {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date provided to getDatePartsVN: ${dateInput}`);
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      partMap[part.type] = parseInt(part.value, 10);
    }
  }

  // hour in 24-hr format (some locales might return 24 for midnight)
  const hour = (partMap.hour ?? 0) % 24;

  return {
    year: partMap.year,
    month: partMap.month,
    day: partMap.day,
    hour,
    minute: partMap.minute ?? 0,
    second: partMap.second ?? 0,
  };
}

/**
 * Format date to 'YYYY-MM-DD' in Asia/Ho_Chi_Minh timezone.
 */
export function formatDateVN(dateInput: Date | string | number): string {
  const parts = getDatePartsVN(dateInput);
  const mm = String(parts.month).padStart(2, '0');
  const dd = String(parts.day).padStart(2, '0');
  return `${parts.year}-${mm}-${dd}`;
}

/**
 * Format datetime to 'YYYY-MM-DD HH:mm:ss' in Asia/Ho_Chi_Minh timezone.
 */
export function formatDateTimeVN(dateInput: Date | string | number): string {
  const parts = getDatePartsVN(dateInput);
  const mm = String(parts.month).padStart(2, '0');
  const dd = String(parts.day).padStart(2, '0');
  const hh = String(parts.hour).padStart(2, '0');
  const min = String(parts.minute).padStart(2, '0');
  const ss = String(parts.second).padStart(2, '0');
  return `${parts.year}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * Parse a 'YYYY-MM-DD' string into a UTC Date object representing 00:00:00.000 Asia/Ho_Chi_Minh.
 */
export function parseDateVN(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) {
    throw new Error(`Invalid date format for parseDateVN. Expected YYYY-MM-DD, got: ${dateStr}`);
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  // 00:00:00 in UTC+7 is (UTC - 7 hours)
  const utcMillis = Date.UTC(year, month - 1, day, 0, 0, 0, 0) - VN_OFFSET_MS;
  return new Date(utcMillis);
}

/**
 * Returns a UTC Date representing the start of the day (00:00:00.000) in Asia/Ho_Chi_Minh.
 */
export function getStartOfDayVN(dateInput: Date | string | number): Date {
  const parts = getDatePartsVN(dateInput);
  const utcMillis = Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0, 0) - VN_OFFSET_MS;
  return new Date(utcMillis);
}

/**
 * Returns a UTC Date representing the end of the day (23:59:59.999) in Asia/Ho_Chi_Minh.
 */
export function getEndOfDayVN(dateInput: Date | string | number): Date {
  const parts = getDatePartsVN(dateInput);
  const utcMillis = Date.UTC(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999) - VN_OFFSET_MS;
  return new Date(utcMillis);
}

/**
 * Check whether two date inputs fall on the same calendar day in Asia/Ho_Chi_Minh timezone.
 */
export function isSameDayVN(d1: Date | string | number, d2: Date | string | number): boolean {
  return formatDateVN(d1) === formatDateVN(d2);
}

/**
 * Add or subtract days in Vietnam calendar.
 */
export function addDaysVN(dateInput: Date | string | number, days: number): Date {
  const start = getStartOfDayVN(dateInput);
  // Add exact days in milliseconds
  return new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Get start of week (Monday 00:00:00 VN) and end of week (Sunday 23:59:59.999 VN).
 */
export function getWeekRangeVN(dateInput: Date | string | number): { startOfWeek: Date; endOfWeek: Date } {
  const startOfDay = getStartOfDayVN(dateInput);
  // Calculate day of week in VN timezone
  // JS getUTCDay() on zoned timestamp:
  // startOfDay + 7 hours gives local midnight in UTC terms
  const localMidDate = new Date(startOfDay.getTime() + VN_OFFSET_MS);
  const dayOfWeek = localMidDate.getUTCDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  
  // Distance back to Monday (1):
  // Sunday (0) -> 6 days back
  // Monday (1) -> 0 days back
  // Tuesday (2) -> 1 day back ...
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  
  const startOfWeek = new Date(startOfDay.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfWeek.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);

  return { startOfWeek, endOfWeek };
}
