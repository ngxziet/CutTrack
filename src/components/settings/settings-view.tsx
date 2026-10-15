"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Save,
  AlertTriangle,
  Download,
  Upload,
  CheckCircle2,
  Smartphone,
  Wifi,
  Cloud,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { UserProfileState } from "@/lib/store/cuttrack-store";
import {
  updateProfileGoalsAction,
  exportFullBackupAction,
  importFullBackupAction,
} from "@/lib/server-actions";
import { checkCalorieTargetSafety } from "@/lib/formulas/safety";
import { formatCurrencyVND } from "@/lib/utils";

export function SettingsView({ initialProfile }: { initialProfile: UserProfileState }) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [localOrigin, setLocalOrigin] = useState("http://192.168.100.163:3000");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        setLocalOrigin(`http://192.168.100.163${port || ":3000"}`);
      } else {
        setLocalOrigin(`${window.location.protocol}//${hostname}${port}`);
      }
    }
  }, []);

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

  async function handleExportJSON() {
    try {
      const res = await exportFullBackupAction();
      const stateToExport = res.success ? res.state : { profile };
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateToExport, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `cuttrack_full_backup_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Lỗi khi xuất file sao lưu:", err);
    }
  }

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      setImportStatus("Đang nhập dữ liệu...");
      const res = await importFullBackupAction(content);
      if (res.success) {
        setImportStatus("✅ Khôi phục toàn bộ cơ sở dữ liệu thành công! Đang tải lại...");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus(`❌ Lỗi: ${res.message}`);
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
  }

  function handleCopyMobileLink() {
    navigator.clipboard.writeText(localOrigin);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Cài Đặt Hồ Sơ & Đồng Bộ Thiết Bị
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tùy chỉnh mục tiêu sinh học, kết nối điện thoại dùng chung Database và xuất nhập dữ liệu.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công các thông số mục tiêu mới!</span>
        </div>
      )}

      {/* MOBILE CONNECTION & DATABASE SYNC CARD */}
      <div className="p-6 rounded-3xl border border-primary/30 bg-primary/5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Kết Nối & Dùng Trên Điện Thoại (Cùng 1 Database)
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <Wifi className="w-3.5 h-3.5" /> Đồng bộ thời gian thực qua mạng nội bộ / Cloud
              </span>
            </div>
          </div>
        </div>

        {/* IP Address Box */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Địa chỉ mở trên trình duyệt điện thoại (Cùng mạng Wi-Fi):</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Server Đang Hoạt Động</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={localOrigin}
              className="flex-1 px-3 py-2 rounded-xl bg-secondary font-mono text-xs sm:text-sm font-bold text-foreground border border-border select-all"
            />
            <button
              onClick={handleCopyMobileLink}
              className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0"
            >
              {copySuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? "Đã chép link!" : "Sao chép link"}</span>
            </button>
          </div>
        </div>

        {/* How Database Sync Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
              <span>Tại sao luôn đồng bộ cùng 1 DB?</span>
            </div>
            <p className="leading-relaxed">
              Cả máy tính và điện thoại đều gửi dữ liệu trực tiếp về <strong>cùng 1 máy chủ CutTrack</strong> và cùng lưu vào file cơ sở dữ liệu tập trung (<code>cuttrack_db.json</code>). Khi bạn lưu đồ ăn trên điện thoại, máy tính tải lại sẽ thấy ngay lập tức mà không bao giờ bị lệch.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Smartphone className="w-3.5 h-3.5 text-sky-500" />
              <span>Cài đặt thành App trên Điện Thoại:</span>
            </div>
            <p className="leading-relaxed">
              • <strong>iPhone (Safari):</strong> Bấm nút <em>Chia sẻ</em> (ô vuông mũi tên) → Chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.<br />
              • <strong>Android (Chrome):</strong> Bấm dấu 3 chấm góc phải → Chọn <strong>"Cài đặt ứng dụng"</strong> để dùng toàn màn hình như App tải từ Store.
            </p>
          </div>
        </div>

        {/* Outside LAN Guidance */}
        <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Cloud className="w-4 h-4 text-emerald-500" />
            <span>Muốn dùng ngoài đường 24/7 (4G/5G khi tắt máy tính):</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Dự án CutTrack đã sẵn sàng trên GitHub: <code>https://github.com/ngxziet/CutTrack</code>. Bạn chỉ cần kết nối repo lên <strong>Vercel (Free 100%)</strong> và gắn <strong>Neon Postgres / Supabase</strong> làm Cloud Database theo file <code>prisma/schema.prisma</code> có sẵn.
          </p>
        </div>
      </div>

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

      {/* Main Profile Form */}
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
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
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
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng hiện tại (kg)
            </label>
            <input
              type="number"
              value={profile.currentWeightKg}
              onChange={(e) => setProfile({ ...profile, currentWeightKg: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Cân nặng mục tiêu (kg)
            </label>
            <input
              type="number"
              value={profile.targetWeightKg}
              onChange={(e) => setProfile({ ...profile, targetWeightKg: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-primary"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h2 className="text-base font-bold text-foreground mb-3">Chỉ Số Năng Lượng & Ngân Sách</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Mục tiêu Calo nạp mỗi ngày (kcal)
              </label>
              <input
                type="number"
                value={profile.dailyTargetCalories}
                onChange={(e) => setProfile({ ...profile, dailyTargetCalories: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold font-mono text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Khuyến nghị an toàn: 1.500 - 1.650 kcal (BMR ≈1.620, TDEE ≈1.945)
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
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Mức chuẩn 1.8 - 2.0g/kg (~125 - 135g) để giữ cơ khi thâm hụt
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Hạn mức ngân sách ăn uống (VNĐ / ngày)
              </label>
              <input
                type="number"
                step="5000"
                value={profile.dailyBudgetVnd}
                onChange={(e) => setProfile({ ...profile, dailyBudgetVnd: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-bold font-mono text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Mặc định: 80.000 VNĐ/ngày (560.000 VNĐ/tuần)
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
                className="w-full p-2.5 rounded-xl border border-border bg-background text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-primary/20"
        >
          <Save className="w-4 h-4" /> {isSaving ? "Đang lưu..." : "Cập nhật cài đặt mục tiêu"}
        </button>
      </form>

      {/* Backup, Export & Import Section */}
      <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
        <h2 className="text-base font-bold text-foreground">Sao Lưu & Khôi Phục Cơ Sở Dữ Liệu</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tải về toàn bộ cơ sở dữ liệu CutTrack (thông số cá nhân, thực đơn, nhật ký ăn uống, bài tập và lịch sử chi tiêu) để chuyển sang máy khác hoặc cất giữ an toàn.
        </p>

        {importStatus && (
          <div className="p-3 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-primary" /> Tải về file sao lưu toàn bộ (JSON)
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileImport}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4 text-sky-500" /> Nhập file khôi phục (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
