import React, { createContext, useContext, useState } from "react";
import api, { setAuthToken } from "../services/api";

// Tipos de domínio
type AuthenticatedUser = {
  id: number;
  nome: string;
  email?: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: AuthenticatedUser | null;
  signIn: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Utilitários de normalização
function extractToken(payload: unknown): string | undefined {
  const p = payload as any;
  return p?.token ?? p?.accessToken ?? p?.data?.token ?? undefined;
}

function extractUser(payload: unknown): AuthenticatedUser | null {
  const p = payload as any;
  const raw = p?.usuario ?? p?.user ?? p?.data?.usuario ?? p?.data?.user ?? p;
  if (!raw || typeof raw !== "object") return null;
  const id = Number(raw.id);
  const nome = String(raw.nome ?? "").trim();
  if (!id || !nome) return null;
  return {
    id,
    nome,
    email: typeof raw.email === "string" ? raw.email : undefined,
    avatarUrl: typeof raw.avatarUrl === "string" ? raw.avatarUrl : undefined,
  };
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  // Toast removido da aplicação

  async function signIn(email: string, senha: string) {
    try {
      // compatibilidade com backends que usam 'password'
      const credentials: { email: string; senha: string; password: string } = {
        email,
        senha,
        password: senha,
      };
      const { data } = await api.post("/auth/login", credentials);
      const token = extractToken(data);
      if (token) setAuthToken(token);
      const normalizedUser = extractUser(data);
      if (!normalizedUser) throw new Error("Usuário não retornado");
      setUser(normalizedUser);
      // feedback visual removido (toast)
    } catch (error: unknown) {
      // feedback visual removido (toast)
      const err = error as any;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao autenticar. Verifique e-mail e senha.";
      throw new Error(msg);
    }
  }

  async function register(nome: string, email: string, senha: string) {
    try {
      const newUserData: {
        nome: string;
        email: string;
        senha: string;
        password: string;
      } = { nome, email, senha, password: senha };
      const { data } = await api.post("/auth/register", newUserData);
      const token = extractToken(data);
      if (token) setAuthToken(token);
      const normalizedUser = extractUser(data);
      if (!normalizedUser) throw new Error("Usuário não retornado");
      setUser(normalizedUser);
      // feedback visual removido (toast)
    } catch (error: unknown) {
      // feedback visual removido (toast)
      const err = error as any;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao registrar. Verifique os dados informados.";
      throw new Error(msg);
    }
  }

  async function signOut() {
    setUser(null);
    setAuthToken(undefined);

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
