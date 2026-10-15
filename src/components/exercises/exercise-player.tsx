"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, EyeOff, ShieldCheck } from "lucide-react";

interface ExercisePlayerProps {
  name: string;
  animationUrl: string;
  posterUrl: string;
}

export function ExercisePlayer({ name, animationUrl, posterUrl }: ExercisePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div className="space-y-3">
      {/* 16:9 Viewport */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border bg-slate-950 shadow-md">
        <img
          src={reducedMotion || !isPlaying ? posterUrl : animationUrl}
          alt={`Minh họa kỹ thuật ${name}`}
          className="w-full h-full object-cover"
        />

        {/* Video Overlays */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md border border-white/20 text-white">
            {reducedMotion ? "Poster Tĩnh (Reduced Motion)" : isPlaying ? "Loop Animation • Muted" : "Tạm dừng"}
          </span>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title={isPlaying ? "Tạm dừng" : "Tiếp tục phát"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 50);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-300 hidden sm:inline-block">
              {isPlaying ? "Tự động lặp lại liên tục" : "Đang dừng"}
            </span>
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
            {reducedMotion ? "Đã tắt chuyển động" : "Giảm chuyển động (A11y)"}
          </button>
        </div>
      </div>
    </div>
  );
}
