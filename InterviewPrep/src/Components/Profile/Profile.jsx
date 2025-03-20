import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import prof from "./prof.jpg";
import { Edit, Award, Calendar, Activity, Clock, Settings, ChevronRight, BarChart2 } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    title: "AI Enthusiast and Software Developer",
    photo: prof,
    skills: ["Python", "Machine Learning", "Data Analysis", "Algorithm Design", "System Design"]
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header section with user info */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
                <img 
                  src={user.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition">
                <Edit size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.title}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {user.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Settings size={16} />
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Performance Statistics */}
          <motion.div 
            className="md:col-span-2 bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 size={20} />
                Performance Statistics
              </h2>
              <select className="bg-gray-100 border-none text-sm rounded-lg px-3 py-2 focus:outline-none">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Interview Performance</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Communication Skills</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Technical Knowledge</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Problem Solving</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Achievements */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Award size={20} />
              Achievements
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Award size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="font-medium">Perfect Score</h3>
                  <p className="text-sm text-gray-600">Achieved 100% in System Design interview</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Activity size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="font-medium">10 Interviews</h3>
                  <p className="text-sm text-gray-600">Completed 10 practice interviews</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Clock size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="font-medium">Speed Master</h3>
                  <p className="text-sm text-gray-600">Solved DSA problems under time limit</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Upcoming & Recent Interviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Interviews */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={20} />
                Upcoming Interviews
              </h2>
              <button className="text-sm font-medium text-black flex items-center hover:underline">
                View all <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Technical Interview</h3>
                  <span className="text-sm font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Upcoming</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">March 15, 2023 • 10:00 AM</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Focus: System Design</span>
                  <button className="text-sm font-medium text-black hover:underline">Prepare</button>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Behavioral Interview</h3>
                  <span className="text-sm font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Upcoming</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">March 18, 2023 • 2:30 PM</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Focus: Leadership</span>
                  <button className="text-sm font-medium text-black hover:underline">Prepare</button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Interviews */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity size={20} />
                Recent Interviews
              </h2>
              <button className="text-sm font-medium text-black flex items-center hover:underline">
                View all <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Technical Interview</h3>
                  <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 rounded">Completed</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">March 5, 2023 • 11:00 AM</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Score: 92/100</span>
                  <button className="text-sm font-medium text-black hover:underline">View report</button>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Behavioral Interview</h3>
                  <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 rounded">Completed</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">February 28, 2023 • 1:30 PM</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Score: 88/100</span>
                  <button className="text-sm font-medium text-black hover:underline">View report</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;