// "use client";
// import ChatSidebar from "@/components/chat/ChatSidebar";
// import ChatWindow from "@/components/chat/ChatWindow";
// import { useState } from "react";

// export default function ChatPage() {
//   const [selectedChat, setSelectedChat] = useState<{id: string, name: string, isGroup: boolean} | null>(null);
//   const handleSelectChat = (chatId: string, chatName: string, isGroup: boolean) => {
//     setSelectedChat({ id: chatId, name: chatName, isGroup: isGroup });
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar with Chat List */}
//       <ChatSidebar onSelectChat={handleSelectChat} />
      
//       {/* Chat Window (Shows selected chat) */}
//       <div className="flex-1 flex flex-col">
//       {selectedChat ? (
//         <ChatWindow chatId={selectedChat.id} chatName={selectedChat.name} isGroup={selectedChat.isGroup} />
//       ) : (
//           <div className="flex justify-center items-center h-full text-gray-500">
//             Select a chat to start messaging
//           </div>
//         )}
//       </div>
//     </div>
//   );
// } 


// "use client";
// import ChatSidebar from "@/components/chat/ChatSidebar";
// import ChatWindow from "@/components/chat/ChatWindow";
// import { useState, useEffect } from "react";

// export default function ChatPage() {
//   const [selectedChat, setSelectedChat] = useState<{ id: string, name: string, isGroup: boolean } | null>(null);
//   const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

//   const handleSelectChat = (chatId: string, chatName: string, isGroup: boolean) => {
//     setSelectedChat({ id: chatId, name: chatName, isGroup: isGroup });
//   };

//   useEffect(() => {
//     const username = localStorage.getItem("username");
//     if (username) setLoggedInUser(username);
//   }, []);

//   return (
//     <div className="flex flex-col h-screen">
//       {/* ⬜️ White Full-Width Top Bar */}
//       <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center shadow">
//         <h1 className="text-lg font-semibold">Chats: {loggedInUser}</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
//           onClick={() => (window.location.href = "/")}
//         >
//           Go to Dashboard
//         </button>
//       </div>

//       {/* 🪟 Main Chat UI */}
//       <div className="flex flex-1 overflow-hidden">
//         <ChatSidebar onSelectChat={handleSelectChat} />
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <ChatWindow
//               chatId={selectedChat.id}
//               chatName={selectedChat.name}
//               isGroup={selectedChat.isGroup}
//             />
//           ) : (
//             <div className="flex justify-center items-center h-full text-gray-500">
//               Select a chat to start messaging
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import ChatSidebar from "@/components/chat/ChatSidebar";
// import ChatWindow from "@/components/chat/ChatWindow";
// import { useState, useEffect } from "react";

// export default function ChatPage() {
//   const [selectedChat, setSelectedChat] = useState<{ id: string, name: string, isGroup: boolean } | null>(null);
//   const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

//   const handleSelectChat = (chatId: string, chatName: string, isGroup: boolean) => {
//     setSelectedChat({ id: chatId, name: chatName, isGroup });
//   };

//   useEffect(() => {
//     const username = localStorage.getItem("username");
//     if (username) setLoggedInUser(username);
//   }, []);

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Top Full-Width Bar with visible bottom border */}
//       {/* <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center shadow border-b border-gray-300">
//         <h1 className="text-lg font-semibold">Chats: {loggedInUser}</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
//           onClick={() => (window.location.href = "/")}
//         >
//           Go to Dashboard
//         </button>
//       </div> */}
//       <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-300">
//         {/* <h1 className="text-lg font-semibold">Chats: {loggedInUser}</h1> */}
//         <h1 className="text-xl font-semibold text-gray-800">Chats: {loggedInUser}</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
//           onClick={() => (window.location.href = "/")}
//         >
//           Home
//         </button>
//       </div>

//       {/* Main Chat Layout */}
//       <div className="flex flex-1 overflow-hidden">
//         <ChatSidebar onSelectChat={handleSelectChat} />
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <ChatWindow
//               chatId={selectedChat.id}
//               chatName={selectedChat.name}
//               isGroup={selectedChat.isGroup}
//             />
//           ) : (
//             <div className="flex justify-center items-center h-full text-gray-500">
//               Select a chat to start messaging
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string, name: string, isGroup: boolean } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setLoggedInUser(username);
  }, []);

  const handleSelectChat = (chatId: string, chatName: string, isGroup: boolean) => {
    setSelectedChat({ id: chatId, name: chatName, isGroup });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md border-b border-gray-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center py-4 px-1">
          <h1 className="text-xl font-semibold text-gray-800">Chats: {loggedInUser}</h1>
          <div className="space-x-6">
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Chat Layout */}
      <div className="flex h-full">
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
      </div>
    </div>
  );
}
