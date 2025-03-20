import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageSquare, FileText, Settings, ChevronRight, Menu, Bell, Download, Filter } from 'lucide-react';
import boy from './boy.png';

function Interviews() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ username: "", profilePhoto: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        username: storedUser.name,
        profilePhoto: storedUser.image || boy,
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Sample data for recent interviews
  const interviewsData = [
    { type: "Technical", date: "Feb 8, 2025", duration: "28m", status: "Completed", score: "9.5/10" },
    { type: "Behavioural", date: "Feb 16, 2025", duration: "32m", status: "Review", score: "8.7/10" },
    { type: "System Design Test", date: "Feb 24, 2025", duration: "20m", status: "Completed", score: "9.1/10" },
    { type: "OOP Test", date: "Feb 5, 2025", duration: "45m", status: "Completed", score: "8.9/10" },
    { type: "DSA Test", date: "Feb 12, 2025", duration: "50m", status: "Completed", score: "9.2/10" },
    { type: "Behavioural", date: "Jan 29, 2025", duration: "34m", status: "Review", score: "8.5/10" },
    { type: "Technical", date: "Jan 22, 2025", duration: "30m", status: "Completed", score: "9.0/10" },
    { type: "CN Test", date: "Jan 18, 2025", duration: "25m", status: "Completed", score: "8.8/10" }
  ];

  return (
    <>
      <div className="flex w-full h-screen overflow-hidden font-sans bg-gray-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-60' : 'w-0'} h-full shadow-lg bg-white transition-all duration-300 overflow-hidden border-r border-gray-200`}>
          <div className='font-bold text-xl py-6 w-full flex justify-center border-b border-gray-100'>
            PrepX
          </div>
          <div className='py-6 w-full'>
            <ul className='flex flex-col justify-start px-4 space-y-2'>
              <li>
                <NavLink 
                  to="/dashboard"
                  className={({isActive}) =>
                    `${isActive ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"} flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`
                  }
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/interviews"
                  className={({isActive}) =>
                    `${isActive ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"} flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`
                  }
                >
                  <MessageSquare size={18} />
                  <span>Interviews</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/reports"
                  className={({isActive}) =>
                    `${isActive ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"} flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`
                  }
                >
                  <FileText size={18} />
                  <span>Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/settings"
                  className={({isActive}) =>
                    `${isActive ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"} flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`
                  }
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 h-full overflow-y-auto">
          <motion.div 
            className="p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top navigation */}
            <motion.div 
              className="flex justify-between items-center mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 w-1/2">
                <button 
                  onClick={toggleSidebar} 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm w-full max-w-md">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search interviews..."
                    className="ml-2 w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>

              {/* Notification and Profile */}
              <div className='flex items-center gap-4'>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell size={20} />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={user.profilePhoto}
                      alt="User"
                      className="h-9 w-9 rounded-full object-cover border border-gray-200"
                    />
                    <span className="hidden md:block font-medium text-sm">{user.username || "User"}</span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-1 z-50 border border-gray-100"
                      >
                        <NavLink
                          to="/profile"
                          className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          My Profile
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          Settings
                        </NavLink>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm"
                          onClick={() => {
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                          }}
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Page Title & CTA */}
            <motion.div 
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-xl font-bold text-gray-900">Recent Interviews</h1>
                <p className="text-gray-600">View and manage all your interview sessions</p>
              </div>
              <NavLink 
                to="/interview-selection" 
                className="px-4 py-2.5 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                Give New Interview
                <ChevronRight size={16} />
              </NavLink>
            </motion.div>

            {/* Filter controls */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Filter size={18} />
                <h3 className="font-medium">Filter Interviews</h3>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="type-filter" className="text-sm font-medium text-gray-600">Type:</label>
                  <select id="type-filter" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="">All Types</option>
                    <option value="technical">Technical</option>
                    <option value="behavioural">Behavioural</option>
                    <option value="mocktest">Mock Test</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">Status:</label>
                  <select id="status-filter" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="date-filter" className="text-sm font-medium text-gray-600">Date:</label>
                  <select id="date-filter" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Interviews Table */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                      <th className="px-6 py-4 font-medium">Interview Type</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                      <th className="px-6 py-4 font-medium text-center">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {interviewsData.map((interview, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">{interview.type}</td>
                        <td className="px-6 py-4">{interview.date}</td>
                        <td className="px-6 py-4">{interview.duration}</td>
                        <td className="px-6 py-4">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              interview.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {interview.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">{interview.score}</td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination - Uncomment if needed */}
              {/* <div className="flex justify-between items-center p-6 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Showing 1-8 of 24 interviews
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Previous</button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-black font-medium text-sm">1</button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">2</button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">3</button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Next</button>
                </div>
              </div> */}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Interviews;