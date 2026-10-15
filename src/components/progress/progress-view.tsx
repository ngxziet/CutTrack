"use client";

import { useState } from "react";
import { TrendingUp, Plus, Scale, Sparkles, CheckCircle2 } from "lucide-react";
import { WeightEntry } from "@/lib/store/cuttrack-store";
import { logMeasurementAction } from "@/lib/server-actions";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export function ProgressView({ initialMeasurements }: { initialMeasurements: WeightEntry[] }) {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [weight, setWeight] = useState(67.8);
  const [waist, setWaist] = useState(81.2);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

    try {
      const res = await logMeasurementAction({
        date: today,
        weightKg: Number(weight),
        waistCm: Number(waist),
        notes: notes || undefined,
      });

      if (res.success) {
        setMeasurements([...measurements, res.measurement]);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const latest = measurements[measurements.length - 1];
  const isNearTarget = latest.weightKg <= 63.0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Tiến Độ Cân Nặng & Số Đo Vòng Eo
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Theo dõi mức dao động nước, đo trung bình 7 ngày và chuẩn bị chuyển sang giai đoạn Tăng Cơ (Hypertrophy).
        </p>
      </div>

      {/* Target Achievement Milestone Card */}
      {isNearTarget && (
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Tiến Gần Mục Tiêu 62kg — Đánh Giá Chuyển Giai Đoạn Tăng Cơ</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Khi cân nặng đạt mốc 62kg và vòng eo giảm rõ rệt, hệ thống sẽ đề xuất giai đoạn Ăn Giữ Cân (Maintenance 2-3 tuần) để ổn định trao đổi chất trước khi bước vào giai đoạn Tăng Cơ (Hypertrophy / Lean Bulk).
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
        <h2 className="text-base font-bold text-foreground">Biểu Đồ Xu Hướng Giảm Cân & Vòng Eo</h2>
        <DashboardCharts measurements={measurements} />
      </div>

      {/* Form & History Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" /> Ghi Nhận Số Đo Hôm Nay
          </h3>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!
            </div>
          )}

          <form onSubmit={handleAddEntry} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Cân nặng sáng thức dậy (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Vòng eo ngang rốn (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Ghi chú (Cảm nhận thể lực)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Bụng nhẹ, không đói..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu số đo"}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-sm text-foreground">Lịch Sử Cân Đo Gần Nhất</h3>
          <div className="space-y-2">
            {measurements.slice().reverse().map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-foreground">{m.date}</span>
                  {m.notes && <p className="text-[11px] text-muted-foreground mt-0.5">{m.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 block">
                    {m.weightKg} kg
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Eo: {m.waistCm || 81.5} cm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
