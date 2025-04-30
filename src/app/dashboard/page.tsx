'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/services/apiService';

interface Website {
  id: number;
  store_name: string;
  store_id: string;
  last_accessed: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchUserData = async () => {
      try {
        // Fetch user profile using ApiService
        const userData = await ApiService.getUserProfile();
        setUser(userData);

        // Fetch user's websites using ApiService
        const response = await ApiService.getUserWebsites();
        
        // Ensure websites is always an array
        const websitesData = response.stores || [];
        console.log('Websites data received:', websitesData);
        
        setWebsites(websitesData);
      } catch (err: unknown) {
        // Convert to a proper error type
        const error = err instanceof Error ? err : new Error(String(err));
        
        // If 401 unauthorized, redirect to login
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          router.push('/login');
          return;
        }
        setError(error.message || 'An error occurred');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white relative">
      {/* Background decoration - improved blur effects */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute top-60 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      
      {/* Navigation */}
      <nav className="relative bg-white shadow-md border-b border-gray-100 backdrop-blur-sm bg-opacity-80 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-3">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-sm opacity-40"></div>
                  <Image 
                    src="/logo.png" 
                    alt="Live Webify Logo" 
                    width={40} 
                    height={40} 
                    className="relative p-0.5 bg-white rounded-full"
                  />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  BuilderAI
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className={`flex items-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-2 shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.name || 'User'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group focus:outline-none"
              >
                <span>Log out</span>
                <svg className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H3zm0 2v10h12V7.414L10.414 4H3z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6 10a1 1 0 011-1h2.586l-1.293-1.293a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 11H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className={`max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">My Websites</h1>
            <p className="mt-1 text-gray-500">Manage and edit your websites</p>
          </div>
          <Link
            href="/create-web"
            className="inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Website
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-8 animate-fadeIn bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md p-4 shadow-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Websites list */}
        <div className="mt-10">
          {websites.length === 0 ? (
            <div className="bg-white shadow-xl overflow-hidden rounded-xl p-10 text-center border border-gray-100 backdrop-blur-sm bg-opacity-80 animate-fadeIn transform transition-all duration-500 hover:shadow-2xl">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
                <svg className="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">No websites yet</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">Let&apos;s create your first website with our intuitive builder. Get started in just a few minutes!</p>
              <div className="mt-8">
                <Link
                  href="/create-web"
                  className="inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Your First Website
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 backdrop-blur-sm bg-opacity-80 transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-7 w-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{website.store_name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>Last edited: {formatDate(website.last_accessed)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                      <Link
                        href={`/edit/${website.store_name}`}
                        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 group"
                      >
                        <svg className="mr-2 h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        <span>Builder</span>
                      </Link>
                      
                      <Link
                        href={`/admin/${website.store_id}`}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <svg className="mr-2 h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        <span>Admin</span>
                      </Link>
                      
                      <Link
                        href={`/home/${website.store_name}`}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <svg className="mr-2 h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
