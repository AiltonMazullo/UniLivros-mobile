import { View, Text, Image, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DescriptionBook() {
  const router = useRouter();
  const { id, titulo, imagem, texto } = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    texto?: string;
    imagem?: string;
  }>();

  return (
    <ScrollView className="w-full h-full bg-cream">
      <View className="flex flex-row justify-between items-center p-8 ">
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
        <View className="flex flex-row justify-end items-center mb-2">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="person" size={26} color="#4B1D0E" />
          </Pressable>
        </View>
      </View>
      <View className="flex items-center justify-center" key={id}>
        <View className="relative w-[326px] h-auto bg-[#5A211A] p-6 rounded-3xl">
          {/* Botão de fechar no canto superior direito */}
          <Pressable
            onPress={() => router.push("/(app)/home")}
            className="absolute right-4 top-4 z-10"
            accessibilityLabel="Fechar descrição"
          >
            <Ionicons name="close" size={26} color="#F29F05" />
          </Pressable>
          <View className="flex-col justify-start items-center">
            <View className="w-[184px] h-[184px] rounded-xl overflow-hidden bg-white">
              <Image
                source={
                  imagem ? { uri: imagem } : require("../../../assets/logo.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <Text
              className="text-white text-2xl font-bold mt-3 text-center"
              style={{ fontFamily: "JosefinSans_700Bold" }}
              numberOfLines={1}
            >
              {titulo ?? "Título não informado"}
            </Text>

            <Text
              className="text-white text-sm mt-3 leading-5"
              style={{ fontFamily: "JosefinSans_400Regular" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              ut dolor vel augue ultricies bibendum. Curabitur sed dui at mauris
              facilisis luctus. Sed vitae lorem ac nibh fermentum convallis.
              Praesent nec sapien a elit pulvinar mollis. Donec venenatis, enim
              non pretium facilisis, augue ligula pretium velit, sed convallis
              mi magna eget justo.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
