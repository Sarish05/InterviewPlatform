import React from 'react'
import { Link, NavLink } from 'react-router-dom'
export default function Header() {
    return (
        <div className='sticky h-1/5 w-full'>
            <nav className='flex justify-between py-3 top-0 px-12'>
                {/* logo */}
                <div className='flex item-center min-w-30'>
                    <Link to= "/" className='mt-4'>Logo</Link>
                </div>
                {/* middle */}
                <div className='flex items-center min-w-30'>
                    <ul className='flex items-center mt-2 font-medium text-gray-700 '>
                        <li>
                            <NavLink 
                            to= "/"
                            className={({isActive}) =>
                                `${isActive ? "text-indigo-500 border-indigo-500" : "text-gray-700 border-white"} border-b-4  flex items-center duration-200 mx-6`
                            }
                            >
                                Home</NavLink>
                        </li>
                        <li>
                            <NavLink 
                            to= "/about"
                            className={({isActive}) =>
                                `${isActive ? "text-indigo-500 border-indigo-500" : "text-gray-700 border-white"} border-b-4 flex items-center duration-200 mx-6`
                            }
                            >
                                About</NavLink>
                        </li>
                        <li>
                            <NavLink 
                            to= "/contact"
                            className={({isActive}) =>
                                `${isActive ? "text-indigo-500 border-indigo-500" : "text-gray-700 border-white"} border-b-4 flex items-center duration-200 mx-6`
                            }
                            >
                                Contact</NavLink>
                        </li>
                    </ul>
                </div>
                {/* login */}
                <div className='flex items-center justify-between space-x-8 min-w-30'>
                    <Link to= "/signup" className='mt-2 border-white border p-2 rounded-lg bg-indigo-100 outline outline-offset-2 outline-indigo-400'>Sign Up</Link>
                    <Link to= "/signup" className='mt-2 border-white border p-2 rounded-lg bg-white outline outline-offset-2 outline-indigo-400'>Log in</Link>
                </div>

            </nav>



        </div>
    )
}