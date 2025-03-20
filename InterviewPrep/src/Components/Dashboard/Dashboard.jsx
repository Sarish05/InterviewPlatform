import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageSquare, FileText, Settings, ChevronRight, Menu, Bell, BarChart2 } from 'lucide-react';
import boy from './boy.png';

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ username: "", profilePhoto: "" });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        username: storedUser.name,  // Extract name
        profilePhoto: storedUser.image || boy,  // Extract profile image
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const performanceData = [
    { metric: "Interview Completion Rate", value: 92, color: "bg-black" },
    { metric: "Candidate Satisfaction", value: 87, color: "bg-black" },
    { metric: "Interviewer Efficiency", value: 78, color: "bg-black" },
    { metric: "Question Quality", value: 85, color: "bg-black" }
  ];

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
                    placeholder="Search..."
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

            {/* Welcome section */}
            <motion.div 
              className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, <span>{user.username || "User"}</span>!</h1>
                <p className="text-gray-600">Here's your interview dashboard overview</p>
              </div>
              <NavLink 
                to="/interview-selection" 
                className="px-4 py-2.5 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                Give New Interview
                <ChevronRight size={16} />
              </NavLink>
            </motion.div>

            {/* Statistics cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Interviews</h3>
                <div className="text-2xl font-bold">23</div>
                <div className="mt-2 flex items-center text-sm text-emerald-500">
                  <span className="mr-1">↑</span> 12% from last month
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                <div className="text-2xl font-bold">16</div>
                <div className="mt-2 flex items-center text-sm text-emerald-500">
                  <span className="mr-1">↑</span> 9% from last month
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">Success Rate</h3>
                <div className="text-2xl font-bold">75%</div>
                <div className="mt-2 flex items-center text-sm text-emerald-500">
                  <span className="mr-1">↑</span> 5% from last month
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Duration</h3>
                <div className="text-2xl font-bold">32m</div>
                <div className="mt-2 flex items-center text-sm text-red-500">
                  <span className="mr-1">↓</span> 3% from last month
                </div>
              </motion.div>
            </motion.div>

            {/* Recent interviews */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100 overflow-hidden"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Recent Interviews</h2>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="px-6 py-4 font-medium">Interview Type</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Technical</td>
                      <td className="px-6 py-4">Feb 8, 2025</td>
                      <td className="px-6 py-4">28m</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">9.5/10</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Behavioural</td>
                      <td className="px-6 py-4">Feb 16, 2025</td>
                      <td className="px-6 py-4">32m</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Review
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">8.7/10</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Mock Test</td>
                      <td className="px-6 py-4">Feb 24, 2025</td>
                      <td className="px-6 py-4">20m</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">9.1/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interview Trends */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Interview Trends</h2>
                  <select className="bg-gray-100 border-none text-sm rounded-lg px-3 py-2 focus:outline-none">
                    <option value="2days">Last 2 days</option>
                    <option value="7days">Last 7 days</option>
                    <option value="month">Last month</option>
                    <option value="year">Last year</option>
                  </select>
                </div>
                <div className="bg-gray-50 w-full h-64 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                  Chart Placeholder
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                variants={itemVariants}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart2 size={20} />
                  Performance Metrics
                </h2>
                <div className="space-y-6">
                  {performanceData.map((item, index) => (
                    <div key={index} className="w-full">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className={`${item.color} h-2.5 rounded-full transition-all duration-500`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;