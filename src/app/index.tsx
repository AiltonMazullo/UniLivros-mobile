import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return '';
    return isValidEmail(email) ? '' : 'Informe um email válido';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return '';
    return password.length >= 6 ? '' : 'A senha deve ter pelo menos 6 caracteres';
  }, [password]);

  const isFormValid = useMemo(() => {
    return email.length > 0 && password.length > 0 && !emailError && !passwordError;
  }, [email, password, emailError, passwordError]);

  function handleForgotPassword() {
    Alert.alert('Recuperar senha', 'Funcionalidade em desenvolvimento.');
  }

  async function handleLogin() {
    if (!isFormValid) return;
    try {
      setLoading(true);
      // TODO: integrar com serviço de autenticação (src/services/auth.ts)
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert('Login', 'Autenticado com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>UniLivros</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="book-open-page-variant" size={36} color="#5A211A" />
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIconName="email-outline"
              error={emailError}
              testID="login-email"
            />

            <Input
              label="Senha"
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              leftIconName="lock-outline"
              rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onPressRightIcon={() => setShowPassword((v) => !v)}
              error={passwordError}
              testID="login-password"
            />

            <View style={styles.forgotBox}>
              <Pressable onPress={handleForgotPassword} accessibilityRole="button">
                <Text style={styles.forgotText}>Esqueceu a Senha?</Text>
              </Pressable>
            </View>

            <View style={styles.submitBox}>
              <PrimaryButton
                title="Entrar"
                onPress={handleLogin}
                disabled={!isFormValid}
                loading={loading}
                testID="login-submit"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 64,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700',
    color: '#5A211A',
  },
  card: {
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FBECD5',
    padding: 24,
  },
  iconBox: {
    alignItems: 'center',
  },
  form: {
    marginTop: 24,
  },
  forgotBox: {
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    color: '#F27405',
    textDecorationLine: 'underline',
  },
  submitBox: {
    marginTop: 24,
  },
});