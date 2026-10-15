"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  Target,
  EyeOff,
  ShieldCheck,
  Activity,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
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
  const [activeTab, setActiveTab] = useState<"MOTION" | "CONFIG">("MOTION");

  // Config form state
  const [configSets, setConfigSets] = useState(initialConfig?.targetSets || 3);
  const [configReps, setConfigReps] = useState(initialConfig?.targetReps || 12);
  const [configTempo, setConfigTempo] = useState(initialConfig?.tempo || "2-0-1");
  const [configRest, setConfigRest] = useState(initialConfig?.restSeconds || 60);
  const [configRpe, setConfigRpe] = useState(initialConfig?.targetRpe || 8);
  const [configNotes, setConfigNotes] = useState(initialConfig?.notes || "");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  async function handleSaveConfig() {
    setIsSavingConfig(true);
    setSaveSuccess(false);
    try {
      await saveExerciseConfigAction(exerciseSlug, {
        targetSets: configSets,
        targetReps: configReps,
        tempo: configTempo,
        restSeconds: configRest,
        targetRpe: configRpe,
        notes: configNotes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingConfig(false);
    }
  }

  // Render high-definition athletic anatomical figure with muscle activation heatmaps
  function renderAthleticAnatomyFigure() {
    const isDown = phase === "ECCENTRIC";
    const transitionStyle = { transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)` };

    switch (exerciseSlug) {
      case "push-up":
      case "diamond-push-up": {
        const isDiamond = exerciseSlug === "diamond-push-up";
        return (
          <g>
            {/* Perspective Gym Floor & High-Density Rubber Mat */}
            <polygon points="120,430 680,430 640,360 160,360" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <polygon points="160,420 640,420 610,370 190,370" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Mat border neon runner */}
            <line x1="160" y1="420" x2="640" y2="420" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

            {/* Hand Contact Pads */}
            <ellipse cx={isDiamond ? "460" : "480"} cy="390" rx="16" ry="7" fill="#0284c7" />
            <ellipse cx={isDiamond ? "460" : "480"} cy="390" rx="10" ry="4" fill="#38bdf8" />

            {/* Feet / Athletic Sneakers Contact */}
            <path d="M 195 385 L 225 385 L 220 375 L 200 375 Z" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <ellipse cx="205" cy="385" rx="12" ry="5" fill="#f87171" />

            {/* Rigid Athlete Body (Torso, Hips, Legs) */}
            <g
              style={{
                transform: isDown ? "translateY(55px) rotate(-4.5deg)" : "translateY(0px) rotate(0deg)",
                transformOrigin: "205px 380px",
                ...transitionStyle,
              }}
            >
              {/* Neutral Spine Laser Guide */}
              <line x1="205" y1="375" x2="520" y2="255" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
              <text x="260" y="340" fill="#34d399" fontSize="10" fontWeight="bold">TƯ THẾ PLANK THẲNG LƯNG</text>

              {/* Legs: Muscular Quadriceps & Calves */}
              <path
                d="M 205 380 Q 260 365 310 345 Q 360 325 390 310 L 385 295 Q 345 310 300 330 Q 250 350 205 370 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              {/* Athletic Shorts */}
              <path
                d="M 370 320 L 435 290 L 425 265 L 360 295 Z"
                fill="#0f766e"
                stroke="#14b8a6"
                strokeWidth="2"
              />

              {/* Muscular Torso: Broad Chest & Six-pack Core */}
              <path
                d="M 420 270 Q 460 250 495 240 L 485 210 Q 445 225 410 245 Z"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
              />
              {/* Abdominal 6-pack definition */}
              <line x1="430" y1="262" x2="445" y2="252" stroke="#475569" strokeWidth="2" />
              <line x1="445" y1="252" x2="460" y2="242" stroke="#475569" strokeWidth="2" />

              {/* PECTORALIS MAJOR MUSCLE HEATMAP ACTIVATION */}
              <ellipse
                cx="470"
                cy="235"
                rx={isDown ? "30" : "22"}
                ry={isDown ? "18" : "14"}
                fill={isDown ? "#f59e0b" : "#38bdf8"}
                opacity={isDown ? 0.85 : 0.45}
                className="transition-all duration-300"
              />
              <text
                x="470"
                y="240"
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                textAnchor="middle"
                opacity="0.9"
              >
                {isDiamond ? "TRICEPS" : "CHEST"}
              </text>

              {/* Muscular Athletic Head with Headband */}
              <circle cx="530" cy="225" r="20" fill="#e2e8f0" />
              {/* Hair/Headband */}
              <path d="M 515 220 Q 535 210 545 225 L 540 215 Q 525 210 515 220 Z" fill="#0f172a" />
              <rect x="515" y="222" width="28" height="5" rx="2" fill="#0ea5e9" />
            </g>

            {/* Athletic Articulated Arm (Shoulder, Bicep/Tricep, Forearm) */}
            <g style={transitionStyle}>
              {/* Shoulder Deltoid Cap */}
              <circle
                cx={isDown ? "480" : "490"}
                cy={isDown ? "295" : "240"}
                r="14"
                fill="#475569"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Biceps & Triceps Curve */}
              <path
                d={
                  isDown
                    ? "M 480 295 Q 450 325 435 345 L 450 355 Q 470 335 490 305 Z"
                    : "M 490 240 Q 485 295 480 345 L 495 345 Q 500 295 505 240 Z"
                }
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
                style={transitionStyle}
              />

              {/* Elbow joint biomechanical angle marker */}
              <circle
                cx={isDown ? "440" : "485"}
                cy={isDown ? "345" : "330"}
                r="6"
                fill={isDown ? "#f59e0b" : "#38bdf8"}
              />
              {isDown && (
                <text x="405" y="348" fill="#f59e0b" fontSize="11" fontWeight="bold">45°</text>
              )}

              {/* Forearm down to Hand Pad */}
              <path
                d={
                  isDown
                    ? "M 440 345 L 475 390 L 485 385 L 450 340 Z"
                    : "M 485 330 L 485 390 L 495 390 L 495 330 Z"
                }
                fill="#475569"
                stroke="#64748b"
                strokeWidth="2"
                style={transitionStyle}
              />
            </g>
          </g>
        );
      }

      case "squat": {
        return (
          <g>
            {/* Isometric Gym Platform */}
            <polygon points="180,440 620,440 580,380 220,380" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <polygon points="210,430 590,430 560,390 240,390" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <line x1="210" y1="430" x2="590" y2="430" stroke="#10b981" strokeWidth="2" opacity="0.6" />

            {/* Athletic Cross-training Shoes */}
            <ellipse cx="360" cy="415" rx="20" ry="7" fill="#ef4444" />
            <ellipse cx="440" cy="415" rx="20" ry="7" fill="#ef4444" />
            <rect x="350" y="410" width="20" height="4" rx="2" fill="#ffffff" />
            <rect x="430" y="410" width="20" height="4" rx="2" fill="#ffffff" />

            {/* Squatting Athletic Figure */}
            <g
              style={{
                transform: isDown ? "translateY(70px)" : "translateY(0px)",
                ...transitionStyle,
              }}
            >
              {/* Torso & Athletic Tank Top */}
              <path
                d={
                  isDown
                    ? "M 380 260 Q 365 200 375 160 L 420 160 Q 425 200 415 260 Z"
                    : "M 385 220 Q 380 160 385 110 L 430 110 Q 435 160 425 220 Z"
                }
                fill="#0284c7"
                stroke="#38bdf8"
                strokeWidth="2"
                style={transitionStyle}
              />

              {/* Head with athletic headband */}
              <circle cx={isDown ? "395" : "405"} cy={isDown ? "130" : "80"} r="22" fill="#f1f5f9" style={transitionStyle} />
              <rect x={isDown ? "382" : "392"} y={isDown ? "124" : "74"} width="26" height="6" rx="2" fill="#f59e0b" style={transitionStyle} />

              {/* Counter-balance Arms Extended */}
              <polyline
                points={
                  isDown
                    ? "405,170 460,170 510,165"
                    : "410,120 440,160 430,210"
                }
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={transitionStyle}
              />

              {/* Powerful Athletic Shorts & Glutes */}
              <path
                d={
                  isDown
                    ? "M 360 280 L 430 280 L 420 320 L 340 310 Z"
                    : "M 375 220 L 435 220 L 425 270 L 380 270 Z"
                }
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                style={transitionStyle}
              />

              {/* QUADRICEPS MUSCLE ACTIVATION HEATMAP */}
              <ellipse
                cx={isDown ? "410" : "405"}
                cy={isDown ? "320" : "285"}
                rx={isDown ? "32" : "24"}
                ry={isDown ? "20" : "16"}
                fill={isDown ? "#f59e0b" : "#10b981"}
                opacity={isDown ? 0.9 : 0.5}
                className="transition-all duration-300"
              />
              <text
                x={isDown ? "410" : "405"}
                y={isDown ? "325" : "290"}
                fill="#ffffff"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
              >
                QUADS 90°
              </text>
            </g>

            {/* Shins & Knee Joint Guide */}
            <line x1="365" y1={isDown ? "345" : "300"} x2="360" y2="415" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" style={transitionStyle} />
            <line x1="435" y1={isDown ? "345" : "300"} x2="440" y2="415" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" style={transitionStyle} />
          </g>
        );
      }

      case "plank": {
        return (
          <g>
            {/* Gym Mat */}
            <polygon points="120,420 680,420 640,360 160,360" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <line x1="160" y1="410" x2="640" y2="410" stroke="#06b6d4" strokeWidth="2" opacity="0.6" />

            {/* Forearm elbows contact */}
            <rect x="470" y="380" width="30" height="15" rx="5" fill="#0284c7" />
            <ellipse cx="200" cy="390" rx="14" ry="6" fill="#ef4444" />

            {/* Rigid Athlete Spine Guideline */}
            <line x1="200" y1="385" x2="510" y2="330" stroke="#10b981" strokeWidth="3" strokeDasharray="8 6" />

            {/* Body */}
            <path
              d="M 200 385 Q 320 365 420 340 L 490 330 L 485 305 Q 400 320 300 345 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Compression Shorts */}
            <path d="M 330 360 L 390 345 L 385 320 L 320 335 Z" fill="#0f766e" />

            {/* ABDOMINAL CORE HEATMAP BELT */}
            <ellipse
              cx="400"
              cy="345"
              rx="38"
              ry="18"
              fill="#06b6d4"
              opacity={isDown ? 0.9 : 0.6}
              className="animate-pulse"
            />
            <text x="400" y="350" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              GỒNG CHẶT CORE
            </text>

            {/* Head */}
            <circle cx="530" cy="315" r="18" fill="#e2e8f0" />
            <rect x="520" y="312" width="20" height="5" rx="2" fill="#0ea5e9" />
          </g>
        );
      }

      default: {
        // Dynamic Athletic Silhouette for other exercises (Lunge, Crunch, Dead Bug, Bridge, Row, Climber, Football)
        return (
          <g>
            {/* Professional Workout Mat */}
            <polygon points="140,430 660,430 620,360 180,360" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <line x1="180" y1="420" x2="620" y2="420" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

            {/* Dynamic Articulated Figure */}
            <g
              style={{
                transform: isDown ? "translateY(25px) scale(0.98)" : "translateY(0px) scale(1)",
                transformOrigin: "400px 360px",
                ...transitionStyle,
              }}
            >
              {/* Torso */}
              <ellipse cx="400" cy="270" rx="35" ry="50" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              {/* Target Activation Glow */}
              <ellipse
                cx="400"
                cy="270"
                rx="28"
                ry="38"
                fill={isDown ? "#f59e0b" : "#10b981"}
                opacity={0.8}
                className="animate-pulse"
              />
              <text x="400" y="275" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {exerciseName.toUpperCase().slice(0, 16)}
              </text>

              {/* Head with headband */}
              <circle cx="400" cy="190" r="22" fill="#e2e8f0" />
              <rect x="388" y="185" width="24" height="6" rx="2" fill="#38bdf8" />

              {/* Limbs in active athletic stance */}
              <line x1="370" y1="250" x2="310" y2="300" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
              <line x1="430" y1="250" x2="490" y2="300" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
              <line x1="380" y1="320" x2="350" y2="410" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
              <line x1="420" y1="320" x2="450" y2="410" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
            </g>
          </g>
        );
      }
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-lg space-y-0">
      {/* Top Bar with Mode Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-secondary/50 border-b border-border gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("MOTION")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "MOTION"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Hoạt Ảnh Biomechanical 60 FPS
          </button>
          <button
            onClick={() => setActiveTab("CONFIG")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "CONFIG"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Cấu Hình Hiệp & Rep Cá Nhân
          </button>
        </div>

        {activeTab === "MOTION" && (
          <div className="flex items-center gap-2">
            {/* Speed Pills */}
            <div className="flex items-center rounded-lg bg-background border border-border p-0.5 text-xs font-semibold">
              {[0.75, 1, 1.25].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-background border border-border hover:bg-accent text-foreground transition-colors"
              title={isPlaying ? "Tạm dừng" : "Tiếp tục"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: 60FPS MOTION SIMULATOR */}
      {activeTab === "MOTION" && (
        <div>
          {/* Main Visual SVG Canvas */}
          <div className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 480" className="w-full h-full select-none">
              <defs>
                <radialGradient id="neonMatGlow" cx="50%" cy="80%" r="60%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Studio Lighting Glow */}
              <rect width="800" height="480" fill="#020617" />
              <rect width="800" height="480" fill="url(#neonMatGlow)" />

              {/* Tech Perspective Grid */}
              <g opacity="0.08" stroke="#94a3b8" strokeWidth="1">
                {[...Array(9)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="480" />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 80} x2="800" y2={i * 80} />
                ))}
              </g>

              {/* Render High-Definition Athletic Anatomy Figure */}
              {renderAthleticAnatomyFigure()}
            </svg>

            {/* Live Tactical Overlay HUD */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-sky-400 border border-sky-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                60 FPS ANATOMY SIMULATOR
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-700/60 w-fit">
                Pha: <strong className={phase === "ECCENTRIC" ? "text-amber-400" : "text-emerald-400"}>
                  {phase === "ECCENTRIC" ? "ECCENTRIC (Hạ có kiểm soát)" : "CONCENTRIC (Bộc phát lực)"}
                </strong>
              </span>
            </div>

            {/* Rep Counter & Breathing Bubble Indicator (Top Right) */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              {/* Breathing Bubble */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-700 ${
                    phase === "ECCENTRIC"
                      ? "scale-125 bg-sky-400 shadow-lg shadow-sky-400/50"
                      : "scale-75 bg-emerald-400 shadow-md shadow-emerald-400/50"
                  }`}
                />
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Nhịp thở</span>
                  <span className="block text-xs font-extrabold text-slate-100">
                    {phase === "ECCENTRIC" ? "HÍT VÀO (GỒNG)" : "THỞ RA (ĐẨY)"}
                  </span>
                </div>
              </div>

              {/* Rep Count Pill */}
              <div className="px-4 py-1.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-lg flex items-center gap-1.5">
                <span>REP</span>
                <span className="text-lg">{repCount}</span>
                <span className="text-xs opacity-75">/{configReps}</span>
              </div>
            </div>
          </div>

          {/* Biomechanical Cues Strip */}
          <div className="p-4 bg-secondary/30 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground block text-[11px]">Tempo chuẩn:</span>
                <strong className="text-foreground">{configTempo}</strong>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-muted-foreground block text-[11px]">Khuyến nghị:</span>
                <strong className="text-foreground">{configSets} hiệp × {configReps} lần</strong>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-muted-foreground block text-[11px]">Nghỉ giữa hiệp:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{configRest} giây</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("CONFIG")}
              className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" /> Điều chỉnh cấu hình bài tập này
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISE CONFIGURATOR */}
      {activeTab === "CONFIG" && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Cấu Hình Cá Nhân Bài Tập: {exerciseName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tùy chỉnh số hiệp, số rep, nhịp tempo và thời gian nghỉ phù hợp với thể trạng cá nhân (lưu bền vững).
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Đã lưu cấu hình bài tập vào kế hoạch luyện tập của bạn thành công!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sets & Reps */}
            <div className="space-y-4 p-4 rounded-2xl bg-secondary/30 border border-border">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Số hiệp tập (Sets): <span className="text-primary font-extrabold text-sm">{configSets} hiệp</span>
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConfigSets(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        configSets === s
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {s} hiệp
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Số lần mỗi hiệp (Reps): <span className="text-primary font-extrabold text-sm">{configReps} lần</span>
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {[8, 10, 12, 15, 20, 25].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setConfigReps(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        configReps === r
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {r} reps
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tempo & Rest */}
            <div className="space-y-4 p-4 rounded-2xl bg-secondary/30 border border-border">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Nhịp độ chuyển động (Tempo):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "2-0-1", label: "2-0-1 (Bùng nổ)" },
                    { val: "2-1-1", label: "2-1-1 (Chuẩn)" },
                    { val: "3-1-1", label: "3-1-1 (Chậm giữ cơ)" },
                    { val: "Isometric", label: "Giữ tĩnh" },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setConfigTempo(t.val)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                        configTempo === t.val
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Thời gian nghỉ giữa hiệp (Rest timer):
                </label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setConfigRest(sec)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        configRest === sec
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Ghi chú cá nhân (Cảm nhận khớp, độ căng cơ):
            </label>
            <input
              type="text"
              value={configNotes}
              onChange={(e) => setConfigNotes(e.target.value)}
              placeholder="Ví dụ: Giữ khuỷu tay 45 độ, không khóa khớp vai..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setActiveTab("MOTION")}
              className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
            >
              Xem hoạt ảnh
            </button>
            <button
              type="button"
              disabled={isSavingConfig}
              onClick={handleSaveConfig}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-opacity shadow-sm flex items-center gap-1.5"
            >
              {isSavingConfig ? "Đang lưu..." : "Lưu Cấu Hình Bài Tập"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
