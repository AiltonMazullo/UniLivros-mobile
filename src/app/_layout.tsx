import '../styles/global.css'
import { Slot } from 'expo-router'
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
    <Slot />
  )
}