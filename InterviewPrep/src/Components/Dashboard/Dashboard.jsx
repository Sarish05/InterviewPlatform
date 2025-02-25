import React from 'react'
import Menu from './menu.png'
import bell from './bell.png'
import boy from './boy.png'

function Dashboard() {
  return (
    <>
      <div className="flex w-full h-screen">
        {/* sidebar */}
        <div className=" pl- w-1/6 h-full">
        <div className='font-poppins font-bold text-md py-4 w-full flex justify-center'>PrepX</div>
        <div className='font-poppins font-normal  py-4 w-full'>
          <ul className='flex flex-col justify-start items-center text-sm m-2'>
            <li className='flex justify-center p-4 bg-slate-300'>Dashboard</li>
            <li className='flex justify-center p-4'>Interviews</li>
            <li className='flex justify-center p-4'>Candidates</li>
            <li className='flex justify-center p-4'>Reports</li>
            <li className='flex justify-center p-4'>Settings</li>
          </ul>
        </div>

        </div>
        {/* main content */}
        <div className="w-5/6 grid grid-cols-[2fr_2fr_2fr_2fr] grid-rows-[1fr_1fr_2fr_3fr_4fr] gap-1 bg-gray-100">
          <div className="col-span-4 col-start-1 flex justify-start bg-white">
            {/* searchbar and three lines */}
           <div className='flex justify-start p-4 gap-3 w-1/2'>
            <button><img src={Menu} alt="menu" className='h-4'/></button>
            <input type="text" name="search" placeholder='Search' className='border-solid border-2 border-gray-400 rounded-md text-start px-2'/>
           </div>
           {/* notify and profile */}
                <div className='flex justify-end gap-4 w-1/2 px-6'>
                <button><img src={bell} alt="bell" className='h-7'/></button>
                <button><img src={boy} alt="boy" className='h-7'/></button>
                </div>
           </div>
          <div className="col-span-4 col-start-1 mx-6 pt-3">
            <div className='font-poppins text-base font-semibold'>Welcome Back,UserX</div>
            <div className='font-poppins text-sm'>Here's your Interview dashboard overview</div>
          </div>

          {/* 4 boxes */}
          <div className="col-start-1 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center gap-3 items-start px-5 mx-4">
            <div className='text-sm'>Total Interviews</div>
            <div className='text-2xl font-bold'>23</div>
            <div className='text-sm text-emerald-500'>⬆️12% from last month</div>
          </div>
          <div className="col-start-2 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start px-5 mx-4 gap-3">
            <div className='text-sm'>Completed</div>
            <div className='text-2xl font-bold'>16</div>
            <div className='text-sm text-emerald-500'>⬆️9% from last month</div>
          </div>
          <div className="col-start-3 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start px-5 mx-4 gap-3">
            <div className='text-sm'>Success Rate</div>
            <div className='text-2xl font-bold'>75%</div>
            <div className='text-sm text-emerald-500'>⬆️5% from last month</div>
          </div>
          <div className="col-start-4 col-span-1 font-poppins border-white rounded-lg bg-white flex flex-col justify-center items-start px-5 mx-4 gap-3">
            <div className='text-sm'>Avg. Duration</div>
            <div className='text-2xl font-bold'>32m</div>
            <div className='text-sm text-red-500'>⬇️3% from last month</div>
          </div>
          {/* recent interview */}
          <div className="col-span-4 col-start-1 font-poppins p-4 my-5 bg-white mx-4 flex
          flex-col justify-start">
            <div className='flex justify-start'>
            <div className='text-start w-1/2'>Recent Interviews</div>
            <div className='text-end w-1/2 px-8'>View All</div>
            </div>
            <div  className='my-3'>
              <table className='w-full'>
                <tr className='border-gray-500 border-solid'>
                  <th className='text-start'>Interview Type</th>
                  <th className='text-start'>Date</th>
                  <th className='text-start'>Duration</th>
                  <th className='text-start'>Status</th>
                  <th className='text-start'>Score</th>
                </tr>
                <tr>
                  <td>Technical</td>
                  <td>Feb 8,2025</td>
                  <td>28m</td>
                  <td>Completed</td>
                  <td>9.5/10</td>
                </tr>
                <tr>
                  <td>Behavioural</td>
                  <td>Feb 16,2025</td>
                  <td>32m</td>
                  <td>Completed</td>
                  <td>8.7/10</td>
                </tr>
                <tr>
                  <td>Mock Test</td>
                  <td>Feb 24,2025</td>
                  <td>20m</td>
                  <td>Completed</td>
                  <td>9.1/10</td>
                </tr>
              </table>
            </div>
            </div>
          {/* interview Trends */}
          <div className="col-span-2 col-start-1">Interview trends</div>

          {/* performance metrics */}
          <div className="col-span-2 col-start-3">performance metrics</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard