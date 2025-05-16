'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { SortableCollectionItemProps } from './types';

export default function SortableCollectionItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  
  onImageUpload 
}: SortableCollectionItemProps) {
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
      case 'overlay':
        return 'group';
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
    return item.styles.height || '400px';
  };

  // Get responsive font size
  const getResponsiveFontSize = () => {
    const fontSize = item.styles.fontSize;
    if (!fontSize) return '16px';
    
    const size = parseInt(fontSize);
    // Smaller size on mobile
    if (isMobile) {
      return `${Math.max(16, size * 0.75)}px`;
    }
    return fontSize;
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
      <Link 
        href={item.link} 
        className="block relative h-full" 
        onClick={e => {
          if (isEditing) {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }
        }}
        tabIndex={isEditing ? -1 : 0}
      >
        <div 
          className="relative overflow-hidden h-full"
          style={{
            height: getResponsiveHeight(),
            borderRadius: item.styles.borderRadius,
          }}
        >
          <Image
            src={item.imageUrl}
            alt={item.title || "Collection image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={true}
            style={{ 
              objectFit: item.styles.objectFit || 'cover',
              filter: item.styles.imageFilter || 'none',
            }}
            onClick={handleImageClick}
            className="transition-transform duration-300"
          />
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: item.styles.imageOverlay,
              opacity: parseFloat(item.styles.overlayOpacity),
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3
              style={{
                color: item.styles.color,
                fontSize: getResponsiveFontSize(),
                fontFamily: item.styles.fontFamily,
                fontWeight: item.styles.fontWeight,
                textTransform: item.styles.textTransform as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
                letterSpacing: item.styles.letterSpacing,
                textAlign: item.styles.textAlign as 'left' | 'center' | 'right',
              }}
              className="text-center"
            >
              {item.title}
            </h3>
          </div>
        </div>
      </Link>
      {isSelected && isEditing && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => onImageUpload(e, item.id)}
        title="Upload image"
        aria-label="Upload image"
      />
    </div>
  );
} 