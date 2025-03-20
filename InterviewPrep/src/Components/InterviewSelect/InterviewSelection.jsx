import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import beh from './behavioural_icon.jpg';
import moc from './mock2_icon.jpg';
import tec from './technical_icon.jpg';

const InterviewSelection = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const interviewTypes = [
    {
      title: "Behavioural Interview",
      image: beh,
      description: "Prepare for behavioural interviews with tailored practice questions and guidance.",
      navigateTo: "/behavioural-select" // Add the correct path if it exists
    },
    {
      title: "Technical Interview",
      image: tec,
      description: "Sharpen your technical skills with mock interviews and coding challenges.",
      navigateTo: "/tech-select"
    },
    {
      title: "Mock Test",
      image: moc,
      description: "Take full-length mock tests to simulate a real interview environment.",
      navigateTo: "/comprehensive-select"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-4 text-gray-900"
          variants={itemVariants}
        >
          Select Your Interview Type
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Choose the type of interview you want to practice and get real-time feedback from our AI system
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {interviewTypes.map((type, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="relative w-full h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center p-2">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-8 flex-1 flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-center text-gray-600 mb-6 flex-1">
                  {type.description}
                </p>
                <button 
                  onClick={() => navigate(type.navigateTo)}
                  className="px-6 py-3 bg-black text-white font-medium rounded-lg shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Select
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <p className="text-gray-600 mb-4">Not sure which type to choose?</p>
          <button 
            className="px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InterviewSelection;