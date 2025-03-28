"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import { useParams } from "next/navigation";

export default function ChatDetailPage() {
  const { chatId } = useParams();

  return (
    <div className="flex flex-col h-screen">
      <ChatWindow chatId={chatId} />
    </div>
  );
}