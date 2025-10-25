import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Header() {
  function handleUploadPhoto() {}

  return (
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
        <Pressable>
          <Ionicons name="menu" size={36} color="#4B1D0E" />
        </Pressable>
      </View>
    </View>
  );
}
