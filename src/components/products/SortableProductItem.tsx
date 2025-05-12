'use client';

import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableProductItemProps } from './types';

export default function SortableProductItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles,
  onImageUpload 
}: SortableProductItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
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
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    position: 'relative' as const,
    cursor: isEditing ? 'move' : 'pointer',
  };

  const getAnimationClass = () => {
    switch (item.styles.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'zoom':
        return 'animate-zoom-in';
      default:
        return '';
    }
  };

  const getHoverClass = () => {
    switch (item.styles.hoverEffect) {
      case 'zoom':
        return 'hover:scale-105';
      case 'fade':
        return 'hover:opacity-80';
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-200';
      default:
        return '';
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  // Get responsive height based on screen size
  const getResponsiveHeight = () => {
    if (isMobile) {
      return '250px'; // Smaller height on mobile
    }
    return item.styles.imageHeight || '300px';
  };

  // Get responsive font size
  const getResponsiveFontSize = () => {
    const fontSize = item.styles.fontSize;
    if (!fontSize) return '16px';
    
    const size = parseInt(fontSize);
    // Smaller size on mobile
    if (isMobile) {
      return `${Math.max(14, size * 0.8)}px`;
    }
    return fontSize;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? listeners : {})}
      className={`relative ${getAnimationClass()} ${getHoverClass()} transition-all duration-300 h-full`}
      onClick={(e) => {
        if (isEditing) {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      <div 
        className="block relative h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" 
        style={{
          borderRadius: item.styles.borderRadius || '8px',
          backgroundColor: item.styles.cardBackgroundColor || '#ffffff',
          borderWidth: item.styles.borderWidth || '0px',
          borderStyle: 'solid',
          borderColor: item.styles.borderColor || 'transparent'
        }}
      >
        <div className="relative overflow-hidden rounded-t-lg" style={{ height: getResponsiveHeight() }}>
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`w-full h-full transition-transform duration-300 ${getHoverClass()}`}
            style={{ 
              objectFit: item.styles.objectFit as any || 'cover',
            }}
            onClick={handleImageClick}
          />
          {isEditing && (
            <label htmlFor={`image-upload-${item.id}`} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white font-medium">Change Image</span>
              <input 
                type="file" 
                id={`image-upload-${item.id}`} 
                className="hidden" 
                onChange={(e) => onImageUpload(e, item.id)} 
                accept="image/*"
                ref={fileInputRef}
              />
            </label>
          )}
          {item.styles.showBadge && item.badge && (
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded`} 
              style={{
                backgroundColor: item.styles.badgeColor || '#ff4d4d',
                color: item.styles.badgeTextColor || 'white'
              }}
            >
              {item.badge}
            </div>
          )}
        </div>
        
        <div 
          className="p-4"
          style={{
            backgroundColor: item.styles.cardBackgroundColor || '#ffffff',
          }}
        >
          <h3
            className="font-semibold mb-1 line-clamp-2"
            style={{
              color: item.styles.nameColor || '#000000',
              fontSize: getResponsiveFontSize(),
              fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
              textTransform: item.styles.textTransform as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
            }}
          >
            {item.name}
          </h3>
          
          <p
            className="mb-2 line-clamp-3 text-sm"
            style={{
              color: item.styles.descriptionColor || '#666666',
              fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
              display: item.styles.showDescription ? 'block' : 'none'
            }}
          >
            {item.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span 
              className="font-bold"
              style={{
                color: item.styles.priceColor || '#000000',
                fontSize: parseInt(item.styles.fontSize || '16') * 1.2 + 'px',
                fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
              }}
            >
              {formatPrice(item.price)}
            </span>
            
            {item.styles.showButton && (
              <button
                className="px-3 py-2 rounded text-white text-sm font-medium transition-all"
                style={{
                  backgroundColor: item.styles.buttonColor || '#3B82F6',
                  color: item.styles.buttonTextColor || '#ffffff'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {item.buttonText || 'Add to Cart'}
              </button>
            )}
          </div>
          
          {item.styles.showRating && (
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg 
                  key={index} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill={index < item.rating ? (item.styles.ratingColor || '#FFD700') : '#E5E7EB'}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span 
                className="ml-1 text-xs"
                style={{
                  color: item.styles.descriptionColor || '#666666'
                }}
              >
                ({item.rating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      </div>
      
      {isSelected && isEditing && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
      )}
    </div>
  );
} 