import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Input } from "../../components/input";
import { Link, useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  return (
    <ScrollView
      className="w-full h-full bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="w-full items-center">
        <Text
          className="text-3xl text-brand mb-4"
          style={{ fontFamily: "JosefinSans_400Regular" }}
        >
          UniLivros
        </Text>
        <View
          className="bg-[#FBECD5] w-10/12 h-10/12 rounded-3xl px-5 py-6 items-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Image
            source={require("../../../assets/logo.png")}
            className="w-10 h-10 mb-4"
          />

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-10/12 mt-3"
          />

          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-10/12 mt-3"
          />

          <View className="w-10/12 mt-2">
            <Link href="/reset-password" className="text-right text-brand text-xs ">
              Esqueceu a senha?
            </Link>
          </View>
          <Pressable
            className="mt-4 bg-[#F29F05] rounded-full px-6 py-3 active:bg-[#D4890A]"
            onPress={() => {
              router.push("/home");
            }}
          >
            <Text className="text-white text-center font-bold">Entrar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
