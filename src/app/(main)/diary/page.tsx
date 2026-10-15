import { getAppState } from "@/lib/server-actions";
import { DiaryView } from "@/components/diary/diary-view";

export default async function DiaryPage() {
  const state = await getAppState();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

  const dayDiary = state.diary[today] || {
    LUNCH: {
      slot: "LUNCH",
      slotName: "Bữa trưa (Suất quán)",
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalCostVnd: 0,
    },
    DINNER: {
      slot: "DINNER",
      slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalCostVnd: 0,
    },
  };

  return (
    <DiaryView
      initialDate={today}
      initialDiary={dayDiary}
      foods={state.foods}
      dailyBudgetVnd={state.profile.dailyBudgetVnd}
      dailyTargetCalories={state.profile.dailyTargetCalories}
    />
  );
}
