import api from "./api";
import { Book, TipoLivro, EstadoLivro } from "../types/book";

// Helpers de normalização e extração
function resolveUsuarioId(raw: any): string | undefined {
  const id =
    raw?.usuarioId ?? raw?.usuario_id ?? raw?.usuario?.id ?? raw?.userId;
  return id != null ? String(id) : undefined;
}

function extractList(payload: unknown): any[] {
  const data = payload as any;
  const items = Array.isArray(data)
    ? data
    : data?.livros ?? data?.items ?? data?.data ?? [];
  return Array.isArray(items) ? items : [];
}

function normalizeBook(raw: unknown): Book {
  const b = raw as any;
  return {
    id: String(b?.id ?? b?._id ?? ""),
    titulo: String(b?.titulo ?? b?.nome ?? b?.title ?? ""),
    genero: b?.genero ?? b?.category ?? undefined,
    tipo: (b?.tipo ?? b?.tipoLivro ?? undefined) as TipoLivro | undefined,
    estado: (b?.estado ?? b?.condicao ?? undefined) as EstadoLivro | undefined,
    imagem: b?.imagem ?? b?.image ?? b?.capa ?? undefined,
    descricao: b?.descricao ?? b?.description ?? undefined,
    usuarioId: resolveUsuarioId(b),
  };
}

export const BooksService = {
  async getMine(): Promise<Book[]> {
    // Lista livros do usuário autenticado (JWT obrigatório)
    const res = await api.get(`/livros/meus-livros`);
    const items = extractList(res.data);
    return items.map(normalizeBook);
  },
  async getAll(): Promise<Book[]> {
    const res = await api.get(`/livros`);
    const items = extractList(res.data);
    return items.map(normalizeBook);
  },
  async getByUsuarioId(usuarioId: string): Promise<Book[]> {
    // Usa a rota oficial: GET /api/usuarios/{id}/livros (JWT obrigatório)
    const res = await api.get(`/usuarios/${usuarioId}/livros`);
    const items = extractList(res.data);
    // Normaliza e injeta o usuarioId da rota, pois o DTO não carrega o dono
    return items.map((raw) => {
      const book = normalizeBook(raw);
      return { ...book, usuarioId: String(usuarioId) } as Book;
    });
  },
  async create(data: Partial<Book> & { titulo: string }): Promise<Book> {
    const res = await api.post(`/livros`, data);
    return normalizeBook(res.data);
  },

  async getById(id: string): Promise<Book> {
    const res = await api.get(`/livros/${id}`);
    return normalizeBook(res.data);
  },

  async search(termo: string): Promise<Book[]> {
    const res = await api.get(`/livros/buscar`, { params: { termo } });
    const data = res.data as any;
    const items: any[] = Array.isArray(data)
      ? data
      : data?.livros ?? data?.items ?? data?.data ?? [];
    return items.map(normalizeBook);
  },

  async getByGenero(genero: string): Promise<Book[]> {
    const res = await api.get(`/livros/genero`, { params: { genero } });
    const data = res.data as any;
    const items: any[] = Array.isArray(data)
      ? data
      : data?.livros ?? data?.items ?? data?.data ?? [];
    return items.map(normalizeBook);
  },

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const res = await api.put(`/livros/${id}`, data);
    return normalizeBook(res.data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/livros/${id}`);
  },
};
