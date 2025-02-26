import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import About from './Components/About/About.jsx'
import Contact from './Components/Contact/Contact.jsx'
import Home from './Components/Home/Home.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import Register from './Components/Signup/Register.jsx'
import Login from './Components/Signup/Login.jsx'
import Reports from './Components/Reports/Reports.jsx'
import Settings from './Components/Settings/Settings.jsx'
import Interviews from './Components/Interviews/Interviews.jsx'
import Profile from './Components/Profile/Profile.jsx'

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
    <Route path = "interviews" element = {<Interviews/>}/>
    <Route path = "profile" element = {<Profile />}></Route>
    <Route path = "login" element = {<Login/>}></Route>
    <Route path = "register" element = {<Register/>}></Route>
    </>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
