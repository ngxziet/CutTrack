"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { name: "Nhật ký", href: "/diary", icon: UtensilsCrossed },
  { name: "Thực đơn", href: "/meal-planner", icon: CalendarDays },
  { name: "Món ăn", href: "/foods", icon: BookOpen },
  { name: "Bài tập", href: "/exercises", icon: Dumbbell },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-card/90 backdrop-blur-lg border-t border-border z-40 px-2 flex items-center justify-around">
      {mobileItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 px-1 text-[11px] font-medium transition-colors",
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 mb-0.5 transition-transform",
                isActive ? "scale-110 text-primary" : "text-muted-foreground"
              )}
            />
            <span className="truncate max-w-[64px]">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
