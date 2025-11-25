import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  UsersService,
  UserSummary,
} from "../../features/users/services/UsersService";

export default function UsuarioPerfil() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<UserSummary | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = Number(id);
    UsersService.getById(userId).then(setUser);
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
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} className="w-20 h-20" />
          ) : (
            <Image
              source={require("../../../assets/logo.png")}
              className="w-20 h-20"
            />
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

      <Text
        className="text-[#4B1D0E] mb-2"
        style={{ fontFamily: "JosefinSans_600SemiBold" }}
      >
        Livros
      </Text>
      <View className="flex flex-row gap-3 w-full flex-wrap justify-center">
        <Image
          source={require("../../../assets/logo.png")}
          className="w-16 h-24"
        />
        <Image
          source={require("../../../assets/logo.png")}
          className="w-16 h-24"
        />
        <Image
          source={require("../../../assets/logo.png")}
          className="w-16 h-24"
        />
      </View>
    </ScrollView>
  );
}
