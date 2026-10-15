"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Key } from "lucide-react";
import { FoodItem } from "@/lib/store/cuttrack-store";

export function AiFoodImageModal({ food }: { food: FoodItem }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"4:3" | "16:9">("4:3");
  const [customPrompt, setCustomPrompt] = useState(
    `High-end gourmet food photography of authentic Vietnamese dish "${food.name}". Beautifully plated on an elegant ceramic dish, natural warm daylight, depth of field, appetizing colors, glistening textures, fresh herbs garnish, award-winning culinary magazine quality, 8k resolution, photorealistic.`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/foods/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: food.slug,
          foodName: food.name,
          aspectRatio,
          customPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Không thể tạo ảnh bằng AI");
      } else {
        setSuccessMsg("Tạo ảnh AI thành công! Đang làm mới dữ liệu...");
        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi kết nối tới máy chủ");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        Tạo ảnh AI (Imagen 3)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Tạo Ảnh Món Ăn Bằng Google Imagen 3
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tạo ảnh chụp ẩm thực chân thực, ngon mắt cho "{food.name}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Aspect ratio selector */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Tỷ lệ khung hình:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAspectRatio("4:3")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      aspectRatio === "4:3"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Khung thẻ 4:3 (Chuẩn Thumbnail)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio("16:9")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      aspectRatio === "16:9"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Khung rộng 16:9 (Chi tiết bìa)</span>
                  </button>
                </div>
              </div>

              {/* Prompt customization */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Mô tả phong cách ảnh (AI Prompt):
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-none"
                />
              </div>

              {/* API Key Guide Banner */}
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Key className="w-3.5 h-3.5 text-amber-500" />
                  <span>Yêu cầu cấu hình GEMINI_API_KEY</span>
                </div>
                <p>
                  Tính năng này sử dụng model <strong>imagen-3.0-generate-002</strong> của Google. Bạn chỉ cần lấy API key miễn phí tại{" "}
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline font-semibold"
                  >
                    Google AI Studio
                  </a>{" "}
                  và điền vào file <code>.env</code> (<code>GEMINI_API_KEY=AIza...</code>).
                </p>
              </div>

              {/* Error & Success Messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      AI đang vẽ ảnh ẩm thực...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Bắt đầu tạo ảnh ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
