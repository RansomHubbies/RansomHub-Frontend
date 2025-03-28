
"use client";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useState } from "react";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar with Chat List */}
      <ChatSidebar onSelectChat={setSelectedChat} />
      
      {/* Chat Window (Shows selected chat) */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow chatId={selectedChat} />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}