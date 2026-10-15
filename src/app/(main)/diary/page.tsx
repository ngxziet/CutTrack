import { getAppState } from "@/lib/server-actions";
import { DiaryView } from "@/components/diary/diary-view";

interface DiaryPageProps {
  searchParams?: Promise<{ date?: string }>;
}

export default async function DiaryPage({ searchParams }: DiaryPageProps) {
  const state = await getAppState();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const resolvedParams = searchParams ? await searchParams : undefined;
  const targetDate = resolvedParams?.date || today;

  const dayDiary = state.diary[targetDate] || {
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
      initialDate={targetDate}
      todayDate={today}
      initialDiary={dayDiary}
      allDiaryDates={state.diary}
      foods={state.foods}
      dailyBudgetVnd={state.profile.dailyBudgetVnd}
      dailyTargetCalories={state.profile.dailyTargetCalories}
    />
  );
}
