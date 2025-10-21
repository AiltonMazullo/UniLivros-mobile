import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from "react-native";

export default function LoginScreen() {
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

        {/* Card de Login */}
        <View
          className="bg-[#FBECD5] w-11/12 rounded-2xl px-5 py-6 items-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            className="w-10 h-10 mb-4"
          />

          <TextInput
            className="bg-white w-10/12 rounded-full px-4 py-2 mb-3"
            placeholder="Email"
            placeholderTextColor="#7A7A7A"
            keyboardType="email-address"
          />
          <TextInput
            className="bg-white w-10/12 rounded-full px-4 py-2"
            placeholder="Senha"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
          />

          {/* Esqueceu a senha */}
          <View className="w-10/12 mt-2">
            <Text className="text-right text-brand text-xs">
              Esqueceu a senha?
            </Text>
          </View>

          {/* Botão Entrar */}
          <Pressable
            className="mt-4 bg-[#F29F05] rounded-full px-6 py-3"
            onPress={() => {}}
          >
            <Text className="text-white text-center font-bold">Entrar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
