import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UsersService, UserSummary } from "../../services/UsersService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BooksService } from "../../services/books";
import { Book } from "../../types/book";
import { GoogleBooksService } from "../../services/googleBooks";

export default function UsuarioPerfil() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userId = Number(id);
    UsersService.getById(userId).then(setUser);
  }, [id]);

  useEffect(() => {
    const userId = String(id ?? "");
    if (!userId) return;
    BooksService.getByUsuarioId(userId)
      .then(async (mine) => {
        setBooks(mine);
        const missing = mine.filter((b) => !b.imagem && b.titulo);
        if (missing.length > 0) {
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
        }
      })
      .catch(() => setBooks([]));
  }, [id]);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FFF2F2]" contentContainerClassName="p-4">
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full overflow-hidden border border-orange-400 bg-white items-center justify-center">
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} className="w-20 h-20" />
          ) : (
            <View className="w-full h-full items-center justify-center bg-white">
              <Ionicons name="person" size={42} color="#4B1D0E" />
            </View>
          )}
        </View>
        <Text
          className="text-2xl text-[#4B1D0E] mt-2"
          style={{ fontFamily: "JosefinSans_600SemiBold" }}
        >
          {user.nome}
        </Text>
        <Text className="text-gray-600">
          Livros trocados {user.livrosTrocados ?? 0} • Avaliações{" "}
          {user.avaliacoes ?? 0}
        </Text>
      </View>

      <View className="flex flex-row gap-3 justify-center mb-4">
        <Pressable
          className="px-4 py-2 rounded-full bg-orange-300"
          onPress={() =>
            router.push({
              pathname: "/chat/[id]",
              params: { id: String(user?.id) },
            })
          }
        >
          <Text className="text-[#4B1D0E]">Enviar Mensagem</Text>
        </Pressable>
      </View>

      <View className="flex flex-row gap-3 w-full flex-wrap justify-center">
        {books.map((livro) => (
          <Pressable
            key={livro.id}
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
            <View className="w-16 h-24 rounded-lg overflow-hidden bg-white border border-orange-300">
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
          </Pressable>
        ))}
        {books.length === 0 && (
          <Text className="text-gray-600">Nenhum livro encontrado.</Text>
        )}
      </View>
    </ScrollView>
  );
}
