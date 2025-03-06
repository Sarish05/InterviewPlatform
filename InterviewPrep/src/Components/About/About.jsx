import React from "react";
import { FaLinkedin, FaEnvelope, FaPhone, FaGithub } from "react-icons/fa";

const teamMembers = [
 {
   name: "Sarish Sonawane",
   role: "IT Engineer, PICT",
   linkedin: "https://www.linkedin.com/in/sarish-sonawane-6a14b6293",
   email: "sarishsonawane2005@gmail.com",
   contact: "9922258259",
   github: "https://github.com/Sarish05",
   image: "./src/assets/sarish.jpeg",
 },
 {
   name: "Tanishq Choudhary",
   role: "IT Engineer, PICT",
   linkedin: "https://www.linkedin.com/in/tanishq-choudhary-tc/",
   email: "tanishqchoudhary5689@gmail.com",
   contact: "8010125342",
   github: "https://github.com/Tanishq4501",
   image: "/./src/assets/tanishqqt.png",
 },
 {
   name: "Shayan Kazi",
   role: "IT Engineer, PICT",
   linkedin: "https://www.linkedin.com/in/shayan-kazi-9685612a7",
   email: "shayankazi147@gmail.com",
   contact: "9420200037",
   github: "https://github.com",
   image: "./src/assets/sarish.jpeg",
 },
 {
   name: "Shubham Bhosale",
   role: "IT Engineer, PICT",
   linkedin: "#",
   email: "shubhamrbhosale910@gmail.com",
   contact: "9340918137",
   github: "https://github.com",
   image: "./src/assets/shubham.png",
 },
];

const About = () => {
 return (
   <div className="bg-white min-h-screen">
     {/* Main Content with proper spacing from navbar */}
     <main className="pt-24 pb-12 max-w-7xl mx-auto px-4">
       <section className="mb-16">
         <div className="text-center mb-12">
           <h1 className="text-5xl font-bold mb-6 text-black">
             About <span className="text-black">PrepX</span>
           </h1>
          
           <div className="h-1 w-20 bg-black mx-auto rounded-full mb-8"></div>
          
           <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-800">
             PrepX is an advanced AI-powered interview preparation platform designed for students and early career professionals.
             We use cutting-edge artificial intelligence to provide personalized mock interviews, analyze responses in real-time,
             and enhance both technical & behavioral interview skills.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
           <div className="p-6 rounded-lg bg-white shadow-md transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ease-in-out border border-gray-200">
             <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M12 21v-1" />
               </svg>
             </div>
             <h3 className="text-xl font-bold mb-2 text-black">AI-Powered Insights</h3>
             <p className="text-gray-800">
               Our advanced AI analyzes your responses and provides personalized feedback to improve your interview performance.
             </p>
           </div>
          
           <div className="p-6 rounded-lg bg-white shadow-md transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ease-in-out border border-gray-200">
             <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
               </svg>
             </div>
             <h3 className="text-xl font-bold mb-2 text-black">Realistic Simulations</h3>
             <p className="text-gray-800">
               Practice with realistic mock interviews tailored to specific roles, companies, and industries.
             </p>
           </div>
          
           <div className="p-6 rounded-lg bg-white shadow-md transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ease-in-out border border-gray-200">
             <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold mb-2 text-black">Skill Enhancement</h3>
             <p className="text-gray-800">
               Develop and refine both technical skills and soft skills essential for job interviews and career success.
             </p>
           </div>
         </div>
       </section>

       <section>
         <div className="text-center mb-12">
           <h2 className="text-4xl font-bold mb-6 text-black">Meet Our Team</h2>
           <div className="h-1 w-20 bg-black mx-auto rounded-full mb-8"></div>
           <p className="text-lg max-w-2xl mx-auto text-gray-800">
             We're a passionate team of IT engineers from PICT working to revolutionize interview preparation through AI.
           </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {teamMembers.map((member, index) => (
             <div
               key={index}
               className="rounded-lg bg-white shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 border border-gray-200"
             >
               <div className="p-6 flex flex-col items-center">
                 {/* Profile Picture */}
                 <div className="mb-4">
                   <img
                     src={member.image}
                     alt={member.name}
                     className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 transition-transform duration-500 hover:scale-105"
                   />
                 </div>
                
                 {/* Member details */}
                 <h3 className="text-xl font-bold mb-1 text-black">{member.name}</h3>
                 <p className="text-sm mb-4 text-gray-800">{member.role}</p>
                
                 {/* Social links with brand colors on hover */}
                 <div className="flex space-x-4 mt-2">
                   <a
                     href={member.linkedin}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-gray-700 hover:text-[#0077b5] transition-colors duration-300 transform hover:scale-110"
                   >
                     <FaLinkedin size={20} />
                   </a>
                   <a
                     href={`mailto:${member.email}`}
                     className="text-gray-700 hover:text-[#ea4335] transition-colors duration-300 transform hover:scale-110"
                   >
                     <FaEnvelope size={20} />
                   </a>
                   <a
                     href={`tel:${member.contact}`}
                     className="text-gray-700 hover:text-[#25D366] transition-colors duration-300 transform hover:scale-110"
                   >
                     <FaPhone size={20} />
                   </a>
                   <a
                     href={member.github}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-gray-700 hover:text-black transition-colors duration-300 transform hover:scale-110"
                   >
                     <FaGithub size={20} />
                   </a>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </section>
     </main>

     {/* Footer can be uncommented and styled if needed */}
   </div>
 );
};

export default About;