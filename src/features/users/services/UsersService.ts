
export type UserSummary = {
  id: number;
  nome: string;
  seguidores?: number;
  seguindo?: number;
  avaliacoes?: number;
  avatarUrl?: string;
  // Campo opcional usado na UI de perfil; não existe no backend por enquanto
  // e pode ser derivado de /trocas/contar quando integrarmos.
  livrosTrocados?: number;
};

export const UsersService = {
  async list(query?: string): Promise<UserSummary[]> {
    // TODO: substituir por chamada real à API quando disponível
    // const { data } = await api.get("/usuarios", { params: { q: query } });
    // return data;
    const mock: UserSummary[] = [
      { id: 1, nome: "Lucas Andrade", seguidores: 234, seguindo: 15, avaliacoes: 4.9, livrosTrocados: 12 },
      { id: 2, nome: "Jonatas Lopes", seguidores: 100, seguindo: 6, avaliacoes: 4.8, livrosTrocados: 8 },
      { id: 3, nome: "Ana Paula", seguidores: 87, seguindo: 12, avaliacoes: 4.6, livrosTrocados: 5 },
    ];
    if (!query) return mock;
    return mock.filter((u) => u.nome.toLowerCase().includes(query.toLowerCase()));
  },

  async getById(id: number): Promise<UserSummary | null> {
    // const { data } = await api.get(`/usuarios/${id}`);
    // return data;
    const list = await this.list();
    return list.find((u) => u.id === id) || null;
  },
};
