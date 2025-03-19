import React, { useState } from 'react';
import bell from './bell.png';
import boy from './boy.png';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function Interviews() {
  // State to track sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      <div className="flex w-full h-screen overflow-hidden font-poppins">
        {/* sidebar */}
        <div className={`${sidebarOpen ? 'w-48' : 'w-0'} h-full shadow-md bg-white transition-all duration-300 overflow-hidden`}>
          <div className='font-poppins font-bold text-md py-4 w-full flex justify-center'>PrepX</div>
          <div className='font-poppins font-normal py-4 w-full'>
            <ul className='flex flex-col justify-start items-center text-sm m-2'>
              <li>
                <NavLink 
                  to="/dashboard"
                  className={({isActive}) =>
                    `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <div>Dashboard</div>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/interviews"
                  className={({isActive}) =>
                    `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <div>Interviews</div>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/reports"
                  className={({isActive}) =>
                    `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <div>Reports</div>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/settings"
                  className={({isActive}) =>
                    `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                  <div>Settings</div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        
        {/* main content */}
        <div className="flex-1 h-full overflow-y-auto bg-gray-100">
          <div className="p-6">
            {/* searchbar and three lines */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 w-1/2">
                <button 
                  onClick={toggleSidebar} 
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm w-full max-w-md h-10">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search interviews..."
                    className="ml-2 w-full outline-none bg-transparent text-gray-700 text-sm"
                  />
                </div>
              </div>
              {/* notify and profile */}
              <div className='flex items-center gap-4 px-4'>
                <button><img src={bell} alt="bell" className='h-7'/></button>
                <NavLink to="/profile"><img src={boy} alt="boy" className='h-7'/></NavLink>
              </div>
            </div>

            {/* Page Title */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-poppins text-xl font-semibold">Recent Interviews</h1>
                <p className="font-poppins text-sm text-gray-500">View and manage all your interview sessions</p>
              </div>
              <div>
                <NavLink to="/interview-selection" className="border-solid bg-black text-white rounded-3xl px-4 py-2 flex justify-center items-center text-sm">
                  Give new Interview
                </NavLink>
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="type-filter" className="text-sm font-medium">Type:</label>
                  <select id="type-filter" className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="">All Types</option>
                    <option value="technical">Technical</option>
                    <option value="behavioural">Behavioural</option>
                    <option value="mocktest">Mock Test</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="status-filter" className="text-sm font-medium">Status:</label>
                  <select id="status-filter" className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="date-filter" className="text-sm font-medium">Date:</label>
                  <select id="date-filter" className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detailed Interviews Table */}
            <div className="font-poppins bg-white p-4 rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="text-start px-4 py-3">Interview Type</th>
                      <th className="text-start px-4 py-3">Date</th>
                      <th className="text-start px-4 py-3">Duration</th>
                      <th className="text-start px-4 py-3">Status</th>
                      <th className="text-start px-4 py-3">Score</th>
                      <th className="text-start px-4 py-3 flex items-center justify-center">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviewsData.map((interview, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="text-start px-4 py-3">{interview.type}</td>
                        <td className="text-start px-4 py-3">{interview.date}</td>
                        <td className="text-start px-4 py-3">{interview.duration}</td>
                        <td className="text-start px-4 py-3">
                          <span 
                            className={`${interview.status === 'Completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'} 
                              px-2 py-1 rounded text-xs`}
                          >
                            {interview.status}
                          </span>
                        </td>
                        <td className="text-start px-4 py-3 font-medium">{interview.score}</td>
                        <td className="text-start px-4 py-3  flex items-center justify-center">
                          <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {/* <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing 1-8 of 24 interviews
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">Previous</button>
                  <button className="px-3 py-1 border border-gray-300 rounded bg-indigo-100 text-indigo-600 text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">Next</button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Interviews;