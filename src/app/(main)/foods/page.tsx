import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";

export default async function FoodsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  const state = await getAppState();
  const params = await searchParams;
  const currentCategory = params?.category || "ALL";
  const searchQuery = (params?.search || "").toLowerCase();

  const filteredFoods = state.foods.filter((food) => {
    const matchesCategory =
      currentCategory === "ALL" || food.category === currentCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery) ||
      food.confidenceNote.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: "ALL", label: "Tất cả 15 món" },
    { key: "STREET_FOOD", label: "Món quán bình dân" },
    { key: "HOMEMADE_PROTEIN", label: "Đạm luộc tại nhà" },
    { key: "SPECIAL_MEAL", label: "Bữa tiệc đá banh" },
    { key: "BEVERAGE", label: "Đồ uống & Tráng miệng" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Thư Viện Món Ăn Việt Nam (Có Hình Ảnh & Định Lượng)
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dữ liệu dinh dưỡng minh bạch, phân tách rõ khối lượng cả xương và phần ăn được thực tế.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={cat.key === "ALL" ? "/foods" : `/foods?category=${cat.key}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentCategory === cat.key
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col"
          >
            {/* Image Box 4:3 */}
            <div className="relative aspect-[4/3] w-full bg-secondary/50 overflow-hidden">
              <img
                src={food.thumbnailUrl}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-background/90 backdrop-blur-md border border-border text-foreground shadow-sm">
                  {food.defaultPriceVnd > 0 ? formatCurrencyVND(food.defaultPriceVnd) : "Giá tự nhập"}
                </span>
              </div>
            </div>

            {/* Food Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {food.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary">
                    {food.weightBasis}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {food.confidenceNote}
                </p>
              </div>

              {/* Nutrition Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                <div className="p-1.5 rounded-lg bg-secondary/40">
                  <span className="text-[10px] text-muted-foreground block">Calo (100g)</span>
                  <span className="text-xs font-bold text-foreground">{food.caloriesPer100g}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-secondary/40">
                  <span className="text-[10px] text-muted-foreground block">Đạm (Protein)</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{food.proteinPer100g}g</span>
                </div>
                <div className="p-1.5 rounded-lg bg-secondary/40">
                  <span className="text-[10px] text-muted-foreground block">Ăn được</span>
                  <span className="text-xs font-bold text-foreground">{food.edibleYieldPercent}%</span>
                </div>
              </div>

              <Link
                href={`/foods/${food.slug}`}
                className="w-full py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                Xem chi tiết & Khẩu phần <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
