import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CutTrack - Quản Lý Ăn Uống & Tập Luyện",
    short_name: "CutTrack",
    description: "Ứng dụng theo dõi thâm hụt calo, ngân sách ăn uống và bài tập chuyển động 3D.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
