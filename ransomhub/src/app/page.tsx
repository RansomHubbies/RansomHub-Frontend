"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiCheckCircle, FiXCircle, FiUser } from "react-icons/fi";
import { MdCloudUpload, MdPhoto } from "react-icons/md";
import Link from "next/link";
import { 
  refreshAccessToken, 
  fetchUserProfile, 
  uploadProfileImage, 
  updateUsername, 
  logout,
  acceptFollowRequest,
  rejectFollowRequest
} from "./api";


// Define types for our data
interface FollowRequest {
  username: string;
  first_name: string;
  profile_picture: string;
}

interface UserProfile {
  username: string;
  email: string;
  profileImage: string;
  is_admin: boolean;
  is_approved: boolean;
  followRequests: FollowRequest[];
}

export default function Dashboard() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [postText, setPostText] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (!token || !refreshToken) {
      router.push("/auth/login");
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetchUserProfile();
          
          if (response.error) {
            setError(response.error);
            router.push("/auth/login");
          } else {
            console.log(response)
            setUsername(response.username);
            setEmail(response.email);
            setProfileImage(response.profileImage || "/default-profile.png");
            setIsAdmin(response.is_admin);
            setIsApproved(response.is_approved);
            setFollowRequests(response.followRequests || []);
            localStorage.setItem("otpEmail", response.email);
          }
        } catch (err) {
          setError("Failed to fetch user profile");
          router.push("/auth/login");
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

  const handleFollowAction = async (username: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      let response;
      
      if (action === 'accept') {
        response = await acceptFollowRequest(username);
      } else {
        response = await rejectFollowRequest(username);
      }
      
      if (response.error) {
        setError(response.error);
      } else {
        // Remove the request from state
        setFollowRequests(followRequests.filter(req => req.username !== username));
      }
    } catch (err) {
      setError(`Failed to ${action} follow request`);
    }
    setLoading(false);
  };

  if (loading && !username) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between py-4 px-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="space-x-6 text-gray-600">
            {isApproved && (
              <Link href="/chats" className="hover:text-blue-500 transition">Chats</Link>
            )}

            <Link href="/marketplace" className="hover:text-blue-500 transition">Marketplace</Link>
            {isAdmin && (
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

      {/* Main Content - Split into two columns */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Left Column (larger) - Follow Requests Section */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Follow Requests</h2>
          
          {followRequests.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiUser size={48} className="mx-auto mb-3 opacity-30" />
              <p>No follow requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {followRequests.map(request => (
                <div key={request.username} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={request.profile_picture || "/default-profile.png"} 
                      alt={`${request.username}'s profile`} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{request.username}</p>
                      <p className="text-sm text-gray-500">{request.first_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleFollowAction(request.username, 'accept')}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition text-sm"
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleFollowAction(request.username, 'reject')}
                      className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition text-sm"
                      disabled={loading}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (smaller) - Profile Card and Post Form */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Profile Card Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col items-center">
              {/* Profile Image Upload */}
              <div className="relative w-24 h-24">
                <label htmlFor="profile-upload" className="cursor-pointer">
                  <img
                    src={profileImage || "/default-profile.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-full">
                    <MdCloudUpload size={24} className="text-white" />
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
              <div className="mt-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
                  {isApproved ? (
                    <FiCheckCircle 
                      size={16} 
                      className="text-green-500" 
                      title="Verified Account" 
                    />
                  ) : (
                    <FiXCircle 
                      size={16} 
                      className="text-red-500" 
                      title="Unverified Account" 
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500">{email}</p>

                {/* Username Section */}
                <div className="flex items-center justify-center mt-2">
                  {editingUsername ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="border rounded-md px-2 py-1 w-32 text-center text-gray-700 text-sm"
                      autoFocus
                      onBlur={handleUsernameUpdate}
                      onKeyDown={(e) => e.key === "Enter" && handleUsernameUpdate()}
                    />
                  ) : (
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      @{username}
                      <FiEdit2
                        size={14}
                        className="text-gray-500 cursor-pointer hover:text-blue-500 transition"
                        onClick={() => setEditingUsername(true)}
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* What's on your mind form - kept as dummy as requested */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium mb-4 text-gray-700">What's on your mind?</h3>
            
            <div className="space-y-4">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share something..."
                className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                rows={2}
              />
              
              <div className="flex items-center justify-between">
                <label htmlFor="post-image-upload" className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
                  <MdPhoto size={20} />
                  <span className="text-sm">Add photo</span>
                </label>
                <input
                  type="file"
                  id="post-image-upload"
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  disabled={true} // Kept disabled as requested
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm cursor-not-allowed opacity-50"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="absolute top-1 right-1 text-red-500"
          >
            <FiXCircle size={16} />
          </button>
        </div>
      )}
    </div>
  );
}