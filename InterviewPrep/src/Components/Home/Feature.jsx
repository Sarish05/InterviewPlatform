import React from 'react'
import image1 from './image1.jpg'
import image2 from './image2.jpg'
import image3 from './image3.jpg'

const Feature = () => {
  return (
    <div className="w-full">
      <h3 className="text-center font-inter text-lg uppercase">how yoodli works</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center place-content-center max-w-[1040px] mx-auto">
        {/* First Row */}
        <div className="w-[414px] h-[310px] order-1 lg:order-none">
          <img src={image2} alt="roles" className="w-full h-full object-cover" />
        </div>
        <div className="order-2 lg:order-none">
          <h1 className="font-poppins text-2xl lg:text-3xl text-[#040348] text-center lg:text-left">Choose Your Role</h1>
          <p className="font-poppins text-base lg:text-lg text-[#040348] h-[70px] text-center lg:text-left font-normal">
            Enter the role you are preparing for. Anything from junior PM to Google CEO
          </p>
        </div>

        {/* Second Row */}
        <div className="order-4 lg:order-none">
          <h1 className="font-poppins text-2xl lg:text-3xl text-[#040348] text-center lg:text-left">Practice Interview Questions</h1>
          <p className="font-poppins text-base lg:text-lg text-[#040348] h-[70px] text-center lg:text-left font-normal">
            Yoodli will ask you contextual follow-up questions based on your answer
          </p>
        </div>
        <div className="w-[414px] h-[310px] order-3 lg:order-none">
          <img src={image1} alt="experience" className="w-full h-full object-cover" />
        </div>

        {/* Third Row */}
        <div className="w-[414px] h-[310px] order-5 lg:order-none">
          <img src={image3} alt="feedback" className="w-full h-full object-cover" />
        </div>
        <div className="order-6 lg:order-none">
          <h1 className="font-poppins text-2xl lg:text-3xl text-[#040348] text-center lg:text-left">Receive instant feedback.</h1>
          <p className="font-poppins text-base lg:text-lg text-[#040348] h-[70px] text-center lg:text-left font-normal">
            we will generate your speaking report with analytics such as pacing and filler words, and suggestions to improve
          </p>
        </div>

        {/* Button */}
        <div className="col-span-1 lg:col-span-2 flex justify-center items-center order-7">
          <button 
            type="button" 
            className="w-[218px] h-[54px] rounded-full bg-[#524ffc] text-white text-base font-poppins border-none"
          >
            get started for free
          </button>
        </div>
      </div>
    </div>
  );
};



export default Feature