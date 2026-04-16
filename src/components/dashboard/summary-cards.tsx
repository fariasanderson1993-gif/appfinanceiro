import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSummary } from "@/lib/types";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { totalIncome, totalExpense, balance } = summary;

  const cards = [
    {
      title: "Receitas",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      valueColor: "text-green-700",
    },
    {
      title: "Despesas",
      value: totalExpense,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      valueColor: "text-red-700",
    },
    {
      title: "Saldo",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-blue-600" : "text-orange-600",
      bg: balance >= 0 ? "bg-blue-50" : "bg-orange-50",
      border: balance >= 0 ? "border-blue-100" : "border-orange-100",
      valueColor: balance >= 0 ? "text-blue-700" : "text-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`border ${card.border}`}>
          <CardContent className={`pt-5 pb-5 ${card.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${card.color}`}>{card.title}</p>
              <div className={`w-8 h-8 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.valueColor} tabular-nums`}>
              {formatCurrency(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
