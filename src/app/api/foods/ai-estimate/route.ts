import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodNutritionWithAI } from "@/lib/ai/food-nutrition-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { foodName, notes } = body;

    if (!foodName || !foodName.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên món ăn" },
        { status: 400 }
      );
    }

    const estimated = await analyzeFoodNutritionWithAI(foodName, notes);
    return NextResponse.json({ success: true, data: estimated });
  } catch (err: any) {
    console.error("Lỗi khi phân tích dinh dưỡng AI:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Lỗi server khi phân tích dinh dưỡng" },
      { status: 500 }
    );
  }
}
