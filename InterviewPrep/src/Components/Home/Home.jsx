import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import homeSvg from './home.svg';
import Feature1 from './Feature1';
import Company from './Company';
import { ArrowRight, CheckCircle, Mic, Video, BarChart2 } from 'lucide-react';

export default function Home() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Features for the cards section
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-black" />,
      title: "Audio Analysis",
      description: "Get insights on your speaking tone, pitch, clarity, and rate to improve your communication."
    },
    {
      icon: <Video className="h-8 w-8 text-black" />,
      title: "Video Monitoring",
      description: "Analyze your body language and facial expressions during practice interviews."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-black" />,
      title: "Detailed Reports",
      description: "Receive comprehensive performance analysis with actionable improvement suggestions."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gray-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Text Content */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Ace Your <span className="text-black">Interviews</span> with AI Precision
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                PrepX uses advanced AI to analyze your interview responses, providing real-time feedback on content, speech patterns, and body language.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <NavLink 
                  to="/register" 
                  className="px-8 py-4 bg-black text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 text-center"
                >
                  Start Practicing Free
                </NavLink>
                
                <NavLink 
                  to="/login" 
                  className="px-8 py-4 bg-white border-2 border-black text-black font-medium rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Login
                </NavLink>
              </div>
              
              <div className="mt-8 flex items-center justify-center md:justify-start text-gray-600">
                <span className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-black" />
                  AI-Powered Analysis
                </span>
                <span className="mx-4">•</span>
                <span className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-black" />
                  Personalized Feedback
                </span>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img 
                src={homeSvg} 
                alt="AI Interview Preparation" 
                className="w-full max-w-xl mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <Company />
      
      {/* Features Cards Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced Interview Preparation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PrepX provides comprehensive tools to help you excel in technical and behavioral interviews.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300 border border-gray-100"
                variants={itemVariants}
              >
                <div className="bg-gray-50 p-3 inline-block rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <NavLink to="/login" className="text-black font-medium flex items-center hover:text-gray-800 transition">
                  Try it now <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <Feature1 />
      </section>
      
      {/* CTA Section */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-5xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to ace your next interview?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of candidates who have improved their interview skills with PrepX's AI-powered platform.
            </p>
            <NavLink 
              to="/login" 
              className="px-8 py-4 bg-white text-black font-medium rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 inline-block"
            >
              Get Started Now
            </NavLink>
          </motion.div>
        </div>
      </section>
    </>
  );
}