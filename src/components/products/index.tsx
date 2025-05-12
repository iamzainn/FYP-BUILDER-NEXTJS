'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import ProductsMain from './ProductsMain';
import SidebarProducts from './sidebarProducts';
import { ProductItem, ProductStyles, ProductsProps, WebsiteConfig, defaultProducts, defaultProductStyles } from './types';

export default function Products({
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
}: ProductsProps) {
  const [productItems, setProductItems] = useState<ProductItem[]>(savedItems || defaultProducts);
  const [productStyles, setProductStyles] = useState<ProductStyles>(savedStyles || defaultProductStyles);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  useEffect(() => {
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
      setProductItems(itemsCopy);
    }
    
    if (savedStyles) {
      console.log('Loading savedStyles from props:', JSON.stringify(savedStyles, null, 2));
      
      // Create a deep copy to ensure we're working with fresh objects
      const stylesCopy = JSON.parse(JSON.stringify(savedStyles));
      
      // Set the state with the copy
      setProductStyles(stylesCopy);
    }
  }, [savedItems, savedStyles]);

  const handleSave = () => {
    console.log('Products handleSave called with current state:');
    console.log('Current productItems:', JSON.stringify(productItems, null, 2));
    console.log('Current productStyles:', JSON.stringify(productStyles, null, 2));
    
    try {
      // Deep clone the objects before saving to prevent reference issues
      const itemsToSave = JSON.parse(JSON.stringify(productItems));
      const stylesToSave = JSON.parse(JSON.stringify(productStyles));
      
      // Ensure everything is saved to localStorage for fallback
      localStorage.setItem('productItems', JSON.stringify(itemsToSave));
      localStorage.setItem('productStyles', JSON.stringify(stylesToSave));
      
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
      console.error('Error saving products:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = productItems.findIndex(item => item.id === active.id);
      const newIndex = productItems.findIndex(item => item.id === over.id);
      
      // Create a deep copy of the items array to avoid reference issues
      const newItems = JSON.parse(JSON.stringify(productItems));
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      setProductItems(newItems);
      
      // Notify parent of changes
      if (onItemsChange) {
        console.log('Items reordered, notifying parent:', newItems);
        onItemsChange(newItems);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real application, you would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setProductItems(items => {
        // Create a deep copy of all items to ensure React detects the change
        const updatedItems = JSON.parse(JSON.stringify(items));
        
        const itemIndex = updatedItems.findIndex((item: ProductItem) => item.id === itemId);
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

  const updateProductDetails = (itemId: string, field: keyof ProductItem, value: any) => {
    setProductItems(items => {
      // Create a deep copy of all items to ensure React detects the change
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      const itemIndex = updatedItems.findIndex((item: ProductItem) => item.id === itemId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex][field] = value;
      }
      
      // Notify parent of changes
      if (onItemsChange) {
        console.log(`Product detail "${field}" updated, notifying parent:`, updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  const updateProductStyle = (itemId: string, styleKey: string, value: string | boolean) => {
    setProductItems(items => {
      // Create a deep copy of all items to ensure React detects the change
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      const itemIndex = updatedItems.findIndex((item: ProductItem) => item.id === itemId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex].styles[styleKey] = value;
      }
      
      // Notify parent of changes
      if (onItemsChange) {
        console.log(`Product style "${styleKey}" updated, notifying parent:`, updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  const updateAllProductsStyle = (styleKey: string, value: string | boolean) => {
    setProductItems(items => {
      // Create a deep copy of all items to ensure React detects the change
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      // Update the style for all items
      updatedItems.forEach((item: ProductItem) => {
        item.styles[styleKey] = value;
      });
      
      // Notify parent of changes
      if (onItemsChange) {
        console.log(`All products style "${styleKey}" updated, notifying parent:`, updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  const deleteProduct = (itemId: string) => {
    // Don't allow deleting if there are only 1 or 2 products left
    if (productItems.length <= 2) {
      console.log('Cannot delete - minimum 2 products required');
      return;
    }
    
    setProductItems(items => {
      // Create a deep copy of all items except the one to delete
      const updatedItems = JSON.parse(JSON.stringify(items)).filter(
        (item: ProductItem) => item.id !== itemId
      );
      
      // Notify parent of changes
      if (onItemsChange) {
        console.log(`Product deleted, notifying parent:`, updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
    
    setSelectedItem(null);
  };

  // Handle AI config update
  const handleAIConfigUpdate = useCallback((newConfig: WebsiteConfig) => {
    console.log('AI config update in Products:', newConfig);
    
    if (newConfig?.productsConfig) {
      // Deep clone the product items and styles to avoid reference issues
      const newItems = JSON.parse(JSON.stringify(newConfig.productsConfig.items || []));
      const newStyles = JSON.parse(JSON.stringify(newConfig.productsConfig.styles || {}));
      
      // Log the updated product config
      console.log('Updating products from AI config:', { items: newItems, styles: newStyles });
      
      // Update local state
      setProductItems(newItems);
      setProductStyles(newStyles);
      
      // Save to localStorage with deep clones to prevent reference issues
      localStorage.setItem('productItems', JSON.stringify(newItems));
      localStorage.setItem('productStyles', JSON.stringify(newStyles));
      
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
    // Create a deep copy of the current styles
    const updatedStyles = JSON.parse(JSON.stringify(productStyles));
    
    // Update the style using type assertion to avoid TypeScript error
    (updatedStyles as any)[styleKey] = value;
    
    // Special handling for background color and gradient colors to ensure consistent state
    if (styleKey === 'backgroundColor' || styleKey === 'gradientStart' || styleKey === 'gradientEnd') {
      // Make sure the background type is set appropriately
      if (styleKey === 'backgroundColor') {
        (updatedStyles as any).backgroundType = 'color';
      } else {
        (updatedStyles as any).backgroundType = 'gradient';
      }
      
      console.log(`Color style "${styleKey}" updated to ${value}. Setting backgroundType to ${(updatedStyles as any).backgroundType}`);
    }
    
    // Set the updated styles in state
    setProductStyles(updatedStyles);
    
    // Notify parent of changes
    if (onStylesChange) {
      console.log(`Global style "${styleKey}" updated, notifying parent:`, updatedStyles);
      onStylesChange(updatedStyles);
    }
  };

  return (
    <>
      <div
        className={`${isAdmin && !isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''} ${isEditing ? 'lg:mr-80 md:mr-64' : ''}`}
        onClick={() => isAdmin && !isEditing && onStartEdit?.()}
      >
        <ProductsMain
          productItems={productItems}
          productStyles={productStyles}
          isEditing={isEditing}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onDragEnd={handleDragEnd}
          onImageUpload={handleImageUpload}
          isMobile={isMobile}
        />
      </div>
      
      {isAdmin && !isEditing && (
        <button
          onClick={onStartEdit}
          className="fixed bottom-24 right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
          title="Edit Products"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      
      {/* Add the SidebarProducts component */}
      <SidebarProducts
        isEditing={isEditing}
        selectedItem={selectedItem}
        productItems={productItems}
        productStyles={productStyles}
        handleSave={handleSave}
        addNewProduct={() => {}} // Placeholder empty function since we're removing this feature
        updateProductDetails={updateProductDetails}
        updateProductStyle={updateProductStyle}
        updateAllProductsStyle={updateAllProductsStyle}
        updateGlobalStyle={updateGlobalStyle}
        deleteProduct={deleteProduct}
        apiKey={apiKey}
        handleAIConfigUpdate={handleAIConfigUpdate}
        onItemsChange={items => {
          // Create a deep copy to prevent reference issues
          const itemsCopy = JSON.parse(JSON.stringify(items));
          setProductItems(itemsCopy);
        }}
        onStylesChange={styles => {
          // Create a deep copy to prevent reference issues
          const stylesCopy = JSON.parse(JSON.stringify(styles));
          setProductStyles(stylesCopy);
        }}
        onCloseSidebar={onCloseSidebar}
      />
    </>
  );
}

// Re-export types and utility functions
export * from './types'; 