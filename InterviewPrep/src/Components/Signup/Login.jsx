import React from 'react';
import { useNavigate } from 'react-router-dom';
import icon_im from './icon_google.png';
import img_side from './test2.jpeg';
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../api';
import useAuthCheck from '../utils/useAuthCheck';

function Login() {

  useAuthCheck();

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleForgotPassword = () => {
      navigate("/forgot-password"); 
  };

  const handleLogin = async () => {
      try {
          const response = await fetch("http://localhost:8080/auth/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          if (response.ok) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify({ email: data.email, name: data.name }));
              toast.success("Login successful! Redirecting...", { autoClose: 2000 });
              setTimeout(() => navigate("/dashboard"), 2000);
          } else {
              toast.error(data.message || "Login failed!");
          }
      } catch (error) {
          toast.error("Error logging in. Please try again.");
          console.error("Error:", error);
      }
  };

  const responseGoogle = async (authResult) => {
      try {
          if (authResult?.code) {
/*               console.log("Google Auth Code:", authResult.code);
 */
              const result = await googleAuth(authResult.code);

/*               console.log("Google Login Success:", result.data);
 */
              localStorage.setItem("user", JSON.stringify(result.data.user));
              localStorage.setItem("token", result.data.token);

              toast.success("Google Login Successful! Redirecting...");

              setTimeout(() => navigate("/dashboard"), 1500);
          }
      } catch (err) {
          console.error("Error while requesting Google code:", err);
          toast.error("Google login failed. Try again.");
      }
  };

  const googleLogin = useGoogleLogin({
      onSuccess: responseGoogle,
      onError: responseGoogle,
      flow: 'auth-code'
  })


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
          PrepX
        </h1>

        <div className='w-full flex flex-col max-w-[400px]'>
          <h3 className='text-3xl font-semibold mb-4'>Login</h3>
          <p className='text-base mb-4'>Welcome Back! Please enter your details.</p>
            <input 
              type="email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder='Email' 
              className='w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none' 
            />

            <input 
              type="password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder='Password' 
              className='w-full text-black bg-transparent my-2 py-2 border-b border-black outline-none' 
            />

            <div className='w-full flex items-center justify-between my-2'>
              <label className='flex items-center text-sm'>
                <input type="checkbox" className='w-4 h-4 mr-2' />
                Remember me for 30 days
              </label>
              <p onClick={handleForgotPassword} className='text-sm font-medium cursor-pointer underline'>Forgot Password?</p>
            </div>

            <button type='submit' onClick={handleLogin} className='w-full text-white bg-black my-2 font-semibold rounded-md p-4'>
              Log In
            </button>
          <button onClick={() => navigate('/register')} className='w-full text-black bg-white border border-black my-2 font-semibold rounded-md p-4'>
            Register
          </button>

          <div className='w-full flex items-center justify-center my-4 relative'>
            <div className='w-full h-[1px] bg-black'></div>
            <p className='absolute bg-white px-2'>or</p>
          </div>

          <button onClick={googleLogin} className='w-full flex items-center justify-center border border-black p-4 rounded-md'>
            <img src={icon_im} className='h-6 mr-2' alt="OAuth" />
            Login with Google
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