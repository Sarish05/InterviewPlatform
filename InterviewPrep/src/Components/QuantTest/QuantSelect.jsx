// QuantSelect.jsx - Quantitative Aptitude & Logical Reasoning
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                <h1 className="font-semibold text-lg">AI-Based Interview Platform</h1>
                <div className="flex items-center gap-x-6">
                    {/* Comment out or replace with actual image */}
                    {/* <img src={img_con} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300" /> */}
                    <button className="bg-black text-white text-[16px] px-4 py-2 rounded">Sign Out</button>
                </div>
            </div>

            {/* Topic Selection */}
            <div className="bg-white border border-gray-300 p-6 mx-10 mt-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Select Topics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {topics.map((topic, index) => (
                        <label key={index} className="flex items-center border border-gray-300 rounded-md px-4 py-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedTopics.includes(topic)}
                                onChange={() => handleTopicChange(topic)}
                                className="w-4 h-4 mr-2"
                            />
                            <span>{topic}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-x-4 mt-6">
                <button onClick={() => setSelectedTopics([])} className="border border-gray-400 text-gray-600 px-6 py-2 rounded-md">
                    Reset Selection
                </button>
                <button onClick={handleStartTest} className="bg-black text-white px-6 py-2 rounded-md">
                    Start Test
                </button>
            </div>
        </div>
    );
}

export default QuantSelect;
