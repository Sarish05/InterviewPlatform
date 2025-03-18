import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/mcqs"; // Backend API URL

function TestPage() {
    const location = useLocation();
    const selectedTopics = location.state?.selectedTopics || [];

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes timer

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                console.log("Fetching questions for:", selectedTopics);
                const topicQuery = selectedTopics.map(topic => encodeURIComponent(topic)).join(",");
                const response = await axios.get(`${API_URL}?category=${topicQuery}`);
                console.log("Fetched Questions:", response.data);
                setQuestions(response.data);
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
            alert("Time's up! Submitting the test...");
            handleSubmitTest();
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

    const handleSubmitTest = () => {
        console.log("User Answers:", userAnswers);
        alert("Test Submitted! Your responses have been recorded.");
    };

    const handleQuestionSelect = (index) => {
        setCurrentQuestion(index);
    };

    if (loading) return <p className="text-center mt-10">Loading questions...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-3/4 p-10">
                <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h1 className="font-semibold text-xl">Mock Test</h1>
                                            <div className="flex items-center text-red-500 text-lg font-bold">
                        <span className="inline-block animate-spin-slow mr-2">⏳</span> {formatTime(timeLeft)}
                    </div>
                    </div>

                    {questions.length > 0 ? (
                        <>
                            <h2 className="text-lg font-bold text-blue-700">Question {currentQuestion + 1}</h2>
                            <p className="mt-2 text-gray-700 text-lg">{questions[currentQuestion].question}</p>

                            <div className="mt-4">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <label key={index} className="block border border-gray-300 rounded-md px-4 py-2 cursor-pointer mb-2 transition-all hover:bg-blue-100">
                                        <input
                                            type="radio"
                                            name={`answer-${currentQuestion}`}
                                            checked={userAnswers[questions[currentQuestion]._id] === option}
                                            onChange={() => handleAnswerSelect(questions[currentQuestion]._id, option)}
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
                                    disabled={currentQuestion === questions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <button onClick={handleSubmitTest} className="bg-red-600 text-white px-6 py-2 rounded-md transition hover:bg-red-700">
                                    Submit Test
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-600">No questions available for selected topics.</p>
                    )}
                </div>
            </div>

            <div className="w-1/4 p-6 bg-gray-900 text-white shadow-lg rounded-l-lg fixed right-0 top-0 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">Question Panel</h2>
                <div className="grid grid-cols-5 gap-2 px-4">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuestionSelect(index)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md text-lg font-bold transition
                                ${
                                    userAnswers[questions[index]._id]
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="text-center text-gray-400 text-sm mt-6">Click a question to revisit</div>
            </div>
        </div>
    );
}

export default TestPage;
