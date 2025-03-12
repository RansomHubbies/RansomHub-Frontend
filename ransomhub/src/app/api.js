const API_URL = "http://127.0.0.1:8000/api/users";

export const signup = async (username, email, password,phone) => {
    try {
        const response = await fetch(`${API_URL}/signup/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
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
            localStorage.setItem("token", data.token); 
            return data;
        } else {
            throw new Error(data.error || "Login failed");
        }
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};


export const logout = async (token) => {
    try {
        const response = await fetch(`${API_URL}/logout/`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Logout failed");
        return response.json();
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
};
