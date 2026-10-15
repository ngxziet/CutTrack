import { CalendarDays } from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { DailyDetailedPlanner } from "@/components/planner/daily-detailed-planner";

export default async function MealPlannerPage() {
  const state = await getAppState();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" />
          Kế Hoạch Thực Đơn Từng Ngày & Đánh Giá Tiến Độ Cân Sáng
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tùy chỉnh chiều cao, cân nặng, duyệt chi tiết từng ngày, tự do đổi món ăn và đánh giá tốc độ giảm mỡ hàng tuần.
        </p>
      </div>

      <DailyDetailedPlanner availableFoods={state.foods} />
    </div>
  );
}
