import React from 'react'

function Questions() {
  return (
    <div className='w-full font-poppins overflow-hidden min-h-screen flex flex-col'>
        {/* header */}
        <div className='px-48 flex flex-none justify-between py-4'>
            <div className='font-semibold text-lg'>
                PrepX
            </div>
            <div className='flex gap-8'>
                <div className='flex justify-between items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div className="text-md">
                     06:45
                    </div>
                </div>
                <div><button className='bg-black px-3 py-2 rounded-md text-white'>End Interview</button></div>
            </div>
        </div>
        {/* main content */}
        <div className='pt-8 flex-grow flex justify-center items-start bg-gray-200'>
            <div className='flex flex-col justify-center items-center w-3/5'>
                {/* upper heading */}
                <div className='w-full flex items-center justify-around'>
                    <button className='rounded-3xl bg-white p-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div>
                        <div className='font-lg text-center font-semibold'>Technical Interview</div>
                        <div className='font-sm text-gray-600'>
                            Questions 4/10 | 2 Answered
                        </div>
                    </div>
                    <button className='rounded-3xl bg-white p-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    </button>
                </div>

                <div className='w-full flex flex-col my-8 bg-white rounded-lg'>
                    {/* Question and hear container - top section */}
                    <div className='p-6 flex-1 flex flex-col min-h-64'>
                        {/* div for question and hear */}
                        <div className='flex flex-col items-center w-full'>
                            <div className='flex items-center justify-center'>
                                <div className='text-center font-md font-semibold mr-2'>What are principles of Object-Oriented Programming?</div>
                                <button className='bg-gray-300 rounded-3xl flex p-2 flex-shrink-0'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Empty space for growing */}
                        <div className='flex-grow'></div>
                        
                        {/* div to speak - bottom section */}
                        <div className='flex justify-center mt-8 mb-4'>
                            <button className='bg-gray-300 rounded-lg flex p-3 items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                                <div className='font-semibold'>Speak</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* footer */}
        <div className='text-center py-4 text-sm'>Practice makes perfect. Keep Going!</div>
    </div>
  )
}

export default Questions