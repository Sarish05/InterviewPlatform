import React from 'react'
import { Link, NavLink } from 'react-router-dom'
export default function Header() {
    return (
        <div className='sticky h-1/5 w-full'>
            <nav className='flex justify-between py-3 top-0 px-12'>
                {/* logo */}
                <div className='flex item-center min-w-30'>
                    <Link to= "/" className='mt-4 font-bold text-lg'>PrepX</Link>
                </div>
                {/* middle */}
                <div className='flex items-center min-w-30'>
                    <ul className='flex items-center mt-2 font-semibold text-gray-700 '>
                        <li>
                            <NavLink 
                            to= "/"
                            className={({isActive}) =>
                                `${isActive ? "text-black border-black font-bold" : "text-gray-700 border-white"} border-b-4  flex items-center duration-200 mx-6`
                            }
                            >
                                Home</NavLink>
                        </li>
                        <li>
                            <NavLink 
                            to= "/about"
                            className={({isActive}) =>
                                `${isActive ? "text-black border-black font-bold" : "text-gray-700 border-white"} border-b-4 flex items-center duration-200 mx-6`
                            }
                            >
                                About</NavLink>
                        </li>
                        <li>
                            <NavLink 
                            to= "/contact"
                            className={({isActive}) =>
                                `${isActive ? "text-black border-black font-bold" : "text-gray-700 border-white"} border-b-4 flex items-center duration-200 mx-6`
                            }
                            >
                                Contact</NavLink>
                        </li>
                    </ul>
                </div>
                {/* login */}
                <div className='flex items-center justify-between space-x-8 min-w-30'>
                    <Link to= "/register" className='mt-2 border-black text-white border-2 p-2 rounded-lg bg-black'>Sign Up</Link>
                    <Link to= "/login" className='mt-2 border-black border-2 p-2 rounded-lg bg-white text-black'>Log in</Link>
                </div>

            </nav>



        </div>
    )
}