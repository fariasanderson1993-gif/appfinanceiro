"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";

interface ExportCSVProps {
  transactions: Transaction[];
}

export function ExportCSV({ transactions }: ExportCSVProps) {
  function exportToCSV() {
    if (transactions.length === 0) return;

    const headers = ["Data", "Descrição", "Tipo", "Categoria", "Valor"];
    const rows = transactions.map((t) => [
      format(new Date(t.date + "T12:00:00"), "dd/MM/yyyy"),
      `"${t.description.replace(/"/g, '""')}"`,
      t.type === "income" ? "Receita" : "Despesa",
      t.category,
      t.amount.toFixed(2).replace(".", ","),
    ]);

    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `transacoes_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={transactions.length === 0}
      className="gap-2 h-9"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Exportar CSV</span>
      <span className="sm:hidden">CSV</span>
    </Button>
  );
}
