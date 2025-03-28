"use client";
import { useState } from "react";

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

interface GroupInfoModalProps {
  group: Chat;
  allUsers: User[];
  onClose: () => void;
  onAddMembers: (members: User[]) => void;
}

export default function GroupInfoModal({ group, allUsers, onClose, onAddMembers }: GroupInfoModalProps) {
  const [showAddMembersSection, setShowAddMembersSection] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter out users who are already members of the group
  const existingMemberIds = new Set(group.members?.map(member => member.id) || []);
  const availableUsers = allUsers.filter(user => !existingMemberIds.has(user.id));
  
  const filteredAvailableUsers = searchQuery 
    ? availableUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableUsers;

  const handleToggleUser = (user: User) => {
    if (selectedNewMembers.some(member => member.id === user.id)) {
      setSelectedNewMembers(selectedNewMembers.filter(member => member.id !== user.id));
    } else {
      setSelectedNewMembers([...selectedNewMembers, user]);
    }
  };

  const handleAddMembers = () => {
    if (selectedNewMembers.length === 0) return;
    onAddMembers(selectedNewMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 max-w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-black">{group.name}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Current Members Section */}
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2 text-black">Group Members ({group.members?.length || 0})</h3>
            <ul className="space-y-1">
              {group.members?.map(member => (
                <li key={member.id} className="p-2 text-black">
                  {member.name}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Add Members Section */}
          {!showAddMembersSection ? (
            <div className="p-4">
              <button 
                className="bg-blue-500 text-black px-4 py-2 rounded w-full"
                onClick={() => setShowAddMembersSection(true)}
              >
                Add Members
              </button>
            </div>
          ) : (
            <div className="p-4 border-t text-black">
              <h3 className="font-semibold mb-2 text-black">Add New Members</h3>
              
              <input
                type="text"
                placeholder="Search users..."
                className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {availableUsers.length === 0 ? (
                <p className="text-gray-500 italic">No more users available to add</p>
              ) : (
                <>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {filteredAvailableUsers.map(user => (
                      <li key={user.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`add-user-${user.id}`}
                          checked={selectedNewMembers.some(member => member.id === user.id)}
                          onChange={() => handleToggleUser(user)}
                          className="mr-2"
                        />
                        <label htmlFor={`add-user-${user.id}`}>{user.name}</label>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="bg-gray-300 px-3 py-1 rounded"
                      onClick={() => setShowAddMembersSection(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className={`px-3 py-1 rounded ${selectedNewMembers.length > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      onClick={handleAddMembers}
                      disabled={selectedNewMembers.length === 0}
                    >
                      Add Selected
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t text-black">
          <button 
            className="bg-gray-300 px-4 py-2 rounded w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}