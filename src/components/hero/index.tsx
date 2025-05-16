'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';

import HeroMain from './HeroMain';
import HeroSidebar from './sidebar';
import { HeroItem, HeroStyles, HeroProps,  defaultHeroItems, defaultHeroStyles } from './types';

export default function Hero({ 
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
  onAIConfigUpdate,
  componentId,
  useDirectSave = false
}: HeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hero items state
  const [heroItems, setHeroItems] = useState<HeroItem[]>(savedItems || defaultHeroItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles>(savedStyles || defaultHeroStyles);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Load saved settings when props change
  useEffect(() => {
    // Only update if props have actually changed and are not empty
    if (savedItems && savedItems.length > 0) {
      console.log('Loading savedItems from props:', JSON.stringify(savedItems, null, 2));
      
      // Create a deep copy to ensure we're working with fresh objects
      const itemsCopy = JSON.parse(JSON.stringify(savedItems));
      
      // Set the state with the copy
      setHeroItems(itemsCopy);
    }
    
    if (savedStyles) {
      console.log('Loading savedStyles from props:', JSON.stringify(savedStyles, null, 2));
      
      // Create a deep copy to ensure we're working with fresh objects
      const stylesCopy = JSON.parse(JSON.stringify(savedStyles));
      
      // Set the state with the copy
      setHeroStyles(stylesCopy);
    }
  }, [savedItems, savedStyles]);

  // Add function to close the editing sidebar
  const handleCloseEditMode = () => {
    if (onCloseSidebar) {
      console.log("Closing Hero editing sidebar using onCloseSidebar");
      onCloseSidebar();
    } else if (onStartEdit) {
      console.log("Closing Hero editing sidebar using onStartEdit (legacy method)");
      // Fallback to the old method if onCloseSidebar is not provided
      onStartEdit();
    } else {
      console.warn("No close method provided to Hero component");
    }
  };

  // Add function to handle changes from AI
 

  // Add direct save function
  const handleDirectSave = async () => {
    if (!componentId) {
      console.error("Cannot perform direct save: Missing componentId");
      return;
    }

    console.log("Starting direct save operation for Hero component...");
    console.log("Component ID:", componentId);
    
    setIsSaving(true);
    
    try {
      // Deep clone the current state to avoid any reference issues
      const clonedItems = JSON.parse(JSON.stringify(heroItems));
      const clonedStyles = JSON.parse(JSON.stringify(heroStyles));
      
      // Create the content object in the expected format
      const content = {
        items: clonedItems,
        styles: clonedStyles
      };
      
      console.log("Preparing Hero API payload:", JSON.stringify(content, null, 2));
      
      const endpoint = `/api/components/${componentId}`;
      console.log("API endpoint:", endpoint);
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        console.error("API Error:", { 
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        alert("Failed to save changes. Please try again.");
        return;
      }
      
      // Try to parse response, but don't fail if it's not valid JSON
      const responseData = await response.json().catch(() => ({}));
      console.log("Hero save successful:", responseData);
      
      // Update local storage as a backup
      localStorage.setItem('heroItems', JSON.stringify(clonedItems));
      localStorage.setItem('heroStyles', JSON.stringify(clonedStyles));
      
      // Auto-close sidebar after successful save
      handleCloseEditMode();
    } catch (error) {
      console.error("Hero save failed with exception:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update the existing handleSave function to use the direct approach when specified
  const handleSave = () => {
    console.log("Hero handleSave called with:", { useDirectSave, componentId });
    
    if (useDirectSave && componentId) {
      console.log("Using direct save mode for Hero");
      handleDirectSave();
      return;
    }
    
    // Traditional save method (localStorage + parent notification)
    console.log("Using traditional save method for Hero");
    localStorage.setItem('heroItems', JSON.stringify(heroItems));
    localStorage.setItem('heroStyles', JSON.stringify(heroStyles));
    
    // Notify parent component of changes if callbacks provided
    if (onItemsChange) {
      console.log('Sending final items to parent in handleSave:', heroItems);
      onItemsChange(heroItems);
    }
    
    if (onStylesChange) {
      console.log('Sending final styles to parent in handleSave:', heroStyles);
      onStylesChange(heroStyles);
    }
    
    // Clear selection and notify parent save is complete
    setSelectedItem(null);
    onSave?.();
  };

  // Add new item
  const addNewItem = (type: 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph', position: 'left' | 'center' | 'right' = 'left') => {
    const newId = `${type}${heroItems.length + 1}`;
    
    let newItem: HeroItem = {
      id: newId,
      type,
      content: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position,
      styles: {
        color: type === 'button' ? '#ffffff' : '',
        fontSize: type === 'heading' ? '36px' : type === 'subheading' ? '24px' : '16px',
        fontFamily: '',
        fontWeight: type === 'heading' ? '700' : type === 'subheading' ? '600' : '400',
        backgroundColor: type === 'button' ? '#2563eb' : 'transparent',
        padding: type === 'button' ? '1rem 2rem' : '0',
        margin: '0 0 1rem 0',
        textAlign: 'left',
        textTransform: type === 'button' ? 'uppercase' : 'none',
        letterSpacing: type === 'button' ? '1px' : '0',
        lineHeight: '1.2',
        opacity: '1',
        zIndex: '1',
        position: 'relative',
        top: '0',
        left: '0'
      }
    };

    // Add specific styles based on type
    switch (type) {
      case 'button':
        newItem.link = '/shop';
        newItem.styles = {
          ...newItem.styles,
          borderRadius: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          fontWeight: '600',
          backgroundColor: 'rgba(37, 99, 235, 0.9)',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '1rem 2rem',
          position: 'relative',
          zIndex: '10'
        };
        break;
      case 'badge':
        newItem.styles = {
          ...newItem.styles,
          backgroundColor: '#ff4500',
          color: '#ffffff',
          padding: '0.25rem 1rem',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '14px',
          fontWeight: '600'
        };
        break;
      case 'image':
        newItem = {
          ...newItem,
          imageUrl: '',
          styles: {
            ...newItem.styles,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
            borderWidth: '0',
            borderColor: '#000000',
            borderStyle: 'solid',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          }
        };
        break;
      case 'heading':
        newItem.styles = {
          ...newItem.styles,
          fontWeight: '700',
          letterSpacing: '1px',
          lineHeight: '1.2',
          textTransform: 'uppercase'
        };
        break;
    }

    const newItems = [...heroItems, newItem];
    setHeroItems(newItems);
    setSelectedItem(newId);
    
    // Notify parent component of changes if callback provided
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string | null) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a blob URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);

    if (itemId) {
      // Clean up old blob URL if it exists
      const oldItem = heroItems.find(item => item.id === itemId);
      if (oldItem?.imageUrl && oldItem.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldItem.imageUrl);
      }
      
      // Update item image
      setHeroItems(items => {
        // Create a deep copy of all items to ensure React detects the change
        const updatedItems = JSON.parse(JSON.stringify(items));
        
        const itemIndex = updatedItems.findIndex((item: HeroItem) => item.id === itemId);
        if (itemIndex !== -1) {
          updatedItems[itemIndex].imageUrl = imageUrl;
          
          // Ensure width/height/objectFit are set
          if (!updatedItems[itemIndex].styles.width) {
            updatedItems[itemIndex].styles.width = '100%';
          }
          if (!updatedItems[itemIndex].styles.height) {
            updatedItems[itemIndex].styles.height = '300px';
          }
          if (!updatedItems[itemIndex].styles.objectFit) {
            updatedItems[itemIndex].styles.objectFit = 'cover';
          }
        }
        
        // Notify parent component of changes if callback provided
        if (onItemsChange) {
          console.log('Notifying parent of image update:', updatedItems);
          onItemsChange(updatedItems);
        }
        
        return updatedItems;
      });
    } else {
      // Clean up old background image if it's a blob URL
      if (heroStyles.backgroundImage && heroStyles.backgroundImage.startsWith('blob:')) {
        URL.revokeObjectURL(heroStyles.backgroundImage);
      }
      
      // Update background image with deep clone
      const updatedStyles = JSON.parse(JSON.stringify(heroStyles));
      updatedStyles.backgroundImage = imageUrl;
      setHeroStyles(updatedStyles);
      
      // Notify parent component of changes if callback provided
      if (onStylesChange) {
        console.log('Notifying parent of background image update:', updatedStyles);
        onStylesChange(updatedStyles);
      }
    }

    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right') => {
    setHeroItems(items => {
      // Create a deep copy of all items
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      const itemIndex = updatedItems.findIndex((item: HeroItem) => item.id === itemId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex].position = position;
      }
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        console.log('Notifying parent of position update:', updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Handle items reordering from HeroMain
  const handleItemsReorder = (newItems: HeroItem[]) => {
    setHeroItems(newItems);
    
    // Notify parent component of changes if callback provided
    if (onItemsChange) {
      console.log('Notifying parent of items reordering:', newItems);
      onItemsChange(newItems);
    }
  };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    setHeroItems(items => {
      // Create a deep copy of all items to ensure React detects the change
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      // Find the item to update
      const itemIndex = updatedItems.findIndex((item: HeroItem) => item.id === itemId);
      if (itemIndex === -1) return items; // Item not found
      
      // Update the style property
      (updatedItems[itemIndex].styles as Record<string, any>)[styleKey] = value;
      
      // Explicitly log the updated item to verify changes
      console.log(`Updated item ${itemId} style:`, updatedItems[itemIndex].styles);
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        console.log('Notifying parent of item style change:', updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'content' | 'link', value: string) => {
    setHeroItems(items => {
      // Create a deep copy of all items
      const updatedItems = JSON.parse(JSON.stringify(items));
      
      const itemIndex = updatedItems.findIndex((item: HeroItem) => item.id === itemId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex][field] = value;
      }
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        console.log('Notifying parent of text update:', updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    const item = heroItems.find(item => item.id === itemId);
    if (item?.imageUrl && item.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.imageUrl);
    }
    
    setHeroItems(items => {
      // Create a deep copy excluding the deleted item
      const updatedItems = JSON.parse(JSON.stringify(
        items.filter(item => item.id !== itemId)
      ));
      
      // Notify parent component of changes if callback provided
      if (onItemsChange) {
        console.log('Notifying parent of item deletion:', updatedItems);
        onItemsChange(updatedItems);
      }
      
      return updatedItems;
    });
    
    setSelectedItem(null);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, selectedItem)}
        aria-label="Upload image"
        title="Upload image"
      />
      
      {/* Main Hero Section */}
      <div 
        className={`relative ${isAdmin && !isEditing ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''} 
          ${isEditing ? 'lg:mr-80 md:mr-64' : ''} transition-all duration-300`}
        onClick={() => {
          if (isAdmin && !isEditing && onStartEdit) {
            onStartEdit();
          }
        }}
      >
        <HeroMain
          heroItems={heroItems}
          heroStyles={heroStyles}
          isEditing={isEditing}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onItemsReorder={handleItemsReorder}
        />
      </div>

      {/* Render the sidebar component when in editing mode */}
      {isEditing && (
        <HeroSidebar
          isEditing={isEditing}
          heroItems={heroItems}
          selectedItem={selectedItem}
          heroStyles={heroStyles}
          setSelectedItem={setSelectedItem}
          onAddItem={(type) => addNewItem(type as 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph')}
          onDeleteItem={deleteItem}
          onUpdateItemContent={(id, content) => updateItemText(id, 'content', content)}
          onUpdateItemLink={(id, link) => updateItemText(id, 'link', link)}
          onUpdateItemStyle={(id, style) => {
            Object.entries(style).forEach(([key, value]) => {
              updateItemStyle(id, key, value as string);
            });
          }}
          onUpdateItemPosition={(id, position) => {
            // Convert position coordinates to left/center/right if needed
            let positionValue: 'left' | 'center' | 'right' = 'center';
            if (position.x < 0.33) positionValue = 'left';
            else if (position.x > 0.66) positionValue = 'right';
            updateItemPosition(id, positionValue);
          }}
          onUpdateItemAnimation={(id, animation) => {
            updateItemStyle(id, 'animation', animation);
          }}
          onUpdateHeroStyle={(style) => {
            setHeroStyles(prevStyles => ({
              ...prevStyles,
              ...style
            }));
          }}
          onSave={handleSave}
          handleClose={handleCloseEditMode}
          setHeroItems={setHeroItems}
          setHeroStyles={setHeroStyles}
          apiKey={apiKey}
          onAIConfigUpdate={onAIConfigUpdate}
          useDirectSave={useDirectSave}
          componentId={componentId}
          isSaving={isSaving}
        />
      )}
    </>
  );
}

// Re-export types and utility functions for external use
export * from './types'; 