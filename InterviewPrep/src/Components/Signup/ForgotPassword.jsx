import React, { useState } from "react";
import { toast } from "react-toastify";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset link sent to your email.");
            } else {
                toast.error(data.message || "Failed to send reset link.");
            }
        } catch (error) {
            toast.error("Error sending reset link. Please try again.");
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Forgot Password</h2>
                <p className="text-gray-600 text-center mt-2">
                    Enter your email below to receive a password reset link.
                </p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full mt-4 p-3 border border-gray-300 rounded-md outline-none"
                />

                <button
                    onClick={handleForgotPassword}
                    className={`w-full mt-4 py-3 text-white font-semibold rounded-md ${
                        isLoading ? "bg-gray-400" : "bg-black"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Remember your password?{" "}
                    <a href="/login" className="text-black hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
