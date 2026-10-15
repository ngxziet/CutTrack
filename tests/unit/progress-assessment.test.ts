import { describe, it, expect } from 'vitest';
import { evaluateWeeklyProgress } from '@/lib/formulas/progress-assessment';

describe('Weekly Progress & Morning Weigh-in Assessment', () => {
  it('identifies optimal fat loss rate (0.4 - 0.8 kg/week)', () => {
    // 68.0 kg -> 67.4 kg (-0.6 kg in 1 week)
    const result = evaluateWeeklyProgress(68.0, 67.4, 62.0);

    expect(result.status).toBe('OPTIMAL_FAT_LOSS');
    expect(result.weightChangeKg).toBe(-0.6);
    expect(result.badgeColor).toBe('emerald');
    expect(result.statusTitleVi).toContain('Tốc độ vàng');
    expect(result.estimatedWeeksToTarget).toBeGreaterThan(0);
    expect(result.recommendationsVi.length).toBeGreaterThanOrEqual(3);
  });

  it('triggers warning when weight drops too fast (> 1 kg/week)', () => {
    // 68.0 kg -> 66.8 kg (-1.2 kg in 1 week)
    const result = evaluateWeeklyProgress(68.0, 66.8, 62.0);

    expect(result.status).toBe('TOO_FAST_MUSCLE_RISK');
    expect(result.weightChangeKg).toBe(-1.2);
    expect(result.badgeColor).toBe('amber');
    expect(result.statusTitleVi).toContain('Nguy cơ mất cơ bắp');
    expect(result.recommendationsVi[0]).toContain('Tăng nhẹ năng lượng nạp vào');
  });

  it('handles plateau or normal water fluctuations (-0.3 to +0.2 kg)', () => {
    // 68.0 kg -> 67.9 kg (-0.1 kg in 1 week)
    const result = evaluateWeeklyProgress(68.0, 67.9, 62.0);

    expect(result.status).toBe('PLATEAU_OR_SLOW');
    expect(result.badgeColor).toBe('blue');
    expect(result.diagnosisVi).toContain('biến thiên lượng nước nội bào');
    expect(result.waterRetentionChecklist.length).toBe(4);
  });

  it('provides reassurance and checklist on slight weight gain (> 0.2 kg)', () => {
    // 68.0 kg -> 68.4 kg (+0.4 kg in 1 week)
    const result = evaluateWeeklyProgress(68.0, 68.4, 62.0);

    expect(result.status).toBe('SLIGHT_GAIN');
    expect(result.badgeColor).toBe('rose');
    expect(result.diagnosisVi).toContain('Đừng lo lắng');
    expect(result.diagnosisVi).toContain('nước tích trữ do ăn mặn');
  });
});
