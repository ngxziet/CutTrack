import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, Info, PlusCircle } from "lucide-react";
import { getAppState } from "@/lib/server-actions";
import { formatCurrencyVND } from "@/lib/utils";
import { FoodDetailScaler } from "@/components/foods/food-detail-scaler";

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const state = await getAppState();
  const { slug } = await params;

  const food = state.foods.find((f) => f.slug === slug);
  if (!food) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/foods"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Thư viện món ăn
        </Link>
      </div>

      {/* Hero Image 16:9 */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border bg-secondary shadow-sm">
        <img
          src={food.detailUrl}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md border border-border text-foreground shadow-md">
            {food.defaultPriceVnd > 0 ? formatCurrencyVND(food.defaultPriceVnd) : "Giá tự nhập"}
          </span>
        </div>
      </div>

      {/* Title & Category Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {food.category === "STREET_FOOD" ? "Món quán bình dân" : food.category === "HOMEMADE_PROTEIN" ? "Đạm luộc tại nhà" : "Món ăn"}
          </span>
          <span className="text-xs text-muted-foreground uppercase font-semibold">
            Trạng thái cân: {food.weightBasis}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {food.name}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {food.confidenceNote}
        </p>
      </div>

      {/* Dynamic Portion Scaler (Client component) */}
      <FoodDetailScaler food={food} />

      {/* Clinical Notes & Edible Yield Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Scale className="w-4 h-4 text-primary" />
            <span>Tỷ Lệ Phần Ăn Được (Edible Yield)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Món ăn này có tỷ lệ ăn được là <strong>{food.edibleYieldPercent}%</strong>. Nếu món chứa xương (như đùi gà kho, bún bò giò heo, hủ tiếu sườn), phần xương và da thừa đã được loại bỏ khi tính toán calo và đạm thực nạp.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Nguồn Dữ Liệu & Bản Quyền</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dữ liệu đối chiếu Viện Dinh Dưỡng Quốc Gia (NIN) và khảo sát thực tế quán ăn bình dân TP.HCM / Hà Nội. Minh họa vector được tạo riêng cho CutTrack, tuân thủ giấy phép phân phối tự do.
          </p>
        </div>
      </div>
    </div>
  );
}
