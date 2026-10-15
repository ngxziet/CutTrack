"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowRight, Activity, Sliders, CheckCircle2, Clock, Zap } from "lucide-react";
import { ExerciseConfig } from "@/lib/store/cuttrack-store";

interface ExerciseItem {
  slug: string;
  name: string;
  target: string;
  difficulty: string;
  reps: string;
  posterUrl: string;
  animationUrl: string;
  description: string;
}

interface ExercisesCatalogViewProps {
  exercises: ExerciseItem[];
  userConfigs: Record<string, ExerciseConfig>;
}

export function ExercisesCatalogView({ exercises, userConfigs }: ExercisesCatalogViewProps) {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "CONFIG">("CATALOG");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          Thư Viện Bài Tập & Cấu Hình Cá Nhân
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Minh họa giải phẫu cơ bắp động 60 FPS, hướng dẫn chuẩn kỹ thuật và bảng cấu hình hiệp/rep tùy chỉnh.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <button
          onClick={() => setActiveTab("CATALOG")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "CATALOG"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          Thư Viện Chuyển Động (11 Bài)
        </button>
        <button
          onClick={() => setActiveTab("CONFIG")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "CONFIG"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Bảng Cấu Hình Hiệp & Rep Của Bạn
        </button>
      </div>

      {/* TAB 1: CATALOG OF EXERCISES */}
      {activeTab === "CATALOG" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exercises.map((exercise) => {
            const config = userConfigs[exercise.slug];

            return (
              <div
                key={exercise.slug}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col"
              >
                {/* 16:9 Image Preview with active animation */}
                <div className="relative aspect-[16/9] w-full bg-slate-950/90 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={exercise.animationUrl}
                    alt={exercise.name}
                    className="w-full h-full object-contain scale-105 group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                      <Activity className="w-2.5 h-2.5 animate-pulse" /> 3D Motion
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-background/90 backdrop-blur-md border border-border text-foreground">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      Cơ đích: {exercise.target}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>

                  {/* Configured sets pill */}
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      Mục tiêu: <strong className="text-foreground">{config ? `${config.targetSets} hiệp × ${config.targetReps} reps` : exercise.reps}</strong>
                    </span>

                    <Link
                      href={`/exercises/${exercise.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                    >
                      Chi tiết & Chỉnh sửa <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PERSONAL CONFIGURATION TABLE */}
      {activeTab === "CONFIG" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Cấu Hình Lịch Tập Cá Nhân Hóa</h2>
              <p className="text-xs text-muted-foreground">
                Tất cả các thông số hiệp, rep, tempo và thời gian nghỉ đã được lưu trong hồ sơ của bạn.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              11/11 bài tập đã cấu hình
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Bài Tập</th>
                    <th className="py-3 px-4">Nhóm Cơ</th>
                    <th className="py-3 px-4">Số Hiệp (Sets)</th>
                    <th className="py-3 px-4">Số Reps</th>
                    <th className="py-3 px-4">Tempo</th>
                    <th className="py-3 px-4">Nghỉ (Rest)</th>
                    <th className="py-3 px-4">RPE</th>
                    <th className="py-3 px-4 text-right">Tùy Chỉnh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exercises.map((exercise) => {
                    const cfg = userConfigs[exercise.slug];

                    return (
                      <tr key={exercise.slug} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground">
                          {exercise.name}
                        </td>
                        <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                          {exercise.target}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {cfg?.targetSets || 3} hiệp
                        </td>
                        <td className="py-3 px-4 font-semibold text-primary">
                          {cfg?.targetReps || 12} reps
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {cfg?.tempo || "2-1-1"}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {cfg?.restSeconds || 60}s
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary border border-border">
                            RPE {cfg?.targetRpe || 8}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/exercises/${exercise.slug}`}
                            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all inline-block"
                          >
                            Đổi thông số
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
