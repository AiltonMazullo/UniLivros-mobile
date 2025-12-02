import axios from "axios";

export type GoogleBookVolume = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
};

export type GoogleBookSummary = {
  titulo: string;
  genero?: string;
  imagem?: string;
  descricao?: string;
  autores?: string[];
  isbn13?: string;
};

function normalizeImage(url?: string): string | undefined {
  if (!url) return undefined;
  // Google retorna http; forçamos https para evitar bloqueio em web
  return url.replace(/^http:\/\//, "https://");
}

export const GoogleBooksService = {
  async search(query: string): Promise<GoogleBookSummary[]> {
    if (!query || query.trim().length === 0) return [];
    const { data } = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: { q: query, maxResults: 10 },
    });
    const items: GoogleBookVolume[] = data?.items || [];
    return items.map((v) => {
      const info = v.volumeInfo || {};
      const isbn13 = info.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier;
      const genero = info.categories?.[0];
      const imagem = normalizeImage(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail);
      return {
        titulo: info.title || "",
        genero,
        imagem,
        descricao: info.description,
        autores: info.authors,
        isbn13,
      } as GoogleBookSummary;
    });
  },

  async getByISBN(isbn: string): Promise<GoogleBookSummary | null> {
    if (!isbn || isbn.trim().length === 0) return null;
    const { data } = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: { q: `isbn:${isbn}`, maxResults: 1 },
    });
    const item: GoogleBookVolume | undefined = data?.items?.[0];
    if (!item) return null;
    const info = item.volumeInfo || {};
    const isbn13 = info.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier;
    const genero = info.categories?.[0];
    const imagem = normalizeImage(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail);
    return {
      titulo: info.title || "",
      genero,
      imagem,
      descricao: info.description,
      autores: info.authors,
      isbn13,
    };
  },
};

