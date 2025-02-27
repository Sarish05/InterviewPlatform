import React,{useState} from 'react'
import bell from './bell.png'
import boy from './boy.png'
import { NavLink } from 'react-router-dom'
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function Dashboard() {
  // State to track sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
    const performanceData = [
        { metric: "Interview Completion Rate", value: 92, color: "bg-blue-500" },
        { metric: "Candidate Satisfaction", value: 87, color: "bg-green-500" },
        { metric: "Interviewer Efficiency", value: 78, color: "bg-purple-500" },
        { metric: "Question Quality", value: 85, color: "bg-yellow-500" }
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
                            to= "/dashboard"
                            className={({isActive}) =>
                                `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                            }
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <div>Dashboard</div></NavLink></li>
                                <li>
                                <NavLink 
                                  to= "/interviews"
                                  className={({isActive}) =>
                                  `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                                   }
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                                <div>Interviews</div></NavLink></li>
                                
                                <li>
                                
                              <NavLink 
                              to= "/reports"
                              className={({isActive}) =>
                                `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                              }
                              >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <div>Reports</div></NavLink></li>
                        
                                <li>
                                
                              <NavLink 
                              to= "/settings"
                              className={({isActive}) =>
                                `${isActive ? " bg-slate-300 rounded" : "border-white"} flex gap-2 p-4 duration-200`
                            }
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"       className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                              </svg>
                                <div>Settings</div></NavLink></li>
                    </ul>
                </div>
            </div>
        {/* main content */}
        <div className="flex-1 h-full overflow-y-auto bg-gray-100">
            <div className = "p-6">
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
                            placeholder="Search..."
                            className="ml-2 w-full outline-none bg-transparent text-gray-700 text-sm"
                        />
                        </div>
                    </div>
                    {/* notify and profile */}
                    <div className='flex items-center gap-4 px-4'>
                        <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                          <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
                        </svg>
                        </button>
                        <NavLink to= "/profile"><img src={boy} alt="boy" className='h-7'/></NavLink>
                        
                    </div>
                </div>

           {/* Welcome */}
          <div className="mb-6 flex justify-between mr-16">
            <div>
            <div className='font-poppins text-base font-semibold'>Welcome Back UserX !</div>
            <div className='font-poppins text-sm'>Here's your Interview dashboard overview</div>
            </div>
            <div>
                <NavLink to="/interviews" className="border-solid bg-black text-white rounded-3xl px-4 py-2 flex justify-center items-center text-sm">
                  Give new Interview
                </NavLink>
            </div>
          </div>

          {/* 4 horizontal boxes */}
          <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="col-start-1 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center gap-1 items-start mx-4 p-2">
            <div className='text-sm'>Total Interviews</div>
            <div className='text-xl font-bold'>23</div>
            <div className='text-xs text-emerald-500'>⬆️12% from last month</div>
          </div>
          <div className="col-start-2 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start mx-4 gap-1 p-2">
            <div className='text-sm'>Completed</div>
            <div className='text-xl font-bold'>16</div>
            <div className='text-xs text-emerald-500'>⬆️9% from last month</div>
          </div>
          <div className="col-start-3 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start p-2 mx-4 gap-1">
            <div className='text-sm'>Success Rate</div>
            <div className='text-xl font-bold'>75%</div>
            <div className='text-xs text-emerald-500'>⬆️5% from last month</div>
          </div>
          <div className="col-start-4 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start p-2 mx-4 gap-1">
            <div className='text-sm'>Avg. Duration</div>
            <div className='text-xl font-bold'>32m</div>
            <div className='text-xs text-red-500'>⬇️3% from last month
            </div>
          </div>
          </div>
          {/* recent interview */}
          <div className="font-poppins p-4 my-5 bg-white mb-6 rounded-lg shadow-sm">
            <div className='flex justify-between items-center mb-4'>
            <div className='text-base font-medium'>Recent Interviews</div>
            <div className='text-end w-1/2 pr-24'>
            <button className='rounded-lg bg-indigo-100 text-indigo-600 px-3 py-1'>View All</button></div>
            </div>
            <div  className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                <tr className='border-b text-gray-600'>
                  <th className='text-start px-4 py-2 '>Interview Type</th>
                  <th className='text-start px-4 py-2'>Date</th>
                  <th className='text-start px-4 py-2'>Duration</th>
                  <th className='text-start px-4 py-2'>Status</th>
                  <th className='text-start px-4 py-2'>Score</th>
                </tr>
                </thead>
                <tbody>
                <tr className='border-b border-gray-100'>
                  <td className='text-start px-4 py-3'>Technical</td>
                  <td className='text-start px-4 py-3'>Feb 8,2025</td>
                  <td className='text-start px-4 py-3'>28m</td>
                  <td className='text-start px-4 py-3'>
                      <span className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs'>Completed</span>
                    </td>
                  <td className='text-start px-4 py-3 font-medium'>9.5/10</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='text-start px-4 py-3'>Behavioural</td>
                  <td className='text-start px-4 py-3'>Feb 16,2025</td>
                  <td className='text-start px-4 py-3'>32m</td>
                  <td className='text-start px-4 py-3'>
                      <span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'>Review</span>
                    </td>
                  <td className='text-start px-4 py-3 font-medium'>8.7/10</td>
                </tr>
                <tr>
                  <td className='text-start px-4 py-3'>Mock Test</td>
                  <td className='text-start px-4 py-3'>Feb 24,2025</td>
                  <td className='text-start px-4 py-3'>20m</td>
                  <td className='text-start px-4 py-3'>
                      <span className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs'>Completed</span>
                    </td>
                  <td className='text-start px-4 py-3 font-medium'>9.1/10</td>
                </tr>
                </tbody>
              </table>
            </div>
            </div>
          {/* Bottom section with charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Interview Trends */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className='flex justify-between items-center mb-4'>
                <div className='font-medium'>Interview Trends</div>
                <select name="Timeline" className='border border-gray-300 rounded px-2 py-1 text-sm text-gray-500'>
                  <option value="2days">Last 2 days</option>
                  <option value="7days">Last 7 days</option>
                  <option value="month">Last month</option>
                  <option value="year">Last year</option>
                </select>
              </div>
              <div className='bg-gray-200 w-full h-64 rounded flex items-center justify-center text-gray-500'>Chart Placeholder</div>
            </div>

            {/* Performance metrics with horizontal bars */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className='font-medium mb-6'>Performance Metrics</div>
              <div className='space-y-6'>
                {performanceData.map((item, index) => (
                  <div key={index} className="w-full">

                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{item.metric}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-500`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
      </div>
      </div>
    </>
    
  );
}

export default Dashboard