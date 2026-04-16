"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { Transaction, TransactionFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
}

const defaultForm: TransactionFormData = {
  description: "",
  amount: "",
  type: "expense",
  category: "",
  date: format(new Date(), "yyyy-MM-dd"),
};

export function TransactionForm({
  open,
  onClose,
  onSuccess,
  transaction,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormData>(defaultForm);
  const [loading, setLoading] = useState(false);

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: String(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
      });
    } else {
      setForm(defaultForm);
    }
  }, [transaction, open]);

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(val: string) {
    setForm((prev) => ({ ...prev, type: val as "income" | "expense", category: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) {
      toast.error("Selecione uma categoria");
      return;
    }

    const amount = parseFloat(form.amount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast.error("Valor inválido");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      description: form.description.trim(),
      amount,
      type: form.type,
      category: form.category,
      date: form.date,
    };

    let error;
    if (isEditing && transaction) {
      ({ error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", transaction.id));
    } else {
      ({ error } = await supabase.from("transactions").insert(payload));
    }

    if (error) {
      toast.error("Erro ao salvar transação", { description: error.message });
    } else {
      toast.success(
        isEditing ? "Transação atualizada!" : "Transação criada!"
      );
      onSuccess();
      onClose();
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.type === "income"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-background border-border text-muted-foreground hover:border-green-600 hover:text-green-600"
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.type === "expense"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-background border-border text-muted-foreground hover:border-red-600 hover:text-red-600"
              }`}
            >
              Despesa
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Aluguel, Supermercado..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
              className="h-10"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label>Valor (R$)</Label>
            <Input
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              required
              inputMode="decimal"
              className="h-10"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((p) => ({ ...p, category: v ?? "" }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
              className="h-10"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
