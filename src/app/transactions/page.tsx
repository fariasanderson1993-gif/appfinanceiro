"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionFilters } from "@/lib/types";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { ExportCSV } from "@/components/transactions/export-csv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const now = new Date();

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    category: "all",
    type: "all",
    search: "",
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const startDate = `${filters.year}-${String(filters.month).padStart(2, "0")}-01`;
    const endDate = new Date(filters.year!, filters.month!, 0);
    const endDateStr = format(endDate, "yyyy-MM-dd");

    let query = supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDateStr)
      .order("date", { ascending: false });

    if (filters.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }

    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  }, [filters.month, filters.year, filters.type, filters.category]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Client-side search filter
  const filtered = filters.search
    ? transactions.filter((t) =>
        t.description.toLowerCase().includes(filters.search!.toLowerCase())
      )
    : transactions;

  // Stats
  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  function handleEdit(t: Transaction) {
    setEditingTransaction(t);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingTransaction(null);
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gerencie todas as suas movimentações financeiras
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportCSV transactions={filtered} />
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

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="text-xs px-3 py-1 h-7">
          {filtered.length} transação{filtered.length !== 1 ? "ões" : ""}
        </Badge>
        <Badge className="text-xs px-3 py-1 h-7 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          Receitas: {formatCurrency(totalIncome)}
        </Badge>
        <Badge className="text-xs px-3 py-1 h-7 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
          Despesas: {formatCurrency(totalExpense)}
        </Badge>
      </div>

      {/* Filters */}
      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {/* Transaction list */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Transações
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-3.5 flex items-center gap-4">
                  <Skeleton className="w-2.5 h-2.5 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <TransactionList
              transactions={filtered}
              onEdit={handleEdit}
              onDeleted={fetchTransactions}
            />
          )}
        </CardContent>
      </Card>

      {/* Form */}
      <TransactionForm
        open={showForm}
        onClose={handleCloseForm}
        onSuccess={fetchTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
}
