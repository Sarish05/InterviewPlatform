import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

function QuantSelect() {
    const navigate = useNavigate();
    const topics = [
        "Quantitative Aptitude",
        "Logical Reasoning",
        "Number Series",
        "Data Interpretation",
        "Verbal Reasoning",
        "Analytical Reasoning",
        "Puzzles"
    ];

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

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
        navigate("/quant-logical-test", { state: { selectedTopics } });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="bg-white border-b border-gray-300 flex items-center justify-between px-10 py-4">
                <h1 className="font-semibold text-lg">PrepX</h1>
                <div className="relative flex items-center gap-x-6">
                    {/* Profile Picture Dropdown */}
                    <motion.button 
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.img
                            src={user?.image || "https://via.placeholder.com/40"}
                            alt="User"
                            className="h-10 w-10 rounded-full cursor-pointer border-2 border-white object-cover"
                        />
                    </motion.button>

                    {/* Animated Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 18 }}
                                exit={{ opacity: 0, y: -1 }}
                                className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-[180px] py-2 z-50"
                            >
                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-200 text-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Profile
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className="block px-4 py-2 hover:bg-gray-200 text-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Settings
                                </NavLink>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        window.location.href = "/login";
                                    }}
                                >
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Topic Selection with Fixed Animations */}
            <motion.div 
                className="bg-white border border-gray-300 p-6 mx-10 mt-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-lg font-semibold mb-4">Select Topics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {topics.map((topic, index) => (
                        <motion.label 
                            key={index} 
                            className="flex items-center border border-gray-300 rounded-md px-4 py-3 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTopics.includes(topic)}
                                onChange={() => handleTopicChange(topic)}
                                className="w-4 h-4 mr-2"
                            />
                            <span>{topic}</span>
                        </motion.label>
                    ))}
                </div>
            </motion.div>

            {/* Buttons with Smooth Animations */}
            <div className="flex justify-center gap-x-4 mt-6">
                <motion.button 
                    onClick={() => setSelectedTopics([])} 
                    className="border border-gray-400 text-gray-600 px-6 py-2 rounded-md"
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f3f3" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Reset Selection
                </motion.button>
                <motion.button 
                    onClick={handleStartTest} 
                    className="bg-black text-white px-6 py-2 rounded-md"
                    whileHover={{ scale: 1.05, backgroundColor: "#333" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Test
                </motion.button>
            </div>
        </div>
    );
}

export default QuantSelect;
