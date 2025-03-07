"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log("Signup Data:", data);
  
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
    //   alert("Signup Successful! Redirecting to OTP verification...");
      router.push("/auth/otp"); // Redirect to OTP page
    }, 2000);
  };
//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://your-backend.com/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();
//       console.log(result);
//     } catch (error) {
//       console.error("API Error:", error);
//     }
//     setLoading(false);
//   };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
      }}>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-0 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </label>
          <label className="block mt-4">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-0 focus:border-transparent"
              placeholder="Enter your email"
            />
          </label>
          <label className="block mt-4">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              {...register("password", { required: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-0 focus:border-transparent"
              placeholder="Enter a strong password"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-800">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
