"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const router = useRouter(); // Redirect after verification

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log("Entered OTP:", data.otp);

    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      alert("OTP Verified! Redirecting...");
      router.push("/dashboard"); // Redirect to dashboard after OTP verification
    }, 2000);
  };
//   const res = await fetch("https://your-backend.com/api/verify-otp", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ otp: data.otp }),
//   });
//   const result = await res.json();
//   if (result.success) router.push("/dashboard");
//   else alert("Invalid OTP, try again!");
  

  const handleResend = () => {
    setResend(true);
    console.log("Resending OTP...");
    setTimeout(() => {
      setResend(false);
      alert("OTP has been resent!");
    }, 2000);
  };

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
        <h2 className="text-2xl font-bold text-center text-gray-700">Enter OTP</h2>
        <p className="text-center text-gray-500">A verification code has been sent to your email.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-center">
            <span className="text-gray-700">OTP Code</span>
            <input
              type="text"
              maxLength={6}
              {...register("otp", { required: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-center text-gray-500 focus:outline-none focus:ring-0 focus:border-transparent border-none"
              placeholder="Enter 6-digit OTP"
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-800">
          Didn't receive the OTP?{" "}
          <button
            onClick={handleResend}
            className="text-blue-600"
            disabled={resend}
          >
            {resend ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}
