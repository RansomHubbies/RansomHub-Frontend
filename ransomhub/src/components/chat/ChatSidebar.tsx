// "use client";
// import { useState } from "react";

// const dummyChats = [
//   { id: "1", name: "Alice", lastMessage: "Hey!", unread: 2, isGroup: false },
//   { id: "2", name: "Study Group", lastMessage: "Meeting at 5?", unread: 0, isGroup: true },
//   { id: "3", name: "Bob", lastMessage: "Check this out!", unread: 1, isGroup: false },
// ];

// export default function ChatSidebar({ onSelectChat }: { onSelectChat: (chatId: string) => void }) {
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);

//   return (
//     <div className="w-1/4 bg-gray-200 border-r h-full overflow-y-auto">
//       <div className="p-4 border-b bg-white">
//         <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
//       </div>
//       <ul>
//         {dummyChats.map((chat) => (
//           <li
//             key={chat.id}
//             className={`p-3 flex justify-between cursor-pointer border-b hover:bg-gray-300 ${
//               selectedChat === chat.id ? "bg-gray-400" : ""
//             }`}
//             onClick={() => {
//               setSelectedChat(chat.id);
//               onSelectChat(chat.id);
//             }}
//           >
//             <div>
//               <h2 className="font-semibold text-gray-900">{chat.name}</h2>
//               <p className="text-sm text-gray-700">{chat.lastMessage}</p>
//             </div>
//             {chat.unread > 0 && (
//               <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                 {chat.unread}
//               </span>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import NewGroupModal from "./NewGroupModal";
import GroupInfoModal from "./GroupInfoModal";

interface User {
  id: string;
  name: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  isGroup: boolean;
  members?: User[];
}

const dummyUsers: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
  { id: "u4", name: "David" },
  { id: "u5", name: "Eve" },
];

const initialChats: Chat[] = [
  { id: "1", name: "Alice", lastMessage: "Hey!", unread: 2, isGroup: false },
  { 
    id: "2", 
    name: "Study Group", 
    lastMessage: "Meeting at 5?", 
    unread: 0, 
    isGroup: true,
    members: [
      { id: "u1", name: "Alice" },
      { id: "u3", name: "Charlie" },
      { id: "u4", name: "David" }
    ]
  },
  { id: "3", name: "Bob", lastMessage: "Check this out!", unread: 1, isGroup: false },
];

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState<Chat | null>(null);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredChats(chats);
      return;
    }
    
    const filtered = chats.filter(chat => 
      chat.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  const handleCreateGroup = (groupName: string, selectedMembers: User[]) => {
    const newGroup: Chat = {
      id: `group-${Date.now()}`,
      name: groupName,
      lastMessage: "Group created",
      unread: 0,
      isGroup: true,
      members: selectedMembers
    };
    
    const updatedChats = [...chats, newGroup];
    setChats(updatedChats);
    setFilteredChats(updatedChats);
    setShowNewGroupModal(false);
  };

  const handleAddMember = (groupId: string, newMembers: User[]) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === groupId && chat.isGroup) {
        const existingMemberIds = new Set(chat.members?.map(m => m.id));
        const uniqueNewMembers = newMembers.filter(m => !existingMemberIds.has(m.id));
        
        return {
          ...chat,
          members: [...(chat.members || []), ...uniqueNewMembers],
          lastMessage: `${newMembers.length === 1 ? newMembers[0].name : 'New members'} added to group`
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setFilteredChats(updatedChats);
    setShowGroupInfoModal(false);
  };

  const handleViewGroupInfo = (chat: Chat) => {
    setSelectedGroupInfo(chat);
    setShowGroupInfoModal(true);
  };

  return (
    <div className="w-1/4 bg-gray-200 border-r h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
      </div>
      
      <div className="p-2 border-b bg-white">
        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md font-medium"
          onClick={() => setShowNewGroupModal(true)}
        >
          Create New Group
        </button>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <ul className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            className={`p-3 flex justify-between cursor-pointer border-b hover:bg-gray-300 ${
              selectedChat === chat.id ? "bg-gray-400" : ""
            }`}
          >
            <div 
              className="flex-1"
              onClick={() => {
                setSelectedChat(chat.id);
                onSelectChat(chat.id);
              }}
            >
              <h2 className="font-semibold text-gray-900">{chat.name}</h2>
              <p className="text-sm text-gray-700">{chat.lastMessage}</p>
            </div>
            
            <div className="flex items-center">
              {chat.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                  {chat.unread}
                </span>
              )}
              
              {chat.isGroup && (
                <button 
                  className="text-xs bg-blue-500 text-white p-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewGroupInfo(chat);
                  }}
                >
                  Info
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {showNewGroupModal && (
        <NewGroupModal 
          users={dummyUsers} 
          onClose={() => setShowNewGroupModal(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
      
      {showGroupInfoModal && selectedGroupInfo && (
        <GroupInfoModal 
          group={selectedGroupInfo}
          allUsers={dummyUsers}
          onClose={() => setShowGroupInfoModal(false)}
          onAddMembers={(members) => handleAddMember(selectedGroupInfo.id, members)}
        />
      )}
    </div>
  );
}