# CUTTRACK — MASTER PRODUCT & ENGINEERING SPECIFICATION
**Version:** 1.0 | **Language:** Vietnamese UI, English code | **Deliverable:** Responsive Web/PWA, expandable to mobile

> Đây là tài liệu đặc tả + prompt triển khai dành cho Claude Code, Cursor hoặc coding agent. Agent cần đọc toàn bộ file trước khi code. Không được chỉ dựng mockup: phải triển khai ứng dụng chạy được, dữ liệu lưu bền vững, ảnh món ăn và minh họa động bài tập có nguồn rõ ràng.

## 1. Vai trò và yêu cầu tổng quát

Bạn là Senior Product Engineer, UX/UI Designer, Nutrition Data Architect, Full-stack Developer và QA Engineer. Hãy xây dựng **CutTrack**, ứng dụng tiếng Việt theo dõi ăn uống, chi phí, vận động và tiến độ cân nặng, đồng thời là dự án portfolio full-stack có cấu trúc tốt.

**Đầu ra bắt buộc:** code chạy được, migration/seed, tài liệu cài đặt, kiểm thử, giao diện desktop/mobile, PWA, ảnh thực phẩm, ảnh động bài tập, mô tả chế độ dinh dưỡng, bộ tính dinh dưỡng và ngân sách, cùng dashboard phân tích. Chia việc theo milestone; không tự tuyên bố đã chạy test nếu chưa chạy.

## 2. Bối cảnh người dùng và nguyên tắc sức khỏe

- Nam, 23 tuổi, cao 168 cm, nặng 68 kg; mục tiêu trước mắt 62 kg, có thể cân nhắc 60 kg sau.
- Ít vận động thường ngày; đá banh 45 phút/tuần; chống đẩy tối đa khoảng 20 cái liên tục; có thể tập tại nhà.
- Muốn giảm mỡ toàn thân để bụng dưới và nọng cằm gọn hơn, sau đó chuyển sang giai đoạn tăng cơ. Không khẳng định có thể giảm mỡ tại chỗ.
- Ăn **2 bữa chính/ngày**. Trưa đi làm chỉ ăn suất quán, **không được tự ý thêm đồ chuẩn bị ở nhà**. Tối có thể thêm trứng luộc hoặc má đùi gà luộc.
- Ngân sách **70.000–80.000 VND/ngày**; cơm tiệm ~30.000 VND, bún riêu ~25.000 VND.
- Người dùng từng nêu mong muốn **1.300 kcal/ngày**. Đây là **mức tự chọn để tham khảo, không phải khuyến nghị y tế**. BMR ước tính ~1.620 kcal, TDEE ít vận động ~1.945 kcal; 1.300 kcal có thể quá thấp đối với nam trưởng thành, nhất là ngày đá banh. Ứng dụng cần hiển thị cảnh báo trung tính, không thúc ép cắt sâu, gợi ý tham khảo chuyên gia; cho phép mục tiêu cá nhân nhưng không tự động mặc định ở 1.300. Khoảng khởi đầu tham khảo 1.500–1.650 kcal/ngày và điều chỉnh theo dữ liệu thực tế.
- Không thưởng cho việc bỏ bữa/ăn thiếu, không đưa dự đoán chắc chắn về tốc độ giảm cân. Theo dõi trung bình 7 ngày, năng lượng, khả năng tập và vòng eo. Dữ liệu y tế/ảnh cơ thể phải được bảo vệ.

## 3. Công nghệ và định hướng học lập trình

**Stack ưu tiên (kiểm tra phiên bản và tài liệu chính thức trước khi cài):**
- Next.js App Router, React, TypeScript strict
- Tailwind CSS, shadcn/ui, Lucide icons
- PostgreSQL, Prisma ORM, Zod
- React Hook Form; Recharts cho biểu đồ
- Vitest + Testing Library, Playwright E2E
- pnpm, Docker Compose, ESLint, Prettier, GitHub Actions
- PWA có cache an toàn; deploy trên môi trường hỗ trợ Next.js và PostgreSQL
- Giai đoạn sau: Expo/React Native + TypeScript; Python/FastAPI chỉ khi thực sự cần pipeline phân tích/AI.

**Lý do:** TypeScript/React/Next.js cho phép luyện frontend, backend, SQL, API, auth, testing, deployment trên một sản phẩm. Đây là đề xuất kỹ thuật, không phải khẳng định xếp hạng tuyển dụng mới nhất. Trước khi triển khai, xác minh tình hình thư viện, mức hỗ trợ và breaking changes tại nguồn chính thức.

Kiến trúc **modular monolith**: `src/app`, `src/components`, `src/features/{foods,meals,budget,workouts,progress,plans,media}`, `src/server`, `src/lib`, `prisma`, `tests`, `public/media`. Business logic và công thức nằm ngoài React component, có unit test.

## 4. Danh sách chức năng

### 4.1 Dashboard
- Thẻ: cân hiện tại, mục tiêu, calo ăn hôm nay (ước tính), protein, chi phí, số tiền còn lại, lịch tập, số bữa đã ghi.
- Biểu đồ 7/30/90 ngày: cân nặng, vòng eo, trung bình kcal, chi phí, số buổi tập.
- Chỉ báo mức chắc chắn của ước tính (ví dụ: `ước tính theo suất quán`, `đã cân`).
- Giao diện mobile bottom navigation, desktop sidebar, light/dark, tiếng Việt, hỗ trợ accessibility.

### 4.2 Nhật ký ăn uống — 2 bữa mặc định
- Slot **Trưa** và **Tối**; có thể mở rộng tùy chỉnh, không bắt buộc snack.
- Chọn món từ danh mục bằng thẻ ảnh, tìm kiếm, bộ lọc quán/nhà, món ưa thích.
- Nhập gram, đơn vị, khối lượng *sống/chín/ăn được/cả xương*, topping, số lượng, giá, cách chế biến, ghi chú.
- Tự tính kcal/protein/carb/fat theo khẩu phần; hỗ trợ **khoảng ước tính** thay vì số giả chính xác.
- Sao chép bữa hôm qua, lưu combo, chỉnh sửa/xóa, xem tổng ngày/tuần.
- Trưa: chỉ gợi ý món quán và **1 phần thức ăn quán**; tối: cho phép thêm trứng, gà luộc.

### 4.3 Thư viện món ăn CÓ HÌNH ẢNH
**Mỗi món phải có**:
- Ảnh thumbnail tỉ lệ 4:3 và ảnh chi tiết 16:9 (hoặc 1 ảnh crop responsive).
- Tên Việt, tên Anh tùy chọn, mô tả ngắn, nguyên liệu phổ biến, cách chế biến, khẩu phần tham khảo, kcal/macros, giá ước tính, lưu ý về dầu/đường/da/xương, nguồn dữ liệu và mức độ tin cậy.
- Alt text tiếng Việt mô tả món ăn; lazy load, skeleton, fallback minh họa khi thiếu ảnh.
- Attribution, nguồn ảnh, quyền sử dụng và license rõ ràng.

**Danh mục seed tối thiểu:**
1. Cơm trắng
2. Cơm gà kho
3. Cơm ếch kho
4. Cơm đậu hũ kho
5. Cơm thịt kho trứng
6. Bún riêu (100g bún chín + huyết/mọc/xương riêng)
7. Bún bò Huế (nhập riêng khối lượng bún chín, thịt bò, giò heo, chả, huyết và nước dùng; không mặc định cùng khẩu phần bún riêu)
8. Hủ tiếu nước (100g sợi chín + lưỡi/xương riêng)
9. Trứng gà luộc
10. Má đùi gà luộc
11. Nửa con gà nướng
12. Cơm lam
13. Bánh bao
14. Yomost
15. Pepsi Zero

**Nguồn ảnh:** Ưu tiên ảnh được cấp phép (Wikimedia Commons, Unsplash/Pexels theo điều khoản cụ thể, ảnh tự chụp), lưu URL nguồn/credit/license; không hotlink bừa, không dùng ảnh có watermark hoặc ảnh không rõ quyền. Có thể dùng placeholder do dự án sở hữu trong seed. Nếu dùng ảnh AI, đánh dấu `AI illustration`, không giả vờ là ảnh món quán thực tế. Không tự gán ảnh sai món.

**UI food card:** ảnh, tên, nhãn giá, khoảng kcal/khẩu phần, protein, nút “Thêm vào bữa”, nhấn xem chi tiết.

### 4.4 Thư viện bài tập CÓ ẢNH ĐỘNG VÀ MÔ TẢ
**Bắt buộc có minh họa chuyển động** cho:
- Push-up, diamond push-up
- Bodyweight squat
- Reverse lunge
- Plank
- Reverse crunch
- Dead bug
- Glute bridge
- Backpack row
- Mountain climber
- Football (minh họa chung hoặc icon; không cần mô phỏng động tác đá banh phức tạp)

**Mỗi bài tập có:**
- Poster tĩnh + **animation thực** (MP4/WebM loop hoặc GIF/Lottie được cấp phép) minh họa kỹ thuật.
- Tên, nhóm cơ chính/phụ, độ khó, dụng cụ, set/reps/time, nghỉ giữa hiệp, hướng dẫn từng bước, cách thở, lỗi phổ biến, biến thể dễ/khó, cảnh báo khi đau bất thường.
- Nút play/pause, replay, tốc độ phát nếu phù hợp; hỗ trợ `prefers-reduced-motion` (poster + mô tả thay cho tự động phát).
- Video mặc định **muted, playsInline, loop**, không autoplay khi ngoài viewport, tối ưu dung lượng; có captions/transcript khi có lời nói.
- Alt text/poster, mô tả bằng văn bản cho người không xem được video.
- Không dùng animation giả (ảnh tĩnh gắn nhãn GIF); nếu chưa có media hợp pháp, hiện placeholder rõ ràng và backlog để bổ sung.

**Nguồn media:** tự quay, media tự tạo, hoặc thư viện được cấp phép thương mại/phân phối lại. Lưu `creator`, `license`, `sourceUrl`, `attribution`, `mediaType`, `duration`, `posterUrl`. Không tải lại video có bản quyền khi chưa có phép.

### 4.5 Nội dung giải thích chế độ dinh dưỡng
Tạo mục **“Kiến thức dinh dưỡng”** dạng bài viết ngắn, minh họa và FAQ:
- Calo, BMR, TDEE, thâm hụt năng lượng: giải thích, giới hạn và ví dụ.
- Protein, carbohydrate, chất béo, chất xơ, nước: chức năng, nguồn thực phẩm.
- Sự khác nhau giữa giảm cân và giảm mỡ; tại sao nên giữ cơ trong giai đoạn giảm cân.
- Mỡ bụng dưới/nọng cằm không giảm chọn lọc; ảnh hưởng của tư thế, giữ nước và cấu trúc cơ thể.
- Khối lượng sống/chín, phần ăn được/cả xương, dầu/sốt làm sai số.
- Hai bữa/ngày không tự động tốt hay xấu; ưu tiên đủ chất và tổng năng lượng.
- Cách ăn quán tiết kiệm, cân đối và cách đọc nhãn đồ uống.
- Ăn trước/sau đá banh; phục hồi và ngủ.
- Khi nào cần xem lại kế hoạch: mệt kéo dài, chóng mặt, giảm hiệu suất, đói quá mức.
- Phân biệt kiến thức chung với lời khuyên cá nhân; ghi nguồn, ngày cập nhật, người biên tập; không bịa dẫn chứng.

**Nutrition content UI:** thẻ bài có cover, thời gian đọc, mục lục, đồ họa đơn giản, glossary, link nguồn uy tín, disclaimer rõ ràng. Tránh quảng bá mục tiêu 1.300 kcal như chuẩn an toàn.

### 4.6 Meal planner và ngân sách
- Sinh kế hoạch 7 ngày dựa trên danh sách món đã biết, **2 bữa/ngày**, trưa không có đồ tự chuẩn bị, tối được thêm trứng/gà.
- Giá mặc định: cơm 30k, bún riêu 25k; giá bún bò do người dùng nhập, các món khác là giá do người dùng nhập; **không tự bịa giá**.
- Ngân sách 70–80k/ngày, 490–560k/tuần; tính tiền theo VND dạng integer.
- Ngày đá banh 45 phút/tuần; có một bữa đặc biệt nửa con gà nướng **400–500g tính cả xương/da**, cơm lam và bánh bao.
- Phân biệt khối lượng gà mua với thịt ăn được; cho phép nhập tỷ lệ phần ăn được và khoảng ước tính.
- Không tự động “ăn bù” toàn bộ kcal thể thao; tránh double count TDEE.
- Nếu các ràng buộc chi phí/calo/protein xung đột, hiển thị cảnh báo và phương án thay thế, **không làm giả tổng số**.
- Cho phép lập kế hoạch từ mục tiêu do người dùng đặt, nhưng kiểm tra cảnh báo an toàn khi mục tiêu quá thấp.

### 4.7 Workout planner
- 3 buổi tập sức mạnh/tuần (ngực/lưng, chân, toàn thân) + 1 buổi đá banh 45 phút, ngày nghỉ hợp lý.
- Cho phép đổi lịch, ghi set/reps/RPE, lịch sử, tăng độ khó từng bước.
- Với push-up max 20 lần, gợi ý set dưới ngưỡng kiệt sức; không buộc tập hết sức mỗi buổi.
- Xem clip hướng dẫn ngay trong lịch tập và màn hình workout.
- Timer nghỉ hiệp; lịch sử tiến bộ; không thưởng tập quá sức.

### 4.8 Progress và giai đoạn tăng cơ
- Cân nặng, vòng eo, ảnh tiến độ tùy chọn (private), biểu đồ trung bình 7 ngày.
- Cân nhắc sai số đo, dao động nước; không suy đoán % mỡ cơ thể chính xác từ ảnh.
- Khi đạt mốc, đề nghị đánh giá lại mục tiêu; chuyển sang tăng cơ chỉ sau xác nhận người dùng.
- Tính lại TDEE theo cân mới và hoạt động mới; có giai đoạn duy trì trước khi tăng cơ nếu phù hợp.

## 5. Cấu trúc dữ liệu / Prisma entities

Tạo schema có quan hệ và index hợp lý:
- `User`, `UserProfile`, `NutritionGoal`, `FitnessPhase`
- `Food`, `FoodServing`, `NutritionSource`, `FoodMedia`, `FoodPrice`
- `Meal`, `MealItem`, `MealTemplate`
- `Exercise`, `ExerciseMedia`, `Workout`, `WorkoutSet`, `WorkoutPlan`
- `Budget`, `BudgetTransaction`
- `BodyMeasurement`, `ProgressPhoto`
- `NutritionArticle`, `ArticleSource`
- `WeeklyPlan`, `WeeklyPlanMeal`

Yêu cầu:
- UUID IDs, createdAt/updatedAt, foreign keys, ownership checks.
- Các trường `quantityGrams`, `weightBasis` enum `RAW|COOKED|EDIBLE|BONE_IN`; phần ăn được lưu `edibleYieldPercent` có thể null.
- `nutritionConfidence` enum `VERIFIED_LABEL|DATABASE|RESTAURANT_ESTIMATE|USER_ESTIMATE`; hỗ trợ min/max kcal khi chưa chắc chắn.
- `MediaAsset` hoặc các media table: `url`, `posterUrl`, `altVi`, `type`, `creator`, `license`, `sourceUrl`, `attribution`, `isAiGenerated`, `reviewedAt`.
- Tiền VND lưu integer, không dùng float.
- Thời gian UTC trong DB; tính ngày theo `Asia/Ho_Chi_Minh`.
- Xóa dữ liệu/ảnh theo chính sách retention; dữ liệu ảnh tiến độ riêng tư.

## 6. API / server actions

Thiết kế typed contracts + Zod:
- Profile/goal CRUD
- Foods search/detail/create/edit; media retrieval
- Meal create/update/delete/duplicate; daily/weekly summary
- Budget transactions/summary
- Exercises list/detail/media; workout logging
- Measurements + trends
- Weekly plans generate/override
- Nutrition articles browse/detail
- Export dữ liệu JSON/CSV

Auth: có thể single-user local MVP, nhưng thiết kế user ownership; multi-user phải có auth, server-side authorization, rate limits phù hợp, secure uploads và signed/private media URLs.

## 7. Thiết kế màn hình

Routes:
- `/dashboard`
- `/diary`
- `/foods`
- `/foods/[slug]`
- `/meal-planner`
- `/budget`
- `/exercises`
- `/exercises/[slug]`
- `/workouts`
- `/progress`
- `/learn`
- `/learn/[slug]`
- `/settings`

**Màn hình food detail:** hero ảnh món ăn, mô tả, calories range, macros, định lượng, thay đổi portion, nguồn dữ liệu, nút thêm vào bữa.

**Màn hình exercise detail:** video/animation ở đầu, điều khiển phát, hướng dẫn từng bước, lỗi cần tránh, biến thể, nhóm cơ, set/reps, nút thêm vào lịch.

**Màn hình nutrition article:** cover, bài viết có headings, infographic/chart, ví dụ món Việt, FAQ, nguồn tham khảo.

**Màn hình dashboard:** biểu đồ cân, calo, chi phí, 2 bữa, lịch tập, mục tiêu. Responsive 360px–desktop; WCAG AA hướng tới, keyboard support, focus states, dark mode.

## 8. Seed data và chính sách độ chính xác

Tạo dữ liệu mẫu có thể thay đổi; ghi rõ `sample`/`estimated`.
- Không mặc định 100g gà kho cả xương = 100g thịt ăn được.
- Không mặc định 100g sợi bún/hủ tiếu = 100g toàn tô.
- Gà nướng 400–500g là cả xương và da.
- Không gán giá cố định cho ếch kho, đậu kho, thịt kho trứng, Yomost, gà luộc, gà nướng nếu người dùng chưa cung cấp.
- Với món quán, có thể dùng ước tính dải và chỉnh theo ảnh/cân thực tế; không trình bày chính xác giả.
- Mọi nội dung dinh dưỡng cần trường nguồn và thời điểm kiểm chứng.

## 9. Tests bắt buộc

Unit tests:
- 100g cooked noodle + toppings riêng; bún bò có lượng sợi và topping nhập độc lập
- 100g bone-in chicken khác 100g edible chicken
- Scale portions và tính macros
- Rounding, giá VND, budget rollover
- Hai bữa/ngày, trưa không tự thêm trứng/gà
- Ngày đá banh không double-count exercise kcal
- Special meal gà nướng + cơm lam + bánh bao
- Low-calorie target warning
- Missing nutrition source/unknown price
- Date boundary Asia/Ho_Chi_Minh

E2E:
1. Tạo profile
2. Thêm cơm gà kho trưa
3. Thêm hủ tiếu + trứng luộc tối
4. Xem ảnh món và nguồn dinh dưỡng
5. Xem animation push-up, pause/play, reduced-motion fallback
6. Ghi tập và đá banh
7. Ghi chi phí và cân nặng
8. Xem dashboard + biểu đồ
9. Xem bài viết dinh dưỡng
10. Kiểm tra mobile layout và accessibility cơ bản

## 10. Roadmap triển khai

**M0 — Discovery:** rà soát repo, xác minh dependency, viết PRD, user flows, ERD, wireframe, kế hoạch asset licensing.

**M1 — Foundation:** Next.js/TS, Tailwind, DB/Prisma, seed, responsive shell, dark mode, test setup.

**M2 — Nutrition MVP:** food cards **có ảnh**, food detail, nhật ký 2 bữa, tính calories/macros/cost, dashboard và persistence.

**M3 — Exercise media:** exercise library **có video/GIF/Lottie hợp pháp**, hướng dẫn, workout logger, timer và accessibility.

**M4 — Planning & Learn:** meal planner, budget, ngày đá banh, bữa đặc biệt, **thư viện kiến thức dinh dưỡng** có minh họa và nguồn.

**M5 — Production:** auth, privacy, PWA, performance, E2E, CI, Docker, deployment, README, screenshot demo.

**M6 — Mobile:** đánh giá Expo/React Native và khả năng chia sẻ domain logic; không triển khai trước khi web MVP ổn định.

## 11. Acceptance criteria / Definition of Done

- Không có trang “demo giả” làm như đã lưu dữ liệu.
- CRUD ăn uống và workout lưu bền vững sau reload.
- Ít nhất 15 món seed có ảnh hoặc placeholder minh bạch và metadata nguồn.
- Ít nhất 9 bài tập có animation thực được cấp phép **hoặc được đánh dấu rõ là chưa có media**, không được lừa là đã hoàn thành.
- Nội dung dinh dưỡng có ít nhất 8 bài cơ bản, nguồn và ngày cập nhật.
- Công thức calories, trọng lượng, ngân sách có unit tests.
- Trưa không thêm thực phẩm tự chuẩn bị; tối có thể thêm.
- Dashboard/diary/food/exercise/learn hoạt động trên mobile.
- Không mặc định 1.300 kcal là mục tiêu an toàn.
- Tài liệu README, `.env.example`, migration, seed, Docker Compose và hướng dẫn chạy.
- Báo cáo test thật, những giới hạn còn tồn tại và backlog.

## 12. Prompt hành động cho coding agent

**Hãy đọc toàn bộ đặc tả này, sau đó:**

1. Khảo sát repository và phiên bản framework mới nhất phù hợp.
2. Trình bày kiến trúc, ERD, sitemap, media strategy, folder tree, task checklist theo M0–M5.
3. Nếu không có repo, khởi tạo Next.js + TypeScript + PostgreSQL + Prisma.
4. Thực hiện từng milestone với code thực thi, không bỏ qua ảnh món ăn, animation bài tập và nội dung dinh dưỡng.
5. Với media, chỉ dùng asset có quyền hợp lệ; nếu không thể lấy asset trong môi trường hiện tại, tạo hệ thống media hoàn chỉnh + placeholder có nhãn + danh sách asset cần bổ sung.
6. Sau mỗi milestone, chạy typecheck, lint, test phù hợp; nêu kết quả thật, file đã tạo, quyết định kỹ thuật và việc tiếp theo.
7. Dạy người phát triển bằng giải thích ngắn gọn các khái niệm TypeScript, React, SQL, API, auth, testing, CI/CD và deployment xuất hiện trong quá trình làm.
8. Không khẳng định ứng dụng đã hoàn thiện nếu còn chức năng thiếu hoặc asset chưa được cấp phép.

**Bắt đầu bằng M0, sau đó thực hiện M1 và M2.**
