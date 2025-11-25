export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado";

export interface Book {
  id: string;
  titulo: string;
  genero?: string;
  tipo: TipoLivro;
  estado: EstadoLivro;
  imagem?: string;
  descricao?: string;
  usuarioId?: string;
}