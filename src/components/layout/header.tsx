"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="capitalize font-medium text-foreground">{todayStr}</span>
        <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
          Chế độ 2 bữa / ngày
        </span>
      </div>

      <div className="flex items-center gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Chuyển chế độ sáng/tối"
            className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        )}
      </div>
    </header>
  );
}
