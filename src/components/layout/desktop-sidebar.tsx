"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  CalendarDays,
  Wallet,
  Dumbbell,
  ClipboardList,
  TrendingUp,
  GraduationCap,
  Settings,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationGroup {
  title: string;
  badge?: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "Theo Dõi Hằng Ngày",
    items: [
      { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
      { name: "Nhật ký & Lịch sử", href: "/diary", icon: UtensilsCrossed, badge: "2 Bữa" },
      { name: "Thực đơn 7 ngày", href: "/meal-planner", icon: CalendarDays },
      { name: "Ghi nhận buổi tập", href: "/workouts", icon: ClipboardList },
    ],
  },
  {
    title: "Thư Viện & Cấu Hình",
    badge: "Mới",
    items: [
      { name: "Thư viện món ăn", href: "/foods", icon: BookOpen, badge: "15 món" },
      { name: "Thư viện bài tập & Cấu hình", href: "/exercises", icon: Dumbbell, badge: "60 FPS" },
    ],
  },
  {
    title: "Chỉ Số & Ngân Sách",
    items: [
      { name: "Ngân sách chi tiêu", href: "/budget", icon: Wallet, badge: "70k-80k" },
      { name: "Tiến độ cơ thể", href: "/progress", icon: TrendingUp },
    ],
  },
  {
    title: "Hệ Thống & Tri Thức",
    items: [
      { name: "Kiến thức khoa học", href: "/learn", icon: GraduationCap },
      { name: "Cài đặt & An toàn", href: "/settings", icon: Settings },
    ],
  },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-card/60 backdrop-blur-md z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Flame className="w-5 h-5 fill-primary text-primary" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            CutTrack
          </span>
          <span className="block text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            Smart Cut & Fit
          </span>
        </div>
      </div>

      {/* Grouped Navigation items */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 pb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              <span>{group.title}</span>
              {group.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {group.badge}
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Target status snippet */}
      <div className="p-3.5 m-3 rounded-xl bg-secondary/50 border border-border text-xs space-y-1.5">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Mục tiêu</span>
          <span className="font-semibold text-foreground">68kg → 62kg</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Ngân sách</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">70k - 80k/ngày</span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 mt-1 overflow-hidden">
          <div className="bg-primary h-full w-[25%]" />
        </div>
      </div>
    </aside>
  );
}
