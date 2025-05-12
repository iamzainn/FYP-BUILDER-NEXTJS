'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HeroItem, HeroStyles, SortableItemProps } from './types';

export default function SortableItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles 
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const handleClick = () => {
    if (isEditing) {
      onSelect();
    } else if (item.link) {
      window.location.href = item.link;
    }
  };

  const getAnimationClass = () => {
    if (!item.animation || item.animation === 'none') return '';
    
    switch (item.animation) {
      case 'fade': return 'animate-fade-in';
      case 'slide': return 'animate-slide-in';
      case 'bounce': return 'animate-bounce';
      default: return '';
    }
  };

  // Get responsive font size
  const getResponsiveFontSize = () => {
    const fontSize = item.styles.fontSize;
    if (!fontSize) return undefined;
    
    const size = parseInt(fontSize);
    // For headings, add responsive scaling
    if (item.type === 'heading') {
      return {
        fontSize: `clamp(${Math.max(24, size * 0.5)}px, 5vw, ${size}px)`,
      };
    }
    // For subheadings, add responsive scaling
    if (item.type === 'subheading') {
      return {
        fontSize: `clamp(${Math.max(18, size * 0.6)}px, 4vw, ${size}px)`,
      };
    }
    // For regular text, add responsive scaling
    return {
      fontSize: `clamp(${Math.max(14, size * 0.8)}px, 3vw, ${size}px)`,
    };
  };

  // Update the getMobileVisibilityClass function
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
  
  const getMobileVisibilityClass = () => {
    // Hide images on mobile devices
    if (item.type === 'image' && isMobile) {
      return 'hidden';
    }
    return '';
  };

  const renderContent = () => {
    switch (item.type) {
      case 'heading':
        return <h1 className="m-0 break-words w-full">
          {item.content}
        </h1>;
      case 'subheading':
        return <h2 className="m-0 break-words w-full">
          {item.content}
        </h2>;
      case 'paragraph':
        return <p className="m-0 break-words w-full">
          {item.content}
        </p>;
      case 'button':
        return (
          <a 
            href={item.link || '#'}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
              }
            }}
            className="transition-all duration-300 hover:opacity-90 active:scale-95 whitespace-normal text-center rounded-md inline-flex items-center justify-center"
            style={{
              cursor: isEditing ? 'move' : 'pointer',
              padding: '0.75rem 1.5rem',
              boxShadow: item.styles.boxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '100%',
              minWidth: '120px',
            }}
          >
            <span className="mr-2">{item.content}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        );
      case 'badge':
        return (
          <span className="inline-block break-words px-3 py-1 rounded-full text-center mx-auto sm:mx-0">
            {item.content}
          </span>
        );
      case 'image':
        return item.imageUrl ? (
          <div className="w-full overflow-hidden">
          <Image 
            src={item.imageUrl} 
            alt={item.content}
            className="w-full h-auto object-contain md:object-cover"
            style={{
              borderRadius: item.styles.borderRadius,
            }}
            width={500}
            height={300}
          />
          </div>
        ) : (
          <div className="flex items-center justify-center bg-gray-200 text-gray-500 border border-dashed border-gray-400 rounded w-full" 
               style={{
                 minHeight: '150px',
                 height: item.styles.height || '200px',
                 borderRadius: item.styles.borderRadius,
               }}>
            {isEditing ? (
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm md:text-base">Click to upload an image</p>
              </div>
            ) : (
              <p className="text-sm md:text-base">No image set</p>
            )}
          </div>
        );
      default:
        return item.content;
    }
  };

  // Combine all styles together with mobile overrides
  const combinedStyles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: item.styles.color || globalStyles.color,
    fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
    fontWeight: item.styles.fontWeight,
    backgroundColor: item.styles.backgroundColor,
    padding: item.styles.padding,
    marginTop: isMobile ? '0.5rem' : item.styles.marginTop,
    marginRight: isMobile ? 'auto' : item.styles.marginRight,
    marginBottom: isMobile ? '0.5rem' : item.styles.marginBottom,
    marginLeft: isMobile ? 'auto' : item.styles.marginLeft,
    borderRadius: item.styles.borderRadius,
    width: isMobile ? '100%' : (item.type === 'image' ? (item.styles.width || '100%') : (item.styles.width || 'auto')),
    height: item.styles.height,
    maxWidth: isMobile ? '100%' : (item.styles.maxWidth || '100%'),
    maxHeight: item.styles.maxHeight,
    aspectRatio: item.styles.aspectRatio,
    position: isMobile ? 'relative' : (item.styles.position as React.CSSProperties['position']),
    top: isMobile ? 'auto' : (item.styles.position === 'absolute' ? item.styles.top : undefined),
    left: isMobile ? 'auto' : (item.styles.position === 'absolute' ? item.styles.left : undefined),
    borderWidth: item.styles.borderWidth,
    borderColor: item.styles.borderColor,
    borderStyle: item.styles.borderStyle as React.CSSProperties['borderStyle'],
    textAlign: isMobile ? 'center' : (item.styles.textAlign as React.CSSProperties['textAlign']),
    textTransform: item.styles.textTransform as React.CSSProperties['textTransform'],
    letterSpacing: item.styles.letterSpacing,
    lineHeight: item.styles.lineHeight,
    boxShadow: item.styles.boxShadow,
    opacity: item.styles.opacity,
    zIndex: item.styles.zIndex,
    ...(getResponsiveFontSize() || {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyles}
      {...attributes}
      {...(isEditing ? listeners : {})}
      onClick={handleClick}
      className={`
        ${isEditing ? 'cursor-move' : item.link ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${getAnimationClass()}
        ${getMobileVisibilityClass()}
        max-w-full
        ${isMobile ? 'flex flex-col items-center justify-center text-center' : ''}
      `}
    >
      {renderContent()}
    </div>
  );
} 