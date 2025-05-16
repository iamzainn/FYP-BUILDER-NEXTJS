'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unknown-property */

import { useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import { useParams} from 'next/navigation';
import { NavItem, NavbarStyles, HeroItem, HeroStyles, CollectionItem, CollectionStyles, ProductItem, ProductStyles, FooterColumn, FooterStyles, SocialLink } from '@/types/websiteConfig';
import { pageService, Page } from '@/services/pageService';


const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

// Dynamically import components with ssr:false to prevent them from loading during server-side rendering
const Navbar = dynamic(() => import('../../../components/navbar'), { ssr: false });
const Hero = dynamic(() => import('../../../components/hero'), { ssr: false });
const Collection = dynamic(() => import('@/components/Collection'), { 
  // @ts-ignore - Ignoring type errors for Collection component
  ssr: false 
});
const Products = dynamic(() => import('@/components/Products'), { 
  // @ts-ignore - Ignoring type errors for Products component
  ssr: false 
});

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

  const storeName = params?.storeName as string;
  
  const [editingComponent, setEditingComponent] = useState<EditableComponent>(null);
 
  
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
  
  
  // Function to close any open sidebar
  const closeSidebar = () => {
    console.log(isSaving,errorMessage);
    
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
  }, [storeName]);

 

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
              <p className="text-lg text-gray-700">Loading your website ...</p>
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
            // @ts-ignore - Complete ignore for Collection component
            <Collection 
              {...{
                isAdmin: false,
                isEditing: editingComponent === 'collection',
                onCloseSidebar: closeSidebar,
                onSave: () => {
                  // Update the central state with the latest individual component state
                  handleComponentUpdate('collection', {
                    items: collectionItems,
                    styles: collectionStyles
                  });
                  // Save all changes
                  handleSave();
                },
                apiKey: OPENAI_API_KEY,
                savedItems: componentsData.collection.items,
                savedStyles: componentsData.collection.styles,
                onItemsChange: (items: any) => {
                  console.log('Items changed in Collection component:', items);
                  // Update individual state - using type assertion to handle type differences
                  setCollectionItems(items as any);
                  
                  // Update central state with a complete object
                  handleComponentUpdate('collection', {
                    items: items,
                    styles: collectionStyles || componentsData.collection?.styles || {}
                  });
                },
                onStylesChange: (styles: any) => {
                  console.log('Styles changed in Collection component:', styles);
                  // Update individual state - using type assertion to handle type differences
                  setCollectionStyles(styles as any);
                  
                  // Update central state with a complete object
                  handleComponentUpdate('collection', {
                    items: collectionItems || componentsData.collection?.items || [],
                    styles: styles
                  });
                },
                onAIConfigUpdate: handleAIConfigUpdate
              }}
            />
          ) : collectionItems && collectionStyles ? (
            // @ts-ignore - Complete ignore for Collection component
            <Collection 
              {...{
                isAdmin: false,
                isEditing: editingComponent === 'collection',
                onCloseSidebar: closeSidebar,
                onSave: handleSave,
                apiKey: OPENAI_API_KEY,
                savedItems: collectionItems,
                savedStyles: collectionStyles,
                onItemsChange: (items: any) => {
                  console.log('Items changed in Collection component (fallback):', items);
                  setCollectionItems(items as any);
                  handleComponentUpdate('collection', {
                    items,
                    styles: collectionStyles
                  });
                },
                onStylesChange: (styles: any) => {
                  console.log('Styles changed in Collection component (fallback):', styles);
                  setCollectionStyles(styles as any);
                  handleComponentUpdate('collection', {
                    items: collectionItems,
                    styles
                  });
                },
                onAIConfigUpdate: handleAIConfigUpdate
              }}
            />
          ) : null}

          {componentsData.product ? (
            // @ts-ignore - Complete ignore for Products component
            <Products 
              {...{
                isAdmin: false,
                isEditing: editingComponent === 'products',
                onCloseSidebar: closeSidebar,
                onSave: () => {
                  // Update the central state with the latest individual component state
                  handleComponentUpdate('product', {
                    items: productItems,
                    styles: productStyles
                  });
                  // Save all changes
                  handleSave();
                },
                apiKey: OPENAI_API_KEY,
                savedItems: componentsData.product.items,
                savedStyles: componentsData.product.styles,
                onItemsChange: (items: any) => {
                  console.log('Items changed in Products component:', items);
                  // Update individual state - using type assertion to handle type differences
                  setProductItems(items as any);
                  
                  // Update central state with a complete object
                  handleComponentUpdate('product', {
                    items: items,
                    styles: productStyles || componentsData.product?.styles || {}
                  });
                },
                onStylesChange: (styles: any) => {
                  console.log('Styles changed in Products component:', styles);
                  // Update individual state - using type assertion to handle type differences
                  setProductStyles(styles as any);
                  
                  // Update central state with a complete object
                  handleComponentUpdate('product', {
                    items: productItems || componentsData.product?.items || [],
                    styles: styles
                  });
                },
                onAIConfigUpdate: handleAIConfigUpdate
              }}
            />
          ) : productItems && productStyles ? (
            // @ts-ignore - Complete ignore for Products component
            <Products 
              {...{
                isAdmin: false,
                isEditing: editingComponent === 'products',
                onCloseSidebar: closeSidebar,
                onSave: handleSave,
                apiKey: OPENAI_API_KEY,
                savedItems: productItems,
                savedStyles: productStyles,
                onItemsChange: (items: any) => {
                  console.log('Items changed in Products component (fallback):', items);
                  setProductItems(items as any);
                  handleComponentUpdate('product', {
                    items,
                    styles: productStyles
                  });
                },
                onStylesChange: (styles: any) => {
                  console.log('Styles changed in Products component (fallback):', styles);
                  setProductStyles(styles as any);
                  handleComponentUpdate('product', {
                    items: productItems,
                    styles
                  });
                },
                onAIConfigUpdate: handleAIConfigUpdate
              }}
            />
          ) : null}
          
          {componentsData.footer ? (
            (() => {
              console.log('Footer component data:', JSON.stringify(componentsData.footer, null, 2));
              return (
            <Footer 
              isEditing={editingComponent === 'footer'}
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