"use client";

import { ChatMessage } from "@/interface/type";

// Dans une vraie application, vous utiliseriez une base de données
let conversations: Record<string, ChatMessage[]> = {};

export function saveConversation(
  userId: string,
  messages: ChatMessage[]
): void {
  conversations[userId] = messages;
  // Sauvegarder dans localStorage côté client ou dans une DB côté serveur
  if (typeof window !== "undefined") {
    localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
  }
}

export function getConversation(userId: string): ChatMessage[] {
  // Récupérer depuis la mémoire ou localStorage/DB
  if (conversations[userId]) {
    return conversations[userId];
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`chat_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      conversations[userId] = parsed;
      return parsed;
    }
  }

  return [];
}
