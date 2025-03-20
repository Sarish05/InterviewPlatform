import React from "react";
import { useNavigate } from "react-router-dom";
import beh from './behavioural_icon.jpg';
import moc from './mock2_icon.jpg';
import tec from './technical_icon.jpg';
import "tailwindcss/tailwind.css";




const InterviewSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 animate-gradient">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Select Your Interview Type</h1>
      <div className="grid grid-cols-3 gap-8">
        {/* Behavioural Interview */}
        <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md transform transition duration-300 hover:scale-105">
          <div className="mb-4">
            <img
              src= {beh}
              alt="Behavioural Interview"
              className="w-40 h-40 rounded-full border-4 border-black p-4"
            />
          </div>
          <h3 className="text-xl font-semibold text-black">Behavioural Interview</h3>
          <p className="text-center mt-2 px-6 text-gray-700">
            Prepare for behavioural interviews with tailored practice questions and guidance.
          </p>
          <button className="mt-4 bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600">
            Select
          </button>
        </div>

        {/* Technical Interview */}
        <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md transform transition duration-300 hover:scale-105">
          <div className="mb-4">
            <img
              src={tec}
              alt="Technical Interview"
              className="w-40 h-40 rounded-full border-4 border-black p-4"
            />
          </div>
          <h3 className="text-xl font-semibold text-black">Technical Interview</h3>
          <p className="text-center mt-2 px-6 text-gray-700">
            Sharpen your technical skills with mock interviews and coding challenges.
          </p>
          <button onClick={() => navigate("/tech-select")} className="mt-4 bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600">
            Select
          </button>
        </div>

        {/* Mock Test */}
        <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md transform transition duration-300 hover:scale-105">
          <div className="mb-4">
            <img
              src={moc}
              alt="Mock Test"
              className="w-40 h-40 rounded-full border-4 border-black p-4"
            />
          </div>
          <h3 className="text-xl font-semibold text-black">Mock Test</h3>
          <p className="text-center mt-2 px-6 text-gray-700">
            Take full-length mock tests to simulate a real interview environment.
          </p>
          <button  onClick={() => navigate("/quant-select")} className="mt-4 bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600">
            Select
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 10s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default InterviewSelection;