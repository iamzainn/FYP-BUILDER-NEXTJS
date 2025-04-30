'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar styling using useEffect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white/80 backdrop-blur-sm'} border-b border-indigo-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image 
                src="/logo.png" 
                alt="Live Webify Logo" 
                width={48} 
                height={48} 
                className="mr-3 transition-transform duration-300 hover:scale-110"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Live Webify</span>
            </div>
          </div>
          
          {/* Desktop buttons */}
          <div className="hidden md:flex md:items-center">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Login
            </Link>
            <Link href="/sign-up" className="ml-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign Up 
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-indigo-100 py-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Link href="/sign-in" className="w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-300 rounded-md">
                Login
              </Link>
              <Link href="/sign-up" className="w-full text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md shadow-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 