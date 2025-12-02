import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { UsersService } from "../../../services/UsersService";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

type ChatMessage = {
  id: string;
  authorId: number;
  text: string;
  createdAt: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipientId = Number(id);
  const router = useRouter();
  const { user } = useAuth();

  const [recipientName, setRecipientName] = useState<string>("Usuário");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!recipientId || Number.isNaN(recipientId)) return;
    UsersService.getById(recipientId).then((u) => {
      if (u?.nome) setRecipientName(u.nome);
    });
  }, [recipientId]);

  async function send() {
    const content = text.trim();
    if (!content) return;

    const optimistic: ChatMessage = {
      id: String(Date.now()),
      authorId: user?.id ?? 0,
      text: content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      // Tenta múltiplos endpoints para compatibilizar com backends diferentes
      const payloads = [
        {
          url: "/mensagens",
          body: { toUserId: recipientId, mensagem: content },
        },
        {
          url: "/chat/mensagens",
          body: { destinatarioId: recipientId, texto: content },
        },
        { url: `/chat/${recipientId}/mensagens`, body: { texto: content } },
      ];
      let sent = false;
      for (const p of payloads) {
        try {
          await api.post(p.url, p.body);
          sent = true;
          break;
        } catch (err) {
          // tenta próxima variação
        }
      }
      if (!sent) throw new Error("Falha ao enviar mensagem");
      alert({ text: "Mensagem enviada", type: "success" });
    } catch (error: any) {
      alert({
        text: error?.message || "Não foi possível enviar",
        type: "error",
      });
    }
  }

  return (
    <View className="flex-1 bg-[#FFF2F2]">
      <View className="flex-row items-center gap-3 p-4">
        <Pressable onPress={() => router.back()} className="p-2">
          <Feather name="arrow-left" size={22} color="#4B1D0E" />
        </Pressable>
        <Text
          className="text-[#4B1D0E] text-lg"
          style={{ fontFamily: "JosefinSans_600SemiBold" }}
        >
          {recipientName}
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {messages.map((m) => (
          <View
            key={m.id}
            className={`mb-2 ${
              m.authorId === user?.id ? "items-end" : "items-start"
            }`}
          >
            <View
              className={`px-3 py-2 rounded-xl ${
                m.authorId === user?.id ? "bg-orange-200" : "bg-white"
              }`}
            >
              <Text className="text-[#4B1D0E]">{m.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex flex-row items-center gap-2 p-3 border-t border-orange-200 bg-white">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Digite..."
          className="flex-1 px-3 py-2 rounded-full bg-[#FFF2F2] text-[#4B1D0E]"
        />
        <Pressable
          onPress={send}
          className="px-4 py-2 rounded-full bg-orange-300"
        >
          <Text className="text-[#4B1D0E]">Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}
