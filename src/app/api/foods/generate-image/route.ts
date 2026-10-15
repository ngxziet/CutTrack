import { NextRequest, NextResponse } from "next/server";
import { generateFoodImage } from "@/lib/ai/food-image-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, foodName, aspectRatio, customPrompt } = body;

    if (!slug || !foodName) {
      return NextResponse.json(
        { success: false, message: "Thiếu slug hoặc foodName" },
        { status: 400 }
      );
    }

    const result = await generateFoodImage({
      slug,
      foodName,
      aspectRatio: aspectRatio || "4:3",
      customPrompt,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: result.error === "MISSING_API_KEY" ? 400 : 500 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Lỗi server khi tạo ảnh" },
      { status: 500 }
    );
  }
}
