import { View, Text, Image, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BooksService } from "../../services/books";
import { useInputContext } from "../../context/InputContext";
import { Header } from "@/src/components/header";
import { Screen } from "../../components/Screen";

export default function DescriptionBook() {
  const router = useRouter();
  const { id, titulo, imagem, texto } = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    texto?: string;
    imagem?: string;
  }>();

  const { getDescricao } = useInputContext();
  const [descricao, setDescricao] = useState<string>("");
  const hasDescricao = descricao && descricao.trim().length > 0;

  useEffect(() => {
    const initial = getDescricao(String(id)) ?? (texto as string) ?? "";
    setDescricao(initial);
    if (id) {
      BooksService.getById(String(id))
        .then((b) => {
          if (b?.descricao && b.descricao !== initial) {
            setDescricao(b.descricao);
          }
        })
        .catch(() => void 0);
    }
  }, [id, texto]);

  return (
    <Screen className="bg-cream">
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Header />
        <View className="flex items-center justify-center" key={id}>
          <View className="relative w-[326px] h-auto bg-[#5A211A] p-6 rounded-3xl">
            <Pressable
              onPress={() => router.push("/(app)/home")}
              className="absolute right-4 top-4 z-10"
              accessibilityLabel="Fechar descrição"
            >
              <Ionicons name="close" size={26} color="#F29F05" />
            </Pressable>
            <View className="flex-col justify-start items-center">
              <View className="w-[184px] h-[184px] rounded-xl overflow-hidden bg-white">
                <Image
                  source={
                    imagem
                      ? { uri: imagem }
                      : require("../../../assets/logo.png")
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <Text
                className="text-white text-2xl font-bold mt-3 text-center"
                style={{ fontFamily: "JosefinSans_700Bold" }}
                numberOfLines={1}
              >
                {titulo ?? "Título não informado"}
              </Text>

              <View className="mt-3 w-full">
                <View className="p-3 rounded-xl border border-[#2E86C1] bg-[#5A211A]">
                  <Text
                    className="text-white text-sm leading-5"
                    style={{ fontFamily: "JosefinSans_400Regular" }}
                  >
                    {hasDescricao
                      ? descricao
                      : "Nenhum resumo disponível para este livro."}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
