import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import {
  UsersService,
  UserSummary,
} from "../../features/users/services/UsersService";
import { useRouter } from "expo-router";

export default function AdicionarUnilivrer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSummary[]>([]);
  const router = useRouter();

  useEffect(() => {
    UsersService.list(query).then(setResults);
  }, [query]);

  return (
    <ScrollView className="flex-1 bg-[#FFF2F2]" contentContainerClassName="p-4">
      <Feather
        name="arrow-left"
        size={24}
        color="#4B1D0E"
        onPress={() => router.back()}
      />
      <Text
        className="text-center text-[#4B1D0E] text-xl mb-4"
        style={{ fontFamily: "JosefinSans_600SemiBold" }}
      >
        Adicionar Unilivrer
      </Text>

      <View className="rounded-full border border-orange-300 bg-white px-4 py-2 mb-4">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Procurar Unilivrer"
          className="text-[#4B1D0E]"
        />
      </View>

      <View className="gap-3">
        {results.map((u) => (
          <View
            key={u.id}
            className="flex flex-row items-center justify-between bg-white rounded-xl px-3 py-3"
          >
            <View className="flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full overflow-hidden border border-orange-400 bg-white items-center justify-center">
                <Image
                  source={
                    u.avatarUrl
                      ? { uri: u.avatarUrl }
                      : require("../../../assets/logo.png")
                  }
                  className="w-10 h-10"
                />
              </View>
              <View>
                <Text
                  className="text-[#4B1D0E]"
                  style={{ fontFamily: "JosefinSans_600SemiBold" }}
                >
                  {u.nome}
                </Text>
                <Text className="text-gray-500 text-xs">
                  Livros trocados {u.livrosTrocados ?? 0} • Avaliações{" "}
                  {u.avaliacoes ?? 0}
                </Text>
              </View>
            </View>
            <View className="flex flex-row gap-2">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/user",
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
  );
}
