"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CategoryData } from "@/lib/types";

interface CategoryChartProps {
  data: CategoryData[];
  title: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: CategoryData }> }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
}

export function CategoryChart({ data, title }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-4">
        {title}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
