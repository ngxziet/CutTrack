import { describe, it, expect } from 'vitest';
import {
  getDatePartsVN,
  formatDateVN,
  parseDateVN,
  getStartOfDayVN,
  getEndOfDayVN,
  isSameDayVN,
  addDaysVN,
  getWeekRangeVN,
} from '@/lib/timezone';

describe('Timezone & Date Boundary (Asia/Ho_Chi_Minh - UTC+7)', () => {
  it('correctly maps UTC late evening timestamp to next calendar day in Vietnam', () => {
    // 2026-10-14 18:30:00 UTC = 2026-10-15 01:30:00 in UTC+7 (Vietnam)
    const utcDate = new Date('2026-10-14T18:30:00.000Z');
    const parts = getDatePartsVN(utcDate);

    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(10);
    expect(parts.day).toBe(15); // Next day in Vietnam
    expect(parts.hour).toBe(1);
    expect(parts.minute).toBe(30);

    expect(formatDateVN(utcDate)).toBe('2026-10-15');
  });

  it('determines the exact start of day (00:00:00.000) in Vietnam timezone', () => {
    // Start of day 2026-10-15 in VN is 2026-10-14 17:00:00.000Z
    const startOfDay = getStartOfDayVN('2026-10-15T12:00:00.000Z');
    expect(startOfDay.toISOString()).toBe('2026-10-14T17:00:00.000Z');

    const parts = getDatePartsVN(startOfDay);
    expect(parts.day).toBe(15);
    expect(parts.hour).toBe(0);
    expect(parts.minute).toBe(0);
    expect(parts.second).toBe(0);
  });

  it('determines the exact end of day (23:59:59.999) in Vietnam timezone', () => {
    // End of day 2026-10-15 in VN is 2026-10-15 16:59:59.999Z
    const endOfDay = getEndOfDayVN('2026-10-15T02:00:00.000Z');
    expect(endOfDay.toISOString()).toBe('2026-10-15T16:59:59.999Z');

    const parts = getDatePartsVN(endOfDay);
    expect(parts.day).toBe(15);
    expect(parts.hour).toBe(23);
    expect(parts.minute).toBe(59);
    expect(parts.second).toBe(59);
  });

  it('parses YYYY-MM-DD date string to Vietnam start of day UTC timestamp', () => {
    const parsed = parseDateVN('2026-10-15');
    expect(parsed.toISOString()).toBe('2026-10-14T17:00:00.000Z');
  });

  it('checks if two dates belong to the same Vietnam calendar day', () => {
    // 2026-10-14 19:00Z -> 2026-10-15 02:00 VN
    // 2026-10-15 15:00Z -> 2026-10-15 22:00 VN
    const morningVN = new Date('2026-10-14T19:00:00.000Z');
    const nightVN = new Date('2026-10-15T15:00:00.000Z');

    expect(isSameDayVN(morningVN, nightVN)).toBe(true);

    // 2026-10-15 17:01Z -> 2026-10-16 00:01 VN (next day)
    const nextDayMorningVN = new Date('2026-10-15T17:01:00.000Z');
    expect(isSameDayVN(morningVN, nextDayMorningVN)).toBe(false);
  });

  it('adds days correctly across month boundaries in Vietnam time', () => {
    const oct31 = parseDateVN('2026-10-31');
    const nov1 = addDaysVN(oct31, 1);
    expect(formatDateVN(nov1)).toBe('2026-11-01');
  });

  it('computes Monday-to-Sunday week range in Vietnam time', () => {
    // 2026-10-15 is Thursday
    const thursday = parseDateVN('2026-10-15');
    const { startOfWeek, endOfWeek } = getWeekRangeVN(thursday);

    // Monday should be 2026-10-12
    expect(formatDateVN(startOfWeek)).toBe('2026-10-12');
    expect(startOfWeek.toISOString()).toBe('2026-10-11T17:00:00.000Z');

    // Sunday should be 2026-10-18
    expect(formatDateVN(endOfWeek)).toBe('2026-10-18');
    expect(endOfWeek.toISOString()).toBe('2026-10-18T16:59:59.999Z');
  });
});
