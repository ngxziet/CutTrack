import Link from "next/link";
import { Dumbbell, ArrowRight, Activity, Flame, ShieldAlert } from "lucide-react";

const exercisesList = [
  {
    slug: "push-up",
    name: "Chống đẩy tiêu chuẩn (Push-up)",
    target: "Ngực, Vai trước, Tay sau",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 10-15 lần",
    posterUrl: "/media/exercises/posters/push-up.svg",
    animationUrl: "/media/exercises/animations/push-up.svg",
    description: "Bài tập nền tảng phát triển cơ ngực và sức mạnh thân trên mà không cần tạ.",
  },
  {
    slug: "diamond-push-up",
    name: "Chống đẩy kim cương (Diamond Push-up)",
    target: "Tay sau (Triceps), Ngực trong",
    difficulty: "Trung bình",
    reps: "3 hiệp x 8-12 lần",
    posterUrl: "/media/exercises/posters/diamond-push-up.svg",
    animationUrl: "/media/exercises/animations/diamond-push-up.svg",
    description: "Hai tay tạo hình kim cương, tập trung kích hoạt tối đa cơ tay sau.",
  },
  {
    slug: "squat",
    name: "Ngồi xổm tự thân (Bodyweight Squat)",
    target: "Đùi trước, Mông, Đùi sau",
    difficulty: "Cơ bản",
    reps: "4 hiệp x 15-20 lần",
    posterUrl: "/media/exercises/posters/squat.svg",
    animationUrl: "/media/exercises/animations/squat.svg",
    description: "Động tác kích hoạt nhóm cơ lớn nhất cơ thể, tăng cường đốt năng lượng và giữ cơ chân.",
  },
  {
    slug: "reverse-lunge",
    name: "Chùng chân lùi bước (Reverse Lunge)",
    target: "Đùi trước, Cơ mông lớn, Thăng bằng",
    difficulty: "Trung bình",
    reps: "3 hiệp x 10 lần mỗi chân",
    posterUrl: "/media/exercises/posters/reverse-lunge.svg",
    animationUrl: "/media/exercises/animations/reverse-lunge.svg",
    description: "Bảo vệ khớp gối tốt hơn lunge bước tới, củng cố cơ trụ cho các pha tranh chấp bóng đá.",
  },
  {
    slug: "plank",
    name: "Plank cẳng tay (Forearm Plank)",
    target: "Cơ bụng ngang, Cơ lõi sâu",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 45-60 giây",
    posterUrl: "/media/exercises/posters/plank.svg",
    animationUrl: "/media/exercises/animations/plank.svg",
    description: "Gồng chắc ổ bụng, ổn định cột sống và siết chặt vòng eo.",
  },
  {
    slug: "reverse-crunch",
    name: "Gập bụng ngược (Reverse Crunch)",
    target: "Bụng dưới, Gập hông",
    difficulty: "Trung bình",
    reps: "3 hiệp x 12-15 lần",
    posterUrl: "/media/exercises/posters/reverse-crunch.svg",
    animationUrl: "/media/exercises/animations/reverse-crunch.svg",
    description: "Cuộn xương chậu về phía ngực, tập trung cơ bụng dưới mà không gây đau thắt lưng.",
  },
  {
    slug: "dead-bug",
    name: "Bọ chết (Dead Bug)",
    target: "Cơ lõi ổn định, Chống võng lưng",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 10 lần mỗi bên",
    posterUrl: "/media/exercises/posters/dead-bug.svg",
    animationUrl: "/media/exercises/animations/dead-bug.svg",
    description: "Động tác chuẩn vật lý trị liệu giúp giảm võng lưng (nguyên nhân khiến bụng dưới trông to hơn).",
  },
  {
    slug: "glute-bridge",
    name: "Cầu hông (Glute Bridge)",
    target: "Cơ mông, Đùi sau, Thắt lưng",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 15-20 lần",
    posterUrl: "/media/exercises/posters/glute-bridge.svg",
    animationUrl: "/media/exercises/animations/glute-bridge.svg",
    description: "Khắc phục hội chứng 'mông ngủ quên' do ngồi văn phòng cả ngày.",
  },
  {
    slug: "backpack-row",
    name: "Kéo xô tạ ba lô (Backpack Row)",
    target: "Lưng xô (Lats), Quả trám, Tay trước",
    difficulty: "Trung bình",
    reps: "4 hiệp x 12 lần",
    posterUrl: "/media/exercises/posters/backpack-row.svg",
    animationUrl: "/media/exercises/animations/backpack-row.svg",
    description: "Tận dụng ba lô chứa sách/nước để tập cơ lưng, cân bằng với các bài chống đẩy.",
  },
  {
    slug: "mountain-climber",
    name: "Leo núi tại chỗ (Mountain Climber)",
    target: "Tim mạch (Cardio), Cơ lõi",
    difficulty: "Trung bình",
    reps: "3 hiệp x 30 giây",
    posterUrl: "/media/exercises/posters/mountain-climber.svg",
    animationUrl: "/media/exercises/animations/mountain-climber.svg",
    description: "Tăng nhịp tim nhanh chóng, hỗ trợ hô hấp và sức bền cho buổi đá banh cuối tuần.",
  },
  {
    slug: "football",
    name: "Thể lực bóng đá 45 phút",
    target: "Tim mạch, Sức bền yếm khí, Toàn thân",
    difficulty: "Thể thao",
    reps: "1 buổi 45 phút/tuần",
    posterUrl: "/media/exercises/posters/football.svg",
    animationUrl: "/media/exercises/animations/football.svg",
    description: "Buổi đá banh sân cỏ nhân tạo hàng tuần. Lưu ý không tự động ăn bù đúp calo vào TDEE.",
  },
];

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          Thư Viện Bài Tập Thể Hình & Hướng Dẫn Chuyển Động
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Minh họa hoạt ảnh vector sống động, hướng dẫn chuẩn kỹ thuật, cách thở và phân bổ hiệp tập.
        </p>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {exercisesList.map((exercise) => (
          <div
            key={exercise.slug}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col"
          >
            {/* 16:9 Image Preview with active animation */}
            <div className="relative aspect-[16/9] w-full bg-secondary/80 overflow-hidden flex items-center justify-center p-2">
              <object
                data={exercise.animationUrl}
                type="image/svg+xml"
                className="w-full h-full object-contain pointer-events-none scale-110 group-hover:scale-125 transition-transform duration-300"
                aria-label={exercise.name}
              >
                <img
                  src={exercise.posterUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </object>
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                  <Activity className="w-2.5 h-2.5 animate-pulse" /> Live Motion
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
                  Nhóm cơ: {exercise.target}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {exercise.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Gợi ý: <strong>{exercise.reps}</strong></span>
              </div>

              <Link
                href={`/exercises/${exercise.slug}`}
                className="w-full py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                Xem Video & Hướng Dẫn Kỹ Thuật <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
