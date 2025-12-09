import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { formatEstado, formatTipo } from "../../utils/bookFormat";
import { useRouter } from "expo-router";
import { BooksService } from "../../services/books";
import { Book } from "../../types/book";
import { useAuth } from "../../context/AuthContext";
import { GoogleBooksService } from "../../services/googleBooks";
import { useFocusEffect } from "@react-navigation/native";

export function MyBooks() {
  const router = useRouter();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = useCallback(() => {
    if (!user?.id) {
      setBooks([]);
      return;
    }
    BooksService.getMine()
      .then((mine) => {
        setBooks(mine);
        (async () => {
          const missing = mine.filter((b) => !b.imagem && b.titulo);
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
      .catch(() => {
        BooksService.getByUsuarioId(String(user.id))
          .then((fallback) => setBooks(fallback))
          .catch(() => setBooks([]));
      });
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

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
            <View className="flex-1 h-full justify-between text-center">
              <View>
                <Text
                  className="text-base font-bold text-[#FFFFFF]"
                  numberOfLines={1}
                >
                  {livro.titulo}
                </Text>
                <Text className="text-xs text-[#FFFFFF] mt-1">
                  Tipo: {formatTipo(livro.tipo as any)}
                  {"\n"}Estado: {formatEstado(livro.estado as any)}
                </Text>
              </View>

              <Pressable
                className="bg-[#F29F05] rounded-full px-5 py-1 self-start mb-3"
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
                <Text className="text-[#FFFFFF] text-sm font-semibold">
                  Descrição
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
