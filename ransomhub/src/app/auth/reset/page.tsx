"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; 

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const router = useRouter(); 

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage("");
  
    try {
      const response = await fetch("https://192.168.2.233/api/users/send_reset_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }
  
      localStorage.setItem("otpEmail", data.email);
      router.push(`/auth/identity`);
    } catch (error) {
      // ✅ Fix: Explicitly check error type
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
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
        <h2 className="text-2xl font-bold text-center text-gray-700">Reset Password</h2>
        <p className="text-center text-gray-500">Enter your email to receive an OTP.</p>

        {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}

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

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
