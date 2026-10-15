"use client";

import { useState } from "react";
import { Settings, Save, AlertTriangle, Download, CheckCircle2 } from "lucide-react";
import { UserProfileState } from "@/lib/store/cuttrack-store";
import { updateProfileGoalsAction } from "@/lib/server-actions";
import { checkCalorieTargetSafety } from "@/lib/formulas/safety";
import { formatCurrencyVND } from "@/lib/utils";

export function SettingsView({ initialProfile }: { initialProfile: UserProfileState }) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const safety = checkCalorieTargetSafety(profile.dailyTargetCalories);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      await updateProfileGoalsAction(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleExportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cuttrack_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Cài Đặt Hồ Sơ & Mục Tiêu Dinh Dưỡng
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tùy chỉnh thông số sinh học, ngân sách ngày và kiểm tra cảnh báo an toàn y tế.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công các thông số mục tiêu mới!</span>
        </div>
      )}

      {/* Safety Warning if target is low */}
      {profile.dailyTargetCalories <= 1400 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-sm font-semibold">Cảnh Báo Về Mục Tiêu Calo Cắt Giảm Sâu:</strong>
            <p>{safety.warningMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-3xl border border-border bg-card space-y-5">
        <h2 className="text-base font-bold text-foreground">Thông Số Cá Nhân & Mục Tiêu Thể Hình</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tuổi (năm)
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Chiều cao (cm)
            </label>
            <input
              type="number"
              value={profile.heightCm}
              onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng hiện tại (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={profile.currentWeightKg}
              onChange={(e) => setProfile({ ...profile, currentWeightKg: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng mục tiêu (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={profile.targetWeightKg}
              onChange={(e) => setProfile({ ...profile, targetWeightKg: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-primary"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h2 className="text-base font-bold text-foreground">Chỉ Số Năng Lượng & Ngân Sách</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Mục tiêu Calo nạp mỗi ngày (kcal)
              </label>
              <input
                type="number"
                value={profile.dailyTargetCalories}
                onChange={(e) => setProfile({ ...profile, dailyTargetCalories: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Khuyến nghị an toàn: 1.500 – 1.650 kcal (BMR ~1.620, TDEE ~1.945)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Mục tiêu Đạm / Protein (gram/ngày)
              </label>
              <input
                type="number"
                value={profile.targetProteinGrams}
                onChange={(e) => setProfile({ ...profile, targetProteinGrams: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Mức chuẩn 1.8-2.0g/kg (~125-135g) để giữ cơ khi thâm hụt
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Hạn mức ngân sách ăn uống (VND / ngày)
              </label>
              <input
                type="number"
                step="5000"
                value={profile.dailyBudgetVnd}
                onChange={(e) => setProfile({ ...profile, dailyBudgetVnd: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Mặc định: 80.000 VND/ngày (560.000 VND/tuần)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Số phút đá bóng mỗi tuần
              </label>
              <input
                type="number"
                value={profile.soccerMinutesPerWeek}
                onChange={(e) => setProfile({ ...profile, soccerMinutesPerWeek: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {isSaving ? "Đang lưu..." : "Cập nhật cài đặt mục tiêu"}
        </button>
      </form>

      {/* Export Section */}
      <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
        <h2 className="text-base font-bold text-foreground">Sao Lưu & Xuất Dữ Liệu</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Xuất toàn bộ thông số cá nhân, nhật ký ăn uống và lịch sử đo lường về máy định dạng JSON để lưu trữ độc lập.
        </p>
        <button
          type="button"
          onClick={handleExportJSON}
          className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Tải về file sao lưu (JSON)
        </button>
      </div>
    </div>
  );
}
