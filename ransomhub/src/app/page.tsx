"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi"; // Edit icon
import { MdCloudUpload } from "react-icons/md"; // Upload icon
import Link from "next/link";
import { getCSRFTokenFromCookie } from "./api";

export default function Dashboard() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const router = useRouter();
  
  // Token refresh function
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        const csrfToken = getCSRFTokenFromCookie();
        // const response = await fetch("http://127.0.0.1:8000/api/users/refresh/", {
        const response = await fetch("https://192.168.2.233/api/users/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;

        // Store the new tokens
        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        // If refresh fails, log out the user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!token || !refreshToken) {
      router.push("/auth/login"); // Redirect to login if no token is found
    } else {
      // Fetch user data
      const fetchUserData = async () => {
        try {
          const csrfToken = getCSRFTokenFromCookie();
          setLoading(true);
          let response = await fetch("https://192.168.2.233/api/users/profile", {
          
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "X-CSRFToken": csrfToken,
            },
            credentials: "include",
          });

          // If access token is expired or invalid, try refreshing
          if (response.status === 403 || response.status === 401) {
            await refreshAccessToken(); // Attempt to refresh the token

            // Retry fetching the user data with the new token
            const newToken = localStorage.getItem("access_token");
            if (newToken) {
              const csrfToken = getCSRFTokenFromCookie();
              response = await fetch("https://192.168.2.233/api/users/profile", {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${newToken}`,
                  "X-CSRFToken": csrfToken,
                },
                credentials: "include",
              });
            }
            else if (!newToken) {
              // Handle failed refresh
              router.push("/auth/login");
            }
          }

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            setEmail(data.email);
            setProfileImage(data.profileImage || "/default-profile.png");
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          setError("Failed to fetch user data.");
          router.push("/auth/login"); // Redirect to login
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();

      // Set up interval to refresh access token every 10 minutes (600000 ms)
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 600000); // Every 10 minutes

      // Cleanup interval when the component is unmounted
      return () => clearInterval(interval);
    }
  }, [router]); // Trigger when the component is mounted or when `router` changes

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);

      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("User is not authenticated.");
          return;
        }
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch("https://192.168.2.233/api/users/upload_image/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profileImage);
        } else {
          setError("Failed to upload image.");
        }
      } catch (error) {
        setError("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleUsernameUpdate = async () => {
    if (newUsername.trim() === "" || newUsername === username) {
      setEditingUsername(false);
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
  
      if (!token) {
        setError("User is not authenticated.");
        router.push("/auth/login");
        return;
      }
      const csrfToken = getCSRFTokenFromCookie();
      const response = await fetch("https://192.168.2.233/api/users/update_username/", {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ username: newUsername }),
      });
  
      if (response.status === 401 || response.status === 403) {
        await refreshAccessToken();
  
        const newToken = localStorage.getItem("access_token");
        if (newToken) {
          const csrfToken = getCSRFTokenFromCookie();
          const retryResponse = await fetch("https://192.168.2.233/api/users/update_username/", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${newToken}`,
              "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ username: newUsername }),
          });
  
          if (!retryResponse.ok) {
            throw new Error("Failed to update username.");
          }
        } else {
          router.push("/auth/login");
        }
      } else if (!response.ok) {
        throw new Error("Failed to update username.");
      }
  
      const data = await response.json();
      setUsername(data.username);
      setNewUsername(""); // Clear input field
      setEditingUsername(false);
    } catch (error) {
      setError("Failed to update username.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (!token || !refreshToken) {
        setError("User is not authenticated.");
        router.push("/auth/login");
        return;
      }
      const csrfToken = getCSRFTokenFromCookie();
      let response = await fetch("https://192.168.2.233/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        // If the access token is expired or invalid, try to refresh the token
        await refreshAccessToken();
        const newToken = localStorage.getItem("access_token");

        if (newToken) {
          const csrfToken = getCSRFTokenFromCookie();
          response = await fetch("https://192.168.2.233/api/users/logout/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${newToken}`,
              "X-CSRFToken": csrfToken,
            },
            credentials: "include",
          });
        }
        else if (!newToken) {
          // Handle failed refresh
          router.push("/auth/login");
        }
      }

      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/auth/login");
      } else {
        const data = await response.json();
        setError(data.error || "Logout failed");
      }
    } catch (error) {
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Link href="/chats" className="hover:text-blue-500 transition">Chats</Link>
            <Link href="/marketplace" className="hover:text-blue-500 transition">Marketplace</Link>
            <Link href="/admin" className="hover:text-blue-500 transition">Admin</Link>
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
            <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
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
