'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SortableCollectionItem from './SortableCollectionItem';
import { CollectionItem, CollectionStyles } from './types';

interface CollectionMainProps {
  collectionItems: CollectionItem[];
  collectionStyles: CollectionStyles;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onItemsReorder?: (items: CollectionItem[]) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

export default function CollectionMain({
  collectionItems,
  collectionStyles,
  isEditing,
  isSelected,
  onSelect,
  onItemsReorder,
  onImageUpload
}: CollectionMainProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Check for mobile device on component mount and window resize
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

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = collectionItems.findIndex(item => item.id === active.id);
      const newIndex = collectionItems.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1 && onItemsReorder) {
        const newItems = [...collectionItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        
        onItemsReorder(newItems);
      }
    }
  };

  // Get responsive grid columns
  const getResponsiveGridColumns = () => {
    if (isMobile) {
      return 1; // Single column on mobile
    } else if (window.innerWidth < 1024) {
      return Math.min(2, collectionStyles.gridColumns || 3); // Max 2 columns on tablet
    }
    return collectionStyles.gridColumns || 3;
  };

  // Get the grid style based on layout type and responsive adjustments
  const getGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${getResponsiveGridColumns()}, 1fr)`,
      gap: isMobile ? '12px' : collectionStyles.gap,
      maxWidth: collectionStyles.maxWidth,
      padding: isMobile ? '0 12px' : collectionStyles.containerPadding,
      margin: '0 auto',
    };
  };

  // Get responsive title font size
  const getResponsiveTitleFontSize = () => {
    const fontSize = collectionStyles.sectionTitle.fontSize;
    if (!fontSize) return '24px';
    
    const size = parseInt(fontSize);
    // Smaller size on mobile
    if (isMobile) {
      return `${Math.max(24, size * 0.7)}px`;
    }
    return fontSize;
  };

  // Get the background style based on the background type
  const getBackgroundStyle = () => {
    if (collectionStyles.backgroundType === 'color') {
      return { backgroundColor: collectionStyles.backgroundColor };
    } else if (collectionStyles.backgroundType === 'gradient') {
      return {
        backgroundImage: `linear-gradient(${collectionStyles.gradientDirection || 'to right'}, ${collectionStyles.gradientStart || '#FFFFFF'}, ${collectionStyles.gradientEnd || '#000000'})`,
      };
    } else if (collectionStyles.backgroundType === 'image') {
      return {
        backgroundImage: `url(${collectionStyles.backgroundImage})`,
        backgroundSize: collectionStyles.backgroundSize,
        backgroundPosition: collectionStyles.backgroundPosition,
      };
    }
    
    return { backgroundColor: '#FFFFFF' };
  };

  return (
    <section 
      style={{
        ...getBackgroundStyle(),
        padding: isMobile ? '40px 0' : collectionStyles.padding,
      }}
      className="w-full"
      aria-label="Collection section"
    >
      <div className="container mx-auto">
        {collectionStyles.sectionTitle.text && (
          <h2
            style={{
              color: collectionStyles.sectionTitle.color,
              fontSize: getResponsiveTitleFontSize(),
              fontFamily: collectionStyles.sectionTitle.fontFamily,
              fontWeight: collectionStyles.sectionTitle.fontWeight,
              textAlign: 'center', // Always center on mobile
              margin: isMobile ? '0 0 32px 0' : collectionStyles.sectionTitle.margin,
            }}
            className="px-4 md:px-0"
          >
            {collectionStyles.sectionTitle.text}
          </h2>
        )}

        <DndContext onDragEnd={handleDragEnd}>
          <div style={getGridStyle()} className="w-full">
            <SortableContext items={collectionItems.map(item => item.id)}>
              {collectionItems.map((item) => (
                <SortableCollectionItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  globalStyles={collectionStyles}
                  onImageUpload={onImageUpload}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </section>
  );
} 