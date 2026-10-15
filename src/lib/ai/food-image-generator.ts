import fs from "fs";
import path from "path";
import { loadCutTrackState, saveCutTrackState } from "@/lib/store/cuttrack-store";

export interface GenerateFoodImageOptions {
  slug: string;
  foodName: string;
  aspectRatio?: "4:3" | "16:9" | "1:1";
  customPrompt?: string;
}

export async function generateFoodImage({
  slug,
  foodName,
  aspectRatio = "4:3",
  customPrompt,
}: GenerateFoodImageOptions) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "MISSING_API_KEY",
      message:
        "Chưa cấu hình GEMINI_API_KEY trong file .env. Vui lòng lấy API key miễn phí tại https://aistudio.google.com và thêm vào file .env (GEMINI_API_KEY=AIza...).",
    };
  }

  const prompt =
    customPrompt ||
    `High-end gourmet food photography of authentic Vietnamese dish "${foodName}". Beautifully plated on an elegant ceramic dish, natural warm daylight, depth of field, appetizing colors, glistening textures, fresh herbs garnish, award-winning culinary magazine quality, 8k resolution, photorealistic.`;

  try {
    // Calling Google Imagen 3 API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const body = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio,
        outputMimeType: "image/jpeg",
        personGeneration: "DONT_ALLOW",
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: "API_ERROR",
        message: `Lỗi từ Google Imagen API (${res.status}): ${errText}`,
      };
    }

    const data = await res.json();
    const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Bytes) {
      return {
        success: false,
        error: "NO_IMAGE_DATA",
        message: "Không nhận được dữ liệu ảnh trả về từ Google Imagen API.",
      };
    }

    const buffer = Buffer.from(base64Bytes, "base64");

    // Save to public directories
    const thumbsDir = path.join(process.cwd(), "public", "media", "foods", "thumbnails");
    const detailsDir = path.join(process.cwd(), "public", "media", "foods", "details");

    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });
    if (!fs.existsSync(detailsDir)) fs.mkdirSync(detailsDir, { recursive: true });

    const fileName = `${slug}.jpg`;
    fs.writeFileSync(path.join(thumbsDir, fileName), buffer);
    fs.writeFileSync(path.join(detailsDir, fileName), buffer);

    const relativeUrl = `/media/foods/thumbnails/${fileName}?t=${Date.now()}`;
    const detailUrl = `/media/foods/details/${fileName}?t=${Date.now()}`;

    // Update food item in database store
    const state = loadCutTrackState();
    const food = state.foods.find((f) => f.slug === slug);
    if (food) {
      food.thumbnailUrl = relativeUrl;
      food.detailUrl = detailUrl;
      saveCutTrackState(state);
    }

    return {
      success: true,
      thumbnailUrl: relativeUrl,
      detailUrl: detailUrl,
      message: `Đã tạo ảnh AI thành công cho món "${foodName}"!`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: "UNKNOWN_ERROR",
      message: err.message || "Đã xảy ra lỗi không xác định khi tạo ảnh món ăn.",
    };
  }
}
