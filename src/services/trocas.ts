import api from "./api";

export type TrocaStatus = "pendente" | "confirmada" | "concluida" | "cancelada";

export interface Troca {
  id: string;
  status?: TrocaStatus;
  livro1Titulo?: string;
  livro2Titulo?: string;
  livro1Imagem?: string;
  livro2Imagem?: string;
  livro1Isbn?: string;
  livro2Isbn?: string;
  livro1Id?: string;
  livro2Id?: string;
  usuario1Id?: string;
  usuario2Id?: string;
  usuario1Nome?: string;
  usuario2Nome?: string;
  usuario1Email?: string;
  usuario2Email?: string;
  dataAgendada?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropostaDTO {
  id: string | number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  dataResposta?: string;
  proponenteId?: string | number;
  proponenteNome?: string;
  proponenteEmail?: string;
  propostoId?: string | number;
  propostoNome?: string;
  propostoEmail?: string;
  livros?: any[];
  agendamento?: any;
}

function normalizeProposta(raw: unknown): Troca {
  const p = raw as PropostaDTO;
  const livros = Array.isArray(p.livros) ? p.livros : [];

  // Algumas APIs retornam o livro aninhado em chaves diferentes.
  const pickLivro = (item: any) => {
    const nested =
      item?.livro ??
      item?.book ??
      item?.livroProponente ??
      item?.livroProposto ??
      item?.produto ??
      undefined;
    return nested ?? item ?? {};
  };

  const l1Src = pickLivro(livros[0] ?? {});
  const l2Src = pickLivro(livros[1] ?? {});

  const livro1Titulo = l1Src?.titulo ?? l1Src?.nome ?? undefined;
  const livro2Titulo = l2Src?.titulo ?? l2Src?.nome ?? undefined;
  const livro1Id =
    l1Src?.id != null ? String(l1Src.id) : itemIdFallback(livros[0]);
  const livro2Id =
    l2Src?.id != null ? String(l2Src.id) : itemIdFallback(livros[1]);
  const livro1Imagem =
    l1Src?.imagem ??
    l1Src?.image ??
    l1Src?.capa ??
    l1Src?.thumbnail ??
    undefined;
  const livro2Imagem =
    l2Src?.imagem ??
    l2Src?.image ??
    l2Src?.capa ??
    l2Src?.thumbnail ??
    undefined;

  const livro1Isbn = extractIsbn(l1Src);
  const livro2Isbn = extractIsbn(l2Src);

  const ag = p.agendamento as any;
  const dataAgendada =
    typeof ag === "string" ? ag : ag?.data ?? ag?.dataAgendada ?? undefined;

  return {
    id: String(p.id),
    status: (p.status ?? undefined) as TrocaStatus,
    livro1Titulo,
    livro2Titulo,
    livro1Imagem,
    livro2Imagem,
    livro1Isbn,
    livro2Isbn,
    livro1Id,
    livro2Id,
    usuario1Id: p.proponenteId != null ? String(p.proponenteId) : undefined,
    usuario2Id: p.propostoId != null ? String(p.propostoId) : undefined,
    usuario1Nome: p.proponenteNome ?? undefined,
    usuario2Nome: p.propostoNome ?? undefined,
    usuario1Email: p.proponenteEmail ?? undefined,
    usuario2Email: p.propostoEmail ?? undefined,
    dataAgendada,
    createdAt: p.createdAt ?? undefined,
    updatedAt: p.updatedAt ?? undefined,
  };
}

function itemIdFallback(item: any): string | undefined {
  if (!item) return undefined;
  const id = item?.livroId ?? item?.bookId ?? item?.produtoId ?? item?.id;
  return id != null ? String(id) : undefined;
}

function extractIsbn(src: any): string | undefined {
  if (!src) return undefined;
  const direct = src?.isbn13 ?? src?.isbn_13 ?? src?.isbn ?? src?.codigoIsbn;
  if (direct) return String(direct);
  // Alguns payloads podem ter industryIdentifiers similar ao Google Books
  const identifiers: Array<{ type?: string; identifier?: string }> =
    src?.industryIdentifiers ?? src?.identificadores ?? [];
  if (Array.isArray(identifiers)) {
    const isbn13 = identifiers.find(
      (i) => (i?.type ?? "").toUpperCase() === "ISBN_13"
    )?.identifier;
    if (isbn13) return String(isbn13);
    const isbn10 = identifiers.find(
      (i) => (i?.type ?? "").toUpperCase() === "ISBN_10"
    )?.identifier;
    if (isbn10) return String(isbn10);
  }
  return undefined;
}

export const TrocasService = {
  async listRecebidas(): Promise<Troca[]> {
    const { data } = await api.get<PropostaDTO[]>("/propostas/recebidas");
    const items: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];
    return items.map(normalizeProposta);
  },

  async listEnviadas(): Promise<Troca[]> {
    const { data } = await api.get<PropostaDTO[]>("/propostas/enviadas");
    const items: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];
    return items.map(normalizeProposta);
  },

  async confirmar(propostaId: string): Promise<Troca> {
    const { data } = await api.post<PropostaDTO>(
      `/propostas/${propostaId}/aceitar`
    );
    return normalizeProposta(data);
  },

  async cancelar(propostaId: string): Promise<Troca> {
    const { data } = await api.post<PropostaDTO>(
      `/propostas/${propostaId}/rejeitar`
    );
    return normalizeProposta(data);
  },
};
