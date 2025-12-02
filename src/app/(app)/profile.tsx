import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Header } from "../../components/header";
import { UsersService, UserSummary } from "../../services/UsersService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { MyBooks } from "../../components/my-books";
import { Screen } from "../../components/Screen";

type Tab = "books" | "help" | "achievements";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [user, setUser] = useState<UserSummary | null>(null);
  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser?.id) {
      UsersService.getById(authUser.id)
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [authUser?.id]);

  const achievements = useMemo(() => {
    const trocaCount = user?.livrosTrocados ?? 0;
    const avaliacoes = user?.avaliacoes ?? 0;
    const seguidores = user?.seguidores ?? 0;

    const items = [
      {
        title: "Primeira Troca",
        description: "Concluiu a primeira troca de livros",
        achieved: trocaCount >= 1,
      },
      {
        title: "Leitor Ativo",
        description: "Concluiu 5 trocas",
        achieved: trocaCount >= 5,
      },
      {
        title: "Engajado",
        description: "Concluiu 10 trocas",
        achieved: trocaCount >= 10,
      },
      {
        title: "Influente",
        description: "Atingiu 10 seguidores",
        achieved: seguidores >= 10,
      },
      {
        title: "Avaliador",
        description: "Realizou 1 avaliação",
        achieved: avaliacoes >= 1,
      },
    ];
    return items;
  }, [user?.livrosTrocados, user?.avaliacoes, user?.seguidores]);

  const xpStats = useMemo(() => {
    const trocaCount = user?.livrosTrocados ?? 0;
    const seguidores = user?.seguidores ?? 0;
    const avaliacoes = user?.avaliacoes ?? 0;
    const xp = trocaCount * 50 + seguidores * 2 + avaliacoes * 5;
    const target = 1000;
    const progressPct = Math.min(100, Math.round((xp / target) * 100));
    return { xp, target, progressPct };
  }, [user?.livrosTrocados, user?.seguidores, user?.avaliacoes]);

  return (
    <Screen className="bg-cream">
      <ScrollView className="w-full h-full">
        <Header />

        {/* Cabeçalho do Perfil */}
        <View className="flex flex-col justify-center items-center mt-6 mb-4 gap-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#F29F05] bg-white items-center justify-center">
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} className="w-24 h-24" />
            ) : (
              <View className="w-full h-full items-center justify-center bg-white">
                <Ionicons name="person" size={50} color="#4B1D0E" />
              </View>
            )}
          </View>
          <View className=" flex-col items-center justify-center gap-4">
            <Text
              className="text-[#4B1D0E]"
              style={{ fontFamily: "JosefinSans_700Bold", fontSize: 22 }}
            >
              {user?.nome ?? authUser?.nome ?? "Meu Perfil"}
            </Text>
            <Pressable
              className="ml-3 px-3 py-1 rounded-full bg-orange-200 border border-[#F29F05]"
              onPress={() => {
                const targetId = String(user?.id ?? authUser?.id ?? 1);
                router.push(`/chat/${targetId}`);
              }}
            >
              <Text
                className="text-[#4B1D0E]"
                style={{ fontFamily: "JosefinSans_600SemiBold" }}
              >
                Enviar Mensagem
              </Text>
            </Pressable>
          </View>
          <Text
            className="text-[#4B1D0E] opacity-70 mt-1"
            style={{ fontFamily: "JosefinSans_400Regular" }}
          >
            Livros trocados {user?.livrosTrocados ?? 0} • Avaliações{" "}
            {user?.avaliacoes ?? 0}
          </Text>
        </View>

        {/* Tabs de módulos */}
        <View className="relative flex-row items-center text-center px-8 border-b-[4] border-white">
          <Pressable
            className="flex-1 items-center"
            onPress={() => setActiveTab("books")}
            accessibilityRole="button"
            accessibilityLabel="Estante"
          >
            <Ionicons
              name="book-outline"
              size={22}
              color={activeTab === "books" ? "#F27405" : "#4B1D0E"}
            />
          </Pressable>

          <Pressable
            className="flex-1 items-center"
            onPress={() => setActiveTab("help")}
            accessibilityRole="button"
            accessibilityLabel="Ajuda"
          >
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={activeTab === "help" ? "#F27405" : "#4B1D0E"}
            />
          </Pressable>

          <Pressable
            className="flex-1 items-center"
            onPress={() => setActiveTab("achievements")}
            accessibilityRole="button"
            accessibilityLabel="Conquistas"
          >
            <Ionicons
              name="trophy-outline"
              size={22}
              color={activeTab === "achievements" ? "#F27405" : "#4B1D0E"}
            />
          </Pressable>
        </View>
        <View className="absolute bottom-0 self-center h-12 w-[4] bg-white rounded-full" />
        <View className="relative px-8 mt-0">
          <View className="h-[4] w-full bg-white" />
        </View>

        {/* Conteúdo dos módulos */}
        {activeTab === "books" && <MyBooks />}

        {activeTab === "help" && (
          <View className="px-6 mt-6">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text
                className="text-[#4B1D0E]"
                style={{ fontFamily: "JosefinSans_700Bold" }}
              >
                Livro em ótimo estado?
              </Text>
              <Text
                className="mt-2 text-[#4B1D0E] opacity-80"
                style={{ fontFamily: "JosefinSans_400Regular" }}
              >
                Nos encontramos para fazer a troca. É só levar o livro e cumprir
                com o horário e o estado. Caso não tenha concluído, agende uma
                nova data.
              </Text>
            </View>
          </View>
        )}

        {activeTab === "achievements" && (
          <View className="px-6 mt-6">
            {/* Barra de progresso de XP */}
            <View className="mb-6">
              <Text
                className="text-[#4B1D0E] mb-2"
                style={{ fontFamily: "JosefinSans_700Bold" }}
              >
                XP
              </Text>
              <View className="w-full h-3 bg-[#FFE3CC] rounded-full">
                <View
                  className="h-full bg-[#F29F05] rounded-full"
                  style={{ width: `${xpStats.progressPct}%` }}
                />
              </View>
              <Text
                className="mt-2 text-[#4B1D0E] opacity-80"
                style={{ fontFamily: "JosefinSans_400Regular" }}
              >
                {xpStats.xp} / {xpStats.target}
              </Text>
            </View>

            {/* Cards de conquistas */}
            <View className="gap-4">
              {achievements.map((a, idx) => (
                <View
                  key={`${a.title}-${idx}`}
                  className="bg-white rounded-xl p-4 border"
                  style={{ borderColor: a.achieved ? "#F29F05" : "#EEE" }}
                >
                  <Text
                    className="text-[#4B1D0E]"
                    style={{ fontFamily: "JosefinSans_700Bold" }}
                  >
                    {a.title}
                  </Text>
                  <Text
                    className="mt-1 text-[#4B1D0E] opacity-80"
                    style={{ fontFamily: "JosefinSans_400Regular" }}
                  >
                    {a.description}
                  </Text>
                  {!a.achieved && (
                    <Text
                      className="mt-2 text-[#4B1D0E] opacity-60"
                      style={{
                        fontFamily: "JosefinSans_400Regular",
                        fontSize: 12,
                      }}
                    >
                      Em progresso
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
