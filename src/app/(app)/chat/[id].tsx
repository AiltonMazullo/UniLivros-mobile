import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ChatService, ChatMessage } from "../../../features/chat/services/ChatService";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = Number(id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    ChatService.listMessages(chatId).then(setMessages);
  }, [chatId]);

  async function send() {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), authorId: 0, text, createdAt: new Date().toISOString() },
    ]);
    setText("");
    await ChatService.sendMessage(chatId, text);
  }

  return (
    <View className="flex-1 bg-[#FFF2F2]">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {messages.map((m) => (
          <View key={m.id} className={`mb-2 ${m.authorId === 0 ? "items-end" : "items-start"}`}>
            <View className={`px-3 py-2 rounded-xl ${m.authorId === 0 ? "bg-orange-200" : "bg-white"}`}>
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
        <Pressable onPress={send} className="px-4 py-2 rounded-full bg-orange-300">
          <Text className="text-[#4B1D0E]">Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}

