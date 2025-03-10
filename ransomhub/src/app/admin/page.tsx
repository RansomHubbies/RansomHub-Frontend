"use client";
import { useState } from "react";
import Link from "next/link";
import { FiTrash2, FiUserCheck } from "react-icons/fi"; // Icons
import { MdBlock } from "react-icons/md"; // Suspend icon

// Sample user data (Assume this comes from backend)
const initialUsers = [
  { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "+1234567890", username: "JohnDoe92", is_verified: true, is_suspended: false },
  { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "+9876543210", username: "JaneSmith88", is_verified: false, is_suspended: false },
  { id: 3, name: "Michael Johnson", email: "michaelj@example.com", phone: "+1112223333", username: "MikeJ75", is_verified: true, is_suspended: false },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);

  // Function to remove user
  const removeUser = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // Function to suspend user
  const toggleSuspendUser = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, is_suspended: !user.is_suspended } : user
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="space-x-6 text-gray-600">
            <Link href="/admin/reports" className="hover:text-blue-500 transition">View Reports</Link>
            <Link href="/admin/logs" className="hover:text-blue-500 transition">View Logs</Link>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Home</Link>
          </div>
        </div>
      </nav>

      {/* User Table */}
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Users</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <td className="py-3 px-6 flex items-center gap-2">
                      {user.name}
                      {user.is_verified && <FiUserCheck size={18} className="text-blue-500" />} {/* Blue Tick */}
                    </td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.phone}</td>
                    <td className="py-3 px-6">@{user.username}</td>
                    <td className="py-3 px-6 text-center flex justify-center gap-4">
                      {/* Suspend Button */}
                      <button
                        onClick={() => toggleSuspendUser(user.id)}
                        className={`px-3 py-1 rounded-md flex items-center gap-2 transition ${
                          user.is_suspended ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-500 text-white hover:bg-gray-600"
                        }`}
                      >
                        <MdBlock size={16} />
                        {user.is_suspended ? "Unsuspend" : "Suspend"}
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2 hover:bg-red-600 transition"
                      >
                        <FiTrash2 size={16} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
