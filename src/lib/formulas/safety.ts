import {
  REFERENCE_BMR_KCAL,
  REFERENCE_TDEE_KCAL,
  EXTREME_DEFICIT_THRESHOLD_KCAL,
  SAFE_DEFICIT_RANGE_MIN_KCAL,
  SAFE_DEFICIT_RANGE_MAX_KCAL,
  USER_REQUESTED_LOW_TARGET_KCAL,
} from '../constants';

export type CalorieSafetySeverity =
  | 'CRITICAL_EXTREME_DEFICIT'
  | 'MODERATE_DEFICIT'
  | 'OPTIMAL_SAFE_DEFICIT'
  | 'MAINTENANCE'
  | 'SURPLUS';

export interface CalorieSafetyAssessment {
  targetCalories: number;
  referenceBmr: number;
  referenceTdee: number;
  deficitCalories: number;
  deficitPercent: number;
  isDeepDeficit: boolean;
  isBelowBmr: boolean;
  isSafeRecommendation: boolean;
  severity: CalorieSafetySeverity;
  warningTitle: string;
  warningMessage: string;
  recommendedRange: {
    min: number;
    max: number;
  };
  disclaimer: string;
}

/**
 * Assess safety of a selected daily calorie intake target.
 * Spec requirements:
 * - Neutral warning if target < 1400 kcal (e.g. 1300 kcal user request)
 * - Highlights that BMR is ~1620 kcal and TDEE is ~1945 kcal
 * - Recommends 1500 - 1650 kcal/day as safe initial starting range
 * - Never forces or shames; allows personal target while clarifying lack of medical endorsement.
 */
export function checkCalorieTargetSafety(
  targetCalories: number,
  options?: {
    bmr?: number;
    tdee?: number;
  }
): CalorieSafetyAssessment {
  const bmr = options?.bmr ?? REFERENCE_BMR_KCAL;
  const tdee = options?.tdee ?? REFERENCE_TDEE_KCAL;

  const deficitCalories = tdee - targetCalories;
  const deficitPercent = Math.round((deficitCalories / tdee) * 100);
  const isBelowBmr = targetCalories < bmr;
  const isDeepDeficit = targetCalories < EXTREME_DEFICIT_THRESHOLD_KCAL;

  const formatKcal = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
  const fmtTarget = formatKcal(targetCalories);
  const fmtBmr = formatKcal(bmr);
  const fmtTdee = formatKcal(tdee);
  const fmtThreshold = formatKcal(EXTREME_DEFICIT_THRESHOLD_KCAL);
  const fmtMin = formatKcal(SAFE_DEFICIT_RANGE_MIN_KCAL);
  const fmtMax = formatKcal(SAFE_DEFICIT_RANGE_MAX_KCAL);

  let severity: CalorieSafetySeverity = 'OPTIMAL_SAFE_DEFICIT';
  let isSafeRecommendation = true;
  let warningTitle = 'Mức calo hợp lý';
  let warningMessage =
    'Mục tiêu calo này nằm trong khoảng thâm hụt an toàn và bền vững.';

  if (targetCalories < EXTREME_DEFICIT_THRESHOLD_KCAL) {
    severity = 'CRITICAL_EXTREME_DEFICIT';
    isSafeRecommendation = false;
    warningTitle = 'Cảnh báo: Mục tiêu thâm hụt calo quá sâu';
    warningMessage =
      `Mức calo ${fmtTarget} kcal/ngày thấp hơn đáng kể so với BMR ước tính (~${fmtBmr} kcal) và TDEE (~${fmtTdee} kcal). ` +
      `Cắt giảm quá sâu (< ${fmtThreshold} kcal) đối với nam giới trưởng thành có nguy cơ gây dị hóa cơ bắp, ` +
      `hạ đường huyết, suy giảm trao đổi chất, mệt mỏi kéo dài và giảm sút hiệu suất vận động (nhất là các ngày đá banh). ` +
      `Mức thâm hụt khởi đầu khuyến nghị an toàn là ${fmtMin}–${fmtMax} kcal/ngày.`;
  } else if (targetCalories < SAFE_DEFICIT_RANGE_MIN_KCAL) {
    severity = 'MODERATE_DEFICIT';
    isSafeRecommendation = false;
    warningTitle = 'Lưu ý: Mức calo tương đối thấp';
    warningMessage =
      `Mục tiêu ${fmtTarget} kcal/ngày nằm dưới khoảng khuyến nghị ${fmtMin}–${fmtMax} kcal. ` +
      `Hãy theo dõi sát năng lượng cơ thể, chất lượng giấc ngủ và khả năng tập luyện hàng ngày.`;
  } else if (targetCalories <= SAFE_DEFICIT_RANGE_MAX_KCAL) {
    severity = 'OPTIMAL_SAFE_DEFICIT';
    isSafeRecommendation = true;
    warningTitle = 'Mức calo tối ưu cho giảm mỡ an toàn';
    warningMessage =
      `Mục tiêu ${fmtTarget} kcal/ngày tạo mức thâm hụt vừa phải (~${deficitCalories} kcal, tương đương ${deficitPercent}% TDEE), ` +
      `giúp giảm mỡ bền vững đồng thời bảo tồn khối lượng cơ nạc.`;
  } else if (targetCalories <= tdee) {
    severity = 'MAINTENANCE';
    isSafeRecommendation = true;
    warningTitle = 'Mức calo duy trì / thâm hụt nhẹ';
    warningMessage = `Mục tiêu ${fmtTarget} kcal/ngày gần mức tiêu hao duy trì (~${fmtTdee} kcal).`;
  } else {
    severity = 'SURPLUS';
    isSafeRecommendation = true;
    warningTitle = 'Thặng dư calo (Tăng cân / Tăng cơ)';
    warningMessage = `Mục tiêu ${targetCalories} kcal/ngày cao hơn mức tiêu hao duy trì (~${tdee} kcal).`;
  }

  const disclaimer =
    'Các chỉ số BMR/TDEE và khoảng calo là ước tính tham khảo dựa trên công thức Mifflin-St Jeor, không thay thế cho tư vấn y khoa hoặc chuyên gia dinh dưỡng.';

  return {
    targetCalories,
    referenceBmr: bmr,
    referenceTdee: tdee,
    deficitCalories,
    deficitPercent,
    isDeepDeficit,
    isBelowBmr,
    isSafeRecommendation,
    severity,
    warningTitle,
    warningMessage,
    recommendedRange: {
      min: SAFE_DEFICIT_RANGE_MIN_KCAL,
      max: SAFE_DEFICIT_RANGE_MAX_KCAL,
    },
    disclaimer,
  };
}

export interface SoccerDayEnergyAdjustment {
  baseTargetCalories: number;
  soccerMinutes: number;
  estimatedSoccerBurnKcal: number;
  recommendedIntakeKcal: number;
  allowFullEatBack: boolean;
  preventionOfDoubleCountMessage: string;
}

/**
 * Handle energy balance on soccer day without double-counting exercise into TDEE.
 * Spec section 4.6:
 * "Ngày đá banh 45 phút/tuần... Không tự động 'ăn bù' toàn bộ kcal thể thao; tránh double count TDEE."
 */
export function calculateSoccerDayEnergy({
  baseTargetCalories,
  soccerMinutes = 45,
  estimatedSoccerBurnKcal = 350,
  allowFullEatBack = false,
}: {
  baseTargetCalories: number;
  soccerMinutes?: number;
  estimatedSoccerBurnKcal?: number;
  allowFullEatBack?: boolean;
}): SoccerDayEnergyAdjustment {
  // If user is already accounting for activity in TDEE, full eat-back leads to double-counting.
  // We recommend at most a small recovery intake (~100-150 kcal) or keeping target steady.
  const recoveryBonusKcal = allowFullEatBack
    ? estimatedSoccerBurnKcal
    : Math.min(150, Math.round(estimatedSoccerBurnKcal * 0.3));

  const recommendedIntakeKcal = baseTargetCalories + recoveryBonusKcal;

  const preventionOfDoubleCountMessage =
    'CutTrack không tự động cộng toàn bộ calo đá banh vào mục tiêu ăn bù để tránh hiện tượng double-counting ' +
    '(tính trùng lặp tiêu hao thể lực với hệ số hoạt động TDEE). Chỉ bổ sung nhẹ lượng carb/protein phục hồi nếu thấy đói hoặc kiệt sức.';

  return {
    baseTargetCalories,
    soccerMinutes,
    estimatedSoccerBurnKcal,
    recommendedIntakeKcal,
    allowFullEatBack,
    preventionOfDoubleCountMessage,
  };
}
