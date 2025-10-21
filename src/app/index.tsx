import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";

const statusBarHeight = Constants.statusBarHeight;

export default function Login() {
  return (
    <ScrollView
      className="w-full h-full bg-cream pb-16"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="w-full items-center"
        style={{ marginTop: statusBarHeight }}
      >
        <View
          className="bg-[#FFF2F9] rounded-2xl w-full px-4 py-3 flex-row items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 6,
          }}
        >
          <Text
            className="text-4xl text-center text-brand"
            style={{ fontFamily: "JosefinSans_400Regular" }}
          >
            UniLivros
          </Text>
          <Image
            source={require("../../assets/logo.png")}
            className="w-10 h-10 ml-2 mb-1"
          />
        </View>
      </View>

      <View className="w-full items-center flex-column justify-center mt-20 gap-16">
        <Text
          className="text-4xl text-center text-brand"
          style={{ fontFamily: "JosefinSans_700Bold" }}
        >
          Compartilhar livros,
          {"\n"} é{"\n"}compartilhar
          {"\n"}mundos.
        </Text>
        <Image
          source={require("../../assets/Vector.png")}
          className="w-100 h-100 ml-2 mb-1"
        />
        <Text className="text-3xl text-center text-brand" style={{ fontFamily: "JosefinSans_400Regular" }}>
          UniLivros é um espaço pensado para quem acredita que ler é mais do que
          virar páginas. Aqui você pode montar sua estante virtual, trocar
          livros, conhecer novos leitores e transformar cada encontro em uma
          nova história.
        </Text>

        <Pressable
          className="mt-6 mb-12 w-2/4 bg-[#F29F05] rounded-full px-8 py-3 items-center justify-center"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white text-lg font-bold tracking-widest">LOGIN</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
