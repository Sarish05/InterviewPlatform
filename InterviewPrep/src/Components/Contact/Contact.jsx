import React, { useState } from "react";
import {
 FaMapMarkerAlt,
 FaEnvelope,
 FaGlobe,
 FaPhone,
 FaQuestionCircle,
 FaLinkedin,
 FaTwitter,
 FaFacebook,
 FaInstagram,
 FaArrowRight,
 FaPaperPlane,
 FaCheck
} from "react-icons/fa";

const Contact = () => {
 const [formData, setFormData] = useState({
   name: "",
   email: "",
   subject: "",
   message: ""
 });
 const [formSubmitted, setFormSubmitted] = useState(false);
 const [activeTab, setActiveTab] = useState("general");

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData({
     ...formData,
     [name]: value
   });
 };

 const handleSubmit = (e) => {
   e.preventDefault();
   // Simulate form submission
   setTimeout(() => {
     setFormSubmitted(true);
     // Reset form after 3 seconds
     setTimeout(() => {
       setFormSubmitted(false);
       setFormData({
         name: "",
         email: "",
         subject: "",
         message: ""
       });
     }, 3000);
   }, 1000);
 };

 return (
   <div className="bg-white text-black min-h-screen transition-all duration-500">
     
     {/* Main Content with proper spacing from navbar */}
     <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       <div className="text-center mb-12 animate-fade-in">
         <h1 className="text-5xl font-extrabold mb-6 text-black">
           Get in <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Touch</span>
         </h1>
        
         <div className="h-1 w-24 bg-black mx-auto rounded-full mb-8"></div>
        
         <p className="text-xl max-w-3xl mx-auto text-gray-700 font-medium">
           Have questions about PrepX or need assistance? We're here to help! Choose how you'd like to connect with us.
         </p>
       </div>

       {/* Contact Methods Tabs */}
       <div className="max-w-5xl mx-auto mb-10 px-4">
         <div className="flex flex-wrap justify-center gap-2 mb-8 text-gray-700">
           <button
             onClick={() => setActiveTab("general")}
             className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
               activeTab === "general"
                 ? "bg-black text-white shadow-lg"
                 : "bg-white hover:bg-gray-100 border border-gray-200"
             }`}
           >
             General Inquiries
           </button>
           <button
             onClick={() => setActiveTab("support")}
             className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
               activeTab === "support"
                 ? "bg-black text-white shadow-lg"
                 : "bg-white hover:bg-gray-100 border border-gray-200"
             }`}
           >
             Support
           </button>
           <button
             onClick={() => setActiveTab("business")}
             className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
               activeTab === "business"
                 ? "bg-black text-white shadow-lg"
                 : "bg-white hover:bg-gray-100 border border-gray-200"
             }`}
           >
             Business & Partnerships
           </button>
           <button
             onClick={() => setActiveTab("careers")}
             className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
               activeTab === "careers"
                 ? "bg-black text-white shadow-lg"
                 : "bg-white hover:bg-gray-100 border border-gray-200"
             }`}
           >
             Careers
           </button>
         </div>
       </div>

       {/* Two Column Layout - Contact Info + Form */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
         {/* Left Column - Contact Cards */}
         <div className="lg:col-span-2 space-y-6">
           {/* Support Card */}
           <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-200">
             <div className="bg-black h-2"></div>
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                   <FaEnvelope className="text-black text-xl" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-black">Email Us</h3>
                   <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                 </div>
               </div>
               <div className="space-y-2 pl-16">
                 <a href="mailto:support@prepx.io" className="block text-black hover:text-gray-600 transition-colors">
                   support@prepx.io
                 </a>
                 <a href="mailto:business@prepx.io" className="block text-black hover:text-gray-600 transition-colors">
                   business@prepx.io
                 </a>
                 <a href="mailto:careers@prepx.io" className="block text-black hover:text-gray-600 transition-colors">
                   careers@prepx.io
                 </a>
               </div>
             </div>
           </div>

           {/* Phone Card */}
           <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-200">
             <div className="bg-black h-2"></div>
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                   <FaPhone className="text-black text-xl" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-black">Call Us</h3>
                   <p className="text-sm text-gray-500">Available Mon-Fri, 9am-6pm IST</p>
                 </div>
               </div>
               <div className="space-y-2 pl-16">
                 <p className="text-gray-700">📞 +91 9876 543 210 (Support)</p>
                 <p className="text-gray-700">📞 +91 9123 456 789 (Sales)</p>
                 <p className="text-gray-700">📞 +91 8765 432 109 (24/7 Automated)</p>
               </div>
             </div>
           </div>

           {/* Office Location Card */}
           <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-200">
             <div className="bg-black h-2"></div>
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                   <FaMapMarkerAlt className="text-black text-xl" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-black">Visit Us</h3>
                   <p className="text-sm text-gray-500">Our headquarters</p>
                 </div>
               </div>
               <div className="pl-16">
                 <p className="text-gray-700">Prepx Pvt. Ltd.</p>
                 <p className="text-gray-700">Tower 2, Connaught Place,</p>
                 <p className="text-gray-700">New Delhi, India - 110001</p>
                 <a href="https://maps.app.goo.gl/cSYUaMthxGVi18zt5" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-black hover:text-gray-600">
                   View on Maps <FaArrowRight className="ml-1 text-xs" />
                 </a>
               </div>
             </div>
           </div>

           {/* Social Media Card */}
           <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-200">
             <div className="bg-black h-2"></div>
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                   <FaGlobe className="text-black text-xl" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-black">Connect Online</h3>
                   <p className="text-sm text-gray-500">Follow us on social media</p>
                 </div>
               </div>
               <div className="flex justify-around mt-4">
                 <a href="https://linkedin.com/company/prepx" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all">
                   <FaLinkedin size={28} className="text-black" />
                 </a>
                 <a href="https://twitter.com/prepx" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all">
                   <FaTwitter size={28} className="text-black" />
                 </a>
                 <a href="https://facebook.com/prepx" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all">
                   <FaFacebook size={28} className="text-black" />
                 </a>
                 <a href="https://instagram.com/prepx" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-all">
                   <FaInstagram size={28} className="text-black" />
                 </a>
               </div>
             </div>
           </div>
         </div>

         {/* Right Column - Contact Form */}
         <div className="lg:col-span-3">
           <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden border border-gray-200">
             {/* Decorative elements */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-gray-300 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-gray-300 rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20"></div>
            
             <div className="relative z-10">
               <h2 className="text-3xl font-bold mb-6 text-black">
                 <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Send Us a Message</span>
               </h2>
               <p className="mb-8 text-gray-600">
                 Fill out the form below and we'll get back to you as soon as possible.
               </p>

               {formSubmitted ? (
                 <div className="text-center py-12 text-gray-800">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FaCheck className="text-black text-2xl" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                   <p className="text-gray-600">
                     Thank you for reaching out. We'll respond to your inquiry shortly.
                   </p>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-5">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div>
                       <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                         Your Name
                       </label>
                       <input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                         required
                         className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:border-black focus:ring-2 focus:ring-black transition-colors"
                         placeholder="John Doe"
                       />
                     </div>
                     <div>
                       <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                         Your Email
                       </label>
                       <input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         required
                         className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:border-black focus:ring-2 focus:ring-black transition-colors"
                         placeholder="john@example.com"
                       />
                     </div>
                   </div>
                   <div>
                     <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                       Subject
                     </label>
                     <input
                       type="text"
                       id="subject"
                       name="subject"
                       value={formData.subject}
                       onChange={handleInputChange}
                       required
                       className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:border-black focus:ring-2 focus:ring-black transition-colors"
                       placeholder="How can we help you?"
                     />
                   </div>
                   <div>
                     <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                       Your Message
                     </label>
                     <textarea
                       id="message"
                       name="message"
                       value={formData.message}
                       onChange={handleInputChange}
                       required
                       rows="6"
                       className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:border-black focus:ring-2 focus:ring-black transition-colors resize-none"
                       placeholder="Tell us how we can assist you..."
                     ></textarea>
                   </div>
                   <div className="pt-2">
                     <button
                       type="submit"
                       className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                     >
                       <FaPaperPlane />
                       Send Message
                     </button>
                   </div>
                 </form>
               )}
             </div>
           </div>
         </div>
       </div>

       {/* FAQ Section */}
       <div className="mt-16 max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-8 text-black">
           Frequently Asked <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Questions</span>
         </h2>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
             <h3 className="text-xl font-semibold mb-3 text-black">
               What is PrepX?
             </h3>
             <p className="text-gray-600">
               PrepX is an AI-powered interview preparation platform that helps students and professionals prepare for job interviews through simulated interviews and personalized feedback.
             </p>
           </div>
          
           <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
             <h3 className="text-xl font-semibold mb-3 text-black">
               How does the AI feedback work?
             </h3>
             <p className="text-gray-600">
               Our AI analyzes your responses, body language, and delivery to provide detailed feedback on content, communication skills, and areas for improvement.
             </p>
           </div>
          
           <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
             <h3 className="text-xl font-semibold mb-3 text-black">
               Do you offer a free trial?
             </h3>
             <p className="text-gray-600">
               Yes, PrepX offers a free trial with limited features. Sign up on our website to get started with no credit card required.
             </p>
           </div>
          
           <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
             <h3 className="text-xl font-semibold mb-3 text-black">
               Can I use PrepX on mobile devices?
             </h3>
             <p className="text-gray-600">
               Yes, PrepX is fully responsive and works on all devices including smartphones, tablets, and desktop computers.
             </p>
           </div>
         </div>
        
         <div className="text-center mt-8">
           <a
             href="/faqs"
             className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-black hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200"
           >
             View All FAQs <FaArrowRight className="ml-2" />
           </a>
         </div>
       </div>
     </main>
   </div>
 );
};

export default Contact;