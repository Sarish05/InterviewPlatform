import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/quant-mcqs";

function QuantTest() {
    const location = useLocation();
    const selectedTopics = location.state?.selectedTopics || [];

    const [questions, setQuestions] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes per section
    const [sectionSubmitted, setSectionSubmitted] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const topicQuery = selectedTopics.map(topic => encodeURIComponent(topic)).join(",");
                const response = await axios.get(`${API_URL}?category=${topicQuery}`);

                setQuestions(response.data);

                // Group questions by category
                const grouped = response.data.reduce((acc, question, index) => {
                    acc[question.category] = acc[question.category] || [];
                    acc[question.category].push({ ...question, index });
                    return acc;
                }, {});

                setGroupedQuestions(grouped);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error.response?.data || error.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [selectedTopics]);

    useEffect(() => {
        if (timeLeft <= 0) {
            alert("Time's up for this section! Submitting...");
            handleSubmitSection();
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleAnswerSelect = (questionId, answer) => {
        setUserAnswers({ ...userAnswers, [questionId]: answer });
    };

    const handleSubmitSection = () => {
        console.log(`Submitted answers for ${selectedTopics[currentSectionIndex]}`);
        alert(`Section "${selectedTopics[currentSectionIndex]}" Submitted!`);

        if (currentSectionIndex < selectedTopics.length - 1) {
            setCurrentSectionIndex(prev => prev + 1); // Move to the next section
            setCurrentQuestion(0); // Reset question index
            setTimeLeft(45 * 60); // Reset timer for next section
            setSectionSubmitted(false);
        } else {
            alert("All sections completed! Test finished.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading questions...</p>;

    const currentTopic = selectedTopics[currentSectionIndex];
    const currentTopicQuestions = groupedQuestions[currentTopic] || [];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side - Questions */}
            <div className="w-3/4 p-10">
                <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h1 className="font-semibold text-xl">{currentTopic} - Mock Test</h1>
                        <div className="flex items-center text-red-500 text-lg font-bold">
                            ⏳ {formatTime(timeLeft)}
                        </div>
                    </div>

                    {currentTopicQuestions.length > 0 ? (
                        <>
                            <h2 className="text-lg font-bold text-blue-700">Question {currentQuestion + 1}</h2>
                            <p className="mt-2 text-gray-700 text-lg">{currentTopicQuestions[currentQuestion].question}</p>

                            <div className="mt-4">
                                {currentTopicQuestions[currentQuestion].options.map((option, index) => (
                                    <label key={index} className="block border border-gray-300 rounded-md px-4 py-2 cursor-pointer mb-2 transition-all hover:bg-blue-100">
                                        <input
                                            type="radio"
                                            name={`answer-${currentQuestion}`}
                                            checked={userAnswers[currentTopicQuestions[currentQuestion]._id] === option}
                                            onChange={() => handleAnswerSelect(currentTopicQuestions[currentQuestion]._id, option)}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                                    className="border border-gray-400 text-gray-600 px-6 py-2 rounded-md transition hover:bg-gray-300 disabled:opacity-50"
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                    className="bg-black text-white px-6 py-2 rounded-md transition hover:bg-gray-700 disabled:opacity-50"
                                    disabled={currentQuestion === currentTopicQuestions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <button onClick={handleSubmitSection} className="bg-red-600 text-white px-6 py-2 rounded-md transition hover:bg-red-700">
                                    Submit Section
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-600">No questions available for this section.</p>
                    )}
                </div>
            </div>

            {/* Right Side - Question Panel */}
            <div className="w-1/4 p-6 bg-gray-900 text-white shadow-lg rounded-l-lg fixed right-0 top-0 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">Question Panel</h2>
                <div className="overflow-y-auto h-full px-4">
                    <h3 className="text-lg font-bold text-yellow-300">{currentTopic}</h3>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        {currentTopicQuestions.map(({ index, _id }) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 flex items-center justify-center rounded-md text-lg font-bold transition
                                    ${
                                        userAnswers[_id]
                                            ? "bg-green-500 text-white hover:bg-green-600"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-center text-gray-400 text-sm mt-6">Complete this section before moving to the next</div>
            </div>
        </div>
    );
}

export default QuantTest;
