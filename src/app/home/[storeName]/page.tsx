'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { pageService } from '@/services/pageService';
import { NavItem, NavbarStyles, HeroItem, HeroStyles, CollectionItem, CollectionStyles, ProductItem, ProductStyles, FooterColumn, FooterStyles, SocialLink } from '@/types/websiteConfig';

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

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const storeName = params?.storeName as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [componentsData, setComponentsData] = useState<ComponentsData>({});

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
          setComponentsData(homePage.components || {});
          console.log('Home page data loaded successfully');
        } else {
          setErrorMessage(`Could not find a homepage for store: ${storeName}`);
        }
      } catch (error) {
        console.error('Error fetching website data:', error);
        setErrorMessage('Error loading website. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeName]);

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
    
        {/* Edit Button - Fixed position in bottom right */}
        <Link
          href={`/edit/${storeName}`}
          className="fixed bottom-8 right-8 z-40 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
          title="Edit Website"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-medium">Edit Website</span>
        </Link>
        
        {/* Content section with flex-grow to push footer to bottom */}
        <div className="flex-grow">
          {/* Navbar Component */}
          {componentsData.navbar && (
            <Navbar 
              savedItems={componentsData.navbar.items}
              savedStyles={componentsData.navbar.styles}
            />
          )}
          
          {/* Hero Component */}
          {componentsData.hero && (
            <Hero
              savedItems={componentsData.hero.items}
              savedStyles={componentsData.hero.styles}
            />
          )}
      
          {/* Collection Component */}
          {componentsData.collection && (
            <Collection 
              savedItems={componentsData.collection.items}
              savedStyles={componentsData.collection.styles}
            />
          )}

          {/* Products Component */}
          {componentsData.product && (
            <Products 
              savedItems={componentsData.product.items}
              savedStyles={componentsData.product.styles}
            />
          )}
        </div>
        
        {/* Footer Component */}
        {componentsData.footer && (
          <Footer 
            savedColumns={componentsData.footer.columns}
            savedStyles={componentsData.footer.styles}
            savedSocialLinks={componentsData.footer.socialLinks}
          />
        )}
      </ClientOnly>
    </main>
  );
}