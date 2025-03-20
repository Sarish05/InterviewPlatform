import React from 'react';
import { motion } from 'framer-motion';
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';

const Feature1 = () => {
  const featureVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: 1,
      transition: { 
        delay: custom * 0.2,
        duration: 0.8
      }
    })
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <motion.h2 
        className="text-center text-3xl font-bold text-gray-900 mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        How PrepX Transforms Your Interview Preparation
      </motion.h2>
      
      <div className="space-y-24">
        {/* First Feature */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={featureVariants}
        >
          <div className="order-2 lg:order-1">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 text-indigo-800 font-semibold rounded-full w-10 h-10 flex items-center justify-center mr-3">1</div>
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Interview Type</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Select from technical, behavioral, or mock interviews tailored to your specific needs. PrepX offers specialized preparation for different interview types across various industries and roles.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Technical interviews covering DSA, system design, and more</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Behavioral interviews focusing on your past experiences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Mock tests to simulate real interview scenarios</span>
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl transform rotate-3 scale-105 opacity-20"></div>
              <img 
                src={image2} 
                alt="Interview selection" 
                className="w-full rounded-xl shadow-lg relative z-10 object-cover h-80"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Second Feature */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={featureVariants}
        >
          <div className="order-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl transform -rotate-3 scale-105 opacity-20"></div>
              <img 
                src={image1} 
                alt="Practice interviews" 
                className="w-full rounded-xl shadow-lg relative z-10 object-cover h-80" 
              />
            </div>
          </div>
          <div className="order-2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 font-semibold rounded-full w-10 h-10 flex items-center justify-center mr-3">2</div>
              <h3 className="text-2xl font-bold text-gray-900">Respond to Dynamic Questions</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Answer relevant interview questions through your microphone. PrepX's AI engine adapts to your responses, asking contextual follow-up questions just like a real interviewer would.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Industry-specific technical questions tailored to your skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-driven contextual follow-up questions based on your answers</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time feedback on your verbal communication patterns</span>
              </li>
            </ul>
          </div>
        </motion.div>
        
        {/* Third Feature */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={featureVariants}
        >
          <div className="order-2 lg:order-1">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 text-purple-800 font-semibold rounded-full w-10 h-10 flex items-center justify-center mr-3">3</div>
              <h3 className="text-2xl font-bold text-gray-900">Get Comprehensive Analysis</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Receive detailed reports analyzing your interview performance. PrepX evaluates your knowledge, speaking patterns, and presentation style to provide actionable insights.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Audio analysis of tone, clarity, pace, and pitch</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Content evaluation with question-specific feedback</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Downloadable reports with improvement suggestions</span>
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl transform rotate-3 scale-105 opacity-20"></div>
              <img 
                src={image3} 
                alt="Interview analysis" 
                className="w-full rounded-xl shadow-lg relative z-10 object-cover h-80" 
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Call to action */}
      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <a 
          href="/login"
          className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition transform hover:-translate-y-1"
        >
          Try Your First Interview
          <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
};

export default Feature1;
