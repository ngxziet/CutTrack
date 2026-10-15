import Link from "next/link";
import {
  Flame,
  Wallet,
  TrendingDown,
  Dumbbell,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  PlusCircle,
  Clock,
  Utensils,
} from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";
import { checkCalorieTargetSafety } from "@/lib/formulas/safety";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
  const state = await getAppState();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

  const todayDiary = state.diary[today] || {
    LUNCH: { totalCalories: 0, totalProtein: 0, totalCostVnd: 0, items: [] },
    DINNER: { totalCalories: 0, totalProtein: 0, totalCostVnd: 0, items: [] },
  };

  const totalCaloriesEaten = todayDiary.LUNCH.totalCalories + todayDiary.DINNER.totalCalories;
  const totalProteinEaten = Math.round((todayDiary.LUNCH.totalProtein + todayDiary.DINNER.totalProtein) * 10) / 10;
  const totalCostToday = todayDiary.LUNCH.totalCostVnd + todayDiary.DINNER.totalCostVnd;

  const targetCalories = state.profile.dailyTargetCalories;
  const targetProtein = state.profile.targetProteinGrams;
  const dailyBudget = state.profile.dailyBudgetVnd;
  const remainingBudget = Math.max(0, dailyBudget - totalCostToday);

  // Check safety for 1300 vs recommended
  const safetyCheck = checkCalorieTargetSafety(targetCalories);

  // Calorie margin of confidence (±10% for restaurant foods)
  const minCalorieRange = Math.round(totalCaloriesEaten * 0.92);
  const maxCalorieRange = Math.round(totalCaloriesEaten * 1.08);

  const latestWeight = state.measurements[state.measurements.length - 1];
  const weightDiff = Math.round((latestWeight.weightKg - state.profile.targetWeightKg) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bảng Điều Khiển Tổng Quan
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi tiến độ cắt mỡ, kiểm soát ngân sách 70k - 80k/ngày & 2 bữa chính.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/diary"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition-opacity shadow-sm shadow-primary/25"
          >
            <PlusCircle className="w-4 h-4" />
            Ghi bữa ăn hôm nay
          </Link>
          <Link
            href="/workouts"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-accent transition-colors"
          >
            <Dumbbell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Ghi buổi tập
          </Link>
        </div>
      </div>

      {/* Safety Notice if user ever tests or selects 1300 kcal */}
      {targetCalories <= 1400 && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold block text-sm">Cảnh báo thâm hụt năng lượng sâu:</span>
            <p>{safetyCheck.warningMessage}</p>
          </div>
        </div>
      )}

      {/* Stat Cards 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Calories Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Năng lượng nạp vào
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {totalCaloriesEaten}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                / {targetCalories} kcal
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dải ước tính: {minCalorieRange} – {maxCalorieRange} kcal</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCaloriesEaten / targetCalories) * 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Protein Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Đạm bảo tồn cơ nạc
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {totalProteinEaten}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                / {targetProtein}g
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Đạt {Math.round((totalProteinEaten / targetProtein) * 100)}% mục tiêu (1.9g/kg)
            </p>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProteinEaten / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Budget Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ngân sách hôm nay
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                {formatCurrencyVND(totalCostToday)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                / {formatCurrencyVND(dailyBudget)}
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              Còn lại {formatCurrencyVND(remainingBudget)}
            </p>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCostToday / dailyBudget) * 100)}%` }}
            />
          </div>
        </div>

        {/* 4. Weight Progress Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cân nặng & Vòng eo
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {latestWeight.weightKg}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                kg (Mục tiêu 62kg)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Vòng eo: <strong className="text-foreground">{latestWeight.waistCm || 81.2} cm</strong> • Còn {weightDiff}kg nữa
            </p>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, ((68 - latestWeight.weightKg) / (68 - 62)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Charts (Left) & Today's 2 Meals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive 7-day Trend Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Xu Hướng Tiến Độ 7 Ngày
                </h2>
                <p className="text-xs text-muted-foreground">
                  Theo dõi tương quan giữa Calo nạp vào, Chi phí ăn uống & Cân nặng thực tế
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                Trung bình 7 ngày
              </span>
            </div>

            {/* Recharts Component */}
            <DashboardCharts measurements={state.measurements} />
          </div>

          {/* Clinical Advice & Guidance Callout */}
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-foreground">
                Nguyên tắc Dinh Dưỡng An Toàn CutTrack
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Với nam 23 tuổi, 68kg (BMR ~1.620 kcal, TDEE ~1.945 kcal) có đá banh 45 phút/tuần, mức thâm hụt khuyến nghị an toàn là <strong>1.500 – 1.650 kcal/ngày</strong> để bảo tồn tối đa cơ nạc. Thâm hụt quá sâu (&lt;1.400 kcal) có thể gây giảm hiệu suất thi đấu và hạ đường huyết.
              </p>
              <Link
                href="/learn/bmr-tdee-calo-giam-mo-an-toan"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline pt-1"
              >
                Đọc bài phân tích khoa học chi tiết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: 2 Default Meals for Today */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-base text-foreground">Nhật Ký Hôm Nay</h2>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Chế độ 2 bữa
              </span>
            </div>

            {/* Bữa Trưa */}
            <div className="py-4 border-b border-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Bữa Trưa (Suất quán)
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyVND(todayDiary.LUNCH.totalCostVnd)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between mb-3">
                <span>{todayDiary.LUNCH.totalCalories} kcal</span>
                <span>{todayDiary.LUNCH.totalProtein}g Protein</span>
              </div>

              {todayDiary.LUNCH.items.length === 0 ? (
                <div className="p-3 rounded-xl bg-secondary/50 text-center text-xs text-muted-foreground">
                  Chưa ghi món trưa quán.
                </div>
              ) : (
                <div className="space-y-2">
                  {todayDiary.LUNCH.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-secondary/40 border border-border/50 text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.foodName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.grams}g • {item.calories} kcal • {item.protein}g đạm
                        </p>
                      </div>
                      <span className="font-medium text-foreground">
                        {formatCurrencyVND(item.priceVnd)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bữa Tối */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Bữa Tối (+ Trứng/gà nhà)
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyVND(todayDiary.DINNER.totalCostVnd)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between mb-3">
                <span>{todayDiary.DINNER.totalCalories} kcal</span>
                <span>{todayDiary.DINNER.totalProtein}g Protein</span>
              </div>

              {todayDiary.DINNER.items.length === 0 ? (
                <div className="p-3 rounded-xl bg-secondary/50 text-center text-xs text-muted-foreground">
                  Chưa ghi món tối.
                </div>
              ) : (
                <div className="space-y-2">
                  {todayDiary.DINNER.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-secondary/40 border border-border/50 text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.foodName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.grams}g • {item.calories} kcal • {item.protein}g đạm
                        </p>
                      </div>
                      <span className="font-medium text-foreground">
                        {formatCurrencyVND(item.priceVnd)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/diary"
              className="mt-5 w-full py-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
            >
              Chỉnh sửa & Thêm món vào Nhật ký <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Today's Workout Quick Status */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Lịch Tập Kháng Lực & Đá Banh
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Đã hoàn thành
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {state.workouts[0]?.title || "Tập sức mạnh Ngực & Bụng (Push-up max 20, tập dưới ngưỡng kiệt sức)"}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {state.workouts[0]?.durationMinutes || 35} phút
              </span>
              <span>🔥 ~{state.workouts[0]?.caloriesBurnedEstimate || 160} kcal</span>
            </div>
            <Link
              href="/workouts"
              className="block text-center py-2 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-accent transition-colors"
            >
              Xem chi tiết các hiệp tập & Timer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
