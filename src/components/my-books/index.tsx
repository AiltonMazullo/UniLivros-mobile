import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";

export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado";

export interface LivroMock {
  id: string;
  titulo: string;
  tipo: TipoLivro;
  estado: EstadoLivro;
  imagem?: string; // opcional, se quiser exibir capa
}

export const livrosMock: LivroMock[] = [
  { id: "1", titulo: "Dom Casmurro", tipo: "troca", estado: "seminovo" },
  { id: "2", titulo: "O Alquimista", tipo: "venda", estado: "novo" },
  {
    id: "3",
    titulo: "Grande Sertão: Veredas",
    tipo: "emprestimo",
    estado: "usado",
  },
  { id: "4", titulo: "Capitães da Areia", tipo: "venda", estado: "usado" },
  { id: "5", titulo: "1984", tipo: "troca", estado: "novo" },
  {
    id: "6",
    titulo: "Memórias Póstumas de Brás Cubas",
    tipo: "emprestimo",
    estado: "seminovo",
  },
  {
    id: "7",
    titulo: "A Revolução dos Bichos",
    tipo: "venda",
    estado: "seminovo",
  },
  { id: "8", titulo: "Vidas Secas", tipo: "troca", estado: "usado" },
  { id: "9", titulo: "O Pequeno Príncipe", tipo: "emprestimo", estado: "novo" },
  {
    id: "10",
    titulo: "Harry Potter e a Pedra Filosofal",
    tipo: "venda",
    estado: "novo",
  },
  { id: "11", titulo: "A Moreninha", tipo: "troca", estado: "seminovo" },
  {
    id: "12",
    titulo: "O Senhor dos Anéis: A Sociedade do Anel",
    tipo: "emprestimo",
    estado: "usado",
  },
];

export function MyBooks() {
  return (
    <ScrollView>
      <View className="flex flex-col justify-center align-center gap-6">
        {livrosMock.map((livro) => (
          <View
            key={livro.id}
            className="w-[309px] h-[138px] bg-[#5A211A] rounded-xl p-4 flex-row items-center"
          >
            <View className="w-[72px] h-[90px] rounded-lg overflow-hidden mr-4 bg-[#3B1E18]">
              <Image
                source={
                  livro.imagem
                    ? { uri: livro.imagem }
                    : require("../../../assets/logo.png")
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-between h-full">
              <Text className="text-base font-bold text-[#FFFFFF]">
                {livro.titulo}
              </Text>
              <Text className="text-xs text-[#FFFFFF]">Tipo: {livro.tipo}</Text>
              <Text className="text-xs text-[#FFFFFF]">
                Estado: {livro.estado}
              </Text>
            </View>
            <Pressable className="bg-[#F27405] rounded-lg px-4 py-2 self-start mt-2">
              <Text className="text-[#FFFFFF] text-xs font-semibold">
                Descrição
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
