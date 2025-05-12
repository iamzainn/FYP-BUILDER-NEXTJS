'use client';

import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SortableProductItem from './SortableProductItem';
import { ProductsMainProps } from './types';

export default function ProductsMain({
  productItems,
  productStyles,
  isEditing,
  selectedItem,
  setSelectedItem,
  onDragEnd,
  onImageUpload,
  isMobile
}: ProductsMainProps) {
  
  // Get responsive grid columns
  const getResponsiveGridColumns = () => {
    if (isMobile) {
      return 1; // Single column on mobile
    } else if (window.innerWidth < 1024) {
      return Math.min(2, productStyles.gridColumns || 4); // Max 2 columns on tablet
    }
    return productStyles.gridColumns || 4;
  };

  const getGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${getResponsiveGridColumns()}, 1fr)`,
      gap: isMobile ? '16px' : productStyles.gap,
      maxWidth: productStyles.maxWidth,
      padding: isMobile ? '0 16px' : productStyles.containerPadding,
      margin: '0 auto',
    };
  };

  // Get responsive title font size
  const getResponsiveTitleFontSize = () => {
    const fontSize = productStyles.sectionTitle.fontSize;
    if (!fontSize) return '28px';
    
    const size = parseInt(fontSize);
    // Smaller size on mobile
    if (isMobile) {
      return `${Math.max(24, size * 0.75)}px`;
    }
    return fontSize;
  };

  // Get the background style based on background type
  const getBackgroundStyle = () => {
    if (productStyles.backgroundType === 'gradient') {
      // Make sure we have gradient colors defined
      const startColor = productStyles.gradientStart || '#ffffff';
      const endColor = productStyles.gradientEnd || '#000000';
      const direction = productStyles.gradientDirection || 'to right';
      
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`
      };
    } else {
      // Default to solid color
      return {
        backgroundColor: productStyles.backgroundColor || '#F3F4F6'
      };
    }
  };

  return (
    <section
      style={{
        ...getBackgroundStyle(),
        padding: isMobile ? '40px 0' : productStyles.padding,
      }}
      className="w-full"
      aria-label="Products section"
    >
      <div className="container mx-auto">
        {productStyles.sectionTitle.text && (
          <h2
            style={{
              color: productStyles.sectionTitle.color,
              fontSize: getResponsiveTitleFontSize(),
              fontFamily: productStyles.sectionTitle.fontFamily,
              fontWeight: productStyles.sectionTitle.fontWeight,
              textAlign: productStyles.sectionTitle.textAlign as 'left' | 'center' | 'right',
              margin: isMobile ? '0 0 32px 0' : productStyles.sectionTitle.margin,
              textTransform: productStyles.sectionTitle.textTransform as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
            }}
            className="px-4 md:px-0"
          >
            {productStyles.sectionTitle.text}
          </h2>
        )}

        <DndContext onDragEnd={onDragEnd}>
          <div style={getGridStyle()} className="w-full">
            <SortableContext items={productItems.map(item => item.id)}>
              {productItems.map((item) => (
                <SortableProductItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  globalStyles={productStyles}
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