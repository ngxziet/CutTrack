import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, Wind, Target, Dumbbell } from "lucide-react";
import { BiomechanicalMotionEngine } from "@/components/exercises/biomechanical-motion-engine";
import { getAppState } from "@/lib/server-actions";

const exerciseDetails: Record<
  string,
  {
    name: string;
    target: string;
    secondaryTarget: string;
    difficulty: string;
    recommendedSets: string;
    tempo: string;
    breathingGuide: string;
    steps: string[];
    mistakes: string[];
    variations: { easier: string; harder: string };
    safetyNote?: string;
  }
> = {
  "push-up": {
    name: "Chống đẩy tiêu chuẩn (Push-up)",
    target: "Cơ ngực lớn (Pectoralis Major)",
    secondaryTarget: "Cơ tay sau (Triceps), Cơ vai trước (Anterior Deltoid), Cơ lõi (Core)",
    difficulty: "Cơ bản / Nền tảng",
    recommendedSets: "3 hiệp x 10 - 15 lần (Tối đa 20 lần)",
    tempo: "2-0-1 (Hạ người 2 giây, không dừng, đẩy lên dứt khoát 1 giây)",
    breathingGuide: "Hít sâu vào bằng mũi khi hạ người xuống, thở mạnh ra bằng miệng khi đẩy người lên.",
    steps: [
      "Đặt hai bàn tay trên sàn, rộng hơn vai một chút, các ngón tay xòe tự nhiên hướng về phía trước.",
      "Gồng chặt cơ bụng, siết mông, giữ thân người tạo thành một đường thẳng tắp từ gót chân tới đỉnh đầu.",
      "Từ từ gập khuỷu tay hạ thấp người xuống cho đến khi ngực cách mặt sàn khoảng 3-5 cm. Góc giữa bắp tay và thân người tạo thành hình mũi tên (khoảng 45 độ), không xòe ngang 90 độ.",
      "Dùng lực cơ ngực và tay sau đẩy mạnh thân người trở về vị trí ban đầu mà không khóa cứng khớp cùi chỏ.",
    ],
    mistakes: [
      "Võng lưng dưới (thắt lưng bị chìm xuống), làm tăng áp lực lên cột sống.",
      "Xòe khuỷu tay vuông góc 90 độ sang hai bên, dễ gây chèn ép bao khớp vai.",
      "Nhấp nhổm nửa vời không hạ ngực sâu.",
    ],
    variations: {
      easier: "Chống đẩy nghiêng trên bàn/ghế cao hoặc chống đẩy quỳ gối (Knee Push-up).",
      harder: "Chống đẩy kê chân cao trên ghế (Decline Push-up) hoặc chống đẩy kim cương.",
    },
    safetyNote:
      "Với người có mức tối đa 20 lần, khuyến nghị chỉ tập các hiệp 12-15 lần để duy trì form chuẩn, không tập tới mức kiệt sức hoàn toàn (RPE 7-8) để bảo vệ khớp vai.",
  },
  "diamond-push-up": {
    name: "Chống đẩy kim cương (Diamond Push-up)",
    target: "Cơ tay sau (Triceps Brachii)",
    secondaryTarget: "Cơ ngực trong, Cơ vai trước",
    difficulty: "Trung bình",
    recommendedSets: "3 hiệp x 8 - 12 lần",
    tempo: "2-1-1 (Hạ 2 giây, giữ 1 giây, đẩy 1 giây)",
    breathingGuide: "Hít vào khi hạ ngực chạm gần tay, thở ra khi duỗi tay sau đẩy lên.",
    steps: [
      "Bắt đầu ở tư thế chống đẩy, nhưng đặt hai ngón tay trỏ và hai ngón tay cái chạm nhau tạo thành hình tam giác kim cương ngay dưới ngực.",
      "Hạ người có kiểm soát sao cho ngực chạm nhẹ vào tâm hình kim cương.",
      "Giữ khuỷu tay áp sát mạn sườn, siết chặt bắp tay sau đẩy ngược người lên.",
    ],
    mistakes: [
      "Để tay quá xa về phía trước mặt thay vì dưới ngực.",
      "Mở khuỷu tay quá rộng làm đau cổ tay.",
    ],
    variations: {
      easier: "Chống đẩy kim cương kê tay trên bậc cao.",
      harder: "Chống đẩy kim cương kê chân cao.",
    },
  },
  squat: {
    name: "Ngồi xổm tự thân (Bodyweight Squat)",
    target: "Cơ đùi trước (Quadriceps), Cơ mông lớn (Gluteus Maximus)",
    secondaryTarget: "Cơ đùi sau (Hamstrings), Cơ bắp chuối, Cơ lõi",
    difficulty: "Cơ bản",
    recommendedSets: "4 hiệp x 15 - 20 lần",
    tempo: "2-1-1 (Hạ 2 giây, giữ đáy 1 giây, đứng lên 1 giây)",
    breathingGuide: "Hít sâu gồng ổ bụng trước khi ngồi xuống, thở ra khi đẩy gót chân đứng thẳng lên.",
    steps: [
      "Đứng thẳng, hai chân rộng bằng hoặc hơn vai một chút, mũi chân hơi xoay ra ngoài 15-30 độ.",
      "Đẩy nhẹ mông ra sau đồng thời gập đầu gối hạ người xuống như đang ngồi vào một chiếc ghế.",
      "Hạ đến khi đùi song song với mặt sàn (hoặc sâu hơn nếu khớp hông linh hoạt), giữ lưng thẳng, ngực mở rộng.",
      "Dồn lực vào toàn bộ bàn chân (ưu tiên gót chân) để đứng thẳng dậy, siết mông ở điểm cao nhất.",
    ],
    mistakes: [
      "Đầu gối chụm vào nhau (Knee valgus) khi đi lên.",
      "Nhấc gót chân lên khỏi mặt sàn.",
      "Cong lưng tôm về phía trước.",
    ],
    variations: {
      easier: "Squat ngồi xuống ghế rồi đứng dậy (Box Squat).",
      harder: "Squat giữ 3 giây ở đáy (Pause Squat) hoặc Pistol Squat (Squat 1 chân).",
    },
  },
  plank: {
    name: "Plank cẳng tay (Forearm Plank)",
    target: "Cơ bụng ngang (Transverse Abdominis)",
    secondaryTarget: "Cơ dựng gai sống, Cơ mông, Cơ vai",
    difficulty: "Cơ bản",
    recommendedSets: "3 - 4 hiệp x 45 - 60 giây",
    tempo: "Giữ tĩnh đẳng trường (Isometric Hold)",
    breathingGuide: "Hít thở đều đặn, nhịp nhàng bằng cơ hoành, tuyệt đối không nín thở khi siết cơ bụng.",
    steps: [
      "Nằm sấp, chống hai cùi chỏ vuông góc 90 độ ngay dưới vai.",
      "Nâng toàn bộ thân người lên bằng cẳng tay và các ngón chân.",
      "Cuộn nhẹ xương chậu ra sau (Posterior Pelvic Tilt) để kích hoạt cơ bụng sâu, khóa cứng đầu gối và siết mông.",
      "Giữ nguyên tư thế bất động trong thời gian quy định.",
    ],
    mistakes: [
      "Võng lưng dưới (gây đau nhức thắt lưng cấp tính).",
      "Đẩy mông lên quá cao tạo thành hình chữ V ngược.",
      "Ngửa cổ nhìn về phía trước thay vì nhìn xuống sàn.",
    ],
    variations: {
      easier: "Plank quỳ gối hoặc chống tay thẳng trên bàn.",
      harder: "Plank nhấc 1 chân luân phiên hoặc Plank tiến lùi (Body Saw).",
    },
  },
};

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = exerciseDetails[slug] || {
    name: "Bài tập rèn luyện",
    target: "Nhóm cơ chính",
    secondaryTarget: "Nhóm cơ hỗ trợ",
    difficulty: "Tiêu chuẩn",
    recommendedSets: "3 hiệp x 10 - 15 lần",
    tempo: "Kiểm soát 2-1-1",
    breathingGuide: "Hít vào khi nạp cơ, thở ra khi dùng lực phát động.",
    steps: [
      "Ổn định tư thế chuẩn bị, giữ cột sống trung tính.",
      "Thực hiện chuyển động có kiểm soát, tập trung cảm nhận nhóm cơ đích.",
      "Duy trì nhịp thở nhịp nhàng, không vội vàng giật cục.",
    ],
    mistakes: ["Sai tư thế cột sống.", "Chuyển động quá nhanh làm mất kích hoạt cơ."],
    variations: { easier: "Giảm biên độ hoặc sử dụng điểm tựa.", harder: "Tăng thời gian chịu tải (TUT)." },
  };

  const posterUrl = `/media/exercises/posters/${slug}.svg`;
  const animationUrl = `/media/exercises/animations/${slug}.svg`;
  const state = await getAppState();
  const userConfig = state.exerciseConfigs?.[slug];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/exercises"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Thư viện bài tập
        </Link>
      </div>

      {/* Video / Animation Player with Configurator */}
      <BiomechanicalMotionEngine
        exerciseSlug={slug}
        exerciseName={detail.name}
        animationUrl={animationUrl}
        posterUrl={posterUrl}
        initialConfig={userConfig}
      />

      {/* Title & Muscle targets */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {detail.difficulty}
          </span>
          <span className="text-xs text-muted-foreground uppercase font-semibold">
            {detail.recommendedSets}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {detail.name}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          Cơ chính: <strong>{detail.target}</strong> • Cơ phụ: {detail.secondaryTarget}
        </p>
      </div>

      {/* Safety alert if any */}
      {detail.safetyNote && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>{detail.safetyNote}</p>
        </div>
      )}

      {/* Steps & Instructions */}
      <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Hướng Dẫn Kỹ Thuật Từng Bước
        </h2>
        <ol className="space-y-3">
          {detail.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Breathing & Tempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Wind className="w-4 h-4 text-sky-500" />
            <span>Cách Hít Thở Chuẩn Y Khoa</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {detail.breathingGuide}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>Nhịp Độ Chuyển Động (Tempo)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {detail.tempo}
          </p>
        </div>
      </div>

      {/* Common Mistakes & Variations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-2">
          <h3 className="font-bold text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Lỗi Thường Gặp Cần Tránh
          </h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            {detail.mistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-primary" /> Biến Thể Dễ & Khó
          </h3>
          <div className="text-xs space-y-1.5 text-muted-foreground">
            <p>• <strong>Dễ hơn:</strong> {detail.variations.easier}</p>
            <p>• <strong>Khó hơn:</strong> {detail.variations.harder}</p>
          </div>
        </div>
      </div>

      {/* Button to start workout session */}
      <div className="pt-2 text-center">
        <Link
          href="/workouts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 shadow-md shadow-primary/20"
        >
          <Dumbbell className="w-4 h-4" /> Bắt đầu ghi hiệp tập bài này trong Nhật ký tập
        </Link>
      </div>
    </div>
  );
}
