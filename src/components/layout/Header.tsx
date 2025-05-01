'use client'
import Image from 'next/image';
import { useAuth } from "@clerk/nextjs";
import HeaderClient from './HeaderClient';

export default  function Header() {
  const { isSignedIn } = useAuth();
  const isAuthenticated = isSignedIn!;
  try {
   

    return (
      <nav className="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-md border-b border-indigo-100">
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
            
            {/* Desktop navigation */}
            <HeaderClient isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error("Auth error:", error);
    // Fallback to unauthenticated state
    return (
      <nav className="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-md border-b border-indigo-100">
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
            
            {/* Desktop navigation */}
            <HeaderClient isAuthenticated={false} />
          </div>
        </div>
      </nav>
    );
  }
} 