export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
] as const;

export const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
] as const;

export const ALL_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#f97316",
  Transporte: "#3b82f6",
  Moradia: "#8b5cf6",
  Lazer: "#ec4899",
  Saúde: "#10b981",
  Educação: "#06b6d4",
  Salário: "#22c55e",
  Freelance: "#84cc16",
  Investimentos: "#eab308",
  Outros: "#6b7280",
};

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
