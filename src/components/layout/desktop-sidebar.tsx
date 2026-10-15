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

const navigationItems = [
  { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { name: "Nhật ký ăn uống", href: "/diary", icon: UtensilsCrossed },
  { name: "Thư viện món ăn", href: "/foods", icon: BookOpen },
  { name: "Kế hoạch 7 ngày", href: "/meal-planner", icon: CalendarDays },
  { name: "Ngân sách (VND)", href: "/budget", icon: Wallet },
  { name: "Thư viện bài tập", href: "/exercises", icon: Dumbbell },
  { name: "Ghi chép tập luyện", href: "/workouts", icon: ClipboardList },
  { name: "Tiến độ cơ thể", href: "/progress", icon: TrendingUp },
  { name: "Kiến thức khoa học", href: "/learn", icon: GraduationCap },
  { name: "Cài đặt & Mục tiêu", href: "/settings", icon: Settings },
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

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Target status snippet */}
      <div className="p-4 m-3 rounded-xl bg-secondary/50 border border-border text-xs space-y-1.5">
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
