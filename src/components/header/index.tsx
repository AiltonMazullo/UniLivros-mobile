import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MenuModal from "../modal";
import { useRouter } from "expo-router";

export function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleUploadPhoto = () => {
    alert("Upload de foto");
  };

  return (
    <>
      <View className="flex flex-row justify-between items-center gap-2 p-8">
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
        <View className="flex flex-row justify-end items-center gap-4 mb-2">
          <Pressable onPress={handleUploadPhoto}>
            <Ionicons name="person" size={26} color="#4B1D0E" />
          </Pressable>
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons name="menu" size={36} color="#4B1D0E" />
          </Pressable>
        </View>
      </View>
      {/* Modal de Menu */}
      <MenuModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
