import React, { useEffect, useMemo, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { UsersService, UserSummary } from "../../services/UsersService";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../context/AuthContext";
import { BooksService } from "../../services/books";

export default function AdicionarUnilivrer() {
  // Por padrão, mostramos apenas usuários da instituição
  const [query, setQuery] = useState("@souunit.com.br");
  const [results, setResults] = useState<UserSummary[]>([]);
  const [booksCountByUser, setBooksCountByUser] = useState<
    Record<string, number>
  >({});
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    UsersService.list(query).then(setResults);
  }, [query]);

  // Filtra por domínio da instituição, independente da busca
  const domain = "@souunit.com.br";
  const filtered = useMemo(() => {
    const byDomain = results.filter((u) =>
      typeof (u as any).email === "string"
        ? String((u as any).email)
            .toLowerCase()
            .endsWith(domain)
        : true
    );
    // Oculta o próprio usuário na listagem
    return byDomain.filter((u) => (user?.id ? u.id !== user.id : true));
  }, [results, user, domain]);

  // Enriquecimento: carregar quantidade de livros por usuário
  const isFetchingCountsRef = useRef(false);
  useEffect(() => {
    if (filtered.length === 0) return;
    if (isFetchingCountsRef.current) return;
    isFetchingCountsRef.current = true;
    const targets = filtered.slice(0, 20); // limita para evitar excesso
    (async () => {
      try {
        const pairs = await Promise.all(
          targets.map(async (u) => {
            try {
              const books = await BooksService.getByUsuarioId(String(u.id));
              return [String(u.id), books.length] as const;
            } catch {
              return [
                String(u.id),
                booksCountByUser[String(u.id)] ?? 0,
              ] as const;
            }
          })
        );
        setBooksCountByUser((prev) => {
          const next = { ...prev };
          for (const [id, count] of pairs) next[id] = count;
          return next;
        });
      } finally {
        isFetchingCountsRef.current = false;
      }
    })();
  }, [filtered]);

  return (
    <Screen className="bg-[#FFF2F2]">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="flex flex-row items-center mb-4">
          <Feather
            name="arrow-left"
            size={24}
            color="#4B1D0E"
            onPress={() => router.back()}
          />
          <Text
            className="flex-1 text-center text-[#4B1D0E] text-xl"
            style={{ fontFamily: "JosefinSans_600SemiBold" }}
          >
            Adicionar Unilivrer
          </Text>
        </View>

        <View className="rounded-full border border-orange-300 bg-white px-4 py-2 mb-4">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Procurar Unilivrer"
            className="text-[#4B1D0E]"
          />
        </View>

        <View className="gap-3">
          {filtered.map((u) => (
            <View
              key={u.id}
              className="flex flex-row items-center justify-between bg-white rounded-xl px-3 py-3"
            >
              <View className="flex flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full overflow-hidden border border-orange-400 bg-white items-center justify-center">
                  {u.avatarUrl ? (
                    <Image
                      source={{ uri: u.avatarUrl }}
                      className="w-10 h-10"
                    />
                  ) : (
                    <View className="w-10 h-10 items-center justify-center bg-white">
                      <Feather name="user" size={20} color="#4B1D0E" />
                    </View>
                  )}
                </View>
                <View>
                  <Text
                    className="text-[#4B1D0E]"
                    style={{ fontFamily: "JosefinSans_600SemiBold" }}
                  >
                    {u.nome}
                  </Text>
                  {typeof (u as any).email === "string" && (
                    <Text className="text-gray-500 text-xs">
                      {String((u as any).email)}
                    </Text>
                  )}
                  <Text className="text-gray-500 text-xs">
                    Livros {booksCountByUser[String(u.id)] ?? 0} • Avaliações{" "}
                    {u.avaliacoes ?? 0}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row gap-2">
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/user",
                      params: { id: String(u.id) },
                    })
                  }
                  className="px-3 py-2 rounded-full bg-orange-200"
                >
                  <Text className="text-[#4B1D0E]">Ver perfil</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
