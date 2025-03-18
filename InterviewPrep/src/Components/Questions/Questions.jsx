
// import React, { useState, useRef } from 'react'

// function Questions() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);
//   const currentQuestion = "What are principles of Object-Oriented Programming?";

//   // Start or stop recording based on current state
//   const toggleRecording = async () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   // Start recording
//   const startRecording = async () => {
//     try {
//       // Reset chunks and recording time
//       audioChunksRef.current = [];
//       setRecordingTime(0);
      
//       // Request microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
//       // Create media recorder
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
      
//       // Listen for data available event
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };
      
//       // When stopped, create blob and send to server
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         setAudioBlob(audioBlob);
//         sendAudioToServer(audioBlob);
//       };
      
//       // Start recording
//       mediaRecorder.start();
//       setIsRecording(true);
      
//       // Start timer
//       timerRef.current = setInterval(() => {
//         setRecordingTime(prevTime => prevTime + 1);
//       }, 1000);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//       alert("Could not access microphone. Please check your permissions.");
//     }
//   };
  
//   // Stop recording
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
      
//       // Stop all audio tracks
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
//       // Clear timer
//       clearInterval(timerRef.current);
//       setIsRecording(false);
//     }
//   };
  
//   // Format seconds to MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };
  
//   // Send audio to server
//   const sendAudioToServer = async (blob) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', blob, 'recording.webm');
//       formData.append('question', currentQuestion);
      
//       // Show loading state (you could add a state for this)
//       console.log("Sending audio to server...");
      
//       // Send to your FastAPI endpoint
//       const response = await fetch('http://localhost:8000/complete-analysis/', {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         throw new Error(`Server responded with ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log("Analysis result:", result);
      
//       // Here you could update state to show the results
//       // For example: setAnalysisResult(result);
      
//     } catch (error) {
//       console.error("Error sending audio to server:", error);
//       alert("Failed to analyze your response. Please try again.");
//     }
//   };

//   return (
//     <div className='w-full font-poppins overflow-hidden min-h-screen flex flex-col'>
//         {/* header */}
//         <div className='px-48 flex flex-none justify-between py-4'>
//             <div className='font-semibold text-lg'>
//                 PrepX
//             </div>
//             <div className='flex gap-8'>
//                 <div className='flex justify-between items-center'>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                     </svg>
//                     <div className="text-md">
//                      06:45
//                     </div>
//                 </div>
//                 <div><button className='bg-black px-3 py-2 rounded-md text-white'>End Interview</button></div>
//             </div>
//         </div>
//         {/* main content */}
//         <div className='pt-8 flex-grow flex justify-center items-start bg-gray-200'>
//             <div className='flex flex-col justify-center items-center w-3/5'>
//                 {/* upper heading */}
//                 <div className='w-full flex items-center justify-around'>
//                     <button className='rounded-3xl bg-white p-2'>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
//                         </svg>
//                     </button>
//                     <div>
//                         <div className='font-lg text-center font-semibold'>Technical Interview</div>
//                         <div className='font-sm text-gray-600'>
//                             Questions 4/10 | 2 Answered
//                         </div>
//                     </div>
//                     <button className='rounded-3xl bg-white p-2'>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
//                     </svg>
//                     </button>
//                 </div>

//                 <div className='w-full flex flex-col my-8 bg-white rounded-lg'>
//                     {/* Question and hear container - top section */}
//                     <div className='p-6 flex-1 flex flex-col min-h-64'>
//                         {/* div for question and hear */}
//                         <div className='flex flex-col items-center w-full'>
//                             <div className='flex items-center justify-center'>
//                                 <div className='text-center font-md font-semibold mr-2'>{currentQuestion}</div>
//                                 <button className='bg-gray-300 rounded-3xl flex p-2 flex-shrink-0'>
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
                        
//                         {/* Recording status display */}
//                         {isRecording && (
//                           <div className='flex justify-center mt-4'>
//                             <div className='bg-red-100 px-4 py-2 rounded-md flex items-center'>
//                               <div className='animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2'></div>
//                               <div>Recording... {formatTime(recordingTime)}</div>
//                             </div>
//                           </div>
//                         )}
                        
//                         {/* Audio playback if recording is complete */}
//                         {audioBlob && !isRecording && (
//                           <div className='flex justify-center mt-4'>
//                             <audio controls src={URL.createObjectURL(audioBlob)} className="w-64" />
//                           </div>
//                         )}
                        
//                         {/* Empty space for growing */}
//                         <div className='flex-grow'></div>
                        
//                         {/* div to speak - bottom section */}
//                         <div className='flex justify-center mt-8 mb-4'>
//                             <button 
//                               onClick={toggleRecording}
//                               className={`${isRecording ? 'bg-red-500 text-white' : 'bg-gray-300'} rounded-lg flex p-3 items-center gap-2`}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
//                                 </svg>
//                                 <div className='font-semibold'>{isRecording ? 'Stop' : 'Speak'}</div>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         {/* footer */}
//         <div className='text-center py-4 text-sm'>Practice makes perfect. Keep Going!</div>
//     </div>
//   )
// }

// export default Questions




import React, { useState, useRef } from 'react'

function Questions() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const currentQuestion = "What are principles of Object-Oriented Programming?";

  // Start or stop recording based on current state
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Reset chunks and recording time
      audioChunksRef.current = [];
      setRecordingTime(0);
      setResponseStatus(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Listen for data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // When stopped, create blob and send to server
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendAudioToServer(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear timer
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Send audio to server
  const sendAudioToServer = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('question', currentQuestion);
      
      // Show loading state
      setIsProcessing(true);
      console.log("Sending audio to server...");
      
      // Send to your FastAPI endpoint
      const response = await fetch('http://localhost:8000/complete-analysis/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Analysis result:", result);
      
      // Update UI with success status
      setIsProcessing(false);
      setResponseStatus("success");
      
    } catch (error) {
      console.error("Error sending audio to server:", error);
      alert("Failed to analyze your response. Please try again.");
      setIsProcessing(false);
      setResponseStatus("error");
    }
  };

  return (
    <div className='w-full font-poppins overflow-hidden min-h-screen flex flex-col'>
        {/* header */}
        <div className='px-48 flex flex-none justify-between py-4'>
            <div className='font-semibold text-lg'>
                PrepX
            </div>
            <div className='flex gap-8'>
                <div className='flex justify-between items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div className="text-md">
                     06:45
                    </div>
                </div>
                <div><button className='bg-black px-3 py-2 rounded-md text-white'>End Interview</button></div>
            </div>
        </div>
        {/* main content */}
        <div className='pt-8 flex-grow flex justify-center items-start bg-gray-200'>
            <div className='flex flex-col justify-center items-center w-3/5'>
                {/* upper heading */}
                <div className='w-full flex items-center justify-around'>
                    <button className='rounded-3xl bg-white p-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div>
                        <div className='font-lg text-center font-semibold'>Technical Interview</div>
                        <div className='font-sm text-gray-600'>
                            Questions 4/10 | 2 Answered
                        </div>
                    </div>
                    <button className='rounded-3xl bg-white p-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    </button>
                </div>

                <div className='w-full flex flex-col my-8 bg-white rounded-lg'>
                    {/* Question and hear container - top section */}
                    <div className='p-6 flex-1 flex flex-col min-h-64'>
                        {/* div for question only (removed hear button) */}
                        <div className='flex flex-col items-center w-full'>
                            <div className='text-center font-md font-semibold'>{currentQuestion}</div>
                        </div>
                        
                        {/* Recording status display */}
                        {isRecording && (
                          <div className='flex justify-center mt-4'>
                            <div className='bg-red-100 px-4 py-2 rounded-md flex items-center'>
                              <div className='animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2'></div>
                              <div>Recording... {formatTime(recordingTime)}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Processing indicator */}
                        {isProcessing && (
                          <div className='flex justify-center mt-4'>
                            <div className='bg-blue-100 px-4 py-2 rounded-md flex items-center'>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <div>Processing your response...</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Success/Error message instead of audio playback */}
                        {responseStatus === "success" && !isRecording && !isProcessing && (
                          <div className='flex justify-center mt-4'>
                            <div className='bg-green-100 px-4 py-2 rounded-md flex items-center'>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div>Response recorded and analyzed successfully!</div>
                            </div>
                          </div>
                        )}
                        
                        {responseStatus === "error" && !isRecording && !isProcessing && (
                          <div className='flex justify-center mt-4'>
                            <div className='bg-red-100 px-4 py-2 rounded-md flex items-center'>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>Error processing your response. Try again.</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Empty space for growing */}
                        <div className='flex-grow'></div>
                        
                        {/* div to speak - bottom section */}
                        <div className='flex justify-center mt-8 mb-4'>
                            <button 
                              onClick={toggleRecording}
                              className={`${isRecording ? 'bg-red-500 text-white' : 'bg-gray-300'} rounded-lg flex p-3 items-center gap-2`}
                              disabled={isProcessing}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                                <div className='font-semibold'>{isRecording ? 'Stop' : 'Speak'}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* footer */}
        <div className='text-center py-4 text-sm'>Practice makes perfect. Keep Going!</div>
    </div>
  )
}

export default Questions