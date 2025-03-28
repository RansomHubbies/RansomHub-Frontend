const API_URL = "http://127.0.0.1:8000/api/users";
// const API_URL = "https://192.168.2.233/api/users";


export const getCSRFTokenFromCookie = () => {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

    if (cookie) {
        return cookie.split("=")[1];
    }
    console.error("CSRF token not found in cookies.");
    return ""; 
};
export const signup = async (name,username, email, password,phone) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/signup/`, {
            method: "POST",
            headers: { "Content-Type": "application/json","X-CSRFToken": csrfToken, },
            credentials: "include",
            body: JSON.stringify({ name,username, email, password, phone }),
        });
        
        const data = await response.json();
        console.log("Signup API Response:", data);

        if (response.status === 201) {
            return data;  // 
        } else {
            throw new Error(data.error || "Signup failed");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();  
        const response = await fetch(`${API_URL}/verifyotp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,  
            },
            credentials: "include",
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        console.log("OTP Verification Response:", data);

        if (response.status === 201) {
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            return data;
        } else {
            throw new Error(data.error || "Invalid OTP");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};



export const resendOtp = async (email) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/resendotp/`, {
            method: "POST",
            headers: { "Content-Type": "application/json","X-CSRFToken": csrfToken, },
            credentials: "include",
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log("Resend OTP Response:", data);

        if (response.status === 200) {
            return data;  
        } else {
            throw new Error(data.error || "Failed to resend OTP");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};




export const login = async (email, password) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken, },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Login API Response:", data);

        if (response.status === 200) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            return data;
        } else {
            throw new Error(data.error || "Login failed");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};


export const logout = async () => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "X-CSRFToken": csrfToken, // Send the token for authentication
            },
            credentials: "include",
        });

        const data = await response.json();
        if (response.status === 200) {
            localStorage.removeItem("access_token"); 
            localStorage.removeItem("refresh_token");
            console.log("Logged out successfully");
            return data;
        } else {
            throw new Error(data.error || "Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};


export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
        try {
            const csrfToken = getCSRFTokenFromCookie();
            const response = await fetch(`${API_URL}/refresh/`, {
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
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
        } catch (error) {
            console.error("Error refreshing token:", error);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return { error: "Failed to refresh token" };
        }
    }
};

// Fetch User Profile
export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) return { error: "No access token found" };

        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to fetch user data" };
    }
};

// Upload Profile Image
export const uploadProfileImage = async (file) => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) return { error: "User is not authenticated." };

        const csrfToken = getCSRFTokenFromCookie();
        const formData = new FormData();
        formData.append("profile_image", file);

        const response = await fetch(`${API_URL}/upload_image/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to upload image" };
    }
};

// Update Username
export const updateUsername = async (newUsername) => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) return { error: "User is not authenticated." };

        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/update_username/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ username: newUsername }),
        });

        if (!response.ok) {
            throw new Error("Failed to update username.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to update username" };
    }
};

export const sendResetOtp = async (email) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const response = await fetch(`${API_URL}/send_reset_otp/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
            credentials: "include",
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        return data;
    } catch (error) {
        return { error: error.message || "An unexpected error occurred." };
    }
};

export const fetchMarketplaceItems = async (searchQuery = "", page = 1) => {
    try {
        const response = await fetch(`${API_URL}/marketplace/?search=${searchQuery}&page=${page}&limit=100`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // If authentication is required
        });

        if (!response.ok) {
            throw new Error("Failed to fetch marketplace items");
        }

        return await response.json(); // Backend should return { items: [], totalPages: number }
    } catch (error) {
        console.error("Error fetching marketplace items:", error);
        return { items: [], totalPages: 1 }; // Return empty array if request fails
    }
};

const getProtectedData = async () => {
    const csrfToken = getCSRFTokenFromCookie();
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/protected/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
        },
        credentials: "include",
    });
    const data = await response.json();
    return data;
};
