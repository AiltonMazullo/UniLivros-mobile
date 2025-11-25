export type ChatMessage = {
  id: string;
  authorId: number;
  text: string;
  createdAt: string; // ISO
};

export const ChatService = {
  async listMessages(_chatId: number): Promise<ChatMessage[]> {
    // TODO: substituir por chamada à API real
    return [
      { id: "1", authorId: 1, text: "Olá! Onde podemos nos encontrar?", createdAt: new Date().toISOString() },
      { id: "2", authorId: 2, text: "Que tal hoje às 16h no hall?", createdAt: new Date().toISOString() },
    ];
  },
  async sendMessage(_chatId: number, _text: string): Promise<void> {
    // TODO: integração real com backend
    return;
  },
};

