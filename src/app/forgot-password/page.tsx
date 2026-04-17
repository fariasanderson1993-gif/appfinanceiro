"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Erro ao enviar e-mail", {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">FinanSee</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enviaremos um link para redefinir sua senha
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em breve.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar para o login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
