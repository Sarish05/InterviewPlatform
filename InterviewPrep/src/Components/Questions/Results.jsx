import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { ArrowLeft, Download, Award, Clock, Mic, BarChart2, Lightbulb } from "lucide-react";

const Results = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [contentAnalysis, setContentAnalysis] = useState(null);

  // Get session ID from location state or fallback to URL params
  const sessionId = location?.state?.sessionId || new URLSearchParams(location.search).get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided. Please go back and try again.");
      setLoading(false);
      return;
    }
    
    // Fetch results from the backend
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/get-analysis/${sessionId}`);
        setResults(response.data);
        
        // Process audio analysis
        if (response.data && response.data.combined_audio_analysis) {
          setAudioAnalysis(response.data.combined_audio_analysis);
        }
        
        // Process content analysis
        if (response.data && response.data.content_analysis_averages) {
          setContentAnalysis(response.data.content_analysis_averages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Failed to load results. Please try again later.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const downloadReport = async () => {
    try {
      if (!sessionId) {
        alert("Session ID not found. Cannot download report.");
        return;
      }
      
      alert("Generating your detailed report. This may take a moment...");
      
      const response = await axios.get(
        `http://localhost:8000/generate-report/${sessionId}`,
        { 
          responseType: "blob",
          headers: {
            "Accept": "application/pdf"
          },
          timeout: 60000
        }
      );
      
      if (response.headers['content-type'] !== 'application/pdf') {
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
      window.URL.revokeObjectURL(url);
      
      console.log("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Could not download report: " + (error.message || "Unknown error occurred. Please try again."));
    }
  };

  const goBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-black border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Error Loading Results</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={goBack}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={goBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Interview Results</h1>
            </div>
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download Full Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Performance overview card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-yellow-500" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Performance Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Content Performance */}
              {contentAnalysis ? (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="text-blue-600" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">Content Analysis</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Relevance</span>
                        <span className="text-sm font-medium">{contentAnalysis.Relevance}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${contentAnalysis.Relevance * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Completeness</span>
                        <span className="text-sm font-medium">{contentAnalysis.Completeness}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${contentAnalysis.Completeness * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Knowledge Demonstration</span>
                        <span className="text-sm font-medium">{contentAnalysis["Knowledge Demonstration"]}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" 
                             style={{ width: `${contentAnalysis["Knowledge Demonstration"] * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Clarity</span>
                        <span className="text-sm font-medium">{contentAnalysis.Clarity}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${contentAnalysis.Clarity * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Overall Content Score</span>
                        <span className="text-sm font-bold text-blue-600">{contentAnalysis.overall_score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${contentAnalysis.overall_score * 10}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="text-gray-400" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">Content Analysis</h3>
                  </div>
                  <p className="text-gray-500">No content analysis data available.</p>
                </div>
              )}
              
              {/* Audio Performance */}
              {audioAnalysis ? (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic className="text-purple-600" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">Voice Analysis</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {audioAnalysis.overall_assessment && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">Overall Speech Quality</span>
                          <span className="text-sm font-bold text-purple-600">
                            {audioAnalysis.overall_assessment.overall_speech_quality.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full" 
                            style={{ width: `${audioAnalysis.overall_assessment.overall_speech_quality * 10}%` }}
                          ></div>
                        </div>
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Quality: <span className="font-medium">{audioAnalysis.overall_assessment.quality_category}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {audioAnalysis.speaking_rate && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Speaking Rate</h4>
                          <p className="text-2xl font-bold text-purple-700">
                            {audioAnalysis.speaking_rate.estimated_speaking_rate_wpm.toFixed(0)}
                            <span className="text-sm font-normal text-gray-500 ml-1">WPM</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Pace: {audioAnalysis.speaking_rate.pace_category}
                          </p>
                        </div>
                      )}
                      
                      {audioAnalysis.pitch_analysis && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Voice Pitch</h4>
                          <p className="text-2xl font-bold text-purple-700">
                            {audioAnalysis.pitch_analysis.average_pitch_hz.toFixed(0)}
                            <span className="text-sm font-normal text-gray-500 ml-1">Hz</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Category: {audioAnalysis.pitch_analysis.voice_category}
                          </p>
                        </div>
                      )}
                      
                      {audioAnalysis.clarity_metrics && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Speech Clarity</h4>
                          <p className="text-lg font-bold text-purple-700">
                            {audioAnalysis.clarity_metrics.articulation_quality}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Volume consistency: {audioAnalysis.clarity_metrics.volume_consistency.toFixed(1)}
                          </p>
                        </div>
                      )}
                      
                      {audioAnalysis.tone_analysis && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Tone</h4>
                          <p className="text-lg font-bold text-purple-700">
                            {audioAnalysis.tone_analysis.tone_variety > 2 ? "Expressive" : 
                             audioAnalysis.tone_analysis.tone_variety > 1 ? "Moderate" : "Monotone"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Variety: {audioAnalysis.tone_analysis.tone_variety.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic className="text-gray-400" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">Voice Analysis</h3>
                  </div>
                  <p className="text-gray-500">No voice analysis data available.</p>
                </div>
              )}
            </div>
            
            {/* Recommendations section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-500" size={22} />
                <h3 className="text-lg font-semibold text-gray-800">Improvement Recommendations</h3>
              </div>
              
              <ul className="space-y-2 text-gray-700">
                {contentAnalysis && contentAnalysis.Relevance < 7 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Focus more on directly addressing the questions asked. Make sure your answers are on-topic and specific.</span>
                  </li>
                )}
                
                {contentAnalysis && contentAnalysis.Completeness < 7 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Provide more comprehensive answers that cover all aspects of the questions. Use the STAR method (Situation, Task, Action, Result).</span>
                  </li>
                )}
                
                {contentAnalysis && contentAnalysis["Knowledge Demonstration"] < 7 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Include more concrete examples and specific details in your answers to showcase your expertise and experience.</span>
                  </li>
                )}
                
                {audioAnalysis && audioAnalysis.speaking_rate && 
                 audioAnalysis.speaking_rate.estimated_speaking_rate_wpm > 200 && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Slow down your speaking pace. Fast speech can be difficult to follow and may suggest nervousness.</span>
                  </li>
                )}
                
                {audioAnalysis && audioAnalysis.speaking_rate && 
                 audioAnalysis.speaking_rate.estimated_speaking_rate_wpm < 130 && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Try to increase your speaking pace slightly. Too slow speech can lose the interviewer's interest.</span>
                  </li>
                )}
                
                {audioAnalysis && audioAnalysis.clarity_metrics && 
                 ["poor", "fair"].includes(audioAnalysis.clarity_metrics.articulation_quality) && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Work on your articulation and pronunciation. Practice tongue twisters and reading aloud to improve clarity.</span>
                  </li>
                )}
                
                {audioAnalysis && audioAnalysis.pitch_analysis && 
                 audioAnalysis.pitch_analysis.pitch_variation < 10 && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Try to vary your pitch more to make your speech more engaging. Monotone delivery can sound disinterested.</span>
                  </li>
                )}
                
                {(!contentAnalysis && !audioAnalysis) && (
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>No specific recommendations available. Download the full report for detailed insights.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadReport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Download Full Report
          </button>
          <NavLink to="/dashboard">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          </NavLink>
        </div>
      </main>
    </div>
  );
};

export default Results;