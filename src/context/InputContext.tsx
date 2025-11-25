import React, { createContext, useContext, useMemo, useState } from "react";

type DescricaoMap = Record<string, string>;

type InputContextValue = {
  descricaoByBook: DescricaoMap;
  setDescricao: (bookId: string, value: string) => void;
  getDescricao: (bookId?: string) => string | undefined;
  clearDescricao: (bookId: string) => void;
};

const InputContext = createContext<InputContextValue | undefined>(undefined);

export function InputProvider({ children }: { children: React.ReactNode }) {
  const [descricaoByBook, setDescricaoByBook] = useState<DescricaoMap>({});

  const value = useMemo<InputContextValue>(() => ({
    descricaoByBook,
    setDescricao: (bookId, value) =>
      setDescricaoByBook((prev) => ({ ...prev, [bookId]: value })),
    getDescricao: (bookId) => (bookId ? descricaoByBook[bookId] : undefined),
    clearDescricao: (bookId) =>
      setDescricaoByBook((prev) => {
        const next = { ...prev };
        delete next[bookId];
        return next;
      }),
  }), [descricaoByBook]);

  return <InputContext.Provider value={value}>{children}</InputContext.Provider>;
}

export function useInputContext(): InputContextValue {
  const ctx = useContext(InputContext);
  if (!ctx) {
    throw new Error("useInputContext deve ser usado dentro de um <InputProvider>");
  }
  return ctx;
}