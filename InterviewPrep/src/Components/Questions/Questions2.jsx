import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Mic, MicOff, Play, Pause, Volume2, Clock, ArrowLeft, XCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Mock API URL (Replace with your actual behavioural questions endpoint when available)
const API_URL = "http://localhost:8080/api/tech-mcqs";

// Voice synthesis options
const VOICES = {
  default: { rate: 1, pitch: 1, lang: "en-US" }
};

function TechnicalInterview() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for the interview
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioPlayerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const speechSynthesisRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [audioAnalysisType, setAudioAnalysisType] = useState("individual"); // "individual" or "combined"


  useEffect(() => {
    setSessionId(uuidv4()); // Generate unique session ID
  }, []);

  useEffect(() => {
    // Inform user about enhanced audio analysis
    if (Object.keys(recordedAnswers).length >= 2) {
      setAudioAnalysisType("combined");
    }
  }, [recordedAnswers]);

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setRecordedAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: audioBlob
      }));
      
      // Send to backend after recording is complete
      await sendAudioForAnalysis(
        audioBlob, 
        questions[currentQuestion].question
      );
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  } catch (error) {
    console.error("Error starting recording:", error);
  }
};

const sendAudioForAnalysis = async (audioBlob, question) => {
  const formData = new FormData();
  
  // Check if the audio is too short (less than 5 seconds)
  const audioDuration = await getAudioDuration(audioBlob);
  
  // If audio is too short, alert the user
  if (audioDuration < 5) {
    alert("Your response is too short for accurate analysis. Please provide a more detailed answer (at least 5 seconds).");
    return;
  }
  
  console.log(`Sending audio for analysis: ${audioDuration.toFixed(1)}s, Question: ${question.substring(0, 30)}...`);
  
  // Create proper WAV format for audio
  try {
    // For WAV format compatibility, ensure we're using the correct MIME type
    const properBlob = new Blob([await audioBlob.arrayBuffer()], { type: 'audio/wav' });
    
    // We'll now send the full audio for better combined analysis
    formData.append("audio_file", properBlob, "response.wav");
    formData.append("question", question);
    formData.append("user_id", "user123"); // Replace with actual user ID
    formData.append("session_id", sessionId);

    console.log(`Audio file size: ${Math.round(properBlob.size / 1024)} KB`);

    const response = await axios.post(
      "http://localhost:8000/complete-analysis",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // For larger files, set timeout to 60 seconds
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          console.log(`Upload progress: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)}%`);
        }
      }
    );
    console.log("Response stored:", response.data);
    
    // Show combined analysis notification when appropriate
    if (Object.keys(recordedAnswers).length >= 2) {
      setAudioAnalysisType("combined");
    }
    
  } catch (error) {
    console.error("Error sending audio:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    alert("There was an error analyzing your response. Please try again.");
  }
};

// Utility function to get audio duration
const getAudioDuration = (blob) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      URL.revokeObjectURL(audio.src);
      resolve(duration);
    });
    
    // Fallback in case loadedmetadata doesn't fire
    setTimeout(() => {
      if (!audio.duration || audio.duration === Infinity) {
        URL.revokeObjectURL(audio.src);
        resolve(0);
      }
    }, 1000);
  });
};

// Utility function to trim audio to specified duration
const trimAudio = async (blob, maxDurationSeconds) => {
  // In a real implementation, you would use Web Audio API to trim the audio
  // For now, we'll just return the original blob and handle trimming on the server side
  console.log(`Audio exceeded max duration, will be trimmed to ${maxDurationSeconds}s for analysis`);
  return blob;
};

// Call sendAudioForAnalysis when recording stops
const stopRecording = () => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};



const fetchAnalysisResults = async (sessionId) => {
  if (!sessionId) {
    console.error("No session ID provided");
    return;
  }
  
  try {
    const response = await axios.get(`http://localhost:8000/get-analysis/${sessionId}`);
    setAnalysisResults(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching analysis results:", error);
    return null;
  }
};

const downloadReport = async () => {
  try {
    // First fetch the analysis results if not already fetched
    if (!analysisResults) {
      await fetchAnalysisResults(sessionId);
    }
    
    // Check if we have any recorded answers
    if (Object.keys(recordedAnswers).length === 0) {
      alert("Please record at least one answer before downloading the report.");
      return;
    }
    
    console.log("Downloading report for session:", sessionId);
    
    // Show different message based on analysis type
    if (audioAnalysisType === "combined" && Object.keys(recordedAnswers).length >= 2) {
      alert("Generating enhanced report with combined audio analysis. This may take a moment...");
    } else {
      alert("Generating report. This may take a moment...");
    }
    
    const response = await axios.get(
      `http://localhost:8000/generate-report/${sessionId}`,
      { 
        responseType: "blob",
        headers: {
          "Accept": "application/pdf"
        },
        // Increase timeout for larger combined audio processing
        timeout: 60000
      }
    );
    
    console.log("Report response received:", response.status, response.headers);
    
    // Check if the response is an error message or not a PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      console.error("Received non-PDF response:", response);
      if (response.headers['content-type'].includes('json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorJson = JSON.parse(reader.result);
            throw new Error(errorJson.detail || "Failed to generate report");
          } catch (e) {
            alert("Error parsing response: " + e.message);
          }
        };
        reader.readAsText(response.data);
        return;
      }
      throw new Error("Received invalid response type: " + response.headers['content-type']);
    }
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement("a");
    link.href = url;
    const filename = response.headers["content-disposition"]
      ? response.headers["content-disposition"].split("filename=")[1].replace(/"/g, "")
      : `Interview_Report_${sessionId}.pdf`;
    
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up the URL object
    
    console.log("Report downloaded successfully");
  } catch (error) {
    console.error("Error downloading report:", error);
    alert("Could not download report: " + (error.message || "Unknown error occurred. Please try again."));
  }
};


  // Fetch behavioural questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // In a real app, you would have a dedicated endpoint for behavioural questions
        // For now, we're using the MCQ endpoint with a filter
        const response = await axios.get(`${API_URL}?category=Behavioral`);
        
        // For testing purposes, map MCQs to behavioural questions format
        // In a real implementation, you would have proper behavioural questions from backend
        const behaviouralQuestions = response.data.map(q => ({
          id: q._id,
          question: q.question,
          category: "Technical",
          difficulty: q.difficulty || "Medium"
        })).slice(0, 10); // Limit to 10 questions
        
        // Fallback to hardcoded questions if none returned
        if (behaviouralQuestions.length === 0) {
          setQuestions([
            { id: "t1", question: "Tell me how you would design a distributed caching system for a high-traffic web application.", category: "Technical", difficulty: "Hard" },
            { id: "t2", question: "Explain how a blockchain works and how you would implement a simple blockchain from scratch.", category: "Technical", difficulty: "Hard" },
            { id: "t3", question: "You need to scale a database that handles millions of read and write requests per second. What approach would you take?", category: "Technical", difficulty: "Hard" },
            { id: "t4", question: "Describe the CAP theorem. How do different types of databases handle its constraints?", category: "Technical", difficulty: "Hard" },
            { id: "t5", question: "How would you implement a highly available microservices architecture with fault tolerance?", category: "Technical", difficulty: "Hard" },
            { id: "t6", question: "How does the garbage collection process work in different programming languages like Java, Python, and Go?", category: "Technical", difficulty: "Hard" },
            { id: "t7", question: "Design a load balancer from scratch. What algorithms would you use and why?", category: "Technical", difficulty: "Hard" },
            { id: "t8", question: "Explain how a consensus algorithm like Raft or Paxos works. Where would you use them?", category: "Technical", difficulty: "Hard" },
            { id: "t9", question: "How would you optimize a search engine’s ranking algorithm for better accuracy and speed?", category: "Technical", difficulty: "Hard" },
            { id: "t10", question: "How would you debug a complex issue in a distributed system with no clear error logs?", category: "Technical", difficulty: "Hard" }
          ]
          );
        } else {
          setQuestions(behaviouralQuestions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error.response?.data || error.message);
        // Fallback to hardcoded questions on error
        setQuestions([
            { id: "t1", question: "Tell me how you would design a distributed caching system for a high-traffic web application.", category: "Technical", difficulty: "Hard" },
            { id: "t2", question: "Explain how a blockchain works and how you would implement a simple blockchain from scratch.", category: "Technical", difficulty: "Hard" },
            { id: "t3", question: "You need to scale a database that handles millions of read and write requests per second. What approach would you take?", category: "Technical", difficulty: "Hard" },
            { id: "t4", question: "Describe the CAP theorem. How do different types of databases handle its constraints?", category: "Technical", difficulty: "Hard" },
            { id: "t5", question: "How would you implement a highly available microservices architecture with fault tolerance?", category: "Technical", difficulty: "Hard" },
            { id: "t6", question: "How does the garbage collection process work in different programming languages like Java, Python, and Go?", category: "Technical", difficulty: "Hard" },
            { id: "t7", question: "Design a load balancer from scratch. What algorithms would you use and why?", category: "Technical", difficulty: "Hard" },
            { id: "t8", question: "Explain how a consensus algorithm like Raft or Paxos works. Where would you use them?", category: "Technical", difficulty: "Hard" },
            { id: "t9", question: "How would you optimize a search engine’s ranking algorithm for better accuracy and speed?", category: "Technical", difficulty: "Hard" },
            { id: "t10", question: "How would you debug a complex issue in a distributed system with no clear error logs?", category: "Technical", difficulty: "Hard" }
          ]
          );
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

  const handleSubmitInterview = async () => {
    // Check if at least one question has been answered
    if (Object.keys(recordedAnswers).length === 0) {
      alert("Please answer at least one question before submitting the interview.");
      return;
    }
    
    // Check if we're on the last question and it hasn't been answered
    if (currentQuestion === questions.length - 1 && !recordedAnswers[questions[currentQuestion]?.id]) {
      alert("Please answer the current question before submitting the interview.");
      return;
    }
    
    // Ask if the user wants to download the report before submitting
    if (window.confirm("Would you like to download your interview report before submitting?")) {
      try {
        await downloadReport();
      } catch (error) {
        console.error("Error downloading report:", error);
        if (!window.confirm("There was an error generating your report. Do you still want to submit the interview?")) {
          return;
        }
      }
    }
    
    // In a real app, send recordings to the server
    console.log("Interview completed!", recordedAnswers);
    
    // Fetch analysis results before redirecting
    try {
      setLoading(true);
      await fetchAnalysisResults(sessionId);
      setLoading(false);
      
      // Redirect to results page with sessionId
      navigate(`/results?sessionId=${sessionId}`);
    } catch (error) {
      console.error("Error fetching analysis results:", error);
      setLoading(false);
      
      if (window.confirm("There was an error fetching analysis results. Do you still want to proceed to the results page?")) {
        navigate(`/results?sessionId=${sessionId}`);
      }
    }
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
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Technical Interview</h1>
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
              {/* Combined analysis notification */}
              {audioAnalysisType === "combined" && Object.keys(recordedAnswers).length >= 2 && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  <p className="text-sm">
                    <span className="font-medium">Enhanced Analysis:</span> Your responses will be combined for more accurate speech analysis in the final report.
                  </p>
                </div>
              )}
              
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
                <div className="flex gap-3">
                  {Object.keys(recordedAnswers).length > 0 && (
                    <button 
                      onClick={downloadReport}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download Report
                    </button>
                  )}
                  <button
                    onClick={handleSubmitInterview}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    disabled={!recordedAnswers[questions[currentQuestion]?.id]}
                  >
                    Submit Interview
                  </button>
                </div>
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

export default TechnicalInterview;