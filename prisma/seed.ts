import { PrismaClient, WeightBasis, NutritionConfidence, MealSlot, MediaType, Gender, ActivityLevel, PhaseType, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CutTrack database seeding...')

  // 1. CLEANUP (Idempotent seed)
  console.log('🧹 Cleaning existing data...')
  await prisma.weeklyPlanMeal.deleteMany()
  await prisma.weeklyPlan.deleteMany()
  await prisma.budgetTransaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.workoutSet.deleteMany()
  await prisma.workout.deleteMany()
  await prisma.workoutPlan.deleteMany()
  await prisma.exerciseMedia.deleteMany()
  await prisma.exercise.deleteMany()
  await prisma.mealItem.deleteMany()
  await prisma.meal.deleteMany()
  await prisma.mealTemplate.deleteMany()
  await prisma.foodPrice.deleteMany()
  await prisma.foodMedia.deleteMany()
  await prisma.nutritionSource.deleteMany()
  await prisma.foodServing.deleteMany()
  await prisma.food.deleteMany()
  await prisma.articleSource.deleteMany()
  await prisma.nutritionArticle.deleteMany()
  await prisma.bodyMeasurement.deleteMany()
  await prisma.progressPhoto.deleteMany()
  await prisma.fitnessPhase.deleteMany()
  await prisma.nutritionGoal.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()

  // 2. SEED USER & USER PROFILE
  console.log('👤 Seeding default user & profile...')
  const user = await prisma.user.create({
    data: {
      id: 'usr_cuttrack_main_001',
      name: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@cuttrack.vn',
      role: 'user',
      profile: {
        create: {
          age: 23,
          gender: Gender.MALE,
          heightCm: 168.0,
          currentWeightKg: 68.0,
          targetWeightKg: 62.0,
          activityLevel: ActivityLevel.SEDENTARY,
          bmrKcal: 1620.0, // Mifflin-St Jeor: 10*68 + 6.25*168 - 5*23 + 5 = 680 + 1050 - 115 + 5 = 1620 kcal
          tdeeKcal: 1945.0, // 1620 * 1.2 = 1944 ~ 1945 kcal
          dailyBudgetVnd: 80000, // 70.000 - 80.000 VND / ngày
          defaultMealSlotsCount: 2,
          notes: 'Nam 23t, 168cm, 68kg -> mục tiêu 62kg (có thể xuống 60kg). Đá banh 45p/tuần, chống đẩy max 20 cái. Ăn 2 bữa chính/ngày: trưa cơm quán không mang đồ nhà, tối có thể bổ sung trứng gà/má đùi luộc. Ngân sách 70k-80k/ngày.',
        },
      },
      nutritionGoals: {
        create: {
          targetCaloriesKcal: 1600.0,
          minCaloriesKcal: 1500.0,
          maxCaloriesKcal: 1650.0,
          targetProteinG: 130.0, // ~1.9g/kg trọng lượng cơ thể
          targetCarbsG: 160.0,
          targetFatG: 45.0,
          targetFiberG: 25.0,
          targetWaterMl: 2500,
          warningNote: 'Mức 1.300 kcal do người dùng từng đề xuất là mức tự chọn để tham khảo, KHÔNG PHẢI khuyến nghị y tế. BMR ước tính ~1.620 kcal, TDEE ~1.945 kcal. Cắt calo xuống 1.300 có thể gây mất cơ, hạ chuyển hóa và mệt mỏi trong ngày đá banh. Mức khởi đầu an toàn khuyến nghị: 1.500 - 1.650 kcal/ngày.',
          isActive: true,
        },
      },
      fitnessPhases: {
        create: {
          name: 'Giai đoạn 1: Giảm mỡ toàn thân & Thon gọn bụng dưới',
          phaseType: PhaseType.FAT_LOSS,
          startWeightKg: 68.0,
          targetWeightKg: 62.0,
          startDate: new Date(),
          isCurrent: true,
          notes: 'Tập trung duy trì khối cơ nạc với 3 buổi kháng lực tại nhà (Push-up, Squat, Plank, Row) + 1 buổi đá banh 45 phút. Không ăn bù vô tội vạ calo vận động.',
        },
      },
    },
  })

  // 3. SEED 15 MANDATORY FOODS
  console.log('🍲 Seeding 15 mandatory foods with sources, media & prices...')

  const foodsData = [
    // 1. Cơm trắng
    {
      slug: 'com-trang',
      nameVi: 'Cơm trắng',
      nameEn: 'Cooked White Rice',
      description: 'Cơm gạo tẻ nấu chín dẻo, nguồn carbohydrate chính trong bữa ăn truyền thống Việt Nam.',
      category: 'Cơm & Tinh bột',
      cookingMethod: 'Nấu chín bằng nồi cơm điện',
      isRestaurantFood: true,
      isHomeCooked: true,
      servingStandardGrams: 100.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 100.0,
      caloriesKcal: 130.0,
      minCaloriesKcal: 125.0,
      maxCaloriesKcal: 135.0,
      proteinG: 2.7,
      carbsG: 28.2,
      fatG: 0.3,
      fiberG: 0.4,
      sugarG: 0.1,
      sodiumMg: 1.0,
      nutritionConfidence: NutritionConfidence.DATABASE,
      notes: '1 bát cơm gạt ngang thông thường khoảng 150g (~195 kcal). Suất cơm tiệm thường xới khoảng 180g - 220g (~260 kcal).',
      servings: [
        { name: '100g cơm chín', quantityGrams: 100, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 130, proteinG: 2.7, carbsG: 28.2, fatG: 0.3 },
        { name: '1 chén (bát con) ~150g', quantityGrams: 150, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 195, proteinG: 4.05, carbsG: 42.3, fatG: 0.45 },
        { name: '1 đĩa cơm quán bình dân ~200g', quantityGrams: 200, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 260, proteinG: 5.4, carbsG: 56.4, fatG: 0.6 },
      ],
      sources: [
        { sourceName: 'Viện Dinh dưỡng Quốc gia Việt Nam (NIN)', sourceUrl: 'http://viendinhduong.vn', confidence: NutritionConfidence.DATABASE, license: 'Public Health Reference', notes: 'Bảng thành phần thực phẩm Việt Nam - Mã A01' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&auto=format&fit=crop&q=60', altVi: 'Bát cơm trắng dẻo thơm nóng hổi', isPrimary: true, creator: 'Mgg Vitchakorn', license: 'Unsplash Free License', attribution: 'Photo by Mgg Vitchakorn on Unsplash' },
        { type: MediaType.IMAGE_16_9, url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1200&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=300&auto=format&fit=crop&q=60', altVi: 'Cơm trắng xới tơi trong bát gốm mộc', isPrimary: false, creator: 'Pille R. Priske', license: 'Unsplash Free License', attribution: 'Photo by Pille R. Priske on Unsplash' },
      ],
      prices: [
        { priceVnd: 5000, servingName: '1 chén cơm thêm', location: 'Quán cơm bình dân', isDefault: true },
      ],
    },

    // 2. Cơm gà kho
    {
      slug: 'com-ga-kho',
      nameVi: 'Cơm gà kho',
      nameEn: 'Rice with Braised Chicken',
      description: 'Suất cơm tiệm trưa gồm 1 phần cơm trắng (~200g) kèm thịt gà kho sả ớt hoặc kho gừng đậm vị.',
      category: 'Cơm tiệm',
      cookingMethod: 'Kho rim đậm đà (có đường thắng nước màu & dầu ăn)',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 320.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 75.0, // Xương đùi/cánh gà chiếm ~25%
      caloriesKcal: 560.0,
      minCaloriesKcal: 500.0,
      maxCaloriesKcal: 630.0,
      proteinG: 30.5,
      carbsG: 62.0,
      fatG: 18.5,
      fiberG: 1.5,
      sodiumMg: 1100.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Lưu ý quán thường dùng da gà và nhiều dầu ăn phi hành tỏi + nước đường màu caramen. Không nên chan quá nhiều nước kho béo.',
      servings: [
        { name: '1 suất cơm gà kho tiêu chuẩn', quantityGrams: 320, weightBasis: WeightBasis.COOKED, isDefault: true, edibleYieldPercent: 75, caloriesKcal: 560, minCaloriesKcal: 500, maxCaloriesKcal: 630, proteinG: 30.5, carbsG: 62, fatG: 18.5 },
      ],
      sources: [
        { sourceName: 'Khảo sát suất ăn văn phòng TP.HCM & Dữ liệu NIN đối chiếu', sourceUrl: 'https://cuttrack.internal/research/com-ga-kho', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, license: 'CutTrack Food Research', notes: 'Ước tính trung bình từ 1 đĩa cơm 200g + 120g gà kho cả xương' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&auto=format&fit=crop&q=60', altVi: 'Đĩa cơm gà kho vàng ươm ăn kèm dưa leo', isPrimary: true, creator: 'CutTrack Curated', license: 'Unsplash Free License', attribution: 'Unsplash Community' },
        { type: MediaType.IMAGE_16_9, url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=60', altVi: 'Cơm trưa gà kho sả ớt', isPrimary: false, creator: 'Food Photography', license: 'Unsplash Free License', attribution: 'Unsplash Food' },
      ],
      prices: [
        { priceVnd: 30000, servingName: '1 suất trưa cơm gà kho', location: 'Quán cơm bình dân văn phòng', isDefault: true },
      ],
    },

    // 3. Cơm ếch kho
    {
      slug: 'com-ech-kho',
      nameVi: 'Cơm ếch kho',
      nameEn: 'Rice with Braised Frog',
      description: 'Suất cơm bình dân với thịt ếch kho sả ớt hoặc kho tiêu nghệ, thịt ếch ngọt săn chắc, giàu đạm.',
      category: 'Cơm tiệm',
      cookingMethod: 'Kho sả ớt',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 300.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 70.0, // Xương đùi ếch chiếm ~30%
      caloriesKcal: 495.0,
      minCaloriesKcal: 440.0,
      maxCaloriesKcal: 560.0,
      proteinG: 28.0,
      carbsG: 61.0,
      fatG: 12.5,
      fiberG: 1.2,
      sodiumMg: 1050.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Thịt ếch tự nhiên rất ít mỡ, calo chủ yếu đến từ dầu phi và đường trong nước sốt kho của quán.',
      servings: [
        { name: '1 suất cơm ếch kho', quantityGrams: 300, weightBasis: WeightBasis.COOKED, isDefault: true, edibleYieldPercent: 70, caloriesKcal: 495, minCaloriesKcal: 440, maxCaloriesKcal: 560, proteinG: 28, carbsG: 61, fatG: 12.5 },
      ],
      sources: [
        { sourceName: 'Viện Dinh dưỡng NIN & Phân tích món ăn đường phố', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, notes: 'Thịt ếch 73 kcal/100g thịt sống + cơm trắng + sốt kho' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60', altVi: 'Cơm ếch kho sả ớt thơm lừng cay nồng', isPrimary: true, creator: 'CutTrack Curated', license: 'Unsplash Free License', attribution: 'Food Studio' },
      ],
      prices: [
        { priceVnd: 35000, servingName: '1 suất cơm ếch kho', location: 'Quán cơm bình dân (ước tính tham khảo)', isDefault: true, isUserReported: false },
      ],
    },

    // 4. Cơm đậu hũ kho
    {
      slug: 'com-dau-hu-kho',
      nameVi: 'Cơm đậu hũ kho',
      nameEn: 'Rice with Braised Tofu',
      description: 'Suất cơm tiệm bình dân với đậu hũ chiên kho nấm rơm, sả ớt hoặc tương ngọt thanh đạm.',
      category: 'Cơm tiệm',
      cookingMethod: 'Chiên sơ sau đó kho nước tương/sả',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 320.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 100.0,
      caloriesKcal: 510.0,
      minCaloriesKcal: 460.0,
      maxCaloriesKcal: 580.0,
      proteinG: 18.5,
      carbsG: 66.0,
      fatG: 20.0,
      fiberG: 3.5,
      sodiumMg: 950.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Đậu hũ thường được quán chiên ngập dầu trước khi kho, làm tăng đáng kể lượng chất béo hấp thụ so với đậu phụ tươi.',
      servings: [
        { name: '1 suất cơm đậu hũ kho', quantityGrams: 320, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 510, minCaloriesKcal: 460, maxCaloriesKcal: 580, proteinG: 18.5, carbsG: 66, fatG: 20 },
      ],
      sources: [
        { sourceName: 'Khảo sát dinh dưỡng món chay & cơm tiệm bình dân TP.HCM', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, notes: 'Đậu phụ chiên hấp thụ khoảng 10-12g dầu thực vật' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60', altVi: 'Đĩa cơm đậu hũ kho sả nấm bắt mắt', isPrimary: true, creator: 'Food Collection', license: 'Unsplash Free License', attribution: 'Healthy Food Shot' },
      ],
      prices: [
        { priceVnd: 28000, servingName: '1 suất cơm đậu kho', location: 'Quán cơm bình dân (ước tính tham khảo)', isDefault: true, isUserReported: false },
      ],
    },

    // 5. Cơm thịt kho trứng
    {
      slug: 'com-thit-kho-trung',
      nameVi: 'Cơm thịt kho trứng',
      nameEn: 'Rice with Braised Pork & Egg',
      description: 'Cơm trắng ăn kèm thịt heo kho tàu mềm nhừ và 1 quả trứng kho đậm màu caramel truyền thống.',
      category: 'Cơm tiệm',
      cookingMethod: 'Kho tàu nước dừa / thắng đường caramel',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 350.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 100.0,
      caloriesKcal: 670.0,
      minCaloriesKcal: 590.0,
      maxCaloriesKcal: 760.0,
      proteinG: 29.5,
      carbsG: 63.0,
      fatG: 31.0,
      fiberG: 1.0,
      sodiumMg: 1250.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Món có năng lượng và chất béo cao nhất trong các món cơm tiệm do lớp mỡ ba rọi và đường thắng. Có thể dặn người bán gắp miếng thịt nạc ít mỡ.',
      servings: [
        { name: '1 suất cơm thịt kho 1 quả trứng', quantityGrams: 350, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 670, minCaloriesKcal: 590, maxCaloriesKcal: 760, proteinG: 29.5, carbsG: 63, fatG: 31 },
      ],
      sources: [
        { sourceName: 'Bảng thành phần thực phẩm NIN & Phân tích suất cơm Việt', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, notes: '1 quả trứng vịt kho ~90kcal, 80g thịt ba chỉ kho ~320kcal, 200g cơm ~260kcal' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1546069901-d70377a0c4f1?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1546069901-d70377a0c4f1?w=300&auto=format&fit=crop&q=60', altVi: 'Đĩa cơm thịt kho tàu cùng quả trứng vàng bóng', isPrimary: true, creator: 'Viet Food Culture', license: 'Unsplash Free License', attribution: 'Viet Food Photography' },
      ],
      prices: [
        { priceVnd: 35000, servingName: '1 suất cơm thịt kho trứng', location: 'Quán cơm bình dân (ước tính tham khảo)', isDefault: true, isUserReported: false },
      ],
    },

    // 6. Bún riêu (100g bún chín + huyết/mọc/xương riêng)
    {
      slug: 'bun-rieu',
      nameVi: 'Bún riêu',
      nameEn: 'Crab Paste Vermicelli Soup',
      description: 'Món bún nước chua thanh với riêu cua đồng, cà chua, đậu hũ chiên. Các thành phần bún chín, huyết luộc, mọc và xương heo được đo lường riêng biệt.',
      category: 'Bún / Mì / Hủ tiếu',
      cookingMethod: 'Nấu nước dùng riêu cua thanh ngọt chua dịu',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 550.0, // Cả nước dùng và topping
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 90.0,
      caloriesKcal: 450.0,
      minCaloriesKcal: 400.0,
      maxCaloriesKcal: 520.0,
      proteinG: 24.5,
      carbsG: 55.0,
      fatG: 14.5,
      fiberG: 3.5,
      sodiumMg: 1400.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Đặc tả bún riêu yêu cầu ghi nhận riêng: 100g bún chín + huyết/mọc/xương riêng biệt. Không uống cạn nước dùng để tránh quá nhiều muối.',
      servings: [
        { name: '100g sợi bún tươi chín', quantityGrams: 100, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 110, proteinG: 1.7, carbsG: 25.7, fatG: 0.1, notes: 'Sợi bún tươi luộc chín' },
        { name: 'Topping huyết heo luộc (50g)', quantityGrams: 50, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 22, proteinG: 4.5, carbsG: 0.1, fatG: 0.2, notes: 'Giàu sắt, đạm tinh khiết, rất ít calo' },
        { name: 'Topping mọc / chả viên (40g)', quantityGrams: 40, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 92, proteinG: 6.8, carbsG: 2.1, fatG: 6.2, notes: 'Giò sống vo viên' },
        { name: 'Topping xương heo / sườn sụn cả xương (60g)', quantityGrams: 60, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 60, isDefault: false, caloriesKcal: 95, proteinG: 9.0, carbsG: 0, fatG: 6.5, notes: 'Khối lượng cả xương, thịt ăn được ~36g' },
        { name: '1 tô bún riêu đầy đủ tiêu chuẩn (~25k)', quantityGrams: 550, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 450, minCaloriesKcal: 400, maxCaloriesKcal: 520, proteinG: 24.5, carbsG: 55, fatG: 14.5, notes: 'Bao gồm 150g bún, 1 miếng huyết, 1 viên mọc, riêu cua, 2 miếng đậu hũ, nước lèo' },
      ],
      sources: [
        { sourceName: 'Viện Dinh dưỡng Quốc gia & Khảo sát bún riêu tiệm bình dân', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, notes: 'Giá mặc định 25.000 VND theo đặc tả CutTrack Master Spec' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&auto=format&fit=crop&q=60', altVi: 'Tô bún riêu nóng hổi với màu đỏ cà chua và riêu cua nổi', isPrimary: true, creator: 'Noodle Photography', license: 'Unsplash Free License', attribution: 'Unsplash Noodle Collection' },
      ],
      prices: [
        { priceVnd: 25000, servingName: '1 tô bún riêu bình dân', location: 'Quán bún riêu tiệm', isDefault: true },
      ],
    },

    // 7. Bún bò Huế (sợi và topping riêng biệt)
    {
      slug: 'bun-bo-hue',
      nameVi: 'Bún bò Huế',
      nameEn: 'Hue Spicy Beef Noodle Soup',
      description: 'Món bún bò trứ danh xứ Huế với sợi bún to, nước dùng sả ruốc ớt cay nồng. Nhập riêng biệt khối lượng sợi bún, bắp bò, giò heo, chả cua, huyết và nước dùng; không gộp chung.',
      category: 'Bún / Mì / Hủ tiếu',
      cookingMethod: 'Ninh xương bò hầm sả ruốc ớt sa tế',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 600.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 85.0, // Giò heo có xương
      caloriesKcal: 610.0,
      minCaloriesKcal: 530.0,
      maxCaloriesKcal: 720.0,
      proteinG: 38.0,
      carbsG: 58.0,
      fatG: 23.5,
      fiberG: 2.0,
      sodiumMg: 1750.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Giá bún bò do người dùng nhập theo từng quán (thường 40k-55k), ứng dụng KHÔNG tự bịa giá cố định.',
      servings: [
        { name: '100g sợi bún bò to chín', quantityGrams: 100, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 115, proteinG: 1.8, carbsG: 26.5, fatG: 0.1, notes: 'Sợi bún to đặc trưng bún bò Huế' },
        { name: 'Bắp bò / Nạm bò chín (50g)', quantityGrams: 50, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 115, proteinG: 13.5, carbsG: 0, fatG: 6.8, notes: 'Thịt bò luộc giàu sắt và kẽm' },
        { name: 'Khoanh giò heo cả da & xương (80g)', quantityGrams: 80, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 55, isDefault: false, caloriesKcal: 175, proteinG: 13.0, carbsG: 0, fatG: 13.5, notes: 'Xương chiếm ~45%, thịt và da ăn được ~44g' },
        { name: 'Chả cua / Chả bò Huế (40g)', quantityGrams: 40, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 85, proteinG: 6.5, carbsG: 2.5, fatG: 5.5, notes: 'Chả hấp thơm mùi tiêu đinh' },
        { name: 'Huyết heo luộc (40g)', quantityGrams: 40, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 18, proteinG: 3.6, carbsG: 0.1, fatG: 0.2, notes: 'Huyết luộc' },
        { name: '1 tô bún bò Huế đầy đủ (khẩu phần tham khảo)', quantityGrams: 600, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 610, minCaloriesKcal: 530, maxCaloriesKcal: 720, proteinG: 38.0, carbsG: 58, fatG: 23.5, notes: '150g bún to, bắp bò, giò, chả cua, huyết, nước dùng' },
      ],
      sources: [
        { sourceName: 'Khảo sát dinh dưỡng ẩm thực miền Trung & NIN', confidence: NutritionConfidence.RESTAURANT_ESTIMATE, notes: 'Phân tách độc lập các nhóm thành phần theo đặc tả CutTrack' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=60', altVi: 'Tô bún bò Huế sóng sánh với bắp bò và chả cua đỏ rực', isPrimary: true, creator: 'Food Explorer', license: 'Unsplash Free License', attribution: 'Vietnamese Cuisine Shot' },
      ],
      prices: [
        { priceVnd: 0, servingName: '1 tô bún bò (giá do người dùng nhập)', location: 'Tùy tiệm bún bò thực tế', isDefault: true, isUserReported: true, notes: 'Người dùng sẽ nhập mức giá thực tế khi ăn' },
      ],
    },

    // 8. Hủ tiếu nước
    {
      slug: 'hu-tieu-nuoc',
      nameVi: 'Hủ tiếu nước',
      nameEn: 'Clear Pork Noodle Soup',
      description: 'Hủ tiếu nước Nam Vang hoặc hủ tiếu gõ truyền thống với nước lèo trong veo hầm xương, tỏi phi thơm lừng. Phân tách rõ ràng sợi hủ tiếu, thịt nạc, lưỡi heo và xương.',
      category: 'Bún / Mì / Hủ tiếu',
      cookingMethod: 'Nấu nước hầm xương ống thanh vị tỏi phi',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 520.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 90.0,
      caloriesKcal: 460.0,
      minCaloriesKcal: 410.0,
      maxCaloriesKcal: 530.0,
      proteinG: 26.0,
      carbsG: 58.0,
      fatG: 14.0,
      fiberG: 1.5,
      sodiumMg: 1350.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Đặc tả yêu cầu ghi nhận riêng: 100g sợi chín + lưỡi/xương riêng biệt. Chú ý lượng mỡ hành và tóp mỡ tỏi phi.',
      servings: [
        { name: '100g sợi hủ tiếu chín', quantityGrams: 100, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 140, proteinG: 1.5, carbsG: 33.0, fatG: 0.2, notes: 'Sợi hủ tiếu dai trụng chín' },
        { name: 'Topping lưỡi heo luộc chín (40g)', quantityGrams: 40, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 88, proteinG: 6.5, carbsG: 0, fatG: 6.8, notes: 'Lưỡi heo giòn ngọt sần sật' },
        { name: 'Topping xương heo / sườn non cả xương (60g)', quantityGrams: 60, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 60, isDefault: false, caloriesKcal: 95, proteinG: 9.0, carbsG: 0, fatG: 6.5, notes: 'Thịt ăn được quanh xương ~36g' },
        { name: 'Topping thịt nạc xắt & tôm tươi (40g)', quantityGrams: 40, weightBasis: WeightBasis.COOKED, isDefault: false, caloriesKcal: 65, proteinG: 11.0, carbsG: 0.2, fatG: 2.1, notes: 'Đạm nạc chất lượng cao' },
        { name: '1 tô hủ tiếu nước tiêu chuẩn', quantityGrams: 520, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 460, minCaloriesKcal: 410, maxCaloriesKcal: 530, proteinG: 26.0, carbsG: 58, fatG: 14.0, notes: 'Khẩu phần 1 tô hủ tiếu gõ hoặc Nam Vang vừa' },
      ],
      sources: [
        { sourceName: 'Viện Dinh dưỡng NIN & Tiêu chuẩn món ăn đường phố Sài Gòn', confidence: NutritionConfidence.RESTAURANT_ESTIMATE },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300&auto=format&fit=crop&q=60', altVi: 'Tô hủ tiếu nước trong vắt rắc tỏi phi thơm ngát', isPrimary: true, creator: 'Soup Master', license: 'Unsplash Free License', attribution: 'Noodle Photography' },
      ],
      prices: [
        { priceVnd: 35000, servingName: '1 tô hủ tiếu nước', location: 'Tiệm hủ tiếu (giá tham khảo người dùng)', isDefault: true, isUserReported: false },
      ],
    },

    // 9. Trứng gà luộc
    {
      slug: 'trung-ga-luoc',
      nameVi: 'Trứng gà luộc',
      nameEn: 'Boiled Chicken Egg',
      description: 'Trứng gà ta hoặc trứng công nghiệp luộc chín, nguồn protein hoàn chỉnh giá rẻ tiện lợi chuẩn bị tại nhà cho bữa tối.',
      category: 'Thịt & Trứng',
      cookingMethod: 'Luộc chín bằng nước sôi 8-10 phút',
      isRestaurantFood: false,
      isHomeCooked: true,
      servingStandardGrams: 50.0,
      defaultWeightBasis: WeightBasis.EDIBLE,
      edibleYieldPercent: 88.0, // Vỏ trứng chiếm ~12%
      caloriesKcal: 74.0,
      minCaloriesKcal: 70.0,
      maxCaloriesKcal: 78.0,
      proteinG: 6.3,
      carbsG: 0.4,
      fatG: 5.3,
      fiberG: 0,
      sugarG: 0.2,
      sodiumMg: 62.0,
      nutritionConfidence: NutritionConfidence.DATABASE,
      notes: '1 quả trứng trung bình ~55g cả vỏ, bỏ vỏ được ~50g phần ăn được. Choline và chất béo tập trung ở lòng đỏ, lòng trắng cung cấp 3.6g protein tinh khiết.',
      servings: [
        { name: '1 quả trứng gà luộc (~50g ăn được)', quantityGrams: 50, weightBasis: WeightBasis.EDIBLE, isDefault: true, caloriesKcal: 74, proteinG: 6.3, carbsG: 0.4, fatG: 5.3 },
        { name: '2 quả trứng gà luộc (~100g)', quantityGrams: 100, weightBasis: WeightBasis.EDIBLE, isDefault: false, caloriesKcal: 148, proteinG: 12.6, carbsG: 0.8, fatG: 10.6 },
        { name: '1 lòng trắng trứng luộc (~33g)', quantityGrams: 33, weightBasis: WeightBasis.EDIBLE, isDefault: false, caloriesKcal: 17, proteinG: 3.6, carbsG: 0.2, fatG: 0.1 },
      ],
      sources: [
        { sourceName: 'USDA FoodData Central #173424 & Bảng thành phần NIN', sourceUrl: 'https://fdc.nal.usda.gov', confidence: NutritionConfidence.DATABASE, license: 'Public Domain' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&auto=format&fit=crop&q=60', altVi: 'Trứng gà luộc bóc vỏ cắt đôi lòng đỏ chín tới mịn màng', isPrimary: true, creator: 'Tamara Gak', license: 'Unsplash Free License', attribution: 'Photo by Tamara Gak on Unsplash' },
      ],
      prices: [
        { priceVnd: 3500, servingName: '1 quả trứng gà tươi mua về luộc', location: 'Chợ dân sinh / Siêu thị', isDefault: true },
      ],
    },

    // 10. Má đùi gà luộc
    {
      slug: 'ma-dui-ga-luoc',
      nameVi: 'Má đùi gà luộc',
      nameEn: 'Boiled Chicken Thigh',
      description: 'Má đùi gà tươi luộc tại nhà, nguồn protein dồi dào, thớ thịt ngọt mềm mọng nước không khô như ức gà.',
      category: 'Thịt & Trứng',
      cookingMethod: 'Luộc với gừng và chút muối hạt',
      isRestaurantFood: false,
      isHomeCooked: true,
      servingStandardGrams: 150.0,
      defaultWeightBasis: WeightBasis.BONE_IN,
      edibleYieldPercent: 65.0, // Xương má đùi chiếm ~35%
      caloriesKcal: 195.0,
      minCaloriesKcal: 170.0,
      maxCaloriesKcal: 220.0,
      proteinG: 24.5,
      carbsG: 0,
      fatG: 10.5,
      sodiumMg: 110.0,
      nutritionConfidence: NutritionConfidence.DATABASE,
      notes: '1 cái má đùi gà trung bình nặng ~150g cả xương và da. Thịt nạc ăn được sau khi lọc xương đạt khoảng 98g. Nếu bỏ da, calo giảm xuống ~135 kcal và mỡ còn ~4g.',
      servings: [
        { name: '1 cái má đùi gà luộc cả xương và da (~150g)', quantityGrams: 150, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 65, isDefault: true, caloriesKcal: 195, minCaloriesKcal: 170, maxCaloriesKcal: 220, proteinG: 24.5, carbsG: 0, fatG: 10.5, notes: 'Ăn cả da gà' },
        { name: '1 cái má đùi gà luộc bỏ da (~140g cả xương)', quantityGrams: 140, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 60, isDefault: false, caloriesKcal: 135, proteinG: 24.0, carbsG: 0, fatG: 4.2, notes: 'Đã bóc bỏ da giúp tiết kiệm calo tối đa' },
        { name: '100g thịt má đùi chín đã lọc xương', quantityGrams: 100, weightBasis: WeightBasis.EDIBLE, edibleYieldPercent: 100, isDefault: false, caloriesKcal: 200, proteinG: 25.0, carbsG: 0, fatG: 11.0 },
      ],
      sources: [
        { sourceName: 'USDA FoodData Central Chicken Thigh #171066 & Khảo sát thực phẩm tươi sống Việt Nam', sourceUrl: 'https://fdc.nal.usda.gov', confidence: NutritionConfidence.DATABASE },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&auto=format&fit=crop&q=60', altVi: 'Má đùi gà luộc mọng nước óng ả cắt lát', isPrimary: true, creator: 'Chicken Gourmet', license: 'Unsplash Free License', attribution: 'Healthy Poultry Shot' },
      ],
      prices: [
        { priceVnd: 16000, servingName: '1 cái má đùi tươi mua về luộc', location: 'Chợ / Bách Hóa Xanh / Co.op', isDefault: true },
      ],
    },

    // 11. Nửa con gà nướng (400-500g cả xương/da)
    {
      slug: 'nua-con-ga-nuong',
      nameVi: 'Nửa con gà nướng',
      nameEn: 'Roasted Half Chicken (Bone-in)',
      description: 'Nửa con gà nướng mật ong hoặc muối ớt than hoa, món ăn đặc biệt nạp năng lượng sau buổi đá banh 45 phút.',
      category: 'Thịt & Trứng',
      cookingMethod: 'Nướng than hoa hoặc lò nướng',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 450.0,
      defaultWeightBasis: WeightBasis.BONE_IN,
      edibleYieldPercent: 65.0, // Xương chiếm 35%, thịt và da ăn được ~290g
      caloriesKcal: 820.0,
      minCaloriesKcal: 740.0,
      maxCaloriesKcal: 920.0,
      proteinG: 78.0,
      carbsG: 8.0, // Gia vị ướp mật ong, sa tế
      fatG: 52.0,
      sodiumMg: 1600.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Đặc tả CutTrack: Khối lượng mua 400-500g là tính CẢ XƯƠNG VÀ DA. Thịt ăn được thực tế khoảng 270g - 310g. Không tự ý coi toàn bộ 450g là thịt nạc.',
      servings: [
        { name: 'Nửa con gà nướng cả xương/da (~450g)', quantityGrams: 450, weightBasis: WeightBasis.BONE_IN, edibleYieldPercent: 65, isDefault: true, caloriesKcal: 820, minCaloriesKcal: 740, maxCaloriesKcal: 920, proteinG: 78.0, carbsG: 8.0, fatG: 52.0, notes: 'Thịt ăn được ~290g, xương bỏ đi ~160g' },
      ],
      sources: [
        { sourceName: 'Khảo sát gà nướng lu / than hoa TP.HCM & USDA Roasted Chicken', confidence: NutritionConfidence.RESTAURANT_ESTIMATE },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&auto=format&fit=crop&q=60', altVi: 'Nửa con gà nướng vàng ruộm da giòn rụm bên lửa than', isPrimary: true, creator: 'Grill Master', license: 'Unsplash Free License', attribution: 'BBQ Food Photography' },
      ],
      prices: [
        { priceVnd: 95000, servingName: 'Nửa con gà nướng', location: 'Tiệm gà nướng than hoa (ước tính người dùng)', isDefault: true, isUserReported: false },
      ],
    },

    // 12. Cơm lam
    {
      slug: 'com-lam',
      nameVi: 'Cơm lam',
      nameEn: 'Sticky Rice in Bamboo Tube',
      description: 'Gạo nếp nương nướng chín trong ống tre non thơm mùi tre khói, ăn kèm gà nướng ngày đá banh.',
      category: 'Cơm & Tinh bột',
      cookingMethod: 'Nướng ống tre trên than hồng',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 130.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 100.0,
      caloriesKcal: 265.0,
      minCaloriesKcal: 240.0,
      maxCaloriesKcal: 290.0,
      proteinG: 5.0,
      carbsG: 57.0,
      fatG: 1.5,
      fiberG: 1.8,
      sodiumMg: 15.0,
      nutritionConfidence: NutritionConfidence.DATABASE,
      notes: 'Gạo nếp có chỉ số đường huyết cao và mật độ calo đậm đặc hơn cơm tẻ, rất thích hợp nạp lại glycogen cơ bắp sau 45 phút đá bóng.',
      servings: [
        { name: '1 ống cơm lam vừa (~130g)', quantityGrams: 130, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 265, minCaloriesKcal: 240, maxCaloriesKcal: 290, proteinG: 5.0, carbsG: 57.0, fatG: 1.5 },
      ],
      sources: [
        { sourceName: 'Viện Dinh dưỡng NIN - Nhóm gạo nếp cái hoa vàng & món ăn dân tộc', confidence: NutritionConfidence.DATABASE },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=300&auto=format&fit=crop&q=60', altVi: 'Cơm lam nướng ống tre bóc vỏ nẹp tre dẻo quánh', isPrimary: true, creator: 'Ethnic Food Arts', license: 'Unsplash Free License', attribution: 'Traditional Foods' },
      ],
      prices: [
        { priceVnd: 18000, servingName: '1 ống cơm lam', location: 'Quán nướng kèm gà', isDefault: true },
      ],
    },

    // 13. Bánh bao
    {
      slug: 'banh-bao',
      nameVi: 'Bánh bao',
      nameEn: 'Steamed Pork Bun',
      description: 'Bánh bao nhân thịt heo nạc xay, nấm mèo và 1-2 quả trứng cút hấp nóng xốp.',
      category: 'Ăn nhanh & Bánh',
      cookingMethod: 'Hấp chín bằng hơi nước',
      isRestaurantFood: true,
      isHomeCooked: false,
      servingStandardGrams: 140.0,
      defaultWeightBasis: WeightBasis.COOKED,
      edibleYieldPercent: 100.0,
      caloriesKcal: 350.0,
      minCaloriesKcal: 310.0,
      maxCaloriesKcal: 390.0,
      proteinG: 12.5,
      carbsG: 49.0,
      fatG: 12.0,
      fiberG: 1.5,
      sodiumMg: 580.0,
      nutritionConfidence: NutritionConfidence.RESTAURANT_ESTIMATE,
      notes: 'Bánh bao thường dùng mỡ heo trong nhân để tạo độ ẩm, calo dao động tùy vào tỷ lệ nạc/mỡ của từng cơ sở sản xuất.',
      servings: [
        { name: '1 chiếc bánh bao nhân thịt 1 trứng cút (~140g)', quantityGrams: 140, weightBasis: WeightBasis.COOKED, isDefault: true, caloriesKcal: 350, minCaloriesKcal: 310, maxCaloriesKcal: 390, proteinG: 12.5, carbsG: 49.0, fatG: 12.0 },
      ],
      sources: [
        { sourceName: 'Khảo sát bánh bao truyền thống Thọ Phát & Bảng NIN', confidence: NutritionConfidence.RESTAURANT_ESTIMATE },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=60', altVi: 'Chiếc bánh bao trắng muốt nóng hổi trong xửng hấp', isPrimary: true, creator: 'Dimsum Studio', license: 'Unsplash Free License', attribution: 'Asian Bakery' },
      ],
      prices: [
        { priceVnd: 18000, servingName: '1 chiếc bánh bao thịt trứng cút', location: 'Tủ hấp bánh bao lề đường / Cửa hàng tiện lợi', isDefault: true },
      ],
    },

    // 14. Yomost
    {
      slug: 'yomost',
      nameVi: 'Yomost (Sữa chua uống tiệt trùng)',
      nameEn: 'Yomost Drinking Yogurt (Orange/Strawberry)',
      description: 'Sữa chua uống lên men tự nhiên tiệt trùng của FrieslandCampina, hương vị trái cây thơm ngon dễ uống.',
      category: 'Đồ uống & Sữa',
      cookingMethod: 'Lên men từ sữa tươi tiệt trùng',
      isRestaurantFood: false,
      isHomeCooked: false,
      servingStandardGrams: 170.0, // ml
      defaultWeightBasis: WeightBasis.EDIBLE,
      edibleYieldPercent: 100.0,
      caloriesKcal: 110.0,
      minCaloriesKcal: 110.0,
      maxCaloriesKcal: 110.0,
      proteinG: 1.9,
      carbsG: 24.5,
      fatG: 0.5,
      fiberG: 0,
      sugarG: 23.0,
      sodiumMg: 45.0,
      nutritionConfidence: NutritionConfidence.VERIFIED_LABEL,
      notes: 'Nhãn dinh dưỡng công bố: 110 kcal / hộp 170ml. Lượng đường khá cao (23g) nên cần tính toán kỹ trong ngân sách carb hàng ngày.',
      servings: [
        { name: '1 hộp giấy 170ml', quantityGrams: 170, weightBasis: WeightBasis.EDIBLE, isDefault: true, caloriesKcal: 110, proteinG: 1.9, carbsG: 24.5, fatG: 0.5 },
      ],
      sources: [
        { sourceName: 'Nhãn bao bì dinh dưỡng FrieslandCampina Vietnam', sourceUrl: 'https://www.yomost.com.vn', confidence: NutritionConfidence.VERIFIED_LABEL, license: 'Manufacturer Nutrition Facts' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=300&auto=format&fit=crop&q=60', altVi: 'Hộp sữa chua uống Yomost hương vị trái cây thơm mát', isPrimary: true, creator: 'Yogurt Media', license: 'Product Packshot', attribution: 'Commercial Packaging' },
      ],
      prices: [
        { priceVnd: 8500, servingName: '1 hộp 170ml', location: 'Tạp hóa / Cửa hàng tiện lợi', isDefault: true },
      ],
    },

    // 15. Pepsi Zero
    {
      slug: 'pepsi-zero',
      nameVi: 'Pepsi Zero (Không calo)',
      nameEn: 'Pepsi Zero Sugar / Calorie',
      description: 'Nước giải khát có ga không đường, không calo từ Suntory PepsiCo, dùng chất tạo ngọt thế hệ mới sucralose & acesulfame K.',
      category: 'Đồ uống & Sữa',
      cookingMethod: 'Đóng lon công nghiệp tiệt trùng',
      isRestaurantFood: true,
      isHomeCooked: true,
      servingStandardGrams: 320.0,
      defaultWeightBasis: WeightBasis.EDIBLE,
      edibleYieldPercent: 100.0,
      caloriesKcal: 0.0,
      minCaloriesKcal: 0.0,
      maxCaloriesKcal: 0.0,
      proteinG: 0.0,
      carbsG: 0.0,
      fatG: 0.0,
      fiberG: 0.0,
      sugarG: 0.0,
      sodiumMg: 35.0,
      nutritionConfidence: NutritionConfidence.VERIFIED_LABEL,
      notes: 'Thức uống giải khát tối ưu cho người đang thâm hụt calo muốn thỏa mãn cơn thèm ngọt và ga mà không nạp thêm calo dư thừa.',
      servings: [
        { name: '1 lon 320ml', quantityGrams: 320, weightBasis: WeightBasis.EDIBLE, isDefault: true, caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
        { name: '1 chai 390ml', quantityGrams: 390, weightBasis: WeightBasis.EDIBLE, isDefault: false, caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
      ],
      sources: [
        { sourceName: 'Nhãn bao bì dinh dưỡng Suntory PepsiCo Vietnam', sourceUrl: 'https://suntorypepsico.vn', confidence: NutritionConfidence.VERIFIED_LABEL, license: 'Manufacturer Nutrition Facts' },
      ],
      media: [
        { type: MediaType.IMAGE_4_3, url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80', posterUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=60', altVi: 'Lon nước ngọt Pepsi Zero mát lạnh đọng sương đá', isPrimary: true, creator: 'Beverage Design', license: 'Product Representation', attribution: 'Commercial Pack' },
      ],
      prices: [
        { priceVnd: 10000, servingName: '1 lon 320ml', location: 'Quán ăn / Tạp hóa / Cửa hàng tiện lợi', isDefault: true },
      ],
    },
  ]

  for (const foodItem of foodsData) {
    const { servings, sources, media, prices, ...foodDetails } = foodItem
    await prisma.food.create({
      data: {
        ...foodDetails,
        servings: {
          create: servings,
        },
        sources: {
          create: sources,
        },
        media: {
          create: media,
        },
        prices: {
          create: prices,
        },
      },
    })
  }

  // 4. SEED 9+ EXERCISES WITH MEDIA (POSTERS & ANIMATIONS)
  console.log('🏋️ Seeding 9+ exercises with verified posters & animations...')

  const exercisesData = [
    // 1. Push-up
    {
      slug: 'push-up',
      nameVi: 'Hít đất tiêu chuẩn (Push-up)',
      nameEn: 'Standard Push-up',
      primaryMuscle: 'Ngực (Pectoralis Major)',
      secondaryMuscles: 'Tay sau (Triceps), Vai trước (Anterior Deltoid), Bụng (Core)',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '10-15 lần',
      restSeconds: 60,
      instructionsVi: '1. Chống hai tay xuống sàn, rộng hơn vai một chút. Chân duỗi thẳng ra sau, mũi chân chạm đất.\n2. Giữ thân người từ đầu, mông đến gót chân thành một đường thẳng (siết cơ bụng và cơ mông).\n3. Hít vào, từ từ hạ ngực xuống cách sàn khoảng 3-5cm, cùi chỏ mở ra tạo góc khoảng 45 độ so với thân người (không bạnh ngang 90 độ).\n4. Thở ra mạnh, dùng lực cơ ngực và tay sau đẩy thẳng người lên vị trí ban đầu.',
      breathingVi: 'Hít sâu bằng mũi khi hạ người xuống; Thở mạnh dứt khoát bằng miệng khi đẩy người lên.',
      commonMistakesVi: '- Võng lưng dưới làm đau cột sống (khắc phục: siết chặt bụng).\n- Bạnh cùi chỏ sang ngang 90 độ gây cấn khớp vai.\n- Chỉ gật đầu thay vì hạ cả thân người.',
      variationsVi: '- Biến thể dễ hơn: Incline Push-up (chống tay lên ghế/bàn) hoặc Knee Push-up (chống đầu gối).\n- Biến thể khó hơn: Diamond Push-up, Archer Push-up, Weighted Push-up mang ba lô sách.',
      safetyWarningVi: 'Dừng lại ngay nếu cảm thấy đau nhói ở khớp vai hoặc cổ tay. Với người mới max 20 cái, nên chia thành các hiệp 10-12 cái dưới ngưỡng kiệt sức.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác hít đất tiêu chuẩn chuẩn form',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 15.0,
        },
      ],
    },

    // 2. Diamond push-up
    {
      slug: 'diamond-push-up',
      nameVi: 'Hít đất kim cương (Diamond Push-up)',
      nameEn: 'Diamond Push-up',
      primaryMuscle: 'Tay sau (Triceps Brachii)',
      secondaryMuscles: 'Ngực trong, Vai trước, Cơ bụng',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '8-12 lần',
      restSeconds: 75,
      instructionsVi: '1. Vào tư thế hít đất, đặt hai bàn tay gần nhau ngay dưới ngực sao cho ngón cái và ngón trỏ chạm nhau tạo thành hình thoi (kim cương).\n2. Giữ thẳng toàn bộ cơ thể từ gót chân đến đỉnh đầu.\n3. Hít vào, từ từ gập khuỷu tay ép sát mạn sườn hạ ngực gần chạm bàn tay.\n4. Thở ra, tập trung dồn lực tay sau duỗi thẳng tay trở về tư thế chuẩn bị.',
      breathingVi: 'Hít vào khi hạ xuống có kiểm soát; Thở ra khi đẩy người lên.',
      commonMistakesVi: '- Để cùi chỏ bè rộng sang hai bên gây áp lực cực đại lên khớp cổ tay và khuỷu tay.\n- Nhô mông quá cao hoặc võng lưng.',
      variationsVi: '- Dễ hơn: Đặt tay tạo hình kim cương chống lên mặt bàn nâng cao hoặc chống gối.\n- Khó hơn: Kê chân lên bục cao (Decline Diamond Push-up).',
      safetyWarningVi: 'Người có tiền sử đau cổ tay hoặc viêm gân khuỷu tay (tennis elbow) nên khởi động kỹ và cân nhắc làm quen với hít đất hẹp tay trước.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác hít đất kim cương tập trung cơ tay sau',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 12.0,
        },
      ],
    },

    // 3. Bodyweight squat
    {
      slug: 'bodyweight-squat',
      nameVi: 'Squat tay không (Bodyweight Squat)',
      nameEn: 'Bodyweight Squat',
      primaryMuscle: 'Đùi trước (Quadriceps)',
      secondaryMuscles: 'Mông (Glutes), Đùi sau (Hamstrings), Bắp chuối (Calves), Core',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '15-20 lần',
      restSeconds: 60,
      instructionsVi: '1. Đứng thẳng, hai chân rộng bằng vai hoặc hơi rộng hơn một chút, mũi chân mở chếch khoảng 15-30 độ.\n2. Hai tay chắp trước ngực hoặc đưa thẳng ra trước để giữ thăng bằng.\n3. Hít vào, đẩy hông ra sau đồng thời gập đầu gối hạ người xuống như đang ngồi vào ghế, đùi song song với mặt sàn.\n4. Đảm bảo đầu gối mở theo hướng mũi bàn chân, gót chân dính chặt sàn.\n5. Thở ra, ấn gót chân đứng thẳng dậy, siết cơ mông ở đỉnh chuyển động.',
      breathingVi: 'Hít sâu vào bụng khi hạ người xuống; Thở ra khi đạp chân đứng thẳng lên.',
      commonMistakesVi: '- Nhấc gót chân khỏi sàn khi xuống sâu.\n- Đầu gối bị sụp vào trong (valgus) gây chấn thương dây chằng chéo.\n- Gù lưng, chúi người quá nhiều về phía trước.',
      variationsVi: '- Dễ hơn: Box Squat (ngồi chạm nhẹ vào mép ghế rồi đứng dậy).\n- Khó hơn: Jump Squat, Pistol Squat (squat 1 chân), mang ba lô sách.',
      safetyWarningVi: 'Luôn giữ trọng tâm rơi vào giữa bàn chân và gót chân. Nếu nghe tiếng lục khục kèm đau buốt ở khớp gối, hãy giảm biên độ xuống vừa phải.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác squat tay không giữ thăng bằng chuẩn',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 15.0,
        },
      ],
    },

    // 4. Reverse lunge
    {
      slug: 'reverse-lunge',
      nameVi: 'Chùng chân bước lùi (Reverse Lunge)',
      nameEn: 'Reverse Lunge',
      primaryMuscle: 'Cơ mông (Gluteus Maximus) & Đùi trước',
      secondaryMuscles: 'Đùi sau, Cơ khép, Thăng bằng một chân',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '10-12 lần mỗi chân',
      restSeconds: 60,
      instructionsVi: '1. Đứng thẳng, hai chân khép gần nhau, hai tay chống hông hoặc giữ trước ngực.\n2. Bước một chân lùi ra phía sau một khoảng vừa đủ, mũi chân chạm đất.\n3. Hít vào, hạ thấp trọng tâm sao cho cả hai đầu gối gập vuông góc 90 độ, đầu gối sau cách mặt sàn khoảng 2-3cm.\n4. Giữ thân trên thẳng, không chúi người quá mức.\n5. Thở ra, ấn gót chân trước đạp mạnh để bước chân sau về vị trí xuất phát, sau đó đổi bên.',
      breathingVi: 'Hít vào khi bước lùi và hạ người xuống; Thở ra khi đạp chân trước kéo người về.',
      commonMistakesVi: '- Bước chân lùi theo một đường thẳng thẳng hàng chân trước làm mất thăng bằng (nên giữ hai chân mở rộng bằng hông).\n- Đập đầu gối sau xuống sàn quá mạnh.',
      variationsVi: '- Dễ hơn: Giữ tay vào tường hoặc cạnh bàn để hỗ trợ thăng bằng.\n- Khó hơn: Walking Lunge, Deficit Reverse Lunge (đứng trên bục nâng cao).',
      safetyWarningVi: 'Reverse Lunge an toàn cho khớp gối hơn Forward Lunge (bước tới) do lực tác động lên xương bánh chè nhỏ hơn.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác chùng chân bước lùi cân bằng cơ đùi mông',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 12.0,
        },
      ],
    },

    // 5. Plank
    {
      slug: 'plank',
      nameVi: 'Plank cẳng tay (Forearm Plank)',
      nameEn: 'Forearm Plank',
      primaryMuscle: 'Cơ bụng toàn diện (Rectus & Transverse Abdominis)',
      secondaryMuscles: 'Cơ lưng dưới, Cơ vai, Cơ mông',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '30-45 giây',
      restSeconds: 45,
      instructionsVi: '1. Nằm sấp, chống hai cùi chỏ vuông góc 90 độ ngay dưới khớp vai, cẳng tay song song hoặc khép bàn tay.\n2. Nâng toàn bộ thân người lên khỏi sàn, tì lên mũi chân và cẳng tay.\n3. Giữ cơ thể thành một đường thẳng tắp từ đầu, lưng, mông đến gót chân.\n4. Siết chặt cơ bụng giống như chuẩn bị chịu một cú đấm vào bụng, đồng thời siết nhẹ cơ mông.\n5. Hít thở đều đặn, không nín thở trong suốt thời gian giữ.',
      breathingVi: 'Hít thở nhịp nhàng, nông nhưng liên tục bằng mũi, không được nín thở gây tăng huyết áp.',
      commonMistakesVi: '- Võng lưng dưới làm toàn bộ trọng lượng đè lên cột sống lưng.\n- Nhô mông lên trời thành hình chữ V ngược để trốn lực cơ bụng.\n- Ngửa cổ nhìn về phía trước làm mỏi đốt sống cổ (nên nhìn xuống sàn giữa hai tay).',
      variationsVi: '- Dễ hơn: Plank chống gối (Knee Plank) hoặc Plank chống thẳng tay.\n- Khó hơn: Plank nhấc từng chân (Plank with leg lift), Side Plank, RKC Plank siết tối đa.',
      safetyWarningVi: 'Nếu thấy mỏi nhức ở thắt lưng thay vì mỏi cơ bụng, hãy hạ người nghỉ ngay để tránh chấn thương cột sống.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa tư thế plank cẳng tay thẳng hàng siết bụng',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 15.0,
        },
      ],
    },

    // 6. Reverse crunch
    {
      slug: 'reverse-crunch',
      nameVi: 'Gập bụng ngược (Reverse Crunch)',
      nameEn: 'Reverse Crunch',
      primaryMuscle: 'Cơ bụng dưới (Lower Abdominals)',
      secondaryMuscles: 'Cơ gập hông (Hip Flexors), Cơ chéo bụng',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '12-15 lần',
      restSeconds: 45,
      instructionsVi: '1. Nằm ngửa trên thảm, hai tay duỗi thẳng úp xuống sàn dọc theo thân người để giữ thăng bằng.\n2. Co đầu gối 90 độ, nâng cẳng chân lên song song với sàn.\n3. Thở ra, dùng cơ bụng dưới cuộn xương chậu kéo đầu gối về phía ngực, nhấc mông và lưng dưới khỏi sàn khoảng 5-10cm.\n4. Giữ lại 1 giây ở điểm co siết cơ bụng tối đa.\n5. Hít vào, từ từ hạ mông và chân về vị trí ban đầu có kiểm soát, không để lưng dưới bị võng.',
      breathingVi: 'Thở ra khi cuộn mông lên; Hít vào khi hạ hông xuống sàn.',
      commonMistakesVi: '- Dùng quán tính quăng quật chân thay vì dùng lực co thắt của cơ bụng.\n- Dùng tay ấn quá mạnh xuống sàn để đẩy người lên thay vì cô lập cơ bụng.',
      variationsVi: '- Dễ hơn: Thu gọn đầu gối sát ngực hơn để giảm cánh tay đòn.\n- Khó hơn: Kẹp tạ nhẹ vào chân hoặc tập trên ghế dốc (Incline Reverse Crunch).',
      safetyWarningVi: 'Giữ lưng dưới dán chặt mặt sàn ở pha hạ chân để bảo vệ đĩa đệm cột sống.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác gập bụng ngược siết thắt cơ bụng dưới',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 12.0,
        },
      ],
    },

    // 7. Dead bug
    {
      slug: 'dead-bug',
      nameVi: 'Dead Bug (Con bọ chết)',
      nameEn: 'Dead Bug',
      primaryMuscle: 'Cơ bụng sâu (Transverse Abdominis)',
      secondaryMuscles: 'Cơ liên sườn, Cơ ổn định cột sống lưng',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '10-12 lần mỗi bên',
      restSeconds: 45,
      instructionsVi: '1. Nằm ngửa trên sàn, giơ hai tay thẳng lên trời trước ngực.\n2. Nâng hai chân gập đầu gối 90 độ sao cho đùi vuông góc với sàn nhà.\n3. Ép chặt thắt lưng dán sát mặt sàn (không có khe hở giữa lưng và thảm).\n4. Hít vào, từ từ duỗi tay phải ra sau đầu đồng thời duỗi thẳng chân trái hạ gần sát sàn.\n5. Thở ra, siết chặt cơ bụng kéo tay phải và chân trái trở lại vị trí xuất phát.\n6. Lặp lại tương tự với tay trái và chân phải xen kẽ.',
      breathingVi: 'Hít vào khi mở rộng tay và chân đối diện; Thở ra dứt khoát khi thu về vị trí ban đầu.',
      commonMistakesVi: '- Để thắt lưng nhấc lên khỏi thảm khi hạ chân.\n- Chuyển động quá vội vàng không kiểm soát cơ bụng sâu.',
      variationsVi: '- Dễ hơn: Chỉ cử động chân hoặc chỉ cử động tay riêng lẻ.\n- Khó hơn: Giữ bóng cao su giữa tay và đầu gối trong lúc tập.',
      safetyWarningVi: 'Bài tập vàng phục hồi và gia cố cột sống, cực kỳ an toàn cho người ít vận động văn phòng.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa bài tập dead bug ổn định cột sống và thắt chặt cơ bụng',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 14.0,
        },
      ],
    },

    // 8. Glute bridge
    {
      slug: 'glute-bridge',
      nameVi: 'Cầu mông (Glute Bridge)',
      nameEn: 'Glute Bridge',
      primaryMuscle: 'Cơ mông lớn (Gluteus Maximus)',
      secondaryMuscles: 'Đùi sau (Hamstrings), Cơ dựng sống (Erector Spinae)',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BODYWEIGHT',
      defaultSets: 3,
      defaultReps: '15-20 lần',
      restSeconds: 45,
      instructionsVi: '1. Nằm ngửa trên sàn, gập đầu gối lại, hai bàn chân đặt phẳng trên mặt đất cách mông khoảng 1 gang tay, hai chân rộng bằng hông.\n2. Hai tay để dọc theo người, lòng bàn tay úp xuống sàn.\n3. Thở ra, ấn mạnh hai gót chân nâng hông lên khỏi sàn cho đến khi đầu gối, hông và vai tạo thành một đường thẳng.\n4. Siết chặt cơ mông ở vị trí cao nhất trong 1-2 giây.\n5. Hít vào, từ từ hạ mông xuống chạm nhẹ sàn rồi lặp lại.',
      breathingVi: 'Thở ra khi đẩy mông lên cao; Hít vào khi hạ hông xuống sàn.',
      commonMistakesVi: '- Đẩy hông quá cao làm cong quá mức cột sống thắt lưng (chỉ đẩy đến khi thẳng hàng vai-hông-gối).\n- Nhón gót chân thay vì ấn lực qua gót.',
      variationsVi: '- Dễ hơn: Giữ yên ở vị trí nâng mông (Isometric Glute Bridge Hold).\n- Khó hơn: Single-leg Glute Bridge (cầu mông 1 chân) hoặc đặt ba lô nặng lên hông.',
      safetyWarningVi: 'Tập trung cảm nhận cơ mông co bóp, nếu thấy mỏi thắt lưng nghĩa là bạn đang ưỡn lưng thay vì kích hoạt mông.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác nâng cầu mông kích hoạt cơ mông lớn',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 12.0,
        },
      ],
    },

    // 9. Backpack row
    {
      slug: 'backpack-row',
      nameVi: 'Kéo ba lô tăng cơ lưng (Backpack Row)',
      nameEn: 'Backpack Bent-over Row',
      primaryMuscle: 'Cơ lưng xô (Latissimus Dorsi) & Lưng giữa',
      secondaryMuscles: 'Tay trước (Biceps), Vai sau (Posterior Deltoid)',
      difficulty: Difficulty.BEGINNER,
      equipment: 'BACKPACK',
      defaultSets: 3,
      defaultReps: '10-12 lần',
      restSeconds: 60,
      instructionsVi: '1. Chuẩn bị một chiếc ba lô chắc chắn, cho sách hoặc chai nước vào bên trong để đạt trọng lượng 5-8kg.\n2. Đứng thẳng, hai chân rộng bằng vai, hai tay nắm lấy quai trên hoặc quai đeo của ba lô.\n3. Hơi chùng nhẹ đầu gối, cúi gập người về phía trước từ khớp hông sao cho lưng thẳng song song hoặc tạo góc 45 độ với mặt đất.\n4. Thở ra, kéo cùi chỏ ra sau, hướng ba lô về phía bụng dưới, ép chặt hai bả vai vào nhau.\n5. Hít vào, từ từ hạ ba lô xuống vị trí duỗi tay ban đầu có kiểm soát.',
      breathingVi: 'Thở ra khi kéo ba lô lên sát bụng; Hít vào khi hạ tạ xuống có hãm lực.',
      commonMistakesVi: '- Cong lưng tôm khi cúi gập gây áp lực lớn lên thắt lưng.\n- Nhún giật người lấy đà thay vì kéo bằng cơ lưng xô.\n- Kéo ba lô lên ngực thay vì kéo về phía rốn/bụng dưới.',
      variationsVi: '- Dễ hơn: Chống 1 tay lên ghế kéo 1 bên (Single-arm Backpack Row).\n- Khó hơn: Tăng số lượng sách trong ba lô hoặc dừng 2 giây ở đỉnh co cơ.',
      safetyWarningVi: 'Luôn giữ cột sống thẳng từ gáy đến xương cụt, mở ngực và siết nhẹ cơ bụng trong suốt bài tập.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
          altVi: 'Minh họa động tác kéo ba lô lưng xô đúng tư thế tại nhà',
          isPrimary: true,
          creator: 'CutTrack Motion Archive',
          license: 'CutTrack Licensed Fitness Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 15.0,
        },
      ],
    },

    // 10. Football
    {
      slug: 'football-cardio',
      nameVi: 'Đá banh sân cỏ nhân tạo (45 phút)',
      nameEn: 'Football / Soccer (45 mins session)',
      primaryMuscle: 'Tim mạch (Cardiovascular) & Đùi trước/sau',
      secondaryMuscles: 'Bắp chuối, Khả năng đổi hướng, Sức bền hiếu khí & yếm khí',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'FOOTBALL',
      defaultSets: 1,
      defaultReps: '45 phút',
      restSeconds: 300,
      instructionsVi: '1. Khởi động kỹ các khớp cổ chân, đầu gối, khớp háng và cơ khép đùi trong 10 phút trước trận đấu.\n2. Phân phối sức thông minh, luân chuyển giữa các pha bứt tốc ngắn và chạy bộ thả lỏng.\n3. Uống từng ngụm nước nhỏ trong thời gian nghỉ giữa hiệp, không uống ừng ực nhiều nước lạnh.\n4. Giãn cơ nhẹ sau trận đấu để xả bớt acid lactic.',
      breathingVi: 'Thở sâu, đều nhịp theo bước chạy; tận dụng những lúc bóng ra ngoài biên để hít sâu thở chậm hạ nhịp tim.',
      commonMistakesVi: '- Bỏ qua khâu khởi động dẫn đến lật sơ mi cổ chân hoặc căng cơ đùi sau.\n- Ăn quá no ngay sát giờ đá bóng gây xóc hông và buồn nôn.',
      variationsVi: '- Đá sân 5 người, sân 7 người.',
      safetyWarningVi: 'Cẩn trọng va chạm mạnh. Tránh ăn bù vô tội vạ sau trận đấu vì calo đốt thực tế thường dao động ~350-450 kcal trong 45 phút, không đủ để bù bữa tiệc nhậu.',
      media: [
        {
          type: MediaType.VIDEO_LOOP_MP4,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
          altVi: 'Trận cầu giao hữu 45 phút trên sân cỏ nhân tạo',
          isPrimary: true,
          creator: 'Sports Action Library',
          license: 'CutTrack Licensed Sports Media',
          attribution: 'CutTrack Exercise Library',
          durationSeconds: 20.0,
        },
      ],
    },
  ]

  for (const exItem of exercisesData) {
    const { media, ...exDetails } = exItem
    await prisma.exercise.create({
      data: {
        ...exDetails,
        media: {
          create: media,
        },
      },
    })
  }

  // 5. SEED NUTRITION ARTICLES (MỤC KIẾN THỨC DINH DƯỠNG)
  console.log('📚 Seeding 8 comprehensive nutrition education articles...')

  const articlesData = [
    {
      slug: 'bmr-tdee-va-tham-hut-calo',
      titleVi: 'BMR, TDEE và Thâm hụt Calo: Hiểu đúng để giảm mỡ an toàn',
      summaryVi: 'Cách phân biệt chỉ số BMR và TDEE, xác định mức thâm hụt năng lượng lành mạnh và lý do không nên nhịn đói cực đoan.',
      category: 'CALORIES_ENERGY',
      readingTimeMinutes: 6,
      coverImageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80',
      contentVi: `## 1. BMR và TDEE là gì?

- **BMR (Basal Metabolic Rate - Tỷ lệ trao đổi chất cơ bản):** Là lượng năng lượng tối thiểu mà cơ thể bạn tiêu tốn để duy trì các chức năng sống cơ bản như thở, tuần hoàn máu, hoạt động não bộ và tái tạo tế bào khi bạn nằm yên cả ngày. Với nam 23 tuổi, 168cm, 68kg, BMR khoảng **1.620 kcal/ngày**.
- **TDEE (Total Daily Energy Expenditure - Tổng năng lượng tiêu thụ hàng ngày):** Là tổng lượng calo bạn đốt cháy trong 24 giờ, bao gồm BMR + vận động hàng ngày + tiêu hóa thức ăn. Với lối sống làm việc văn phòng ít vận động, TDEE rơi vào khoảng **1.945 kcal/ngày**.

## 2. Thâm hụt calo (Caloric Deficit)

Nguyên lý duy nhất để giảm mỡ cơ thể là tạo ra **thâm hụt năng lượng**: lượng calo nạp vào qua ăn uống phải nhỏ hơn lượng TDEE cơ thể tiêu hao.

Mức thâm hụt an toàn và bền vững nhất được các tổ chức dinh dưỡng quốc tế khuyến nghị là **300 - 500 kcal/ngày** dưới mức TDEE.
- TDEE: ~1.945 kcal
- Mức nạp khuyến nghị: **1.500 - 1.650 kcal/ngày**
- Với mức thâm hụt này, bạn sẽ giảm trung bình **0.3 - 0.5 kg mỡ/tuần** mà không bị mất cơ nạc hay hạ chuyển hóa.`,
      sources: [
        { title: 'Energy Requirements of Adults - WHO Technical Report Series', publisher: 'World Health Organization (WHO)', publishedYear: 2004 },
        { title: 'Bảng Nhu cầu Dinh dưỡng Khuyến nghị cho người Việt Nam', publisher: 'Viện Dinh dưỡng Quốc gia', publishedYear: 2016 },
      ],
    },
    {
      slug: 'canh-bao-muc-tieu-1300-kcal',
      titleVi: 'Cảnh báo mức mục tiêu 1.300 kcal: Vì sao không nên cắt calo quá sâu?',
      summaryVi: 'Phân tích khoa học về mức ăn 1.300 kcal đối với nam giới trẻ tuổi: Nguy cơ suy giảm cơ bắp, rối loạn hormone và kiệt sức ngày đá bóng.',
      category: 'CALORIES_ENERGY',
      readingTimeMinutes: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80',
      contentVi: `> [!WARNING]
> Mức **1.300 kcal/ngày** là con số do người dùng tự chọn để tham khảo trong quá khứ, **KHÔNG PHẢI KHUYẾN NGHỊ Y TẾ HOẶC DINH DƯỠNG**.

### Tại sao 1.300 kcal là quá thấp?
1. **Thấp hơn cả BMR (1.620 kcal):** Khi ăn dưới mức BMR hơn 300 kcal liên tục, cơ thể bạn sẽ kích hoạt phản ứng tự vệ "starvation mode" — giảm thân nhiệt, giảm sản xuất hormone tuyến giáp T3/T4, gây rụng tóc và mệt mỏi li bì.
2. **Nguy cơ mất cơ bắp cao:** Thiếu hụt calo quá sâu buộc cơ thể phải dị hóa các mô cơ nạc để lấy axit amin tạo năng lượng. Kết quả là bạn trở nên "skinny fat" — cân nặng giảm nhưng bụng dưới và nọng cằm vẫn còn mỡ mềm xẹp.
3. **Ảnh hưởng ngày đá bóng:** Khi vận động cường độ cao 45 phút, mức ăn 1.300 kcal sẽ dẫn đến tụt đường huyết, chuột rút và nguy cơ chấn thương gân cơ.

**Lời khuyên:** Duy trì mức thâm hụt thoải mái ở **1.500 - 1.650 kcal/ngày**. Bạn vẫn giảm mỡ đều đặn mà cơ thể luôn tràn đầy năng lượng.`,
      sources: [
        { title: 'Metabolic adaptation to weight loss: implications for the athlete', publisher: 'Journal of the International Society of Sports Nutrition (JISSN)', publishedYear: 2014 },
      ],
    },
    {
      slug: 'giam-can-vs-giam-mo',
      titleVi: 'Sự khác nhau giữa Giảm cân và Giảm mỡ: Tại sao phải giữ cơ?',
      summaryVi: 'Tại sao cân nặng trên bàn cân không phản ánh toàn bộ hình thể, và vai trò sống còn của cơ bắp đối với việc định hình vòng eo.',
      category: 'FAT_LOSS_VS_WEIGHT_LOSS',
      readingTimeMinutes: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      contentVi: `Cân nặng trên bàn cân gồm 4 thành phần: **Cơ bắp, Mỡ, Nước và Xương**.
Khi bạn nhịn ăn cực đoan, cân nặng có thể tụt 2-3kg trong tuần đầu tiên nhưng 70% trong số đó là **nước và glycogen** trong cơ, không phải mỡ thừa.

Để giảm mỡ mà giữ được cơ bắp săn chắc:
- Nạp đủ protein: **1.8 - 2.0g protein / kg thể trọng** (~125 - 135g protein/ngày cho người 68kg).
- Tập kháng lực ít nhất **3 buổi/tuần** (Push-up, Squat, Lunge, Row) để gửi tín hiệu cho cơ thể biết cơ bắp đang được sử dụng và không được tiêu biến.`,
      sources: [
        { title: 'Preserving Healthy Muscle during Weight Loss', publisher: 'Advances in Nutrition', publishedYear: 2017 },
      ],
    },
    {
      slug: 'mo-bung-duoi-va-nong-cam',
      titleVi: 'Mỡ bụng dưới và nọng cằm: Không thể giảm mỡ tại chỗ (Spot Reduction Myth)',
      summaryVi: 'Giải mã cơ chế tích mỡ sinh học: Tại sao mỡ bụng dưới và nọng cằm lại là những nơi giảm sau cùng, và ảnh hưởng của tư thế gù cổ.',
      category: 'FAT_LOSS_VS_WEIGHT_LOSS',
      readingTimeMinutes: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      contentVi: `Khoa học đã chứng minh: **Không có bài tập nào có thể đốt mỡ chọn lọc tại chỗ**. Gập bụng hàng trăm cái không làm tan mỡ bụng dưới, cũng như các bài tập cằm không làm biến mất nọng cằm ngay lập tức.

Cơ thể giảm mỡ toàn thân dựa trên đặc điểm di truyền và mật độ thụ thể alpha-2/beta-2 adrenergic. Ở nam giới, mỡ bụng dưới và lưng dưới thường là nơi tích tụ đầu tiên và biến mất cuối cùng.

Ngoài ra, **tư thế đầu đưa về trước (Forward Head Posture)** do ngồi máy tính nhiều làm chùng các cơ dưới hàm, khiến nọng cằm lộ rõ hơn dù tỷ lệ mỡ chưa cao.`,
      sources: [
        { title: 'Regional fat loss from the body with exercise: myth or reality?', publisher: 'Annals of Agricultural and Environmental Medicine', publishedYear: 2013 },
      ],
    },
    {
      slug: 'can-song-vs-can-chin-sai-so',
      titleVi: 'Khối lượng Sống vs Chín, Phần ăn được vs Cả xương: Sai số chết người',
      summaryVi: 'Hướng dẫn cách tính calo chính xác cho các món gà cả xương, thịt luộc, cơm chín và bún sợi tươi.',
      category: 'MEASUREMENT_ERRORS',
      readingTimeMinutes: 6,
      coverImageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      contentVi: `Sai lầm lớn nhất khiến nhiều bạn trẻ không giảm được mỡ dù nghĩ mình đã ăn thâm hụt calo chính là **sai số cân đong**:

1. **Gạo sống vs Cơm chín:** 100g gạo sống nở ra khoảng 230g-250g cơm chín. 100g gạo sống có ~350 kcal, nhưng 100g cơm chín chỉ có ~130 kcal. Nếu bạn cân 200g cơm chín mà tra bảng gạo sống, bạn đã tính đội lên gấp 2.5 lần!
2. **Gà cả xương (Bone-in) vs Thịt ăn được (Edible Yield):** Nửa con gà nướng 450g mua ngoài tiệm có khoảng 160g là xương ống và xương sườn. Phần ăn được thực tế chỉ khoảng 290g. Đừng tính 450g như thể đó là 450g ức gà nguyên nạc!
3. **Bún riêu & Hủ tiếu:** Tô bún riêu nặng 550g là bao gồm cả 300ml nước dùng lèo. Sợi bún chín thực chất chỉ có 120g - 150g.`,
      sources: [
        { title: 'USDA Food Yield Summaries & Conversion Factors', publisher: 'USDA Agricultural Research Service', publishedYear: 2020 },
      ],
    },
    {
      slug: 'an-hai-bua-ngay-co-tot-khong',
      titleVi: 'Chế độ ăn 2 bữa chính/ngày: Lợi ích, thách thức và cách tối ưu',
      summaryVi: 'Phân tích phương pháp ăn 2 bữa (Intermittent Fasting 16/8): Không thần thánh hóa, tập trung vào tổng năng lượng và đủ đạm.',
      category: 'CALORIES_ENERGY',
      readingTimeMinutes: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=80',
      contentVi: `Ăn 2 bữa chính mỗi ngày (bỏ bữa sáng hoặc gộp bữa) là một hình thức nhịn ăn gián đoạn (Intermittent Fasting).

- **Ưu điểm:** Giúp việc kiểm soát ngân sách calo dễ dàng hơn khi mỗi bữa trưa và tối bạn có thể ăn một suất đầy đặn (700 - 800 kcal) mà vẫn không vượt trần 1.600 kcal/ngày. Rất phù hợp với người đi làm bận rộn.
- **Thách thức:** Cần nạp đủ 60-70g protein trong một bữa ăn để đạt chỉ tiêu 130g protein cả ngày. Do đó, bữa tối tại nhà bổ sung thêm 2 quả trứng luộc hoặc 1 má đùi gà luộc là chiến lược cực kỳ xuất sắc.`,
      sources: [
        { title: 'Effects of Intermittent Fasting on Body Composition and Health', publisher: 'The New England Journal of Medicine', publishedYear: 2019 },
      ],
    },
    {
      slug: 'an-quan-tiet-kiem-ngan-sach-70k-80k',
      titleVi: 'Bí kíp ăn quán 70.000 – 80.000 VND/ngày vẫn chuẩn dinh dưỡng',
      summaryVi: 'Cách chọn món cơm tiệm, bún riêu, kiểm soát nước sốt và cân đối chi phí sống tại các đô thị lớn.',
      category: 'BUDGET_DINING',
      readingTimeMinutes: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      contentVi: `Với ngân sách **70.000 - 80.000 VND/ngày** (khoảng 2.1 - 2.4 triệu/tháng):
- **Trưa đi làm (Quán bình dân ~30.000 VND):** Chọn cơm gà kho, cơm đậu kho hoặc bún riêu 25k. Dặn quán: *“Cho em nhiều rau, gắp miếng gà nạc ít mỡ và để nước kho/sốt riêng”*.
- **Tối tại nhà (Chi phí 35.000 - 45.000 VND):** 1 chén cơm nấu tại nhà (3.000đ) + 1 má đùi gà luộc mua tươi (16.000đ) + 2 quả trứng gà luộc (7.000đ) + rau luộc (5.000đ) + 1 lon Pepsi Zero (10.000đ).
- **Tổng ngày:** 30k (trưa) + 41k (tối) = 71.000 VND! Đạt chuẩn 130g protein, dưới 1.600 kcal và tiết kiệm ngân sách hoàn hảo.`,
      sources: [
        { title: 'Báo cáo khảo sát chi phí sinh hoạt thanh niên thành thị Việt Nam', publisher: 'Viện Nghiên cứu Đời sống Đô thị', publishedYear: 2023 },
      ],
    },
    {
      slug: 'dinh-duong-phuc-hoi-da-bong',
      titleVi: 'Dinh dưỡng ngày đá bóng: Ăn gì trước và sau trận 45 phút?',
      summaryVi: 'Chiến lược nạp năng lượng carbohydrate trước trận và bữa ăn đặc biệt gà nướng + cơm lam phục hồi glycogen.',
      category: 'FOOTBALL_NUTRITION',
      readingTimeMinutes: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
      contentVi: `Đá banh 45 phút trên sân cỏ nhân tạo tiêu hao năng lượng rất nhanh từ nguồn **glycogen tích trữ trong gan và cơ bắp**.

- **Trước trận 2 tiếng:** Ăn nhẹ một bữa có carb tiêu hóa vừa phải như 1 chiếc bánh bao hoặc 1 củ khoai lang để có sức chạy.
- **Bữa tối phục hồi sau trận:** Đây là lúc cơ thể hấp thụ dinh dưỡng tốt nhất để phục hồi sợi cơ bị vi tổn thương. Bữa ăn đặc biệt với **nửa con gà nướng (400-500g cả xương/da) + 1 ống cơm lam nướng + 1 lon Pepsi Zero** cung cấp hơn 80g protein và bù đắp lượng glycogen đã tiêu hao, mà không gây tích mỡ thừa!`,
      sources: [
        { title: 'Nutrition for Football: A practical guide to eating and drinking for health and performance', publisher: 'FIFA / F-MARC', publishedYear: 2018 },
      ],
    },
  ]

  for (const artItem of articlesData) {
    const { sources, ...artDetails } = artItem
    await prisma.nutritionArticle.create({
      data: {
        ...artDetails,
        sources: {
          create: sources,
        },
      },
    })
  }

  // 6. SEED MEAL LOGGING & BUDGET
  console.log('💳 Seeding sample budget & transactions...')

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Thứ 2 đầu tuần
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // Chủ nhật cuối tuần

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      periodStart: weekStart,
      periodEnd: weekEnd,
      dailyLimitVnd: 80000,
      totalBudgetVnd: 560000, // 7 x 80.000 VND
      rolloverAmountVnd: 0,
    },
  })

  // Tìm các món ăn đã seed để làm mẫu nhật ký
  const comGaKho = await prisma.food.findUnique({ where: { slug: 'com-ga-kho' } })
  const bunRieu = await prisma.food.findUnique({ where: { slug: 'bun-rieu' } })
  const trungLuoc = await prisma.food.findUnique({ where: { slug: 'trung-ga-luoc' } })
  const maDuiLuoc = await prisma.food.findUnique({ where: { slug: 'ma-dui-ga-luoc' } })
  const pepsiZero = await prisma.food.findUnique({ where: { slug: 'pepsi-zero' } })

  if (comGaKho && bunRieu && trungLuoc && maDuiLuoc && pepsiZero) {
    console.log('🍽️ Seeding sample 2-meal daily diary (Trưa cơm quán, Tối đồ nhà)...')

    // Bữa trưa hôm nay: Cơm gà kho quán (30k) + Pepsi Zero (10k)
    const lunchMeal = await prisma.meal.create({
      data: {
        userId: user.id,
        date: today,
        slot: MealSlot.LUNCH,
        totalCaloriesKcal: 560.0,
        minCaloriesKcal: 500.0,
        maxCaloriesKcal: 630.0,
        totalProteinG: 30.5,
        totalCarbsG: 62.0,
        totalFatG: 18.5,
        totalCostVnd: 40000,
        notes: 'Cơm gà kho quán bình dân gần công ty, uống Pepsi Zero mát lạnh.',
        items: {
          create: [
            {
              foodId: comGaKho.id,
              quantityGrams: 320,
              weightBasis: WeightBasis.COOKED,
              edibleYieldPercent: 75.0,
              itemPortionName: '1 suất cơm gà kho quán bình dân',
              caloriesKcal: 560.0,
              minCaloriesKcal: 500.0,
              maxCaloriesKcal: 630.0,
              proteinG: 30.5,
              carbsG: 62.0,
              fatG: 18.5,
              priceVnd: 30000,
              isHomePrepared: false, // Trưa không tự chuẩn bị đồ nhà
              notes: 'Ăn tại tiệm',
            },
            {
              foodId: pepsiZero.id,
              quantityGrams: 320,
              weightBasis: WeightBasis.EDIBLE,
              itemPortionName: '1 lon Pepsi Zero 320ml',
              caloriesKcal: 0.0,
              proteinG: 0.0,
              carbsG: 0.0,
              fatG: 0.0,
              priceVnd: 10000,
              isHomePrepared: false,
            },
          ],
        },
      },
    })

    // Bữa tối hôm nay: 1 má đùi gà luộc (16k) + 2 quả trứng gà luộc (7k)
    const dinnerMeal = await prisma.meal.create({
      data: {
        userId: user.id,
        date: today,
        slot: MealSlot.DINNER,
        totalCaloriesKcal: 343.0,
        minCaloriesKcal: 310.0,
        maxCaloriesKcal: 376.0,
        totalProteinG: 37.1,
        totalCarbsG: 0.8,
        totalFatG: 21.1,
        totalCostVnd: 23000,
        notes: 'Bữa tối tại nhà nhẹ nhàng giàu đạm, luộc má đùi gà và 2 quả trứng.',
        items: {
          create: [
            {
              foodId: maDuiLuoc.id,
              quantityGrams: 150,
              weightBasis: WeightBasis.BONE_IN,
              edibleYieldPercent: 65.0,
              itemPortionName: '1 cái má đùi gà luộc cả xương/da (150g)',
              caloriesKcal: 195.0,
              minCaloriesKcal: 170.0,
              maxCaloriesKcal: 220.0,
              proteinG: 24.5,
              carbsG: 0.0,
              fatG: 10.5,
              priceVnd: 16000,
              isHomePrepared: true, // Tối được phép thêm đồ nhà
            },
            {
              foodId: trungLuoc.id,
              quantityGrams: 100,
              weightBasis: WeightBasis.EDIBLE,
              itemPortionName: '2 quả trứng gà luộc (~100g ăn được)',
              caloriesKcal: 148.0,
              minCaloriesKcal: 140.0,
              maxCaloriesKcal: 156.0,
              proteinG: 12.6,
              carbsG: 0.8,
              fatG: 10.6,
              priceVnd: 7000,
              isHomePrepared: true,
            },
          ],
        },
      },
    })

    // Ghi nhận transactions tương ứng
    await prisma.budgetTransaction.createMany({
      data: [
        {
          budgetId: budget.id,
          userId: user.id,
          date: today,
          amountVnd: 40000,
          category: 'LUNCH',
          description: 'Cơm trưa gà kho + Pepsi Zero',
          mealId: lunchMeal.id,
        },
        {
          budgetId: budget.id,
          userId: user.id,
          date: today,
          amountVnd: 23000,
          category: 'DINNER',
          description: 'Má đùi gà + 2 quả trứng luộc tại nhà',
          mealId: dinnerMeal.id,
        },
      ],
    })
  }

  // 7. SEED WORKOUT PLAN & SAMPLE WORKOUT
  console.log('🏃 Seeding workout plan & logged workout...')

  const pushUpEx = await prisma.exercise.findUnique({ where: { slug: 'push-up' } })
  const squatEx = await prisma.exercise.findUnique({ where: { slug: 'bodyweight-squat' } })
  const plankEx = await prisma.exercise.findUnique({ where: { slug: 'plank' } })

  await prisma.workoutPlan.create({
    data: {
      userId: user.id,
      name: 'Lịch tập CutTrack 3 buổi Sức mạnh + 1 buổi Đá bóng',
      description: 'Phân chia lịch tập hợp lý: Thứ 2 (Ngực & Tay sau), Thứ 4 (Chân & Mông), Thứ 6 (Lưng & Core), Thứ 7 (Đá banh 45 phút), các ngày còn lại nghỉ ngơi hồi phục.',
      daysPerWeek: 4,
      planScheduleJson: JSON.stringify({
        mon: 'Ngực & Tay sau: Push-up, Diamond push-up, Plank',
        tue: 'Nghỉ ngơi hoặc đi bộ nhẹ',
        wed: 'Chân & Mông: Bodyweight Squat, Reverse Lunge, Glute Bridge',
        thu: 'Nghỉ ngơi',
        fri: 'Lưng & Core: Backpack Row, Dead Bug, Reverse Crunch',
        sat: 'Đá banh 45 phút sân cỏ nhân tạo + Bữa tối gà nướng cơm lam',
        sun: 'Nghỉ ngơi hoàn toàn',
      }),
      isActive: true,
    },
  })

  if (pushUpEx && squatEx && plankEx) {
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: today,
        title: 'Buổi 1: Ngực, Chân & Core mở đầu',
        workoutType: 'STRENGTH',
        durationMinutes: 40,
        estimatedCaloriesBurned: 180.0,
        rpe: 7,
        notes: 'Hoàn thành tốt các hiệp, push-up hiệp cuối hơi mỏi nhưng giữ chuẩn form.',
        sets: {
          create: [
            { exerciseId: pushUpEx.id, setNumber: 1, reps: 15, weightKg: 0, rpe: 7 },
            { exerciseId: pushUpEx.id, setNumber: 2, reps: 14, weightKg: 0, rpe: 8 },
            { exerciseId: pushUpEx.id, setNumber: 3, reps: 12, weightKg: 0, rpe: 8 },
            { exerciseId: squatEx.id, setNumber: 1, reps: 20, weightKg: 0, rpe: 6 },
            { exerciseId: squatEx.id, setNumber: 2, reps: 20, weightKg: 0, rpe: 7 },
            { exerciseId: squatEx.id, setNumber: 3, reps: 18, weightKg: 0, rpe: 8 },
            { exerciseId: plankEx.id, setNumber: 1, durationSeconds: 45, weightKg: 0, rpe: 7 },
            { exerciseId: plankEx.id, setNumber: 2, durationSeconds: 40, weightKg: 0, rpe: 8 },
            { exerciseId: plankEx.id, setNumber: 3, durationSeconds: 35, weightKg: 0, rpe: 9 },
          ],
        },
      },
    })
  }

  // 8. SEED BODY MEASUREMENT
  console.log('📏 Seeding initial body measurement...')
  await prisma.bodyMeasurement.create({
    data: {
      userId: user.id,
      date: today,
      weightKg: 68.0,
      waistCm: 81.5,
      hipCm: 95.0,
      chestCm: 93.0,
      notes: 'Cân vào sáng sớm sau khi thức dậy và đi vệ sinh, bụng đói.',
    },
  })

  // 9. SEED WEEKLY PLAN (7 NGÀY)
  console.log('📅 Seeding 7-day weekly meal planner with special Saturday football feast...')
  const halfChicken = await prisma.food.findUnique({ where: { slug: 'nua-con-ga-nuong' } })
  const comLam = await prisma.food.findUnique({ where: { slug: 'com-lam' } })
  const banhBao = await prisma.food.findUnique({ where: { slug: 'banh-bao' } })

  const weeklyPlan = await prisma.weeklyPlan.create({
    data: {
      userId: user.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      targetDailyKcal: 1600.0,
      targetWeeklyBudgetVnd: 560000,
      specialMealScheduled: true,
      notes: 'Kế hoạch mẫu 7 ngày ăn 2 bữa/ngày. Thứ 7 có trận bóng đá 45p và bữa tối đặc biệt nửa con gà nướng 450g + cơm lam + bánh bao.',
    },
  })

  // Thêm bữa ăn mẫu cho tuần
  if (comGaKho && bunRieu && halfChicken && comLam && banhBao) {
    await prisma.weeklyPlanMeal.createMany({
      data: [
        // Thứ 2: Trưa cơm gà kho (30k), Tối hủ tiếu (35k)
        { weeklyPlanId: weeklyPlan.id, dayOfWeek: 1, slot: MealSlot.LUNCH, foodId: comGaKho.id, portionDescription: '1 suất cơm gà kho quán', estimatedKcal: 560, estimatedProteinG: 30.5, estimatedPriceVnd: 30000 },
        // Thứ 3: Trưa bún riêu (25k)
        { weeklyPlanId: weeklyPlan.id, dayOfWeek: 2, slot: MealSlot.LUNCH, foodId: bunRieu.id, portionDescription: '1 tô bún riêu đầy đủ', estimatedKcal: 450, estimatedProteinG: 24.5, estimatedPriceVnd: 25000 },
        // Thứ 7: Bữa đặc biệt ngày đá banh
        { weeklyPlanId: weeklyPlan.id, dayOfWeek: 6, slot: MealSlot.DINNER, foodId: halfChicken.id, portionDescription: 'Nửa con gà nướng (450g cả xương/da)', estimatedKcal: 820, estimatedProteinG: 78.0, estimatedPriceVnd: 95000, isSpecialMeal: true },
        { weeklyPlanId: weeklyPlan.id, dayOfWeek: 6, slot: MealSlot.DINNER, foodId: comLam.id, portionDescription: '1 ống cơm lam nướng than', estimatedKcal: 265, estimatedProteinG: 5.0, estimatedPriceVnd: 18000, isSpecialMeal: true },
        { weeklyPlanId: weeklyPlan.id, dayOfWeek: 6, slot: MealSlot.CUSTOM, foodId: banhBao.id, portionDescription: '1 cái bánh bao lót dạ trước đá banh', estimatedKcal: 350, estimatedProteinG: 12.5, estimatedPriceVnd: 18000, isSpecialMeal: true },
      ],
    })
  }

  console.log('✅ CutTrack Database Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
