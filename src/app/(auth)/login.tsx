import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input } from "../../components/input";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth();
  const REQUIRED_DOMAIN = "@souunit.com.br";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="w-full h-full bg-white"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
              placeholder="@souunit.com.br"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-10/12 mt-3"
            />
            <View className="w-10/12 mt-3 relative">
              <Input
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="pr-10"
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#4B1D0E"
                />
              </Pressable>
            </View>
            <Pressable
              className="mt-4 bg-[#F29F05] rounded-full px-6 py-3 active:bg-[#D4890A] disabled:bg-[#c98305]"
              disabled={loading || !email || !password}
              onPress={async () => {
                if (!email) {
                  Alert.alert("Login", "E-mail é obrigatório");
                  return;
                }
                const normalized = email.trim().toLowerCase();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(normalized)) {
                  Alert.alert("Login", "E-mail inválido");
                  return;
                }
                if (!normalized.endsWith(REQUIRED_DOMAIN)) {
                  Alert.alert(
                    "Login",
                    `O e-mail deve ser do domínio ${REQUIRED_DOMAIN}`
                  );
                  return;
                }
                if (!password || password.trim().length === 0) {
                  Alert.alert("Login", "Senha é obrigatória");
                  return;
                }
                try {
                  setLoading(true);
                  await signIn(email, password);
                  router.push("/home");
                } catch (e) {
                  const msg =
                    (e as any)?.message ||
                    "Falha ao autenticar. Verifique e-mail e senha.";
                  Alert.alert("Login", msg);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator color="#FFFFFF" />
                  <Text className="text-white text-center font-bold">
                    Entrando...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-bold">Entrar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
