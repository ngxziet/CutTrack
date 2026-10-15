# 🥗 CutTrack — Nền Tảng Theo Dõi Dinh Dưỡng, Thâm Hụt Calo & Tập Luyện Chuẩn Khoa Học

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-52%20Tests%20Passing-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **CutTrack** là ứng dụng web cá nhân hóa dành riêng cho người Việt Nam thực hiện quá trình siết cơ giảm mỡ (cutting). Ứng dụng tích hợp chuẩn xác cơ sở dữ liệu ẩm thực đường phố và cơm nhà Việt Nam, phân bổ ngân sách chi tiêu thực tế (70.000đ - 80.000đ/ngày), quản lý 2 bữa ăn cố định, động cơ hoạt ảnh cơ học 60 FPS chuẩn kỹ thuật thể hình và bộ đánh giá tiến độ cân nặng sáng mỗi tuần.

---

## 📑 Mục lục
- [✨ Tính năng cốt lõi](#-tính-năng-cốt-lõi)
- [📐 Nguyên tắc lâm sàng & Thiết kế thực nghiệm](#-nguyên-tắc-lâm-sàng--thiết-kế-thực-nghiệm)
- [🏋️ Thư viện chuyển động sinh học 60 FPS](#️-thư-viện-chuyển-động-sinh-học-60-fps)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📂 Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
- [🚀 Hướng dẫn cài đặt & Khởi chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
- [🧪 Kiểm thử tự động (Unit Tests)](#-kiểm-thử-tự-động-unit-tests)
- [📄 Giấy phép](#-giấy-phép)

---

## ✨ Tính năng cốt lõi

### 1. 🍽️ Nhật Ký Ăn Uống 2 Bữa/Ngày Thực Tế
- **Bữa Trưa:** Cố định 100% đồ ăn ngoài quán (cơm tấm, bún bò, phở gà, hủ tiếu, xôi gà...), khóa không cho phép thêm đồ tự nấu tại nhà để phản ánh đúng nhịp sống công sở.
- **Bữa Tối:** Cho phép kết hợp đồ ăn tự nấu tại nhà (ức gà luộc, trứng gà ta, rau củ quả).
- **Phần trăm ăn được (Edible Yield):** Tự động tính toán hao hụt thực phẩm có xương/vỏ (thịt gà có xương chỉ tính ~65-70% thịt nạc ăn được, ức gà luộc chín co ngót nước).
- **Khoảng tin cậy calo:** Hiển thị dải ước tính (Min - Max) vì ẩm thực quán ăn vỉa hè có dao động dầu mỡ thực tế.

### 2. 📅 Thực Đơn 7 Ngày & Điều Chỉnh Cân Nặng Chi Tiết
- **Tùy chỉnh Chỉ Số Sinh Trắc:** Thanh trượt điều chỉnh Chiều cao (cm) và Cân nặng (kg) theo thời gian thực; tự động tính lại BMR (Mifflin-St Jeor), TDEE và mục tiêu calo thâm hụt.
- **Đổi món linh hoạt (Dish Swap):** Người dùng có thể hoán đổi từng món ăn của bất kỳ ngày nào trong tuần từ thư viện thực phẩm hạt nhân đã kiểm định.
- **Dòng thời gian ngày (Daily Timeline):** Đầy đủ các mốc: *07:00 Uống nước & Cân nặng sáng*, *11:45 Ăn trưa quán*, *18:30 Tập luyện*, *19:45 Ăn tối giàu đạm*, *23:00 Nghỉ ngơi*.

### 3. ⚖️ Bộ Đánh Giá Cân Nặng Sáng Hàng Tuần
- Đánh giá tốc độ giảm cân an toàn: Tối ưu từ **0.4 kg - 0.8 kg/tuần** (0.5% - 1.0% trọng lượng cơ thể).
- Phát hiện cảnh báo giảm cân quá nhanh (> 1.0 kg/tuần gây mất cơ) hoặc chững cân (Plateau).
- Danh mục kiểm tra giữ nước sinh lý (Stress cortisol, Natri cao, thiếu ngủ, viêm cơ sau tập nặng).
- Dự báo chính xác số tuần cần thiết để đạt mốc cân nặng mục tiêu (ví dụ: 62.0 kg).

### 4. 🍗 Bữa Ăn Hồi Phục Thứ Bảy (Saturday Soccer Re-feed)
- Sau trận bóng đá 45 phút chiều thứ Bảy: Thực đơn thiết kế sẵn **Nửa con gà nướng (400-500g tính cả xương/da) + 1 ống cơm lam nướng + 1 bánh bao trứng cút**.
- **Quy tắc vàng:** Không cộng bù lượng calo vận động bóng đá vào TDEE hằng ngày để tránh ảo tưởng thâm hụt.

### 5. 💰 Quản Lý Ngân Sách Số Nguyên VND Tuyệt Đối
- Hạn mức mục tiêu: **70.000đ - 80.000đ/ngày** (~490.000đ - 560.000đ/tuần).
- Xử lý số nguyên không dùng dấu phẩy số thập phân, tự động cảnh báo bội chi màu đỏ / trong ngân sách màu xanh.

### 6. 🧠 Trung Tâm Tri Thức Khoa Học (Learn Hub)
- 8 bài viết chuyên sâu bằng Tiếng Việt giải thích cặn kẽ:
  - BMR & TDEE theo Mifflin-St Jeor.
  - Phân bổ Macro (Đạm 1.6-2.2g/kg, Chất béo 20-30%, Tinh bột chọn lọc).
  - Tỷ lệ ăn được thực phẩm (Raw vs Cooked vs Bone-in).
  - Khoa học giữ nước và dao động cân nặng.
  - Quy tắc an toàn nhịp tim & bài tập bổ trợ bóng đá.

---

## 🏋️ Thư viện chuyển động sinh học 60 FPS

Các bài tập thể hình tự thân (Calisthenics) được trang bị **Biomechanical Motion Engine**:
- **Khung hình vector động SVG 60 FPS:** Chuyển động đa điểm khớp (vai, cùi chỏ, hông, đầu gối, mắt cá) tái hiện chính xác pha hạ người (Eccentric) và pha đẩy/nâng (Concentric).
- **Bóng thở nhịp nhàng (Breathing Bubble Guide):** Phồng to khi *Hít vào* (hạ người/gồng bụng) và thu nhỏ khi *Thở ra* (dồn lực đẩy).
- **Bộ đếm hiệp & Tempo chuẩn:** Quy định nhịp 2-0-1 hoặc 2-1-1 từng giây, đếm số lần hoàn thành (Reps).
- **Tùy chỉnh tốc độ:** Hỗ trợ 0.75x, 1.0x, 1.25x và nút bật/tắt giảm tải hiệu ứng (Accessibility Reduced Motion).
- **Bộ hẹn giờ nghỉ giữa hiệp (Rest Countdown Timer):** Tích hợp âm báo và hiển thị đếm ngược 45s, 60s, 90s.

Danh mục bài tập:
1. `push-up` — Chống đẩy tiêu chuẩn
2. `diamond-push-up` — Chống đẩy kim cương
3. `squat` — Ngồi xổm tự thân
4. `reverse-lunge` — Chùng chân lùi bước
5. `plank` — Plank cẳng tay
6. `reverse-crunch` — Gập bụng ngược
7. `dead-bug` — Bọ chết ổn định cột sống
8. `glute-bridge` — Cầu hông
9. `backpack-row` — Kéo xô tạ ba lô
10. `mountain-climber` — Leo núi tại chỗ cardio
11. `football` — Buổi bóng đá 45 phút sân cỏ nhân tạo

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **Next.js** | 15.1.7 | Full-stack App Router, Server Components & Server Actions |
| **React** | 19.0.0 | Thư viện UI hiện đại nhất với hooks và streaming |
| **TypeScript** | 5.7.3 | Kiểu dữ liệu tĩnh nghiêm ngặt (`strict: true`) |
| **Tailwind CSS** | 3.4.17 | Thiết kế giao diện tiện ích tối ưu dark/light mode |
| **Recharts** | 2.15.1 | Biểu đồ trực quan hóa xu hướng calo, cân nặng và macro |
| **Lucide React** | 0.475.0 | Hệ thống biểu tượng giao diện hiện đại |
| **Prisma ORM** | 6.4.0 | Schema dữ liệu quan hệ PostgreSQL chuẩn mực |
| **CutTrack Isomorphic Engine** | 1.0.0 | Hệ thống lưu trữ bền vững JSON fallback không phụ thuộc setup DB bên ngoài |
| **Vitest** | 3.0.5 | Khung kiểm thử tự động tốc độ cao |

---

## 📂 Cấu trúc thư mục dự án

```text
CutTrack/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── .data/                       # Lưu trữ CSDL JSON bền vững cục bộ
├── prisma/
│   ├── schema.prisma            # Mô hình dữ liệu PostgreSQL Prisma
│   └── seed.ts                  # Dữ liệu khởi tạo chuẩn
├── public/
│   └── media/
│       ├── exercises/           # Hoạt ảnh vector SVG chuyển động & poster
│       └── foods/               # Đồ họa vector món ăn Việt Nam
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── dashboard/       # Trang tổng quan sức khỏe & biểu đồ 7 ngày
│   │   │   ├── diary/           # Nhật ký ăn uống 2 bữa/ngày
│   │   │   ├── meal-planner/    # Kế hoạch ăn 7 ngày & đánh giá cân nặng sáng
│   │   │   ├── foods/           # Danh mục & chi tiết thực phẩm (bộ chia khẩu phần)
│   │   │   ├── exercises/       # Thư viện bài tập động 60fps & chi tiết động học
│   │   │   ├── workouts/        # Ghi nhận buổi tập & đồng hồ đếm ngược nghỉ
│   │   │   ├── budget/          # Quản lý ngân sách 70k-80k VND/ngày
│   │   │   ├── progress/        # Theo dõi cân nặng & đo lường vòng cơ thể
│   │   │   ├── learn/           # 8 bài viết khoa học dinh dưỡng tiếng Việt
│   │   │   └── settings/        # Cấu hình cá nhân, an toàn thâm hụt & sao lưu
│   │   ├── globals.css          # CSS toàn cục & định nghĩa màu sắc Tailwind
│   │   └── layout.tsx           # Layout gốc với điều hướng đa thiết bị
│   ├── components/
│   │   ├── exercises/           # BiomechanicalMotionEngine
│   │   ├── planner/             # DailyDetailedPlanner & MorningWeighInEvaluation
│   │   ├── diary/               # DiaryView (khóa bữa trưa & mở bữa tối)
│   │   ├── foods/               # FoodDetailScaler (tính toán gram & calo động)
│   │   └── workouts/            # WorkoutSessionLogger & RestTimer
│   ├── features/
│   │   ├── learn/data/          # Dữ liệu bài viết khoa học
│   │   └── media/metadata.ts    # Metadata hình ảnh thực phẩm
│   └── lib/
│       ├── store/               # CSDL cuttrack-store quản lý dữ liệu bền vững
│       ├── server-actions.ts    # Xử lý tương tác Server Actions Next.js
│       └── utils.ts             # Tiện ích định dạng VND & CSS class
└── tests/
    └── unit/
        ├── budget.test.ts       # Kiểm thử ngân sách số nguyên VND
        ├── constraints.test.ts  # Kiểm thử quy tắc khóa quán trưa / mở tối
        ├── nutrition.test.ts    # Kiểm thử công thức BMR, TDEE & Macro
        ├── progress-assessment.test.ts # Kiểm thử bộ đánh giá cân nặng sáng
        ├── safety.test.ts       # Kiểm thử ngưỡng an toàn lâm sàng 1300 kcal
        └── timezone.test.ts     # Kiểm thử ngày giờ múi giờ Việt Nam (UTC+7)
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- **Node.js:** phiên bản `20.x` hoặc mới hơn.
- **Trình quản lý gói:** `pnpm` (khuyến nghị) hoặc `npm`.

### 2. Cài đặt các gói phụ thuộc
```bash
git clone https://github.com/ngxziet/CutTrack.git
cd CutTrack
pnpm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```

### 4. Khởi chạy máy chủ phát triển
```bash
pnpm dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

### 5. Xây dựng bản phát hành sản phẩm (Production Build)
```bash
pnpm build
pnpm start
```

---

## 🧪 Kiểm thử tự động (Unit Tests)

Hệ thống được tích hợp bộ kiểm thử đơn vị với **52 bài test độc lập** kiểm tra chặt chẽ các công thức khoa học, quy tắc ngân sách và tính an toàn:

```bash
pnpm test
```

**Kết quả kiểm thử:**
```text
 ✓ tests/unit/progress-assessment.test.ts (4 tests)
 ✓ tests/unit/nutrition.test.ts (12 tests)
 ✓ tests/unit/constraints.test.ts (8 tests)
 ✓ tests/unit/safety.test.ts (7 tests)
 ✓ tests/unit/timezone.test.ts (7 tests)
 ✓ tests/unit/budget.test.ts (14 tests)

 Test Files  6 passed (6)
      Tests  52 passed (52)
   Duration  ~600ms
```

---

## 📄 Giấy phép

Dự án được phân phối dưới giấy phép **MIT License**. Mọi cá nhân, tổ chức được tự do sử dụng, chỉnh sửa và triển khai phục vụ mục đích nâng cao sức khỏe cộng đồng.
