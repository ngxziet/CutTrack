"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Wind, Target, EyeOff, ShieldCheck, Activity } from "lucide-react";

interface BiomechanicalMotionEngineProps {
  exerciseSlug: string;
  exerciseName: string;
  posterUrl: string;
  animationUrl: string;
}

export function BiomechanicalMotionEngine({
  exerciseSlug,
  exerciseName,
  posterUrl,
  animationUrl,
}: BiomechanicalMotionEngineProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState<"ECCENTRIC" | "CONCENTRIC">("ECCENTRIC");
  const [repCount, setRepCount] = useState(1);
  const [viewMode, setViewMode] = useState<"SIMULATOR" | "SVG_OBJECT">("SIMULATOR");

  // Cycle phase every 2.4s (adjusted by speed)
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const cycleTime = 2400 / speed;
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev === "ECCENTRIC") {
          return "CONCENTRIC";
        } else {
          setRepCount((r) => (r >= 15 ? 1 : r + 1));
          return "ECCENTRIC";
        }
      });
    }, cycleTime / 2);

    return () => clearInterval(interval);
  }, [isPlaying, speed, reducedMotion]);

  // Render specific animated SVG biomechanical figure based on exerciseSlug
  function renderAnimatedFigure() {
    const isDown = phase === "ECCENTRIC";

    switch (exerciseSlug) {
      case "push-up":
      case "diamond-push-up":
        return (
          <g className="transition-all duration-700 ease-in-out">
            {/* Floor */}
            <line x1="120" y1="360" x2="680" y2="360" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <line x1="150" y1="360" x2="650" y2="360" stroke="#64748b" strokeWidth="2" strokeDasharray="8 8" />

            {/* Feet anchor */}
            <circle cx="200" cy="354" r="8" fill="#64748b" />
            <circle cx="200" cy="354" r="4" fill="#38bdf8" />

            {/* Hands anchor */}
            <ellipse cx="480" cy="356" rx="14" ry="6" fill="#0284c7" />

            {/* Torso & Legs line */}
            <g
              style={{
                transform: isDown ? "translateY(55px) rotate(-4deg)" : "translateY(0px) rotate(0deg)",
                transformOrigin: "200px 354px",
                transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              {/* Spine / Body bar */}
              <line x1="205" y1="350" x2="490" y2="250" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
              <line x1="205" y1="350" x2="490" y2="250" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

              {/* Muscle contraction glow on chest */}
              <ellipse
                cx="460"
                cy="265"
                rx="26"
                ry="16"
                fill={isDown ? "#f59e0b" : "#38bdf8"}
                opacity={isDown ? 0.8 : 0.4}
                className="animate-pulse"
              />

              {/* Head */}
              <circle cx="530" cy="235" r="20" fill="#f8fafc" />
              <circle cx="530" cy="235" r="14" fill="#0f172a" />
            </g>

            {/* Arms with elbow bending */}
            <polyline
              points={
                isDown
                  ? "490,305 450,335 480,356" // Bent elbow
                  : "490,250 482,305 480,356" // Extended arm
              }
              fill="none"
              stroke="#f8fafc"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)` }}
            />
            <polyline
              points={
                isDown
                  ? "490,305 450,335 480,356"
                  : "490,250 482,305 480,356"
              }
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)` }}
            />
          </g>
        );

      case "squat":
        return (
          <g className="transition-all duration-700 ease-in-out">
            {/* Ground */}
            <line x1="200" y1="420" x2="600" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

            {/* Feet */}
            <ellipse cx="360" cy="415" rx="16" ry="6" fill="#64748b" />
            <ellipse cx="440" cy="415" rx="16" ry="6" fill="#64748b" />

            {/* Squatting Body */}
            <g
              style={{
                transform: isDown ? "translateY(75px)" : "translateY(0px)",
                transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              {/* Torso */}
              <line
                x1="400"
                y1={isDown ? "290" : "240"}
                x2={isDown ? "385" : "395"}
                y2={isDown ? "200" : "150"}
                stroke="#f8fafc"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1={isDown ? "290" : "240"}
                x2={isDown ? "385" : "395"}
                y2={isDown ? "200" : "150"}
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Head */}
              <circle cx={isDown ? "380" : "395"} cy={isDown ? "170" : "120"} r="22" fill="#f8fafc" />
              <circle cx={isDown ? "380" : "395"} cy={isDown ? "170" : "120"} r="16" fill="#0f172a" />

              {/* Quadriceps / Glute glow */}
              <ellipse
                cx="400"
                cy={isDown ? "300" : "260"}
                rx="28"
                ry="18"
                fill={isDown ? "#f59e0b" : "#10b981"}
                opacity={0.7}
                className="animate-pulse"
              />

              {/* Arms counter-balance forward */}
              <polyline
                points={
                  isDown
                    ? "385,210 440,205 480,205"
                    : "395,160 410,210 400,260"
                }
                fill="none"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </g>

            {/* Legs bending */}
            {/* Left Leg */}
            <polyline
              points={
                isDown
                  ? "360,415 340,345 390,290" // Deep knee flexion
                  : "360,415 375,325 395,240" // Standing tall
              }
              fill="none"
              stroke="#f8fafc"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)` }}
            />
            {/* Right Leg */}
            <polyline
              points={
                isDown
                  ? "440,415 460,345 410,290"
                  : "440,415 425,325 405,240"
              }
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)` }}
            />
          </g>
        );

      case "plank":
        return (
          <g className="transition-all duration-700 ease-in-out">
            <line x1="120" y1="360" x2="680" y2="360" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <circle cx="200" cy="354" r="8" fill="#64748b" />
            <ellipse cx="480" cy="356" rx="16" ry="6" fill="#0284c7" />

            {/* Forearm on ground */}
            <line x1="440" y1="356" x2="490" y2="356" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
            <line x1="440" y1="356" x2="455" y2="300" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />

            {/* Rigid Plank Body pulsating with core tension */}
            <g
              style={{
                transform: isDown ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0px)",
                transformOrigin: "350px 300px",
                transition: `all ${1.2 / speed}s ease-in-out`,
              }}
            >
              <line x1="205" y1="350" x2="460" y2="300" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
              <line x1="205" y1="350" x2="460" y2="300" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />

              {/* Core & Abdominal tension glow */}
              <ellipse
                cx="330"
                cy="325"
                rx="35"
                ry="18"
                fill={isDown ? "#10b981" : "#38bdf8"}
                opacity={isDown ? 0.9 : 0.5}
                className="animate-pulse"
              />

              <circle cx="500" cy="285" r="18" fill="#f8fafc" />
              <circle cx="500" cy="285" r="13" fill="#0f172a" />
            </g>
          </g>
        );

      default:
        // Generic articulated lifting / rowing / lunging figure
        return (
          <g className="transition-all duration-700 ease-in-out">
            <line x1="150" y1="400" x2="650" y2="400" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <circle cx="350" cy="395" r="8" fill="#64748b" />
            <circle cx="450" cy="395" r="8" fill="#64748b" />

            {/* Dynamic torso */}
            <g
              style={{
                transform: isDown ? "translateY(40px) scale(0.97)" : "translateY(0px) scale(1)",
                transformOrigin: "400px 380px",
                transition: `all ${1.2 / speed}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              <line x1="400" y1="350" x2="400" y2="210" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
              <line x1="400" y1="350" x2="400" y2="210" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="400" cy="180" r="20" fill="#f8fafc" />
              <circle cx="400" cy="180" r="14" fill="#0f172a" />

              {/* Highlight Target */}
              <ellipse
                cx="400"
                cy="260"
                rx="24"
                ry="16"
                fill={isDown ? "#f59e0b" : "#38bdf8"}
                opacity={0.8}
                className="animate-pulse"
              />

              {/* Arms moving up and down */}
              <polyline
                points={isDown ? "400,220 440,270 470,310" : "400,220 450,230 490,240"}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </g>

            {/* Legs */}
            <line x1="350" y1="395" x2="380" y2="330" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
            <line x1="450" y1="395" x2="420" y2="330" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
          </g>
        );
    }
  }

  return (
    <div className="space-y-3">
      {/* 16:9 Interactive Screen */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border bg-slate-950 shadow-xl">
        {/* Toggle Mode: Real-time Biomechanical Vector Simulator OR SVG Object */}
        {viewMode === "SIMULATOR" && !reducedMotion ? (
          <svg viewBox="0 0 800 450" className="w-full h-full select-none">
            {/* Dark Sports-tech Background */}
            <defs>
              <linearGradient id="simBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <radialGradient id="simGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="450" fill="url(#simBg)" />
            <rect width="800" height="450" fill="url(#simGlow)" />

            {/* Subtle Grid */}
            <g opacity="0.08" stroke="#94a3b8" strokeWidth="1">
              {[...Array(20)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="450" />
              ))}
              {[...Array(12)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
              ))}
            </g>

            {/* Render Biomechanical Moving Figure */}
            {renderAnimatedFigure()}

            {/* Live Movement Angle & Range Overlay (Top Center) */}
            <g transform="translate(300, 30)">
              <rect width="200" height="32" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="5" fill={phase === "ECCENTRIC" ? "#f59e0b" : "#38bdf8"} className="animate-pulse" />
              <text x="30" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="11" fill="#f8fafc">
                {phase === "ECCENTRIC" ? "HẠ NGƯỜI (ECCENTRIC)" : "ĐẨY LÊN (CONCENTRIC)"}
              </text>
            </g>

            {/* Live Breathing Bubble (Bottom Left) */}
            <g transform="translate(40, 360)">
              <rect width="250" height="46" rx="23" fill="#0f172a" stroke="#334155" strokeWidth="1.5" opacity="0.95" />
              <circle
                cx="24"
                cy="23"
                r={phase === "ECCENTRIC" ? 14 : 8}
                fill="#38bdf8"
                opacity={0.8}
                style={{ transition: `all ${1.2 / speed}s ease-in-out` }}
              />
              <text x="46" y="27" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="12" fill="#f8fafc">
                {phase === "ECCENTRIC" ? "Hít sâu bằng mũi (2s)" : "Thở mạnh bằng miệng (1s)"}
              </text>
            </g>

            {/* Live Rep Counter (Bottom Right) */}
            <g transform="translate(620, 360)">
              <rect width="140" height="46" rx="23" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="24" y="28" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="15" fill="#34d399">
                LẦN {repCount}
              </text>
              <text x="80" y="28" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="11" fill="#94a3b8">
                / 15 cái
              </text>
            </g>
          </svg>
        ) : (
          /* High-resolution SVG Object fallback */
          <object
            data={reducedMotion ? posterUrl : animationUrl}
            type="image/svg+xml"
            className="w-full h-full pointer-events-none"
            title={`Bản vẽ chuyển động ${exerciseName}`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {reducedMotion ? "Poster Tĩnh" : isPlaying ? `Đang mô phỏng 60fps • Tốc độ ${speed}x` : "Tạm dừng"}
          </span>
        </div>

        {/* View mode toggle button (Top Right) */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setViewMode(viewMode === "SIMULATOR" ? "SVG_OBJECT" : "SIMULATOR")}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-colors"
          >
            {viewMode === "SIMULATOR" ? "Xem Bản Vẽ Kỹ Thuật" : "Xem Mô Phỏng Chuyển Động Khớp"}
          </button>
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-white text-xs">
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
                setRepCount(1);
                setPhase("ECCENTRIC");
              }}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
              title="Đếm lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Control */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-xl">
              <span className="text-[10px] text-slate-300">Tốc độ:</span>
              <button
                onClick={() => setSpeed(0.75)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${speed === 0.75 ? "bg-primary text-primary-foreground font-bold" : "text-slate-300"}`}
              >
                0.75x
              </button>
              <button
                onClick={() => setSpeed(1)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${speed === 1 ? "bg-primary text-primary-foreground font-bold" : "text-slate-300"}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(1.25)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${speed === 1.25 ? "bg-primary text-primary-foreground font-bold" : "text-slate-300"}`}
              >
                1.25x
              </button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
              reducedMotion
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            {reducedMotion ? "Đã tắt chuyển động" : "Tắt chuyển động (A11y)"}
          </button>
        </div>
      </div>
    </div>
  );
}
