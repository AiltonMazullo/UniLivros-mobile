import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Select } from "../../components/select";
import { BooksService } from "../../services/books";
import { GoogleBooksService } from "../../services/googleBooks";

export default function EditBook() {
  const router = useRouter();
  const { id, titulo, imagem, tipo, estado } = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    imagem?: string;
    tipo?: string;
    estado?: string;
  }>();

  const [tipoValue, setTipoValue] = useState<string>(tipo ?? "");
  const [estadoValue, setEstadoValue] = useState<string>(estado ?? "");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(imagem ?? "");
  const [fetchingGoogle, setFetchingGoogle] = useState(false);
  const [titleValue, setTitleValue] = useState<string>(titulo ?? "");

  // Carregar dados atuais do livro quando tipo/estado não vierem pelos params
  useEffect(() => {
    if (!id) return;
    const needsFetch = !tipo || !estado || !imagem || !titulo;
    if (!needsFetch) return;
    (async () => {
      try {
        const book = await BooksService.getById(String(id));
        if (!tipo) setTipoValue(book.tipo);
        if (!estado) setEstadoValue(book.estado);
        if (!imagem) setImageUrl(book.imagem ?? "");
        if (!titulo) setTitleValue(book.titulo);
      } catch (err) {
        // silencioso: se falhar, usuário pode editar mesmo assim
      }
    })();
  }, [id, tipo, estado, imagem, titulo]);

  async function handleSave() {
    if (!id) {
      Alert.alert("Erro", "ID do livro não informado.");
      return;
    }
    if (!tipoValue) {
      Alert.alert("Tipo obrigatório", "Selecione o tipo do livro.");
      return;
    }
    if (!estadoValue) {
      Alert.alert("Estado obrigatório", "Selecione o estado do livro.");
      return;
    }
    try {
      setSaving(true);
      // Para APIs que exigem PUT com objeto completo, buscamos o livro atual
      const current = await BooksService.getById(String(id));
      const payload = {
        titulo: current.titulo,
        genero: current.genero,
        descricao: current.descricao,
        usuarioId: current.usuarioId,
        tipo: (tipoValue || current.tipo) as any,
        estado: (estadoValue || current.estado) as any,
        imagem: imageUrl || current.imagem || undefined,
      };
      await BooksService.update(String(id), payload);
      Alert.alert("Sucesso", "Livro atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Falha ao salvar",
        error?.response?.data?.message || "Tente novamente mais tarde."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleFetchFromGoogle() {
    const t = (titleValue || titulo || "").toString();
    if (!t || t.trim().length === 0) {
      Alert.alert(
        "Informe o título",
        "Para buscar no Google, precisamos do título."
      );
      return;
    }
    try {
      setFetchingGoogle(true);
      const results = await GoogleBooksService.search(String(t));
      if (!results || results.length === 0) {
        Alert.alert(
          "Sem resultados",
          "Não encontramos informações para este título."
        );
        return;
      }
      const best = results[0];
      setImageUrl(best.imagem ?? imageUrl);
      // Opcionalmente poderíamos também pré-preencher descrição em InputContext
      // deixando apenas a capa por ora.
      Alert.alert("Capa atualizada", "Carregamos a capa a partir do Google.");
    } catch (err) {
      Alert.alert(
        "Falha na busca",
        "Não foi possível consultar o Google Books."
      );
    } finally {
      setFetchingGoogle(false);
    }
  }

  return (
    <ScrollView className="w-full h-full bg-cream">
      {/* Header */}
      <View className="flex flex-row justify-between items-center p-8">
        <View className="flex flex-row justify-start items-center gap-2">
          <Text
            className="text-3xl text-brand mb-2 text-center"
            style={{ fontFamily: "JosefinSans_400Regular" }}
          >
            UniLivros
          </Text>
          <Image
            source={require("../../../assets/logo.png")}
            className="w-10 h-10 mb-4"
          />
        </View>
        <View className="flex flex-row justify-end items-center mb-2">
          <Pressable onPress={() => router.push("/(app)/profile")}>
            <Ionicons name="person" size={26} color="#4B1D0E" />
          </Pressable>
        </View>
      </View>

      <View className="flex items-center justify-center" key={id}>
        <View className="relative w-[326px] bg-[#5A211A] p-6 rounded-3xl">
          <Pressable
            onPress={() => router.push("/(app)/home")}
            className="absolute right-4 top-4 z-10"
            accessibilityLabel="Fechar edição"
          >
            <Ionicons name="close" size={26} color="#F29F05" />
          </Pressable>

          <View className="items-center">
            <View className="w-[120px] h-[120px] rounded-xl overflow-hidden bg-white">
              <Image
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : require("../../../assets/logo.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Campos */}
          <View className="mt-6 w-full  flex flex-col">
            <Text
              className="text-white text-xs"
              style={{ fontFamily: "JosefinSans_700Bold" }}
            >
              TIPO:
            </Text>
            <Select
              value={tipoValue}
              onChange={setTipoValue}
              options={[
                { label: "Troca", value: "troca" },
                { label: "Venda", value: "venda" },
                { label: "Empréstimo", value: "emprestimo" },
              ]}
              placeholder="troca | venda | emprestimo"
              className="mt-1"
            />

            <Text
              className="text-white text-xs mt-3"
              style={{ fontFamily: "JosefinSans_700Bold" }}
            >
              ESTADO:
            </Text>
            <Select
              value={estadoValue}
              onChange={setEstadoValue}
              options={[
                { label: "Novo", value: "novo" },
                { label: "Seminovo", value: "seminovo" },
                { label: "Usado", value: "usado" },
              ]}
              placeholder="novo | seminovo | usado"
              className="mt-1"
            />
          </View>

          <View className="mt-5 w-full items-center">
            <Pressable
              className="bg-[#F29F05] rounded-full px-6 py-3 active:bg-[#D4890A] w-9/12"
              onPress={() =>
                router.push({
                  pathname: "/(app)/description-book",
                  params: {
                    id: id ?? "",
                    titulo: titulo ?? "",
                    imagem: imageUrl ?? "",
                  },
                })
              }
            >
              <Text className="text-white text-center font-bold">
                Editar Descrição
              </Text>
            </Pressable>

            <Pressable
              className="bg-[#7AC70C] rounded-full px-6 py-3 mt-3 w-9/12 disabled:bg-[#6aa507]"
              onPress={handleSave}
              disabled={saving}
            >
              <Text className="text-white text-center font-bold">
                {saving ? "Salvando..." : "Salvar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
