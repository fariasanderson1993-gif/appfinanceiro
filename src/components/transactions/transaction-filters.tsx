"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, MONTHS, YEARS } from "@/lib/constants";
import { TransactionFilters } from "@/lib/types";

interface FiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersBar({ filters, onChange }: FiltersProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  function reset() {
    onChange({
      month: currentMonth,
      year: currentYear,
      category: "all",
      type: "all",
      search: "",
    });
  }

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar transação..."
          className="pl-9 h-9"
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      {/* Month */}
      <Select
        value={String(filters.month ?? currentMonth)}
        onValueChange={(v) => onChange({ ...filters, month: Number(v) })}
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

      {/* Year */}
      <Select
        value={String(filters.year ?? currentYear)}
        onValueChange={(v) => onChange({ ...filters, year: Number(v) })}
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

      {/* Type */}
      <Select
        value={filters.type ?? "all"}
        onValueChange={(v) =>
          onChange({ ...filters, type: v as TransactionFilters["type"] })
        }
      >
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filters.category ?? "all"}
        onValueChange={(v) => onChange({ ...filters, category: v ?? "all" })}
      >
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {ALL_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-9 px-3" onClick={reset}>
          <X className="w-4 h-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
}
