import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon_im from "./icon_google.png";
import img_side from "./k.jpeg";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import useAuthCheck from "../utils/useAuthCheck";

function Register() {

    useAuthCheck();

    const navigate = useNavigate();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agree, setAgree] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false); 

    const handleRegister = async () => {
        if (!agree) {
            toast.error("You must agree to the Terms & Conditions.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Registration successful! Redirecting...", { autoClose: 2000 });

                localStorage.setItem("user", JSON.stringify({ email: data.email, name: data.name }));
                localStorage.setItem("token", data.token);

                setTimeout(() => navigate("/dashboard"), 2000);
            } else {
                toast.error(data.message || "Registration failed!");
            }
        } catch (error) {
            toast.error("Error signing up. Please try again.");
            console.error("Error:", error);
        }
    };

    const responseGoogle = async (authResult) => {
        try {
            if (authResult?.code) {
                const result = await axios.get(`http://localhost:8080/auth/google?code=${authResult.code}`);

                localStorage.setItem("user", JSON.stringify(result.data.user));
                localStorage.setItem("token", result.data.token);

                toast.success("Google Signup Successful! Redirecting...");
                setTimeout(() => navigate("/dashboard"), 1500);
            }
        } catch (err) {
            console.error("Error while requesting Google signup:", err);
            toast.error("Google signup failed. Try again.");
        }
    };

    const googleSignup = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => {
            console.error("Google Signup Error:", error);
            toast.error("Google Signup Failed!");
        },
        flow: "auth-code",
    });

    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 h-full relative">
                <img src={img_side} className="w-full h-full object-cover" alt="Background" />

                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { staggerChildren: 0.3 } }}
                >
                    <motion.h1
                        className="text-white text-4xl font-bold mb-2"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
                    >
                        Your Journey Starts Here.
                    </motion.h1>
                    <motion.h1
                        className="text-yellow-400 text-4xl font-bold mb-2"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
                    >
                        Prepare with AI.
                    </motion.h1>
                    <motion.h1
                        className="text-white text-4xl font-bold"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
                    >
                        Ace Every Interview.
                    </motion.h1>
                </motion.div>
            </div>

            <div className="w-1/2 h-full bg-white flex flex-col p-14 justify-center items-center">
                <h1 className="max-w-[500px] text-xl text-[#060606] font-semibold mr-auto mb-8">
                    PrepX
                </h1>

                <div className="w-full flex flex-col max-w-[400px]">
                    <h3 className="text-3xl font-semibold mb-4">Register</h3>
                    <p className="text-base mb-4">Create an account to get started.</p>
                    
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none"
                    />

                    <div className="w-full flex items-center justify-between my-2">
                        <label className="flex items-center text-sm">
                            <input 
                                type="checkbox" 
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                className="w-4 h-4 mr-2" 
                            />
                            I agree to the{" "}
                            <span
                                className="text-black cursor-pointer underline ml-1"
                                onClick={() => setIsTermsOpen(true)}
                            >
                                Terms & Conditions
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={handleRegister}
                        className={`w-full text-white font-semibold rounded-md p-4 ${
                            agree ? "bg-black" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!agree}
                    >
                        Sign Up
                    </button>

                    <div className="w-full flex items-center justify-center my-4 relative">
                        <div className="w-full h-[1px] bg-black"></div>
                        <p className="absolute bg-white px-2">or</p>
                    </div>

                    <button
                        onClick={googleSignup}
                        className="w-full flex items-center justify-center border border-black p-4 rounded-md"
                    >
                        <img src={icon_im} className="h-6 mr-2" alt="OAuth" />
                        Sign Up with Google
                    </button>
                </div>

                <p className="text-sm mt-4">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="font-semibold underline cursor-pointer">
                        Log in
                    </span>
                </p>

                {isTermsOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <div className="max-h-60 overflow-y-auto mt-4 text-gray-700">
                            <p>
                                Welcome to PrepX! By using our platform, you agree to the following
                                terms and conditions:
                            </p>
                            <ul className="list-disc ml-6 mt-2">
                                <li>You must be 18 years or older to register.</li>
                                <li>Your data will be securely stored and not shared.</li>
                                <li>Any misuse of our platform will lead to account suspension.</li>
                                <li>These terms are subject to change at any time.</li>
                            </ul>
                            <p className="mt-2">For more details, contact support@prepx.com.</p>
                        </div>
                            <button className="mt-4 w-full bg-black text-white py-2 rounded-md" onClick={() => setIsTermsOpen(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;