import React from "react";
import { View, Text, Image, Pressable, Modal as RNModal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
  onVerPerfil?: () => void;
  onAdicionarUnilivrer?: () => void;
  onParceiros?: () => void;
  onConfiguracoes?: () => void;
  onHome?: () => void;
  avatarUri?: string;
};

export default function MenuModal({
  visible,
  onClose,
  onVerPerfil,
  onAdicionarUnilivrer,
  onConfiguracoes,
  onHome,
  avatarUri,
}: MenuModalProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-[#FFF2F2] w-10/12 rounded-2xl border-2 border-orange-400 p-4">
          <View className="flex flex-row items-center justify-between mb-4">
            <View className="flex flex-row items-center justify-start gap-2">
              <Image
                source={require("../../../assets/logo.png")}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <View className="w-10 h-10 rounded-full overflow-hidden border border-orange-400">
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-white">
                    <Ionicons name="person" size={24} color="#4B1D0E" />
                  </View>
                )}
              </View>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text className="text-2xl text-orange-500 font-bold">X</Text>
            </Pressable>
          </View>

          {/* Options */}
          <View className="gap-4 items-center">
            <Pressable
              onPress={() => {
                onClose();
                router.push("/profile");
              }}
            >
              <Text
                className="text-orange-600"
                style={{ fontFamily: "JosefinSans_600SemiBold" }}
              >
                Ver Perfil
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onClose();
                router.push("/add-unilivrer");
              }}
            >
              <Text
                className="text-orange-600"
                style={{ fontFamily: "JosefinSans_600SemiBold" }}
              >
                Adicionar Unilivrer
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onClose();
                router.push("/home");
              }}
            >
              <Text
                className="text-orange-600"
                style={{ fontFamily: "JosefinSans_600SemiBold" }}
              >
                Estante Pessoal
              </Text>
            </Pressable>
            {/* Logout */}
            <Pressable
              className="mt-2 items-center"
              onPress={async () => {
                try {
                  await signOut();
                } finally {
                  onClose();
                  router.replace("/login");
                }
              }}
            >
              <Text
                className="text-red-600"
                style={{ fontFamily: "JosefinSans_600SemiBold" }}
              >
                Sair
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
