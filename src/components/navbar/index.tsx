'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState, useEffect } from 'react';

// Import sub-components
import NavbarMain from './NavbarMain';
import NavbarEditor from './NavbarEditor';
import { NavItem, NavbarStyles, defaultNavItems, defaultNavStyles, WebsiteConfig } from './types';

interface NavbarProps {
  isEditing?: boolean;
  onSave?: () => void;
  apiKey?: string;
  isAdmin?: boolean;
  savedItems?: NavItem[] | null;
  savedStyles?: NavbarStyles | null;
  onItemsChange?: (items: NavItem[]) => void;
  onStylesChange?: (styles: NavbarStyles) => void;
  onAIConfigUpdate?: (newConfig: WebsiteConfig) => void;
  onClose?: () => void;
  onStartEdit?: () => void;
}

export default function Navbar({
  isEditing = false,
  onSave,
  apiKey,
  savedItems = null,
  savedStyles = null,
  onItemsChange,
  onStylesChange,
  onAIConfigUpdate,
  onClose,
}: NavbarProps) {
  // State for navbar items and styles
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [navStyles, setNavStyles] = useState<NavbarStyles>(defaultNavStyles);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Load saved settings
  useEffect(() => {
    if (savedItems && savedItems.length > 0) {
      console.log('Loading savedItems from props:', JSON.stringify(savedItems, null, 2));
      const itemsCopy = JSON.parse(JSON.stringify(savedItems));
      setNavItems(itemsCopy);
    }
    
    if (savedStyles) {
      console.log('Loading savedStyles from props:', JSON.stringify(savedStyles, null, 2));
      const stylesCopy = JSON.parse(JSON.stringify(savedStyles));
      if (!stylesCopy.boxShadow) {
        stylesCopy.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }
      setNavStyles(stylesCopy);
    }
  }, [savedItems, savedStyles]);

  // Hide tooltip after a few seconds
  useEffect(() => {
    if (isEditing && showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 6000); // Hide after 6 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isEditing, showTooltip]);

  // Save settings
  const handleSave = () => {
    console.log('Navbar handleSave called with current state:');
    setIsSaving(true);
    
    try {
      // Deep clone the objects before saving to prevent reference issues
      const itemsToSave = JSON.parse(JSON.stringify(navItems));
      const stylesToSave = JSON.parse(JSON.stringify(navStyles));
      
      // Ensure everything is saved to localStorage for fallback
      localStorage.setItem('navItems', JSON.stringify(itemsToSave));
      localStorage.setItem('navStyles', JSON.stringify(stylesToSave));
      
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
      setSelectedItem(null);
      if (onSave) {
        console.log('Calling parent onSave function');
        onSave();
      }
    } catch (error) {
      console.error('Error saving navbar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new item
  const addNewItem = (type: 'link' | 'image' | 'text', position: 'left' | 'center' | 'right' | 'nav' = 'nav') => {
    const newId = String(navItems.length + 1);
    const newItem: NavItem = {
      id: newId,
      type,
      label: type === 'link' ? 'New Link' : type === 'image' ? 'New Image' : 'New Text',
      link: type === 'link' ? '/' : '',
      position,
      styles: {
        color: '',
        fontSize: '16px',
        fontFamily: '',
        backgroundColor: 'transparent',
        padding: '0.5rem',
        marginTop: '0px',
        width: type === 'image' ? '40px' : undefined,
        height: type === 'image' ? '40px' : undefined,
        borderRadius: type === 'image' ? '0px' : undefined,
        borderWidth: type === 'image' ? '0px' : undefined,
        borderColor: type === 'image' ? '#000000' : undefined,
        borderStyle: type === 'image' ? 'solid' : undefined,
        objectFit: type === 'image' ? 'contain' : undefined,
        alignSelf: type === 'image' ? 'center' : undefined
      },
      imageUrl: type === 'image' ? '/vercel.svg' : undefined,
    };
    const newItems = [...navItems, newItem];
    setNavItems(newItems);
    setSelectedItem(newId);
    
    // Notify parent component of changes if callback provided
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right' | 'nav') => {
    setNavItems(items => {
      const updatedItems = items.map(item =>
        item.id === itemId
          ? { ...item, position }
          : item
      );
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    console.log(`Updating style for item ${itemId}, key ${styleKey} to value ${value}`);
    
    setNavItems(prevItems => {
      // Create a deep copy of all items to ensure React detects the change
      const updatedItems = JSON.parse(JSON.stringify(prevItems));
      
      // Find the item to update
      const itemIndex = updatedItems.findIndex((item: NavItem) => item.id === itemId);
      if (itemIndex === -1) return prevItems; // Item not found
      
      // Get the item to update
      const itemToUpdate = updatedItems[itemIndex];
      
      // Special handling for hover properties
      if (styleKey.startsWith('hover.')) {
        const hoverKey = styleKey.split('.')[1];
        if (!itemToUpdate.styles.hover) {
          itemToUpdate.styles.hover = {};
        }
        // Update the hover property
        (itemToUpdate.styles.hover as Record<string, string>)[hoverKey] = value;
      } else {
        // Update the regular style property
        (itemToUpdate.styles as Record<string, any>)[styleKey] = value;
      }
      
      // Explicitly log the updated item to verify changes
      console.log(`Updated item ${itemId} style:`, itemToUpdate.styles);
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        console.log('Notifying parent of item style change:', updatedItems);
        // Make sure we're passing a fresh copy
        onItemsChange([...updatedItems]);
      }
      
      return updatedItems;
    });
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'label' | 'link', value: string) => {
    setNavItems(items => {
      const updatedItems = items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      );
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setNavItems(items => {
      const updatedItems = items.filter(item => item.id !== itemId);
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
    setSelectedItem(null);
  };

  // Add this function to handle AI config updates
  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    console.log('handleAIConfigUpdate called with config:', JSON.stringify(newConfig, null, 2));
    
    // Only process if we have a navbar configuration
    if (newConfig.navbarConfig) {
      console.log('Processing navbar config update from AI:', JSON.stringify(newConfig.navbarConfig, null, 2));
      
      let hasChanges = false;
      
      // Update items if provided
      if (newConfig.navbarConfig.items && newConfig.navbarConfig.items.length > 0) {
        console.log('Updating navbar items from AI:', JSON.stringify(newConfig.navbarConfig.items, null, 2));
        
        // Create deep copy of items to ensure React state updates properly
        const deepCopiedItems = JSON.parse(JSON.stringify(newConfig.navbarConfig.items));
        
        // Update local state
        setNavItems(deepCopiedItems);
        hasChanges = true;
        
        // Notify parent component immediately
        if (onItemsChange) {
          console.log('Notifying parent of AI-generated item changes');
          onItemsChange(deepCopiedItems);
        }
      }
      
      // Update styles if provided
      if (newConfig.navbarConfig.styles) {
        console.log('Updating navbar styles from AI:', JSON.stringify(newConfig.navbarConfig.styles, null, 2));
        
        // Create deep copy of styles
        const deepCopiedStyles = JSON.parse(JSON.stringify(newConfig.navbarConfig.styles));
        
        // Ensure boxShadow property exists
        if (!deepCopiedStyles.boxShadow) {
          deepCopiedStyles.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
        
        // Update local state
        setNavStyles(deepCopiedStyles);
        hasChanges = true;
        
        // Notify parent component immediately
        if (onStylesChange) {
          console.log('Notifying parent of AI-generated style changes');
          onStylesChange(deepCopiedStyles);
        }
      }
      
      // If we've made changes, simulate a save to ensure changes are persisted
      if (hasChanges) {
        // Save to localStorage as a backup
        localStorage.setItem('navItems', JSON.stringify(navItems));
        localStorage.setItem('navStyles', JSON.stringify(navStyles));
        
        console.log('AI-generated changes have been applied and saved locally');
      }
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    if (!isEditing) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // Update item image URL
  const updateItemImage = (itemId: string, imageUrl: string) => {
    console.log(`Updating image for item ${itemId} to ${imageUrl}`);
    
    setNavItems(items => {
      const updatedItems = items.map(item =>
        item.id === itemId
          ? { ...item, imageUrl }
          : item
      );
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Add function to remove an image
  const removeItemImage = (itemId: string) => {
    console.log(`Removing image for item ${itemId}`);
    
    setNavItems(items => {
      const updatedItems = items.map(item =>
        item.id === itemId
          ? { ...item, imageUrl: '/vercel.svg' }  // Reset to default image
          : item
      );
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Update global style property
  const updateGlobalStyle = (styleKey: keyof NavbarStyles, value: string) => {
    console.log(`Updating global style ${styleKey} to ${value}`);
    
    setNavStyles(prevStyles => {
      // Create a deep copy to ensure change detection
      const updatedStyles = JSON.parse(JSON.stringify(prevStyles));
      
      // Update the specific style property
      updatedStyles[styleKey] = value;
      
      // Log the updated styles for debugging
      console.log('Updated global styles:', updatedStyles);
      
      // Notify parent component of changes if callback provided
      if (onStylesChange) {
        console.log('Notifying parent of global style change:', updatedStyles);
        onStylesChange(updatedStyles);
      }
      
      return updatedStyles;
    });
  };

  // Group items by position
  const leftItems = navItems.filter(item => item.position === 'left');
  const navLinksItems = navItems.filter(item => item.position === 'nav');
  const rightItems = navItems.filter(item => item.position === 'right');

  return (
    <>
      {/* Render the main navbar */}
      <NavbarMain
        navStyles={navStyles}
        leftItems={leftItems}
        navLinksItems={navLinksItems}
        rightItems={rightItems}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        isEditing={isEditing}
        // @ts-ignore - Handling type compatibility issues
        setSelectedItem={setSelectedItem}
      />

      {/* Render the editor sidebar if in editing mode */}
      {isEditing && (
        // @ts-ignore - Ignore type errors for the NavbarEditor component props
        <NavbarEditor
          navItems={navItems}
          navStyles={navStyles}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          isSaving={isSaving}
          onSave={handleSave}
          onClose={onClose}
          addNewItem={addNewItem}
          updateItemPosition={updateItemPosition}
          updateItemStyle={updateItemStyle}
          updateItemText={updateItemText}
          deleteItem={deleteItem}
          updateGlobalStyle={updateGlobalStyle}
          updateItemImage={updateItemImage}
          removeItemImage={removeItemImage}
          apiKey={apiKey}
          onAIConfigUpdate={onAIConfigUpdate ? 
            // @ts-ignore - Force compatibility between different WebsiteConfig interfaces
            (newConfig: any) => onAIConfigUpdate(newConfig as any) : 
            handleAIConfigUpdate}
        />
      )}
    </>
  );
}

// Re-export types and components
export * from './types';
export { NavbarMain, NavbarEditor }; 