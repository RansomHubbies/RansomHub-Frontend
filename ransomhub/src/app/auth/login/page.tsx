"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { login } from "../../api"; 

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const router = useRouter(); 

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage("");

    try {
        // Calling the login API with email and password
        const result = await login(data.email, data.password); 
        console.log("Token received:", result);

        // Check if the login was successful and the access token is received
        if (result.access_token) {
            // Save the access token (and optionally refresh token) in localStorage
            localStorage.setItem("access_token", result.access_token); // Store access token
            localStorage.setItem("refresh_token", result.refresh_token || ""); // Store refresh token (optional)
            localStorage.setItem("username", result.username);
            // Redirect to a protected page (home/dashboard)
            router.push("/");  
        } else {
            // If the login failed, show the error message
            setErrorMessage(result.error || "Login failed. Please try again.");
        }
    } catch (error) {
        setErrorMessage("Something went wrong. Please try again.");
        console.error("API Error:", error);
    }

    setLoading(false);
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              {...register("email", { required: "Email is required", pattern: /^\S+@\S+\.\S+$/ })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs">{String(errors.email.message)}</p>}
          </label>

          <label className="block mt-4">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            
            {errors.password && <p className="text-red-500 text-xs">{String(errors.password.message)}</p>}

          </label>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-800 text-right">
          {" "}
          <Link href="/auth/reset" className="text-blue-600 hover:underline">
            Reset Password
          </Link>
        </p>
        <p className="mt-0 text-sm text-gray-800 text-right">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
        
      </div>
    </div>
  );
}
