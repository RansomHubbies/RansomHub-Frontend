"use client";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchUsers } from "@/lib/api";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string, name: string, isGroup: boolean } | null>(null);
  const [loggedInFullName, setLoggedInFullName] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the stored username (which is the unique identifier)
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      // Use fetchUsers to get full user details and find the full name
      fetchUsers()
        .then((usersData) => {
          const userObj = usersData.find((user: any) => user.username === storedUsername);
          if (userObj && userObj.name) {
            setLoggedInFullName(userObj.name);
          } else {
            setLoggedInFullName(storedUsername);
          }
        })
        .catch((err) => console.error("Error fetching user details:", err));
    }
  }, []);

  const handleSelectChat = (chatId: string, chatName: string, isGroup: boolean) => {
    setSelectedChat({ id: chatId, name: chatName, isGroup });
  };

  return (
    <div className="flex flex-col h-screen">
    <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-300">
      {/* <h1 className="text-lg font-semibold">Chats: {loggedInUser}</h1> */}
      <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
        onClick={() => (window.location.href = "/")}
      >
        Home
      </button>
    </div>

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar onSelectChat={handleSelectChat} />
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatWindow 
              chatId={selectedChat.id}      // chatId is the username
              chatName={selectedChat.name}    // chatName is the full name
              isGroup={selectedChat.isGroup}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
