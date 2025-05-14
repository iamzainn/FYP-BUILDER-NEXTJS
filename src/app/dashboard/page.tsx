import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Header } from '@/components/layout';
import { getUserDbId, getUserStore } from '@/lib/fn';
import { Globe, Layout, Layers, Plus, Edit3, Settings, ExternalLink } from 'lucide-react';

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth();
  const userDbId = await getUserDbId(clerkUserId!);
  const userStore = await getUserStore(userDbId!.id);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
      <Header />
      
      <div className="container mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Dashboard</h2>
              </div>
              <div className="p-2">
                <nav className="space-y-1">
                  <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Globe className="mr-3 h-5 w-5 text-white opacity-80" />
                    My Websites
                  </Link>
                  <Link href="/templates" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition">
                    <Layout className="mr-3 h-5 w-5 text-gray-400" />
                    Templates
                  </Link>
                </nav>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 text-white">
                <Layers className="h-10 w-10 mb-3 text-white opacity-90" />
                <h3 className="text-lg font-semibold mb-1">Need help?</h3>
                <p className="text-sm text-white/80 mb-4">Get started with our helpful guides and tutorials.</p>
                <Link href="/help" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white/20 hover:bg-white/30 text-white transition">
                  View Resources
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Websites</h1>
                <p className="text-gray-500 text-sm mt-1">Manage and edit your websites</p>
              </div>
              <Link
                href="/create-web"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Website
              </Link>
            </div>
            
            {userStore.length === 0 ? (
              <div className="bg-white shadow-sm overflow-hidden rounded-xl p-8 text-center border border-gray-100 backdrop-blur-sm bg-opacity-90">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">No websites yet</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto text-sm">Let&apos;s create your first website with our intuitive builder. Get started in just a few minutes!</p>
                <div className="mt-6">
                  <Link
                    href="/create-web"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Website
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userStore.map((website) => (
                  <div
                    key={website.id}
                    className="group bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{website.storeName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Created on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <Link
                          href={`/edit/${website.storeName}`}
                          className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors text-gray-700 hover:text-indigo-700"
                        >
                          <Edit3 className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Builder</span>
                        </Link>
                        
                        <Link
                          href={`/admin/${website.storeId}`}
                          className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors text-gray-700 hover:text-indigo-700"
                        >
                          <Settings className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Admin</span>
                        </Link>
                        
                        <Link
                          href={`/home/${website.storeName}`}
                          className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors text-gray-700 hover:text-indigo-700"
                        >
                          <ExternalLink className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Preview</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
