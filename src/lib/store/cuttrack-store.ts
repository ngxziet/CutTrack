import fs from "fs";
import path from "path";
import { ARTICLES_DATA, NutritionArticle } from "@/features/learn/data/articles";
import { FOOD_MEDIA_METADATA } from "@/features/media/metadata";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "cuttrack_db.json");

export interface FoodItem {
  id: string;
  slug: string;
  name: string;
  category: "STREET_FOOD" | "STAPLE" | "HOMEMADE_PROTEIN" | "SPECIAL_MEAL" | "BEVERAGE";
  defaultGrams: number;
  edibleYieldPercent: number; // e.g. 65 for chicken with bone, 100 for boneless
  weightBasis: "RAW" | "COOKED" | "EDIBLE" | "BONE_IN";
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultPriceVnd: number; // 0 if user must enter
  priceRequiresUserEntry: boolean;
  minCaloriesEstimated?: number;
  maxCaloriesEstimated?: number;
  thumbnailUrl: string;
  detailUrl: string;
  confidenceNote: string;
  isHomePreparedAllowed: boolean;
  isRestaurantFood: boolean;
}

export interface MealEntryItem {
  id: string;
  foodId: string;
  foodName: string;
  grams: number;
  edibleGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  priceVnd: number;
  weightBasis: "RAW" | "COOKED" | "EDIBLE" | "BONE_IN";
  isHomePrepared: boolean;
}

export interface MealSlotData {
  slot: "LUNCH" | "DINNER";
  slotName: string;
  items: MealEntryItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCostVnd: number;
}

export interface UserProfileState {
  age: number;
  gender: "male" | "female";
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: "sedentary" | "lightlyActive" | "moderatelyActive";
  dailyTargetCalories: number;
  safeMinCalories: number;
  safeMaxCalories: number;
  targetProteinGrams: number;
  dailyBudgetVnd: number;
  pushupMaxReps: number;
  soccerMinutesPerWeek: number;
}

export interface WorkoutSetData {
  id: string;
  setNumber: number;
  reps: number;
  weightKg?: number;
  holdSeconds?: number;
  rpe?: number;
}

export interface WorkoutSessionData {
  id: string;
  date: string;
  title: string;
  isSoccerDay: boolean;
  durationMinutes: number;
  caloriesBurnedEstimate: number;
  exercises: {
    exerciseSlug: string;
    exerciseName: string;
    sets: WorkoutSetData[];
  }[];
  notes?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  notes?: string;
}

export interface ExerciseConfig {
  targetSets: number;
  targetReps: number;
  tempo: string;
  restSeconds: number;
  targetRpe: number;
  notes?: string;
  customMediaUrl?: string;
}

export interface CutTrackDataState {
  profile: UserProfileState;
  foods: FoodItem[];
  diary: Record<string, { LUNCH: MealSlotData; DINNER: MealSlotData }>; // keyed by YYYY-MM-DD
  exerciseConfigs?: Record<string, ExerciseConfig>;
  workouts: WorkoutSessionData[];
  measurements: WeightEntry[];
  expenses: { id: string; date: string; title: string; amountVnd: number; category: string }[];
}

function getInitialFoods(): FoodItem[] {
  return [
    {
      id: "food-com-trang",
      slug: "com-trang",
      name: "Cơm trắng",
      category: "STAPLE",
      defaultGrams: 200,
      edibleYieldPercent: 100,
      weightBasis: "COOKED",
      caloriesPer100g: 130,
      proteinPer100g: 2.7,
      carbsPer100g: 28.2,
      fatPer100g: 0.3,
      defaultPriceVnd: 0,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/com-trang.svg",
      detailUrl: "/media/foods/details/com-trang.svg",
      confidenceNote: "Kèm theo suất cơm quán hoặc nấu tại nhà",
      isHomePreparedAllowed: true,
      isRestaurantFood: true,
    },
    {
      id: "food-com-ga-kho",
      slug: "com-ga-kho",
      name: "Cơm gà kho",
      category: "STREET_FOOD",
      defaultGrams: 350,
      edibleYieldPercent: 75,
      weightBasis: "BONE_IN",
      caloriesPer100g: 165,
      proteinPer100g: 9.1,
      carbsPer100g: 17.0,
      fatPer100g: 6.5,
      defaultPriceVnd: 30000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 530,
      maxCaloriesEstimated: 640,
      thumbnailUrl: "/media/foods/thumbnails/com-ga-kho.svg",
      detailUrl: "/media/foods/details/com-ga-kho.svg",
      confidenceNote: "Suất cơm quán tiêu chuẩn 30k • Gà kho sả có xương",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-com-ech-kho",
      slug: "com-ech-kho",
      name: "Cơm ếch kho",
      category: "STREET_FOOD",
      defaultGrams: 340,
      edibleYieldPercent: 70,
      weightBasis: "BONE_IN",
      caloriesPer100g: 145,
      proteinPer100g: 9.5,
      carbsPer100g: 17.5,
      fatPer100g: 4.2,
      defaultPriceVnd: 35000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 450,
      maxCaloriesEstimated: 550,
      thumbnailUrl: "/media/foods/thumbnails/com-ech-kho.svg",
      detailUrl: "/media/foods/details/com-ech-kho.svg",
      confidenceNote: "Suất cơm quán • Thịt ếch giàu đạm ít mỡ",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-com-dau-hu-kho",
      slug: "com-dau-hu-kho",
      name: "Cơm đậu hũ kho",
      category: "STREET_FOOD",
      defaultGrams: 350,
      edibleYieldPercent: 100,
      weightBasis: "COOKED",
      caloriesPer100g: 148,
      proteinPer100g: 6.2,
      carbsPer100g: 19.5,
      fatPer100g: 5.2,
      defaultPriceVnd: 28000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 480,
      maxCaloriesEstimated: 580,
      thumbnailUrl: "/media/foods/thumbnails/com-dau-hu-kho.svg",
      detailUrl: "/media/foods/details/com-dau-hu-kho.svg",
      confidenceNote: "Suất cơm chay hoặc mặn quán • Đậu hũ chiên kho",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-com-thit-kho-trung",
      slug: "com-thit-kho-trung",
      name: "Cơm thịt kho trứng",
      category: "STREET_FOOD",
      defaultGrams: 380,
      edibleYieldPercent: 100,
      weightBasis: "COOKED",
      caloriesPer100g: 185,
      proteinPer100g: 7.8,
      carbsPer100g: 18.2,
      fatPer100g: 9.0,
      defaultPriceVnd: 35000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 650,
      maxCaloriesEstimated: 780,
      thumbnailUrl: "/media/foods/thumbnails/com-thit-kho-trung.svg",
      detailUrl: "/media/foods/details/com-thit-kho-trung.svg",
      confidenceNote: "Suất cơm thịt kho tàu quán (chứa mỡ ba chỉ và đường caramel)",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-bun-rieu",
      slug: "bun-rieu",
      name: "Bún riêu cua bình dân",
      category: "STREET_FOOD",
      defaultGrams: 450,
      edibleYieldPercent: 85,
      weightBasis: "COOKED",
      caloriesPer100g: 95,
      proteinPer100g: 4.8,
      carbsPer100g: 12.5,
      fatPer100g: 3.0,
      defaultPriceVnd: 25000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 390,
      maxCaloriesEstimated: 470,
      thumbnailUrl: "/media/foods/thumbnails/bun-rieu.svg",
      detailUrl: "/media/foods/details/bun-rieu.svg",
      confidenceNote: "Tô bình dân 25k (100g bún chín + huyết + đậu hũ + gạch riêu)",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-bun-bo-hue",
      slug: "bun-bo-hue",
      name: "Bún bò Huế",
      category: "STREET_FOOD",
      defaultGrams: 500,
      edibleYieldPercent: 75,
      weightBasis: "BONE_IN",
      caloriesPer100g: 115,
      proteinPer100g: 6.8,
      carbsPer100g: 12.0,
      fatPer100g: 4.4,
      defaultPriceVnd: 0,
      priceRequiresUserEntry: true,
      minCaloriesEstimated: 520,
      maxCaloriesEstimated: 660,
      thumbnailUrl: "/media/foods/thumbnails/bun-bo-hue.svg",
      detailUrl: "/media/foods/details/bun-bo-hue.svg",
      confidenceNote: "Giá tự nhập tùy quán • Sợi bún to, bắp bò, giò heo có xương, chả cua",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-hu-tieu-nuoc",
      slug: "hu-tieu-nuoc",
      name: "Hủ tiếu nước sườn nạc",
      category: "STREET_FOOD",
      defaultGrams: 450,
      edibleYieldPercent: 80,
      weightBasis: "BONE_IN",
      caloriesPer100g: 98,
      proteinPer100g: 5.5,
      carbsPer100g: 13.0,
      fatPer100g: 2.8,
      defaultPriceVnd: 30000,
      priceRequiresUserEntry: true,
      minCaloriesEstimated: 410,
      maxCaloriesEstimated: 490,
      thumbnailUrl: "/media/foods/thumbnails/hu-tieu-nuoc.svg",
      detailUrl: "/media/foods/details/hu-tieu-nuoc.svg",
      confidenceNote: "Tô hủ tiếu nước quán (100g sợi chín + xương/thịt nạc)",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-trung-ga-luoc",
      slug: "trung-ga-luoc",
      name: "Trứng gà luộc",
      category: "HOMEMADE_PROTEIN",
      defaultGrams: 55,
      edibleYieldPercent: 100,
      weightBasis: "EDIBLE",
      caloriesPer100g: 143,
      proteinPer100g: 12.6,
      carbsPer100g: 0.8,
      fatPer100g: 9.5,
      defaultPriceVnd: 3500,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/trung-ga-luoc.svg",
      detailUrl: "/media/foods/details/trung-ga-luoc.svg",
      confidenceNote: "Trứng gà công nghiệp luộc tại nhà cho bữa tối",
      isHomePreparedAllowed: true,
      isRestaurantFood: false,
    },
    {
      id: "food-ma-dui-ga-luoc",
      slug: "ma-dui-ga-luoc",
      name: "Má đùi gà luộc",
      category: "HOMEMADE_PROTEIN",
      defaultGrams: 150,
      edibleYieldPercent: 65,
      weightBasis: "BONE_IN",
      caloriesPer100g: 165,
      proteinPer100g: 20.0,
      carbsPer100g: 0.0,
      fatPer100g: 9.0,
      defaultPriceVnd: 16000,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/ma-dui-ga-luoc.svg",
      detailUrl: "/media/foods/details/ma-dui-ga-luoc.svg",
      confidenceNote: "Má đùi gà mua chợ luộc tại nhà (150g có xương ~100g thịt nạc ăn được)",
      isHomePreparedAllowed: true,
      isRestaurantFood: false,
    },
    {
      id: "food-nua-con-ga-nuong",
      slug: "nua-con-ga-nuong",
      name: "Nửa con gà nướng",
      category: "SPECIAL_MEAL",
      defaultGrams: 450,
      edibleYieldPercent: 65,
      weightBasis: "BONE_IN",
      caloriesPer100g: 195,
      proteinPer100g: 21.5,
      carbsPer100g: 1.5,
      fatPer100g: 11.5,
      defaultPriceVnd: 95000,
      priceRequiresUserEntry: false,
      minCaloriesEstimated: 750,
      maxCaloriesEstimated: 880,
      thumbnailUrl: "/media/foods/thumbnails/nua-con-ga-nuong.svg",
      detailUrl: "/media/foods/details/nua-con-ga-nuong.svg",
      confidenceNote: "Bữa tiệc phục hồi ngày đá banh (450g cả xương/da ~292g thịt ăn được)",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-com-lam",
      slug: "com-lam",
      name: "Cơm lam ống tre",
      category: "SPECIAL_MEAL",
      defaultGrams: 130,
      edibleYieldPercent: 100,
      weightBasis: "COOKED",
      caloriesPer100g: 205,
      proteinPer100g: 3.8,
      carbsPer100g: 44.0,
      fatPer100g: 1.2,
      defaultPriceVnd: 18000,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/com-lam.svg",
      detailUrl: "/media/foods/details/com-lam.svg",
      confidenceNote: "1 ống cơm lam nếp nướng thơm bùi ngày đá banh",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-banh-bao",
      slug: "banh-bao",
      name: "Bánh bao nhân thịt cút",
      category: "SPECIAL_MEAL",
      defaultGrams: 140,
      edibleYieldPercent: 100,
      weightBasis: "COOKED",
      caloriesPer100g: 250,
      proteinPer100g: 8.5,
      carbsPer100g: 36.0,
      fatPer100g: 7.8,
      defaultPriceVnd: 18000,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/banh-bao.svg",
      detailUrl: "/media/foods/details/banh-bao.svg",
      confidenceNote: "Bánh bao nóng hấp nhân thịt và 2 trứng cút",
      isHomePreparedAllowed: false,
      isRestaurantFood: true,
    },
    {
      id: "food-yomost",
      slug: "yomost",
      name: "Sữa chua uống Yomost",
      category: "BEVERAGE",
      defaultGrams: 170,
      edibleYieldPercent: 100,
      weightBasis: "EDIBLE",
      caloriesPer100g: 65,
      proteinPer100g: 1.0,
      carbsPer100g: 14.5,
      fatPer100g: 0.5,
      defaultPriceVnd: 8500,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/yomost.svg",
      detailUrl: "/media/foods/details/yomost.svg",
      confidenceNote: "Hộp 170ml • Bổ sung đường nhanh nạp trước lúc đá banh",
      isHomePreparedAllowed: true,
      isRestaurantFood: true,
    },
    {
      id: "food-pepsi-zero",
      slug: "pepsi-zero",
      name: "Pepsi Không Calo (Zero)",
      category: "BEVERAGE",
      defaultGrams: 320,
      edibleYieldPercent: 100,
      weightBasis: "EDIBLE",
      caloriesPer100g: 0,
      proteinPer100g: 0.0,
      carbsPer100g: 0.0,
      fatPer100g: 0.0,
      defaultPriceVnd: 10000,
      priceRequiresUserEntry: false,
      thumbnailUrl: "/media/foods/thumbnails/pepsi-zero.svg",
      detailUrl: "/media/foods/details/pepsi-zero.svg",
      confidenceNote: "Lon 320ml • 0 calo, giải tỏa cảm giác thèm ngọt khi ăn trưa",
      isHomePreparedAllowed: true,
      isRestaurantFood: true,
    },
  ];
}

function getInitialState(): CutTrackDataState {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

  return {
    profile: {
      age: 23,
      gender: "male",
      heightCm: 168,
      currentWeightKg: 68.0,
      targetWeightKg: 62.0,
      activityLevel: "sedentary",
      dailyTargetCalories: 1600, // Safe default starting point
      safeMinCalories: 1500,
      safeMaxCalories: 1650,
      targetProteinGrams: 130, // ~1.9g/kg for cutting
      dailyBudgetVnd: 80000,
      pushupMaxReps: 20,
      soccerMinutesPerWeek: 45,
    },
    foods: getInitialFoods(),
    diary: {
      [today]: {
        LUNCH: {
          slot: "LUNCH",
          slotName: "Bữa trưa (Suất quán)",
          items: [
            {
              id: "item-lunch-1",
              foodId: "food-com-ga-kho",
              foodName: "Cơm gà kho",
              grams: 350,
              edibleGrams: 262.5,
              calories: 575,
              protein: 31.8,
              carbs: 59.5,
              fat: 22.7,
              priceVnd: 30000,
              weightBasis: "BONE_IN",
              isHomePrepared: false,
            },
            {
              id: "item-lunch-2",
              foodId: "food-pepsi-zero",
              foodName: "Pepsi Không Calo (Zero)",
              grams: 320,
              edibleGrams: 320,
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              priceVnd: 10000,
              weightBasis: "EDIBLE",
              isHomePrepared: false,
            },
          ],
          totalCalories: 575,
          totalProtein: 31.8,
          totalCarbs: 59.5,
          totalFat: 22.7,
          totalCostVnd: 40000,
        },
        DINNER: {
          slot: "DINNER",
          slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
          items: [
            {
              id: "item-dinner-1",
              foodId: "food-ma-dui-ga-luoc",
              foodName: "Má đùi gà luộc (Nhà làm)",
              grams: 150,
              edibleGrams: 97.5,
              calories: 247,
              protein: 30.0,
              carbs: 0,
              fat: 13.5,
              priceVnd: 16000,
              weightBasis: "BONE_IN",
              isHomePrepared: true,
            },
            {
              id: "item-dinner-2",
              foodId: "food-trung-ga-luoc",
              foodName: "Trứng gà luộc (2 quả)",
              grams: 110,
              edibleGrams: 110,
              calories: 157,
              protein: 13.8,
              carbs: 0.9,
              fat: 10.4,
              priceVnd: 7000,
              weightBasis: "EDIBLE",
              isHomePrepared: true,
            },
            {
              id: "item-dinner-3",
              foodId: "food-com-trang",
              foodName: "Cơm trắng (1 chén nhỏ)",
              grams: 150,
              edibleGrams: 150,
              calories: 195,
              protein: 4.0,
              carbs: 42.3,
              fat: 0.5,
              priceVnd: 0,
              weightBasis: "COOKED",
              isHomePrepared: true,
            },
          ],
          totalCalories: 599,
          totalProtein: 47.8,
          totalCarbs: 43.2,
          totalFat: 24.4,
          totalCostVnd: 23000,
        },
      },
      "2026-10-14": {
        LUNCH: {
          slot: "LUNCH",
          slotName: "Bữa trưa (Suất quán)",
          items: [
            {
              id: "item-prev-1",
              foodId: "food-com-ech-kho",
              foodName: "Cơm ếch kho sả ớt",
              grams: 350,
              edibleGrams: 280,
              calories: 510,
              protein: 31.0,
              carbs: 58.0,
              fat: 17.0,
              priceVnd: 35000,
              weightBasis: "BONE_IN",
              isHomePrepared: false,
            },
          ],
          totalCalories: 510,
          totalProtein: 31.0,
          totalCarbs: 58.0,
          totalFat: 17.0,
          totalCostVnd: 35000,
        },
        DINNER: {
          slot: "DINNER",
          slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
          items: [
            {
              id: "item-prev-2",
              foodId: "food-ma-dui-ga-luoc",
              foodName: "Má đùi gà luộc (Nhà làm)",
              grams: 200,
              edibleGrams: 130,
              calories: 330,
              protein: 40.0,
              carbs: 0,
              fat: 18.0,
              priceVnd: 22000,
              weightBasis: "BONE_IN",
              isHomePrepared: true,
            },
            {
              id: "item-prev-3",
              foodId: "food-com-trang",
              foodName: "Cơm trắng (1 chén)",
              grams: 150,
              edibleGrams: 150,
              calories: 195,
              protein: 4.0,
              carbs: 42.3,
              fat: 0.5,
              priceVnd: 0,
              weightBasis: "COOKED",
              isHomePrepared: true,
            },
          ],
          totalCalories: 525,
          totalProtein: 44.0,
          totalCarbs: 42.3,
          totalFat: 18.5,
          totalCostVnd: 22000,
        },
      },
      "2026-10-13": {
        LUNCH: {
          slot: "LUNCH",
          slotName: "Bữa trưa (Suất quán)",
          items: [
            {
              id: "item-prev-4",
              foodId: "food-bun-bo-hue",
              foodName: "Bún bò Huế (ít nước béo)",
              grams: 550,
              edibleGrams: 550,
              calories: 530,
              protein: 28.5,
              carbs: 65.0,
              fat: 18.0,
              priceVnd: 35000,
              weightBasis: "EDIBLE",
              isHomePrepared: false,
            },
          ],
          totalCalories: 530,
          totalProtein: 28.5,
          totalCarbs: 65.0,
          totalFat: 18.0,
          totalCostVnd: 35000,
        },
        DINNER: {
          slot: "DINNER",
          slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
          items: [
            {
              id: "item-prev-5",
              foodId: "food-trung-ga-luoc",
              foodName: "Trứng gà luộc (3 quả)",
              grams: 165,
              edibleGrams: 165,
              calories: 235,
              protein: 20.7,
              carbs: 1.4,
              fat: 15.6,
              priceVnd: 10500,
              weightBasis: "EDIBLE",
              isHomePrepared: true,
            },
            {
              id: "item-prev-6",
              foodId: "food-com-trang",
              foodName: "Cơm trắng",
              grams: 160,
              edibleGrams: 160,
              calories: 208,
              protein: 4.2,
              carbs: 45.0,
              fat: 0.5,
              priceVnd: 0,
              weightBasis: "COOKED",
              isHomePrepared: true,
            },
          ],
          totalCalories: 443,
          totalProtein: 24.9,
          totalCarbs: 46.4,
          totalFat: 16.1,
          totalCostVnd: 10500,
        },
      },
    },
    exerciseConfigs: {
      "push-up": {
        targetSets: 3,
        targetReps: 12,
        tempo: "2-0-1",
        restSeconds: 60,
        targetRpe: 7.5,
        notes: "Giữ mũi chân thẳng, siết mông gồng bụng, khuỷu tay chếch 45 độ.",
      },
      "diamond-push-up": {
        targetSets: 3,
        targetReps: 10,
        tempo: "2-1-1",
        restSeconds: 60,
        targetRpe: 8,
        notes: "Tập trung lực cơ tay sau, ngực chạm nhẹ kẽ tay.",
      },
      "squat": {
        targetSets: 4,
        targetReps: 15,
        tempo: "2-1-1",
        restSeconds: 60,
        targetRpe: 7.5,
        notes: "Mở gối theo hướng ngón chân, đạp mạnh qua gót.",
      },
      "reverse-lunge": {
        targetSets: 3,
        targetReps: 10,
        tempo: "2-0-1",
        restSeconds: 60,
        targetRpe: 8,
        notes: "Gối sau hạ gần chạm thảm, thân trên thẳng tự nhiên.",
      },
      "plank": {
        targetSets: 3,
        targetReps: 45,
        tempo: "Isometric",
        restSeconds: 45,
        targetRpe: 8,
        notes: "Hóp bụng nhẹ, cuộn xương chậu ra sau, thở đều qua mũi.",
      },
      "reverse-crunch": {
        targetSets: 3,
        targetReps: 12,
        tempo: "2-1-2",
        restSeconds: 45,
        targetRpe: 7.5,
        notes: "Cuộn xương chậu nâng mông lên 5cm khỏi thảm, không giật chân.",
      },
      "dead-bug": {
        targetSets: 3,
        targetReps: 10,
        tempo: "3-1-3",
        restSeconds: 45,
        targetRpe: 7,
        notes: "Thắt lưng ép sát thảm, không để hở khoảng trống sau lưng.",
      },
      "glute-bridge": {
        targetSets: 3,
        targetReps: 15,
        tempo: "2-2-1",
        restSeconds: 45,
        targetRpe: 7,
        notes: "Đẩy hông cao nhất có thể, siết chặt cơ mông 2 giây ở đỉnh.",
      },
      "backpack-row": {
        targetSets: 4,
        targetReps: 12,
        tempo: "2-1-1",
        restSeconds: 60,
        targetRpe: 8,
        notes: "Lưng phẳng, kéo cùi chỏ sát mạn sườn, ép chặt bả vai.",
      },
      "mountain-climber": {
        targetSets: 3,
        targetReps: 30,
        tempo: "Cadence",
        restSeconds: 45,
        targetRpe: 8.5,
        notes: "Gồng chắc vai và cơ lõi, đạp gối nhanh có kiểm soát.",
      },
      "football": {
        targetSets: 1,
        targetReps: 45,
        tempo: "Match Play",
        restSeconds: 0,
        targetRpe: 8.5,
        notes: "Thi đấu 45 phút sân cỏ nhân tạo. Uống đủ nước bù điện giải.",
      },
    },
    workouts: [
      {
        id: "w-1",
        date: today,
        title: "Tập sức mạnh Ngực & Bụng (Thứ Năm)",
        isSoccerDay: false,
        durationMinutes: 35,
        caloriesBurnedEstimate: 160,
        exercises: [
          {
            exerciseSlug: "push-up",
            exerciseName: "Chống đẩy tiêu chuẩn",
            sets: [
              { id: "s1", setNumber: 1, reps: 14, rpe: 7 },
              { id: "s2", setNumber: 2, reps: 12, rpe: 8 },
              { id: "s3", setNumber: 3, reps: 10, rpe: 8.5 },
            ],
          },
          {
            exerciseSlug: "plank",
            exerciseName: "Plank cẳng tay",
            sets: [
              { id: "s4", setNumber: 1, reps: 1, holdSeconds: 45, rpe: 7 },
              { id: "s5", setNumber: 2, reps: 1, holdSeconds: 40, rpe: 8 },
            ],
          },
        ],
        notes: "Tập dưới ngưỡng kiệt sức theo lời khuyên thể lực. Cảm giác cơ ngực căng tốt.",
      },
    ],
    measurements: [
      { id: "m-1", date: "2026-10-09", weightKg: 68.4, waistCm: 82.0 },
      { id: "m-2", date: "2026-10-11", weightKg: 68.2, waistCm: 81.8 },
      { id: "m-3", date: "2026-10-13", weightKg: 68.0, waistCm: 81.5 },
      { id: "m-4", date: today, weightKg: 67.8, waistCm: 81.2, notes: "Bụng dưới nhẹ nhõm hơn, không thấy mệt." },
    ],
    expenses: [
      { id: "e-1", date: today, title: "Cơm trưa gà kho 30k + Pepsi Zero 10k", amountVnd: 40000, category: "LUNCH" },
      { id: "e-2", date: today, title: "Má đùi gà 16k + 2 quả trứng 7k", amountVnd: 23000, category: "DINNER" },
    ],
  };
}

export function loadCutTrackState(): CutTrackDataState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed: CutTrackDataState = JSON.parse(content);
      // Ensure exerciseConfigs and diary exist
      if (!parsed.exerciseConfigs) {
        parsed.exerciseConfigs = getInitialState().exerciseConfigs;
      }
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load local CutTrack state, reinitializing:", err);
  }

  const initial = getInitialState();
  saveCutTrackState(initial);
  return initial;
}

export function saveCutTrackState(state: CutTrackDataState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local CutTrack state:", err);
  }
}

export function getOrCreateDiaryForDate(state: CutTrackDataState, date: string): { LUNCH: MealSlotData; DINNER: MealSlotData } {
  if (state.diary[date]) {
    return state.diary[date];
  }

  const emptyDay: { LUNCH: MealSlotData; DINNER: MealSlotData } = {
    LUNCH: {
      slot: "LUNCH",
      slotName: "Bữa trưa (Suất quán)",
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalCostVnd: 0,
    },
    DINNER: {
      slot: "DINNER",
      slotName: "Bữa tối (Thêm trứng/gà tại nhà)",
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalCostVnd: 0,
    },
  };

  state.diary[date] = emptyDay;
  saveCutTrackState(state);
  return emptyDay;
}
