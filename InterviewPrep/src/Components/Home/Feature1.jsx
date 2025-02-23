import React from 'react'
import image1 from './image1.jpg'
import image2 from './image2.jpg'
import image3 from './image3.jpg'

const Feature1 = () => {
  return (
    <div className="w-full mt-12 mb-24">
      <h1 className="text-center text-lg font-poppins font-medium mb-8 ">How PrepX works</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center place-content-center max-w-[1040px] mx-auto">
        {/* First Row */}
        <div className="w-[414px] h-[310px] order-1 lg:order-none">
          <img src={image2} alt="roles" className="w-full h-full object-cover" />
        </div>
        <div className="order-2 lg:order-none flex justify-center flex-col">
          <h1 className="font-poppins text-2xl font-bold lg:text-3xl text-[#040348] text-center lg:text-left mb-2">Choose Your Tech Stack</h1>
          <p className="font-poppins text-base font-medium lg:text-lg text-[#040348] h-[70px] text-center lg:text-left">
            Share your skills to provide more relevant questions
          </p>
        </div>

        {/* Second Row */}
        <div className="order-4 lg:order-none flex justify-center flex-col">
          <h1 className="font-poppins text-2xl lg:text-3xl text-[#040348]  font-bold text-center mb-2 lg:text-left">Practice Interview Questions</h1>
          <p className="font-poppins text-base lg:text-lg text-[#040348] h-[70px] text-center font-medium lg:text-left">
            PrepX will ask you contextual follow-up questions based on your answer
          </p>
        </div>
        <div className="w-[414px] h-[310px] order-3 lg:order-none">
          <img src={image1} alt="experience" className="w-full h-full object-cover" />
        </div>

        {/* Third Row */}
        <div className="w-[414px] h-[310px] order-5 lg:order-none flex justify-center items-center flex-col">
          <img src={image3} alt="report" className="w-full h-full object-cover" />
        </div>
        <div className="order-6 lg:order-none flex justify-center flex-col">
          <h1 className="font-poppins text-2xl font-bold lg:text-3xl text-[#040348] lg:text-left mb-2">Receive feedback instantly</h1>
          <p className="font-poppins text-base lg:text-lg text-[#040348] h-[70px] text-center lg:text-left font-medium">
            PrepX will generate your speaking report with analytics such as clarity,  preformance.
          </p>
        {/* Button */}
        </div>

        {/* <div className="col-span-1 lg:col-span-2 flex justify-center items-center order-7">
          <button 
            type="button" 
            className="w-[218px] h-[54px] rounded-full bg-indigo-600 text-white text-base font-[poppins] border-none"
          >
            Try Now
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default Feature1
