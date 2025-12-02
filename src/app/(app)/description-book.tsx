import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BooksService } from "../../services/books";
import { useInputContext } from "../../context/InputContext";
import { Header } from "@/src/components/header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DescriptionBook() {
  const router = useRouter();
  const { id, titulo, imagem, texto } = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    texto?: string;
    imagem?: string;
  }>();

  const { getDescricao, setDescricao: setContextDescricao } = useInputContext();
  const [descricao, setDescricao] = useState<string>("");
  const maxChars = 1000;
  const insets = useSafeAreaInsets();
  const keyboardOffset = insets.top + 56; // 56 ~ altura típica do Header custom

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

  async function handleSave() {
    if (!id) {
      Alert.alert("Erro", "ID do livro não informado.");
      return;
    }
    try {
      await BooksService.update(String(id), { descricao });
      setContextDescricao(String(id), descricao);
      Alert.alert("Sucesso", "Resumo atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Falha ao salvar",
        error?.response?.data?.message || "Tente novamente mais tarde."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        className="w-full h-full bg-cream"
        keyboardShouldPersistTaps="handled"
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
                <TextInput
                  multiline
                  value={descricao}
                  onChangeText={(t) => setDescricao(t)}
                  placeholder="Digite aqui o resumo do livro..."
                  placeholderTextColor="#EBD4C0"
                  className="text-white text-sm leading-5 p-3 rounded-xl border border-[#2E86C1]"
                  style={{
                    fontFamily: "JosefinSans_400Regular",
                    minHeight: 160,
                    textAlignVertical: "top",
                  }}
                  maxLength={maxChars}
                />
                <View className="mt-1 w-full">
                  <Text
                    className="text-[#EBD4C0] text-xs text-right"
                    style={{ fontFamily: "JosefinSans_400Regular" }}
                  >
                    {descricao.length}/{maxChars}
                  </Text>
                </View>
              </View>

              {/* Botão salvar */}
              <Pressable
                className="bg-[#7AC70C] rounded-full px-6 py-3 mt-4 w-9/12"
                onPress={handleSave}
              >
                <Text className="text-white text-center font-bold">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
