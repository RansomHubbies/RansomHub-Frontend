"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2,FiCheckCircle,FiXCircle } from "react-icons/fi"; // Edit icon
import { MdCloudUpload } from "react-icons/md"; // Upload icon
import Link from "next/link";
import { 
  refreshAccessToken, 
  fetchUserProfile, 
  uploadProfileImage, 
  updateUsername, 
  logout 
} from "./api";

export default function Dashboard() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token || !refreshToken) {
      router.push("/auth/login");
    } else {
      const fetchData = async () => {
        setLoading(true);
        const response = await fetchUserProfile();

        if (response.error) {
          setError(response.error);
          router.push("/auth/login");
        } else {
          setUsername(response.username);
          setEmail(response.email);
          setProfileImage(response.profileImage || "/default-profile.png");
          setIsAdmin(response.is_admin);
          setIsApproved(response.is_approved);
        }
        setLoading(false);
      };

      fetchData();

      // Set up token refresh every 10 minutes
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 600000); // Every 10 minutes

      return () => clearInterval(interval);
    }
  }, [router]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const response = await uploadProfileImage(file);
      if (response.error) {
        setError(response.error);
      } else {
        setProfileImage(response.profileImage);
      }
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (newUsername.trim() === "" || newUsername === username) {
      setEditingUsername(false);
      return;
    }

    setLoading(true);
    const response = await updateUsername(newUsername);

    if (response.error) {
      setError(response.error);
    } else {
      setUsername(response.username);
      setNewUsername("");
      setEditingUsername(false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const response = await logout();

    if (response?.error) {
      setError(response.error);
    } else {
      router.push("/auth/login");
    }
    setLoading(false);
  };
  const handleGetVerified = () => {
    router.push("/verification");
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between py-4 px-1">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="space-x-6 text-gray-600">
            {isApproved&&(
              <Link href="/chats" className="hover:text-blue-500 transition">Chats</Link>
            )}

            <Link href="/marketplace" className="hover:text-blue-500 transition">Marketplace</Link>
            {isAdmin && ( // Minimal change: conditionally render admin link
              <Link href="/admin" className="hover:text-blue-500 transition">Admin</Link>
            )}
            {!isApproved && (
              <button 
                onClick={handleGetVerified} 
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition text-sm"
              >
                Get Verified
              </button>
            )}
            <button 
              onClick={handleLogout} 
              className="hover:text-blue-500 transition"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
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
          <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
              {isApproved ? (
                <FiCheckCircle 
                  size={20} 
                  className="text-green-500" 
                  title="Verified Account" 
                />
              ) : (
                <FiXCircle 
                  size={20} 
                  className="text-red-500" 
                  title="Unverified Account" 
                />
              )}
            </div>
            <p className="text-gray-500">{email}</p>

            {/* Username Section */}
            <div className="flex items-center justify-center mt-3">
              {editingUsername ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border rounded-md px-2 py-1 w-36 text-center text-gray-700"
                  autoFocus
                  onBlur={handleUsernameUpdate}
                  onKeyDown={(e) => e.key === "Enter" && handleUsernameUpdate()}
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
