import "../styles/global.css";
import { Stack } from "expo-router";
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { useFonts } from "expo-font";
import { InputProvider } from "../context/InputContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <InputProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="home" options={{ title: "Home" }} />
          <Stack.Screen
            name="description-book"
            options={{ title: "Descrição de livro" }}
          />
          <Stack.Screen name="edit-book" options={{ title: "Editar livro" }} />
          <Stack.Screen name="usuario/[id]" options={{ title: "Meu Perfil" }} />
          <Stack.Screen
            name="adicionar-unilivrer"
            options={{ title: "Adicionar Unilivrer" }}
          />
          <Stack.Screen name="parceiros" options={{ title: "Parceiros" }} />
          <Stack.Screen name="user" options={{ title: "Perfil do Usuário" }} />
          <Stack.Screen name="chat/[id]" options={{ title: "Chat" }} />
        </Stack>
      </InputProvider>
    </AuthProvider>
  );
}
