"use client";
import { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import { sendMessage } from "../../lib/api";
import Pusher from "pusher-js";


declare global {
  interface Window {
    pusherInstance: any;
  }
}

export default function ChatWindow({ chatId, chatName }: { chatId: string, chatName: string }) {
  console.log("Chat ID:", chatId);
  console.log("Chat Name:", chatName);
  
  // Get username immediately when component is created
  const initialUser = localStorage.getItem("username") || null;
  const [loggedInUser, setLoggedInUser] = useState(initialUser);
  const [messages, setMessages] = useState<any[]>([]);

  // Set up Pusher subscription once we have both username and chatName
  useEffect(() => {
    // Exit early if we don't have both pieces of information
    if (!chatName || !loggedInUser) {
      console.log("Missing required data, waiting...");
      return;
    }
    
    console.log("Setting up Pusher with:", loggedInUser, chatName);
    
    // Create Pusher instance
    const pusher = new Pusher("8f6f12497ce080d72d54", {
      cluster: "ap2",
    });
    
    // Subscribe to the channel
    const channel = pusher.subscribe(loggedInUser);
    
    // Listen for messages
    channel.bind(chatName, (data: { message: string }) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: chatName, text: data.message, isMe: false },
      ]);
    });
    
    // Store reference for cleanup
    window.pusherInstance = pusher;
    
    return () => {
      console.log("Cleaning up Pusher subscription");
      pusher.unsubscribe(loggedInUser);
      window.pusherInstance = null;
    };
  }, [chatName, loggedInUser]);

  const handleSendMessage = async (message: string) => {
    if (!loggedInUser || !chatName) {
      return;
    }

    setMessages(prevMessages => [...prevMessages, { 
      sender: loggedInUser, 
      text: message, 
      isMe: true 
    }]);
    
    await sendMessage(loggedInUser, chatName, message);
  };

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center">
        <h2 className="font-bold text-gray-900">Chat with {chatName}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.isMe ? "text-right" : "text-left"}`}>
            <p className={`inline-block p-2 rounded ${msg.isMe ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}