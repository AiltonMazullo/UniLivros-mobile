import api from "./api";
import { Book } from "../types/book";

export const BooksService = {
  async create(data: Partial<Book> & { titulo: string }): Promise<Book> {
    const res = await api.post<Book>(`/livros`, data);
    return res.data;
  },

  async getById(id: string): Promise<Book> {
    const res = await api.get<Book>(`/livros/${id}`);
    return res.data;
  },

  async search(termo: string): Promise<Book[]> {
    const res = await api.get<Book[]>(`/livros/buscar`, { params: { termo } });
    return res.data;
  },

  async getByGenero(genero: string): Promise<Book[]> {
    const res = await api.get<Book[]>(`/livros/genero`, { params: { genero } });
    return res.data;
  },

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const res = await api.put<Book>(`/livros/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/livros/${id}`);
  },
};