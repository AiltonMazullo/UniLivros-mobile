import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";

export type TipoLivro = "troca" | "venda" | "emprestimo";
export type EstadoLivro = "novo" | "seminovo" | "usado";

export interface LivroMock {
  id: string;
  titulo: string;
  tipo: TipoLivro;
  estado: EstadoLivro;
  imagem?: string;
}

export const livrosMock2: LivroMock[] = [
  { id: "13", titulo: "Cem Anos de Solidão", tipo: "venda", estado: "novo" },
  { id: "14", titulo: "O Nome da Rosa", tipo: "troca", estado: "seminovo" },
  {
    id: "15",
    titulo: "Ensaio sobre a Cegueira",
    tipo: "emprestimo",
    estado: "usado",
  },
  { id: "16", titulo: "A Metamorfose", tipo: "venda", estado: "seminovo" },
  { id: "17", titulo: "Crime e Castigo", tipo: "troca", estado: "usado" },
  {
    id: "18",
    titulo: "O Processo",
    tipo: "emprestimo",
    estado: "novo",
  },
  {
    id: "19",
    titulo: "Madame Bovary",
    tipo: "venda",
    estado: "seminovo",
  },
  { id: "20", titulo: "Anna Karenina", tipo: "troca", estado: "novo" },
  { id: "21", titulo: "Os Miseráveis", tipo: "emprestimo", estado: "usado" },
  {
    id: "22",
    titulo: "O Conde de Monte Cristo",
    tipo: "venda",
    estado: "seminovo",
  },
  { id: "23", titulo: "Ulisses", tipo: "troca", estado: "usado" },
  {
    id: "24",
    titulo: "Em Busca do Tempo Perdido",
    tipo: "emprestimo",
    estado: "novo",
  },
];

export function BooksUnilivrers() {

    const router = useRouter();

    
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center gap-6 mt-8">
        {livrosMock2.map((livro) => (
          <View
            key={livro.id}
            className="w-[290px] h-[138px] bg-[#5A211A] rounded-xl p-4 flex-row"
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
            <View className="flex-1 h-full justify-between items-start">
              <View>
                <Text
                  className="text-base font-bold text-[#FFFFFF]"
                  numberOfLines={1}
                >
                  {livro.titulo}
                </Text>
                <Text className="text-xs text-[#FFFFFF] mt-0">
                  Tipo: {livro.tipo}
                  {"\n"}Estado: {livro.estado}
                </Text>
              </View>

              <View className="flex-row items-center justify-evenly gap-0 w-full h-1/2">
                <Pressable className="bg-[#F29F05] rounded-full px-4 self-center" onPress={() => router.push(`/(app)/description-book?id=${livro.id}`)}>
                  <Text
                    className="text-[#FFFFFF] text-base text-center font-semibold"
                    style={{ fontSize: 10 }}
                  >
                    Descrição
                  </Text>
                </Pressable>

                <Pressable className="bg-[#FFF2F9] rounded-full px-4 self-center">
                  <Text
                    className="text-[#5A211A] text-base text-center font-semibold"
                    style={{ fontSize: 10 }}
                  >
                    Editar
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
