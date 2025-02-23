import React from 'react'
import homeSvg from './home.svg';
import {NavLink} from 'react-router-dom';
import Feature1 from './Feature1';
export default function Home() {
  return (
    <>
    <div className="flex items-center justify-center h-screen bg-gray-100 px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Ace Your Interviews with AI!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get real-time feedback, mock interviews, and track your progress with AI-powered insights.
          </p>
          <br />
          <NavLink to= '/signup' className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </NavLink>
        </div>

        {/* Image/Video Section */}
        <div className="flex-1 flex justify-center">
          <img 
            src={homeSvg}
            alt="AI Interview Prep" 
            className="w-full max-w-md rounded-xl shadow-lg"
          />
          {/* Replace with a video if needed */}
        </div>

      </div>
    </div>
    
    <Feature1 />
    <hr className="border-t border-gray-500 my-4" />
    </>
  );
}