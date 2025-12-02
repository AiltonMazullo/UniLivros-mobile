import api from "./api";

export type UserSummary = {
  id: number;
  nome: string;
  email?: string;
  seguidores?: number;
  seguindo?: number;
  avaliacoes?: number;
  avatarUrl?: string;
  livrosTrocados?: number;
};

export const UsersService = {
  async list(query?: string): Promise<UserSummary[]> {
    if (query && query.trim().length > 0) {
      const { data } = await api.get<UserSummary[]>("/usuarios/buscar", {
        params: { termo: query },
      });
      return data;
    }
    const { data } = await api.get<UserSummary[]>("/usuarios");
    return data;
  },

  async getById(id: number): Promise<UserSummary | null> {
    const { data } = await api.get<UserSummary>(`/usuarios/${id}`);
    return data;
  },
};
