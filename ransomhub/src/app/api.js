// const API_URL = "http://127.0.0.1:8000/api";
const API_URL = "https://192.168.2.233/api";


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
        const response = await fetch(`${API_URL}/users/signup/`, {
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
        const response = await fetch(`${API_URL}/users/verifyotp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,  
            },
            credentials: "include",
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

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
        const response = await fetch(`${API_URL}/users/resendotp/`, {
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
        const response = await fetch(`${API_URL}/users/login/`, {
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
        const response = await fetch(`${API_URL}/users/logout/`, {
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
            const response = await fetch(`${API_URL}/users/refresh/`, {
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
        const response = await fetch(`${API_URL}/users/profile`, {
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

        const response = await fetch(`${API_URL}/users/upload_image/`, {
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
        const response = await fetch(`${API_URL}/users/update_username/`, {
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
        const response = await fetch(`${API_URL}/users/send_reset_otp/`, {
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


const getProtectedData = async () => {
    const csrfToken = getCSRFTokenFromCookie();
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/users/protected/`, {
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

export const fetchMarketplaceItems = async (
    searchQuery = '', 
    page = 1, 
    category = '', 
    minPrice = null, 
    maxPrice = null
  ) => {
      try {
          const token = localStorage.getItem("access_token");
          const csrfToken = getCSRFTokenFromCookie();
  
          // Construct query parameters
          const params = new URLSearchParams({
              search: searchQuery,
              page: page,
              ...(category && { category }),
              ...(minPrice !== null && { min_price: minPrice }),
              ...(maxPrice !== null && { max_price: maxPrice })
          });
  
          const response = await fetch(`${API_URL}/marketplace/items/?${params}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  ...(token && { "Authorization": `Bearer ${token}` }),
                  "X-CSRFToken": csrfToken,
              },
              credentials: "include"
          });
  
          if (!response.ok) {
              throw new Error("Failed to fetch marketplace items.");
          }
  
          return await response.json();
      } catch (error) {
          return { error: error.message || "Failed to fetch marketplace items" };
      }
  };
  
  export const getMyItems = async () => {
      try {
          const token = localStorage.getItem("access_token");
          const csrfToken = getCSRFTokenFromCookie();
  
          if (!token) return { error: "User is not authenticated." };
  
          const response = await fetch(`${API_URL}/marketplace/items/my_items/`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-CSRFToken": csrfToken,
              },
              credentials: "include"
          });
  
          if (!response.ok) {
              throw new Error("Failed to fetch user's items.");
          }
  
          return await response.json();
      } catch (error) {
          return { error: error.message || "Failed to fetch user's items" };
      }
  };
  
  export const markItemAsSold = async (itemId) => {
      try {
          const token = localStorage.getItem("access_token");
          const csrfToken = getCSRFTokenFromCookie();
  
          if (!token) return { error: "User is not authenticated." };
  
          const response = await fetch(`${API_URL}/marketplace/items/${itemId}/mark_as_sold/`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-CSRFToken": csrfToken,
              },
              credentials: "include"
          });
  
          if (!response.ok) {
              throw new Error("Failed to mark item as sold.");
          }
  
          return await response.json();
      } catch (error) {
          return { error: error.message || "Failed to mark item as sold" };
      }
  };

  export const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const csrfToken = getCSRFTokenFromCookie();
  
      const response = await fetch(`${API_URL}/marketplace/categories/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
          "X-CSRFToken": csrfToken,
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };
  
  export const createMarketplaceItem = async (itemData) => {
    try {
      const token = localStorage.getItem("access_token");
      const csrfToken = getCSRFTokenFromCookie();
  
      const response = await fetch(`${API_URL}/marketplace/items/`, {
        method: 'POST',
        body: itemData,
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` }),
          "X-CSRFToken": csrfToken,
        },
        credentials: "include"
      });
  
      if (!response.ok) {
        // Try to parse error response
        const errorResponse = await response.json().catch(() => null);
        throw new Error(errorResponse?.detail || 'Failed to create marketplace item');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating marketplace item:', error);
      throw error;
    }
  };

  export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        const response = await fetch(`${API_URL}/admins/users/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to fetch users" };
    }
};

// Remove user
export const removeUser = async (userId) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        const response = await fetch(`${API_URL}/admins/users/${userId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to remove user.");
        }

        return { success: true };
    } catch (error) {
        return { error: error.message || "Failed to remove user" };
    }
};

// Toggle user suspension
export const toggleUserSuspension = async (userId, isSuspended) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        const response = await fetch(`${API_URL}/admins/users/${userId}/toggle_suspension/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ is_suspended: !isSuspended }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to toggle user suspension.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to toggle user suspension" };
    }
};

export const fetchActivityLogs = async (filters = {}) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        // Construct query parameters
        const queryParams = new URLSearchParams();
        
        if (filters.action_type) {
            queryParams.append('action_type', filters.action_type);
        }
        
        if (filters.start_date) {
            queryParams.append('start_date', filters.start_date);
        }
        
        if (filters.end_date) {
            queryParams.append('end_date', filters.end_date);
        }

        // Construct the full URL with query parameters
        const url = `${API_URL}/admins/logs/?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        });
        console.log(response)
        if (!response.ok) {
            throw new Error("Failed to fetch activity logs.");
        }

        return await response.json();
    } catch (error) {
        return { 
            error: error.message || "Failed to fetch activity logs",
            logs: []
        };
    }
};
export const verifyIdentity = async (email, otp, newPassword) => {
    try {
      const url= `${API_URL}/users/identityverify/`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Invalid OTP or password reset failed.");
      }
  
      return result;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Something went wrong.");
    }
  };

  export const Identity = async (file) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        // Create FormData to send file
        const formData = new FormData();
        formData.append('identity_proof', file);

        const response = await fetch(`${API_URL}/users/verify_identity/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': csrfToken,
            },
            credentials: "include"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Verification submission failed");
        }

        return await response.json();
    } catch (error) {
        return { 
            error: error.message || "Network error. Please try again.",
        };
    }
};

// View user verification documents
export const viewVerificationDocs = async (userId) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        const response = await fetch(`${API_URL}/admins/verification_docs/${userId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to retrieve verification documents.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to view verification documents" };
    }
};

// Disapprove user
export const disapproveUser = async (userId) => {
    try {
        const token = localStorage.getItem("access_token");
        const csrfToken = getCSRFTokenFromCookie();

        if (!token) return { error: "User is not authenticated." };

        const response = await fetch(`${API_URL}/admins/disapprove/${userId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to disapprove user.");
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Failed to disapprove user" };
    }
};


export const fetchItemDetails = async (itemId) => {
    try {
      const token = localStorage.getItem("access_token");
      const csrfToken = getCSRFTokenFromCookie();
  
      const response = await fetch(`${API_URL}/marketplace/items/${itemId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
          "X-CSRFToken": csrfToken,
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        // Handle specific error responses
        if (response.status === 401) {
          throw new Error('Authentication required');
        } else if (response.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error('Failed to fetch item details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching item details:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  export const sendPaymentOtp = async (itemId, email) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const token = localStorage.getItem("access_token");
        
        const response = await fetch(`${API_URL}/payments/send-otp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({itemId,email}),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error || "Failed to send payment verification OTP");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong sending the verification code" };
    }
};

// Function to verify payment OTP
export const verifyPaymentOtp = async (itemId, otp) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const token = localStorage.getItem("access_token");
        
        const response = await fetch(`${API_URL}/payments/verify-otp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ itemId, otp }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error || "Invalid verification code");
        }
    } catch (error) {
        return { error: error.message || "Verification failed" };
    }
};

// Function to resend payment OTP
export const resendPaymentOtp = async (itemId) => {
    try {
        const csrfToken = getCSRFTokenFromCookie();
        const token = localStorage.getItem("access_token");
        
        const response = await fetch(`${API_URL}/payments/resend-otp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ itemId }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error || "Failed to resend verification code");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong resending the code" };
    }
};