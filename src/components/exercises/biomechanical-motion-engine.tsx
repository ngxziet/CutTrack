"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  Target,
  EyeOff,
  Activity,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Link as LinkIcon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { saveExerciseConfigAction } from "@/lib/server-actions";

interface BiomechanicalMotionEngineProps {
  exerciseSlug: string;
  exerciseName: string;
  posterUrl: string;
  animationUrl: string;
  initialConfig?: {
    targetSets: number;
    targetReps: number;
    tempo: string;
    restSeconds: number;
    targetRpe: number;
    notes?: string;
    customMediaUrl?: string;
  };
}

export function BiomechanicalMotionEngine({
  exerciseSlug,
  exerciseName,
  posterUrl,
  animationUrl,
  initialConfig,
}: BiomechanicalMotionEngineProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState<"ECCENTRIC" | "CONCENTRIC">("ECCENTRIC");
  const [repCount, setRepCount] = useState(1);
  const [activeTab, setActiveTab] = useState<"MOTION" | "CONFIG" | "CUSTOM_SOURCE">("MOTION");

  // Config form state
  const [configSets, setConfigSets] = useState(initialConfig?.targetSets || 3);
  const [configReps, setConfigReps] = useState(initialConfig?.targetReps || 12);
  const [configTempo, setConfigTempo] = useState(initialConfig?.tempo || "2-0-1");
  const [configRest, setConfigRest] = useState(initialConfig?.restSeconds || 60);
  const [configRpe, setConfigRpe] = useState(initialConfig?.targetRpe || 8);
  const [configNotes, setConfigNotes] = useState(initialConfig?.notes || "");
  const [customMediaUrl, setCustomMediaUrl] = useState(initialConfig?.customMediaUrl || "");
  const [previewMediaUrl, setPreviewMediaUrl] = useState(initialConfig?.customMediaUrl || "");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Active displayed media URL (either custom or default animation)
  const activeMediaUrl = previewMediaUrl || customMediaUrl || animationUrl;
  const activePosterUrl = customMediaUrl || posterUrl;

  // Cycle phase every 2.4s (adjusted by speed)
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const cycleTime = 2400 / speed;
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev === "ECCENTRIC") {
          return "CONCENTRIC";
        } else {
          setRepCount((r) => (r >= configReps ? 1 : r + 1));
          return "ECCENTRIC";
        }
      });
    }, cycleTime / 2);

    return () => clearInterval(interval);
  }, [isPlaying, speed, reducedMotion, configReps]);

  async function handleSaveConfig(mediaUrlOverride?: string) {
    setIsSavingConfig(true);
    setSaveSuccess(false);
    try {
      const urlToSave = mediaUrlOverride !== undefined ? mediaUrlOverride : customMediaUrl;
      await saveExerciseConfigAction(exerciseSlug, {
        targetSets: configSets,
        targetReps: configReps,
        tempo: configTempo,
        restSeconds: configRest,
        targetRpe: configRpe,
        notes: configNotes,
        customMediaUrl: urlToSave.trim() || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error("Lỗi khi lưu cấu hình bài tập:", err);
    } finally {
      setIsSavingConfig(false);
    }
  }

  function handleApplyCustomUrl() {
    if (previewMediaUrl.trim()) {
      setCustomMediaUrl(previewMediaUrl.trim());
      handleSaveConfig(previewMediaUrl.trim());
    }
  }

  function handleResetToDefault() {
    setPreviewMediaUrl("");
    setCustomMediaUrl("");
    setImageError(false);
    handleSaveConfig("");
  }

  return (
    <div className="space-y-4">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("MOTION")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "MOTION"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Chuyển Động 3D Chuẩn
          </button>
          <button
            onClick={() => setActiveTab("CONFIG")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "CONFIG"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Cấu Hình Hiệp & Rep
          </button>
          <button
            onClick={() => setActiveTab("CUSTOM_SOURCE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "CUSTOM_SOURCE"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Lấy Ảnh Từ Mạng
            {customMediaUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Live Rep Counter Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border font-mono font-bold text-foreground">
            Hiệp: {configSets}S • Rep: <strong className="text-primary">{repCount}</strong>/{configReps}
          </span>
        </div>
      </div>

      {/* TAB 1: 3D REAL ANIMATION VIEWPORT */}
      {activeTab === "MOTION" && (
        <div className="space-y-3">
          {/* Main Visual Screen */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border bg-slate-950 shadow-lg flex items-center justify-center">
            {imageError ? (
              <div className="text-center p-6 space-y-2 text-muted-foreground">
                <p className="text-sm font-semibold text-rose-400">Không tải được hình ảnh từ đường dẫn tùy chỉnh</p>
                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 text-xs rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Khôi phục ảnh chuẩn mặc định
                </button>
              </div>
            ) : (
              <img
                src={reducedMotion || !isPlaying ? activePosterUrl : activeMediaUrl}
                alt={`Kỹ thuật ${exerciseName}`}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain p-2 transition-transform duration-300 select-none pointer-events-none"
              />
            )}

            {/* Top Overlay Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-sm">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  {reducedMotion
                    ? "Poster Tĩnh (A11y)"
                    : isPlaying
                    ? `3D Motion Loop • ${speed}x`
                    : "Đang tạm dừng"}
                </span>

                {customMediaUrl && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    Link từ mạng
                  </span>
                )}
              </div>

              {/* Real-time Breathing Guide Cue */}
              <div
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all duration-300 shadow-md backdrop-blur-md border ${
                  phase === "ECCENTRIC"
                    ? "bg-sky-600/90 text-white border-sky-400/50"
                    : "bg-emerald-600/90 text-white border-emerald-400/50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 animate-pulse" />
                  <span>
                    {phase === "ECCENTRIC"
                      ? "Hạ người • Hít sâu bằng mũi"
                      : "Phát lực • Thở mạnh siết cơ"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between p-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  title={isPlaying ? "Tạm dừng" : "Tiếp tục phát"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setRepCount(1);
                    setPhase("ECCENTRIC");
                    setTimeout(() => setIsPlaying(true), 60);
                  }}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  title="Đặt lại hiệp & đếm rep từ đầu"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Speed Toggles */}
                <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                  {[0.5, 1, 1.25].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                        speed === s
                          ? "bg-primary text-primary-foreground"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                    reducedMotion
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-white/15 hover:bg-white/25 text-slate-200"
                  }`}
                >
                  {reducedMotion ? "Đã tắt chuyển động" : "Giảm chuyển động (A11y)"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Technical Footnote */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>Tempo nhịp điệu: <strong className="text-foreground">{configTempo}</strong> • Thời gian nghỉ: <strong className="text-foreground">{configRest}s</strong></span>
            <span>Nguồn hình ảnh: <span className="font-semibold text-foreground">{customMediaUrl ? "Tùy biến trực tuyến" : "Gym Visual / Free Exercise DB"}</span></span>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL CONFIGURATION */}
      {activeTab === "CONFIG" && (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-5">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Cấu Hình Cá Nhân Hóa Khối Lượng Tập
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cài đặt số hiệp, rep mục tiêu, nhịp tempo và ghi chú kỹ thuật cho riêng bài tập <strong>{exerciseName}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Target Sets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Số Hiệp Mục Tiêu (Sets)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={configSets}
                onChange={(e) => setConfigSets(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Khuyến nghị cho thâm hụt: 3 - 4 hiệp</span>
            </div>

            {/* Target Reps */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Số Lần Lặp / Hiệp (Reps)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={configReps}
                onChange={(e) => setConfigReps(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Ví dụ: 12-15 reps (chống đẩy) hoặc 45-60s (plank)</span>
            </div>

            {/* Tempo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nhịp Chuyển Động (Tempo)</label>
              <input
                type="text"
                value={configTempo}
                onChange={(e) => setConfigTempo(e.target.value)}
                placeholder="2-0-1 hoặc 3-1-1"
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Quy ước: Hạ (s) - Giữ (s) - Đẩy (s)</span>
            </div>

            {/* Rest Seconds */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Thời Gian Nghỉ Giữa Hiệp (Giây)</label>
              <input
                type="number"
                min="15"
                max="300"
                step="5"
                value={configRest}
                onChange={(e) => setConfigRest(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Chuẩn: 60s - 90s</span>
            </div>

            {/* Target RPE */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Thang Đo Nỗ Lực (RPE 1-10)</label>
              <input
                type="number"
                min="5"
                max="10"
                value={configRpe}
                onChange={(e) => setConfigRpe(parseInt(e.target.value) || 8)}
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">RPE 8 = Dừng lại khi còn dư 2 reps trong sức</span>
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-foreground">Ghi Chú Form / Cảm Nhận Cá Nhân</label>
              <input
                type="text"
                value={configNotes}
                onChange={(e) => setConfigNotes(e.target.value)}
                placeholder="Ví dụ: Giữ khuỷu tay 45 độ, không khóa khớp gối khi lên đỉnh..."
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleSaveConfig()}
              disabled={isSavingConfig}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSavingConfig ? "Đang lưu cấu hình..." : "Lưu Cấu Hình Bài Tập"}
            </button>

            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Đã cập nhật cấu hình thành công!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM ONLINE MEDIA SOURCE */}
      {activeTab === "CUSTOM_SOURCE" && (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Tùy Chọn Link Ảnh & GIF Động Từ Mạng
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bạn có thể lấy bất kỳ đường dẫn ảnh động (`.gif`, `.webp`, `.jpg`, `.png`) nào từ Google, Giphy, Wikimedia hoặc các trang fitness để làm hình minh họa cho bài tập này.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-primary" />
                Dán URL Ảnh Động / GIF Trên Mạng:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={previewMediaUrl}
                  onChange={(e) => {
                    setPreviewMediaUrl(e.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://example.com/exercise-animation.gif"
                  className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  disabled={!previewMediaUrl.trim() || isSavingConfig}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Lưu & Áp Dụng
                </button>
                {customMediaUrl && (
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-accent text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    title="Khôi phục lại ảnh 3D mặc định"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Khôi phục gốc
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Box */}
            {previewMediaUrl && (
              <div className="p-3 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Xem trước ảnh động:</span>
                  <a
                    href={previewMediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Mở link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative aspect-[16/9] max-w-sm rounded-xl overflow-hidden bg-slate-950 border border-border flex items-center justify-center">
                  <img
                    src={previewMediaUrl}
                    alt="Xem trước hình từ mạng"
                    className="w-full h-full object-contain p-1"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            )}

            {/* Predefined Online Sources Suggestions */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-xs space-y-2">
              <span className="font-semibold text-foreground block">Gợi ý nguồn ảnh động tập luyện miễn phí chất lượng cao:</span>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                <li><strong>Gym Visual / Free Exercise DB:</strong> Kho hơn 1,300 bài tập 3D giải phẫu chuẩn y khoa đã được tích hợp sẵn.</li>
                <li><strong>Wikimedia Commons:</strong> Các ảnh động bài tập thể hình giấy phép CC miễn phí.</li>
                <li><strong>Giphy / Tenor:</strong> Dán đường dẫn trực tiếp `.gif` của các huấn luyện viên thể hình mẫu.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
