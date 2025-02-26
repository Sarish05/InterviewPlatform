import React from 'react';
import { useNavigate } from 'react-router-dom';
import icon_im from './oauth.svg';
import img_side from './test2.jpeg';
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 } 
    }
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0, filter: "blur(10px)" }, 
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)", 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <div className='w-full h-screen flex'>

      <div className='w-1/2 h-full relative'>
        <img src={img_side} className='w-full h-full object-cover' alt="Background" />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 text-center"
          initial="hidden"
          animate="visible"
          variants={textContainerVariants}
        >
          <motion.h1 className="text-white text-4xl font-bold mb-2" variants={textVariants}>
            Practice Smarter.
          </motion.h1>
          <motion.h1 className="text-yellow-400 text-4xl font-bold mb-2" variants={textVariants}>
            Interview Better.
          </motion.h1>
          <motion.h1 className="text-white text-4xl font-bold" variants={textVariants}>
            Get Hired Faster.
          </motion.h1>
        </motion.div>
      </div>

      <div className='w-1/2 h-full bg-white flex flex-col p-14 justify-center items-center'>
        <h1 className='max-w-[500px] text-xl text-[#060606] font-semibold mr-auto mb-8'>
          💀 AI Based Interview Platform
        </h1>

        <div className='w-full flex flex-col max-w-[400px]'>
          <h3 className='text-3xl font-semibold mb-4'>Login</h3>
          <p className='text-base mb-4'>Welcome Back! Please enter your details.</p>

          <input 
            type="email" 
            placeholder='Email' 
            className='w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none' 
          />

          <input 
            type="password" 
            placeholder='Password' 
            className='w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none' 
          />

          <div className='w-full flex items-center justify-between my-2'>
            <label className='flex items-center text-sm'>
              <input type="checkbox" className='w-4 h-4 mr-2' />
              Remember me for 30 days
            </label>
            <p className='text-sm font-medium cursor-pointer underline'>Forgot Password?</p>
          </div>

          <button className='w-full text-white bg-black my-2 font-semibold rounded-md p-4'>
            Log In
          </button>
          <button onClick={() => navigate('/register')} className='w-full text-black bg-white border border-black my-2 font-semibold rounded-md p-4'>
            Register
          </button>

          <div className='w-full flex items-center justify-center my-4 relative'>
            <div className='w-full h-[1px] bg-black'></div>
            <p className='absolute bg-white px-2'>or</p>
          </div>

          <button className='w-full flex items-center justify-center border border-black p-4 rounded-md'>
            <img src={icon_im} className='h-6 mr-2' alt="OAuth" />
            OAuth 2.0
          </button>
        </div>

        <p className='text-sm mt-4'>
          Don't have an account? <span onClick={() => navigate('/register')} className='font-semibold underline cursor-pointer'>Sign up for free</span>
        </p>
      </div>

    </div>
  );
}

export default Login;
