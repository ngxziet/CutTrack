/**
 * CutTrack - Nutrition & Sports Science Knowledge Hub
 * Scientific articles curated for Vietnamese fitness enthusiasts.
 * Grounded in peer-reviewed sports nutrition science (ISSN, ACSM, NIH, Harvard Health, NIN VN).
 * Specific focus on realistic lifestyle: 2 meals/day, budget 70-80k VND, street food & weekly football.
 */

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleReference {
  title: string;
  source: string;
  year?: number;
  url?: string;
  note?: string;
}

export interface ArticleSection {
  heading: string;
  content: string; // Markdown or rich formatted text
  callout?: {
    type: 'IMPORTANT' | 'WARNING' | 'TIP' | 'NOTE';
    title: string;
    text: string;
  };
}

export interface NutritionArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  categoryTag: string;
  readTime: string;
  updatedAt: string;
  author: string;
  targetAudience: string;
  summary: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  references: ArticleReference[];
}

export const ARTICLES_DATA: NutritionArticle[] = [
  // BÀI 1: CALO, BMR VÀ TDEE
  {
    id: 'article-1-bmr-tdee',
    slug: 'bmr-tdee-calo-giam-mo-an-toan',
    title: 'Calo, BMR và TDEE: Hiểu đúng để giảm mỡ an toàn',
    subtitle: 'Tại sao mức 1.300 kcal là quá thấp cho nam giới có đá banh và cách xác định thâm hụt chuẩn',
    coverUrl: '/media/articles/bmr-tdee-calo-giam-mo-an-toan.svg',
    categoryTag: 'NỀN TẢNG NĂNG LƯỢNG',
    readTime: '7 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack (Hội Dinh Dưỡng Thể Thao ISSN)',
    targetAudience: 'Nam giới 20-25 tuổi, làm việc văn phòng, có hoạt động thể thao hàng tuần',
    summary: 'Phân tích khoa học chuyển hóa năng lượng cơ bản (BMR) và tổng năng lượng tiêu hao (TDEE). Cảnh báo nguy cơ suy giảm chuyển hóa, mất cơ và rụng tóc khi cắt calo sâu xuống 1.300 kcal, đồng thời hướng dẫn thiết lập mức thâm hụt tối ưu 1.500–1.650 kcal/ngày.',
    keyTakeaways: [
      'BMR của nam 23 tuổi, 168 cm, 68 kg xấp xỉ 1.620 kcal; đây là mức năng lượng tối thiểu để duy trì sự sống khi nằm bất động.',
      'TDEE ít vận động đạt ~1.945 kcal; ngày có trận đá banh 45 phút, TDEE tăng lên 2.250–2.350 kcal.',
      'Ăn 1.300 kcal/ngày (< BMR) kích hoạt phản xạ sinh tồn (Adaptive Thermogenesis), ức chế hormone tuyến giáp T3 và làm sụt giảm testosterone.',
      'Khoảng thâm hụt bền vững và an toàn nhất là 1.500–1.650 kcal/ngày, giúp giảm 0.4–0.5 kg mỡ/tuần mà không mất cơ.',
    ],
    sections: [
      {
        heading: '1. Bản chất của Calo, BMR và TDEE',
        content: `Calo (kilocalorie hay kcal) là đơn vị đo năng lượng hóa học mà cơ thể hấp thu từ thức ăn và tiêu hao qua các hoạt động sinh lý. Để kiểm soát cân nặng, bạn cần nắm vững hai chỉ số cốt lõi:
- **BMR (Basal Metabolic Rate - Tỷ lệ trao đổi chất cơ bản):** Năng lượng tối thiểu mà cơ thể cần để duy trì các chức năng sinh tồn (tim đập, phổi thở, não xử lý thông tin, gan thận lọc chất độc) ở trạng thái nghỉ ngơi hoàn toàn trong 24 giờ.
- **TDEE (Total Daily Energy Expenditure - Tổng tiêu hao năng lượng mỗi ngày):** Bao gồm BMR + TEF (hiệu ứng nhiệt tiêu hóa thức ăn ~10%) + NEAT (hoạt động không tập luyện như đi lại, gõ phím) + EAT (vận động thể thao như chống đẩy, đá banh).

Với nam giới 23 tuổi, cao 168 cm, nặng 68 kg:
Áp dụng công thức chuẩn vàng **Mifflin-St Jeor**:
$$BMR = (10 \\times 68) + (6.25 \\times 168) - (5 \\times 23) + 5 = 680 + 1050 - 115 + 5 = 1.620\\text{ kcal}$$

Khi làm công việc văn phòng ít vận động (hệ số PAL = 1.2):
$$TDEE = 1.620 \\times 1.2 \\approx 1.944\\text{ kcal/ngày}$$
Vào ngày có đá banh 45 phút (tiêu hao thêm 300–400 kcal), TDEE thực tế sẽ đạt khoảng **2.250–2.350 kcal**.`,
      },
      {
        heading: '2. Tại sao mong muốn ăn 1.300 kcal/ngày là cạm bẫy nguy hiểm?',
        content: `Nhiều bạn trẻ khi bắt đầu giảm mỡ thường chọn ngay con số 1.200 - 1.300 kcal/ngày vì thấy trên mạng hoặc muốn giảm cân thật nhanh. Tuy nhiên, với một bạn nam 68 kg có chơi thể thao, mức này gây ra những hệ lụy sinh học nghiêm trọng:
1. **Thấp hơn cả BMR (1.300 < 1.620):** Cơ thể bạn bị "đói tế bào". Để tồn tại, não bộ sẽ phát tín hiệu cắt giảm năng lượng vận hành: hạ thân nhiệt, rụng tóc, giảm sản xuất hormone sinh dục Testosterone, làm cơ thể rơi vào trạng thái mệt mỏi, uể oải và sương mù não (brain fog).
2. **Thích nghi chuyển hóa tiêu cực (Adaptive Thermogenesis):** Cơ thể nhận định bạn đang trải qua nạn đói thực sự. Nó sẽ tự động ghìm TDEE xuống bằng cách làm bạn lười vận động vô thức (giảm NEAT) và phân giải chính mô cơ bắp để lấy axit amin tạo glucose.
3. **Mất cơ nhanh hơn mất mỡ (Skinny Fat):** Thiếu năng lượng trầm trọng khiến cơ thể không thể tổng hợp cơ bắp. Kết quả là cân nặng tụt nhanh nhưng là mất nước và teo cơ, vòng bụng dưới vẫn nguyên ngấn mỡ bèo nhèo.
4. **Nguy cơ hạ đường huyết và chấn thương sân bóng:** Đá banh là môn thể thao cường độ cao ngắt quãng (HIIT). Chạy nước rút khi thâm hụt quá sâu dễ gây chuột rút, rách cơ gân kheo và ngất xỉu do cạn kiệt glycogen.`,
        callout: {
          type: 'WARNING',
          title: 'CẢNH BÁO AN TOÀN Y TẾ TỪ CUTTRACK',
          text: 'Mức 1.300 kcal là mức tự chọn tham khảo của người dùng, TUYỆT ĐỐI KHÔNG PHẢI KHUYẾN NGHỊ Y TẾ. CutTrack tự động cảnh báo và đề xuất mức khởi đầu an toàn 1.500–1.650 kcal/ngày.',
        },
      },
      {
        heading: '3. Thiết lập thâm hụt calo thông minh và lộ trình 68kg -> 62kg',
        content: `Để giảm mỡ bền vững mà vẫn giữ được cơ bắp và đủ sức đá banh 45 phút mỗi tuần:
- **Mức thâm hụt khuyến nghị:** 20–25% so với TDEE (khoảng 350–450 kcal/ngày).
- **Mức nạp vào mỗi ngày:** **1.500 – 1.650 kcal** vào những ngày bình thường.
- **Ngày đá banh:** Nạp từ **1.750 – 1.850 kcal** (ưu tiên bổ sung carb và protein phục hồi).
- **Tốc độ giảm kỳ vọng:** 0.4 – 0.5 kg mỡ/tuần. Sau 12–14 tuần, bạn sẽ đạt mốc 62 kg với hình thể săn chắc, cơ bụng rõ nét thay vì một thân hình ốm yếu thiếu sức sống.`,
      },
    ],
    faqs: [
      {
        question: 'Tôi ăn 1.300 kcal trong tuần đầu thấy giảm 2 kg, sao app lại bảo không tốt?',
        answer: '2 kg giảm trong tuần đầu thực chất 70-80% là nước và glycogen dự trữ trong gan và cơ bắp (mỗi 1g glycogen ngậm 3g nước). Khi cắt calo đột ngột, lượng glycogen này cạn kiệt làm cân nặng tụt ảo, không phải bạn đã đốt được 2 kg mỡ thuần khiết.',
      },
      {
        question: 'Nếu ngày nào tôi lỡ ăn dưới 1.300 kcal thì có sao không?',
        answer: 'Một vài ngày đột xuất không gây hại lâu dài. Tuy nhiên, duy trì liên tục trên 7-10 ngày sẽ làm suy giảm hệ miễn dịch và suy yếu cơ bắp. Bạn nên ăn thêm 1-2 quả trứng luộc hoặc 100g ức/má đùi gà để chạm mức sàn an toàn 1.500 kcal.',
      },
    ],
    references: [
      {
        title: 'International society of sports nutrition position stand: diets and body composition',
        source: 'Journal of the International Society of Sports Nutrition (JISSN)',
        year: 2017,
        url: 'https://doi.org/10.1186/s12970-017-0174-y',
      },
      {
        title: 'A new predictive equation for resting energy expenditure in healthy individuals',
        source: 'The American Journal of Clinical Nutrition (Mifflin et al.)',
        year: 1990,
      },
      {
        title: 'Bảng Nhu cầu Dinh dưỡng Khuyến nghị cho Người Việt Nam',
        source: 'Viện Dinh Dưỡng Quốc Gia Việt Nam (NIN)',
        year: 2016,
      },
    ],
  },

  // BÀI 2: GIẢM CÂN VS GIẢM MỠ
  {
    id: 'article-2-weight-vs-fat',
    slug: 'giam-can-vs-giam-mo-giu-co',
    title: 'Giảm cân vs Giảm mỡ: Giữ cơ bắp trong thâm hụt năng lượng',
    subtitle: 'Chiến lược bảo toàn khối nạc để sở hữu vóc dáng săn chắc thay vì hình thể Skinny Fat',
    coverUrl: '/media/articles/giam-can-vs-giam-mo-giu-co.svg',
    categoryTag: 'BẢO TOÀN CƠ BẮP',
    readTime: '6 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người muốn giảm mỡ bụng dưới, nọng cằm nhưng giữ cơ ngực, vai và đùi săn chắc',
    summary: 'Làm rõ sự khác biệt giữa sụt cân trên bàn cân và giảm mỡ thực sự. Hướng dẫn tam giác vàng giữ cơ: kích thích kháng lực tự thân (push-up, squat), nạp đủ đạm chất lượng cao và giấc ngủ hồi phục.',
    keyTakeaways: [
      'Bàn cân chỉ phản ánh tổng trọng lượng (mỡ + cơ + nước + xương + thức ăn trong ruột), không phản ánh chất lượng hình thể.',
      'Mất cơ làm giảm tốc độ trao đổi chất cơ bản, là nguyên nhân hàng đầu gây tăng cân trở lại (hiệu ứng Yo-Yo).',
      'Cơ thể cần "tín hiệu cơ học" từ tập luyện kháng lực để hiểu rằng các sợi cơ vẫn đang được sử dụng và không được phép tiêu biến.',
      'Kết hợp chống đẩy tối đa 20 cái, squat tự thân và bổ sung đạm rẻ tiền từ trứng, gà luộc là công thức vàng giữ cơ.',
    ],
    sections: [
      {
        heading: '1. Bàn cân đang đánh lừa bạn như thế nào?',
        content: `Khi đứng lên bàn cân, con số bạn nhìn thấy là tổng hòa của:
- Khối mỡ (Fat Mass): Mỡ dưới da, mỡ nội tạng.
- Khối nạc (Fat-Free Mass): Cơ bắp, các cơ quan nội tạng, xương khớp.
- Lượng nước cơ thể (Total Body Water): Chiếm 55–65% trọng lượng, có thể dao động 1–2 kg trong ngày tùy lượng muối ăn vào và nước uống.
- Thức ăn và bã thải đang tiêu hóa trong dạ dày và ruột.

Mục tiêu thực sự của việc tập luyện và ăn uống lành mạnh là **Giảm mỡ (Fat Loss) chứ không phải Giảm cân mù quáng (Weight Loss)**. Nếu bạn giảm được 5 kg mà trong đó có 3 kg là cơ bắp và nước, cơ thể bạn sẽ lỏng lẻo, vai xẹp, ngực lép nhưng bụng dưới vẫn phình to.`,
      },
      {
        heading: '2. Tại sao cơ thể lại "đòi" đốt cơ bắp trước?',
        content: `Dưới góc nhìn tiến hóa, mô cơ bắp là một cấu trúc tiêu tốn rất nhiều calo để duy trì. Khi bạn đưa cơ thể vào tình trạng thâm hụt năng lượng, bộ não sinh tồn sẽ tìm cách loại bỏ bớt những thứ ngốn năng lượng nhất nếu chúng "không hữu ích".
Nếu bạn chỉ ăn ít mà không tập kháng lực, cơ thể sẽ tự nhủ: *"Các cơ bắp này không làm việc nặng nhọc gì cả, hãy phân giải bớt thành axit amin để tạo năng lượng nuôi tim và não"*.
Ngược lại, khi bạn bắt cơ bắp làm việc thông qua các bài tập kháng lực (Push-up, Diamond push-up, Squat, Lunge), các thụ thể cơ học (mechanoreceptors) trên màng tế bào cơ sẽ kích hoạt con đường tín hiệu **mTOR**, gửi mệnh lệnh đanh thép: *"Cơ bắp này đang chịu tải nặng, bắt buộc phải bảo tồn và gia cố!"*.`,
        callout: {
          type: 'TIP',
          title: 'CHIẾN THUẬT CHO NGƯỜI CHỐNG ĐẨY TỐI ĐA 20 CÁI',
          text: 'Với mức chống đẩy tối đa 20 cái liên tục, bạn không cần phải tập đến kiệt sức hoàn toàn (failure) mỗi hiệp. Hãy tập 3-4 hiệp, mỗi hiệp 12-16 cái (dừng lại khi còn cách ngưỡng kiệt sức 2-3 cái - RPE 7-8). Cách này vừa kích thích giữ cơ tối đa, vừa bảo vệ khớp vai và thần kinh.',
        },
      },
      {
        heading: '3. Tam giác vàng bảo toàn cơ bắp trong thâm hụt calo',
        content: `1. **Kháng lực tự thân đều đặn (Resistance Training):** Duy trì 3 buổi tập sức mạnh/tuần (Ngực/Lưng, Chân, Toàn thân) theo thư viện bài tập của CutTrack.
2. **Nạp đủ Protein chất lượng cao:** Đạt mức 1.6 – 2.0g protein/kg trọng lượng (khoảng 110 – 135g/ngày cho bạn nam 68kg).
3. **Giấc ngủ sâu và quản lý Stress:** Hormone tăng trưởng (Growth Hormone) và quá trình tổng hợp protein cơ bắp diễn ra mạnh mẽ nhất trong các chu kỳ ngủ sâu (NREM stage 3). Thiếu ngủ làm tăng hormone đói Ghrelin và hormone dị hóa cơ bắp Cortisol.`,
      },
    ],
    faqs: [
      {
        question: 'Tôi chỉ tập chống đẩy và squat ở nhà, không tới phòng gym thì có giữ cơ được không?',
        answer: 'Hoàn toàn được! Các nghiên cứu từ Đại học McMaster (Canada) chỉ ra rằng cơ bắp phản ứng với độ căng cơ học nội tại, không phân biệt tạ sắt hay trọng lượng cơ thể. Miễn là bạn tập đủ số lần (12-20 reps) gần ngưỡng mỏi và tăng tiến độ khó (progressive overload) qua các biến thể như Diamond push-up hay Backpack row.',
      },
      {
        question: 'Dấu hiệu nào cho biết tôi đang mất cơ chứ không phải giảm mỡ?',
        answer: 'Dấu hiệu rõ nhất: Bạn thấy số cái chống đẩy tối đa bị sụt giảm (từ 20 cái xuống còn 12-14 cái), cảm giác người yếu đi rõ rệt khi đá banh, và dù cân nặng giảm nhưng số đo vòng eo không hề thu nhỏ.',
      },
    ],
    references: [
      {
        title: 'Preserving Healthy Muscle during Weight Loss',
        source: 'Advances in Nutrition (Cava et al.)',
        year: 2017,
        url: 'https://doi.org/10.3945/an.116.014506',
      },
      {
        title: 'Resistance training-induced changes in integrated myofibrillar protein synthesis',
        source: 'The Journal of Physiology (Phillips SM)',
        year: 2009,
      },
    ],
  },

  // BÀI 3: SỰ THẬT VỀ MỠ BỤNG DƯỚI VÀ NỌNG CẰM
  {
    id: 'article-3-stubborn-fat',
    slug: 'su-that-mo-bung-duoi-nong-cam',
    title: 'Sự thật về mỡ bụng dưới và nọng cằm: Không thể giảm mỡ cục bộ',
    subtitle: 'Khoa học về thụ thể Adrenergic, cơ địa tích mỡ nam giới và cách khắc phục triệt để',
    coverUrl: '/media/articles/su-that-mo-bung-duoi-nong-cam.svg',
    categoryTag: 'GIẢI MÃ LẦM TƯỞNG',
    readTime: '5 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người băn khoăn tại sao tập gập bụng nhiều mà bụng dưới vẫn to, mặt vẫn có nọng cằm',
    summary: 'Đập tan quan niệm sai lầm về giảm mỡ tại chỗ (Spot Reduction). Giải thích sinh học vì sao mỡ bụng dưới và nọng cằm là nơi tích tụ đầu tiên nhưng biến mất cuối cùng, cùng vai trò của tư thế và giữ nước.',
    keyTakeaways: [
      'Không có bất kỳ bài tập nào (dù gập bụng 1.000 cái hay đeo đai nịt bụng) có thể làm tan mỡ riêng vùng bụng dưới.',
      'Vùng mỡ cứng đầu (Stubborn Fat) ở nam giới có mật độ thụ thể Alpha-2 (ức chế ly giải mỡ) cao gấp nhiều lần thụ thể Beta-2.',
      'Tư thế đầu đổ về trước (Forward Head Posture) và võng lưng dưới (Anterior Pelvic Tilt) tạo ảo giác nọng cằm và bụng dưới to phình.',
      'Natri từ nước dùng quán xá làm giữ nước dưới da; uống đủ nước lọc giúp đào thải natri dư thừa làm mặt gọn lại.',
    ],
    sections: [
      {
        heading: '1. Ảo tưởng "Gập bụng tan mỡ bụng, xoa bóp tan nọng cằm"',
        content: `Khi bạn gập bụng (Crunch) hay plank, cơ bắp đang co bóp là các thớ cơ trực bụng (Rectus Abdominis) và cơ bụng ngang. Cảm giác nóng rát bạn cảm thấy ở vùng bụng là do sự tích tụ của ion Hydro ($H^+$) và acid lactic trong sợi cơ, **hoàn toàn không phải mỡ đang tan chảy**.
Mỡ được lưu trữ trong tế bào mỡ dưới dạng phân tử Triglyceride. Khi cơ thể thiếu năng lượng, hormone Adrenaline và Noradrenaline sẽ di chuyển theo dòng máu tuần hoàn khắp cơ thể để phân cắt Triglyceride thành Glycerol và Axit béo tự do giải phóng vào máu. Dòng máu này rút mỡ từ khắp mọi nơi (mặt, cổ, cánh tay, ngực, lưng, đùi, bụng). Không hề có con đường mạch máu nào nối từ cơ bụng hút trực tiếp mỡ bụng xung quanh!`,
      },
      {
        heading: '2. Tại sao bụng dưới và nọng cằm lại lì lợm đến vậy?',
        content: `Trên màng tế bào mỡ có 2 loại thụ thể tiếp nhận hormone kích hoạt ly giải mỡ:
- **Thụ thể Beta-2 ($\\beta_2$):** Đóng vai trò như "chân ga", khi hormone gắn vào sẽ thúc đẩy giải phóng mỡ cực nhanh.
- **Thụ thể Alpha-2 ($\\alpha_2$):** Đóng vai trò như "chân phanh", khi hormone gắn vào sẽ ngăn chặn quá trình giải phóng mỡ.

Ở nam giới, mỡ ở vùng cánh tay, ngực và đùi chứa đa phần thụ thể Beta-2, nên khi thâm hụt calo, bạn sẽ thấy tay và ngực gọn gàng rất nhanh. Ngược lại, vùng **bụng dưới, eo hông và nọng cằm** có mật độ thụ thể Alpha-2 cao gấp 3-4 lần, đồng thời lưu lượng máu nuôi đến các mô mỡ này rất thấp (sờ vào thường thấy lạnh). Do đó, chúng được mệnh danh là **Mỡ cứng đầu (Stubborn Fat)**: tích tụ đầu tiên khi tăng cân và biến mất sau cùng khi giảm mỡ.`,
        callout: {
          type: 'IMPORTANT',
          title: 'QUY TẮC BỂ NƯỚC',
          text: 'Giảm mỡ giống như việc rút nước khỏi một chiếc bể bơi dốc. Bạn không thể chỉ múc nước ở phần sâu nhất (bụng dưới). Nước phải hạ đều trên toàn bộ mặt bể, đến khi mực nước xuống đủ thấp, đáy bể mới bắt đầu lộ ra. Kiên nhẫn duy trì thâm hụt đến khi body fat về 13-14%, bụng dưới sẽ tự phẳng.',
        },
      },
      {
        heading: '3. Yếu tố tư thế và giữ nước: Khắc phục ngay hôm nay',
        content: `Nhiều bạn nam 68 kg nghĩ mình có nọng cằm và bụng dưới quá to, nhưng thực tế có sự đóng góp lớn của:
1. **Tư thế cổ rùa (Forward Head Posture):** Ngồi máy tính cúi gập cổ làm cơ dưới hàm chùng nhão, dồn các mô mềm về phía trước tạo thành nọng cằm giả. Khắc phục: Giữ thẳng lưng, thu cằm nhẹ về sau (chin tuck).
2. **Tư thế võng lưng (Anterior Pelvic Tilt):** Cơ gấp hông bị co ngắn và cơ mông yếu khiến xương chậu đổ về trước, đẩy toàn bộ nội tạng và thành bụng nhô ra phía trước. Khắc phục: Tập bài Cầu hông (Glute Bridge) và Plank cẳng tay.
3. **Giữ nước do ăn mặn ở quán:** Nước dùng bún riêu, hủ tiếu chứa rất nhiều natri, giữ lại hàng lít nước dưới da mặt và bụng. Khắc phục: Uống đủ 2.5–3 lít nước lọc/ngày để kích thích thận bài tiết natri dư thừa.`,
      },
    ],
    faqs: [
      {
        question: 'Dùng đai nịt bụng hoặc bôi kem tan mỡ khi chạy bộ có giúp giảm mỡ bụng không?',
        answer: 'Hoàn toàn không! Đai nịt bụng chỉ ép chặt các cơ quan nội tạng và làm bạn đổ nhiều mồ hôi tại chỗ. Lượng nước mất đi này sẽ bù lại ngay lập tức khi bạn uống nước. Chưa kể nịt bụng lâu ngày làm yếu cơ lõi tự nhiên và trào ngược dạ dày.',
      },
    ],
    references: [
      {
        title: 'Regional differences in cellularity and lipolysis in human adipose tissue',
        source: 'The American Journal of Clinical Nutrition',
        year: 2008,
      },
      {
        title: 'The effect of abdominal exercise on abdominal fat',
        source: 'Journal of Strength and Conditioning Research (Vispute et al.)',
        year: 2011,
      },
    ],
  },

  // BÀI 4: MACRO PHÂN BỔ: PROTEIN VÀ CHẤT XƠ
  {
    id: 'article-4-macro-protein-fiber',
    slug: 'macro-protein-chat-xo',
    title: 'Macro phân bổ: Tầm quan trọng của Protein và chất xơ',
    subtitle: 'Tối ưu hiệu ứng nhiệt TEF, kiểm soát cơn đói và phân bổ macro với ngân sách sinh viên',
    coverUrl: '/media/articles/macro-protein-chat-xo.svg',
    categoryTag: 'DINH DƯỠNG ĐA LƯỢNG',
    readTime: '8 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người cần lên kế hoạch macro chuẩn xác với mức chi phí 70-80k VND/ngày',
    summary: 'Phân tích sâu vai trò của 3 chất đa lượng (Protein, Carb, Fat). Khám phá hiệu ứng nhiệt của thức ăn (TEF), cơ chế no lâu của chất xơ hòa tan và công thức phân bổ macro tối ưu cho người giảm mỡ.',
    keyTakeaways: [
      'Protein có TEF cao nhất (20–30%), nghĩa là bạn ăn 100 kcal protein thì cơ thể đã tiêu tốn 20–30 kcal chỉ để tiêu hóa nó.',
      'Mục tiêu protein lý tưởng: 1.6–2.0g/kg thể trọng (tương đương 110–135g/ngày cho bạn nam 68 kg).',
      'Chất xơ (25–30g/ngày) làm chậm rỗng dạ dày, ngăn chặn đột biến đường huyết và giúp duy trì cảm giác no suốt buổi làm việc.',
      'Ngân sách 70–80k hoàn toàn đạt đủ macro nhờ đạm rẻ tiền: má đùi gà luộc (70k/kg), trứng gà (3.5k/quả) và cơm tiệm.',
    ],
    sections: [
      {
        heading: '1. Năng lượng và Hiệu ứng nhiệt TEF của 3 chất đa lượng',
        content: `Các chất dinh dưỡng đa lượng (Macronutrients) cung cấp năng lượng với mật độ khác nhau:
- **1g Protein (Chất đạm):** 4 kcal (TEF: 20–30%)
- **1g Carbohydrate (Tinh bột):** 4 kcal (TEF: 5–10%)
- **1g Fat (Chất béo):** 9 kcal (TEF: 0–3%)

**Hiệu ứng nhiệt của thực phẩm (TEF):** Khi bạn nạp 400 kcal từ protein (khoảng 100g ức gà hoặc má đùi luộc), cơ thể bạn phải đốt cháy khoảng 80–120 kcal chỉ để bẻ gãy các liên kết peptide, hấp thu và chuyển hóa các axit amin. Nhưng nếu bạn ăn 400 kcal từ mỡ hoặc đường tinh luyện, cơ thể chỉ tiêu tốn 0–15 kcal. Đây là lý do chế độ ăn giàu đạm giúp bạn thâm hụt calo tự nhiên mà không thấy đói cồn cào.`,
      },
      {
        heading: '2. Phân bổ Macro chuẩn cho bạn nam 68kg hướng tới 62kg',
        content: `Với mức năng lượng mục tiêu **1.600 kcal/ngày**:
1. **Protein: 120g – 130g (~500 kcal, chiếm ~31% tổng calo)**
   - Bảo toàn khối cơ nạc, cung cấp leucine kích hoạt tổng hợp cơ.
   - Nguồn: Cơm gà kho quán (30g), 2 quả trứng gà luộc (13g), 200g má đùi gà luộc (45g), bún/cơm (15g).
2. **Fat: 40g – 48g (~380 – 430 kcal, chiếm ~25% tổng calo)**
   - Tối thiểu cần 0.6–0.8g fat/kg để duy trì sản xuất màng tế bào và hormone Testosterone.
   - Nguồn: Lòng đỏ trứng gà, mỡ tự nhiên từ thịt đùi gà, dầu kho trong món cơm tiệm.
3. **Carbohydrate: 165g – 180g (~680 – 720 kcal, chiếm ~44% tổng calo)**
   - Nạp năng lượng cho não bộ và nạp glycogen dự trữ cho các buổi tập và trận đá banh.
   - Nguồn: Cơm trắng (2 bát ~110g carb), bánh bao, sợi bún/hủ tiếu.`,
      },
      {
        heading: '3. Chất xơ: "Vũ khí bí mật" kiểm soát cơn đói',
        content: `Chất xơ không sinh calo đáng kể nhưng quyết định thành bại của quá trình giảm mỡ:
- **Cơ chế:** Chất xơ hòa tan kết hợp với nước trong dạ dày tạo thành lớp gel sệt, làm chậm tốc độ tiêu hóa tinh bột, giúp đường huyết tăng từ từ thay vì tăng vọt rồi tụt dốc (nguyên nhân gây cảm giác thèm ăn sau khi ăn 1-2 tiếng).
- **Thực tế:** Khi đi ăn cơm bình dân 30k, hãy luôn tận dụng xin thêm đĩa dưa leo, cà chua thái lát hoặc rau luộc ghém kèm. Đĩa rau này cung cấp 4-5g chất xơ với lượng calo gần như bằng không.`,
      },
    ],
    faqs: [
      {
        question: 'Ăn nhiều đạm như vậy có làm hại thận không?',
        answer: 'Đối với người có chức năng thận bình thường, hàng trăm nghiên cứu lâm sàng đã khẳng định mức nạp 1.6-2.2g protein/kg thể trọng là hoàn toàn an toàn. Hãy nhớ uống đủ 2.5-3 lít nước mỗi ngày để hỗ trợ thận lọc các sản phẩm chuyển hóa urê.',
      },
    ],
    references: [
      {
        title: 'Dietary protein intake and human health',
        source: 'Food & Function (Wu G)',
        year: 2016,
      },
      {
        title: 'A high protein diet has no harmful effects: a one-year crossover study in resistance-trained males',
        source: 'Journal of Nutrition and Metabolism (Antonio et al.)',
        year: 2016,
      },
    ],
  },

  // BÀI 5: CÂN THỰC PHẨM: SỐNG VS CHÍN, XƯƠNG VS THỊT
  {
    id: 'article-5-weighing-food',
    slug: 'can-thuc-pham-song-chin-xuong',
    title: 'Cân thực phẩm: Sống vs Chín, Phần ăn được vs Cả xương',
    subtitle: 'Loại bỏ sai số 30–50% khi tính calo thịt gà, bún, cơm và món kho',
    coverUrl: '/media/articles/can-thuc-pham-song-chin-xuong.svg',
    categoryTag: 'KỸ THUẬT ĐỊNH LƯỢNG',
    readTime: '6 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người ghi chép nhật ký ăn uống nhưng hay bị lệch calo không rõ lý do',
    summary: 'Vạch trần những sai số định lượng phổ biến nhất: sự thay đổi trọng lượng do bay hơi nước hoặc hút nước, tỷ lệ xương trong thịt gà và phương pháp ước lượng chuẩn xác khi ăn tiệm không có cân tiểu ly.',
    keyTakeaways: [
      '100g ức/đùi gà sống sau khi luộc hoặc nướng sẽ ngót còn 75–80g do mất nước, nhưng lượng calo và protein vẫn giữ nguyên.',
      'Gạo sống hút nước gấp 2.4 lần khi nấu thành cơm chín (100g gạo sống ~ 360 kcal tạo ra ~240g cơm chín).',
      'Nửa con gà nướng 400–500g mua ngoài quán có khoảng 35–40% là xương; thịt ăn được thực tế chỉ khoảng 250–280g.',
      'Luôn nhất quán: nhập dữ liệu theo đúng trạng thái (sống hay chín, có xương hay không) trong app CutTrack.',
    ],
    sections: [
      {
        heading: '1. Cạm bẫy Sống vs Chín (Raw vs Cooked)',
        content: `Nước không chứa calo, nhưng nước làm thay đổi trọng lượng thức ăn một cách ngoạn mục:
- **Thịt động vật (Gà, Heo, Bò):** Khi nấu chín (luộc, nướng, kho), nhiệt độ làm co các thớ protein và đẩy nước ra ngoài. 100g thịt gà sống chứa khoảng 120 kcal và 22g protein. Sau khi luộc chín, nó chỉ còn nặng **75g – 80g**, nhưng 75g này vẫn chứa trọn vẹn 120 kcal và 22g protein đó!
  *Sai lầm phổ biến:* Cân 100g thịt gà chín trên đĩa, nhưng lại chọn mục "Thịt gà sống" trong app dinh dưỡng $\\rightarrow$ Bạn đã ăn thực tế khoảng 155 kcal và 28g protein nhưng chỉ ghi nhận 120 kcal (bị hụt 30% calo thực tế!).
- **Tinh bột (Cơm, Bún, Mì):** Ngược lại với thịt, hạt tinh bột nở ra và hút nước mạnh mẽ:
  - 100g gạo tẻ sống (~360 kcal) hút nước nở thành **~240g – 250g cơm chín**.
  - Như vậy 100g cơm chín chỉ chứa khoảng **130 kcal**.
  - 100g bún khô (~350 kcal) luộc lên sẽ thành **~250g bún tươi/chín** (~110 kcal/100g bún chín).`,
      },
      {
        heading: '2. Tỷ lệ Phần ăn được vs Cả xương (Edible vs Bone-in)',
        content: `Khi mua đồ ăn tại Việt Nam, hầu hết các món gà, sườn heo, giò heo đều được chặt cả xương:
- **Nửa con gà nướng (400g – 500g cả xương/da):**
  - Trọng lượng xương và sụn chiếm khoảng 35% – 40% (khoảng 150g – 180g).
  - Phần thịt nạc và da ăn được thực tế chỉ dao động từ **250g – 280g**.
  - Nếu bạn tính 500g thịt gà nạc nguyên chất, bạn sẽ ghi nhận tới 1.200 kcal (sai lệch khủng khiếp so với thực tế chỉ ~750–850 kcal).
- **Đùi gà kho ở quán cơm tiệm:**
  - Một miếng đùi góc tư chặt khúc nặng ~150g thì xương chiếm khoảng 45–50g, thịt nạc và da ăn được khoảng 100g.
- **Tô hủ tiếu / bún bò có giò heo:**
  - Cục giò heo to nặng 120g thì xương ống chiếm tới 60g, phần da gân thịt chỉ khoảng 60g.`,
        callout: {
          type: 'TIP',
          title: 'CÁCH ƯỚC LƯỢNG BẰNG TAY KHI ĂN QUÁN',
          text: 'Khi ăn ngoài tiệm không có cân điện tử, hãy nhớ: 1 lòng bàn tay thịt nạc (không tính ngón tay) xấp xỉ 100g thịt chín (~22-25g protein); 1 nắm tay cơm xấp xỉ 1 bát cơm vơi (150g cơm chín ~ 200 kcal); 1 ngón tay cái dầu mỡ tương đương 1 thìa canh (10g fat ~ 90 kcal).',
        },
      },
      {
        heading: '3. Quy tắc vàng khi nhập liệu vào CutTrack',
        content: `App CutTrack được thiết kế với các trường phân loại chuyên biệt:
- Chọn rõ thuộc tính \`weightBasis\`: \`RAW\` (Sống), \`COOKED\` (Chín), \`EDIBLE\` (Ăn được), hoặc \`BONE_IN\` (Cả xương).
- Với món quán khó cân chính xác, app hỗ trợ khoảng ước tính (min/max) thay vì một con số giả chính xác tuyệt đối.`,
      },
    ],
    faqs: [
      {
        question: 'Tôi luộc gà ở nhà thì nên cân lúc sống hay lúc chín?',
        answer: 'Tốt nhất là cân lúc sống trước khi luộc vì hàm lượng nước trong thịt sống đồng đều và cơ sở dữ liệu dinh dưỡng gốc luôn đo trên thực phẩm sống. Nếu lỡ luộc rồi mới cân, hãy chắc chắn chọn đúng mục "Thịt gà chín/luộc" trong danh mục món.',
      },
    ],
    references: [
      {
        title: 'USDA Food Data Central: Chicken thigh, meat only, cooked',
        source: 'U.S. Department of Agriculture (USDA)',
        year: 2024,
      },
      {
        title: 'Bảng thành phần thực phẩm Việt Nam',
        source: 'Viện Dinh Dưỡng - Bộ Y Tế',
        year: 2007,
      },
    ],
  },

  // BÀI 6: CHẾ ĐỘ ĂN 2 BỮA/NGÀY
  {
    id: 'article-6-two-meals-day',
    slug: 'che-do-an-2-bua-ngay',
    title: 'Chế độ ăn 2 bữa/ngày: Lợi ích và những điều cần lưu ý',
    subtitle: 'Tận dụng nhịn ăn gián đoạn 16/8 cho dân công sở bận rộn mà không bị tụt đường huyết',
    coverUrl: '/media/articles/che-do-an-2-bua-ngay.svg',
    categoryTag: 'LỊCH ĂN & LỐI SỐNG',
    readTime: '6 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người đi làm chỉ ăn 2 bữa chính (Trưa và Tối), không có thời gian chuẩn bị bữa sáng',
    summary: 'Khám phá cơ chế sinh học của nhịn ăn gián đoạn (Intermittent Fasting). Giải thích vì sao 2 bữa/ngày không tự động làm giảm cân nếu ăn quá calo, và cách phân bổ đạm để luôn tỉnh táo suốt buổi sáng.',
    keyTakeaways: [
      'Ăn 2 bữa/ngày (bỏ bữa sáng) bản chất là mô hình Intermittent Fasting 16/8 rất phù hợp với nhịp sống hiện đại.',
      'Số lượng bữa ăn không quyết định tốc độ giảm mỡ; tổng calo và tổng lượng protein trong ngày mới là yếu tố cốt lõi.',
      'Ưu điểm lớn nhất của 2 bữa/ngày là cho phép bạn ăn 2 bữa thịnh soạn (750–800 kcal/bữa), tạo cảm giác no nê thỏa mãn.',
      'Cần phân bổ tối thiểu 40–50g protein cho mỗi bữa ăn để kích hoạt ngưỡng Leucine tổng hợp cơ bắp.',
    ],
    sections: [
      {
        heading: '1. Bản chất khoa học của chế độ ăn 2 bữa/ngày',
        content: `Nhiều thế hệ từng được khuyên rằng: *"Bữa sáng là bữa ăn quan trọng nhất trong ngày"* hay *"Phải chia nhỏ 5–6 bữa để tăng tốc độ trao đổi chất"*. Tuy nhiên, khoa học dinh dưỡng hiện đại đã chứng minh đây là những lầm tưởng:
- Các nghiên cứu đối chứng ngẫu nhiên (RCT) cho thấy chia 6 bữa nhỏ hay ăn 2 bữa lớn với cùng tổng calo và macro đem lại kết quả giảm mỡ và trao đổi chất hoàn toàn tương đương nhau.
- Mô hình ăn 2 bữa chính:
  - **Khung nhịn ăn (Fasting):** 20h00 tối hôm trước đến 12h00 trưa hôm sau (16 tiếng nhịn).
  - **Khung ăn uống (Feeding window):** 12h00 trưa đến 20h00 tối (8 tiếng ăn).
  - **Bữa 1 (Trưa - 12h00):** Ăn suất cơm tiệm / bún riêu đầy đặn (~750 kcal).
  - **Bữa 2 (Tối - 19h00):** Ăn cơm nhà + bổ sung má đùi gà luộc / trứng luộc (~850 kcal).`,
      },
      {
        heading: '2. Lợi ích vượt trội cho người bận rộn',
        content: `1. **Tâm lý thoải mái, không thấy "bị ăn kiêng":** Nếu chia 1.600 kcal làm 4 bữa, mỗi bữa chỉ được vỏn vẹn 400 kcal (vài miếng thịt nhỏ và nửa bát cơm), bạn sẽ luôn cảm thấy thèm thuồng và chưa đã miệng. Khi gom lại thành 2 bữa, mỗi bữa bạn được ăn một đĩa cơm gà kho đầy đặn hoặc một bữa tối thịnh soạn có thịt, trứng, cơm.
2. **Tỉnh táo làm việc buổi sáng:** Khi nhịn ăn buổi sáng, nồng độ insulin duy trì ở mức đáy, cơ thể tiết ra một lượng nhỏ hormone Noradrenaline giúp hệ thần kinh tập trung cao độ, làm việc hiệu quả mà không bị cảm giác buồn ngủ gà gật sau bữa ăn sáng nhiều tinh bột.
3. **Tiết kiệm thời gian và ngân sách:** Không phải đau đầu nghĩ xem sáng nay ăn gì và tiết kiệm được 25.000 – 35.000đ tiền ăn sáng mỗi ngày.`,
        callout: {
          type: 'TIP',
          title: 'MẸO VƯỢT QUA CƠN ĐÓI BUỔI SÁNG (8H - 11H)',
          text: 'Cơn đói buổi sáng thường xuất hiện theo nhịp sinh học (sóng hormone Ghrelin) và sẽ tự biến mất sau 20-30 phút. Hãy uống 1 cốc nước ấm lớn (300-500ml), hoặc 1 ly cà phê đen không đường, hoặc trà xanh loãng. Nước và caffeine tự nhiên sẽ làm dịu dạ dày ngay lập tức.',
        },
      },
      {
        heading: '3. Những lưu ý sống còn để không bị phản tác dụng',
        content: `- **Không ăn bù vô độ vào bữa trưa:** Cảm giác nhịn từ sáng có thể khiến bạn có tâm lý "tự thưởng", gọi thêm cơm thêm sốt làm bữa trưa vọt lên 1.200 kcal.
- **Bắt buộc đủ Protein mỗi bữa:** Vì chỉ ăn 2 bữa, mỗi bữa bạn phải nạp từ 45g – 60g protein để cơ thể hấp thu đủ axit amin tái tạo cơ. Đây là lý do bữa tối cần luộc thêm 2 quả trứng hoặc 150g má đùi gà.`,
      },
    ],
    faqs: [
      {
        question: 'Bỏ ăn sáng có bị đau dạ dày không?',
        answer: 'Đau dạ dày chủ yếu do vi khuẩn HP (Helicobacter pylori) và căng thẳng thần kinh kích thích tiết acid dịch vị. Nếu bạn uống đủ nước lọc và không uống cà phê quá đậm khi bụng rỗng, việc nhịn ăn gián đoạn hoàn toàn an toàn và thậm chí giúp đường ruột được nghỉ ngơi phục hồi (Autophagy).',
      },
    ],
    references: [
      {
        title: 'Effects of intermittent fasting on health, aging, and disease',
        source: 'New England Journal of Medicine (de Cabo & Mattson)',
        year: 2019,
        url: 'https://doi.org/10.1056/NEJMra1905136',
      },
      {
        title: 'Meal frequency and timing in health and disease',
        source: 'Proceedings of the National Academy of Sciences (Mattson et al.)',
        year: 2014,
      },
    ],
  },

  // BÀI 7: ĂN QUÁN THÔNG MINH DƯỚI 35K
  {
    id: 'article-7-smart-street-food',
    slug: 'an-quan-thong-minh-duoi-35k',
    title: 'Ăn quán thông minh: Cách chọn món dưới 35k và mẹo giảm dầu mỡ',
    subtitle: 'Cơm tiệm, bún riêu, hủ tiếu: Tối ưu ngân sách 70–80k/ngày mà vẫn thâm hụt mỡ chuẩn',
    coverUrl: '/media/articles/an-quan-thong-minh-duoi-35k.svg',
    categoryTag: 'THỰC CHIẾN BÌNH DÂN',
    readTime: '7 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack',
    targetAudience: 'Người đi làm ăn cơm hàng quán bình dân với ngân sách tiết kiệm',
    summary: 'Cẩm nang thực chiến tại các quán cơm bình dân và quán bún nước Việt Nam. Chiến thuật gọi món kiểm soát dầu mỡ, tận dụng protein giá rẻ và phân bổ ngân sách 70.000–80.000 VND/ngày hiệu quả nhất.',
    keyTakeaways: [
      'Ngân sách 70–80k/ngày hoàn toàn đủ chất nếu phân bổ: 30k cho bữa trưa tiệm + 40–50k cho bữa tối tự nấu tại nhà.',
      'Món cơm tiệm ưu tiên: Cơm gà kho, cơm ếch kho, cơm đậu hũ kho; hạn chế tối đa thịt kho hột vịt (ba rọi nhiều mỡ).',
      'Khẩu lệnh vàng khi gọi cơm tiệm: "Cơm lưng đĩa, không chan thêm nước sốt, cho xin thêm dưa leo".',
      'Ăn bún riêu 25k thông minh: Ăn hết phần riêu cua, huyết và đậu; tuyệt đối KHÔNG húp cạn nước dùng nhiều natri và dầu điều.',
    ],
    sections: [
      {
        heading: '1. Phân bổ ngân sách 70.000 – 80.000 VND/ngày',
        content: `Với ngân sách khoảng 500.000 – 560.000 VND/tuần cho một bạn trẻ độc thân:
- **Bữa Trưa (Ăn ngoài quán tiệm): 30.000 – 35.000 VND**
  - Cơm gà kho: ~30.000 VND.
  - Bún riêu cua bình dân: ~25.000 VND.
  - Cơm đậu hũ kho / ếch kho: ~25.000 – 30.000 VND.
- **Bữa Tối (Nấu tại nhà): 40.000 – 45.000 VND**
  - Cơm trắng nấu tại nhà: ~3.000 VND (1 bát).
  - Má đùi gà công nghiệp luộc (mua siêu thị/chợ 35k-45k/kg): 200g ~ 8.000 – 9.000 VND (chứa tới 45g protein nạc!).
  - Trứng gà ta (vỉ 10 quả ~32k): 2 quả luộc ~ 6.500 VND (chứa 13g protein).
  - Rau củ luộc (bắp cải, rau muống, dưa leo): ~5.000 – 8.000 VND.
  - Lon Pepsi Zero / Yomost: ~8.000 – 10.000 VND.
- **Tổng chi phí ngày:** **~70.000 – 78.000 VND** $\\rightarrow$ Hoàn toàn nằm trong ngân sách mà nạp tới 110–125g protein chất lượng cao!`,
      },
      {
        heading: '2. Chiến thuật tại quán cơm bình dân 30k',
        content: `Quán cơm bình dân thường nấu các món kho với rất nhiều đường thắng màu, dầu ăn và mỡ heo để tạo độ bóng bẩy bắt mắt. Áp dụng 3 mẹo sau để cắt giảm ngay 200–300 kcal rỗng:
1. **Chọn món thông minh:**
   - **Nên chọn (Tier 1):** Cơm gà kho (bỏ bớt da mỡ), Cơm ếch kho (thịt ếch cực nạc, giàu đạm và kẽm), Cơm cá kho, Cơm đậu hũ kho.
   - **Hạn chế (Tier 3):** Cơm thịt kho trứng (thường dùng thịt ba rọi mỡ ngập ngụa nước dừa ngọt), Chả trứng chiên (ngấm dầu chiên đi chiên lại), Thịt heo quay giòn bì.
2. **Khẩu lệnh "Không chan nước sốt":** Một muôi nước sốt kho thịt chan lên cơm có thể chứa tới 10–15g mỡ và 10g đường (~150–200 kcal). Hãy yêu cầu người bán để đĩa cơm khô ráo tự nhiên.
3. **Cắt giảm cơm thừa:** Một đĩa cơm quán thường xới đầy tới 300–350g cơm (~450 kcal). Hãy dặn: *"Cho con xin nửa đĩa cơm thôi ạ"*.`,
        callout: {
          type: 'TIP',
          title: 'QUY TẮC ĂN BÚN NƯỚC (BÚN RIÊU, HỦ TIẾU)',
          text: 'Tô bún riêu 25k là món ăn bình dân tuyệt vời: Huyết heo là siêu thực phẩm giàu sắt và protein với lượng calo cực thấp; riêu cua và đậu hũ cung cấp canxi và đạm. Tuy nhiên, váng mỡ nổi trên mặt nước dùng chứa đầy dầu điều và natri. Ăn hết cái nhưng CHỪA LẠI NƯỚC DÙNG giúp bạn tiết kiệm 150 kcal và 2.000mg muối!',
        },
      },
      {
        heading: '3. Cách đọc nhãn đồ uống đóng chai tiện lợi',
        content: `- **Pepsi Zero / Coca Zero:** 0 kcal, 0 đường, dùng chất tạo ngọt sucralose/acesulfame K. Rất an toàn để giải tỏa cơn thèm ngọt giữa ngày mà không ảnh hưởng đến thâm hụt calo.
- **Yomost (Sữa chua uống):** 110 kcal / hộp 170ml, chứa 24g carbohydrate dạng đường đơn. Chỉ nên dùng vào thời điểm trước hoặc ngay sau khi đá banh để nạp năng lượng nhanh, không nên uống tùy tiện khi ngồi làm việc tĩnh tại.`,
      },
    ],
    faqs: [
      {
        question: 'Đi ăn cơm quán mà không chan sốt thì cơm khô khó nuốt lắm, có cách nào khác không?',
        answer: 'Bạn có thể xin một bát nước canh rau (canh cải, canh bí) kèm theo suất cơm, vớt rau ăn và chan 1-2 thìa canh nước trong để cơm mềm dễ nuốt. Nước canh rau luộc thanh đạm và ít calo hơn rất nhiều so với nước sốt thịt kho mỡ.',
      },
    ],
    references: [
      {
        title: 'Dietary sodium and health: more than just blood pressure',
        source: 'Journal of the American College of Cardiology',
        year: 2020,
      },
      {
        title: 'Nutritional analysis of Vietnamese street food dishes',
        source: 'National Institute of Nutrition Vietnam',
        year: 2018,
      },
    ],
  },

  // BÀI 8: DINH DƯỠNG TRƯỚC VÀ SAU ĐÁ BANH
  {
    id: 'article-8-football-nutrition',
    slug: 'dinh-duong-truoc-sau-da-banh',
    title: 'Dinh dưỡng trước và sau buổi đá banh: Nạp năng lượng và phục hồi',
    subtitle: 'Nạp glycogen, bù điện giải và phân tích bữa tối đặc biệt nửa con gà nướng',
    coverUrl: '/media/articles/dinh-duong-truoc-sau-da-banh.svg',
    categoryTag: 'DINH DƯỠNG THỂ THAO',
    readTime: '8 phút đọc',
    updatedAt: '15/10/2026',
    author: 'Ban Cố vấn Khoa học CutTrack (Khoa Y học Thể thao)',
    targetAudience: 'Người chơi bóng đá phong trào 45-60 phút/tuần muốn duy trì thể lực sung mãn',
    summary: 'Hướng dẫn chiến lược dinh dưỡng chuyên biệt cho trận đá banh 45 phút hàng tuần. Kỹ thuật nạp carb trước trận, bù nước trong trận và giải mã bữa ăn phục hồi kinh điển: Nửa con gà nướng + Cơm lam + Bánh bao.',
    keyTakeaways: [
      'Đá banh là môn thể thao yếm khí ngắt quãng, tiêu hao chủ yếu glycogen dự trữ trong cơ bắp.',
      'Ăn trước trận 2–3 tiếng: Ưu tiên tinh bột dễ tiêu hóa (cơm, chuối, khoai), hạn chế chất béo và chất xơ để tránh ỳ ạch dạ dày.',
      'Uống nước trong trận: Từng ngụm nhỏ 100–150ml, không uống ừng ực làm xóc hông.',
      'Bữa tối sau đá banh (Gà nướng + Cơm lam + Bánh bao): Rất giàu đạm và carb phục hồi, nhưng cần tránh "ăn bù gấp đôi" làm mất thâm hụt calo cả tuần.',
    ],
    sections: [
      {
        heading: '1. Nhu cầu năng lượng của trận đá banh 45 phút',
        content: `Một trận bóng đá sân 5 hoặc sân 7 kéo dài 45 phút đòi hỏi bạn phải liên tục thực hiện các pha bứt tốc (sprint), đổi hướng, tranh chấp tì đè và sút bóng.
- **Tiêu hao năng lượng:** Dao động từ **350 – 480 kcal** tùy thuộc vào vị trí thi đấu và cường độ di chuyển.
- **Hệ năng lượng vận hành:** Hệ Phosphagen (ATP-CP) cho các pha bứt tốc dưới 10 giây và hệ Đường phân yếm khí (Glycolytic system) cho các pha tranh chấp kéo dài. Cơ bắp đốt cháy cạn kiệt nguồn **Glycogen** dự trữ. Do đó, nếu bạn nhịn ăn hoặc ăn quá ít tinh bột vào ngày đá banh, bạn sẽ thấy chân nặng như đeo chì chỉ sau 15 phút đầu trận.`,
      },
      {
        heading: '2. Lộ trình nạp năng lượng 3 giai đoạn',
        content: `1. **Trước trận đấu (Cách 2.5 – 3 tiếng):**
   - Bữa trưa ăn cơm gà kho hoặc cơm trắng + thịt nạc vừa phải.
   - Tránh ăn thức ăn nhiều dầu mỡ (thịt quay, đồ chiên) và nhiều rau sống nhiều xơ vì chúng mất 4-5 tiếng để tiêu hóa, gây đầy bụng trào ngược khi chạy.
   - Cách trận 45 phút: Có thể uống 1 hộp sữa chua uống Yomost (24g carb nhanh) hoặc ăn 1 quả chuối tiêu để tăng nồng độ glucose trong máu.
2. **Trong trận đấu (Nghỉ giải lao giữa 2 hiệp):**
   - Uống từng ngụm nước nhỏ (100–150ml).
   - Nếu trời nắng nóng đổ nhiều mồ hôi, hãy pha thêm một chút muối khoáng hoặc oresol loãng để chống chuột rút bắp chuối.
3. **Ngay sau khi kết thúc trận (Khung cửa sổ 30 phút đầu):**
   - Bổ sung ngay nước lọc để bù lại lượng mồ hôi đã mất.`,
      },
      {
        heading: '3. Phân tích bữa tối đặc biệt: Gà nướng + Cơm lam + Bánh bao',
        content: `Sau trận bóng đá cuối tuần, người dùng CutTrack thường có một bữa ăn thịnh soạn phục hồi cùng bạn bè:
- **Nửa con gà nướng (400g – 500g cả xương da):** Cung cấp khoảng **65g – 75g protein** nạc cực kỳ dồi dào, giúp sửa chữa các vi tổn thương sợi cơ sau các pha tranh chấp tì đè.
- **1 ống Cơm lam (150g):** Nếp nương nướng dẻo bùi cung cấp khoảng **70g carbohydrate** phức hợp, giúp nạp đầy lại kho chứa glycogen trong gan và cơ bắp.
- **1 cái Bánh bao thịt trứng cút (130g):** Cung cấp thêm **45g carb và 12g protein**.
- **Tổng năng lượng bữa ăn:** Khoảng **1.350 – 1.550 kcal**.

Đây là bữa ăn tái tạo thể lực hoàn hảo, **tuy nhiên cần lưu ý cảnh báo Double-counting của CutTrack**:`,
        callout: {
          type: 'WARNING',
          title: 'CẢNH BÁO TRÁNH "DOUBLE-COUNT" CALO TẬP LUYỆN',
          text: 'Trận đá banh 45 phút tiêu hao ~400 kcal. Nếu bạn đã cộng 400 kcal này vào chỉ số TDEE trong app, rồi lại thoải mái ăn thêm bữa gà nướng 1.500 kcal mà không ghi chép cẩn thận, tổng calo ngày hôm đó sẽ vượt ngưỡng thặng dư (+500 đến +800 kcal), làm tiêu tan toàn bộ công sức thâm hụt của cả tuần! Hãy ghi nhận trung thực bữa ăn đặc biệt này vào CutTrack Diary để app tự động cân bằng ngân sách calo cho các ngày tiếp theo.',
        },
      },
    ],
    faqs: [
      {
        question: 'Sau khi đá banh uống bia có làm mất cơ không?',
        answer: 'Rượu bia ức chế trực tiếp con đường tín hiệu mTOR (ngăn chặn tổng hợp protein cơ bắp tới 37%), đồng thời làm cơ thể mất nước trầm trọng hơn do tác dụng lợi tiểu. Nếu có liên hoan sau trận, hãy ưu tiên uống nước lọc, trà đá hoặc Pepsi Zero; hạn chế bia rượu tối đa.',
      },
    ],
    references: [
      {
        title: 'Nutrition for Football: A practical guide',
        source: 'FIFA Medical Assessment and Research Centre (F-MARC)',
        year: 2018,
      },
      {
        title: 'Carbohydrate nutrition for football: strategies to maximize performance',
        source: 'Journal of Sports Sciences',
        year: 2014,
      },
    ],
  },
];

/**
 * Accessor helper functions
 */
export function getAllArticles(): NutritionArticle[] {
  return ARTICLES_DATA;
}

export function getArticleBySlug(slug: string): NutritionArticle | undefined {
  return ARTICLES_DATA.find(a => a.slug === slug);
}
