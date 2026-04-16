import Link from "next/link";
import {
  TrendingUp,
  PieChart,
  Shield,
  Download,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TrendingUp,
    title: "Dashboard Completo",
    description:
      "Visualize receitas, despesas e saldo em tempo real com cards de resumo e gráficos interativos.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: PieChart,
    title: "Gráficos por Categoria",
    description:
      "Entenda para onde vai seu dinheiro com gráficos de pizza detalhados por categoria de gasto.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Seguro & Privado",
    description:
      "Seus dados ficam protegidos com autenticação segura e isolamento completo entre usuários.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Download,
    title: "Exportar CSV",
    description:
      "Exporte suas transações filtradas para planilhas com um único clique.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

const benefits = [
  "Registre receitas e despesas em segundos",
  "9 categorias pré-definidas para organização rápida",
  "Filtros por mês, categoria e busca por descrição",
  "Interface responsiva para celular e desktop",
  "Dados sincronizados em tempo real",
  "100% gratuito para começar",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">FinançaApp</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Criar conta grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          Controle financeiro pessoal simplificado
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          Seu dinheiro,{" "}
          <span className="text-primary">sob controle</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Registre receitas e despesas, acompanhe seu saldo em tempo real e
          visualize para onde vai cada centavo — tudo em um dashboard moderno e
          intuitivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
              Começar gratuitamente
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
              Já tenho uma conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-xs text-green-700 font-medium mb-1">Receitas</p>
              <p className="text-2xl font-bold text-green-700">R$ 8.450,00</p>
              <p className="text-xs text-green-600 mt-1">+12% este mês</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-xs text-red-700 font-medium mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-700">R$ 5.230,00</p>
              <p className="text-xs text-red-600 mt-1">-3% este mês</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-700 font-medium mb-1">Saldo</p>
              <p className="text-2xl font-bold text-blue-700">R$ 3.220,00</p>
              <p className="text-xs text-blue-600 mt-1">Positivo</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { desc: "Salário mensal", cat: "Salário", val: "+ R$ 6.000,00", type: "income" },
              { desc: "Aluguel", cat: "Moradia", val: "- R$ 1.800,00", type: "expense" },
              { desc: "Supermercado", cat: "Alimentação", val: "- R$ 620,00", type: "expense" },
              { desc: "Freelance design", cat: "Freelance", val: "+ R$ 2.450,00", type: "income" },
            ].map((item) => (
              <div key={item.desc} className="flex items-center justify-between bg-background rounded-lg px-4 py-3 border border-border">
                <div>
                  <p className="text-sm font-medium">{item.desc}</p>
                  <p className="text-xs text-muted-foreground">{item.cat}</p>
                </div>
                <span className={`text-sm font-semibold ${item.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Tudo que você precisa para organizar suas finanças
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ferramentas simples e poderosas para você ter total controle sobre seu dinheiro.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Por que usar o FinançaApp?
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Desenvolvido para pessoas que querem sair do caos financeiro e ter
                clareza sobre suas finanças pessoais, sem complicação.
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-1">Crie sua conta grátis</h3>
                <p className="text-sm text-muted-foreground">Comece em menos de 1 minuto</p>
              </div>
              <Link href="/register" className="block">
                <Button className="w-full h-11 text-base gap-2">
                  Criar conta grátis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">FinançaApp</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 FinançaApp. Controle suas finanças com simplicidade.
          </p>
        </div>
      </footer>
    </div>
  );
}
