"use client";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi"; // Edit icon
import { MdCloudUpload } from "react-icons/md"; // Upload icon
import Link from "next/link";

export default function Dashboard() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("YoungDragon");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUsernameUpdate() {
    if (newUsername.trim() !== "") {
      setUsername(newUsername);
      setEditingUsername(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between py-4 px-1">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="space-x-6 text-gray-600">
            <Link href="/chats" className="hover:text-blue-500 transition">Chats</Link>
            <Link href="/marketplace" className="hover:text-blue-500 transition">Marketplace</Link>
            <Link href="/admin" className="hover:text-blue-500 transition">Admin</Link>
            <Link href="/auth/login" className="hover:text-blue-500 transition">Logout</Link>
          </div>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="bg-white mt-10 p-8 rounded-xl shadow-lg max-w-lg w-full">
        <div className="flex flex-col items-center">
          {/* Profile Image Upload */}
          <div className="relative w-32 h-32">
            <label htmlFor="profile-upload" className="cursor-pointer">
              <img
                src={profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
              />
              {/* Upload Icon Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <MdCloudUpload size={30} className="text-white" />
              </div>
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* User Info */}
          <div className="mt-6 text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Young Dragon</h2>
            <p className="text-gray-500">dragon@iiitd.ac.in</p>
            <p className="text-gray-500">12341234</p>

            {/* Username Section */}
            <div className="flex items-center justify-center mt-3">
              {editingUsername ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border rounded-md px-2 py-1 w-36 text-center text-gray-700"
                  autoFocus
                  onBlur={handleUsernameUpdate} // Save when clicking outside
                  onKeyDown={(e) => e.key === "Enter" && handleUsernameUpdate()} // Save on Enter key
                />
              ) : (
                <p className="text-gray-700 flex items-center gap-2">
                  @{username}
                  <FiEdit2
                    size={16}
                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition"
                    onClick={() => setEditingUsername(true)}
                  />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
