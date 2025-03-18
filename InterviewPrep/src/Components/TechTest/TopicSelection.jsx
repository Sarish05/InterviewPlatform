import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigate to Test Page
import { motion } from "framer-motion";
import img_con from "./pat.png";
import useAuthCheck from "../utils/useAuthCheck";

function TopicSelection() {

    
    /* useAuthCheck(); */


    const navigate = useNavigate();
    const topics = [
        "Data Structures",
        "Algorithms",
        "System Design",
        "Database Management",
        "Web Development",
        "Machine Learning",
        "Computer Networks",
    ];

    const [selectedTopics, setSelectedTopics] = useState([]);

    const handleTopicChange = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleStartTest = () => {
        if (selectedTopics.length === 0) {
            alert("Please select at least one topic.");
            return;
        }
        navigate("/tech-mcq-test", { state: { selectedTopics } }); // Pass topics to TestPage
    };

    
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser || storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log("User Data from LocalStorage:", parsedUser); 
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login"); 
            }
        } else {
            console.log("No user found, redirecting to login...");
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white border-b border-gray-300 flex items-center justify-between px-10 py-4">
                <h1 className="font-semibold text-lg">AI-Based Interview Platform</h1>
                <div className="flex items-center gap-x-6">
                    <img src={img_con} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300" />
                    <button onClick={handleLogout} className="bg-black text-white text-[16px] px-4 py-2 rounded">Sign Out</button>
                </div>
            </div>

            <div className="bg-white border border-gray-300 p-6 mx-10 mt-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Select Topics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {topics.map((topic, index) => (
                        <label key={index} className="flex items-center border border-gray-300 rounded-md px-4 py-3 cursor-pointer">
                            <input type="checkbox" checked={selectedTopics.includes(topic)}
                                onChange={() => handleTopicChange(topic)} className="w-4 h-4 mr-2"/>
                            <span>{topic}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-x-4 mt-6">
                <button onClick={() => setSelectedTopics([])} className="border border-gray-400 text-gray-600 px-6 py-2 rounded-md">
                    Reset Selection
                </button>
                <button onClick={handleStartTest} className="bg-black text-white px-6 py-2 rounded-md">
                    Start Mock Interview
                </button>
            </div>
        </div>
    );
}

export default TopicSelection;
