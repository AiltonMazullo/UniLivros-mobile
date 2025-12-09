import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { View, Text, Image, Pressable, ScrollView, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UsersService, UserSummary } from "../../services/UsersService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BooksService } from "../../services/books";
import { Book } from "../../types/book";
import { GoogleBooksService } from "../../services/googleBooks";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const searchParams = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [isLoadingBooks, setLoadingBooks] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userIdStr = useMemo(
    () => String(searchParams?.id ?? ""),
    [searchParams]
  );
  const userId = useMemo(
    () => (userIdStr ? Number(userIdStr) : NaN),
    [userIdStr]
  );
  const isOwnProfile = useMemo(
    () =>
      !!authUser?.id && !!user?.id && Number(authUser.id) === Number(user.id),
    [authUser?.id, user?.id]
  );

  const loadUser = useCallback(async () => {
    if (!userIdStr) {
      setErrorMessage("Usuário não informado.");
      setLoadingUser(false);
      return;
    }
    try {
      setLoadingUser(true);
      setErrorMessage(null);
      const data = await UsersService.getById(userId);
      setUser(data ?? null);
    } catch {
      setErrorMessage("Falha ao carregar usuário.");
    } finally {
      setLoadingUser(false);
    }
  }, [userId, userIdStr]);

  const enrichBooksFromGoogle = useCallback(async (items: Book[]) => {
    const missing = items.filter((b) => !b.imagem && b.titulo);
    if (missing.length === 0) return items;
    try {
      const targets = missing;
      const updates = await Promise.all(
        targets.map(async (b) => {
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
      return items.map((b) =>
        byId[String(b.id)] ? { ...b, ...byId[String(b.id)] } : b
      );
    } catch {
      return items;
    }
  }, []);

  const isFetchingBooksRef = useRef(false);
  const loadBooks = useCallback(async () => {
    if (!userIdStr) {
      setLoadingBooks(false);
      return;
    }
    // Evita chamadas concorrentes
    if (isFetchingBooksRef.current) return;
    isFetchingBooksRef.current = true;
    try {
      setLoadingBooks(true);
      const userBooks = isOwnProfile
        ? await BooksService.getMine()
        : await BooksService.getByUsuarioId(userIdStr);
      const enrichedBooks = await enrichBooksFromGoogle(userBooks);
      setBooks(enrichedBooks);
    } catch {
      setBooks([]);
    } finally {
      setLoadingBooks(false);
      isFetchingBooksRef.current = false;
    }
  }, [userIdStr, enrichBooksFromGoogle, isOwnProfile]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    loadBooks();
    // Recarrega quando o id da rota muda
  }, [userIdStr]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleNavigateToChat = useCallback(() => {
    if (!user?.id) return;
    router.push({
      pathname: "/(app)/chat/[id]",
      params: { id: String(user.id) },
    });
  }, [router, user?.id]);

  const handleNavigateToBook = useCallback(
    (livro: Book) => {
      router.push({
        pathname: "/(app)/description-book",
        params: {
          id: String(livro.id),
          titulo: livro.titulo,
          imagem: livro.imagem ?? "",
        },
      });
    },
    [router]
  );

  // Componente de estado vazio com ação manual (evita múltiplas chamadas automáticas)
  const BooksEmptyState: React.FC<{
    onRetry: () => void;
    isLoading: boolean;
  }> = ({ onRetry, isLoading }) => {
    return (
      <View className="items-center mt-2">
        <Text className="text-gray-600 mb-2">Nenhum livro encontrado.</Text>
        <Pressable
          className={`px-4 py-2 rounded-full ${
            isLoading ? "bg-orange-100" : "bg-orange-200"
          }`}
          onPress={isLoading ? undefined : onRetry}
        >
          <Text className="text-[#4B1D0E]">
            {isLoading ? "Carregando..." : "Tentar novamente"}
          </Text>
        </Pressable>
      </View>
    );
  };

  if (isLoadingUser) {
    return (
      <Screen className="bg-[#FFF2F2]">
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#4B1D0E]">Carregando...</Text>
        </View>
      </Screen>
    );
  }

  if (errorMessage || !user) {
    return (
      <Screen className="bg-[#FFF2F2]">
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#4B1D0E]">
            {errorMessage ?? "Usuário não encontrado."}
          </Text>
          <Pressable
            className="mt-4 px-4 py-2 rounded-full bg-orange-300"
            onPress={handleBack}
          >
            <Text className="text-[#4B1D0E]">Voltar</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="bg-[#FFF2F2]">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="flex flex-row items-center mb-4">
          <Feather
            name="arrow-left"
            size={24}
            color="#4B1D0E"
            onPress={handleBack}
          />
          <Text
            className="flex-1 text-center text-[#4B1D0E] text-xl"
            style={{ fontFamily: "JosefinSans_600SemiBold" }}
          >
            Perfil
          </Text>
        </View>
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
          {isOwnProfile ? (
            <Pressable
              className="px-4 py-2 rounded-full bg-orange-300"
              onPress={() => setAvatarModalOpen(true)}
            >
              <Text className="text-[#4B1D0E]">Ver foto de perfil</Text>
            </Pressable>
          ) : (
            <Pressable
              className="px-4 py-2 rounded-full bg-orange-300"
              onPress={handleNavigateToChat}
            >
              <Text className="text-[#4B1D0E]">Enviar Mensagem</Text>
            </Pressable>
          )}
        </View>

        <View className="flex flex-row gap-3 w-full flex-wrap justify-center">
          {books.map((livro) => (
            <Pressable
              key={livro.id}
              onPress={() => handleNavigateToBook(livro)}
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
          {!isLoadingBooks && books.length === 0 && (
            <BooksEmptyState onRetry={loadBooks} isLoading={isLoadingBooks} />
          )}
          {isLoadingBooks && (
            <Text className="text-gray-600">Carregando livros...</Text>
          )}
        </View>
      </ScrollView>
      {/* Modal de visualização da foto de perfil */}
      <Modal
        visible={isAvatarModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarModalOpen(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white rounded-2xl p-4 items-center max-w-[90%]">
            <View className="w-48 h-48 rounded-full overflow-hidden bg-white items-center justify-center">
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} className="w-48 h-48" />
              ) : (
                <View className="w-48 h-48 items-center justify-center bg-white">
                  <Ionicons name="person" size={64} color="#4B1D0E" />
                </View>
              )}
            </View>
            <Pressable
              className="mt-4 px-4 py-2 rounded-full bg-orange-200"
              onPress={() => setAvatarModalOpen(false)}
            >
              <Text className="text-[#4B1D0E]">Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
