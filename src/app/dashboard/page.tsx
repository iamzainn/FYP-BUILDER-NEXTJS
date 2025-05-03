import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Header } from '@/components/layout';


import { getUserDbId, getUserStore } from '@/lib/fn';




export default async function DashboardPage() {
  const { userId: clerkUserId }  = await auth();
  const userDbId = await getUserDbId(clerkUserId!);
  const userStore = await getUserStore(userDbId!.id);
  if (!userDbId) {
    console.log("No user found in database, redirecting to sign-in");
    redirect('/sign-in');
  }
  
  
  

  
 
 
  


  
  
 
  

  
  

  


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white relative">
    <Header />
      <div className="absolute top-40 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute top-60 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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

        
        <div className="mt-10">
          {userStore.length === 0 ? (
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
              {userStore.map((website) => (
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
                        <h3 className="text-xl font-bold text-gray-900 truncate">{website.storeName}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                         
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                      <Link
                        href={`/edit/${website.storeName}`}
                        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 group"
                      >
                        <svg className="mr-2 h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        <span>Builder</span>
                      </Link>
                      
                      <Link
                        href={`/admin/${website.storeId}`}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <svg className="mr-2 h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        <span>Admin</span>
                      </Link>
                      
                      <Link
                        href={`/home/${website.storeName}`}
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
      
    </div>
  );
}
