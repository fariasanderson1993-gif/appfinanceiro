import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Transaction } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Últimas transações
        </p>
        <Link
          href="/transactions"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma transação este mês
        </p>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const isIncome = t.type === "income";
            const color = CATEGORY_COLORS[t.category] ?? "#6b7280";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(t.date + "T12:00:00"), "dd MMM", { locale: ptBR })}
                    </span>
                    <Badge variant="secondary" className="text-xs py-0 px-1 h-3.5">
                      {t.category}
                    </Badge>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums flex-shrink-0 ${
                    isIncome ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
