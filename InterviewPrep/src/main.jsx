import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import About from './Components/About/About.jsx';
import Contact from './Components/Contact/Contact.jsx';
import Home from './Components/Home/Home.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Register from './Components/Signup/Register.jsx';
import Login from './Components/Signup/Login.jsx';
import Reports from './Components/Reports/Reports.jsx';
import Settings from './Components/Settings/Settings.jsx';
import Interviews from './Components/Interviews/Interviews.jsx';
import Profile from './Components/Profile/Profile.jsx';
import Questions from './Components/Questions/Questions.jsx';
import Questions2 from './Components/Questions/Questions2.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPassword from "./Components/Signup/ForgotPassword";
import ResetPassword from "./Components/Signup/ResetPassword";
import TopicSelection from './Components/TechTest/TopicSelection.jsx';
import InterviewSelection from './Components/InterviewSelect/InterviewSelection.jsx';
import ComprehensiveTest from './Components/TechTest/ComprehensiveTest';
import Results from './Components/Questions/Results.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path = "/" element = {<App/>}>
      <Route path = "" element = {<Home/>} />
      <Route path = "about" element = {<About/>} />
      <Route path = "contact" element = {<Contact/>} />
    </Route>
    <Route path = "dashboard" element = {<Dashboard/>} />
    <Route path = "reports" element = {<Reports/>} />
    <Route path = "settings" element = {<Settings/>} />
    <Route path = "interviews" element = {<Interviews/>}/>
    <Route path = "behavioural-select" element = {<Questions/>}/>
    <Route path = "tech-select" element = {<Questions2 />}/>
    <Route path = "profile" element = {<Profile />}></Route>
    <Route path = "login" element = {<Login/>}></Route>
    <Route path = "register" element = {<Register/>}></Route>
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password/:token" element={<ResetPassword />} />
    <Route path="comprehensive-select" element ={<TopicSelection />}/>
    <Route path= "interview-selection" element={<InterviewSelection/>}/>
    <Route path="comprehensive-test" element = {<ComprehensiveTest/>}/>
    <Route path="results" element = {<Results/>}/>
    </>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
        <ToastContainer position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
                toastStyle={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    color: "#f8fafc",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                }} />
    <GoogleOAuthProvider clientId='292023268028-umj8b4nmv5h3npi2oo3o67eu7i1mhfo7.apps.googleusercontent.com'>
    <RouterProvider router = {router}/>
    </GoogleOAuthProvider>
  </StrictMode>,
)