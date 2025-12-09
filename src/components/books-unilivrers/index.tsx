import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { formatEstado, formatTipo } from "../../utils/bookFormat";
import { BooksService } from "../../services/books";
import { Book } from "../../types/book";
import { useAuth } from "../../context/AuthContext";
import { GoogleBooksService } from "../../services/googleBooks";
import { useFocusEffect } from "@react-navigation/native";
import { UsersService, UserSummary } from "../../services/UsersService";

export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado";

export function BooksUnilivrers() {
  const router = useRouter();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [owners, setOwners] = useState<Record<string, UserSummary | null>>({});
  const [ownersByBookId, setOwnersByBookId] = useState<
    Record<string, UserSummary | null>
  >({});

  const fetchBooks = useCallback(() => {
    BooksService.getAll()
      .then((all) => {
        const booksFromOthers = all.filter((b) => {
          if (!user?.id) return true;
          return String(b.usuarioId) !== String(user.id);
        });
        setBooks(booksFromOthers);
        (async () => {
          const missing = booksFromOthers.filter((b) => !b.imagem && b.titulo);
          if (missing.length === 0) return;
          try {
            const targets = missing;
            const updates = await Promise.all(
              targets.map(async (b) => {
                const res = await GoogleBooksService.search(b.titulo);
                const best = res[0];
                return best?.imagem
                  ? {
                      id: b.id,
                      imagem: best.imagem,
                      genero: best.genero,
                      descricao: best.descricao,
                    }
                  : null;
              })
            );
            const byId: Record<string, Partial<Book>> = {};
            updates.filter(Boolean).forEach((u) => {
              if (u) byId[String(u.id!)] = u;
            });
            setBooks((prev) =>
              prev.map((b) =>
                byId[String(b.id)] ? { ...b, ...byId[String(b.id)] } : b
              )
            );
          } catch {}
        })();
      })
      .catch(() => setBooks([]));
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Carrega dados dos donos dos livros exibidos
  useEffect(() => {
    (async () => {
      // 1) Para livros com usuarioId, buscamos o usuário diretamente
      const ownerIds = Array.from(
        new Set(
          books
            .map((b) => (b.usuarioId != null ? String(b.usuarioId) : null))
            .filter((v): v is string => !!v)
        )
      );
      const missingOwnerIds = ownerIds.filter((id) => owners[id] === undefined);
      if (missingOwnerIds.length > 0) {
        try {
          const results = await Promise.all(
            missingOwnerIds.map(async (id) => {
              const data = await UsersService.getById(Number(id));
              return { id, user: data ?? null } as {
                id: string;
                user: UserSummary | null;
              };
            })
          );
          setOwners((prev) => {
            const next = { ...prev };
            results.forEach(({ id, user }) => {
              next[id] = user;
            });
            return next;
          });
          // Preenche também ownersByBookId para livros que possuem usuarioId
          setOwnersByBookId((prev) => {
            const next = { ...prev };
            books.forEach((b) => {
              const uid = b.usuarioId != null ? String(b.usuarioId) : null;
              if (uid && owners[uid] && next[String(b.id)] === undefined) {
                next[String(b.id)] = owners[uid] ?? null;
              }
            });
            return next;
          });
        } catch {}
      }

      // 2) Para livros sem usuarioId, buscamos via /livros/{id}/usuarios
      const booksMissingOwner = books.filter(
        (b) => !b.usuarioId && ownersByBookId[String(b.id)] === undefined
      );
      if (booksMissingOwner.length > 0) {
        try {
          const results = await Promise.all(
            booksMissingOwner.map(async (b) => {
              const users = await UsersService.getByLivroId(String(b.id));
              const owner =
                Array.isArray(users) && users.length > 0 ? users[0] : null;
              return { bookId: String(b.id), owner } as {
                bookId: string;
                owner: UserSummary | null;
              };
            })
          );
          setOwnersByBookId((prev) => {
            const next = { ...prev };
            results.forEach(({ bookId, owner }) => {
              next[bookId] = owner;
            });
            return next;
          });
        } catch {}
      }
    })();
  }, [books, owners, ownersByBookId]);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      return () => {};
    }, [fetchBooks])
  );

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center gap-6 mt-8">
        {books.map((livro) => (
          <View
            key={livro.id}
            className="w-[290px] h-[128px] bg-[#5A211A] rounded-xl p-4 flex-row"
          >
            <View className="w-[72px] h-[90px] rounded-lg overflow-hidden mr-4 bg-[#3B1E18]">
              <Image
                source={
                  livro.imagem
                    ? { uri: livro.imagem }
                    : require("../../../assets/logo.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 h-full justify-between items-start">
              <View>
                <Text
                  className="text-base font-bold text-[#FFFFFF]"
                  numberOfLines={1}
                >
                  {livro.titulo}
                </Text>
                <Text className="text-xs text-[#FFFFFF] mt-0">
                  Tipo: {formatTipo(livro.tipo as any)}
                  {"\n"}Estado: {formatEstado(livro.estado as any)}
                  {"\n"}Usuário:{" "}
                  <Text className="text-[#F29F05]">
                    {ownersByBookId[String(livro.id)]?.nome ??
                      owners[String(livro.usuarioId ?? "")]?.nome ??
                      "não informado"}
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-start gap-6 w-full h-1/2">
                <Pressable
                  className="bg-[#F29F05] rounded-full px-4 self-center"
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/description-book",
                      params: {
                        id: String(livro.id),
                        titulo: livro.titulo,
                        imagem: livro.imagem ?? "",
                      },
                    })
                  }
                >
                  <Text
                    className="text-[#FFFFFF] text-base text-center font-semibold"
                    style={{ fontSize: 10 }}
                  >
                    Descrição
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
