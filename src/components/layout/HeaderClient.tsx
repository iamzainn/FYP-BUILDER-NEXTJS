'use client';

import { useState } from 'react';

import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

interface HeaderClientProps {
  isAuthenticated: boolean;
}

export default function HeaderClient({ isAuthenticated }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop buttons */}
      <div className="hidden md:flex md:items-center">
        {isAuthenticated ? (
          <UserButton  />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="ml-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}
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
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-indigo-100 py-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="mt-4 flex flex-col space-y-2 px-3">
              {isAuthenticated ? (
                <div className="flex justify-center py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-300 rounded-md">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md shadow-sm">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 