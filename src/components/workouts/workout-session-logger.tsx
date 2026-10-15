"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Timer, Plus, Trash2, CheckCircle2, Play, Pause, RotateCcw } from "lucide-react";
import { logWorkoutAction } from "@/lib/server-actions";

export function WorkoutSessionLogger() {
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Workout state
  const [title, setTitle] = useState("Buổi tập sức mạnh thân trên & Bụng");
  const [isSoccer, setIsSoccer] = useState(false);
  const [duration, setDuration] = useState(40);
  const [sets, setSets] = useState([
    { id: "1", exercise: "Chống đẩy tiêu chuẩn", reps: 14, rpe: 7 },
    { id: "2", exercise: "Chống đẩy tiêu chuẩn", reps: 12, rpe: 8 },
    { id: "3", exercise: "Plank cẳng tay", reps: 1, holdSeconds: 45, rpe: 7.5 },
  ]);
  const [newExercise, setNewExercise] = useState("Chống đẩy tiêu chuẩn");
  const [newReps, setNewReps] = useState(12);
  const [newRpe, setNewRpe] = useState(8);
  const [success, setSuccess] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play a gentle beep or vibration if available
      if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  function startTimer(seconds: number) {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  }

  function handleAddSet() {
    setSets([
      ...sets,
      {
        id: Date.now().toString(),
        exercise: newExercise,
        reps: Number(newReps),
        rpe: Number(newRpe),
      },
    ]);
  }

  function handleRemoveSet(id: string) {
    setSets(sets.filter((s) => s.id !== id));
  }

  async function handleSaveWorkout() {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
    await logWorkoutAction({
      date: today,
      title: isSoccer ? "Trận bóng đá giao hữu 45 phút" : title,
      isSoccerDay: isSoccer,
      durationMinutes: Number(duration),
      caloriesBurnedEstimate: isSoccer ? 380 : 180,
      exercises: [
        {
          exerciseSlug: "mixed",
          exerciseName: "Bài tập tổng hợp",
          sets: sets.map((s, idx) => ({
            id: s.id,
            setNumber: idx + 1,
            reps: s.reps,
            holdSeconds: (s as any).holdSeconds,
            rpe: s.rpe,
          })),
        },
      ],
      notes: isSoccer
        ? "Đá bóng sân cỏ nhân tạo 45 phút. Không ăn bù đúp calo vào TDEE."
        : "Tập dưới ngưỡng kiệt sức theo lời khuyên sức khỏe.",
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            Ghi Chép Tập Luyện & Đồng Hồ Nghỉ Hiệp
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Lịch 3 buổi tập sức mạnh/tuần + 1 buổi đá banh 45 phút • Kiểm soát RPE dưới ngưỡng kiệt sức.
          </p>
        </div>

        {/* Rest Timer Widget */}
        <div className="p-3.5 rounded-2xl border border-primary/30 bg-primary/5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Timer nghỉ</span>
              <span className={`text-base font-black ${timeLeft > 0 ? "text-primary animate-pulse" : "text-foreground"}`}>
                {timeLeft > 0 ? `${timeLeft}s` : "00s"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                onClick={() => startTimer(45)}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary hover:bg-accent text-foreground"
              >
                45s
              </button>
              <button
                onClick={() => startTimer(60)}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary hover:bg-accent text-foreground"
              >
                60s
              </button>
              <button
                onClick={() => startTimer(90)}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary hover:bg-accent text-foreground"
              >
                90s
              </button>
              {timeLeft > 0 && (
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary text-primary-foreground"
                >
                  {isTimerRunning ? "Dừng" : "Chạy"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu buổi tập thành công vào nhật ký!</span>
        </div>
      )}

      {/* Mode selection: Strength or Football Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setIsSoccer(false)}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            !isSoccer
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-accent/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground">3 Buổi Tập Sức Mạnh / Tuần</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Kháng lực tại nhà
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ngực, lưng, đùi, bụng (Push-up, Squat, Plank, Lunge, Backpack Row).
          </p>
        </div>

        <div
          onClick={() => setIsSoccer(true)}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            isSoccer
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-accent/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground">1 Buổi Đá Banh / Tuần (45 phút)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Tim mạch & Thể lực
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Thi đấu sân cỏ nhân tạo. Bữa tối đặc biệt: Gà nướng 400-500g + Cơm lam + Bánh bao.
          </p>
        </div>
      </div>

      {/* Strength Logger Content */}
      {!isSoccer ? (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-5">
          <h2 className="text-lg font-bold text-foreground">Ghi Nhận Các Hiệp Tập (Sets & Reps)</h2>

          {/* Form to add set */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-secondary/50 border border-border">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Tên bài tập
              </label>
              <select
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                className="w-full p-2 rounded-xl border border-border bg-background text-xs text-foreground"
              >
                <option value="Chống đẩy tiêu chuẩn">Chống đẩy tiêu chuẩn (Push-up)</option>
                <option value="Chống đẩy kim cương">Chống đẩy kim cương</option>
                <option value="Squat tự thân">Squat tự thân</option>
                <option value="Chùng chân lùi bước">Chùng chân lùi bước (Lunge)</option>
                <option value="Plank cẳng tay">Plank cẳng tay</option>
                <option value="Gập bụng ngược">Gập bụng ngược</option>
                <option value="Kéo tạ ba lô">Kéo tạ ba lô (Backpack row)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Số lần lặp (Reps / Giây)
              </label>
              <input
                type="number"
                value={newReps}
                onChange={(e) => setNewReps(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full p-2 rounded-xl border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Thang gắng sức RPE (1-10)
              </label>
              <input
                type="number"
                step="0.5"
                min={5}
                max={10}
                value={newRpe}
                onChange={(e) => setNewRpe(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-border bg-background text-xs text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Mục tiêu: 7-8 (dưới ngưỡng kiệt sức)
              </span>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddSet}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-95"
              >
                <Plus className="w-4 h-4" /> Thêm hiệp này
              </button>
            </div>
          </div>

          {/* List of sets */}
          <div className="space-y-2">
            {sets.map((s, idx) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-secondary/30 border border-border/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">{s.exercise}</span>
                    <p className="text-muted-foreground text-[11px]">
                      {s.reps} lần • RPE {s.rpe}/10
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSet(s.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveWorkout}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-opacity"
          >
            Lưu buổi tập vào hệ thống
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <h2 className="text-lg font-bold text-foreground">Ghi Nhận Buổi Đá Banh Cuối Tuần</h2>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-muted-foreground leading-relaxed">
            ⚽ <strong>45 phút thi đấu cường độ cao:</strong> Tiêu hao khoảng 350–400 kcal năng lượng yếm khí và làm cạn kiệt glycogen cơ bắp. Hệ thống CutTrack đã khóa tính năng tự động cộng calo này vào TDEE để tránh làm lệch thâm hụt mỡ của bạn.
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-muted-foreground">Thời gian thi đấu (phút)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full max-w-xs p-2.5 rounded-xl border border-border bg-background text-sm"
            />
          </div>

          <button
            onClick={handleSaveWorkout}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-opacity"
          >
            Lưu trận đá banh hôm nay
          </button>
        </div>
      )}
    </div>
  );
}
