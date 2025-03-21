import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// Helper function for safe comparison
const safeCompare = (a, b) => {
    if (a === undefined || b === undefined) return false;
    
    // If either value is an object with a value property (from MongoDB/mongoose), extract the value
    const valueA = typeof a === 'object' && a !== null && 'value' in a ? a.value : a;
    const valueB = typeof b === 'object' && b !== null && 'value' in b ? b.value : b;
    
    // Convert to strings and trim whitespace
    return String(valueA).trim().toLowerCase() === String(valueB).trim().toLowerCase();
};

function ComprehensiveTest() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedTopics = location.state?.selectedTopics || [];

    const [sections, setSections] = useState([]);
    const [currentSection, setCurrentSection] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes per section
    const [testCompleted, setTestCompleted] = useState(false);
    const [results, setResults] = useState({});
    const [sectionStartTime, setSectionStartTime] = useState(0);
    const [questionTimes, setQuestionTimes] = useState({});
    const [lastQuestionTimestamp, setLastQuestionTimestamp] = useState(null);
    const [showAnswerDetails, setShowAnswerDetails] = useState(false);
    const [selectedResultTopic, setSelectedResultTopic] = useState(null);
    const [expandedTracker, setExpandedTracker] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const topicsString = selectedTopics.join(",");
                
                // Determine which topics are technical vs quantitative
                const technicalTopics = ["Data Structures", "Algorithms", "System Design", 
                    "Database Management", "Web Development", "Machine Learning", "Computer Networks"];
                
                // Fetch both types of questions
                const promises = [];
                const techTopics = selectedTopics.filter(topic => technicalTopics.includes(topic));
                const quantTopics = selectedTopics.filter(topic => !technicalTopics.includes(topic));
                
                if (techTopics.length > 0) {
                    const techPromise = axios.get(`http://localhost:8080/api/mcqs?category=${techTopics.join(",")}`);
                    promises.push(techPromise);
                }
                
                if (quantTopics.length > 0) {
                    const quantPromise = axios.get(`http://localhost:8080/api/quant-mcqs?category=${quantTopics.join(",")}`);
                    promises.push(quantPromise);
                }
                
                const responses = await Promise.all(promises);
                
                // Combine all questions from both APIs
                let allQuestions = [];
                responses.forEach(res => {
                    if (res.data && Array.isArray(res.data)) {
                        // Map backend field 'answer' to 'correctAnswer' for consistency
                        const mappedData = res.data.map(question => ({
                            ...question,
                            correctAnswer: question.answer
                        }));
                        allQuestions = [...allQuestions, ...mappedData];
                    }
                });
                
                // Group questions by topic
                const groupedSections = selectedTopics.map(topic => ({
                    topic,
                    questions: allQuestions.filter(q => q.category === topic)
                })).filter(section => section.questions.length > 0);
                
                setSections(groupedSections);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setLoading(false);
            }
        };

        if (selectedTopics.length > 0) {
            fetchQuestions();
        }
    }, [selectedTopics]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (sections[currentSection]) {
                alert(`Time's up for ${sections[currentSection].topic}! Moving to the next section...`);
                handleSubmitSection();
            }
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, currentSection]);

    useEffect(() => {
        if (sections.length > 0 && currentSection === 0) {
            setSectionStartTime(Date.now());
            setLastQuestionTimestamp(Date.now());
        }
    }, [sections]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleAnswerSelect = (questionId, answer) => {
        const now = Date.now();
        
        // Record time taken to answer this question
        if (lastQuestionTimestamp) {
            const timeTaken = (now - lastQuestionTimestamp) / 1000; // in seconds
            setQuestionTimes(prev => ({
                ...prev,
                [questionId]: timeTaken
            }));
        }
        
        setLastQuestionTimestamp(now);
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmitSection = () => {
        // Calculate score for current section
        const currentSectionQuestions = sections[currentSection].questions;
        let correctAnswers = 0;
        const sectionEndTime = Date.now();
        const totalSectionTime = (sectionEndTime - sectionStartTime) / 1000; // in seconds
        
        const sectionAnswers = {};
        
        currentSectionQuestions.forEach(question => {
            const userAnswer = userAnswers[question._id];
            // Use the safe compare function
            const isCorrect = safeCompare(userAnswer, question.correctAnswer);
            if (isCorrect) correctAnswers++;
            
            sectionAnswers[question._id] = {
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                timeTaken: questionTimes[question._id] || 0,
                options: question.options
            };
        });

        const score = Math.round((correctAnswers / currentSectionQuestions.length) * 100);
        const avgResponseTime = Object.values(questionTimes)
            .filter(time => currentSectionQuestions.some(q => questionTimes[q._id] === time))
            .reduce((sum, time) => sum + time, 0) / currentSectionQuestions.length || 0;
        
        // Update results
        const sectionResult = {
            score,
            totalQuestions: currentSectionQuestions.length,
            correctAnswers,
            totalTime: totalSectionTime,
            avgResponseTime,
            answers: sectionAnswers
        };
        
        setResults(prev => ({
            ...prev,
            [sections[currentSection].topic]: sectionResult
        }));

        if (currentSection < sections.length - 1) {
            setCurrentSection(prev => prev + 1);
            setCurrentQuestion(0);
            setTimeLeft(45 * 60); // Reset timer for new section
            setSectionStartTime(Date.now()); // Reset section start time
            setLastQuestionTimestamp(Date.now()); // Reset question timestamp
        } else {
            setTestCompleted(true);
            
            // Optional: Send results to backend for analytics
            // This could be implemented if you want to track user performance
            /*
            try {
                axios.post("http://localhost:8080/api/test-results", {
                    userId: "user-id-here", // Would need authentication integration
                    testType: "comprehensive",
                    topics: selectedTopics,
                    results: {
                        ...prev,
                        [sections[currentSection].topic]: sectionResult
                    },
                    totalScore: score,
                    completedAt: new Date()
                });
            } catch (error) {
                console.error("Failed to save test results:", error);
            }
            */
        }
    };

    const handleQuestionSelect = (index) => {
        setCurrentQuestion(index);
    };

    const handleReturnToTopics = () => {
        navigate('/');
    };

    const handleViewAnswers = (topic) => {
        setSelectedResultTopic(topic);
        setShowAnswerDetails(true);
    };

    const handleCloseAnswerDetails = () => {
        setShowAnswerDetails(false);
        setSelectedResultTopic(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-10"
                >
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading your personalized test...</p>
                </motion.div>
            </div>
        );
    }

    if (testCompleted) {
        // Calculate overall score and stats
        const overallScore = Object.values(results).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(results).length;
        const totalQuestions = Object.values(results).reduce((acc, curr) => acc + curr.totalQuestions, 0);
        const totalCorrect = Object.values(results).reduce((acc, curr) => acc + curr.correctAnswers, 0);
        const totalTime = Object.values(results).reduce((acc, curr) => acc + (curr.totalTime || 0), 0);
        const avgTime = Object.values(results).reduce((acc, curr) => acc + (curr.avgResponseTime || 0), 0) / Object.keys(results).length;
        
        return (
            <>
                {showAnswerDetails && selectedResultTopic ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen bg-gray-50 p-6 md:p-10"
                    >
                        <div className="max-w-4xl mx-auto">
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                            >
                                <div className="bg-black p-4 text-white flex justify-between items-center">
                                    <h1 className="text-xl font-bold">{selectedResultTopic} - Detailed Review</h1>
                                    <button 
                                        onClick={handleCloseAnswerDetails}
                                        className="bg-white bg-opacity-20 p-2 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b">
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                            <span className="text-sm">Correct Answer</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                            <span className="text-sm">Your Incorrect Answer</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                                            <span className="text-sm">Unused Option</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        {Object.entries(results[selectedResultTopic].answers).map(([id, data], qIndex) => {
                                            return (
                                                <motion.div 
                                                    key={id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: qIndex * 0.1 }}
                                                    className="border border-gray-200 rounded-lg p-5"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-medium">
                                                            <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                                                                {qIndex + 1}
                                                            </span>
                                                            {data.question}
                                                        </h3>
                                                        <div className="flex flex-col items-end">
                                                            <span className={`text-xs rounded-full px-2 py-1 ${data.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {data.isCorrect ? 'Correct' : 'Incorrect'}
                                                            </span>
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                {Math.round(data.timeTaken)} seconds
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        {data.options.map((option, index) => {
                                                            const isCorrectAnswer = safeCompare(option, data.correctAnswer);
                                                            const isUserAnswer = safeCompare(option, data.userAnswer);
                                                            const isIncorrectUserAnswer = isUserAnswer && !data.isCorrect;
                                                            
                                                            return (
                                                                <div 
                                                                    key={index}
                                                                    className={`py-2 px-3 rounded-md ${
                                                                        isCorrectAnswer
                                                                            ? 'bg-green-100 border-l-4 border-green-500'
                                                                            : isIncorrectUserAnswer
                                                                            ? 'bg-red-100 border-l-4 border-red-500'
                                                                            : 'bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {option}
                                                                    {isCorrectAnswer && (
                                                                        <span className="ml-2 text-green-600 text-sm font-medium">✓ Correct Answer</span>
                                                                    )}
                                                                    {isIncorrectUserAnswer && (
                                                                        <span className="ml-2 text-red-600 text-sm font-medium">✗ Your Answer</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-8 flex justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCloseAnswerDetails}
                                            className="px-6 py-3 rounded-md font-medium bg-black text-white"
                                        >
                                            Back to Results
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen bg-gray-50 p-6 md:p-10"
                    >
                        <div className="max-w-7xl mx-auto">
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                            >
                                {/* Header with pattern */}
                                <div className="relative bg-black p-8 text-white">
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="absolute top-0 left-0 w-full h-full"
                                        style={{ 
                                            backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 10L20 20M40 40L50 50M10 50L20 40M40 20L50 10\" stroke=\"white\" stroke-width=\"1\" stroke-opacity=\"0.15\"/></svg>')",
                                            backgroundSize: "60px 60px"
                                        }}
                                    />
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <motion.h1 
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-3xl md:text-4xl font-bold"
                                            >
                                                Test Completed
                                            </motion.h1>
                                            <motion.p
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-gray-300 mt-1"
                                            >
                                                {Object.keys(results).length} sections • {totalQuestions} questions
                                            </motion.p>
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                                            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-full p-6"
                                        >
                                            <div className="text-5xl font-bold text-center">{Math.round(overallScore)}%</div>
                                            <div className="text-sm uppercase tracking-wider text-center mt-1">Overall</div>
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Time & Accuracy Analysis */}
                                <div className="p-6 border-b">
                                    <motion.h2 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xl font-semibold mb-4 text-gray-800"
                                    >
                                        Time & Accuracy Analysis
                                    </motion.h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-gray-50 rounded-lg p-4 text-center"
                                        >
                                            <div className="text-sm text-gray-500 mb-1">Total Time</div>
                                            <div className="text-2xl font-bold">{Math.floor(totalTime / 60)}m {Math.round(totalTime % 60)}s</div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="bg-gray-50 rounded-lg p-4 text-center"
                                        >
                                            <div className="text-sm text-gray-500 mb-1">Avg. Response Time</div>
                                            <div className="text-2xl font-bold">{Math.round(avgTime)} seconds</div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="bg-gray-50 rounded-lg p-4 text-center"
                                        >
                                            <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                                            <div className="text-2xl font-bold">{Math.round((totalCorrect / totalQuestions) * 100)}%</div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="bg-gray-50 rounded-lg p-4 text-center"
                                        >
                                            <div className="text-sm text-gray-500 mb-1">Questions</div>
                                            <div className="text-2xl font-bold">{totalCorrect} / {totalQuestions}</div>
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Results Content - Horizontal Scrolling Layout */}
                                <div className="p-6 md:p-8">
                                    <motion.h2 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2"
                                    >
                                        Performance by Topic
                                    </motion.h2>
                                    
                                    <div className="overflow-x-auto">
                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex space-x-6 pb-4 min-w-max"
                                        >
                                            {Object.entries(results).map(([topic, data], index) => (
                                                <motion.div 
                                                    key={topic}
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                                    className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow w-72"
                                                    whileHover={{ y: -5 }}
                                                >
                                                    <h3 className="font-medium text-lg mb-3 truncate">{topic}</h3>
                                                    
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-sm text-gray-500">Score</div>
                                                        <div className={`text-2xl font-bold`}>
                                                            {data.score}%
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${data.score}%` }}
                                                            transition={{ delay: 0.7 + (index * 0.1), duration: 0.8 }}
                                                            className="h-2 rounded-full bg-black"
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex justify-between text-sm text-gray-500">
                                                            <div>Correct</div>
                                                            <div>{data.correctAnswers} / {data.totalQuestions}</div>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-500">
                                                            <div>Avg Time</div>
                                                            <div>{Math.round(data.avgResponseTime || 0)}s per question</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleViewAnswers(topic)}
                                                        className="w-full text-center py-2 rounded-full text-sm font-medium bg-gray-900 text-white"
                                                    >
                                                        View Detailed Analysis
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                    
                                    {/* Recommendations */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-8 border border-gray-200 rounded-xl p-6 bg-gray-50"
                                    >
                                        <div className="flex items-start">
                                            <div className="rounded-full bg-black p-3 mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Recommendations</h3>
                                                <p className="text-gray-700">
                                                    {overallScore >= 70 ? 
                                                        "Outstanding work! Your knowledge is impressive. Consider exploring advanced topics or specializing further in your strongest areas." :
                                                    overallScore >= 50 ?
                                                        "Good job! You have a solid foundation. Focus on strengthening your understanding of concepts in your weaker topics." :
                                                        "You've completed the test. Prioritize reviewing fundamental concepts in the topics with lower scores and practice regularly."
                                                    }
                                                </p>
                                                
                                                {/* Time-based recommendation */}
                                                <p className="text-gray-700 mt-2">
                                                    {avgTime > 20 
                                                        ? "Your response time could be improved. Try to be more decisive and practice quick thinking exercises."
                                                        : avgTime > 10
                                                        ? "Your response time is good. Continue to build efficiency while maintaining accuracy."
                                                        : "Your response time is excellent! You demonstrate both knowledge and quick thinking."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Action buttons */}
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mt-8 flex justify-center gap-4"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: "#f3f3f3" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleReturnToTopics}
                                            className="px-6 py-3 rounded-md font-medium border border-gray-300 hover:border-gray-400 bg-white text-gray-800 transition-colors"
                                        >
                                            Take Another Test
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: "#111" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/dashboard')}
                                            className="px-6 py-3 rounded-md font-medium bg-black text-white transition-colors"
                                        >
                                            Go to Dashboard
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            {/* Bottom text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-center mt-6 text-gray-500"
                            >
                                <p className="text-sm">
                                    PrepX • Personalized interview preparation platform • {new Date().toLocaleDateString()}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </>
        );
    }

    if (sections.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-10">
                    <p className="text-xl font-semibold text-gray-700">No questions available for selected topics.</p>
                    <button 
                        onClick={handleReturnToTopics}
                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Return to Topic Selection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className={`${expandedTracker ? 'w-2/3' : 'w-3/4'} p-6 md:p-10 transition-all duration-300`}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
                >
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                        <h1 className="font-semibold text-xl text-gray-900">{sections[currentSection]?.topic}</h1>
                        <div className="flex items-center text-black text-lg font-medium bg-gray-100 px-3 py-1 rounded-md">
                            <span className="inline-block mr-2">⏳</span> {formatTime(timeLeft)}
                        </div>
                    </div>

                    {sections[currentSection]?.questions.length > 0 ? (
                        <>
                            <h2 className="text-lg font-bold text-gray-800">
                                Question {currentQuestion + 1} of {sections[currentSection].questions.length}
                            </h2>
                            <p className="mt-2 text-gray-700 text-lg">
                                {sections[currentSection].questions[currentQuestion].question}
                            </p>

                            <div className="mt-6 space-y-3">
                                {sections[currentSection].questions[currentQuestion].options.map((option, index) => (
                                    <motion.label
                                        key={index}
                                        className={`block border ${safeCompare(userAnswers[sections[currentSection].questions[currentQuestion]._id], option) 
                                            ? "border-black bg-gray-50" 
                                            : "border-gray-300"} 
                                            rounded-md px-4 py-3 cursor-pointer transition-all hover:border-gray-400`}
                                        whileHover={{ scale: 1.01, backgroundColor: '#fafafa' }}
                                    >
                                        <input
                                            type="radio"
                                            name={`answer-${currentQuestion}`}
                                            checked={safeCompare(userAnswers[sections[currentSection].questions[currentQuestion]._id], option)}
                                            onChange={() =>
                                                handleAnswerSelect(sections[currentSection].questions[currentQuestion]._id, option)
                                            }
                                            className="mr-3 accent-black"
                                        />
                                        {option}
                                    </motion.label>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#f3f3f3" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#111" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                    className="bg-black text-white px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={currentQuestion === sections[currentSection].questions.length - 1}
                                >
                                    Next
                                </motion.button>
                            </div>

                            <div className="mt-8 text-center">
                                <motion.button 
                                    whileHover={{ scale: 1.05, backgroundColor: "#111" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmitSection} 
                                    className="bg-black text-white px-8 py-3 rounded-md transition"
                                >
                                    {currentSection < sections.length - 1 ? "Submit & Next Section" : "Complete Test"}
                                </motion.button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-600">No questions available for this section.</p>
                    )}
                </motion.div>
            </div>

            {/* Progress Tracker Panel with Toggle Button */}
            <div 
                className={`${expandedTracker ? 'w-1/3' : 'w-1/4'} bg-gray-900 text-white shadow-lg fixed right-0 top-0 h-full flex flex-col transition-all duration-300`}
                style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                        <h2 className="text-xl font-semibold">Progress Tracker</h2>
                        <button 
                            onClick={() => setExpandedTracker(!expandedTracker)}
                            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
                        >
                            {expandedTracker ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                    
                    {/* Topics Progress */}
                    <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1 custom-scrollbar">
                        <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 6px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                                background: #2d3748;
                                border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: #4a5568;
                                border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: #718096;
                            }
                            .custom-scrollbar {
                                scrollbar-width: thin;
                                scrollbar-color: #4a5568 #2d3748;
                            }
                        `}</style>
                        {sections.map((section, secIndex) => (
                            <div key={secIndex} className="mb-6">
                                <h3 className={`text-lg font-medium ${
                                    currentSection === secIndex ? "text-white" : 
                                    currentSection > secIndex ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    {section.topic}
                                    {currentSection > secIndex && (
                                        <span className="ml-2 text-xs bg-gray-600 text-white px-2 py-1 rounded-full">Completed</span>
                                    )}
                                </h3>
                                
                                <div className={`grid ${expandedTracker ? 'grid-cols-8' : 'grid-cols-5'} gap-x-2 gap-y-2 mt-3 ${currentSection !== secIndex && "opacity-60"}`}>
                                    {section.questions.map((_, index) => {
                                        const questionId = section.questions[index]._id;
                                        const isAnswered = userAnswers[questionId] !== undefined;
                                        const isCurrentQuestion = currentSection === secIndex && currentQuestion === index;
                                        
                                        return (
                                            <motion.div
                                                key={index}
                                                className="flex justify-center"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: currentSection === secIndex ? 1.1 : 1 }}
                                                    whileTap={{ scale: currentSection === secIndex ? 0.9 : 1 }}
                                                    onClick={() => currentSection === secIndex && handleQuestionSelect(index)}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition ${
                                                        isCurrentQuestion
                                                            ? "ring-2 ring-white bg-gray-700"
                                                            : isAnswered
                                                            ? "bg-white text-black"
                                                            : "bg-gray-800 text-gray-300"
                                                    } ${currentSection !== secIndex ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                >
                                                    {index + 1}
                                                </motion.button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                
                                {expandedTracker && (
                                    <div className="mt-2 pl-2 text-sm text-gray-400">
                                        <div className="flex items-center justify-between">
                                            <span>Questions: {section.questions.length}</span>
                                            <span>
                                                Answered: {section.questions.filter(q => userAnswers[q._id] !== undefined).length}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {expandedTracker && (
                                    <div className="mt-3 bg-gray-800 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-300">Questions</span>
                                            <span className="text-xs font-medium text-white">{section.questions.length}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-300">Answered</span>
                                                <span className="text-xs font-medium text-white">
                                                    {section.questions.filter(q => userAnswers[q._id] !== undefined).length} / {section.questions.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                <div 
                                                    className="bg-white h-1.5 rounded-full"
                                                    style={{ 
                                                        width: `${(section.questions.filter(q => userAnswers[q._id] !== undefined).length / section.questions.length) * 100}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-auto pt-4">
                        <p className="text-gray-400 text-sm mb-2">Section {currentSection + 1} of {sections.length}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-white h-2 rounded-full"
                                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                            ></div>
                        </div>
                        
                        {expandedTracker && (
                            <div className="mt-4 bg-gray-800 rounded-lg p-4">
                                <h4 className="text-sm font-medium mb-2">Tips</h4>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li>• Click question numbers to navigate directly</li>
                                    <li>• White buttons indicate answered questions</li>
                                    <li>• Submit section when you've completed all questions</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComprehensiveTest; 