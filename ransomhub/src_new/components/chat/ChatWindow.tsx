

"use client";
import { useState } from "react";
import MessageInput from "./MessageInput";

const dummyMessages = [
  { sender: "Alice", text: "Hello!", isMe: false },
  { sender: "Me", text: "Hey Alice!", isMe: true },
];

export default function ChatWindow({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState(dummyMessages);

  const sendMessage = (message: string) => {
    setMessages([...messages, { sender: "Me", text: message, isMe: true }]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center">
        <h2 className="font-bold text-gray-900">Chat with {chatId}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
            <p className={`inline-block p-2 rounded ${
              msg.isMe ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}