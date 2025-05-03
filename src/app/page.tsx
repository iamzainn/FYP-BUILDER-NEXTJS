import Link from 'next/link';


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from '../components/layout';

export default async function HomePage() {
  

 
  const { userId } = await auth();


  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
     <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-10 pb-20 sm:pt-16 lg:pt-8 lg:pb-28 xl:pt-10 bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Animated background elements */}
        <div className="absolute hidden lg:block top-1/4 right-5 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute hidden lg:block top-1/3 left-5 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute hidden lg:block bottom-1/4 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="px-4 sm:px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 shadow-sm">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="animate-pulse">AI-Powered Website Builder</span>
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Create your website with </span>
                  <span className="block mt-1 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    just a conversation
                    <span className="inline-block animate-bounce">.</span>
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto lg:mx-0 leading-relaxed">
                  Build stunning websites, manage products, and control your entire e-commerce ecosystem with natural language—no coding required. From inventory to CRM, all through simple chat.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow-lg">
                    <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                      Start building for free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#demo" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch demo
                    </Link>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center lg:justify-start">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-white transition-transform hover:scale-110 hover:z-10 duration-200 ${i === 1 ? 'bg-blue-100' : i === 2 ? 'bg-blue-200' : i === 3 ? 'bg-blue-300' : i === 4 ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    ))}
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-500">
                    Join <span className="font-bold text-blue-600">10,000+</span> business owners already using Live Webify
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
              <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-xl sm:overflow-hidden shadow-2xl lg:max-w-none transition-all duration-300 hover:shadow-indigo-100 hover:-translate-y-1">
                <div className="px-6 py-8 sm:p-10">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg blur-sm opacity-75 animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-lg shadow-lg">
                      <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-500">website-preview.webify.live</div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-36 w-full bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 opacity-50"></div>
                          <div className="text-center px-4 relative z-10">
                            <div className="w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-blue-200">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                            </div>
                            <div className="text-sm text-gray-500">Your website will appear here</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 w-1/2 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="relative">
                          <div className="bg-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-700">Create an e-commerce site with product gallery, checkout, and payment processing.</p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3 transform translate-y-1/2">
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-16 bg-gradient-to-b from-white to-purple-50 sm:py-24 border-t border-b border-indigo-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-slow"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-slow animation-delay-3000"></div>
          
          <div className="text-center relative">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900 shadow-sm transform transition-transform hover:scale-105 duration-300">
              <h2 className="text-base font-semibold text-purple-800 tracking-wide uppercase">Features</h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-800">
              Build your dream website with AI
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto leading-relaxed">
              Live Webify combines cutting-edge AI with an intuitive chat interface to transform how websites are built and managed.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 sm:space-y-8 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0 lg:grid-cols-3">
              {[
                {
                  title: "Conversational Website Building",
                  description: "Simply describe what you want in natural language, and our AI will build it for you. Modify layouts, change colors, or add features—all through natural conversation.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  )
                },
                {
                  title: "E-Commerce Management",
                  description: "Manage your entire product catalog, inventory, and pricing through simple conversations. Add products, update stock levels, and create special offers with ease.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  )
                },
                {
                  title: "Sales & Inventory Analytics",
                  description: "Get real-time insights into sales trends, inventory levels, and customer behavior. Make data-driven decisions with AI-powered recommendations.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  )
                },
                {
                  title: "Advanced CRM Integration",
                  description: "Manage customer relationships effortlessly. Track interactions, set up automated follow-ups, and segment your audience for targeted marketing campaigns.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )
                },
                {
                  title: "One-Click Design Customization",
                  description: "Instantly change your website's look and feel with simple commands. Switch themes, update color schemes, and customize layouts without any design skills.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  )
                },
                {
                  title: "Multi-Platform Optimization",
                  description: "Every website is automatically optimized for all devices and platforms. Ensure perfect viewing experiences from desktop to mobile with zero additional effort.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 transform hover:-translate-y-1">
                  <div>
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-700 text-white transform transition-transform group-hover:scale-110 duration-300">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">{feature.title}</h3>
                    <p className="mt-4 text-base text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-4 ml-16">
                    <span className="text-purple-600 text-sm font-medium invisible group-hover:visible transition-all duration-300 flex items-center">
                      Learn more
                      <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-16 sm:py-24 border-b border-blue-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-slow"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-slow animation-delay-3000"></div>
          
          <div className="text-center relative">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm shadow-sm transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-base font-semibold text-blue-800 tracking-wide uppercase">Getting Started</h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
              How Live Webify Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto leading-relaxed">
              Create and manage your website in just three simple steps
            </p>
          </div>

          <div className="mt-20 relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 transform -translate-y-1/2"></div>
            
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {[
                {
                  step: 1,
                  title: "Describe Your Vision",
                  description: "Tell our AI what kind of website you need. Whether it's an e-commerce store, portfolio, or business site, just describe it in your own words."
                },
                {
                  step: 2,
                  title: "Refine With Conversation",
                  description: "Our AI builds a draft based on your description. Chat to refine the design, layout, and functionality until it's exactly what you want."
                },
                {
                  step: 3,
                  title: "Launch & Manage",
                  description: "Publish your site with one click. Continue to manage content, products, and customers through simple chat commands anytime."
                }
              ].map((step, index) => (
                <div key={index} className="relative mb-12 lg:mb-0 group">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-4 border-white shadow-lg text-white mx-auto z-10 transform transition-transform group-hover:scale-110 duration-300">
                      <span className="text-2xl font-bold">{step.step}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-200">{step.title}</h3>
                    <p className="mt-4 text-base text-gray-500 text-center px-4 sm:px-6 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Mobile step connector */}
                    {index < 2 && (
                      <div className="lg:hidden flex justify-center my-8">
                        <svg className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg hover:shadow-xl md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="mr-2">Get Started Now</span>
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24 border-b border-blue-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decoration */}
          <div className="absolute top-10 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-slow"></div>
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-slow animation-delay-3000"></div>
          
          <div className="text-center relative">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm shadow-sm transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-base font-semibold text-blue-800 tracking-wide uppercase">Testimonials</h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
              Loved by business owners everywhere
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto leading-relaxed">
              See what our customers are saying about their experience with Live Webify
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Sarah Thompson',
                  role: 'E-commerce Store Owner',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  quote: 'Live Webify transformed my business. I created my entire online store in an afternoon—something that would have taken weeks before. The ability to manage inventory by just chatting with the AI feels like magic.',
                  color: 'from-blue-500 to-indigo-600',
                  bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Marketing Agency Founder',
                  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  quote: 'We now create client websites in hours instead of days. The AI understands exactly what we need and builds it perfectly. Our clients are amazed by how quickly we deliver high-quality sites with complex functionality.',
                  color: 'from-purple-500 to-indigo-600',
                  bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600'
                },
                {
                  name: 'Jessica Kim',
                  role: 'Small Business Consultant',
                  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  quote: 'I\'ve tried every website builder on the market, but Live Webify is truly revolutionary. My clients with zero technical skills can make beautiful websites and actually manage them without my help. It\'s a game-changer.',
                  color: 'from-indigo-500 to-blue-600',
                  bgColor: 'bg-gradient-to-r from-indigo-500 to-blue-600'
                }
              ].map((testimonial, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-100">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" 
                    style={{
                        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                        ...(({'--tw-gradient-from': testimonial.color.split(' ')[1], 
                           '--tw-gradient-to': testimonial.color.split(' ')[2]}) as Record<string, unknown>)
                    }}
                  ></div>
                  <div className="px-6 py-8 sm:p-10 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className={`rounded-full p-1.5 ${testimonial.bgColor} transform transition-transform group-hover:scale-110 duration-300`}>
                        <img className="h-16 w-16 rounded-full object-cover ring-2 ring-white" src={testimonial.image} alt={testimonial.name} />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex mb-3 justify-center sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="relative">
                        <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-blue-100 opacity-60" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative text-gray-600 text-base italic leading-relaxed">&ldquo;{testimonial.quote}&ldquo;</p>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center opacity-0 group-hover:opacity-100">
                          Read full story 
                          <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/testimonials" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View all customer stories
                <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decoration */}
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-slow"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-slow animation-delay-3000"></div>
          
          <div className="text-center relative">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
              Plans for businesses of all sizes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto leading-relaxed">
              Choose the perfect plan to help your business grow online
            </p>
          </div>

          <div className="mt-16 relative z-10">
            <div className="flex flex-col space-y-12 lg:flex-row lg:space-y-0 lg:space-x-8">
              {/* Starter Plan */}
              <div className="flex-1 flex flex-col rounded-3xl border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-8 sm:p-10 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    Starter
                    <span className="ml-2 py-0.5 px-2.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">New</span>
                  </h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">$29</span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </p>
                  <p className="mt-6 text-gray-500 leading-relaxed">Perfect for small businesses and personal projects.</p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "1 website",
                      "Basic e-commerce features",
                      "Up to 100 products",
                      "AI website builder",
                      "Mobile optimization",
                      "SSL security",
                      "24/7 email support"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
                  <Link href="/signup" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
                    Get started
                  </Link>
                </div>
              </div>

              {/* Business Plan */}
              <div className="flex-1 flex flex-col rounded-3xl border-2 border-blue-600 bg-white shadow-2xl lg:scale-110 z-10">
                <div className="relative">
                  <div className="absolute -top-5 inset-x-0 mx-auto flex justify-center">
                    <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white shadow-lg transform transition-transform hover:scale-105 duration-200">
                      Most Popular
                    </span>
                  </div>
                </div>
                <div className="p-8 sm:p-10 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Business</h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">$79</span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </p>
                  <p className="mt-6 text-gray-500 leading-relaxed">Everything growing businesses need to thrive online.</p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "3 websites",
                      "Advanced e-commerce features",
                      "Up to 1,000 products",
                      "AI website builder & CRM",
                      "Inventory management",
                      "Payment processing",
                      "Priority support",
                      "Custom domain"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-3xl border-t border-blue-100">
                  <Link href="/signup" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Get started
                  </Link>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="flex-1 flex flex-col rounded-3xl border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-8 sm:p-10 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">$199</span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </p>
                  <p className="mt-6 text-gray-500 leading-relaxed">Advanced features for large businesses with complex needs.</p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "Unlimited websites",
                      "Complete e-commerce suite",
                      "Unlimited products",
                      "Advanced AI builder & CRM",
                      "Advanced analytics",
                      "API access",
                      "Dedicated account manager",
                      "White-label options",
                      "Custom integrations"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
                  <Link href="/signup" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
                    Get started
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500">Need a custom plan? <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Contact us</a> for a personalized quote.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your online presence?</span>
            <span className="block text-blue-200">Get started with Live Webify today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transform transition-all duration-200 hover:translate-y-[-2px]">
                Start for free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="#demo" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-60 hover:bg-opacity-70 transform transition-all duration-200 hover:translate-y-[-2px]">
                Watch demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <span className="text-3xl font-bold">Live Webify</span>
              <p className="text-gray-300 text-base">
                Creating professional websites through conversation. 
                Build, manage, and grow your online presence with AI.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Features</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Pricing</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Templates</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Case Studies</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Documentation</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Guides</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">API Status</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Contact Us</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">About</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Careers</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Press</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Terms</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Cookie Policy</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-gray-300">Licensing</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2023 Live Webify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
