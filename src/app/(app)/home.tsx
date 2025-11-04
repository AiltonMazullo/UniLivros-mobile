import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Header } from "../../components/header";
import { MyBooks } from "../../components/my-books";
import { BooksUnilivrers } from "@/src/components/books-unilivrers";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"personal" | "unilivros">(
    "personal"
  );

  return (
    <ScrollView className="w-full h-full bg-cream">
      <Header />
      <View className="relative flex-row items-center text-center px-8 border-b-[4] border-white">
        <Pressable
          className="flex-1 items-center"
          onPress={() => setActiveTab("personal")}
        >
          <Text
            numberOfLines={1}
            className={`uppercase tracking-wider font-bold text-base text-center ${activeTab === "personal" ? "text-[#F27405]" : "text-[#4B1D0E]"}`}
            style={{ fontFamily: "JosefinSans_700Bold" }}
          >
            ESTANTE PESSOAL
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center"
          onPress={() => setActiveTab("unilivros")}
        >
          <Text
            numberOfLines={2}
            className={`uppercase tracking-wider font-bold text-base text-center ${activeTab === "unilivros" ? "text-[#F27405]" : "text-[#4B1D0E]"}`}
            style={{ fontFamily: "JosefinSans_700Bold" }}
          >
            ESTANTE DE {"\n"}UNILIVRERS
          </Text>
        </Pressable>
      </View>
      <View className="absolute bottom-0 self-center h-12 w-[4] bg-white rounded-full" />
      <View className="relative px-8 mt-0">
        <View className="h-[4] w-full bg-white" />
      </View>
      {activeTab === "personal" ? <MyBooks /> : null}
      {activeTab === "unilivros" ? <BooksUnilivrers /> : null}
    </ScrollView>
  );
}
