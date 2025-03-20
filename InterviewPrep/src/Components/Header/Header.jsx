import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className='flex items-center justify-between'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link to="/" className='font-bold text-xl md:text-2xl tracking-tight'>
                            Prep<span className="text-black">X</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center'>
                        <ul className='flex items-center font-medium text-gray-700'>
                            <li>
                                <NavLink 
                                to="/"
                                className={({isActive}) =>
                                    `${isActive ? "text-black after:scale-x-100" : "text-gray-700 hover:text-black after:scale-x-0"} relative mx-5 py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:transition-transform after:duration-300 after:ease-out after:content-['']`
                                }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                to="/about"
                                className={({isActive}) =>
                                    `${isActive ? "text-black after:scale-x-100" : "text-gray-700 hover:text-black after:scale-x-0"} relative mx-5 py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:transition-transform after:duration-300 after:ease-out after:content-['']`
                                }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                to="/contact"
                                className={({isActive}) =>
                                    `${isActive ? "text-black after:scale-x-100" : "text-gray-700 hover:text-black after:scale-x-0"} relative mx-5 py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:transition-transform after:duration-300 after:ease-out after:content-['']`
                                }
                                >
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className='hidden md:flex items-center space-x-4'>
                        <Link to="/register" className='px-5 py-2.5 font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-800 transition-colors'>
                            Sign Up
                        </Link>
                        <Link to="/login" className='px-5 py-2.5 font-medium border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors'>
                            Log In
                        </Link>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className='p-2 text-gray-700 rounded-md hover:bg-gray-100'
                        >
                            {mobileMenuOpen ? 
                                <X className="h-6 w-6" /> : 
                                <Menu className="h-6 w-6" />
                            }
                        </button>
                    </div>
                </nav>
                
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className='md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 animate-fade-in-down'>
                        <ul className='flex flex-col py-4 px-6 space-y-4'>
                            <li>
                                <NavLink 
                                    to="/"
                                    className={({isActive}) =>
                                        `${isActive ? "text-black font-bold" : "text-gray-700"} block py-2`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/about"
                                    className={({isActive}) =>
                                        `${isActive ? "text-black font-bold" : "text-gray-700"} block py-2`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/contact"
                                    className={({isActive}) =>
                                        `${isActive ? "text-black font-bold" : "text-gray-700"} block py-2`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <div className='flex flex-col space-y-3 pt-4 border-t border-gray-200'>
                                <Link 
                                    to="/register" 
                                    className='px-4 py-2 text-center font-medium text-white bg-black rounded-lg'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                                <Link 
                                    to="/login" 
                                    className='px-4 py-2 text-center font-medium border-2 border-black text-black rounded-lg'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                            </div>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}