import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Header } from "../../components/header";
import {
  UsersService,
  UserSummary,
} from "../../features/users/services/UsersService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

type Tab = "books" | "help" | "achievements";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [user, setUser] = useState<UserSummary | null>(null);
  const router = useRouter();

  useEffect(() => {
    UsersService.getById(1).then(setUser);
  }, []);

  return (
    <ScrollView className="w-full h-full bg-cream">
      <Header />

      {/* Cabeçalho do Perfil */}
      <View className="flex flex-col justify-center items-center mt-6 mb-4">
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
            {user?.nome ?? "Meu Perfil"}
          </Text>
          <Pressable
            className="ml-3 px-3 py-1 rounded-full bg-orange-200 border border-[#F29F05]"
            onPress={() =>
              router.push({
                pathname: "/(app)/chat/[id]",
                params: { id: String(user?.id ?? 1) },
              })
            }
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
          Livros trocados {user?.livrosTrocados ?? 6} • Avaliações{" "}
          {user?.avaliacoes ?? 4.8}
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
      {activeTab === "books" && (
        <View className="px-6 mt-6">
          <View className="flex-row flex-wrap gap-4 justify-center">
            {[...Array(6)].map((_, idx) => (
              <Image
                key={idx}
                source={require("../../../assets/logo.png")}
                className="w-20 h-28 rounded-md"
              />
            ))}
          </View>
        </View>
      )}

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
                style={{ width: "65%" }}
              />
            </View>
            <Text
              className="mt-2 text-[#4B1D0E] opacity-80"
              style={{ fontFamily: "JosefinSans_400Regular" }}
            >
              650 / 1000
            </Text>
          </View>

          {/* Cards de conquistas */}
          <View className="gap-4">
            <View className="bg-white rounded-xl p-4">
              <Text
                className="text-[#4B1D0E]"
                style={{ fontFamily: "JosefinSans_700Bold" }}
              >
                Engajado!
              </Text>
              <Text
                className="mt-1 text-[#4B1D0E] opacity-80"
                style={{ fontFamily: "JosefinSans_400Regular" }}
              >
                Fez 10 trocas
              </Text>
            </View>
            <View className="bg-white rounded-xl p-4">
              <Text
                className="text-[#4B1D0E]"
                style={{ fontFamily: "JosefinSans_700Bold" }}
              >
                Super Confiável!
              </Text>
              <Text
                className="mt-1 text-[#4B1D0E] opacity-80"
                style={{ fontFamily: "JosefinSans_400Regular" }}
              >
                Média de avaliação acima de 4.5
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
