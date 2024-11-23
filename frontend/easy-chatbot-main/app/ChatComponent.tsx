"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon } from "@/app/page";
import './ChatComponent.css';

interface Message {
  id: number;
  sender: string;
  content: string;
}
interface ChatComponentProps {
  isDarkTheme: boolean;
}

export default function ChatComponent({ isDarkTheme }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    // Prevent sending if waiting for a response
    if (isWaitingForResponse) {
      // console.log("Please wait for the current response before sending a new message.");
      return;
    }

    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "Utilisateur",
        content: input,
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setIsWaitingForResponse(true);

      // Add a temporary loading message with a unique id
      const loadingMessageId = messages.length + 2; // Calculate based on previous message ID
      const loadingMessage: Message = {
        id: loadingMessageId,
        sender: "Mme Aude",
        content: "Chargement...",
      };
      setMessages((prev) => [...prev, loadingMessage]);

      // Simulate waiting for a response
      fetch('http://localhost:9001/chat_completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: input }),
      })
        .then(response => {
          if (response.status === 404 || !response.ok) {
            throw new Error('API returned 404 or other error');
          }
          return response.json();
        })
        .then(data => {
          setMessages((prev) => {
            const updatedMessages = prev.map((msg) =>
              msg.id === loadingMessageId
                ? { ...msg, content: data.reply }
                : msg
            );
            return updatedMessages;
          });
        })
        .catch(() => {
          setMessages((prev) => {
            const updatedMessages = prev.map((msg) =>
              msg.id === loadingMessageId
                ? { ...msg, content: 'Une erreur est survenue veuillez réessayer.' }
                : msg
            );
            return updatedMessages;
          });
        })
        .finally(() => {
          setIsWaitingForResponse(false);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex flex-col items-start flex-1 max-w-2xl w-full gap-8 px-4 mx-auto overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-4 mt-4 ${
            message.sender === "Utilisateur" ? "justify-end self-end" : "justify-start self-start"
        }`}>
        {message.sender !== "Utilisateur" && (
          <div className="flex-shrink-0">
            <img src="Aude.jpg" alt="Avatar" className="sender-icon" />
          </div>
        )}
            <div className="grid gap-1">
              <div className="font-bold">{message.sender}</div>
              <div className={`prose text-muted-foreground ${
                isDarkTheme ? 'text-white' : 'text-black' }`}>
                <div className={`p-3 rounded-lg ${
                  message.sender === "Utilisateur" ? "bg-gray-800 text-white" : "bg-gray-700 text-white"
                }`}>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="max-w-2xl w-full sticky bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            name="message"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`min-h-[48px] w-full rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16 ${
              isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 top-3 right-3"
            onClick={handleSend}
          >
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs font-medium text-center text-neutral-700">
          Koz Numérik est toujours en production.
        </p>
      </div>
    </div>
  );
}
