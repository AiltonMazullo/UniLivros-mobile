export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado" | "usado_bom" | "usado_otimo" | "usado_ruim" | "usado_regular";
export interface Book {
  id: string;
  titulo: string;
  genero?: string;
  tipo?: TipoLivro;
  estado?: EstadoLivro;
  imagem?: string;
  descricao?: string;
  usuarioId?: string;
}
