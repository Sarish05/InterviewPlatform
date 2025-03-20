import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import img_con from "./pat.png";
import { NavLink } from "react-router-dom"; 

function TopicSelection() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    const topics = {
        technical: [
            "Data Structures",
            "Algorithms",
            "System Design",
            "Database Management",
            "Web Development",
            "Machine Learning",
            "Computer Networks",
        ],
        quantitative: [
            "Quantitative Aptitude",
            "Logical Reasoning",
            "Number Series",
            "Data Interpretation",
            "Verbal Reasoning",
            "Analytical Reasoning",
            "Puzzles"
        ]
    };

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser || storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

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

        // Always navigate to the merged test page regardless of topic types
        navigate("/comprehensive-test", { state: { selectedTopics } });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-black p-6"
        >
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 border-b border-gray-200 flex items-center justify-between px-10 py-4 rounded-lg shadow-lg"
            >
                <h1 className="font-bold text-xl">PrepX</h1>
                <div className="flex items-center gap-x-6">
                    <NavLink to="/dashboard" className="text-gray-700 hover:text-black transition-colors">
                        Dashboard
                    </NavLink>
                    <NavLink to="/interviews" className="text-gray-700 hover:text-black transition-colors">
                        History
                    </NavLink>
                    <motion.div className="relative">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <motion.img
                            src={user?.image || img_con}
                            alt="User"
                            className="h-10 w-10 rounded-full cursor-pointer border-2 border-gray-200 object-cover"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            />
                        </button>

                        {/* Animated Dropdown Menu */}
                        <AnimatePresence>
                            {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 18 }}
                                exit={{ opacity: 0, y: -1 }}
                                className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-[180px] py-2 z-50 border border-gray-200"
                            >
                                <NavLink
                                to="/profile"
                                className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                                onClick={() => setIsOpen(false)}
                                >
                                My Profile
                                </NavLink>
                                <NavLink
                                to="/settings"
                                className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                                onClick={() => setIsOpen(false)}
                                >
                                Settings
                                </NavLink>
                                <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                                onClick={handleLogout}
                                >
                                Sign Out
                                </button>
                            </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 border border-gray-200 p-6 mx-10 mt-6 rounded-xl shadow-md"
            >
                <h2 className="text-lg font-semibold mb-4">Select Topics for Your Mock Interview</h2>
                <p className="text-gray-600 mb-4">Choose from both technical and quantitative topics for a comprehensive assessment.</p>
                
                <div className="mb-6">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                        <span className="h-3 w-3 rounded-full bg-black mr-2"></span>
                        Technical Topics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {topics.technical.map((topic, index) => (
                            <motion.label 
                                key={`tech-${index}`} 
                                className="flex items-center border border-gray-200 rounded-md px-4 py-3 cursor-pointer"
                                whileHover={{ scale: 1.03, backgroundColor: "#f5f5f5" }}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedTopics.includes(topic)}
                                    onChange={() => handleTopicChange(topic)} 
                                    className="w-4 h-4 mr-2 accent-black"
                                />
                                <span>{topic}</span>
                            </motion.label>
                        ))}
                    </div>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                        <span className="h-3 w-3 rounded-full bg-black mr-2"></span>
                        Quantitative Topics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {topics.quantitative.map((topic, index) => (
                            <motion.label 
                                key={`quant-${index}`} 
                                className="flex items-center border border-gray-200 rounded-md px-4 py-3 cursor-pointer"
                                whileHover={{ scale: 1.03, backgroundColor: "#f5f5f5" }}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedTopics.includes(topic)}
                                    onChange={() => handleTopicChange(topic)} 
                                    className="w-4 h-4 mr-2 accent-black"
                                />
                                <span>{topic}</span>
                            </motion.label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-x-4 mt-8">
                    <motion.button 
                        onClick={() => setSelectedTopics([])} 
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
                        whileHover={{ scale: 1.05, backgroundColor: "#f5f5f5" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset Selection
                    </motion.button>
                    <motion.button 
                        onClick={handleStartTest} 
                        className="bg-black text-white font-medium px-6 py-2 rounded-md"
                        whileHover={{ scale: 1.05, backgroundColor: "#333333" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Mock Interview
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default TopicSelection;