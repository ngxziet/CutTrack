import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = 'D:/CutTrack';
const FOOD_THUMBS_DIR = path.join(ROOT_DIR, 'public/media/foods/thumbnails');
const FOOD_DETAILS_DIR = path.join(ROOT_DIR, 'public/media/foods/details');
const EXERCISE_POSTERS_DIR = path.join(ROOT_DIR, 'public/media/exercises/posters');
const EXERCISE_ANIMATIONS_DIR = path.join(ROOT_DIR, 'public/media/exercises/animations');
const PLACEHOLDERS_DIR = path.join(ROOT_DIR, 'public/placeholders');
const ARTICLE_COVERS_DIR = path.join(ROOT_DIR, 'public/media/articles');

// Ensure all dirs exist
[
  FOOD_THUMBS_DIR,
  FOOD_DETAILS_DIR,
  EXERCISE_POSTERS_DIR,
  EXERCISE_ANIMATIONS_DIR,
  PLACEHOLDERS_DIR,
  ARTICLE_COVERS_DIR,
].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Helper for escaping XML
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// 15 Foods data
const foodsData = [
  {
    slug: 'com-trang',
    title: 'Cơm trắng',
    subtitle: 'Nguồn tinh bột nền tảng • Cơm tẻ dẻo thơm',
    badge: 'Tinh bột chuẩn',
    kcalText: '260 kcal / bát 200g',
    proteinText: '5.4g Protein • 57g Carbs',
    priceText: 'Kèm theo suất',
    accent: '#38bdf8',
    secondary: '#0284c7',
    iconType: 'rice',
    notes: 'Khối lượng tính theo cơm chín, không tính dầu mỡ'
  },
  {
    slug: 'com-ga-kho',
    title: 'Cơm gà kho',
    subtitle: 'Suất cơm trưa bình dân • Đùi gà kho sả gừng',
    badge: 'Cơm quán trưa 30k',
    kcalText: '550 - 620 kcal',
    proteinText: '28g - 34g Protein',
    priceText: '~30.000 đ',
    accent: '#f59e0b',
    secondary: '#b45309',
    iconType: 'chicken-dish',
    notes: 'Gà kho cả xương (~100g thịt ăn được + sốt kho)'
  },
  {
    slug: 'com-ech-kho',
    title: 'Cơm ếch kho',
    subtitle: 'Đạm nạc giàu khoáng chất • Kho tiêu ớt cay nồng',
    badge: 'Đạm nạc tối ưu',
    kcalText: '480 - 540 kcal',
    proteinText: '32g - 36g Protein',
    priceText: 'Giá theo quán',
    accent: '#10b981',
    secondary: '#047857',
    iconType: 'frog-dish',
    notes: 'Thịt ếch rất ít mỡ, phần đùi giàu leucine phục hồi cơ'
  },
  {
    slug: 'com-dau-hu-kho',
    title: 'Cơm đậu hũ kho',
    subtitle: 'Món chay đạm thực vật • Đậu hũ chiên kho tương',
    badge: 'Tiết kiệm & Thanh đạm',
    kcalText: '460 - 520 kcal',
    proteinText: '18g - 22g Protein',
    priceText: '~25.000 - 30.000 đ',
    accent: '#eab308',
    secondary: '#854d0e',
    iconType: 'tofu-dish',
    notes: 'Đậu hũ hút dầu khi chiên, lưu ý lượng dầu sốt'
  },
  {
    slug: 'com-thit-kho-trung',
    title: 'Cơm thịt kho trứng',
    subtitle: 'Thịt heo kho nước dừa truyền thống kèm trứng vịt/gà',
    badge: 'Món truyền thống (Lưu ý mỡ)',
    kcalText: '680 - 780 kcal',
    proteinText: '26g - 30g Protein',
    priceText: 'Giá theo quán',
    accent: '#ea580c',
    secondary: '#9a3412',
    iconType: 'pork-egg',
    notes: 'Chứa nhiều mỡ ba rọi; nên gạn bớt nước kho nhiều mỡ'
  },
  {
    slug: 'bun-rieu',
    title: 'Bún riêu cua',
    subtitle: 'Món nước đặc trưng • Cà chua, riêu cua, đậu hũ, huyết',
    badge: 'Bình dân 25k',
    kcalText: '450 - 520 kcal',
    proteinText: '20g - 24g Protein',
    priceText: '~25.000 đ',
    accent: '#ef4444',
    secondary: '#991b1b',
    iconType: 'noodle-soup',
    notes: 'Tính riêng 100g bún chín + huyết/mọc/xương; không húp hết nước lèo'
  },
  {
    slug: 'bun-bo-hue',
    title: 'Bún bò Huế',
    subtitle: 'Sợi bún to tròn đậm vị sả ớt • Bò nạm, giò heo, chả cua',
    badge: 'Đặc sản đậm đà',
    kcalText: '580 - 680 kcal',
    proteinText: '32g - 38g Protein',
    priceText: 'Người dùng nhập giá',
    accent: '#f43f5e',
    secondary: '#be123c',
    iconType: 'spicy-beef-noodle',
    notes: 'Nhập riêng bún chín, bò nạm, giò heo; không tính chung khẩu phần bún riêu'
  },
  {
    slug: 'hu-tieu-nuoc',
    title: 'Hủ tiếu nước',
    subtitle: 'Nước dùng trong ngọt thanh • Thịt nạc, trứng cút, hẹ xanh',
    badge: 'Món nước thanh nhẹ',
    kcalText: '420 - 490 kcal',
    proteinText: '22g - 26g Protein',
    priceText: 'Giá theo quán',
    accent: '#06b6d4',
    secondary: '#0e7490',
    iconType: 'clear-noodle',
    notes: 'Khẩu phần chuẩn 100g sợi chín + thịt/xương nạc riêng'
  },
  {
    slug: 'trung-ga-luoc',
    title: 'Trứng gà luộc',
    subtitle: 'Nguồn protein chuẩn sinh học • Bổ sung bữa tối tại nhà',
    badge: 'Protein vàng sinh học',
    kcalText: '72 kcal / quả (55g)',
    proteinText: '6.3g Protein • 5g Chất béo tốt',
    priceText: '~3.500 đ / quả',
    accent: '#facc15',
    secondary: '#a16207',
    iconType: 'boiled-egg',
    notes: 'Luộc 7-8 phút lòng đào dẻo, giàu choline và leucine'
  },
  {
    slug: 'ma-dui-ga-luoc',
    title: 'Má đùi gà luộc',
    subtitle: 'Thịt mọng nước ngọt tự nhiên • Bổ sung bữa tối tại nhà',
    badge: 'Đạm nạc chất lượng cao',
    kcalText: '165 - 190 kcal / 100g thịt',
    proteinText: '22g - 24g Protein',
    priceText: 'Tự mua siêu thị/chợ',
    accent: '#14b8a6',
    secondary: '#0f766e',
    iconType: 'chicken-thigh',
    notes: 'Định lượng tính trên thịt ăn được; bỏ da để giảm 50% chất béo'
  },
  {
    slug: 'nua-con-ga-nuong',
    title: 'Nửa con gà nướng',
    subtitle: 'Gà nướng than vàng óng • Bữa phục hồi ngày đá banh',
    badge: 'Bữa đặc biệt thể thao',
    kcalText: '750 - 900 kcal',
    proteinText: '65g - 75g Protein',
    priceText: 'Bữa thưởng tuần',
    accent: '#f97316',
    secondary: '#c2410c',
    iconType: 'roast-chicken',
    notes: 'Trọng lượng mua 400-500g cả xương và da (~250-280g thịt ăn được)'
  },
  {
    slug: 'com-lam',
    title: 'Cơm lam nướng nứa',
    subtitle: 'Nếp nương dẻo bùi trong ống tre • Tinh bột phục hồi glycogen',
    badge: 'Tinh bột nạp năng lượng',
    kcalText: '320 - 360 kcal / ống 150g',
    proteinText: '5.8g Protein • 72g Carbs',
    priceText: 'Ăn kèm gà nướng',
    accent: '#84cc16',
    secondary: '#4d7c0f',
    iconType: 'bamboo-rice',
    notes: 'Món ăn kèm bữa đặc biệt sau buổi đá banh phục hồi glycogen cơ bắp'
  },
  {
    slug: 'banh-bao',
    title: 'Bánh bao thịt trứng cút',
    subtitle: 'Bánh bao hấp vỏ trắng xốp • Nhân thịt nạc, mộc nhĩ, 2 trứng cút',
    badge: 'Bữa phụ / Kèm đá banh',
    kcalText: '320 - 380 kcal / cái (130g)',
    proteinText: '12g Protein • 45g Carbs',
    priceText: '~15.000 đ',
    accent: '#a855f7',
    secondary: '#7e22ce',
    iconType: 'steamed-bun',
    notes: 'Nguồn tinh bột và đạm tiện lợi trong ngày thể thao tiêu hao nhiều năng lượng'
  },
  {
    slug: 'yomost',
    title: 'Sữa chua uống Yomost',
    subtitle: 'Sữa chua lên men hương cam/dâu • Bù đường nhanh và tiêu hóa',
    badge: 'Carb hấp thu nhanh',
    kcalText: '110 kcal / hộp 170ml',
    proteinText: '1.8g Protein • 24g Carbs',
    priceText: '~8.000 đ / hộp',
    accent: '#06b6d4',
    secondary: '#0891b2',
    iconType: 'drink-carton',
    notes: 'Thích hợp nạp carb nhẹ trước hoặc ngay sau khi đá banh 45 phút'
  },
  {
    slug: 'pepsi-zero',
    title: 'Pepsi Không Calo (Zero)',
    subtitle: 'Nước giải khát có ga vị cola • Không đường, 0 calo giải tỏa thèm ngọt',
    badge: '0 Kcal • Zero Sugar',
    kcalText: '0 kcal / lon 330ml',
    proteinText: '0g Protein • 0g Carbs',
    priceText: '~10.000 đ / lon',
    accent: '#3b82f6',
    secondary: '#1d4ed8',
    iconType: 'soda-can',
    notes: 'Công cụ hữu hiệu cắt giảm đường khi giảm mỡ mà vẫn thỏa mãn vị giác'
  }
];

// Vector food icon drawer
function renderFoodIllustration(iconType, cx, cy, size, accent, secondary) {
  const r = size * 0.45;
  switch (iconType) {
    case 'rice':
      return `
        <!-- Bowl -->
        <ellipse cx="${cx}" cy="${cy + r*0.35}" rx="${r*0.9}" ry="${r*0.25}" fill="#0f172a" opacity="0.3"/>
        <path d="M ${cx - r*0.8} ${cy} C ${cx - r*0.8} ${cy + r*0.8} ${cx + r*0.8} ${cy + r*0.8} ${cx + r*0.8} ${cy} Z" fill="#334155" stroke="#64748b" stroke-width="3"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${r*0.8}" ry="${r*0.35}" fill="#475569" stroke="#64748b" stroke-width="2"/>
        <!-- Rice heap -->
        <path d="M ${cx - r*0.75} ${cy} C ${cx - r*0.6} ${cy - r*0.65} ${cx + r*0.6} ${cy - r*0.65} ${cx + r*0.75} ${cy} Z" fill="#f8fafc"/>
        <ellipse cx="${cx}" cy="${cy - r*0.25}" rx="${r*0.5}" ry="${r*0.25}" fill="#ffffff"/>
        <!-- Steam -->
        <path d="M ${cx - 20} ${cy - r*0.7} Q ${cx - 30} ${cy - r*1.1} ${cx - 20} ${cy - r*1.4}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
        <path d="M ${cx} ${cy - r*0.8} Q ${cx + 10} ${cy - r*1.2} ${cx} ${cy - r*1.5}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
        <path d="M ${cx + 20} ${cy - r*0.7} Q ${cx + 10} ${cy - r*1.1} ${cx + 20} ${cy - r*1.4}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
        <!-- Chopsticks -->
        <line x1="${cx - r}" y1="${cy - r*0.3}" x2="${cx + r*1.2}" y2="${cy - r*0.9}" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
        <line x1="${cx - r*0.9}" y1="${cy - r*0.1}" x2="${cx + r*1.3}" y2="${cy - r*0.7}" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>
      `;

    case 'chicken-dish':
    case 'roast-chicken':
      return `
        <!-- Plate -->
        <ellipse cx="${cx}" cy="${cy + r*0.4}" rx="${r*1.1}" ry="${r*0.4}" fill="#0f172a" opacity="0.4"/>
        <ellipse cx="${cx}" cy="${cy + r*0.2}" rx="${r*1.05}" ry="${r*0.35}" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <ellipse cx="${cx}" cy="${cy + r*0.2}" rx="${r*0.85}" ry="${r*0.25}" fill="#334155"/>
        <!-- Chicken Drumstick / Roast -->
        <g transform="translate(${cx - r*0.4}, ${cy - r*0.3})">
          <ellipse cx="40" cy="20" rx="${r*0.5}" ry="${r*0.35}" fill="${accent}" transform="rotate(-20 40 20)"/>
          <ellipse cx="30" cy="15" rx="${r*0.4}" ry="${r*0.25}" fill="${secondary}" transform="rotate(-20 30 15)"/>
          <!-- Bone -->
          <line x1="-15" y1="40" x2="10" y2="25" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <circle cx="-16" cy="36" r="6" fill="#f8fafc"/>
          <circle cx="-14" cy="45" r="6" fill="#f8fafc"/>
          <!-- Garnish & glaze -->
          <circle cx="35" cy="12" r="3" fill="#22c55e"/>
          <circle cx="50" cy="22" r="3" fill="#ef4444"/>
          <circle cx="42" cy="30" r="2.5" fill="#22c55e"/>
        </g>
        <!-- Steam -->
        <path d="M ${cx} ${cy - r*0.6} Q ${cx - 15} ${cy - r*1.0} ${cx} ${cy - r*1.3}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
      `;

    case 'frog-dish':
      return `
        <!-- Claypot -->
        <ellipse cx="${cx}" cy="${cy + r*0.3}" rx="${r}" ry="${r*0.35}" fill="#0f172a" opacity="0.4"/>
        <ellipse cx="${cx}" cy="${cy + r*0.1}" rx="${r*0.9}" ry="${r*0.32}" fill="#78350f" stroke="#92400e" stroke-width="4"/>
        <ellipse cx="${cx}" cy="${cy + r*0.1}" rx="${r*0.75}" ry="${r*0.22}" fill="#451a03"/>
        <!-- Frog meat pieces with savory pepper glaze -->
        <circle cx="${cx - 25}" cy="${cy + 5}" r="${r*0.22}" fill="#059669"/>
        <circle cx="${cx + 20}" cy="${cy}" r="${r*0.24}" fill="#10b981"/>
        <circle cx="${cx - 5}" cy="${cy + 15}" r="${r*0.2}" fill="#34d399"/>
        <!-- Scallion & chili rings -->
        <circle cx="${cx - 15}" cy="${cy + 2}" r="4" fill="#ef4444"/>
        <circle cx="${cx + 10}" cy="${cy + 10}" r="4" fill="#22c55e"/>
        <circle cx="${cx + 25}" cy="${cy - 5}" r="3" fill="#facc15"/>
        <!-- Steam -->
        <path d="M ${cx} ${cy - r*0.5} Q ${cx + 15} ${cy - r*0.9} ${cx} ${cy - r*1.2}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
      `;

    case 'tofu-dish':
      return `
        <!-- Plate -->
        <ellipse cx="${cx}" cy="${cy + r*0.3}" rx="${r*1.05}" ry="${r*0.35}" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <ellipse cx="${cx}" cy="${cy + r*0.3}" rx="${r*0.8}" ry="${r*0.22}" fill="#334155"/>
        <!-- Golden fried tofu cubes -->
        <rect x="${cx - 50}" y="${cy - 20}" width="42" height="34" rx="6" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <rect x="${cx + 8}" y="${cy - 28}" width="45" height="36" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
        <rect x="${cx - 20}" y="${cy}" width="40" height="32" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
        <!-- Scallions and soy sauce sheen -->
        <circle cx="${cx - 30}" cy="${cy - 5}" r="3.5" fill="#22c55e"/>
        <circle cx="${cx + 25}" cy="${cy - 12}" r="3.5" fill="#22c55e"/>
        <circle cx="${cx}" cy="${cy + 15}" r="3" fill="#ef4444"/>
      `;

    case 'pork-egg':
      return `
        <!-- Bowl -->
        <ellipse cx="${cx}" cy="${cy + r*0.3}" rx="${r}" ry="${r*0.32}" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <ellipse cx="${cx}" cy="${cy + r*0.3}" rx="${r*0.8}" ry="${r*0.22}" fill="#451a03"/>
        <!-- Braised Pork belly cubes -->
        <rect x="${cx - 55}" y="${cy - 15}" width="48" height="35" rx="5" fill="#b45309" stroke="#78350f" stroke-width="2"/>
        <path d="M ${cx - 55} ${cy - 15} Q ${cx - 31} ${cy - 22} ${cx - 7} ${cy - 15} L ${cx - 7} ${cy - 5} L ${cx - 55} ${cy - 5} Z" fill="#f59e0b"/>
        <!-- Braised Egg halved / whole -->
        <ellipse cx="${cx + 30}" cy="${cy}" rx="28" ry="34" fill="#d97706" transform="rotate(15 ${cx+30} ${cy})"/>
        <ellipse cx="${cx + 28}" cy="${cy}" rx="18" ry="22" fill="#fbbf24" transform="rotate(15 ${cx+28} ${cy})"/>
        <ellipse cx="${cx + 28}" cy="${cy}" rx="10" ry="12" fill="#fef08a" transform="rotate(15 ${cx+28} ${cy})"/>
        <!-- Chili & pepper -->
        <circle cx="${cx - 20}" cy="${cy + 8}" r="3.5" fill="#ef4444"/>
      `;

    case 'noodle-soup':
    case 'spicy-beef-noodle':
    case 'clear-noodle':
      const brothColor = iconType === 'spicy-beef-noodle' ? '#be123c' : (iconType === 'noodle-soup' ? '#dc2626' : '#0284c7');
      const brothFill = iconType === 'spicy-beef-noodle' ? '#e11d48' : (iconType === 'noodle-soup' ? '#ef4444' : '#38bdf8');
      return `
        <!-- Big Bowl -->
        <ellipse cx="${cx}" cy="${cy + r*0.4}" rx="${r*0.95}" ry="${r*0.3}" fill="#0f172a" opacity="0.4"/>
        <path d="M ${cx - r*0.85} ${cy} C ${cx - r*0.85} ${cy + r*0.9} ${cx + r*0.85} ${cy + r*0.9} ${cx + r*0.85} ${cy} Z" fill="#1e293b" stroke="#475569" stroke-width="4"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${r*0.85}" ry="${r*0.32}" fill="${brothColor}" stroke="#64748b" stroke-width="3"/>
        <ellipse cx="${cx}" cy="${cy + 5}" rx="${r*0.75}" ry="${r*0.25}" fill="${brothFill}" opacity="0.85"/>
        <!-- Noodle strands -->
        <path d="M ${cx - 40} ${cy} Q ${cx - 10} ${cy + 15} ${cx + 30} ${cy}" stroke="#fef08a" stroke-width="4" fill="none"/>
        <path d="M ${cx - 30} ${cy + 8} Q ${cx} ${cy + 20} ${cx + 40} ${cy + 6}" stroke="#fef08a" stroke-width="4" fill="none"/>
        <!-- Toppings -->
        <circle cx="${cx - 30}" cy="${cy - 2}" r="14" fill="#991b1b"/> <!-- Beef / Blood cube -->
        <circle cx="${cx + 25}" cy="${cy - 3}" r="15" fill="#fbbf24"/> <!-- Tofu / Quail egg -->
        <path d="M ${cx - 10} ${cy - 12} L ${cx + 10} ${cy - 15} L ${cx + 5} ${cy - 2} Z" fill="#22c55e"/> <!-- Lime / Herb -->
        <!-- Steam -->
        <path d="M ${cx - 20} ${cy - r*0.6} Q ${cx - 35} ${cy - r*1.0} ${cx - 20} ${cy - r*1.3}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
        <path d="M ${cx + 20} ${cy - r*0.6} Q ${cx + 5} ${cy - r*1.0} ${cx + 20} ${cy - r*1.3}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
      `;

    case 'boiled-egg':
      return `
        <!-- Halved Egg and Whole Egg -->
        <ellipse cx="${cx}" cy="${cy + r*0.4}" rx="${r*0.8}" ry="${r*0.25}" fill="#0f172a" opacity="0.3"/>
        <!-- Whole egg behind -->
        <ellipse cx="${cx - 30}" cy="${cy}" rx="32" ry="44" fill="#fde68a" stroke="#d97706" stroke-width="2" transform="rotate(-25 ${cx-30} ${cy})"/>
        <!-- Cut egg in front -->
        <ellipse cx="${cx + 25}" cy="${cy + 10}" rx="36" ry="46" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" transform="rotate(15 ${cx+25} ${cy+10})"/>
        <!-- Creamy golden yolk -->
        <circle cx="${cx + 26}" cy="${cy + 12}" r="22" fill="#f59e0b"/>
        <circle cx="${cx + 24}" cy="${cy + 10}" r="15" fill="#fbbf24"/>
        <circle cx="${cx + 20}" cy="${cy + 7}" r="6" fill="#fef08a"/>
      `;

    case 'chicken-thigh':
      return `
        <!-- Chicken thigh fillet / bone-in -->
        <ellipse cx="${cx}" cy="${cy + r*0.35}" rx="${r*0.9}" ry="${r*0.28}" fill="#0f172a" opacity="0.3"/>
        <!-- Plate -->
        <ellipse cx="${cx}" cy="${cy + r*0.2}" rx="${r*0.85}" ry="${r*0.28}" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <!-- Juicy meat -->
        <path d="M ${cx - 50} ${cy + 10} C ${cx - 60} ${cy - 30} ${cx + 20} ${cy - 40} ${cx + 55} ${cy - 5} C ${cx + 65} ${cy + 25} ${cx - 20} ${cy + 35} ${cx - 50} ${cy + 10} Z" fill="#14b8a6" stroke="#0d9488" stroke-width="3"/>
        <path d="M ${cx - 35} ${cy + 5} C ${cx - 45} ${cy - 20} ${cx + 10} ${cy - 25} ${cx + 40} ${cy} Z" fill="#2dd4bf"/>
        <!-- Bone tip -->
        <circle cx="${cx - 48}" cy="${cy + 12}" r="8" fill="#f8fafc"/>
        <!-- Salt & pepper & lime -->
        <circle cx="${cx + 20}" cy="${cy + 10}" r="3" fill="#ef4444"/>
        <circle cx="${cx + 5}" cy="${cy + 5}" r="3" fill="#22c55e"/>
        <circle cx="${cx + 35}" cy="${cy - 8}" r="2.5" fill="#facc15"/>
      `;

    case 'bamboo-rice':
      return `
        <!-- Bamboo tube split -->
        <ellipse cx="${cx}" cy="${cy + r*0.35}" rx="${r}" ry="${r*0.25}" fill="#0f172a" opacity="0.3"/>
        <!-- Bamboo outer green -->
        <rect x="${cx - 70}" y="${cy - 22}" width="140" height="48" rx="8" fill="#4d7c0f" stroke="#65a30d" stroke-width="3"/>
        <!-- Split bamboo showing white sticky rice -->
        <rect x="${cx - 55}" y="${cy - 12}" width="110" height="28" rx="5" fill="#f8fafc"/>
        <!-- Rice grain details & sesame seeds -->
        <line x1="${cx - 50}" y1="${cy}" x2="${cx + 50}" y2="${cy}" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4 4"/>
        <circle cx="${cx - 25}" cy="${cy - 3}" r="2" fill="#78350f"/>
        <circle cx="${cx}" cy="${cy + 3}" r="2" fill="#78350f"/>
        <circle cx="${cx + 25}" cy="${cy - 2}" r="2" fill="#78350f"/>
        <!-- Bamboo joints -->
        <line x1="${cx - 20}" y1="${cy - 22}" x2="${cx - 20}" y2="${cy + 26}" stroke="#365314" stroke-width="3"/>
        <line x1="${cx + 25}" y1="${cy - 22}" x2="${cx + 25}" y2="${cy + 26}" stroke="#365314" stroke-width="3"/>
      `;

    case 'steamed-bun':
      return `
        <!-- Paper liner -->
        <ellipse cx="${cx}" cy="${cy + r*0.38}" rx="${r*0.65}" ry="${r*0.2}" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
        <!-- Fluffy white bun body -->
        <ellipse cx="${cx}" cy="${cy + 10}" rx="60" ry="46" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>
        <!-- Bun top pleats -->
        <path d="M ${cx - 35} ${cy + 5} Q ${cx} ${cy - 25} ${cx} ${cy - 25}" stroke="#cbd5e1" stroke-width="3" fill="none"/>
        <path d="M ${cx + 35} ${cy + 5} Q ${cx} ${cy - 25} ${cx} ${cy - 25}" stroke="#cbd5e1" stroke-width="3" fill="none"/>
        <path d="M ${cx} ${cy + 15} Q ${cx} ${cy - 25} ${cx} ${cy - 25}" stroke="#cbd5e1" stroke-width="3" fill="none"/>
        <!-- Red top dot -->
        <circle cx="${cx}" cy="${cy - 25}" r="5" fill="#ef4444"/>
        <!-- Steam -->
        <path d="M ${cx - 15} ${cy - 40} Q ${cx - 25} ${cy - 65} ${cx - 15} ${cy - 85}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
        <path d="M ${cx + 15} ${cy - 40} Q ${cx + 5} ${cy - 65} ${cx + 15} ${cy - 85}" stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
      `;

    case 'drink-carton':
      return `
        <!-- Carton shadow -->
        <ellipse cx="${cx}" cy="${cy + r*0.4}" rx="${r*0.5}" ry="${r*0.18}" fill="#0f172a" opacity="0.3"/>
        <!-- Carton body -->
        <rect x="${cx - 32}" y="${cy - 45}" width="64" height="90" rx="6" fill="#0891b2" stroke="#0e7490" stroke-width="3"/>
        <rect x="${cx - 28}" y="${cy - 30}" width="56" height="55" rx="4" fill="#06b6d4"/>
        <!-- Yogurt swirl / splash -->
        <path d="M ${cx - 20} ${cy} C ${cx - 10} ${cy - 15} ${cx + 15} ${cy + 10} ${cx + 20} ${cy - 5}" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Orange slice graphic -->
        <circle cx="${cx}" cy="${cy + 5}" r="12" fill="#f97316"/>
        <circle cx="${cx}" cy="${cy + 5}" r="7" fill="#fed7aa"/>
        <!-- Straw -->
        <line x1="${cx + 10}" y1="${cy - 45}" x2="${cx + 25}" y2="${cy - 75}" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
        <line x1="${cx + 25}" y1="${cy - 75}" x2="${cx + 38}" y2="${cy - 70}" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
      `;

    case 'soda-can':
      return `
        <!-- Can shadow -->
        <ellipse cx="${cx}" cy="${cy + r*0.4}" rx="${r*0.48}" ry="${r*0.18}" fill="#0f172a" opacity="0.3"/>
        <!-- Can cylinder -->
        <rect x="${cx - 30}" y="${cy - 48}" width="60" height="96" rx="8" fill="#090d16" stroke="#2563eb" stroke-width="3"/>
        <!-- Metallic top & bottom rim -->
        <ellipse cx="${cx}" cy="${cy - 48}" rx="30" ry="10" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>
        <ellipse cx="${cx}" cy="${cy + 48}" rx="30" ry="10" fill="#64748b"/>
        <!-- Pepsi Globe Ribbon -->
        <path d="M ${cx - 28} ${cy - 12} C ${cx - 10} ${cy - 24} ${cx + 10} ${cy} ${cx + 28} ${cy - 12} L ${cx + 28} ${cy - 20} L ${cx - 28} ${cy - 20} Z" fill="#ef4444"/>
        <path d="M ${cx - 28} ${cy + 8} C ${cx - 10} ${cy} ${cx + 10} ${cy + 20} ${cx + 28} ${cy + 8} L ${cx + 28} ${cy + 18} L ${cx - 28} ${cy + 18} Z" fill="#2563eb"/>
        <!-- ZERO text -->
        <text x="${cx}" y="${cy + 2}" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="2">ZERO</text>
        <!-- Bubbles / Condensation -->
        <circle cx="${cx - 18}" cy="${cy - 30}" r="2" fill="#60a5fa" opacity="0.8"/>
        <circle cx="${cx + 18}" cy="${cy + 28}" r="2.5" fill="#60a5fa" opacity="0.8"/>
      `;

    default:
      return `<circle cx="${cx}" cy="${cy}" r="${r*0.5}" fill="${accent}"/>`;
  }
}

// Generate Food SVG (both 4:3 and 16:9)
function generateFoodSvg(food, ratio) {
  const is4x3 = ratio === '4:3';
  const width = is4x3 ? 800 : 1280;
  const height = is4x3 ? 600 : 720;
  const cx = is4x3 ? 400 : 420;
  const cy = is4x3 ? 270 : 360;
  const iconSize = is4x3 ? 240 : 290;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad_${food.slug}_${ratio.replace(':', '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <radialGradient id="glow_${food.slug}_${ratio.replace(':', '_')}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${food.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${food.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad_${food.slug}_${ratio.replace(':', '_')})"/>
  <rect width="${width}" height="${height}" fill="url(#glow_${food.slug}_${ratio.replace(':', '_')})"/>

  <!-- Subtle Grid Pattern -->
  <g opacity="0.08" stroke="#94a3b8" stroke-width="1">
    ${Array.from({ length: Math.ceil(width / 40) }).map((_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="${height}"/>`).join('')}
    ${Array.from({ length: Math.ceil(height / 40) }).map((_, i) => `<line x1="0" y1="${i*40}" x2="${width}" y2="${i*40}"/>`).join('')}
  </g>

  <!-- Decorative Corner Accents -->
  <path d="M 24 50 L 24 24 L 50 24" stroke="${food.accent}" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M ${width-50} 24 L ${width-24} 24 L ${width-24} 50" stroke="${food.accent}" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M 24 ${height-50} L 24 ${height-24} L 50 ${height-24}" stroke="${food.accent}" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M ${width-50} ${height-24} L ${width-24} ${height-24} L ${width-24} ${height-50}" stroke="${food.accent}" stroke-width="3" fill="none" opacity="0.7"/>

  <!-- Top Badges Bar -->
  <g transform="translate(36, 36)">
    <!-- CutTrack Logo Badge -->
    <rect width="180" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <circle cx="17" cy="17" r="7" fill="${food.accent}"/>
    <text x="32" y="22" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">CUTTRACK MEDIA</text>

    <!-- Category Badge -->
    <rect x="192" y="0" width="160" height="34" rx="17" fill="${food.secondary}" opacity="0.3"/>
    <rect x="192" y="0" width="160" height="34" rx="17" fill="none" stroke="${food.accent}" stroke-width="1.5"/>
    <text x="272" y="22" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" fill="${food.accent}" text-anchor="middle">${escapeXml(food.badge)}</text>
  </g>

  <!-- Ratio & Verified Badge (Top Right) -->
  <g transform="translate(${width - 230}, 36)">
    <rect width="194" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="6" y="6" width="55" height="22" rx="11" fill="#3b82f6" opacity="0.25"/>
    <text x="33.5" y="21" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#60a5fa" text-anchor="middle">${ratio}</text>
    <text x="122" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">Official Placeholder</text>
  </g>

  <!-- Main Illustration Central Area -->
  <g id="illustration">
    ${renderFoodIllustration(food.iconType, cx, cy, iconSize, food.accent, food.secondary)}
  </g>

  ${is4x3 ? `
  <!-- Bottom Info Panel (4:3 layout) -->
  <g transform="translate(36, ${height - 180})">
    <rect width="${width - 72}" height="144" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>
    
    <!-- Title & Subtitle -->
    <text x="24" y="38" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" fill="#f8fafc">${escapeXml(food.title)}</text>
    <text x="24" y="62" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="14" fill="#94a3b8">${escapeXml(food.subtitle)}</text>

    <!-- Nutrition Pills -->
    <g transform="translate(24, 82)">
      <!-- Calorie Pill -->
      <rect width="190" height="36" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <circle cx="16" cy="18" r="5" fill="#f59e0b"/>
      <text x="28" y="23" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">${escapeXml(food.kcalText)}</text>

      <!-- Protein Pill -->
      <g transform="translate(202, 0)">
        <rect width="190" height="36" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <circle cx="16" cy="18" r="5" fill="#10b981"/>
        <text x="28" y="23" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">${escapeXml(food.proteinText)}</text>
      </g>

      <!-- Price Pill -->
      <g transform="translate(404, 0)">
        <rect width="160" height="36" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <text x="14" y="23" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="${food.accent}">${escapeXml(food.priceText)}</text>
      </g>
    </g>

    <!-- Source & License Line -->
    <text x="${width - 96}" y="128" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#64748b" text-anchor="end">CutTrack Project Asset • CC BY-SA 4.0</text>
  </g>
  ` : `
  <!-- Right Info Panel (16:9 detail layout) -->
  <g transform="translate(${width - 480}, 110)">
    <rect width="440" height="${height - 150}" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>
    
    <g transform="translate(32, 40)">
      <!-- Title -->
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="36" fill="#f8fafc">${escapeXml(food.title)}</text>
      <text x="0" y="30" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="15" fill="#94a3b8">${escapeXml(food.subtitle)}</text>

      <!-- Divider -->
      <line x1="0" y1="55" x2="376" y2="55" stroke="#334155" stroke-width="1"/>

      <!-- Calorie Stat Card -->
      <g transform="translate(0, 75)">
        <rect width="376" height="56" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="20" y="25" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">NĂNG LƯỢNG ƯỚC TÍNH</text>
        <text x="20" y="46" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#f59e0b">${escapeXml(food.kcalText)}</text>
        <circle cx="345" cy="28" r="14" fill="#f59e0b" opacity="0.2"/>
        <path d="M 345 20 L 341 28 L 345 28 L 344 36 L 349 27 L 345 27 Z" fill="#f59e0b"/>
      </g>

      <!-- Protein & Macros Stat Card -->
      <g transform="translate(0, 145)">
        <rect width="376" height="56" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="20" y="25" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">CHỈ SỐ PROTEIN VÀ MACRO</text>
        <text x="20" y="46" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#10b981">${escapeXml(food.proteinText)}</text>
        <circle cx="345" cy="28" r="14" fill="#10b981" opacity="0.2"/>
        <text x="345" y="33" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#10b981" text-anchor="middle">P</text>
      </g>

      <!-- Price Card -->
      <g transform="translate(0, 215)">
        <rect width="376" height="56" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="20" y="25" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">ĐƠN GIÁ THAM KHẢO</text>
        <text x="20" y="46" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="${food.accent}">${escapeXml(food.priceText)}</text>
      </g>

      <!-- Note / Guidance Card -->
      <g transform="translate(0, 285)">
        <rect width="376" height="70" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#38bdf8">💡 LƯU Ý ĐỊNH LƯỢNG:</text>
        <text x="16" y="45" font-family="system-ui, sans-serif" font-weight="400" font-size="13" fill="#cbd5e1">${escapeXml(food.notes.slice(0, 48))}</text>
        <text x="16" y="62" font-family="system-ui, sans-serif" font-weight="400" font-size="13" fill="#cbd5e1">${escapeXml(food.notes.slice(48))}</text>
      </g>

      <!-- Footer attribution -->
      <g transform="translate(0, 385)">
        <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#64748b">CutTrack Nutrition Spec • Đồ họa SVG véc-tơ độc quyền</text>
        <text x="0" y="18" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#475569">Bản quyền: CC BY-SA 4.0 | isPlaceholder: true</text>
      </g>
    </g>
  </g>
  `}
</svg>`;
}

// 11 Exercises Data
const exercisesData = [
  {
    slug: 'push-up',
    title: 'Standard Push-up',
    nameVi: 'Chống đẩy tiêu chuẩn',
    targets: 'Cơ ngực lớn • Tay sau (Triceps) • Vai trước • Cơ lõi',
    difficulty: 'Cơ bản / Nền tảng',
    setsReps: '3 hiệp × 12-18 cái (dưới ngưỡng kiệt sức)',
    tempo: '2-0-1-0 (2s hạ kiểm soát, 1s đẩy bùng nổ)',
    accent: '#38bdf8',
    secondary: '#0284c7',
    tips: ['Thẳng từ gót đến đầu', 'Cùi chỏ 45° so với thân', 'Khóa chặt bả vai khi đẩy'],
    poseType: 'pushup'
  },
  {
    slug: 'diamond-push-up',
    title: 'Diamond Push-up',
    nameVi: 'Chống đẩy kim cương',
    targets: 'Tay sau (Triceps Focus) • Rãnh ngực trong • Vai trước',
    difficulty: 'Nâng cao (Advanced)',
    setsReps: '3 hiệp × 8-12 cái',
    tempo: '2-1-1-0 (Tập trung siết bắp tay sau)',
    accent: '#818cf8',
    secondary: '#4f46e5',
    tips: ['Ngón trỏ & cái chạm nhau hình thoi', 'Cùi chỏ khép sát mạn sườn', 'Hít sâu khi ngực chạm mu bàn tay'],
    poseType: 'diamond-pushup'
  },
  {
    slug: 'squat',
    title: 'Bodyweight Squat',
    nameVi: 'Ngồi xổm tự thân',
    targets: 'Cơ tứ đầu đùi (Quads) • Mông lớn (Glutes) • Gân kheo',
    difficulty: 'Cơ bản (Beginner)',
    setsReps: '3-4 hiệp × 15-20 cái',
    tempo: '2-1-1-0 (Hạ đùi song song mặt sàn)',
    accent: '#10b981',
    secondary: '#059669',
    tips: ['Gối mở theo hướng mũi chân', 'Lưng thẳng, ngực mở tự nhiên', 'Đẩy qua gót và giữa bàn chân'],
    poseType: 'squat'
  },
  {
    slug: 'reverse-lunge',
    title: 'Reverse Lunge',
    nameVi: 'Chùng chân lùi bước',
    targets: 'Cơ mông • Đùi trước • Thăng bằng đơn chi • Khớp gối an toàn',
    difficulty: 'Trung bình (Intermediate)',
    setsReps: '3 hiệp × 10-12 cái / mỗi chân',
    tempo: '2-0-1-0 (Lùi kiểm soát êm ái)',
    accent: '#34d399',
    secondary: '#059669',
    tips: ['Gối trước góc 90°, không đổ quá mũi chân', 'Gối sau chạm nhẹ sàn', 'Thân người hơi đổ nhẹ về trước'],
    poseType: 'lunge'
  },
  {
    slug: 'plank',
    title: 'Forearm Plank',
    nameVi: 'Plank cẳng tay gồng bụng',
    targets: 'Cơ bụng ngang (TVA) • Trực bụng • Cơ vai • Ổn định thắt lưng',
    difficulty: 'Cơ bản đến trung cấp',
    setsReps: '3 hiệp × 30-45 giây',
    tempo: 'Isometric Hold (Gồng căng liên tục)',
    accent: '#fbbf24',
    secondary: '#d97706',
    tips: ['Cuộn xương chậu nhẹ về sau (posterior tilt)', 'Không võng lưng, không nhô mông', 'Thở đều ngắn qua mũi và miệng'],
    poseType: 'plank'
  },
  {
    slug: 'reverse-crunch',
    title: 'Reverse Crunch',
    nameVi: 'Gập bụng ngược',
    targets: 'Bụng dưới (Lower Abs) • Cơ chéo bụng • Không ép cổ gáy',
    difficulty: 'Trung bình (Intermediate)',
    setsReps: '3 hiệp × 12-15 cái',
    tempo: '2-1-2-0 (Cuộn xương chậu có ý thức)',
    accent: '#f97316',
    secondary: '#ea580c',
    tips: ['Dùng cơ bụng nâng xương chậu lên khỏi sàn', 'Không vung chân tạo quán tính', 'Hạ hông chậm rãi có kiểm soát'],
    poseType: 'reverse-crunch'
  },
  {
    slug: 'dead-bug',
    title: 'Dead Bug',
    nameVi: 'Bọ chết ổn định cột sống',
    targets: 'Lõi sâu (Deep Core) • Phối hợp thần kinh cơ chéo • An toàn lưng',
    difficulty: 'Cơ bản (An toàn tuyệt đối)',
    setsReps: '3 hiệp × 8-10 cái / mỗi bên',
    tempo: '3-1-3-0 (Chuyển động chậm rãi)',
    accent: '#a855f7',
    secondary: '#7e22ce',
    tips: ['Ép phẳng hoàn toàn thắt lưng xuống thảm', 'Tay và chân đối bên hạ đồng thời', 'Duy trì áp lực ổ bụng trong suốt rep'],
    poseType: 'dead-bug'
  },
  {
    slug: 'glute-bridge',
    title: 'Glute Bridge',
    nameVi: 'Cầu hông kích hoạt mông',
    targets: 'Cơ mông lớn (Gluteus Maximus) • Gân kheo • Duỗi hông',
    difficulty: 'Cơ bản (Beginner)',
    setsReps: '3 hiệp × 15-20 cái',
    tempo: '2-2-1-0 (Giữ siết 2s tại đỉnh)',
    accent: '#ec4899',
    secondary: '#be185d',
    tips: ['Đẩy lực qua gót chân', 'Siết chặt cơ mông tại điểm cao nhất', 'Không ưỡn quá đà vào thắt lưng'],
    poseType: 'glute-bridge'
  },
  {
    slug: 'backpack-row',
    title: 'Backpack Row',
    nameVi: 'Kéo tạ ba lô tự chế',
    targets: 'Cơ xô (Lats) • Lưng giữa (Rhomboids) • Bắp tay trước',
    difficulty: 'Trung bình (Intermediate)',
    setsReps: '3-4 hiệp × 10-12 cái',
    tempo: '2-1-1-0 (Kéo nhanh, siết đỉnh 1s, hạ chậm 2s)',
    accent: '#06b6d4',
    secondary: '#0891b2',
    tips: ['Hông đẩy ra sau (hip hinge), lưng phẳng', 'Kéo cùi chỏ sát mạn sườn hướng về hông', 'Ép chặt hai bả vai vào nhau'],
    poseType: 'backpack-row'
  },
  {
    slug: 'mountain-climber',
    title: 'Mountain Climber',
    nameVi: 'Leo núi tại chỗ',
    targets: 'Sức bền cơ tim • Cơ bụng trực & chéo • Độ bền vai',
    difficulty: 'Trung bình (Cardio Conditioning)',
    setsReps: '3 hiệp × 30-40 giây',
    tempo: 'Nhịp nhàng, giữ vững thân trên',
    accent: '#e11d48',
    secondary: '#9f1239',
    tips: ['Giữ vai ngay trên cổ tay', 'Hông cố định, không nảy bập bênh', 'Đưa gối nhanh về phía ngực'],
    poseType: 'mountain-climber'
  },
  {
    slug: 'football',
    title: 'Football Conditioning',
    nameVi: 'Thể lực & Điều hòa bóng đá',
    targets: 'Sức bền tim mạch HIIT • Tốc độ đổi hướng • Bùng nổ chi dưới',
    difficulty: 'Năng động thể thao (Dynamic)',
    setsReps: '1 trận 45 phút / tuần (hoặc bài bổ trợ)',
    tempo: 'Nước rút ngắt quãng + phục hồi',
    accent: '#84cc16',
    secondary: '#4d7c0f',
    tips: ['Khởi động kỹ cổ chân gối trước trận', 'Bù điện giải và nước từng ngụm nhỏ', 'Giãn cơ bắp chân và đùi sau trận'],
    poseType: 'football'
  }
];

// Helper to draw biomechanic exercise figure
function renderExercisePose(poseType, cx, cy, accent, isAnimated = false) {
  // If animated, we inject CSS animation classes
  switch (poseType) {
    case 'pushup':
    case 'diamond-pushup':
      return `
        <!-- Bench / Floor line -->
        <line x1="${cx - 240}" y1="${cy + 90}" x2="${cx + 200}" y2="${cy + 90}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <line x1="${cx - 200}" y1="${cy + 90}" x2="${cx + 160}" y2="${cy + 90}" stroke="#64748b" stroke-width="2" stroke-dasharray="8 8"/>
        
        <g class="${isAnimated ? 'anim-pushup' : ''}">
          <!-- Feet contact -->
          <circle cx="${cx - 160}" cy="${cy + 82}" r="8" fill="#64748b"/>
          
          <!-- Torso & Legs line (Rigid Plank) -->
          <line x1="${cx - 155}" y1="${cy + 75}" x2="${cx + 80}" y2="${cy - 10}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <line x1="${cx - 155}" y1="${cy + 75}" x2="${cx + 80}" y2="${cy - 10}" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
          
          <!-- Muscle Target Highlight (Chest & Triceps) -->
          <ellipse cx="${cx + 50}" cy="${cy}" rx="24" ry="14" fill="${accent}" opacity="0.6"/>
          
          <!-- Arms -->
          <g class="${isAnimated ? 'anim-arms' : ''}">
            <polyline points="${cx + 80},${cy - 5} ${cx + 70},${cy + 40} ${cx + 75},${cy + 86}" fill="none" stroke="#f8fafc" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="${cx + 80},${cy - 5} ${cx + 70},${cy + 40} ${cx + 75},${cy + 86}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          
          <!-- Hands on ground -->
          <ellipse cx="${cx + 75}" cy="${cy + 86}" rx="14" ry="6" fill="#0284c7"/>
          
          <!-- Head -->
          <circle cx="${cx + 120}" cy="${cy - 26}" r="18" fill="#f8fafc"/>
          <circle cx="${cx + 120}" cy="${cy - 26}" r="14" fill="#334155"/>
          
          <!-- Neutral Spine Guideline -->
          <line x1="${cx - 170}" y1="${cy + 82}" x2="${cx + 140}" y2="${cy - 36}" stroke="#10b981" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>
        </g>
      `;

    case 'squat':
      return `
        <!-- Floor line -->
        <line x1="${cx - 160}" y1="${cy + 130}" x2="${cx + 160}" y2="${cy + 130}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-squat' : ''}">
          <!-- Head -->
          <circle cx="${cx}" cy="${cy - 100}" r="20" fill="#f8fafc"/>
          <circle cx="${cx}" cy="${cy - 100}" r="15" fill="#334155"/>
          
          <!-- Torso (Upright spine) -->
          <line x1="${cx}" y1="${cy - 80}" x2="${cx - 15}" y2="${cy}" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
          
          <!-- Glutes & Quads Highlight -->
          <circle cx="${cx - 20}" cy="${cy + 5}" r="22" fill="${accent}" opacity="0.6"/>
          
          <!-- Thighs (Parallel) -->
          <line x1="${cx - 15}" y1="${cy}" x2="${cx + 45}" y2="${cy + 10}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <line x1="${cx - 15}" y1="${cy}" x2="${cx + 45}" y2="${cy + 10}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
          
          <!-- Shins / Calves -->
          <line x1="${cx + 45}" y1="${cy + 10}" x2="${cx + 40}" y2="${cy + 125}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          
          <!-- Feet -->
          <ellipse cx="${cx + 50}" cy="${cy + 127}" rx="22" ry="7" fill="#64748b"/>
          
          <!-- Arms extended forward for counter-balance -->
          <line x1="${cx}" y1="${cy - 65}" x2="${cx + 70}" y2="${cy - 60}" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
          
          <!-- 90 deg knee indicator -->
          <path d="M ${cx + 25} ${cy + 10} L ${cx + 45} ${cy + 10} L ${cx + 45} ${cy + 30}" fill="none" stroke="#f59e0b" stroke-width="2"/>
        </g>
      `;

    case 'lunge':
      return `
        <!-- Floor line -->
        <line x1="${cx - 200}" y1="${cy + 120}" x2="${cx + 180}" y2="${cy + 120}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-lunge' : ''}">
          <!-- Head -->
          <circle cx="${cx}" cy="${cy - 90}" r="18" fill="#f8fafc"/>
          <!-- Torso -->
          <line x1="${cx}" y1="${cy - 72}" x2="${cx}" y2="${cy}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <!-- Front leg (90 degree bend) -->
          <line x1="${cx}" y1="${cy}" x2="${cx + 60}" y2="${cy + 10}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <line x1="${cx}" y1="${cy}" x2="${cx + 60}" y2="${cy + 10}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
          <line x1="${cx + 60}" y1="${cy + 10}" x2="${cx + 60}" y2="${cy + 115}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="${cx + 70}" cy="${cy + 117}" rx="18" ry="6" fill="#64748b"/>
          
          <!-- Rear leg (Lunge back) -->
          <line x1="${cx}" y1="${cy}" x2="${cx - 70}" y2="${cy + 50}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <line x1="${cx - 70}" y1="${cy + 50}" x2="${cx - 75}" y2="${cy + 115}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="${cx - 75}" cy="${cy + 117}" rx="12" ry="5" fill="#64748b"/>
          
          <!-- Muscle Target Highlight (Glute & Quad) -->
          <circle cx="${cx}" cy="${cy + 5}" r="20" fill="${accent}" opacity="0.6"/>
          
          <!-- Hands on hips -->
          <polyline points="${cx},${cy - 50} ${cx + 25},${cy - 30} ${cx},${cy - 10}" fill="none" stroke="#94a3b8" stroke-width="7" stroke-linecap="round"/>
        </g>
      `;

    case 'plank':
      return `
        <!-- Floor line -->
        <line x1="${cx - 220}" y1="${cy + 80}" x2="${cx + 200}" y2="${cy + 80}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-plank' : ''}">
          <!-- Feet contact -->
          <circle cx="${cx - 150}" cy="${cy + 74}" r="7" fill="#64748b"/>
          <!-- Straight Body (Feet to Head) -->
          <line x1="${cx - 145}" y1="${cy + 68}" x2="${cx + 90}" y2="${cy + 15}" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
          <line x1="${cx - 145}" y1="${cy + 68}" x2="${cx + 90}" y2="${cy + 15}" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
          
          <!-- Core Target Zone (Pulsing in animation) -->
          <ellipse cx="${cx - 10}" cy="${cy + 42}" rx="35" ry="16" fill="${accent}" opacity="0.5" class="${isAnimated ? 'anim-pulse' : ''}"/>
          
          <!-- Forearms on ground -->
          <line x1="${cx + 85}" y1="${cy + 20}" x2="${cx + 85}" y2="${cy + 75}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <line x1="${cx + 85}" y1="${cy + 75}" x2="${cx + 130}" y2="${cy + 75}" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
          
          <!-- Head -->
          <circle cx="${cx + 120}" cy="${cy + 5}" r="17" fill="#f8fafc"/>
          <circle cx="${cx + 120}" cy="${cy + 5}" r="13" fill="#334155"/>
          
          <!-- Laser spine level guide -->
          <line x1="${cx - 160}" y1="${cy + 68}" x2="${cx + 140}" y2="${cy + 10}" stroke="#10b981" stroke-width="2" stroke-dasharray="5 5" opacity="0.8"/>
        </g>
      `;

    case 'reverse-crunch':
      return `
        <!-- Floor line -->
        <line x1="${cx - 180}" y1="${cy + 70}" x2="${cx + 180}" y2="${cy + 70}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-rev-crunch' : ''}">
          <!-- Torso flat on back -->
          <line x1="${cx - 100}" y1="${cy + 60}" x2="${cx + 20}" y2="${cy + 60}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <!-- Head on floor -->
          <circle cx="${cx - 120}" cy="${cy + 55}" r="16" fill="#f8fafc"/>
          <!-- Arms along floor -->
          <line x1="${cx - 70}" y1="${cy + 63}" x2="${cx + 10}" y2="${cy + 63}" stroke="#94a3b8" stroke-width="7" stroke-linecap="round"/>
          
          <!-- Pelvis & Legs curling up towards chest -->
          <g class="${isAnimated ? 'anim-legs-curl' : ''}">
            <!-- Thighs raised -->
            <line x1="${cx + 20}" y1="${cy + 55}" x2="${cx + 40}" y2="${cy - 5}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
            <line x1="${cx + 20}" y1="${cy + 55}" x2="${cx + 40}" y2="${cy - 5}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
            <!-- Lower legs tucked -->
            <line x1="${cx + 40}" y1="${cy - 5}" x2="${cx + 95}" y2="${cy}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          </g>
          
          <!-- Lower Abs Target Pulse -->
          <circle cx="${cx + 10}" cy="${cy + 50}" r="22" fill="${accent}" opacity="0.6"/>
        </g>
      `;

    case 'dead-bug':
      return `
        <!-- Floor line -->
        <line x1="${cx - 180}" y1="${cy + 70}" x2="${cx + 180}" y2="${cy + 70}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-dead-bug' : ''}">
          <!-- Back flat on ground -->
          <line x1="${cx - 60}" y1="${cy + 60}" x2="${cx + 60}" y2="${cy + 60}" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
          <!-- Head on ground -->
          <circle cx="${cx - 85}" cy="${cy + 58}" r="16" fill="#f8fafc"/>
          
          <!-- Arm 1 (Up 90 deg) -->
          <line x1="${cx - 40}" y1="${cy + 50}" x2="${cx - 40}" y2="${cy - 30}" stroke="#f8fafc" stroke-width="9" stroke-linecap="round"/>
          <!-- Arm 2 (Extending overhead) -->
          <line x1="${cx - 40}" y1="${cy + 50}" x2="${cx - 120}" y2="${cy + 10}" stroke="${accent}" stroke-width="9" stroke-linecap="round" class="${isAnimated ? 'anim-limb-opp-1' : ''}"/>
          
          <!-- Leg 1 (Tabletop 90 deg) -->
          <line x1="${cx + 40}" y1="${cy + 50}" x2="${cx + 40}" y2="${cy - 10}" stroke="#f8fafc" stroke-width="11" stroke-linecap="round"/>
          <line x1="${cx + 40}" y1="${cy - 10}" x2="${cx + 90}" y2="${cy - 10}" stroke="#f8fafc" stroke-width="9" stroke-linecap="round"/>
          
          <!-- Leg 2 (Extending straight out) -->
          <line x1="${cx + 40}" y1="${cy + 50}" x2="${cx + 130}" y2="${cy + 40}" stroke="${accent}" stroke-width="11" stroke-linecap="round" class="${isAnimated ? 'anim-limb-opp-2' : ''}"/>
          
          <!-- Core bracing glow -->
          <ellipse cx="${cx}" cy="${cy + 55}" rx="28" ry="12" fill="${accent}" opacity="0.5"/>
        </g>
      `;

    case 'glute-bridge':
      return `
        <!-- Floor line -->
        <line x1="${cx - 180}" y1="${cy + 90}" x2="${cx + 180}" y2="${cy + 90}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-bridge' : ''}">
          <!-- Upper back & head grounded -->
          <circle cx="${cx - 110}" cy="${cy + 75}" r="17" fill="#f8fafc"/>
          <!-- Shoulders on floor -->
          <line x1="${cx - 95}" y1="${cy + 82}" x2="${cx - 65}" y2="${cy + 82}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          
          <!-- Raised Torso & Thighs Line -->
          <line x1="${cx - 65}" y1="${cy + 80}" x2="${cx + 15}" y2="${cy + 10}" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
          <line x1="${cx + 15}" y1="${cy + 10}" x2="${cx + 80}" y2="${cy + 10}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <line x1="${cx + 15}" y1="${cy + 10}" x2="${cx + 80}" y2="${cy + 10}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
          
          <!-- Glute Squeeze Target -->
          <circle cx="${cx + 15}" cy="${cy + 12}" r="24" fill="${accent}" opacity="0.6"/>
          
          <!-- Lower legs to feet (90 deg to floor) -->
          <line x1="${cx + 80}" y1="${cy + 10}" x2="${cx + 80}" y2="${cy + 85}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="${cx + 85}" cy="${cy + 87}" rx="18" ry="6" fill="#64748b"/>
        </g>
      `;

    case 'backpack-row':
      return `
        <!-- Floor line -->
        <line x1="${cx - 160}" y1="${cy + 120}" x2="${cx + 160}" y2="${cy + 120}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-row' : ''}">
          <!-- Feet -->
          <ellipse cx="${cx - 30}" cy="${cy + 116}" rx="18" ry="6" fill="#64748b"/>
          
          <!-- Legs (Soft bend) -->
          <line x1="${cx - 30}" y1="${cy + 115}" x2="${cx - 25}" y2="${cy + 50}" stroke="#f8fafc" stroke-width="11" stroke-linecap="round"/>
          
          <!-- Hips pushed back (Hinged at 45 deg) -->
          <line x1="${cx - 25}" y1="${cy + 50}" x2="${cx - 45}" y2="${cy + 5}" stroke="#f8fafc" stroke-width="13" stroke-linecap="round"/>
          <!-- Flat Back / Torso -->
          <line x1="${cx - 45}" y1="${cy + 5}" x2="${cx + 40}" y2="${cy - 35}" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
          <!-- Head aligned -->
          <circle cx="${cx + 55}" cy="${cy - 45}" r="17" fill="#f8fafc"/>
          
          <!-- Latissimus Dorsi Muscle Glow -->
          <ellipse cx="${cx - 5}" cy="${cy - 12}" rx="24" ry="14" fill="${accent}" opacity="0.6"/>
          
          <!-- Arm pulling backpack up -->
          <g class="${isAnimated ? 'anim-row-arm' : ''}">
            <polyline points="${cx + 25},${cy - 25} ${cx - 5},${cy - 20} ${cx + 10},${cy + 25}" fill="none" stroke="#f8fafc" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Backpack item -->
            <rect x="${cx - 8}" y="${cy + 15}" width="36" height="46" rx="6" fill="#0891b2" stroke="#0e7490" stroke-width="2"/>
            <path d="M ${cx + 5} ${cy + 15} Q ${cx + 10} ${cy + 5} ${cx + 15} ${cy + 15}" fill="none" stroke="#f59e0b" stroke-width="3"/>
          </g>
        </g>
      `;

    case 'mountain-climber':
      return `
        <!-- Floor line -->
        <line x1="${cx - 200}" y1="${cy + 80}" x2="${cx + 180}" y2="${cy + 80}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        
        <g class="${isAnimated ? 'anim-climber' : ''}">
          <!-- Hands on ground under shoulders -->
          <line x1="${cx + 60}" y1="${cy}" x2="${cx + 60}" y2="${cy + 75}" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="${cx + 60}" cy="${cy + 77}" rx="12" ry="5" fill="#64748b"/>
          
          <!-- Torso in high plank -->
          <line x1="${cx - 100}" y1="${cy + 25}" x2="${cx + 60}" y2="${cy}" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
          <!-- Head -->
          <circle cx="${cx + 85}" cy="${cy - 15}" r="17" fill="#f8fafc"/>
          
          <!-- Rear straight leg -->
          <line x1="${cx - 100}" y1="${cy + 25}" x2="${cx - 160}" y2="${cy + 75}" stroke="#f8fafc" stroke-width="11" stroke-linecap="round"/>
          <circle cx="${cx - 162}" cy="${cy + 77}" r="6" fill="#64748b"/>
          
          <!-- Driving Knee (under chest) -->
          <polyline points="${cx - 100},${cy + 25} ${cx - 15},${cy + 20} ${cx - 50},${cy + 55}" fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" class="${isAnimated ? 'anim-drive-knee' : ''}"/>
          
          <!-- Core Target Zone -->
          <circle cx="${cx - 30}" cy="${cy + 15}" r="20" fill="${accent}" opacity="0.6"/>
        </g>
      `;

    case 'football':
      return `
        <!-- Turf / Field Grass Line -->
        <line x1="${cx - 220}" y1="${cy + 100}" x2="${cx + 200}" y2="${cy + 100}" stroke="#4d7c0f" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx - 200}" y1="${cy + 100}" x2="${cx + 180}" y2="${cy + 100}" stroke="#84cc16" stroke-width="2" stroke-dasharray="12 12"/>
        
        <g class="${isAnimated ? 'anim-football' : ''}">
          <!-- Athlete dynamic running stance -->
          <!-- Head & Sports headband -->
          <circle cx="${cx + 10}" cy="${cy - 75}" r="18" fill="#f8fafc"/>
          <line x1="${cx - 8}" y1="${cy - 75}" x2="${cx + 28}" y2="${cy - 75}" stroke="#ef4444" stroke-width="4"/>
          
          <!-- Torso forward lean 30 deg -->
          <line x1="${cx + 10}" y1="${cy - 57}" x2="${cx - 15}" y2="${cy}" stroke="#f8fafc" stroke-width="13" stroke-linecap="round"/>
          
          <!-- Driving front leg -->
          <polyline points="${cx - 15},${cy} ${cx + 45},${cy + 20} ${cx + 35},${cy + 85}" fill="none" stroke="#f8fafc" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse cx="${cx + 35}" cy="${cy + 92}" rx="14" ry="6" fill="#f97316"/>
          
          <!-- Trailing kick/stride leg -->
          <polyline points="${cx - 15},${cy} ${cx - 65},${cy + 25} ${cx - 110},${cy + 55}" fill="none" stroke="#84cc16" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- Arms pumping in sprint -->
          <polyline points="${cx + 5},${cy - 40} ${cx + 50},${cy - 25} ${cx + 35},${cy - 5}" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="${cx + 5},${cy - 40} ${cx - 35},${cy - 30} ${cx - 50},${cy - 50}" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- Soccer Ball -->
          <g transform="translate(${cx + 85}, ${cy + 68})" class="${isAnimated ? 'anim-ball' : ''}">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <!-- Pentagon / Ball pattern -->
            <polygon points="0,-10 9,-3 6,8 -6,8 -9,-3" fill="#0f172a"/>
            <line x1="0" y1="-10" x2="0" y2="-20" stroke="#0f172a" stroke-width="2"/>
            <line x1="9" y1="-3" x2="19" y2="-5" stroke="#0f172a" stroke-width="2"/>
            <line x1="6" y1="8" x2="14" y2="17" stroke="#0f172a" stroke-width="2"/>
            <line x1="-6" y1="8" x2="-14" y2="17" stroke="#0f172a" stroke-width="2"/>
            <line x1="-9" y1="-3" x2="-19" y2="-5" stroke="#0f172a" stroke-width="2"/>
          </g>
          
          <!-- Motion Dash Vectors -->
          <line x1="${cx - 140}" y1="${cy - 20}" x2="${cx - 80}" y2="${cy - 20}" stroke="#84cc16" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
          <line x1="${cx - 160}" y1="${cy + 5}" x2="${cx - 100}" y2="${cy + 5}" stroke="#84cc16" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
        </g>
      `;

    default:
      return `<circle cx="${cx}" cy="${cy}" r="60" fill="${accent}"/>`;
  }
}

// Generate Exercise Poster SVG (16:9)
function generateExercisePoster(ex) {
  const width = 1280;
  const height = 720;
  const cx = 400;
  const cy = 380;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad_${ex.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <radialGradient id="glow_${ex.slug}" cx="35%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ex.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${ex.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad_${ex.slug})"/>
  <rect width="${width}" height="${height}" fill="url(#glow_${ex.slug})"/>

  <!-- Subtle Sport Grid lines -->
  <g opacity="0.06" stroke="#94a3b8" stroke-width="1">
    ${Array.from({ length: 32 }).map((_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="${height}"/>`).join('')}
    ${Array.from({ length: 18 }).map((_, i) => `<line x1="0" y1="${i*40}" x2="${width}" y2="${i*40}"/>`).join('')}
  </g>

  <!-- Tech Boundary Corners -->
  <path d="M 28 55 L 28 28 L 55 28" stroke="${ex.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M ${width-55} 28 L ${width-28} 28 L ${width-28} 55" stroke="${ex.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M 28 ${height-55} L 28 ${height-28} L 55 ${height-28}" stroke="${ex.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M ${width-55} ${height-28} L ${width-28} ${height-28} L ${width-28} ${height-55}" stroke="${ex.accent}" stroke-width="3" fill="none" opacity="0.8"/>

  <!-- Top Navigation Badges -->
  <g transform="translate(36, 36)">
    <rect width="210" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <circle cx="17" cy="17" r="7" fill="${ex.accent}"/>
    <text x="32" y="22" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">CUTTRACK WORKOUT</text>

    <!-- Difficulty Badge -->
    <rect x="222" y="0" width="160" height="34" rx="17" fill="${ex.secondary}" opacity="0.3"/>
    <rect x="222" y="0" width="160" height="34" rx="17" fill="none" stroke="${ex.accent}" stroke-width="1.5"/>
    <text x="302" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="${ex.accent}" text-anchor="middle">${escapeXml(ex.difficulty)}</text>
  </g>

  <!-- Media Type & Ratio (Top Right) -->
  <g transform="translate(${width - 250}, 36)">
    <rect width="214" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="6" y="6" width="60" height="22" rx="11" fill="#10b981" opacity="0.25"/>
    <text x="36" y="21" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#34d399" text-anchor="middle">POSTER</text>
    <text x="136" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="middle">16:9 • Static Pose</text>
  </g>

  <!-- Central Biomechanical Figure -->
  <g id="figure">
    ${renderExercisePose(ex.poseType, cx, cy, ex.accent, false)}
  </g>

  <!-- Right Side Specification & Instruction Card -->
  <g transform="translate(${width - 490}, 105)">
    <rect width="454" height="${height - 145}" rx="20" fill="url(#panelGrad)" stroke="#334155" stroke-width="1.5"/>
    
    <g transform="translate(30, 36)">
      <!-- Exercise Title & Vi Name -->
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="32" fill="#f8fafc">${escapeXml(ex.nameVi)}</text>
      <text x="0" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="15" fill="${ex.accent}">${escapeXml(ex.title)}</text>

      <!-- Divider -->
      <line x1="0" y1="45" x2="394" y2="45" stroke="#334155" stroke-width="1"/>

      <!-- Target Muscles Card -->
      <g transform="translate(0, 62)">
        <rect width="394" height="65" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">NHÓM CƠ MỤC TIÊU</text>
        <text x="18" y="45" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#38bdf8">${escapeXml(ex.targets.slice(0, 42))}</text>
        ${ex.targets.length > 42 ? `<text x="18" y="58" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#38bdf8">${escapeXml(ex.targets.slice(42))}</text>` : ''}
      </g>

      <!-- Volume & Reps Card -->
      <g transform="translate(0, 138)">
        <rect width="394" height="58" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">KHỐI LƯỢNG &amp; SỐ LẦN</text>
        <text x="18" y="44" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#facc15">${escapeXml(ex.setsReps)}</text>
      </g>

      <!-- Tempo Card -->
      <g transform="translate(0, 206)">
        <rect width="394" height="58" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">NHỊP ĐỘ (TEMPO)</text>
        <text x="18" y="44" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#a78bfa">${escapeXml(ex.tempo)}</text>
      </g>

      <!-- Technical Keypoints Checklist -->
      <g transform="translate(0, 274)">
        <rect width="394" height="120" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#34d399" letter-spacing="1">✓ 3 ĐIỂM KỸ THUẬT QUAN TRỌNG:</text>
        ${ex.tips.map((tip, idx) => `
          <g transform="translate(18, ${42 + idx * 24})">
            <circle cx="4" cy="-4" r="3" fill="${ex.accent}"/>
            <text x="15" y="0" font-family="system-ui, sans-serif" font-weight="400" font-size="13" fill="#cbd5e1">${escapeXml(tip)}</text>
          </g>
        `).join('')}
      </g>

      <!-- Attribution Footer -->
      <g transform="translate(0, 416)">
        <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#64748b">CutTrack Exercise Spec • Bản quyền CC BY-SA 4.0</text>
        <text x="0" y="16" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#475569">isPlaceholder: true • Chuẩn y khoa thể thao</text>
      </g>
    </g>
  </g>
</svg>`;
}

// Generate Exercise Animation SVG (16:9 with smooth CSS keyframes)
function generateExerciseAnimation(ex) {
  const width = 1280;
  const height = 720;
  const cx = 400;
  const cy = 380;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    /* Continuous smooth loop animation */
    @keyframes kfPushup {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(50px) rotate(-3deg); }
    }
    @keyframes kfArms {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.9, 0.6) translate(10px, 45px); }
    }
    @keyframes kfSquat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(70px); }
    }
    @keyframes kfLunge {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(55px); }
    }
    @keyframes kfPlank {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes kfRevCrunch {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-25deg) translateY(-20px); }
    }
    @keyframes kfOppLimb1 {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-35deg) translate(-20px, 15px); }
    }
    @keyframes kfOppLimb2 {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(20deg) translate(30px, 10px); }
    }
    @keyframes kfBridge {
      0%, 100% { transform: translateY(20px); }
      50% { transform: translateY(-30px); }
    }
    @keyframes kfRowArm {
      0%, 100% { transform: translateY(30px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes kfClimber {
      0%, 100% { transform: translateX(0px); }
      50% { transform: translateX(45px); }
    }
    @keyframes kfBall {
      0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
      50% { transform: translate(30px, -15px) rotate(180deg); }
    }
    @keyframes kfPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.15); }
    }
    @keyframes kfPhaseText {
      0%, 45% { opacity: 1; fill: #38bdf8; }
      50%, 95% { opacity: 1; fill: #f59e0b; }
    }

    .anim-pushup { animation: kfPushup 3s ease-in-out infinite; transform-origin: ${cx-160}px ${cy+80}px; }
    .anim-arms { animation: kfArms 3s ease-in-out infinite; transform-origin: ${cx+75}px ${cy+86}px; }
    .anim-squat { animation: kfSquat 3.2s ease-in-out infinite; transform-origin: ${cx}px ${cy+125}px; }
    .anim-lunge { animation: kfLunge 3s ease-in-out infinite; transform-origin: ${cx}px ${cy+115}px; }
    .anim-plank { animation: kfPlank 2.5s ease-in-out infinite; transform-origin: ${cx}px ${cy+50}px; }
    .anim-rev-crunch { animation: kfRevCrunch 3s ease-in-out infinite; transform-origin: ${cx+20}px ${cy+55}px; }
    .anim-limb-opp-1 { animation: kfOppLimb1 3.5s ease-in-out infinite; transform-origin: ${cx-40}px ${cy+50}px; }
    .anim-limb-opp-2 { animation: kfOppLimb2 3.5s ease-in-out infinite; transform-origin: ${cx+40}px ${cy+50}px; }
    .anim-bridge { animation: kfBridge 3s ease-in-out infinite; transform-origin: ${cx-80}px ${cy+85}px; }
    .anim-row-arm { animation: kfRowArm 2.8s ease-in-out infinite; transform-origin: ${cx+25}px ${cy-25}px; }
    .anim-climber { animation: kfClimber 1.4s ease-in-out infinite alternate; }
    .anim-drive-knee { animation: kfClimber 1.4s ease-in-out infinite alternate; }
    .anim-ball { animation: kfBall 1.8s ease-in-out infinite alternate; }
    .anim-pulse { animation: kfPulse 2s ease-in-out infinite; transform-origin: center; }

    /* Accessibility: Respect user reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      *, .anim-pushup, .anim-arms, .anim-squat, .anim-lunge, .anim-plank, 
      .anim-rev-crunch, .anim-limb-opp-1, .anim-limb-opp-2, .anim-bridge, 
      .anim-row-arm, .anim-climber, .anim-drive-knee, .anim-ball, .anim-pulse {
        animation: none !important;
      }
    }
  </style>

  <defs>
    <linearGradient id="bgGradAnim_${ex.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <radialGradient id="glowAnim_${ex.slug}" cx="35%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ex.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${ex.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="panelGradAnim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradAnim_${ex.slug})"/>
  <rect width="${width}" height="${height}" fill="url(#glowAnim_${ex.slug})"/>

  <!-- Tech Grid Background -->
  <g opacity="0.06" stroke="#94a3b8" stroke-width="1">
    ${Array.from({ length: 32 }).map((_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="${height}"/>`).join('')}
    ${Array.from({ length: 18 }).map((_, i) => `<line x1="0" y1="${i*40}" x2="${width}" y2="${i*40}"/>`).join('')}
  </g>

  <!-- Top Badges -->
  <g transform="translate(36, 36)">
    <rect width="220" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <circle cx="17" cy="17" r="7" fill="#ef4444"/>
    <text x="32" y="22" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">ANIMATION ĐỘNG LOOP</text>

    <!-- Reduced motion note -->
    <rect x="232" y="0" width="190" height="34" rx="17" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="327" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" text-anchor="middle">Reduced-Motion Compatible</text>
  </g>

  <!-- Live Pulse Playing Indicator (Top Right) -->
  <g transform="translate(${width - 240}, 36)">
    <rect width="204" height="34" rx="17" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="20" cy="17" r="5" fill="#10b981" class="anim-pulse"/>
    <text x="110" y="22" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#34d399" text-anchor="middle">LOOPING DEMO • AUTO</text>
  </g>

  <!-- Animated Biomechanical Figure -->
  <g id="animatedFigure">
    ${renderExercisePose(ex.poseType, cx, cy, ex.accent, true)}
  </g>

  <!-- Dynamic Phase / Tempo HUD overlay in central zone -->
  <g transform="translate(${cx - 160}, ${height - 110})">
    <rect width="320" height="52" rx="26" fill="#0f172a" stroke="#334155" stroke-width="1.5" opacity="0.95"/>
    <!-- Breathing cue -->
    <circle cx="28" cy="26" r="10" fill="${ex.accent}" opacity="0.8" class="anim-pulse"/>
    <text x="50" y="31" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">Hít vào khi hạ • Thở ra khi đẩy</text>
    <rect x="250" y="14" width="54" height="24" rx="12" fill="#1e293b"/>
    <text x="277" y="30" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#facc15" text-anchor="middle">TEMPO</text>
  </g>

  <!-- Right Side Specification & Instruction Card -->
  <g transform="translate(${width - 490}, 105)">
    <rect width="454" height="${height - 145}" rx="20" fill="url(#panelGradAnim)" stroke="#334155" stroke-width="1.5"/>
    
    <g transform="translate(30, 36)">
      <!-- Exercise Title & Vi Name -->
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="32" fill="#f8fafc">${escapeXml(ex.nameVi)}</text>
      <text x="0" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="15" fill="${ex.accent}">Hướng dẫn chuyển động chuẩn</text>

      <!-- Divider -->
      <line x1="0" y1="45" x2="394" y2="45" stroke="#334155" stroke-width="1"/>

      <!-- Dynamic Movement Guide -->
      <g transform="translate(0, 62)">
        <rect width="394" height="70" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="24" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">GIAI ĐOẠN CHUYỂN ĐỘNG</text>
        <text x="18" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#38bdf8">1. Eccentric (Hạ có kiểm soát, hít sâu)</text>
        <text x="18" y="64" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#f59e0b">2. Concentric (Đẩy bùng nổ, thở dứt khoát)</text>
      </g>

      <!-- Sets & Reps -->
      <g transform="translate(0, 142)">
        <rect width="394" height="58" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#94a3b8" letter-spacing="1">ĐỀ XUẤT TẬP LUYỆN</text>
        <text x="18" y="44" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#facc15">${escapeXml(ex.setsReps)}</text>
      </g>

      <!-- Checklist -->
      <g transform="translate(0, 210)">
        <rect width="394" height="135" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="18" y="22" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#34d399" letter-spacing="1">CẢM NHẬN CƠ &amp; LỖI CẦN TRÁNH:</text>
        ${ex.tips.map((tip, idx) => `
          <g transform="translate(18, ${42 + idx * 26})">
            <circle cx="4" cy="-4" r="3" fill="${ex.accent}"/>
            <text x="15" y="0" font-family="system-ui, sans-serif" font-weight="400" font-size="13" fill="#cbd5e1">${escapeXml(tip)}</text>
          </g>
        `).join('')}
      </g>

      <!-- Attribution Footer -->
      <g transform="translate(0, 365)">
        <rect width="394" height="60" rx="8" fill="#1e293b" opacity="0.6"/>
        <text x="16" y="25" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#38bdf8">💡 Vector SVG Animation độc quyền</text>
        <text x="16" y="44" font-family="system-ui, sans-serif" font-weight="400" font-size="11" fill="#94a3b8">Dung lượng siêu nhẹ (~5KB), loop vô tận, không hao băng thông</text>
      </g>
    </g>
  </g>
</svg>`;
}

// 8 Articles Data
const articlesData = [
  {
    slug: 'bmr-tdee-calo-giam-mo-an-toan',
    title: 'Calo, BMR và TDEE: Hiểu đúng để giảm mỡ an toàn',
    subtitle: 'Tại sao 1.300 kcal là quá thấp cho nam giới có đá banh và cách tính chuẩn',
    readTime: '7 phút đọc',
    accent: '#ef4444',
    secondary: '#b91c1c',
    tag: 'NỀN TẢNG NĂNG LƯỢNG'
  },
  {
    slug: 'giam-can-vs-giam-mo-giu-co',
    title: 'Giảm cân vs Giảm mỡ: Giữ cơ bắp trong thâm hụt năng lượng',
    subtitle: 'Bảo toàn khối cơ nạc, tránh teo cơ và duy trì trao đổi chất khỏe mạnh',
    readTime: '6 phút đọc',
    accent: '#38bdf8',
    secondary: '#0284c7',
    tag: 'BẢO TOÀN CƠ BẮP'
  },
  {
    slug: 'su-that-mo-bung-duoi-nong-cam',
    title: 'Sự thật về mỡ bụng dưới và nọng cằm: Không thể giảm mỡ cục bộ',
    subtitle: 'Khoa học về thụ thể Adrenergic, cơ địa tích mỡ và chiến lược xử lý triệt để',
    readTime: '5 phút đọc',
    accent: '#f59e0b',
    secondary: '#d97706',
    tag: 'GIẢI MÃ LẦM TƯỞNG'
  },
  {
    slug: 'macro-protein-chat-xo',
    title: 'Macro phân bổ: Tầm quan trọng của Protein và chất xơ',
    subtitle: 'Tối ưu hiệu ứng nhiệt TEF, no lâu và tái tạo sợi cơ sau vận động',
    readTime: '8 phút đọc',
    accent: '#10b981',
    secondary: '#047857',
    tag: 'DINH DƯỠNG ĐA LƯỢNG'
  },
  {
    slug: 'can-thuc-pham-song-chin-xuong',
    title: 'Cân thực phẩm: Sống vs Chín, Phần ăn được vs Cả xương',
    subtitle: 'Loại bỏ sai số 30-50% khi tính calo thịt gà, bún, cơm và món kho',
    readTime: '6 phút đọc',
    accent: '#a855f7',
    secondary: '#7e22ce',
    tag: 'KỸ THUẬT ĐỊNH LƯỢNG'
  },
  {
    slug: 'che-do-an-2-bua-ngay',
    title: 'Chế độ ăn 2 bữa/ngày: Lợi ích và những điều cần lưu ý',
    subtitle: 'Tận dụng nhịn ăn gián đoạn cho dân công sở mà không bị hạ đường huyết',
    readTime: '6 phút đọc',
    accent: '#06b6d4',
    secondary: '#0891b2',
    tag: 'LỊCH ĂN & LỐI SỐNG'
  },
  {
    slug: 'an-quan-thong-minh-duoi-35k',
    title: 'Ăn quán thông minh: Cách chọn món dưới 35k và mẹo giảm dầu mỡ',
    subtitle: 'Cơm tiệm, bún riêu, canh rau: tối ưu ngân sách 70-80k/ngày vẫn đủ chất',
    readTime: '7 phút đọc',
    accent: '#fbbf24',
    secondary: '#b45309',
    tag: 'THỰC CHIẾN BÌNH DÂN'
  },
  {
    slug: 'dinh-duong-truoc-sau-da-banh',
    title: 'Dinh dưỡng trước và sau buổi đá banh: Nạp năng lượng và phục hồi',
    subtitle: 'Nạp glycogen, bù điện giải và bữa tối đặc biệt nửa con gà nướng',
    readTime: '8 phút đọc',
    accent: '#84cc16',
    secondary: '#4d7c0f',
    tag: 'DINH DƯỠNG THỂ THAO'
  }
];

// Generate Article Cover SVG (16:9)
function generateArticleCover(art) {
  const width = 1280;
  const height = 720;
  const cx = 350;
  const cy = 360;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGradArt_${art.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <radialGradient id="glowArt_${art.slug}" cx="30%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${art.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${art.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradArt_${art.slug})"/>
  <rect width="${width}" height="${height}" fill="url(#glowArt_${art.slug})"/>

  <!-- Subtle Science Dots Grid -->
  <g opacity="0.08" fill="#94a3b8">
    ${Array.from({ length: 24 }).map((_, r) =>
      Array.from({ length: 40 }).map((_, c) => `<circle cx="${c*32 + 16}" cy="${r*30 + 15}" r="1.5"/>`).join('')
    ).join('')}
  </g>

  <!-- Decorative Border Corners -->
  <path d="M 30 60 L 30 30 L 60 30" stroke="${art.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M ${width-60} 30 L ${width-30} 30 L ${width-30} 60" stroke="${art.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M 30 ${height-60} L 30 ${height-30} L 60 ${height-30}" stroke="${art.accent}" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M ${width-60} ${height-30} L ${width-30} ${height-30} L ${width-30} ${height-60}" stroke="${art.accent}" stroke-width="3" fill="none" opacity="0.8"/>

  <!-- Top Badges -->
  <g transform="translate(48, 48)">
    <rect width="220" height="36" rx="18" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <circle cx="18" cy="18" r="7" fill="${art.accent}"/>
    <text x="36" y="23" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#f8fafc">CUTTRACK ACADEMY</text>

    <!-- Tag Pill -->
    <rect x="235" y="0" width="180" height="36" rx="18" fill="${art.secondary}" opacity="0.3"/>
    <rect x="235" y="0" width="180" height="36" rx="18" fill="none" stroke="${art.accent}" stroke-width="1.5"/>
    <text x="325" y="23" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="${art.accent}" text-anchor="middle">${escapeXml(art.tag)}</text>
  </g>

  <!-- Read Time Badge (Top Right) -->
  <g transform="translate(${width - 200}, 48)">
    <rect width="152" height="36" rx="18" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <circle cx="20" cy="18" r="5" fill="#38bdf8"/>
    <text x="82" y="23" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#cbd5e1" text-anchor="middle">${escapeXml(art.readTime)}</text>
  </g>

  <!-- Central Scientific Illustration Motif -->
  <g transform="translate(${cx}, ${cy})">
    <!-- Glowing rings -->
    <circle cx="0" cy="0" r="140" fill="none" stroke="${art.accent}" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
    <circle cx="0" cy="0" r="100" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="0" r="75" fill="${art.secondary}" opacity="0.3"/>
    <!-- Icon symbol -->
    <circle cx="0" cy="0" r="45" fill="${art.accent}"/>
    <!-- Knowledge Book / Science Beaker Vector -->
    <path d="M -22 -10 L 0 -22 L 22 -10 L 22 18 L 0 8 L -22 18 Z" fill="#ffffff" opacity="0.95"/>
    <line x1="0" y1="-20" x2="0" y2="8" stroke="#0f172a" stroke-width="3"/>
  </g>

  <!-- Content Block on Right -->
  <g transform="translate(560, 200)">
    <!-- Article Title -->
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="40" fill="#f8fafc">
      <tspan x="0" dy="0">${escapeXml(art.title.slice(0, 32))}</tspan>
      ${art.title.length > 32 ? `<tspan x="0" dy="48">${escapeXml(art.title.slice(32))}</tspan>` : ''}
    </text>

    <!-- Subtitle -->
    <text x="0" y="${art.title.length > 32 ? 115 : 65}" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="18" fill="#94a3b8">
      <tspan x="0" dy="0">${escapeXml(art.subtitle.slice(0, 48))}</tspan>
      ${art.subtitle.length > 48 ? `<tspan x="0" dy="26">${escapeXml(art.subtitle.slice(48))}</tspan>` : ''}
    </text>

    <!-- Highlights Card -->
    <g transform="translate(0, ${art.title.length > 32 ? 185 : 135})">
      <rect width="640" height="110" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <g transform="translate(24, 30)">
        <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#38bdf8">CHUẨN KHOA HỌC • NGUỒN CHÍNH THỐNG:</text>
        <text x="0" y="24" font-family="system-ui, sans-serif" font-weight="400" font-size="14" fill="#cbd5e1">Bằng chứng y khoa từ ISSN, ACSM, Viện Dinh Dưỡng Quốc Gia</text>
        <text x="0" y="46" font-family="system-ui, sans-serif" font-weight="400" font-size="14" fill="#94a3b8">Phân tích thực tế cho người dùng Việt Nam (Ăn quán + Đá banh)</text>
      </g>
    </g>

    <!-- Meta bottom -->
    <g transform="translate(0, ${art.title.length > 32 ? 320 : 270})">
      <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="#64748b">Biên tập: CutTrack Scientific Board • Đánh giá y khoa 2026</text>
    </g>
  </g>
</svg>`;
}

// Generate Generic Fallback Placeholders
function generateFallbackPlaceholders() {
  const configs = [
    {
      file: 'food-placeholder-4x3.svg',
      width: 800,
      height: 600,
      title: 'Món ăn CutTrack',
      subtitle: 'Hình ảnh đang được cập nhật bản quyền',
      ratio: '4:3',
      color: '#f59e0b'
    },
    {
      file: 'food-placeholder-16x9.svg',
      width: 1280,
      height: 720,
      title: 'Chi tiết món ăn CutTrack',
      subtitle: 'Hình ảnh chi tiết đang được cập nhật bản quyền',
      ratio: '16:9',
      color: '#38bdf8'
    },
    {
      file: 'exercise-poster-placeholder.svg',
      width: 1280,
      height: 720,
      title: 'Poster bài tập CutTrack',
      subtitle: 'Tư thế kỹ thuật chuẩn đang cập nhật',
      ratio: '16:9',
      color: '#10b981'
    },
    {
      file: 'exercise-animation-placeholder.svg',
      width: 1280,
      height: 720,
      title: 'Animation động bài tập CutTrack',
      subtitle: 'Chuyển động mẫu đang được chuẩn hóa',
      ratio: '16:9',
      color: '#ef4444'
    },
    {
      file: 'article-cover-placeholder.svg',
      width: 1280,
      height: 720,
      title: 'Kiến thức dinh dưỡng CutTrack',
      subtitle: 'Tài liệu khoa học & Hướng dẫn dinh dưỡng',
      ratio: '16:9',
      color: '#8b5cf6'
    }
  ];

  for (const c of configs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.width} ${c.height}" width="${c.width}" height="${c.height}">
  <defs>
    <linearGradient id="bgGrad_${c.ratio.replace(':', '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="${c.width}" height="${c.height}" fill="url(#bgGrad_${c.ratio.replace(':', '_')})"/>
  <rect x="20" y="20" width="${c.width - 40}" height="${c.height - 40}" rx="16" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="10 10"/>
  
  <g transform="translate(${c.width/2}, ${c.height/2 - 30})">
    <circle cx="0" cy="0" r="50" fill="#334155"/>
    <circle cx="0" cy="0" r="35" fill="${c.color}" opacity="0.3"/>
    <circle cx="0" cy="0" r="16" fill="${c.color}"/>
  </g>

  <text x="${c.width/2}" y="${c.height/2 + 50}" font-family="system-ui, sans-serif" font-weight="700" font-size="24" fill="#f8fafc" text-anchor="middle">${c.title}</text>
  <text x="${c.width/2}" y="${c.height/2 + 80}" font-family="system-ui, sans-serif" font-weight="400" font-size="15" fill="#94a3b8" text-anchor="middle">${c.subtitle}</text>
  <text x="${c.width/2}" y="${c.height/2 + 115}" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#64748b" text-anchor="middle">Tỉ lệ ${c.ratio} • CutTrack Safe Asset Fallback</text>
</svg>`;
    fs.writeFileSync(path.join(PLACEHOLDERS_DIR, c.file), svg, 'utf-8');
  }
}

// EXECUTE GENERATION
console.log('Generating Food SVGs (4:3 thumbnails and 16:9 details)...');
for (const food of foodsData) {
  // 4:3 Thumbnail
  const thumbSvg = generateFoodSvg(food, '4:3');
  fs.writeFileSync(path.join(FOOD_THUMBS_DIR, `${food.slug}.svg`), thumbSvg, 'utf-8');

  // 16:9 Detail
  const detailSvg = generateFoodSvg(food, '16:9');
  fs.writeFileSync(path.join(FOOD_DETAILS_DIR, `${food.slug}.svg`), detailSvg, 'utf-8');
}
console.log(`Generated ${foodsData.length * 2} food SVGs.`);

console.log('Generating Exercise SVGs (16:9 static posters and 16:9 vector animations)...');
for (const ex of exercisesData) {
  // Static Poster
  const posterSvg = generateExercisePoster(ex);
  fs.writeFileSync(path.join(EXERCISE_POSTERS_DIR, `${ex.slug}.svg`), posterSvg, 'utf-8');

  // CSS Keyframe Animated SVG
  const animSvg = generateExerciseAnimation(ex);
  fs.writeFileSync(path.join(EXERCISE_ANIMATIONS_DIR, `${ex.slug}.svg`), animSvg, 'utf-8');
}
console.log(`Generated ${exercisesData.length * 2} exercise SVGs.`);

console.log('Generating Article Covers (16:9)...');
for (const art of articlesData) {
  const artSvg = generateArticleCover(art);
  fs.writeFileSync(path.join(ARTICLE_COVERS_DIR, `${art.slug}.svg`), artSvg, 'utf-8');
}
console.log(`Generated ${articlesData.length} article covers.`);

console.log('Generating generic fallback placeholders...');
generateFallbackPlaceholders();
console.log('All media assets generated successfully!');
