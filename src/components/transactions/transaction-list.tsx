"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Transaction } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDeleted: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function TransactionList({
  transactions,
  onEdit,
  onDeleted,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir transação");
    } else {
      toast.success("Transação excluída");
      onDeleted();
    }
    setDeletingId(null);
    setConfirmId(null);
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">Ajuste os filtros ou adicione uma nova transação</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {transactions.map((t) => {
          const isIncome = t.type === "income";
          const color = CATEGORY_COLORS[t.category] ?? "#6b7280";

          return (
            <div
              key={t.id}
              className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors group"
            >
              {/* Color dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(t.date + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })}
                  </span>
                  <Badge variant="secondary" className="text-xs py-0 px-1.5 h-4">
                    {t.category}
                  </Badge>
                </div>
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-semibold tabular-nums flex-shrink-0 ${
                  isIncome ? "text-green-600" : "text-red-600"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(t.amount)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(t)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmId(t.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Excluir"
                  disabled={deletingId === t.id}
                >
                  {deletingId === t.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm delete dialog */}
      <AlertDialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => confirmId && handleDelete(confirmId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
