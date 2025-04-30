'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MongoDBApiService } from '@/services/mondodbapi';
import { NavItem, NavbarStyles, HeroItem, HeroStyles, CollectionItem, CollectionStyles, ProductItem, ProductStyles } from '@/types/websiteConfig';
import { useParams } from 'next/navigation';

// Dynamically import components with ssr:false to prevent them from loading during server-side rendering
const Navbar = dynamic(() => import('../../../components/navbar'), { ssr: false });
const Hero = dynamic(() => import('../../../components/hero'), { ssr: false });
const Collection = dynamic(() => import('@/components/Collection'), { ssr: false });
const Products = dynamic(() => import('@/components/Products'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

// Create a client-side only component
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

export default function Home() {
  const params = useParams();
  const storeName = params?.storeName as string;
  
  const [navItems, setNavItems] = useState<NavItem[] | null>(null);
  const [navStyles, setNavStyles] = useState<NavbarStyles | null>(null);
  const [heroItems, setHeroItems] = useState<HeroItem[] | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[] | null>(null);
  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[] | null>(null);
  const [productStyles, setProductStyles] = useState<ProductStyles | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Fetch website configuration by store name
        let websiteConfig;
        if (storeName) {
          websiteConfig = await MongoDBApiService.getWebsiteConfigByStoreName(storeName);
        } else {
          // Fallback to default endpoint if no store name
          websiteConfig = await MongoDBApiService.getWebsiteConfig();
        }
        
        if (websiteConfig) {
          // Set data from API response
          if (websiteConfig.navItems && Array.isArray(websiteConfig.navItems)) {
            setNavItems(websiteConfig.navItems);
          }
          
          if (websiteConfig.navStyles) {
            setNavStyles(websiteConfig.navStyles);
          }
          
          // Set other data with type assertions
          setHeroItems(websiteConfig.heroItems as any || null);
          setHeroStyles(websiteConfig.heroStyles as any || null);
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          setCollectionItems(websiteConfig.collectionItems as any || null);
          setCollectionStyles(websiteConfig.collectionStyles as any || null);
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore - Property 'productItems' does not exist on type 'WebsiteConfig'
          setProductItems(websiteConfig.productItems as any || null);
          // @ts-ignore - Property 'productStyles' does not exist on type 'WebsiteConfig'
          setProductStyles(websiteConfig.productStyles as any || null);
          /* eslint-enable @typescript-eslint/ban-ts-comment */
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        } else {
          setErrorMessage(`Could not find a website with store name: ${storeName}`);
        }
        
        // Check if this is the first visit to home page
        if (!initialized) {
          const hasVisitedHome = localStorage.getItem('hasVisitedHome');
          if (hasVisitedHome === 'true') {
            setShowWelcome(false);
          } else {
            setShowWelcome(true);
          }
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching website data:', error);
        setErrorMessage('Error loading website. Please try again later.');
        
        // Fall back to localStorage if API fails
        const savedNavItems = localStorage.getItem('navItems');
        const savedNavStyles = localStorage.getItem('navStyles');
        const savedHeroItems = localStorage.getItem('heroItems');
        const savedHeroStyles = localStorage.getItem('heroStyles');
        const savedCollectionItems = localStorage.getItem('collectionItems');
        const savedCollectionStyles = localStorage.getItem('collectionStyles');
        const savedProductItems = localStorage.getItem('productItems');
        const savedProductStyles = localStorage.getItem('productStyles');
        
        if (savedNavItems) setNavItems(JSON.parse(savedNavItems));
        if (savedNavStyles) setNavStyles(JSON.parse(savedNavStyles));
        if (savedHeroItems) setHeroItems(JSON.parse(savedHeroItems));
        if (savedHeroStyles) setHeroStyles(JSON.parse(savedHeroStyles));
        if (savedCollectionItems) setCollectionItems(JSON.parse(savedCollectionItems));
        if (savedCollectionStyles) setCollectionStyles(JSON.parse(savedCollectionStyles));
        if (savedProductItems) setProductItems(JSON.parse(savedProductItems));
        if (savedProductStyles) setProductStyles(JSON.parse(savedProductStyles));
      } finally {
        setIsLoading(false);
      }
    };

    // Only run in browser
    if (typeof window !== 'undefined' && storeName) {
      fetchData();
    }
  }, [storeName, initialized]);

  // For backup purposes: use exact hardcoded structure if needed
  useEffect(() => {
    if (typeof window !== 'undefined' && storeName && !navItems) {
      // Exact structure from the provided data
      const exactNavItems = [
        {
          "id": "logo",
          "type": "image",
          "label": "ella2y",
          "link": "/",
          "position": "left",
          "imageUrl": "/uploads/logo_4e2edaa2-3bfb-41b9-a49e-3ec85cb50b25.png",
          "styles": {
            "color": "",
            "fontSize": "",
            "fontFamily": "",
            "backgroundColor": "",
            "padding": "",
            "marginTop": "",
            "width": "40px",
            "height": "40px",
            "objectFit": "contain"
          }
        },
        {
          "id": "1",
          "type": "link",
          "label": "Home",
          "link": "/",
          "position": "nav",
          "styles": {
            "color": "#1e40af",
            "fontSize": "16px",
            "fontFamily": "Inter",
            "backgroundColor": "transparent",
            "padding": "0.5rem",
            "marginTop": "0",
            "fontWeight": "500",
            "textTransform": "uppercase",
            "letterSpacing": "0.5px",
            "hover": {
              "color": "#2563eb"
            }
          }
        },
        {
          "id": "2",
          "type": "link",
          "label": "Products",
          "link": "/products",
          "position": "nav",
          "styles": {
            "color": "#1e40af",
            "fontSize": "16px",
            "fontFamily": "Inter",
            "backgroundColor": "transparent",
            "padding": "0.5rem",
            "marginTop": "0",
            "fontWeight": "500",
            "textTransform": "uppercase",
            "letterSpacing": "0.5px",
            "hover": {
              "color": "#2563eb"
            }
          }
        },
        {
          "id": "3",
          "type": "link",
          "label": "Case Studies",
          "link": "/case-studies",
          "position": "nav",
          "styles": {
            "color": "#1e40af",
            "fontSize": "16px",
            "fontFamily": "Inter",
            "backgroundColor": "transparent",
            "padding": "0.5rem",
            "marginTop": "0",
            "fontWeight": "500",
            "textTransform": "uppercase",
            "letterSpacing": "0.5px",
            "hover": {
              "color": "#2563eb"
            }
          }
        },
        {
          "id": "4",
          "type": "link",
          "label": "About",
          "link": "/about",
          "position": "nav",
          "styles": {
            "color": "#1e40af",
            "fontSize": "16px",
            "fontFamily": "Inter",
            "backgroundColor": "transparent",
            "padding": "0.5rem",
            "marginTop": "0",
            "fontWeight": "500",
            "textTransform": "uppercase",
            "letterSpacing": "0.5px",
            "hover": {
              "color": "#2563eb"
            }
          }
        },
        {
          "id": "5",
          "type": "link",
          "label": "Contact",
          "link": "/contact",
          "position": "right",
          "styles": {
            "color": "#ffffff",
            "fontSize": "16px",
            "fontFamily": "Inter",
            "backgroundColor": "#2563eb",
            "padding": "0.75rem 1.5rem",
            "marginTop": "0",
            "fontWeight": "600",
            "borderRadius": "4px",
            "textTransform": "uppercase",
            "letterSpacing": "0.5px",
            "boxShadow": "0 2px 4px rgba(0,0,0,0.1)",
            "hover": {
              "backgroundColor": "#1e40af",
              "transform": "translateY(-1px)",
              "boxShadow": "0 4px 6px rgba(0,0,0,0.15)"
            }
          }
        }
      ];

      const exactNavStyles = {
        "backgroundColor": "#ffffff",
        "padding": "1rem",
        "fontFamily": "Inter",
        "color": "#1e40af",
        "boxShadow": "0 2px 4px rgba(0,0,0,0.1)"
      };

      // Set as fallback if API data isn't showing
      setNavItems(exactNavItems as NavItem[]);
      setNavStyles(exactNavStyles as NavbarStyles);
    }
  }, [storeName, navItems]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedHome', 'true');
    setShowTips(true); // Show tips after welcome
  };

  return (
    <main className="min-h-screen flex flex-col">
      <ClientOnly>
        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg text-gray-700">Loading your website...</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && !isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <p className="text-gray-600 text-sm">Please check the store name and try again.</p>
            </div>
          </div>
        )}
      
        {/* Welcome Modal */}
        {showWelcome && !isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <h2 className="text-2xl font-bold text-white">Welcome to Your New Website</h2>
                <p className="text-blue-100 mt-2">Your professional online presence starts here</p>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Website is Ready!</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Professional Design</h4>
                      <p className="text-gray-600">Your website features a modern, responsive design that looks great on all devices.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Easy Customization</h4>
                      <p className="text-gray-600">Use our website builder to customize every aspect of your site with just a few clicks.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">AI-Powered Features</h4>
                      <p className="text-gray-600">Get intelligent suggestions and content generation powered by AI technology.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={dismissWelcome}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Let&apos;s explore your site!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    
        {/* Quick Tips Modal */}
        {showTips && !isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowTips(false)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Quick Tips</h2>
                  <button 
                    onClick={() => setShowTips(false)}
                    className="text-white hover:text-indigo-200"
                    title="Close tips"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-gray-700">
                    Here are some quick tips to help you get started with your new website:
                  </p>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Click the edit button in the bottom right to customize your site</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Use the AI assistant to get design suggestions and content ideas</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Preview your changes in real-time before saving</span>
                  </li>
                </ul>
                
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-gray-700 text-sm">
                    <strong>Pro tip:</strong> Your website automatically saves all changes and looks great on all devices!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    
        {/* Edit Button */}
        <Link
          href={`/edit/${storeName}`}
          target="_blank"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center hover:scale-110"
          title="Open Editor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
    
        {/* Quick Tips Button */}
        <button
          onClick={() => setShowTips(true)}
          className="fixed bottom-8 right-28 z-40 w-14 h-14 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center hover:scale-110"
          title="Show Quick Tips"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        {/* Content section with flex-grow to push footer to bottom */}
        <div className="flex-grow">
          {/* Preview Components */}
          {navItems && navStyles && (
            <Navbar 
              isAdmin={false}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
              savedItems={navItems}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment */
              // @ts-ignore - boxShadow property missing in NavbarStyles type
              savedStyles={navStyles}
            />
          )}
          
          {heroItems && heroStyles && (
            <Hero
              isAdmin={false}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between HeroItem[] from different imports
              savedItems={heroItems as any}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between HeroStyles from different imports
              savedStyles={heroStyles as any}
            />
          )}
      
          {collectionItems && collectionStyles && (
            <Collection 
              isAdmin={false}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between CollectionItem[] from different imports
              savedItems={collectionItems as any}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between CollectionStyles from different imports
              savedStyles={collectionStyles as any}
            />
          )}

          {productItems && productStyles && (
            <Products 
              isAdmin={false}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between ProductItem[] from different imports
              savedItems={productItems as any}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore - Types mismatch between ProductStyles from different imports
              savedStyles={productStyles as any}
            />
          )}
        </div>
        
        {/* Footer Component */}
        <Footer 
          isAdmin={false}
          savedSocialLinks={null}
          savedColumns={null}
          savedStyles={null}
        />
      </ClientOnly>
    </main>
  );
}