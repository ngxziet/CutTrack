/**
 * Script để tự động sinh ảnh món ăn bằng Google Imagen 3 API.
 * Cách dùng:
 *   pnpm tsx scripts/generate-food-images.ts [slug-mon-an]
 *
 * Ví dụ:
 *   pnpm tsx scripts/generate-food-images.ts com-ga-kho
 *   pnpm tsx scripts/generate-food-images.ts all
 */

import fs from "fs";
import path from "path";

// Load .env natively
function loadEnv() {
  for (const envFile of [".env", ".env.local"]) {
    const fullPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(fullPath)) {
      const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const idx = trimmed.indexOf("=");
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

const DB_FILE = path.join(process.cwd(), ".data", "cuttrack_db.json");

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Lỗi: Chưa tìm thấy GEMINI_API_KEY trong file .env hoặc .env.local.");
    console.error("👉 Vui lòng lấy API key tại https://aistudio.google.com và thêm vào .env:");
    console.error("   GEMINI_API_KEY=AIzaSy...");
    process.exit(1);
  }

  if (!fs.existsSync(DB_FILE)) {
    console.error("❌ Không tìm thấy database tại:", DB_FILE);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  const targetSlug = process.argv[2] || "all";

  const foodsToGen =
    targetSlug === "all"
      ? db.foods
      : db.foods.filter((f: any) => f.slug === targetSlug);

  if (foodsToGen.length === 0) {
    console.error(`❌ Không tìm thấy món ăn nào với slug "${targetSlug}"`);
    process.exit(1);
  }

  console.log(`🚀 Bắt đầu tạo ảnh cho ${foodsToGen.length} món ăn bằng Google Imagen 3...`);

  const thumbsDir = path.join(process.cwd(), "public", "media", "foods", "thumbnails");
  const detailsDir = path.join(process.cwd(), "public", "media", "foods", "details");
  if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });
  if (!fs.existsSync(detailsDir)) fs.mkdirSync(detailsDir, { recursive: true });

  for (const food of foodsToGen) {
    console.log(`\n📸 Đang tạo ảnh cho: ${food.name} (${food.slug})...`);

    const prompt = `Gourmet food photography of authentic Vietnamese dish "${food.name}". Plated beautifully on an elegant minimalist ceramic plate, natural morning daylight, depth of field, vibrant colors, glistening textures, garnished with fresh Vietnamese herbs, award-winning culinary magazine quality, 8k resolution, ultra-realistic.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "4:3",
            outputMimeType: "image/jpeg",
            personGeneration: "DONT_ALLOW",
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`⚠️ Lỗi API (${res.status}):`, text);
        continue;
      }

      const data = await res.json();
      const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;
      if (!base64Bytes) {
        console.error("⚠️ Không có bytes ảnh trả về.");
        continue;
      }

      const buffer = Buffer.from(base64Bytes, "base64");
      const fileName = `${food.slug}.jpg`;
      fs.writeFileSync(path.join(thumbsDir, fileName), buffer);
      fs.writeFileSync(path.join(detailsDir, fileName), buffer);

      food.thumbnailUrl = `/media/foods/thumbnails/${fileName}?t=${Date.now()}`;
      food.detailUrl = `/media/foods/details/${fileName}?t=${Date.now()}`;
      console.log(`✅ Đã lưu ảnh: ${fileName}`);
    } catch (err: any) {
      console.error(`❌ Thất bại khi tạo ảnh cho ${food.name}:`, err.message);
    }
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  console.log("\n✨ Hoàn tất cập nhật ảnh món ăn vào cơ sở dữ liệu!");
}

main().catch(console.error);
