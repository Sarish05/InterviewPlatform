import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("Both fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset successful! Redirecting...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(data.message || "Failed to reset password.");
            }
        } catch (error) {
            toast.error("Error resetting password. Please try again.");
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
                <p className="text-gray-600 text-center mt-2">
                    Enter a new password for your account.
                </p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full mt-4 p-3 border border-gray-300 rounded-md outline-none"
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md outline-none"
                />

                <button
                    onClick={handleResetPassword}
                    className={`w-full mt-4 py-3 text-white font-semibold rounded-md ${
                        isLoading ? "bg-gray-400" : "bg-black"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Back to{" "}
                    <a href="/login" className="text-black hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;
