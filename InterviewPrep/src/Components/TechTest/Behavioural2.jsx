import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Mic, MicOff, Play, Pause, Volume2, Clock, ArrowLeft, XCircle } from "lucide-react";

// Mock API URL (Replace with your actual behavioural questions endpoint when available)
const API_URL = "http://localhost:8080/api/mcqs";

// Voice synthesis options
const VOICES = {
  default: { rate: 1, pitch: 1, lang: "en-US" }
};

function BehaviouralInterview() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for the interview
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const speechSynthesisRef = useRef(null);

  // Fetch behavioural questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // In a real app, you would have a dedicated endpoint for behavioural questions
        // For now, we're using the MCQ endpoint with a filter
        const response = await axios.get(`${API_URL}?category=Behavioural`);
        
        // For testing purposes, map MCQs to behavioural questions format
        // In a real implementation, you would have proper behavioural questions from backend
        const behaviouralQuestions = response.data.map(q => ({
          id: q._id,
          question: q.question,
          category: "Behavioural",
          difficulty: q.difficulty || "Medium"
        })).slice(0, 10); // Limit to 10 questions
        
        // Fallback to hardcoded questions if none returned
        if (behaviouralQuestions.length === 0) {
          setQuestions([
            { id: "b1", question: "Tell me about a time you faced a difficult challenge at work. How did you overcome it?", category: "Behavioural", difficulty: "Medium" },
            { id: "b2", question: "Describe a situation where you had to work with a difficult team member. How did you handle it?", category: "Behavioural", difficulty: "Medium" },
            { id: "b3", question: "Give an example of a time you made a mistake. How did you handle it?", category: "Behavioural", difficulty: "Medium" },
            { id: "b4", question: "Describe a time when you had to make a difficult decision with limited information.", category: "Behavioural", difficulty: "Medium" },
            { id: "b5", question: "Tell me about a time you successfully persuaded someone to see things your way.", category: "Behavioural", difficulty: "Medium" },
            { id: "b6", question: "Describe a situation where you had to meet a tight deadline. How did you manage your time?", category: "Behavioural", difficulty: "Medium" },
            { id: "b7", question: "Tell me about a time you received feedback you didn't agree with. How did you respond?", category: "Behavioural", difficulty: "Medium" },
            { id: "b8", question: "Give an example of how you've contributed to a positive team culture.", category: "Behavioural", difficulty: "Medium" },
            { id: "b9", question: "Describe a time when you had to adapt quickly to a significant change.", category: "Behavioural", difficulty: "Medium" },
            { id: "b10", question: "Tell me about a time you showed leadership when you weren't in a leadership role.", category: "Behavioural", difficulty: "Medium" }
          ]);
        } else {
          setQuestions(behaviouralQuestions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error.response?.data || error.message);
        // Fallback to hardcoded questions on error
        setQuestions([
          { id: "b1", question: "Tell me about a time you faced a difficult challenge at work. How did you overcome it?", category: "Behavioural", difficulty: "Medium" },
          { id: "b2", question: "Describe a situation where you had to work with a difficult team member. How did you handle it?", category: "Behavioural", difficulty: "Medium" },
          { id: "b3", question: "Give an example of a time you made a mistake. How did you handle it?", category: "Behavioural", difficulty: "Medium" },
          { id: "b4", question: "Describe a time when you had to make a difficult decision with limited information.", category: "Behavioural", difficulty: "Medium" },
          { id: "b5", question: "Tell me about a time you successfully persuaded someone to see things your way.", category: "Behavioural", difficulty: "Medium" },
          { id: "b6", question: "Describe a situation where you had to meet a tight deadline. How did you manage your time?", category: "Behavioural", difficulty: "Medium" },
          { id: "b7", question: "Tell me about a time you received feedback you didn't agree with. How did you respond?", category: "Behavioural", difficulty: "Medium" },
          { id: "b8", question: "Give an example of how you've contributed to a positive team culture.", category: "Behavioural", difficulty: "Medium" },
          { id: "b9", question: "Describe a time when you had to adapt quickly to a significant change.", category: "Behavioural", difficulty: "Medium" },
          { id: "b10", question: "Tell me about a time you showed leadership when you weren't in a leadership role.", category: "Behavioural", difficulty: "Medium" }
        ]);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitInterview();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle recording of audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Save the recorded answer for this question
        setRecordedAnswers(prev => ({
          ...prev,
          [questions[currentQuestion].id]: audioBlob
        }));

        // Reset recording state
        setIsRecording(false);
        audioChunksRef.current = [];
      };

      // Set 3 second countdown before recording starts
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access your microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Play recorded answer
  const playRecordedAnswer = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Play the question using speech synthesis
  const speakQuestion = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]?.question);
    
    // Set voice properties
    utterance.rate = VOICES.default.rate;
    utterance.pitch = VOICES.default.pitch;
    utterance.lang = VOICES.default.lang;
    
    // Get available voices and set a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
    
    utterance.onend = () => {
      setSpeaking(false);
    };
    
    utterance.onerror = () => {
      setSpeaking(false);
    };
    
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
    speechSynthesisRef.current = utterance;
  };

  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setAudioBlob(recordedAnswers[questions[currentQuestion - 1]?.id] || null);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAudioBlob(recordedAnswers[questions[currentQuestion + 1]?.id] || null);
    }
  };

  const handleSubmitInterview = () => {
    // In a real app, send recordings to the server
    console.log("Interview completed!", recordedAnswers);
    alert("Interview completed! Thank you for your responses.");
    navigate("/dashboard");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-black border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading your interview questions...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate("/interview-selection")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Behavioural Interview</h1>
            </div>
            <div className="flex items-center text-red-600 font-medium">
              <Clock className="mr-2" size={20} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2">
            <div 
              className="bg-black h-2"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-6 md:p-8">
            {/* Question number and controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <span className="bg-black text-white font-medium rounded-full w-8 h-8 flex items-center justify-center">
                  {currentQuestion + 1}
                </span>
                <span className="text-gray-500 text-sm">of {questions.length} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={speakQuestion}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${speaking ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors text-sm`}
                >
                  {speaking ? <Pause size={16} /> : <Volume2 size={16} />}
                  {speaking ? "Stop" : "Hear Question"} 
                </button>
              </div>
            </div>

            {/* Question */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-medium text-gray-800 leading-relaxed">
                {questions[currentQuestion]?.question}
              </h2>
              <div className="mt-2 text-sm text-gray-500">
                Answer this question based on your personal experience.
              </div>
            </motion.div>

            {/* Recording interface */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex flex-col items-center">
                {countdown > 0 && (
                  <div className="text-5xl font-bold text-red-500 mb-4 animate-pulse">
                    {countdown}
                  </div>
                )}
                
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Mic className="text-white" size={32} />
                    </div>
                    <p className="text-red-600 font-medium mb-2">Recording in progress...</p>
                    <button 
                      onClick={stopRecording}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors flex items-center gap-2"
                    >
                      <MicOff size={16} />
                      Stop Recording
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {recordedAnswers[questions[currentQuestion]?.id] ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                          <Play className="text-white" size={24} />
                        </div>
                        <p className="text-green-600 font-medium mb-4">Answer recorded!</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={playRecordedAnswer}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                          >
                            <Play size={16} />
                            Play Answer
                          </button>
                          <button 
                            onClick={startRecording}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors flex items-center gap-2"
                          >
                            <XCircle size={16} />
                            Re-record
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <button 
                          onClick={startRecording}
                          className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 hover:bg-gray-800 transition-colors"
                        >
                          <Mic className="text-white" size={32} />
                        </button>
                        <p className="text-gray-700 font-medium">Click to start recording your answer</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <audio ref={audioPlayerRef} className="hidden" controls onEnded={() => setIsPlaying(false)} />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentQuestion === 0}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmitInterview}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Interview
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    recordedAnswers[questions[currentQuestion]?.id] 
                      ? "bg-black text-white hover:bg-gray-800" 
                      : "border border-gray-300 text-gray-400"
                  }`}
                  disabled={!recordedAnswers[questions[currentQuestion]?.id]}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question navigation panel */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-medium text-gray-800 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                  currentQuestion === index 
                    ? "bg-black text-white" 
                    : recordedAnswers[questions[index]?.id]
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BehaviouralInterview; 