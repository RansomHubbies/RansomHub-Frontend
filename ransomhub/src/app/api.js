// const API_URL = "http://127.0.0.1:8000/api/users";
const API_URL = "https://192.168.2.233/api/users";

export const signup = async (name,username, email, password,phone) => {
    try {
        const response = await fetch(`${API_URL}/signup/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];  

        const response = await fetch(`${API_URL}/verifyotp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,  
            },
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
        const response = await fetch(`${API_URL}/resend-otp/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const response = await fetch(`${API_URL}/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const response = await fetch(`${API_URL}/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`, // Send the token for authentication
            },
        });

        const data = await response.json();
        if (response.status === 200) {
            localStorage.removeItem("token"); 
            console.log("Logged out successfully");
            return data;
        } else {
            throw new Error(data.error || "Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};

const getProtectedData = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/protected/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
};
const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    const response = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();
    if (response.status === 200) {
        // Store the new access token
        localStorage.setItem("access_token", data.access_token);
        return data;
    } else {
        throw new Error(data.error || "Failed to refresh token");
    }
};
