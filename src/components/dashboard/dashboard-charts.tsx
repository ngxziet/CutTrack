"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WeightEntry } from "@/lib/store/cuttrack-store";

interface DashboardChartsProps {
  measurements: WeightEntry[];
}

export function DashboardCharts({ measurements }: DashboardChartsProps) {
  const chartData = measurements.map((m) => ({
    date: m.date.slice(5), // MM-DD
    cânNặng: m.weightKg,
    vòngEo: m.waistCm || 81.5,
    mụcTiêu: 62.0,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="waistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
          <YAxis
            domain={[60, 85]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="vòngEo"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#waistGrad)"
            name="Vòng eo (cm)"
          />
          <Area
            type="monotone"
            dataKey="cânNặng"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#weightGrad)"
            name="Cân nặng (kg)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
