import Link from "next/link";
import { Dumbbell, ArrowRight, Activity, Flame, ShieldAlert } from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { ExercisesCatalogView } from "@/components/exercises/exercises-catalog-view";

const exercisesList = [
  {
    slug: "push-up",
    name: "Chống đẩy tiêu chuẩn (Push-up)",
    target: "Ngực, Vai trước, Tay sau",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 10-15 lần",
    posterUrl: "/media/exercises/posters/push-up.jpg",
    animationUrl: "/media/exercises/animations/push-up.gif",
    description: "Bài tập nền tảng phát triển cơ ngực và sức mạnh thân trên mà không cần tạ.",
  },
  {
    slug: "diamond-push-up",
    name: "Chống đẩy kim cương (Diamond Push-up)",
    target: "Tay sau (Triceps), Ngực trong",
    difficulty: "Trung bình",
    reps: "3 hiệp x 8-12 lần",
    posterUrl: "/media/exercises/posters/diamond-push-up.jpg",
    animationUrl: "/media/exercises/animations/diamond-push-up.gif",
    description: "Hai tay tạo hình kim cương, tập trung kích hoạt tối đa cơ tay sau.",
  },
  {
    slug: "squat",
    name: "Ngồi xổm tự thân (Bodyweight Squat)",
    target: "Đùi trước, Mông, Đùi sau",
    difficulty: "Cơ bản",
    reps: "4 hiệp x 15-20 lần",
    posterUrl: "/media/exercises/posters/squat.jpg",
    animationUrl: "/media/exercises/animations/squat.gif",
    description: "Động tác kích hoạt nhóm cơ lớn nhất cơ thể, tăng cường đốt năng lượng và giữ cơ chân.",
  },
  {
    slug: "reverse-lunge",
    name: "Chùng chân lùi bước (Reverse Lunge)",
    target: "Đùi trước, Cơ mông lớn, Thăng bằng",
    difficulty: "Trung bình",
    reps: "3 hiệp x 10 lần mỗi chân",
    posterUrl: "/media/exercises/posters/reverse-lunge.jpg",
    animationUrl: "/media/exercises/animations/reverse-lunge.gif",
    description: "Bảo vệ khớp gối tốt hơn lunge bước tới, củng cố cơ trụ cho các pha tranh chấp bóng đá.",
  },
  {
    slug: "plank",
    name: "Plank cẳng tay (Forearm Plank)",
    target: "Cơ bụng ngang, Cơ lõi sâu",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 45-60 giây",
    posterUrl: "/media/exercises/posters/plank.jpg",
    animationUrl: "/media/exercises/animations/plank.gif",
    description: "Gồng chắc ổ bụng, ổn định cột sống và siết chặt vòng eo.",
  },
  {
    slug: "reverse-crunch",
    name: "Gập bụng ngược (Reverse Crunch)",
    target: "Bụng dưới, Gập hông",
    difficulty: "Trung bình",
    reps: "3 hiệp x 12-15 lần",
    posterUrl: "/media/exercises/posters/reverse-crunch.jpg",
    animationUrl: "/media/exercises/animations/reverse-crunch.gif",
    description: "Cuộn xương chậu về phía ngực, tập trung cơ bụng dưới mà không gây đau thắt lưng.",
  },
  {
    slug: "dead-bug",
    name: "Bọ chết (Dead Bug)",
    target: "Cơ lõi ổn định, Chống võng lưng",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 10 lần mỗi bên",
    posterUrl: "/media/exercises/posters/dead-bug.jpg",
    animationUrl: "/media/exercises/animations/dead-bug.gif",
    description: "Động tác chuẩn vật lý trị liệu giúp giảm võng lưng (nguyên nhân khiến bụng dưới trông to hơn).",
  },
  {
    slug: "glute-bridge",
    name: "Cầu hông (Glute Bridge)",
    target: "Cơ mông, Đùi sau, Thắt lưng",
    difficulty: "Cơ bản",
    reps: "3 hiệp x 15-20 lần",
    posterUrl: "/media/exercises/posters/glute-bridge.jpg",
    animationUrl: "/media/exercises/animations/glute-bridge.gif",
    description: "Khắc phục hội chứng 'mông ngủ quên' do ngồi văn phòng cả ngày.",
  },
  {
    slug: "backpack-row",
    name: "Kéo xô tạ ba lô (Backpack Row)",
    target: "Lưng xô (Lats), Quả trám, Tay trước",
    difficulty: "Trung bình",
    reps: "4 hiệp x 12 lần",
    posterUrl: "/media/exercises/posters/backpack-row.jpg",
    animationUrl: "/media/exercises/animations/backpack-row.gif",
    description: "Tận dụng ba lô chứa sách/nước để tập cơ lưng, cân bằng với các bài chống đẩy.",
  },
  {
    slug: "mountain-climber",
    name: "Leo núi tại chỗ (Mountain Climber)",
    target: "Tim mạch (Cardio), Cơ lõi",
    difficulty: "Trung bình",
    reps: "3 hiệp x 30 giây",
    posterUrl: "/media/exercises/posters/mountain-climber.jpg",
    animationUrl: "/media/exercises/animations/mountain-climber.gif",
    description: "Tăng nhịp tim nhanh chóng, hỗ trợ hô hấp và sức bền cho buổi đá banh cuối tuần.",
  },
  {
    slug: "football",
    name: "Thể lực bóng đá 45 phút",
    target: "Tim mạch, Sức bền yếm khí, Toàn thân",
    difficulty: "Thể thao",
    reps: "1 buổi 45 phút/tuần",
    posterUrl: "/media/exercises/posters/football.jpg",
    animationUrl: "/media/exercises/animations/football.gif",
    description: "Buổi đá banh sân cỏ nhân tạo hàng tuần. Lưu ý không tự động ăn bù đúp calo vào TDEE.",
  },
];

export default async function ExercisesPage() {
  const state = await getAppState();
  const userConfigs = state.exerciseConfigs || {};

  // If user configured a custom media URL, override the display
  const exercisesWithCustomMedia = exercisesList.map((ex) => {
    const customUrl = userConfigs[ex.slug]?.customMediaUrl;
    if (customUrl) {
      return {
        ...ex,
        animationUrl: customUrl,
        posterUrl: customUrl,
      };
    }
    return ex;
  });

  return (
    <ExercisesCatalogView
      exercises={exercisesWithCustomMedia}
      userConfigs={userConfigs}
    />
  );
}
