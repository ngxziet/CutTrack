import { Wallet, TrendingUp, PiggyBank, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";

export default async function BudgetPage() {
  const state = await getAppState();
  const dailyBudget = state.profile.dailyBudgetVnd; // 80k
  const weeklyBudget = dailyBudget * 7; // 560k

  const totalSpent = state.expenses.reduce((s, e) => s + e.amountVnd, 0);
  const remaining = Math.max(0, weeklyBudget - totalSpent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Quản Lý Ngân Sách Ăn Uống (70k - 80k / Ngày)
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Hạch toán tiền tệ VND chính xác dạng số nguyên, cơ chế bù trừ rollover thông minh.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Hạn mức ngày</span>
          <p className="text-2xl font-black text-foreground mt-1">
            {formatCurrencyVND(dailyBudget)}
          </p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Cơm trưa 30k + Đạm tối 23k = 53k (Dư dôi 27k)
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Hạn mức tuần (7 ngày)</span>
          <p className="text-2xl font-black text-foreground mt-1">
            {formatCurrencyVND(weeklyBudget)}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            490.000 – 560.000 VND/tuần
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Số dư tích lũy hiện có</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrencyVND(remaining)}
          </p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Đủ khả năng chi trả cho bữa tiệc gà nướng thứ Bảy
          </span>
        </div>
      </div>

      {/* Transactions History */}
      <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold text-foreground">Lịch Sử Chi Tiêu Gần Đây</h2>
        <div className="space-y-2">
          {state.expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-sm text-foreground block">{exp.title}</span>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Ngày: {exp.date} • Mục: {exp.category === "LUNCH" ? "Bữa trưa quán" : exp.category === "DINNER" ? "Đạm bữa tối" : "Khác"}
                </p>
              </div>
              <span className="text-sm font-bold text-foreground">
                -{formatCurrencyVND(exp.amountVnd)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
