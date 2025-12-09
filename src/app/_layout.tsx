import "../styles/global.css";
import { Stack } from "expo-router";
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { useFonts } from "expo-font";
import { InputProvider } from "../context/InputContext";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(app)/home" options={{ headerShown: false }} />
            <Stack.Screen
              name="(app)/description-book"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(app)/edit-book"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(app)/profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(app)/add-unilivrer"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(app)/user" options={{ headerShown: false }} />
            <Stack.Screen
              name="(app)/chat/[id]"
              options={{ headerShown: false }}
            />
          </Stack>
      </InputProvider>
    </AuthProvider>
  );
}
