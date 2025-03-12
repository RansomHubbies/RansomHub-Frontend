"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/app/api";

export default function OtpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Added error state
  const router = useRouter(); // Redirect after verification
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");  // ✅ Retrieve stored email
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in localStorage. Redirecting to signup.");
      router.push("/auth/signup");  // ✅ Redirect user if no email is found
    }
  }, [router]);

  const onSubmit = async (data: any) => {
      setLoading(true);
      setErrorMessage("");
      try {
        console.log(data.email)
        const result = await verifyOtp(email, data.otp);
        console.log(result.token)
        if (result.email) {
          localStorage.setItem("token", result.token);
          localStorage.removeItem("otpEmail");
          router.push("/");
        } else {
          setErrorMessage(result.error || "OTP failed. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again.");
        console.error("API Error:", error);
      }
      setLoading(false);
    };

  const handleResend = async () => {
    setResend(true);
    setErrorMessage(""); // Reset error message

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/resendotp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (result.email) {
        alert("OTP has been resent to your email.");
      } else {
        setErrorMessage(result.error || "Failed to resend OTP.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Resend OTP Error:", error);
    }
    setResend(false);
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
        <h2 className="text-2xl font-bold text-center text-gray-700">Enter OTP</h2>
        <p className="text-center text-gray-500">A verification code has been sent to your email.</p>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-center">
            <span className="text-gray-700">OTP Code</span>
            <input
              type="text"
              maxLength={6}
              {...register("otp", { required: "OTP is required", minLength: 6, maxLength: 6 })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-center text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6-digit OTP"
              disabled={loading}
            />
            {errors.otp && <p className="text-red-500 text-xs">{String(errors.otp.message)}</p>}
          </label>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-800">
          Didn't receive the OTP?{" "}
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline"
            disabled={resend}
          >
            {resend ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}
