"use client";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/api";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string, name: string, isGroup: boolean } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once component is mounted in the browser
    setIsClient(true);
    
    // Only access localStorage on the client side
    const storedUsername = typeof window !== 'undefined' ? localStorage.getItem("username") : null;
    
    if (storedUsername) {
      // Use fetchUsers to get full user details and find the full name
      fetchUsers()
        .then((usersData) => {
          const userObj = usersData.find((user: any) => user.username === storedUsername);
          if (userObj && userObj.name) {
            setLoggedInUser(userObj.name);
          } else {
            setLoggedInUser(storedUsername);
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
        {isClient ? (
          <>
            <ChatSidebar onSelectChat={handleSelectChat} />
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <ChatWindow
                  chatId={selectedChat.id}
                  chatName={selectedChat.name}
                  isGroup={selectedChat.isGroup}
                />
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  Select a chat to start messaging
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <p>Loading chat application...</p>
          </div>
        )}
      </div>
    </div>
  );
}