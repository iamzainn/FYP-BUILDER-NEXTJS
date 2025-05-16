'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useCallback } from 'react';
import CollectionMain from './CollectionMain';
import SidebarCollection from './sidebarCollection';
import { CollectionItem, CollectionStyles, CollectionProps, WebsiteConfig, defaultCollectionItems, defaultCollectionStyles } from './types';

// @ts-ignore - Fix for prop type mismatch
export default function Collection({
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onCloseSidebar,
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey,
  onItemsChange,
  onStylesChange,
  onAIConfigUpdate
}: CollectionProps & { onCloseSidebar?: () => void }) {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(savedItems || defaultCollectionItems);
  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles>(savedStyles || defaultCollectionStyles);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('Collection component mounted',isMobile);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved settings when props change
  useEffect(() => {
    // Only update if props have actually changed and are not empty
    if (savedItems && savedItems.length > 0) {
      console.log('Loading savedItems from props:', JSON.stringify(savedItems, null, 2));
      
      // Create a deep copy to ensure we're working with fresh objects
      const itemsCopy = JSON.parse(JSON.stringify(savedItems));
      
      // Set the state with the copy
      setCollectionItems(itemsCopy);
    }
    
    if (savedStyles) {
      console.log('Loading savedStyles from props:', JSON.stringify(savedStyles, null, 2));
      
      // Create a deep copy to ensure we're working with fresh objects
      const stylesCopy = JSON.parse(JSON.stringify(savedStyles));
      
      // If we have a backgroundColor but no gradient, create a gradient from it
      if (stylesCopy.backgroundColor && !stylesCopy.backgroundType) {
        const color = stylesCopy.backgroundColor;
        // Create a lighter version for gradient start
        const lighterColor = adjustColor(color, 20);
        // Create a darker version for gradient end
        const darkerColor = adjustColor(color, -20);
        
        stylesCopy.backgroundType = 'gradient';
        stylesCopy.gradientStart = lighterColor;
        stylesCopy.gradientEnd = darkerColor;
        stylesCopy.gradientDirection = 'to right';
      }
      
      // Set the state with the copy
      setCollectionStyles(stylesCopy);
    }
  }, [savedItems, savedStyles]);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, percent: number) => {
    // Remove the hash if it exists
    color = color.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Adjust each channel
    const adjustChannel = (channel: number) => {
      const adjusted = Math.round(channel * (1 + percent / 100));
      return Math.min(255, Math.max(0, adjusted));
    };
    
    const newR = adjustChannel(r);
    const newG = adjustChannel(g);
    const newB = adjustChannel(b);
    
    // Convert back to hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  };

  const updateAllItemsStyle = (styleKey: string, value: string) => {
    setCollectionItems(items => {
      const updatedItems = items.map(item => ({
        ...item,
        styles: { ...item.styles, [styleKey]: value }
      }));
      
      // Notify parent of changes
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  const handleSave = () => {
    console.log('Collection handleSave called with current state:');
    console.log('Current collectionItems:', JSON.stringify(collectionItems, null, 2));
    console.log('Current collectionStyles:', JSON.stringify(collectionStyles, null, 2));
    
    try {
      // Deep clone the objects before saving to prevent reference issues
      const itemsToSave = JSON.parse(JSON.stringify(collectionItems));
      const stylesToSave = JSON.parse(JSON.stringify(collectionStyles));
      
      // Ensure everything is saved to localStorage for fallback
      localStorage.setItem('collectionItems', JSON.stringify(itemsToSave));
      localStorage.setItem('collectionStyles', JSON.stringify(stylesToSave));
      
      // Notify parent component of changes if callbacks provided
      if (onItemsChange) {
        console.log('Sending final items to parent in handleSave:', itemsToSave);
        onItemsChange(itemsToSave);
      }
      
      if (onStylesChange) {
        console.log('Sending final styles to parent in handleSave:', stylesToSave);
        onStylesChange(stylesToSave);
      }
      
      // Clear selection and notify parent save is complete
      if (onSave) {
        console.log('Calling parent onSave function');
        onSave();
      }
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleItemsReorder = (newItems: CollectionItem[]) => {
    setCollectionItems(newItems);
    
    // Notify parent of changes
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real application, you would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setCollectionItems(items => {
        // Create a deep copy of all items to ensure React detects the change
        const updatedItems = JSON.parse(JSON.stringify(items));
        
        const itemIndex = updatedItems.findIndex((item: CollectionItem) => item.id === itemId);
        if (itemIndex !== -1) {
          updatedItems[itemIndex].imageUrl = imageUrl;
        }
        
        // Notify parent of changes
        if (onItemsChange) {
          console.log('Notifying parent of image update:', updatedItems);
          onItemsChange(updatedItems);
        }
        
        return updatedItems;
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Handle AI config update
  const handleAIConfigUpdate = useCallback((newConfig: WebsiteConfig) => {
    console.log('AI config update in Collection:', newConfig);
    
    if ((newConfig as any)?.collectionConfig) {
      // Deep clone the collection items and styles to avoid reference issues
      const newItems = JSON.parse(JSON.stringify((newConfig as any).collectionConfig.items || []));
      const newStyles = JSON.parse(JSON.stringify((newConfig as any).collectionConfig.styles || {}));
      
      // Log the updated collection config
      console.log('Updating collection from AI config:', { items: newItems, styles: newStyles });
      
      // Update local state
      setCollectionItems(newItems);
      setCollectionStyles(newStyles);
      
      // Save to localStorage with deep clones to prevent reference issues
      localStorage.setItem('collectionItems', JSON.stringify(newItems));
      localStorage.setItem('collectionStyles', JSON.stringify(newStyles));
      
      // Notify parent component if callback exists
      if (onItemsChange) {
        onItemsChange(JSON.parse(JSON.stringify(newItems)));
      }
      
      if (onStylesChange) {
        onStylesChange(JSON.parse(JSON.stringify(newStyles)));
      }
      
      // Propagate the full config update to parent components if callback exists
      if (onAIConfigUpdate) {
        onAIConfigUpdate(JSON.parse(JSON.stringify(newConfig)));
      }
    }
  }, [onItemsChange, onStylesChange, onAIConfigUpdate]);

  const updateGlobalStyle = (styleKey: string, value: string | number | Record<string, string>) => {
    const updatedStyles = {
      ...collectionStyles,
      [styleKey]: value
    };
    
    setCollectionStyles(updatedStyles);
    
    // Notify parent of changes
    if (onStylesChange) {
      onStylesChange(updatedStyles);
    }
  };

  return (
    <>
      <div
        className={`${isAdmin && !isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''} ${isEditing ? 'lg:mr-80 md:mr-64' : ''}`}
        onClick={() => isAdmin && !isEditing && onStartEdit?.()}
      >
        <CollectionMain
          collectionItems={collectionItems}
          collectionStyles={collectionStyles}
          isEditing={isEditing}
          isSelected={!!selectedItem}
          onSelect={() => setSelectedItem(collectionItems[0]?.id)}
          onItemsReorder={handleItemsReorder}
          onImageUpload={handleImageUpload}
        />
      </div>
      
      {isAdmin && !isEditing && (
        <button
          onClick={onStartEdit}
          className="fixed bottom-24 right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
          title="Edit Collection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      
      {/* Add the SidebarCollection component */}
      {isEditing && (
        <SidebarCollection
          isEditing={isEditing}
          collectionItems={collectionItems}
          collectionStyles={collectionStyles}
          handleSave={handleSave}
          updateGlobalStyle={updateGlobalStyle}
          updateAllItemsStyle={updateAllItemsStyle}
          apiKey={apiKey}
          handleAIConfigUpdate={handleAIConfigUpdate}
          onItemsChange={onItemsChange}
          onStylesChange={onStylesChange}
          // @ts-ignore - Handling potentially undefined prop
          onCloseSidebar={onCloseSidebar}
        />
      )}
    </>
  );
}

// Re-export types and utility functions
export * from './types'; 