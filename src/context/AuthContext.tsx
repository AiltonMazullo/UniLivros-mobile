import React, { createContext, useContext, useState } from "react";
import api, { setAuthToken } from "../services/api";

type AuthUser = {
  id: number;
  nome: string;
  email?: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Toast removido da aplicação

  async function signIn(email: string, senha: string) {
    try {
      // Envia ambos os campos para compatibilizar com backends que usam 'password'
      const payload = { email, senha, password: senha } as any;
      const { data } = await api.post("/auth/login", payload);
      const token = (data?.token || data?.accessToken || data?.data?.token) as
        | string
        | undefined;
      if (token) setAuthToken(token);
      const receivedUser = (data?.usuario ||
        data?.user ||
        data?.data?.usuario ||
        data?.data?.user ||
        data) as AuthUser | null;
      if (!receivedUser) throw new Error("Usuário não retornado");
      setUser(receivedUser);
      // feedback visual removido (toast)
    } catch (error: any) {
      // feedback visual removido (toast)
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Falha ao autenticar. Verifique e-mail e senha.";
      throw new Error(msg);
    }
  }

  async function register(nome: string, email: string, senha: string) {
    try {
      const payload = { nome, email, senha, password: senha } as any;
      const { data } = await api.post("/auth/register", payload);
      const token = (data?.token || data?.accessToken || data?.data?.token) as
        | string
        | undefined;
      if (token) setAuthToken(token);
      const receivedUser = (data?.usuario ||
        data?.user ||
        data?.data?.usuario ||
        data?.data?.user ||
        data) as AuthUser | null;
      if (!receivedUser) throw new Error("Usuário não retornado");
      setUser(receivedUser);
      // feedback visual removido (toast)
    } catch (error: any) {
      // feedback visual removido (toast)
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Falha ao registrar. Verifique os dados informados.";
      throw new Error(msg);
    }
  }

  async function signOut() {
    setUser(null);
    setAuthToken(undefined);
    // feedback visual removido (toast)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
