"use client";
import React, { useRef } from "react";

import {
  genererCorrection,
  getCorrrectionByidSujet,
} from "@/app/api/correction/query";
import { supprimerSujet } from "@/app/api/sujet/query";
import { Button } from "@/components/ui/button";
import PdfViewer from "@/components/ui/PdfViewer";
import { ChatMessageType, Correction, User } from "@/interface/type";
import { getSupabaseUser } from "@/lib/authMnager";
import { GitPullRequestArrow } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
import { saveConversation } from "@/utils/chatStorage";
import ChatMessage from "@/components/chatMessage";
import { EnvoyerMessage } from "@/app/api/chat/query";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type ChatBotInfoProps = {
  sujetId: string | null | undefined;
};

const ChatBotInfo: React.FC<ChatBotInfoProps> = ({ sujetId }) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchData() {
    setIsLoading(true);
    try {
      if (sujetId) {
        /* const data: any = await getCorrrectionByidSujet(sujetId);
					if (data) {
						console.log(data);
						setcorrection(data);
					} */
      }
    } catch (error) {
      console.error(
        "Erreur lors de la recuperation de la correction details:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    setMessages([
      {
        text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    try {
      if (sujetId) {
        console.log(userMessage.text);
        const data = await EnvoyerMessage(sujetId, userMessage.text);

        // Ajouter la réponse du chatbot
        setMessages((prev) => [...prev, { text: data, isUser: false }]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[65vh] min-h-[60vh] max-w-xl mx-auto p-4">
      {/* Zone de messages */}
      <div className="flex-grow overflow-auto text-sm mb-4 p-4 bg-gray-100  overflow-y-auto rounded-lg">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-center my-2">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-blue-300"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatBotInfo;
