import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Screen } from "../../components/Screen";
import { TrocasService, Troca } from "../../services/trocas";
import { GoogleBooksService } from "../../services/googleBooks";
import { BooksService } from "../../services/books";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export default function MinhasTrocas() {
  const router = useRouter();
  const { user } = useAuth();
  const [recebidas, setRecebidas] = useState<
    (Troca & { livro1Img?: string; livro2Img?: string })[]
  >([]);
  const [enviadas, setEnviadas] = useState<
    (Troca & { livro1Img?: string; livro2Img?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"recebidas" | "enviadas">(
    "recebidas"
  );

  const trocasRecebidas = recebidas;
  const trocasEnviadas = enviadas;
  const visiveis = activeTab === "recebidas" ? trocasRecebidas : trocasEnviadas;

  // Enriquecimento similar ao BooksUnilivrers: tenta Google Books para imagem/título
  const resolvedCacheRef = useRef<
    Record<string, { titulo?: string; imagem?: string }>
  >({});

  const resolveLivro = useCallback(
    async (
      livroId?: string,
      fallbackTitulo?: string,
      fallbackImagem?: string,
      isbn?: string
    ): Promise<{ titulo?: string; imagem?: string }> => {
      const normalize = (url?: string) =>
        url ? url.replace(/^http:\/\//, "https://") : undefined;
      let titulo = fallbackTitulo;
      let imagem = fallbackImagem ? normalize(fallbackImagem) : undefined;
      // Cache por livroId
      const cacheKey = isbn
        ? `isbn:${isbn}`
        : livroId
        ? `id:${String(livroId)}`
        : titulo
        ? `t:${titulo}`
        : undefined;
      if (cacheKey && resolvedCacheRef.current[cacheKey]) {
        const cached = resolvedCacheRef.current[cacheKey];
        return {
          titulo: cached.titulo ?? titulo,
          imagem: cached.imagem ?? imagem,
        };
      }
      // Preferir Google Books: ISBN -> busca por título
      if (isbn) {
        try {
          const g = await GoogleBooksService.getByISBN(isbn);
          if (g) {
            titulo = g.titulo || titulo;
            imagem = normalize(g.imagem) || imagem;
          }
        } catch {}
      }

      if ((!imagem || !titulo) && titulo) {
        try {
          const res = await GoogleBooksService.search(titulo);
          const best = res?.[0];
          titulo = best?.titulo || titulo;
          imagem = normalize(best?.imagem) || imagem;
        } catch {}
      }

      // Fallback para o serviço interno por ID se ainda faltar dados
      try {
        if ((!imagem || !titulo) && livroId) {
          const b = await BooksService.getById(String(livroId));
          titulo = b?.titulo || titulo;
          imagem = normalize(b?.imagem) || imagem;
        }
      } catch {}

      const result = { titulo, imagem };
      if (cacheKey) {
        resolvedCacheRef.current[cacheKey] = result;
      }
      return result;
    },
    []
  );

  const processTroca = useCallback(
    async (
      t: Troca
    ): Promise<Troca & { livro1Img?: string; livro2Img?: string }> => {
      const l1 = await resolveLivro(
        t.livro1Id,
        t.livro1Titulo,
        t.livro1Imagem,
        (t as any).livro1Isbn
      );
      const l2 = await resolveLivro(
        t.livro2Id,
        t.livro2Titulo,
        t.livro2Imagem,
        (t as any).livro2Isbn
      );
      return {
        ...t,
        livro1Titulo: l1.titulo ?? t.livro1Titulo,
        livro2Titulo: l2.titulo ?? t.livro2Titulo,
        livro1Img: l1.imagem ?? t.livro1Imagem,
        livro2Img: l2.imagem ?? t.livro2Imagem,
      };
    },
    [resolveLivro]
  );

  const carregarTrocas = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rec, env] = await Promise.all([
        TrocasService.listRecebidas(),
        TrocasService.listEnviadas(),
      ]);
      const [recProc, envProc] = await Promise.all([
        Promise.all(rec.map(processTroca)),
        Promise.all(env.map(processTroca)),
      ]);
      setRecebidas(recProc);
      setEnviadas(envProc);
    } catch {
      setRecebidas([]);
      setEnviadas([]);
    } finally {
      setIsLoading(false);
    }
  }, [processTroca]);

  useEffect(() => {
    carregarTrocas();
  }, [carregarTrocas]);

  useFocusEffect(
    useCallback(() => {
      carregarTrocas();
      return () => {};
    }, [carregarTrocas])
  );

  const confirmarTroca = useCallback(
    async (troca: Troca) => {
      try {
        await TrocasService.confirmar(String(troca.id));
        await carregarTrocas();
      } catch {}
    },
    [carregarTrocas]
  );

  const cancelarTroca = useCallback(
    async (troca: Troca) => {
      try {
        await TrocasService.cancelar(String(troca.id));
        await carregarTrocas();
      } catch {}
    },
    [carregarTrocas]
  );

  // Helpers de UI
  const isPendente = (t?: Troca) =>
    String(t?.status).toLowerCase() === "pendente";
  const otherUserLabel = (t: Troca) =>
    activeTab === "recebidas"
      ? t.usuario1Nome ?? t.usuario1Email ?? "não informado"
      : t.usuario2Nome ?? t.usuario2Email ?? "não informado";

  const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const label = (status ?? "").toLowerCase();
    const map: Record<string, { text: string; cls: string }> = {
      pendente: { text: "Pendente", cls: "bg-yellow-100 text-yellow-800" },
      confirmada: { text: "Aceita", cls: "bg-green-100 text-green-800" },
      aceita: { text: "Aceita", cls: "bg-green-100 text-green-800" },
      concluida: { text: "Concluída", cls: "bg-green-100 text-green-800" },
      rejeitada: { text: "Rejeitada", cls: "bg-red-100 text-red-800" },
      recusada: { text: "Rejeitada", cls: "bg-red-100 text-red-800" },
      cancelada: { text: "Rejeitada", cls: "bg-red-100 text-red-800" },
    };
    const cfg = map[label] ?? {
      text: "Status",
      cls: "bg-gray-100 text-gray-700",
    };
    return (
      <View className={`px-2 py-1 rounded-full ${cfg.cls}`}>
        <Text className="text-xs">{cfg.text}</Text>
      </View>
    );
  };

  return (
    <Screen className="bg-[#FFF2F2]">
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center mb-4 gap-2">
          <Ionicons
            name="arrow-back"
            size={24}
            color="#4B1D0E"
            onPress={() => router.back()}
          />
          <Text
            className="flex-1 text-start text-[#4B1D0E] text-xl"
            style={{ fontFamily: "JosefinSans_600SemiBold" }}
          >
            Minhas Propostas
          </Text>
        </View>

        {/* Tabs com sublinhado */}
        <View className="flex-row gap-6 mb-3 px-2">
          <Pressable onPress={() => setActiveTab("recebidas")}>
            <Text
              className={`text-[#4B1D0E] ${
                activeTab === "recebidas" ? "font-semibold" : ""
              }`}
            >
              Recebidas
            </Text>
            <View
              className={`${
                activeTab === "recebidas" ? "bg-orange-400" : "bg-transparent"
              } h-[2px] mt-1`}
            />
          </Pressable>
          <Pressable onPress={() => setActiveTab("enviadas")}>
            <Text
              className={`text-[#4B1D0E] ${
                activeTab === "enviadas" ? "font-semibold" : ""
              }`}
            >
              Enviadas
            </Text>
            <View
              className={`${
                activeTab === "enviadas" ? "bg-orange-400" : "bg-transparent"
              } h-[2px] mt-1`}
            />
          </Pressable>
        </View>

        {/* Sem QR: apenas ações por item */}

        {isLoading ? (
          <Text className="text-[#4B1D0E]">Carregando trocas...</Text>
        ) : (
          <View className="gap-3">
            {visiveis.length === 0 ? (
              <View className="items-center justify-center py-6">
                <Text className="text-[#4B1D0E]">
                  📭 Nenhuma troca encontrada.
                </Text>
                <Text className="text-gray-600">
                  Você verá aqui as trocas pendentes e concluídas.
                </Text>
              </View>
            ) : (
              visiveis.map((t) => (
                <View
                  key={t.id}
                  className="bg-orange-50 rounded-xl p-3 border border-orange-200"
                >
                  {/* Top row: images and titles (usando dados resolvidos da proposta) */}
                  <View className="flex-row items-center gap-3">
                    <View className="w-14 h-20 rounded-md overflow-hidden bg-white border border-orange-200">
                      <Image
                        source={
                          t.livro1Img ?? t.livro1Imagem
                            ? { uri: (t.livro1Img ?? t.livro1Imagem) as string }
                            : require("../../../assets/logo.png")
                        }
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[#4B1D0E]"
                        style={{ fontFamily: "JosefinSans_600SemiBold" }}
                      >
                        {t.livro1Titulo ?? "Livro 1"}
                      </Text>
                    </View>
                    <View className="items-center justify-center">
                      <Ionicons
                        name="swap-horizontal"
                        size={20}
                        color="#4B1D0E"
                      />
                    </View>
                    <View className="w-14 h-20 rounded-md overflow-hidden bg-white border border-orange-200">
                      <Image
                        source={
                          t.livro2Img ?? t.livro2Imagem
                            ? { uri: (t.livro2Img ?? t.livro2Imagem) as string }
                            : require("../../../assets/logo.png")
                        }
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[#4B1D0E]"
                        style={{ fontFamily: "JosefinSans_600SemiBold" }}
                      >
                        {t.livro2Titulo ?? "Livro 2"}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-2 flex-row items-center justify-between">
                    <Text className="text-[#F29F05]">
                      {activeTab === "recebidas"
                        ? t.usuario1Nome ?? t.usuario1Email ?? "não informado"
                        : t.usuario2Nome ?? t.usuario2Email ?? "não informado"}
                    </Text>
                    <StatusBadge status={t.status} />
                  </View>

                  {/* Actions */}
                  <View className="mt-3 flex-row gap-2">
                    {isPendente(t) && activeTab === "recebidas" && (
                      <Pressable
                        className="px-3 py-2 rounded-full bg-green-200"
                        onPress={() => confirmarTroca(t)}
                      >
                        <Text className="text-[#4B1D0E]">Confirmar</Text>
                      </Pressable>
                    )}
                    {isPendente(t) && activeTab === "recebidas" && (
                      <Pressable
                        className="px-3 py-2 rounded-full bg-red-200"
                        onPress={() => cancelarTroca(t)}
                      >
                        <Text className="text-[#4B1D0E]">Recusar</Text>
                      </Pressable>
                    )}
                    {isPendente(t) && activeTab === "enviadas" && (
                      <Pressable
                        className="px-3 py-2 rounded-full bg-red-200"
                        onPress={() => cancelarTroca(t)}
                      >
                        <Text className="text-[#4B1D0E]">Cancelar</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
