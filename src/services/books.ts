import api from "./api";
import { Book, TipoLivro, EstadoLivro } from "../types/book";

function normalizeBook(b: any): Book {
  const usuarioId =
    b?.usuarioId ?? b?.usuario_id ?? b?.usuario?.id ?? b?.userId;
  return {
    id: String(b?.id ?? b?._id ?? ""),
    titulo: String(b?.titulo ?? b?.nome ?? b?.title ?? ""),
    genero: b?.genero ?? b?.category ?? undefined,
    tipo: (b?.tipo ?? "troca") as TipoLivro,
    estado: (b?.estado ?? "usado") as EstadoLivro,
    imagem: b?.imagem ?? b?.image ?? b?.capa ?? undefined,
    descricao: b?.descricao ?? b?.description ?? undefined,
    usuarioId: usuarioId != null ? String(usuarioId) : undefined,
  };
}

export const BooksService = {
  async getAll(): Promise<Book[]> {
    const res = await api.get(`/livros`);
    const data = res.data as any;
    const items: any[] = Array.isArray(data)
      ? data
      : data?.livros ?? data?.items ?? data?.data ?? [];
    return items.map(normalizeBook);
  },
  async getByUsuarioId(usuarioId: string): Promise<Book[]> {
    const tryEndpoints = [
      `/usuarios/${usuarioId}/livros`,
      `/livros/usuario/${usuarioId}`,
      { path: `/livros`, params: { usuarioId } },
    ] as const;

    // Tenta múltiplos formatos de endpoint até obter uma lista
    for (const ep of tryEndpoints) {
      try {
        const res =
          typeof ep === "string"
            ? await api.get(ep)
            : await api.get(ep.path, { params: ep.params });
        const data = res.data as any;
        const items: any[] = Array.isArray(data)
          ? data
          : data?.livros ?? data?.items ?? data?.data ?? [];
        if (Array.isArray(items) && items.length >= 0) {
          return items.map(normalizeBook).filter((b) => b.usuarioId);
        }
      } catch {
        // tenta próximo endpoint
      }
    }

    // Fallback: obtém todos e filtra localmente
    const all = await BooksService.getAll();
    return all.filter((b) => String(b.usuarioId) === String(usuarioId));
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
