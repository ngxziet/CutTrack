import Link from "next/link";
import { GraduationCap, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { ARTICLES_DATA } from "@/features/learn/data/articles";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Kho Tri Thức Dinh Dưỡng & Khoa Học Thể Thao
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kiến thức chuẩn y khoa, trung tính, không cổ súy cắt giảm calo tiêu cực, tối ưu cho đời sống sinh hoạt thực tế tại Việt Nam.
        </p>
      </div>

      {/* Grid of 8 Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ARTICLES_DATA.map((art) => (
          <div
            key={art.slug}
            className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            {/* Cover 16:9 */}
            <div className="relative aspect-[16/9] w-full bg-secondary/60 overflow-hidden">
              <img
                src={art.coverUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-background/90 backdrop-blur-md border border-border text-foreground">
                  {art.categoryTag}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {art.readTime}
                  </span>
                  <span>•</span>
                  <span>Cập nhật: {art.updatedAt}</span>
                </div>

                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {art.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              {/* Key takeaways snippet */}
              <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-xs space-y-1">
                <span className="font-bold text-foreground block text-[11px]">Điểm cốt lõi:</span>
                <p className="text-muted-foreground text-[11px] line-clamp-2">
                  {art.keyTakeaways[0]}
                </p>
              </div>

              <Link
                href={`/learn/${art.slug}`}
                className="w-full py-2.5 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                Đọc toàn bộ bài viết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
