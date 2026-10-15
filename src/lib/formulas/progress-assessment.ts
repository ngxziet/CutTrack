/**
 * CutTrack - Weekly Progress & Morning Weigh-in Assessment Formulas
 * Grounded in clinical weight management & sports science standards:
 * - Safe fat loss rate: 0.5% - 1.0% of bodyweight per week (0.4 - 0.7 kg/week for a 68kg male).
 * - Preservation of lean muscle mass & hormonal balance.
 * - Accounting for water retention fluctuations (sodium, post-soccer muscle inflammation).
 */

export interface ProgressAssessmentResult {
  currentWeightKg: number;
  previousWeightKg: number;
  weightChangeKg: number; // negative = lost weight, positive = gained
  changeRatePercent: number; // percentage of bodyweight change
  status: 'OPTIMAL_FAT_LOSS' | 'TOO_FAST_MUSCLE_RISK' | 'PLATEAU_OR_SLOW' | 'SLIGHT_GAIN';
  statusTitleVi: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose';
  diagnosisVi: string;
  recommendationsVi: string[];
  estimatedWeeksToTarget: number;
  waterRetentionChecklist: string[];
}

export function evaluateWeeklyProgress(
  previousAvgWeightKg: number,
  currentAvgWeightKg: number,
  targetWeightKg: number = 62.0
): ProgressAssessmentResult {
  const weightChangeKg = Math.round((currentAvgWeightKg - previousAvgWeightKg) * 100) / 100;
  const changeRatePercent = Math.round(Math.abs(weightChangeKg / previousAvgWeightKg) * 1000) / 10;
  const remainingKg = Math.max(0, currentAvgWeightKg - targetWeightKg);

  const waterRetentionChecklist = [
    'Đã cân ngay sau khi thức dậy và đi vệ sinh trước khi ăn/uống bất kỳ thứ gì chưa?',
    'Buổi tối hôm trước có ăn món nước quán nhiều muối (nước lèo bún bò, hủ tiếu) gây giữ nước tạm thời không?',
    'Có vừa thi đấu đá bóng 45 phút trong 24-48 giờ qua không? (Viêm cơ hồi phục vi thể hút nhiều nước)',
    'Có dùng đúng 1 chiếc cân đặt trên mặt sàn cứng phẳng không?',
  ];

  // Case 1: Too fast (> 1.0 kg/week or > 1.4% bodyweight)
  if (weightChangeKg <= -0.95) {
    const safeRate = 0.5; // kg/week
    const estimatedWeeks = Math.ceil(remainingKg / safeRate);
    return {
      currentWeightKg: currentAvgWeightKg,
      previousWeightKg: previousAvgWeightKg,
      weightChangeKg,
      changeRatePercent,
      status: 'TOO_FAST_MUSCLE_RISK',
      statusTitleVi: 'Cảnh báo: Tốc độ giảm cân quá nhanh (Nguy cơ mất cơ bắp)',
      badgeColor: 'amber',
      diagnosisVi: `Bạn đã giảm ${Math.abs(weightChangeKg)}kg trong 7 ngày qua (~${changeRatePercent}% trọng lượng cơ thể). Tốc độ vượt ngưỡng 0.8kg/tuần thường kèm theo mất nước nhiều và dị hóa cơ nạc (muscle catabolism), dễ khiến cơ thể mệt mỏi và giảm thể lực khi đá bóng.`,
      recommendationsVi: [
        'Tăng nhẹ năng lượng nạp vào thêm 100 - 150 kcal/ngày (ví dụ thêm 1 quả trứng hoặc 1/2 chén cơm).',
        'Ưu tiên đảm bảo đủ 125g - 135g protein/ngày để bọc lót bảo vệ khối cơ.',
        'Không cắt giảm khẩu phần bữa trưa khi đi làm.',
      ],
      estimatedWeeksToTarget: estimatedWeeks,
      waterRetentionChecklist,
    };
  }

  // Case 2: Optimal fat loss (0.4 kg - 0.85 kg / week)
  if (weightChangeKg <= -0.35 && weightChangeKg > -0.95) {
    const actualPace = Math.abs(weightChangeKg);
    const estimatedWeeks = Math.max(1, Math.ceil(remainingKg / actualPace));
    return {
      currentWeightKg: currentAvgWeightKg,
      previousWeightKg: previousAvgWeightKg,
      weightChangeKg,
      changeRatePercent,
      status: 'OPTIMAL_FAT_LOSS',
      statusTitleVi: 'Xuất sắc: Tốc độ vàng giảm mỡ bảo tồn cơ nạc',
      badgeColor: 'emerald',
      diagnosisVi: `Bạn đang giảm ${Math.abs(weightChangeKg)}kg/tuần (~${changeRatePercent}% trọng lượng). Đây là tốc độ chuẩn vàng của y học thể thao, giúp giảm lượng mỡ toàn thân (kể cả vùng bụng dưới) mà vẫn giữ được độ săn chắc và sức mạnh khi đá bóng.`,
      recommendationsVi: [
        'Tiếp tục duy trì thực đơn 2 bữa hiện tại (Trưa suất quán 30k, Tối đạm gà/trứng luộc tại nhà).',
        'Giữ nguyên mức tạ/reps trong các buổi chống đẩy, squat và plank.',
        'Ngủ đủ 7-8 tiếng để hỗ trợ phục hồi và cân bằng hormone leptin/ghrelin.',
      ],
      estimatedWeeksToTarget: estimatedWeeks,
      waterRetentionChecklist,
    };
  }

  // Case 3: Plateau / very slow change (-0.3 kg to +0.2 kg)
  if (weightChangeKg > -0.35 && weightChangeKg <= 0.2) {
    const defaultPace = 0.5;
    const estimatedWeeks = Math.ceil(remainingKg / defaultPace);
    return {
      currentWeightKg: currentAvgWeightKg,
      previousWeightKg: previousAvgWeightKg,
      weightChangeKg,
      changeRatePercent,
      status: 'PLATEAU_OR_SLOW',
      statusTitleVi: 'Cân nặng ổn định / Đang chững cân tạm thời',
      badgeColor: 'blue',
      diagnosisVi: `Cân nặng dao động ${weightChangeKg > 0 ? '+' : ''}${weightChangeKg}kg so với tuần trước. Đây là hiện tượng bình thường do biến thiên lượng nước nội bào và thức ăn trong ruột, đặc biệt khi ăn cơm tiệm có lượng muối cao hoặc sau buổi đá bóng hồi phục.`,
      recommendationsVi: [
        'Kiểm tra lại số đo vòng eo: Nếu vòng eo vẫn giảm hoặc giữ nguyên thì cơ thể vẫn đang giảm mỡ tốt.',
        'Hạn chế húp cạn nước lèo của các món bún/hủ tiếu để giảm tích nước do natri.',
        'Tiếp tục theo dõi thêm 1 tuần nữa trước khi quyết định điều chỉnh calo.',
      ],
      estimatedWeeksToTarget: estimatedWeeks,
      waterRetentionChecklist,
    };
  }

  // Case 4: Slight gain (> 0.2 kg)
  const defaultPace = 0.5;
  const estimatedWeeks = Math.ceil(remainingKg / defaultPace);
  return {
    currentWeightKg: currentAvgWeightKg,
    previousWeightKg: previousAvgWeightKg,
    weightChangeKg,
    changeRatePercent,
    status: 'SLIGHT_GAIN',
    statusTitleVi: 'Cân nặng tăng nhẹ: Kiểm tra sai số hoặc lượng muối',
    badgeColor: 'rose',
    diagnosisVi: `Cân nặng ghi nhận tăng ${weightChangeKg}kg. Đừng lo lắng, cơ thể con người không thể tích trữ được ${weightChangeKg}kg mỡ nguyên chất trong 1 tuần nếu bạn duy trì ăn 2 bữa. 80-90% lượng tăng này đến từ nước tích trữ do ăn mặn hoặc chưa đi tiêu vào buổi sáng.`,
    recommendationsVi: [
      'Ghi chép lại khẩu phần suất quán: kiểm tra xem có ăn thêm đồ ngọt, trà sữa hoặc nước ngọt có đường không.',
      'Đảm bảo uống đủ 2-2.5 lít nước lọc mỗi ngày để cơ thể tự động xả bớt lượng muối thừa.',
      'Cân lại vào 3 ngày tiếp theo vào đúng giờ sáng sớm sau khi thức dậy.',
    ],
    estimatedWeeksToTarget: estimatedWeeks,
    waterRetentionChecklist,
  };
}
