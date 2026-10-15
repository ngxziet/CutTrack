import { describe, it, expect } from "vitest";
import { analyzeFoodNutritionWithAI } from "@/lib/ai/food-nutrition-ai";

describe("Vietnamese Food Nutrition AI Engine", () => {
  it("accurately analyzes street noodle soup (Bún mọc / Phở bò)", async () => {
    const res = await analyzeFoodNutritionWithAI("Bún mọc sườn chua");
    expect(res.name).toBe("Bún mọc sườn chua");
    expect(res.category).toBe("STREET_FOOD");
    expect(res.caloriesPer100g).toBeGreaterThan(80);
    expect(res.proteinPer100g).toBeGreaterThan(4);
    expect(res.edibleYieldPercent).toBeLessThanOrEqual(100);
    expect(res.weightBasis).toBe("BONE_IN"); // Should detect ribs (sườn)
    expect(res.defaultPriceVnd).toBeGreaterThan(30000);
    expect(res.confidenceNote).toContain("xương");
  });

  it("accurately analyzes high-protein lean meats (Ức gà)", async () => {
    const res = await analyzeFoodNutritionWithAI("Ức gà luộc nạc");
    expect(res.category).toBe("HOMEMADE_PROTEIN");
    expect(res.proteinPer100g).toBeGreaterThanOrEqual(20);
    expect(res.fatPer100g).toBeLessThanOrEqual(5);
    expect(res.edibleYieldPercent).toBe(100);
    expect(res.isHomePreparedAllowed).toBe(true);
    expect(res.confidenceNote).toContain("Đạm vàng");
  });

  it("accurately analyzes street rice dishes (Cơm tấm sườn bì)", async () => {
    const res = await analyzeFoodNutritionWithAI("Cơm tấm sườn nướng");
    expect(res.category).toBe("STREET_FOOD");
    expect(res.caloriesPer100g).toBeGreaterThan(140);
    expect(res.carbsPer100g).toBeGreaterThan(20);
    expect(res.proteinPer100g).toBeGreaterThan(5);
    expect(res.edibleYieldPercent).toBe(85);
  });

  it("maintains Atwater macro consistency (4P + 4C + 9F ≈ Calo)", async () => {
    const dishes = [
      "Phở bò tái lăn",
      "Bánh mì thịt chả",
      "Thịt bò xào hành tây",
      "Cà phê đen đá",
    ];

    for (const dish of dishes) {
      const res = await analyzeFoodNutritionWithAI(dish);
      const computed = Math.round(res.proteinPer100g * 4 + res.carbsPer100g * 4 + res.fatPer100g * 9);
      // Ensure macro math is consistent with caloriesPer100g within 10 kcal tolerance
      expect(Math.abs(computed - res.caloriesPer100g)).toBeLessThanOrEqual(10);
    }
  });

  it("handles low-calorie beverages properly", async () => {
    const res = await analyzeFoodNutritionWithAI("Trà đá không đường");
    expect(res.category).toBe("BEVERAGE");
    expect(res.caloriesPer100g).toBeLessThan(10);
    expect(res.fatPer100g).toBe(0);
  });
});
