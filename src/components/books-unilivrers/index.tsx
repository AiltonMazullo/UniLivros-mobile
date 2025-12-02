import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { BooksService } from "../../services/books";
import { Book } from "../../types/book";
import { useAuth } from "../../context/AuthContext";
import { GoogleBooksService } from "../../services/googleBooks";
import { useFocusEffect } from "@react-navigation/native";

export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado";

export function BooksUnilivrers() {
  const router = useRouter();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = useCallback(() => {
    BooksService.getAll()
      .then((all) => {
        const others = user
          ? all.filter((b) => String(b.usuarioId) !== String(user.id))
          : all;
        setBooks(others);
        (async () => {
          const missing = others.filter((b) => !b.imagem && b.titulo);
          if (missing.length === 0) return;
          try {
            const top = missing.slice(0, 3);
            const updates = await Promise.all(
              top.map(async (b) => {
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
                  Tipo: {livro.tipo}
                  {"\n"}Estado: {livro.estado}
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

                <Pressable
                  className="bg-[#FFF2F9] rounded-full px-4 self-center"
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/edit-book",
                      params: {
                        id: String(livro.id),
                        titulo: livro.titulo,
                        imagem: livro.imagem ?? "",
                        // texto: livro.texto ?? "",
                      },
                    })
                  }
                >
                  <Text
                    className="text-[#5A211A] text-base text-center font-semibold"
                    style={{ fontSize: 10 }}
                  >
                    Editar
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
