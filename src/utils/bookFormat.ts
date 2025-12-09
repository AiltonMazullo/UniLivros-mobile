export function formatEstado(value?: string | null): string {
  if (!value) return "não especificado";
  const key = String(value).trim().toUpperCase();
  const map: Record<string, string> = {
    NOVO: "Novo",
    SEMINOVO: "Seminovo",
    USADO: "Usado",
    USADO_BOM: "Usado (bom)",
    USADO_OTIMO: "Usado (ótimo)",
    USADO_RUIM: "Usado (ruim)",
    USADO_REGULAR: "Usado (regular)",
  };
  return map[key] ?? "não especificado";
}

export function formatTipo(value?: string | null): string {
  if (!value) return "não especificado";
  const key = String(value).trim().toUpperCase();
  const map: Record<string, string> = {
    TROCA: "Troca",
    VENDA: "Venda",
    EMPRESTIMO: "Empréstimo",
  };
  return map[key] ?? "não especificado";
}
