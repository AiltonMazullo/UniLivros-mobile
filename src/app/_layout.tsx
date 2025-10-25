import "../styles/global.css";
import { Stack } from "expo-router";
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{  headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="reset-password" options={{ title: "Esqueceu senha" /* headerShown: false */}} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
    </Stack>
  );
}
