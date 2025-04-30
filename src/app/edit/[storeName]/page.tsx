'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MongoDBApiService } from '@/services/mondodbapi';
import { NavItem, NavbarStyles, HeroItem, HeroStyles, CollectionItem, CollectionStyles, ProductItem, ProductStyles } from '@/types/websiteConfig';
import { useParams } from 'next/navigation';
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

// Dynamically import components with ssr:false to prevent them from loading during server-side rendering
const Navbar = dynamic(() => import('../../../components/navbar'), { ssr: false });
const Hero = dynamic(() => import('../../../components/hero'), { ssr: false });
const Collection = dynamic(() => import('@/components/Collection'), { ssr: false });
const Products = dynamic(() => import('@/components/Products'), { ssr: false });

type EditableComponent = 'navbar' | 'hero' | 'header' | 'footer' | 'content' | 'collection' | 'products' | null;

// API key for AI services
const OPENAI_API_KEY = 'AIzaSyCiYjw2tHMyFGVysLOTBztOl2Z9H4l8L3E';

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

export default function Editor() {
  const params = useParams();
  const storeName = params?.storeName as string;
  
  const [editingComponent, setEditingComponent] = useState<EditableComponent>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Add state for saved items and styles
  const [navItems, setNavItems] = useState<NavItem[] | null>(null);
  const [navStyles, setNavStyles] = useState<NavbarStyles | null>(null);
  const [heroItems, setHeroItems] = useState<HeroItem[] | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[] | null>(null);
  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[] | null>(null);
  const [productStyles, setProductStyles] = useState<ProductStyles | null>(null);
  const [footerColumns, setFooterColumns] = useState<any[] | null>(null);
  const [footerStyles, setFooterStyles] = useState<any | null>(null);
  const [footerSocialLinks, setFooterSocialLinks] = useState<any[] | null>(null);

  // Fetch data from MongoDB
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Fetch website configuration by store name or default
        let websiteConfig;
        if (storeName) {
          websiteConfig = await MongoDBApiService.getWebsiteConfigByStoreName(storeName);
        } else {
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
          // @ts-ignore - Properties not in WebsiteConfig type but needed for functionality
          setProductItems(websiteConfig.productItems as any || null);
          // @ts-ignore - Properties not in WebsiteConfig type but needed for functionality
          setProductStyles(websiteConfig.productStyles as any || null);
          // @ts-ignore - Properties not in WebsiteConfig type but needed for functionality
          setFooterColumns(websiteConfig.footerColumns as any || null);
          // @ts-ignore - Properties not in WebsiteConfig type but needed for functionality
          setFooterStyles(websiteConfig.footerStyles as any || null);
          // @ts-ignore - Properties not in WebsiteConfig type but needed for functionality
          setFooterSocialLinks(websiteConfig.footerSocialLinks as any || null);
          /* eslint-enable @typescript-eslint/ban-ts-comment */
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        } else if (storeName) {
          setErrorMessage(`Could not find a website with store name: ${storeName}`);
          
          // Fall back to localStorage
          loadFromLocalStorage();
        } else {
          // Fall back to localStorage if no store found
          loadFromLocalStorage();
        }

        // Check if this is the first visit
        if (!initialized) {
          const hasVisitedBefore = localStorage.getItem('hasVisitedBuilder');
          if (hasVisitedBefore === 'true') {
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
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper function to load data from localStorage
    const loadFromLocalStorage = () => {
      const savedNavItems = localStorage.getItem('navItems');
      const savedNavStyles = localStorage.getItem('navStyles');
      const savedHeroItems = localStorage.getItem('heroItems');
      const savedHeroStyles = localStorage.getItem('heroStyles');
      const savedCollectionItems = localStorage.getItem('collectionItems');
      const savedCollectionStyles = localStorage.getItem('collectionStyles');
      const savedProductItems = localStorage.getItem('productItems');
      const savedProductStyles = localStorage.getItem('productStyles');
      const savedFooterColumns = localStorage.getItem('footerColumns');
      const savedFooterStyles = localStorage.getItem('footerStyles');
      const savedFooterSocialLinks = localStorage.getItem('footerSocialLinks');
      
      if (savedNavItems) setNavItems(JSON.parse(savedNavItems));
      if (savedNavStyles) setNavStyles(JSON.parse(savedNavStyles));
      if (savedHeroItems) setHeroItems(JSON.parse(savedHeroItems));
      if (savedHeroStyles) setHeroStyles(JSON.parse(savedHeroStyles));
      if (savedCollectionItems) setCollectionItems(JSON.parse(savedCollectionItems));
      if (savedCollectionStyles) setCollectionStyles(JSON.parse(savedCollectionStyles));
      if (savedProductItems) setProductItems(JSON.parse(savedProductItems));
      if (savedProductStyles) setProductStyles(JSON.parse(savedProductStyles));
      if (savedFooterColumns) setFooterColumns(JSON.parse(savedFooterColumns));
      if (savedFooterStyles) setFooterStyles(JSON.parse(savedFooterStyles));
      if (savedFooterSocialLinks) setFooterSocialLinks(JSON.parse(savedFooterSocialLinks));
    };
    
    fetchData();
  }, [storeName, initialized]);

  // For backup purposes: use exact hardcoded structure if needed
  useEffect(() => {
    if (typeof window !== 'undefined' && !navItems) {
      // Exact structure from the provided data
      const exactNavItems = [
        {
          "id": "logo",
          "type": "image",
          "label": storeName || "My Store",
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
          "id": "4",
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
  }, [navItems, storeName]);

  const handleSave = async () => {
    try {
      // Get latest local storage values before saving to MongoDB
      const latestNavItems = localStorage.getItem('navItems');
      const latestNavStyles = localStorage.getItem('navStyles');
      const latestHeroItems = localStorage.getItem('heroItems');
      const latestHeroStyles = localStorage.getItem('heroStyles');
      const latestCollectionItems = localStorage.getItem('collectionItems');
      const latestCollectionStyles = localStorage.getItem('collectionStyles');
      const latestProductItems = localStorage.getItem('productItems');
      const latestProductStyles = localStorage.getItem('productStyles');
      const latestFooterColumns = localStorage.getItem('footerColumns');
      const latestFooterStyles = localStorage.getItem('footerStyles');
      const latestFooterSocialLinks = localStorage.getItem('footerSocialLinks');
      
      // Create website config object
      const websiteConfig = {
        // Include storeName if it exists
        ...(storeName && { storeName }),
        navItems: latestNavItems ? JSON.parse(latestNavItems) : navItems,
        navStyles: latestNavStyles ? JSON.parse(latestNavStyles) : navStyles,
        heroItems: latestHeroItems ? JSON.parse(latestHeroItems) : heroItems,
        heroStyles: latestHeroStyles ? JSON.parse(latestHeroStyles) : heroStyles,
        collectionItems: latestCollectionItems ? JSON.parse(latestCollectionItems) : collectionItems,
        collectionStyles: latestCollectionStyles ? JSON.parse(latestCollectionStyles) : collectionStyles,
        productItems: latestProductItems ? JSON.parse(latestProductItems) : productItems,
        productStyles: latestProductStyles ? JSON.parse(latestProductStyles) : productStyles,
        footerColumns: latestFooterColumns ? JSON.parse(latestFooterColumns) : footerColumns,
        footerStyles: latestFooterStyles ? JSON.parse(latestFooterStyles) : footerStyles,
        footerSocialLinks: latestFooterSocialLinks ? JSON.parse(latestFooterSocialLinks) : footerSocialLinks,
      };
      
      // Save to MongoDB
      await MongoDBApiService.saveWebsiteConfig(websiteConfig);
      
      // Update local state
      setNavItems(websiteConfig.navItems);
      setNavStyles(websiteConfig.navStyles);
      setHeroItems(websiteConfig.heroItems);
      setHeroStyles(websiteConfig.heroStyles);
      setCollectionItems(websiteConfig.collectionItems);
      setCollectionStyles(websiteConfig.collectionStyles);
      setProductItems(websiteConfig.productItems);
      setProductStyles(websiteConfig.productStyles);
      setFooterColumns(websiteConfig.footerColumns);
      setFooterStyles(websiteConfig.footerStyles);
      setFooterSocialLinks(websiteConfig.footerSocialLinks);
      
      // Exit editing mode
      setEditingComponent(null);
    } catch (error) {
      console.error('Error saving website configuration:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedBuilder', 'true');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <ClientOnly>
        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg text-gray-700">Loading your website editor...</p>
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
                <h2 className="text-2xl font-bold text-white">Welcome to Website Builder</h2>
                <p className="text-blue-100 mt-2">Your powerful tool for creating beautiful websites without coding</p>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Select a Component</h4>
                      <p className="text-gray-600">Click on any component from the left sidebar to start editing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Customize</h4>
                      <p className="text-gray-600">Use the editing panel to change colors, fonts, content, and layout.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Save & Preview</h4>
                      <p className="text-gray-600">Click Save when you&apos;re done, and use the Preview button to see your changes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">AI Assistant</h4>
                      <p className="text-gray-600">When editing a component, you&apos;ll find an AI assistant at the bottom of the editing panel.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={dismissWelcome}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Got it, let&apos;s build!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Tips Popup */}
        {showTips && !isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowTips(false)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">AI Assistant Tips</h2>
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
                    When you select a component from the sidebar, you&apos;ll find an AI assistant at the bottom of the editing panel that can help you with:
                  </p>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Changing colors, fonts, and styles</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Suggesting design improvements</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Creating content and copywriting</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Answering questions about website building</span>
                  </li>
                </ul>
                
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-gray-700 text-sm">
                    <strong>Pro tip:</strong> Try asking the AI assistant to &ldquo;change the navbar color to blue&ldquo; or &ldquo;suggest a professional color scheme&ldquo; when editing a component.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Preview Button */}
        <a
          href={storeName ? `/home/${storeName}` : "/home"}
          target="_blank"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center hover:scale-110"
          title="View Live Site"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </a>
        
        {/* Tips Button */}
        <button
          onClick={() => setShowTips(true)}
          className="fixed bottom-8 right-28 z-40 w-14 h-14 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center hover:scale-110 animate-pulse-custom"
          title="Show AI Assistant Tips"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        {/* Component Selection Menu */}
        {!editingComponent && !isLoading && (
          <div className="fixed left-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-40">
            <h3 className="text-lg font-semibold mb-4">Edit Components</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEditingComponent('navbar')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Navigation Bar
              </button>
              <button
                onClick={() => setEditingComponent('hero')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Hero Section
              </button>
              <button
                onClick={() => setEditingComponent('collection')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Collection Section
              </button>
              <button
                onClick={() => setEditingComponent('products')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Products Section
              </button>
              <button
                onClick={() => setEditingComponent('footer')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Footer Section
              </button>
            </div>
          </div>
        )}
  
        {/* Main Content Container */}
        <div className="flex flex-col flex-grow">
          {/* Components */}
          {navItems && navStyles && (
            <Navbar 
              isAdmin={true} 
              isEditing={editingComponent === 'navbar'}
              onStartEdit={() => setEditingComponent('navbar')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
              savedItems={navItems}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment */
              // @ts-ignore - boxShadow property missing in NavbarStyles type
              savedStyles={navStyles}
            />
          )}
          
          {heroItems && heroStyles && (
            <Hero
              isAdmin={true}
              isEditing={editingComponent === 'hero'}
              onStartEdit={() => setEditingComponent('hero')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={heroItems as any}
              savedStyles={heroStyles as any}
            />
          )}
    
          {collectionItems && collectionStyles && (
            <Collection 
              isAdmin={true}
              isEditing={editingComponent === 'collection'}
              onStartEdit={() => setEditingComponent('collection')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={collectionItems as any}
              savedStyles={collectionStyles as any}
            />
          )}

          {productItems && productStyles && (
            <Products 
              isAdmin={true}
              isEditing={editingComponent === 'products'}
              onStartEdit={() => setEditingComponent('products')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={productItems as any}
              savedStyles={productStyles as any}
            />
          )}
          
          {footerColumns && footerStyles && (
            <Footer 
              isAdmin={true}
              isEditing={editingComponent === 'footer'}
              onStartEdit={() => setEditingComponent('footer')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedColumns={footerColumns}
              savedStyles={footerStyles}
              savedSocialLinks={footerSocialLinks}
            />
          )}
          
        </div>
        
       
      </ClientOnly>
    </main>
  );
} 