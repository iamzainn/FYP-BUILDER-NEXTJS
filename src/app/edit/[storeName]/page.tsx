'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { NavItem, NavbarStyles, HeroItem, HeroStyles, CollectionItem, CollectionStyles, ProductItem, ProductStyles, WebsiteConfig, FooterColumn, FooterStyles, SocialLink } from '@/types/websiteConfig';
import { pageService, Page } from '@/services/pageService';
import { MongoDBApiService } from '@/services/mondodbapi';
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

interface ComponentsData {
  navbar?: {
    componentId?: number;
    items: NavItem[];
    styles: NavbarStyles;
  };
  hero?: {
    componentId?: number;
    items: HeroItem[];
    styles: HeroStyles;
  };
  collection?: {
    componentId?: number;
    items: CollectionItem[];
    styles: CollectionStyles;
  };
  product?: {
    componentId?: number;
    items: ProductItem[];
    styles: ProductStyles;
  };
  footer?: {
    componentId?: number;
    columns: FooterColumn[];
    styles: FooterStyles;
    socialLinks: SocialLink[];
  };
  [key: string]: any;
}

export default function Editor() {
  const params = useParams();
  const router = useRouter();
  const storeName = params?.storeName as string;
  
  const [editingComponent, setEditingComponent] = useState<EditableComponent>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Main state for the page
  const [pageData, setPageData] = useState<Page | null>(null);
  const [componentsData, setComponentsData] = useState<ComponentsData>({});
  
  // Add state for individual component data - this will be phased out
  const [navItems, setNavItems] = useState<NavItem[] | null>(null);
  const [navStyles, setNavStyles] = useState<NavbarStyles | null>(null);
  const [heroItems, setHeroItems] = useState<HeroItem[] | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[] | null>(null);
  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[] | null>(null);
  const [productStyles, setProductStyles] = useState<ProductStyles | null>(null);
  const [footerColumns, setFooterColumns] = useState<FooterColumn[] | null>(null);
  const [footerStyles, setFooterStyles] = useState<FooterStyles | null>(null);
  const [footerSocialLinks, setFooterSocialLinks] = useState<SocialLink[] | null>(null);

  // Function to open a sidebar for editing a component
  const openSidebar = (component: EditableComponent) => {
    console.log(`Opening sidebar for ${component} component`);
    setEditingComponent(component);
  };
  
  // Function to close any open sidebar
  const closeSidebar = () => {
    console.log("Closing sidebar, current editing component:", editingComponent);
    setEditingComponent(null);
  };

  // Fetch data from API
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        if (!storeName) {
          setErrorMessage('Store name is required');
          setIsLoading(false);
          return;
        }
        
        // Fetch the homepage for this store
        const homePage = await pageService.getHomePage(storeName);
        
        if (homePage) {
         
          setPageData(homePage);
          console.log('Home page data:', JSON.stringify(homePage, null, 2));
          setComponentsData(homePage.components || {});
          
          // For backwards compatibility, set the individual component states
          updateComponentStatesFromCentralData(homePage.components);
        } else {
          setErrorMessage(`Could not find a homepage for store: ${storeName}`);
          // Fall back to localStorage
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
    
    // Update individual component states from central data
    const updateComponentStatesFromCentralData = (components: ComponentsData) => {
      if (components.navbar) {
        setNavItems(components.navbar.items || null);
        setNavStyles(components.navbar.styles || null);
      }
      
      if (components.hero) {
        setHeroItems(components.hero.items || null);
        setHeroStyles(components.hero.styles || null);
      }
      
      if (components.collection) {
        setCollectionItems(components.collection.items || null);
        setCollectionStyles(components.collection.styles || null);
      }
      
      if (components.product) {
        setProductItems(components.product.items || null);
        setProductStyles(components.product.styles || null);
      }
      
      if (components.footer) {
        setFooterColumns(components.footer.columns || null);
        setFooterStyles(components.footer.styles || null);
        setFooterSocialLinks(components.footer.socialLinks || null);
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
      
      // Also populate the central components data
      const componentsData: ComponentsData = {};
      
      if (savedNavItems && savedNavStyles) {
        componentsData.navbar = {
          items: JSON.parse(savedNavItems),
          styles: JSON.parse(savedNavStyles)
        };
      }
      
      if (savedHeroItems && savedHeroStyles) {
        componentsData.hero = {
          items: JSON.parse(savedHeroItems),
          styles: JSON.parse(savedHeroStyles)
        };
      }
      
      if (savedCollectionItems && savedCollectionStyles) {
        componentsData.collection = {
          items: JSON.parse(savedCollectionItems),
          styles: JSON.parse(savedCollectionStyles)
        };
      }
      
      if (savedProductItems && savedProductStyles) {
        componentsData.product = {
          items: JSON.parse(savedProductItems),
          styles: JSON.parse(savedProductStyles)
        };
      }
      
      if (savedFooterColumns && savedFooterStyles && savedFooterSocialLinks) {
        componentsData.footer = {
          columns: JSON.parse(savedFooterColumns),
          styles: JSON.parse(savedFooterStyles),
          socialLinks: JSON.parse(savedFooterSocialLinks)
        };
      }
      
      setComponentsData(componentsData);
    };
    
    fetchData();
  }, [storeName, initialized]);

 

  // Handle component updates
  const handleComponentUpdate = (componentType: string, data: any) => {
    console.log(`handleComponentUpdate called for ${componentType}:`, JSON.stringify(data, null, 2));
    
    // Update the central state with a fresh copy to ensure change detection
    setComponentsData(prevData => {
      // Deep clone both the previous state and the incoming data
      const newData = JSON.parse(JSON.stringify(prevData));
      const deepCopiedData = JSON.parse(JSON.stringify(data));
      
      // Create/update the component data
      if (componentType.toLowerCase() === 'navbar') {
        // For navbar, we need to ensure boxShadow property is set
        if (deepCopiedData.styles && !deepCopiedData.styles.boxShadow) {
          deepCopiedData.styles.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }
      
      // Update the component data
      newData[componentType.toLowerCase()] = deepCopiedData;
      
      console.log(`Updated componentsData for ${componentType}:`, newData[componentType.toLowerCase()]);
      return newData;
    });
    
    // For backwards compatibility, also update individual component states
    switch (componentType.toLowerCase()) {
      case 'navbar':
        if (data.items) {
          
          // Deep clone before setting state
          const deepCopiedItems = JSON.parse(JSON.stringify(data.items));
          setNavItems(deepCopiedItems);
        }
        if (data.styles) {
        
          // Deep clone and ensure boxShadow is present
          const deepCopiedStyles = JSON.parse(JSON.stringify(data.styles));
          if (!deepCopiedStyles.boxShadow) {
            deepCopiedStyles.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }
          setNavStyles(deepCopiedStyles);
        }
        break;
        
      // Other component cases remain the same
      case 'hero':
        if (data.items) setHeroItems(data.items as any);
        if (data.styles) setHeroStyles(data.styles as any);
        break;
      case 'collection':
        if (data.items) setCollectionItems(data.items as any);
        if (data.styles) setCollectionStyles(data.styles as any);
        break;
      case 'product':
        if (data.items) setProductItems(data.items as any);
        if (data.styles) setProductStyles(data.styles as any);
        break;
      case 'footer':
        if (data.columns) setFooterColumns(data.columns);
        if (data.styles) setFooterStyles(data.styles);
        if (data.socialLinks) setFooterSocialLinks(data.socialLinks);
        break;
    }
  };

  const handleSave = async () => {
    try {
      // Show saving state
      setIsSaving(true);
      
      // Check if we have a valid page ID to update
      if (pageData?.id) {
        // Create component updates based on the current componentsData
        const componentUpdates = Object.entries(componentsData).map(([type, data]) => {
          
          
          // Format the data based on component type
          let content;
          switch (type) {
            case 'navbar':
            case 'hero':
            case 'collection':
            case 'product':
              // Deep clone to ensure we're sending fresh objects
              const itemsCopy = data.items ? JSON.parse(JSON.stringify(data.items)) : [];
              const stylesCopy = data.styles ? JSON.parse(JSON.stringify(data.styles)) : {};
              
              // Special handling for navbar to ensure boxShadow is present
              if (type === 'navbar' && stylesCopy && !stylesCopy.boxShadow) {
                stylesCopy.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
              
              content = {
                items: itemsCopy,
                styles: stylesCopy
              };
              break;
            case 'footer':
              content = {
                columns: data.columns ? JSON.parse(JSON.stringify(data.columns)) : [],
                styles: data.styles ? JSON.parse(JSON.stringify(data.styles)) : {},
                socialLinks: data.socialLinks ? JSON.parse(JSON.stringify(data.socialLinks)) : []
              };
              break;
            default:
              content = JSON.parse(JSON.stringify(data));
          }
          
          console.log(`Formatted content for ${type}:`, JSON.stringify(content, null, 2));
          
          return {
            componentType: type.toUpperCase(),
            content
          };
        });
        
        console.log('Sending componentUpdates to API:', JSON.stringify(componentUpdates, null, 2));
        
        // Send the updates to the API
        const updatedPage = await pageService.updatePageComponents(pageData.id, {
          componentUpdates
        });
        
       
        
        // Instead of overwriting our state with the server response,
        // we'll preserve our current component state and just update the page metadata
        setPageData(prevData => ({
          ...updatedPage,
          components: prevData?.components || componentsData // Keep our current component data with fallback
        }));
        
        // No need to call updateComponentStatesFromCentralData here,
        // as we want to preserve the current state of the components
      } else {
        // For backwards compatibility, save to localStorage
        Object.entries(componentsData).forEach(([type, data]) => {
          switch (type) {
            case 'navbar':
              localStorage.setItem('navItems', JSON.stringify(data.items || []));
              localStorage.setItem('navStyles', JSON.stringify(data.styles || {}));
              break;
            case 'hero':
              localStorage.setItem('heroItems', JSON.stringify(data.items || []));
              localStorage.setItem('heroStyles', JSON.stringify(data.styles || {}));
              break;
            case 'collection':
              localStorage.setItem('collectionItems', JSON.stringify(data.items || []));
              localStorage.setItem('collectionStyles', JSON.stringify(data.styles || {}));
              break;
            case 'product':
              localStorage.setItem('productItems', JSON.stringify(data.items || []));
              localStorage.setItem('productStyles', JSON.stringify(data.styles || {}));
              break;
            case 'footer':
              localStorage.setItem('footerColumns', JSON.stringify(data.columns || []));
              localStorage.setItem('footerStyles', JSON.stringify(data.styles || {}));
              localStorage.setItem('footerSocialLinks', JSON.stringify(data.socialLinks || []));
              break;
          }
        });
      }
      
      // Exit editing mode
      setEditingComponent(null);
    } catch (error) {
      console.error('Error saving website configuration:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      // Hide saving state when complete
      setIsSaving(false);
    }
  };
  
  // Helper function to update individual component states from central data
  const updateComponentStatesFromCentralData = (components: ComponentsData) => {
    if (components.navbar) {
      setNavItems(components.navbar.items || null);
      setNavStyles(components.navbar.styles || null);
    }
    
    if (components.hero) {
      setHeroItems(components.hero.items || null);
      setHeroStyles(components.hero.styles || null);
    }
    
    if (components.collection) {
      setCollectionItems(components.collection.items || null);
      setCollectionStyles(components.collection.styles || null);
    }
    
    if (components.product) {
      setProductItems(components.product.items || null);
      setProductStyles(components.product.styles || null);
    }
    
    if (components.footer) {
      setFooterColumns(components.footer.columns || null);
      setFooterStyles(components.footer.styles || null);
      setFooterSocialLinks(components.footer.socialLinks || null);
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisitedBuilder', 'true');
  };

  // Add a function to handle AI-generated updates
  const handleAIConfigUpdate = (newConfig: any) => {
    console.log('handleAIConfigUpdate called with new config:', JSON.stringify(newConfig, null, 2));
    
    // Handle navbar updates
    if (newConfig.navbarConfig) {
      console.log('Updating navbar configuration');
      
      // Update navbar items if provided
      if (newConfig.navbarConfig.items) {
        setNavItems(newConfig.navbarConfig.items);
      }
      
      // Update navbar styles if provided
      if (newConfig.navbarConfig.styles) {
        setNavStyles(newConfig.navbarConfig.styles);
      }
      
      // Update the central data store
      handleComponentUpdate('navbar', {
        items: newConfig.navbarConfig.items || navItems,
        styles: newConfig.navbarConfig.styles || navStyles
      });
    }
    
    // Handle hero updates
    if (newConfig.heroConfig) {
      console.log('Updating hero configuration');
      
      // Update hero items if provided
      if (newConfig.heroConfig.items) {
        setHeroItems(newConfig.heroConfig.items);
      }
      
      // Update hero styles if provided
      if (newConfig.heroConfig.styles) {
        setHeroStyles(newConfig.heroConfig.styles);
      }
      
      // Update the central data store
      handleComponentUpdate('hero', {
        componentId: componentsData.hero?.componentId,
        items: newConfig.heroConfig.items || heroItems,
        styles: newConfig.heroConfig.styles || heroStyles
      });
    }
    
    // Handle collection updates
    if (newConfig.collectionConfig) {
      console.log('Updating collection configuration');
      
      // Update collection items if provided
      if (newConfig.collectionConfig.items) {
        setCollectionItems(newConfig.collectionConfig.items);
      }
      
      // Update collection styles if provided
      if (newConfig.collectionConfig.styles) {
        setCollectionStyles(newConfig.collectionConfig.styles);
      }
      
      // Update the central data store
      handleComponentUpdate('collection', {
        items: newConfig.collectionConfig.items || collectionItems,
        styles: newConfig.collectionConfig.styles || collectionStyles
      });
    }
    
    // Handle products updates
    if (newConfig.productsConfig) {
      console.log('Updating products configuration');
      
      // Update product items if provided
      if (newConfig.productsConfig.items) {
        setProductItems(newConfig.productsConfig.items);
      }
      
      // Update product styles if provided
      if (newConfig.productsConfig.styles) {
        setProductStyles(newConfig.productsConfig.styles);
      }
      
      // Update the central data store
      handleComponentUpdate('product', {
        items: newConfig.productsConfig.items || productItems,
        styles: newConfig.productsConfig.styles || productStyles
      });
    }
    
    // Handle footer updates
    if (newConfig.footerConfig) {
     
      
      // Update footer columns if provided
      if (newConfig.footerConfig.columns) {
        setFooterColumns(newConfig.footerConfig.columns);
      }
      
      // Update footer styles if provided
      if (newConfig.footerConfig.styles) {
        setFooterStyles(newConfig.footerConfig.styles);
      }
      
      // Update footer social links if provided
      if (newConfig.footerConfig.socialLinks) {
        setFooterSocialLinks(newConfig.footerConfig.socialLinks);
      }
      
      // Update the central data store
      handleComponentUpdate('footer', {
        columns: newConfig.footerConfig.columns || footerColumns,
        styles: newConfig.footerConfig.styles || footerStyles,
        socialLinks: newConfig.footerConfig.socialLinks || footerSocialLinks
      });
    }
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
        
        {/* Saving State */}
        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-700">Saving changes...</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && !isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <p className="text-gray-600 text-sm">Please check the store name and try again later.</p>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTips(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute top-5 right-5 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"></div>
                <div className="relative flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4"></path>
                      <path d="M12 8h.01"></path>
                    </svg>
                    <h2 className="text-2xl font-bold text-white">AI Assistant Pro</h2>
                  </div>
                  <p className="text-blue-100 font-light">Powerful AI-driven design recommendations and instant content generation</p>
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                  title="Close tips"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-5">
                  <p className="text-gray-700 dark:text-gray-200">
                    Our AI assistant provides intelligent design suggestions and content generation capabilities to enhance your website building experience:
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border-l-4 border-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Intelligent Design</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Smart color palettes, typography, and layout recommendations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border-l-4 border-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Content Generation</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Professional copywriting and SEO-optimized text for your website</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border-l-4 border-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Layout Optimization</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Responsive design improvements for all device types</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h5 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">PRO TIP</h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Try asking specific questions like <span className="font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">"Create a modern hero section for my tech startup"</span> or <span className="font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">"Suggest a color scheme for a luxury brand"</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Preview Button */}
        <a
          href={storeName ? `/home/${storeName}` : "/home"}
          target="_blank"
          className="fixed bottom-8 right-8 z-40 h-12 px-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center group"
          title="View Live Site"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-medium">Preview</span>
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-300 animate-ping"></span>
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-400"></span>
        </a>
        
        {/* Tips Button */}
        <button
          onClick={() => setShowTips(true)}
          className="fixed bottom-8 right-36 z-40 h-12 px-5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
          title="Show AI Assistant Tips"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
        
        {/* Component Selection Menu */}
        {!editingComponent && !isLoading && (
          <div className="fixed left-8 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-0 rounded-xl shadow-xl z-40 border border-gray-100 dark:border-gray-700 overflow-hidden w-64">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
              <div className="flex items-center space-x-3 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <h3 className="text-xl font-bold text-white">Page Builder</h3>
              </div>
              <p className="text-blue-200 text-sm">Select a component to customize</p>
            </div>
            
            <div className="p-2">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setEditingComponent('navbar')}
                  className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Navigation Bar</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setEditingComponent('hero')}
                  className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Hero Section</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setEditingComponent('collection')}
                  className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Collection Section</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setEditingComponent('products')}
                  className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Products Section</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setEditingComponent('footer')}
                  className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Footer Section</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="px-4 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Actions</span>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Save All Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Main Content Container */}
        <div className="flex flex-col flex-grow">
          {/* Components - Using centralized data where available, falling back to individual state for backwards compatibility */}
          {componentsData.navbar ? (
            <Navbar 
              isAdmin={true} 
              isEditing={editingComponent === 'navbar'}
              onStartEdit={() => setEditingComponent('navbar')}
              onClose={closeSidebar}
              onSave={() => {
                // Update the central state with the latest individual component state
                handleComponentUpdate('navbar', {
                  items: navItems,
                  styles: navStyles
                });
                // Save all changes
                handleSave();
              }}
              apiKey={OPENAI_API_KEY}
              savedItems={componentsData.navbar.items}
              savedStyles={componentsData.navbar.styles}
              onItemsChange={(items) => {
                console.log('Items changed in Navbar component:', items);
                // Update individual state - using type assertion to handle type differences
                setNavItems(items as any);
                
                // Update central state with a complete object
                handleComponentUpdate('navbar', {
                  items: items,
                  styles: navStyles || componentsData.navbar?.styles || {}
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Navbar component:', styles);
                // Update individual state - using type assertion to handle type differences
                setNavStyles(styles as any);
                
                // Update central state with a complete object
                handleComponentUpdate('navbar', {
                  items: navItems || componentsData.navbar?.items || [],
                  styles: styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : navItems && navStyles ? (
            <Navbar 
              isAdmin={true} 
              isEditing={editingComponent === 'navbar'}
              onStartEdit={() => setEditingComponent('navbar')}
              onClose={closeSidebar}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={navItems}
              savedStyles={navStyles}
              onItemsChange={(items) => {
                console.log('Items changed in Navbar component (fallback):', items);
                setNavItems(items as any);
                handleComponentUpdate('navbar', {
                  items,
                  styles: navStyles
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Navbar component (fallback):', styles);
                setNavStyles(styles as any);
                handleComponentUpdate('navbar', {
                  items: navItems,
                  styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : null}
          
          {componentsData.hero ? (
            <Hero
              isAdmin={true}
              isEditing={editingComponent === 'hero'}
              onStartEdit={() => openSidebar('hero')}
              onCloseSidebar={closeSidebar}
              componentId={Number(componentsData.hero.componentId)}
              useDirectSave={true}
              apiKey={OPENAI_API_KEY}
              savedItems={componentsData.hero.items}
              savedStyles={componentsData.hero.styles}
              onItemsChange={(items) => {
                console.log('Items changed in Hero component:', items);
                // Update individual state - using type assertion to handle type differences
                setHeroItems(items as any);
                
                // Update central state with a complete object
                handleComponentUpdate('hero', {
                  componentId: componentsData.hero?.componentId,
                  items: items,
                  styles: heroStyles || componentsData.hero?.styles || {}
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Hero component:', styles);
                // Update individual state - using type assertion to handle type differences
                setHeroStyles(styles as any);
                
                // Update central state with a complete object
                handleComponentUpdate('hero', {
                  componentId: componentsData.hero?.componentId,
                  items: heroItems || componentsData.hero?.items || [],
                  styles: styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : heroItems && heroStyles ? (
            <Hero
              isAdmin={true}
              isEditing={editingComponent === 'hero'}
              onStartEdit={() => openSidebar('hero')}
              onCloseSidebar={closeSidebar}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={heroItems as any}
              savedStyles={heroStyles as any}
              onItemsChange={(items) => {
                console.log('Items changed in Hero component (fallback):', items);
                setHeroItems(items as any);
                handleComponentUpdate('hero', {
                  items,
                  styles: heroStyles
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Hero component (fallback):', styles);
                setHeroStyles(styles as any);
                handleComponentUpdate('hero', {
                  items: heroItems,
                  styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : null}
    
          {componentsData.collection ? (
            <Collection 
              isAdmin={true}
              isEditing={editingComponent === 'collection'}
              onStartEdit={() => setEditingComponent('collection')}
              onSave={() => {
                // Update the central state with the latest individual component state
                handleComponentUpdate('collection', {
                  items: collectionItems,
                  styles: collectionStyles
                });
                // Save all changes
                handleSave();
              }}
              apiKey={OPENAI_API_KEY}
              savedItems={componentsData.collection.items}
              savedStyles={componentsData.collection.styles}
              onItemsChange={(items) => {
                console.log('Items changed in Collection component:', items);
                // Update individual state - using type assertion to handle type differences
                setCollectionItems(items as any);
                
                // Update central state with a complete object
                handleComponentUpdate('collection', {
                  items: items,
                  styles: collectionStyles || componentsData.collection?.styles || {}
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Collection component:', styles);
                // Update individual state - using type assertion to handle type differences
                setCollectionStyles(styles as any);
                
                // Update central state with a complete object
                handleComponentUpdate('collection', {
                  items: collectionItems || componentsData.collection?.items || [],
                  styles: styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : collectionItems && collectionStyles ? (
            <Collection 
              isAdmin={true}
              isEditing={editingComponent === 'collection'}
              onStartEdit={() => setEditingComponent('collection')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={collectionItems as any}
              savedStyles={collectionStyles as any}
              onItemsChange={(items) => {
                console.log('Items changed in Collection component (fallback):', items);
                setCollectionItems(items as any);
                handleComponentUpdate('collection', {
                  items,
                  styles: collectionStyles
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Collection component (fallback):', styles);
                setCollectionStyles(styles as any);
                handleComponentUpdate('collection', {
                  items: collectionItems,
                  styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : null}

          {componentsData.product ? (
            <Products 
              isAdmin={true}
              isEditing={editingComponent === 'products'}
              onStartEdit={() => setEditingComponent('products')}
              onSave={() => {
                // Update the central state with the latest individual component state
                handleComponentUpdate('product', {
                  items: productItems,
                  styles: productStyles
                });
                // Save all changes
                handleSave();
              }}
              apiKey={OPENAI_API_KEY}
              savedItems={componentsData.product.items}
              savedStyles={componentsData.product.styles}
              onItemsChange={(items) => {
                console.log('Items changed in Products component:', items);
                // Update individual state - using type assertion to handle type differences
                setProductItems(items as any);
                
                // Update central state with a complete object
                handleComponentUpdate('product', {
                  items: items,
                  styles: productStyles || componentsData.product?.styles || {}
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Products component:', styles);
                // Update individual state - using type assertion to handle type differences
                setProductStyles(styles as any);
                
                // Update central state with a complete object
                handleComponentUpdate('product', {
                  items: productItems || componentsData.product?.items || [],
                  styles: styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : productItems && productStyles ? (
            <Products 
              isAdmin={true}
              isEditing={editingComponent === 'products'}
              onStartEdit={() => setEditingComponent('products')}
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedItems={productItems as any}
              savedStyles={productStyles as any}
              onItemsChange={(items) => {
                console.log('Items changed in Products component (fallback):', items);
                setProductItems(items as any);
                handleComponentUpdate('product', {
                  items,
                  styles: productStyles
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Products component (fallback):', styles);
                setProductStyles(styles as any);
                handleComponentUpdate('product', {
                  items: productItems,
                  styles
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : null}
          
          {componentsData.footer ? (
            (() => {
              console.log('Footer component data:', JSON.stringify(componentsData.footer, null, 2));
              return (
            <Footer 
              isEditing={editingComponent === 'footer'}
              onStartEdit={() => openSidebar('footer')}
              onCloseSidebar={closeSidebar}
                  // Pass the component ID for direct saving
                  componentId={componentsData.footer.componentId}
                  useDirectSave={true}
                  apiKey={OPENAI_API_KEY}
                  savedColumns={componentsData.footer.columns}
                  savedStyles={componentsData.footer.styles}
                  savedSocialLinks={componentsData.footer.socialLinks}
                  // We'll still keep these callbacks for state syncing, but the direct save 
                  // approach will bypass the central state when saving to the database
                  onColumnsChange={(columns) => {
                    console.log('Columns changed in Footer component:', columns);
                    setFooterColumns(columns as any);
                  }}
                  onStylesChange={(styles) => {
                    console.log('Styles changed in Footer component:', styles);
                    setFooterStyles(styles as any);
                  }}
                  onSocialLinksChange={(socialLinks) => {
                    console.log('Social links changed in Footer component:', socialLinks);
                    setFooterSocialLinks(socialLinks as any);
                  }}
                  onAIConfigUpdate={handleAIConfigUpdate}
                />
              );
            })()
          ) : footerColumns && footerStyles ? (
            <Footer 
              isEditing={editingComponent === 'footer'}
              onStartEdit={() => openSidebar('footer')}
              onCloseSidebar={closeSidebar}
              // For the fallback case, we don't have a componentId, so we use the traditional approach
              onSave={handleSave}
              apiKey={OPENAI_API_KEY}
              savedColumns={footerColumns}
              savedStyles={footerStyles}
              savedSocialLinks={footerSocialLinks}
              onColumnsChange={(columns) => {
                console.log('Columns changed in Footer component (fallback):', columns);
                setFooterColumns(columns as any);
                handleComponentUpdate('footer', {
                  columns,
                  styles: footerStyles,
                  socialLinks: footerSocialLinks
                });
              }}
              onStylesChange={(styles) => {
                console.log('Styles changed in Footer component (fallback):', styles);
                setFooterStyles(styles as any);
                handleComponentUpdate('footer', {
                  columns: footerColumns,
                  styles,
                  socialLinks: footerSocialLinks
                });
              }}
              onSocialLinksChange={(socialLinks) => {
                console.log('Social links changed in Footer component (fallback):', socialLinks);
                setFooterSocialLinks(socialLinks as any);
                handleComponentUpdate('footer', {
                  columns: footerColumns,
                  styles: footerStyles,
                  socialLinks
                });
              }}
              onAIConfigUpdate={handleAIConfigUpdate}
            />
          ) : null}
        </div>
      </ClientOnly>
    </main>
  );
} 