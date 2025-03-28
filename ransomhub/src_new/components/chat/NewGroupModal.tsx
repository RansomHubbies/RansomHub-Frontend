"use client";
import { useState } from "react";

interface User {
  id: string;
  name: string;
}

interface NewGroupModalProps {
  users: User[];
  onClose: () => void;
  onCreateGroup: (groupName: string, selectedMembers: User[]) => void;
}

export default function NewGroupModal({ users, onClose, onCreateGroup }: NewGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = searchQuery 
    ? users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  const handleToggleUser = (user: User) => {
    if (selectedMembers.some(member => member.id === user.id)) {
      setSelectedMembers(selectedMembers.filter(member => member.id !== user.id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    onCreateGroup(groupName, selectedMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 max-w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-black">Create New Group</h2>
        </div>
        
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <p className="font-semibold mb-2 text-black">Select Members:</p>
          <ul className="space-y-2">
            {filteredUsers.map(user => (
              <li key={user.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedMembers.some(member => member.id === user.id)}
                  onChange={() => handleToggleUser(user)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user.id}`} className="text-black">{user.name}</label>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button 
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded ${groupName.trim() && selectedMembers.length > 0 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}