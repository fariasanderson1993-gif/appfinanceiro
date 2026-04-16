"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Transaction, DashboardSummary, CategoryData } from "@/lib/types";
import { CATEGORY_COLORS, MONTHS, YEARS } from "@/lib/constants";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const endDateStr = format(endDate, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDateStr)
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  }, [month, year]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Compute summary
  const summary: DashboardSummary = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.totalIncome += t.amount;
      else acc.totalExpense += t.amount;
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  // Expense by category
  const expenseByCategory: CategoryData[] = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {})
  )
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] ?? "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);

  // Income by category
  const incomeByCategory: CategoryData[] = Object.entries(
    transactions
      .filter((t) => t.type === "income")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {})
  )
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] ?? "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);

  const recentTransactions = transactions.slice(0, 8);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Resumo financeiro de{" "}
            <span className="font-medium text-foreground">
              {MONTHS[month - 1]} {year}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Month selector */}
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year selector */}
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={fetchTransactions}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" className="h-9 gap-1.5" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova transação</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <SummaryCards summary={summary} />
      )}

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <CategoryChart data={expenseByCategory} title="Despesas" />
            )}
          </CardContent>
        </Card>

        {/* Income Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Receitas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <CategoryChart data={incomeByCategory} title="Receitas" />
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <RecentTransactions transactions={recentTransactions} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Form */}
      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
