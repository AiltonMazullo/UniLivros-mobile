import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  token: null,
  user: null,
  signIn: async (email: string, senha: string) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        token: null,
        user: null,
        signIn: async (email: string, senha: string) => {},
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
