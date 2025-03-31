"use client";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import NewGroupModal from "./NewGroupModal";
import GroupInfoModal from "./GroupInfoModal";
import { fetchUsers, fetchGroups } from "@/lib/api";
import { addGroupMembers } from "@/lib/api";
interface User {
  id: string;
  name: string;
  username: string;
}

interface Group {
  name: string;
  username: string;
  members: string[];
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  isGroup: boolean;
  members?: User[];
}

interface ChatSidebarProps {
  onSelectChat: (chatId: string, chatName: string, isGroup: boolean) => void;
}

export default function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logged-in username from localStorage
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setLoggedInUserName(loggedInUser);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch users and groups in parallel
        const loggedInUser = localStorage.getItem("username");
        const [usersData, groupsData] = await Promise.all([
          fetchUsers(),
          fetchGroups(loggedInUser)
        ]);

        // Format users
        const formattedUsers = usersData.map((user: any) => ({
          id: user.username,
          name: user.name || user.username,
          username: user.username
        }));

        setUsers(formattedUsers);

        // Format groups
        setGroups(groupsData);

        // Create chats array
        const userChats = formattedUsers.map((user: User) => ({
          id: user.username,
          name: user.name,
          lastMessage: "Start a conversation",
          unread: 0,
          isGroup: false
        }));

        const groupChats = groupsData.map((group: Group) => ({
          id: group.username,
          name: group.name,
          lastMessage: "Group chat",
          unread: 0,
          isGroup: true,
          members: formattedUsers.filter((user: User) =>
            group.members.includes(user.username))
        }));

        const allChats = [...userChats, ...groupChats];
        setChats(allChats);
        setFilteredChats(allChats);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const handleSelect = (chatId: string, chatName: string, isGroup: boolean) => {
    setSelectedChat(chatId);
    onSelectChat(chatId, chatName, isGroup);  // Pass as two separate arguments
  };

  const handleViewGroupInfo = (chat: Chat) => {
    // Handle the group info modal
    setSelectedGroupInfo(chat);
    setShowGroupInfoModal(true);
  };

  const handleAddMembers = async (newMembers: User[]) => {
    if (selectedGroupInfo) {
      const memberUsernames = newMembers.map(m => m.username);
      try {
        await addGroupMembers(selectedGroupInfo.id, memberUsernames); // group_username = selectedGroupInfo.id
        const updatedGroup = {
          ...selectedGroupInfo,
          members: [...(selectedGroupInfo.members || []), ...newMembers],
        };
        setSelectedGroupInfo(updatedGroup);
      } catch (err) {
        console.error("Failed to add members to group:", err);
      }
      setShowGroupInfoModal(false);
    }
  };

  if (loading) {
    return (
      <div className="w-1/4 bg-gray-200 border-r h-full overflow-y-auto flex flex-col">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/4 bg-gray-200 border-r h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
      </div>
      {/* Display logged-in username at the top */}
      {loggedInUserName && (
        <div className="p-4 bg-white border-b">
          <h2 className="font-semibold text-gray-700">Logged in as:</h2>
          <p className="text-gray-800">{loggedInUserName}</p>
        </div>
      )}

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
              onClick={() => handleSelect(chat.id, chat.name, chat.isGroup)}  // Updated to handle select properly
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
                    handleViewGroupInfo(chat);  // Pass the chat info to view
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
          users={users}
          onClose={() => setShowNewGroupModal(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {showGroupInfoModal && selectedGroupInfo && (
        <GroupInfoModal
          group={selectedGroupInfo}  // Pass selected group details to modal
          allUsers={users}  // Pass all users for member addition
          onClose={() => setShowGroupInfoModal(false)}
          onAddMembers={handleAddMembers}  // Handle adding members to group
        />
      )}
    </div>
  );
}

