'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HeroSidebar from './hero/sidebar';
import Image from 'next/image';

interface HeroItem {
  id: string;
  type: 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph';
  content: string;
  link?: string;
  position: 'left' | 'center' | 'right';
  styles: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    textAlign?: 'left' | 'center' | 'right';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    lineHeight?: string;
    boxShadow?: string;
    opacity?: string;
    zIndex?: string;
    position?: 'relative' | 'absolute';
    top?: string;
    left?: string;
    transform?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    maxWidth?: string;
    maxHeight?: string;
    aspectRatio?: string;
  };
  imageUrl?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
}

interface HeroStyles {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: 'cover' | 'contain' | 'auto' | 'custom';
  backgroundWidth: string;
  backgroundPosition: string;
  backgroundRepeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  backgroundOverlay: string;
  overlayOpacity: string;
  height: string;
  padding: string;
  fontFamily: string;
  color: string;
  layout: 'left-content' | 'right-content' | 'center-content' | 'full-width';
}

interface HeroProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: HeroItem[] | null;
  savedStyles?: HeroStyles | null;
  apiKey?: string;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'system-ui',
  'Roboto',
  'Open Sans'
];

// SortableItem component
function SortableItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles 
}: { 
  item: HeroItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: HeroStyles;
}) {
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

export default function Hero({ 
  isAdmin = false, 
  isEditing = false, 
  onStartEdit, 
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey
}: HeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hero items state
  const [heroItems, setHeroItems] = useState<HeroItem[]>(savedItems || [
    {
      id: 'heading1',
      type: 'heading',
      content: 'Summer Collection 2023',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '48px',
        fontFamily: 'Helvetica',
        fontWeight: '700',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0 0 1rem 0',
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: '1.2',
      }
    },
    {
      id: 'subheading1',
      type: 'subheading',
      content: 'Discover the latest trends and styles',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '24px',
        fontFamily: '',
        fontWeight: '400',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0 0 2rem 0',
        textAlign: 'left',
      }
    },
    {
      id: 'button1',
      type: 'button',
      content: 'Shop Now',
      link: '/shop',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '16px',
        fontFamily: '',
        fontWeight: '600',
        backgroundColor: '#ff4500',
        padding: '0.75rem 2rem',
        margin: '0',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }
    },
    {
      id: 'badge1',
      type: 'badge',
      content: 'New Arrivals',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: '',
        fontWeight: '600',
        backgroundColor: '#ff4500',
        padding: '0.25rem 1rem',
        margin: '0 0 1rem 0',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles>(savedStyles || {
    backgroundColor: '#1a1a1a',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundOverlay: '#000000',
    overlayOpacity: '0.5',
    height: '500px',
    padding: '2rem',
    fontFamily: 'Helvetica',
    color: '#ffffff',
    layout: 'left-content'
  });

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

  // Load saved settings only if not provided through props
  useEffect(() => {
    if (!savedItems && !savedStyles) {
      const savedHeroItems = localStorage.getItem('heroItems');
      const savedHeroStyles = localStorage.getItem('heroStyles');
      
      if (savedHeroItems) setHeroItems(JSON.parse(savedHeroItems));
      if (savedHeroStyles) setHeroStyles(JSON.parse(savedHeroStyles));
    }
  }, [savedItems, savedStyles]);

  // Save settings
  const handleSave = () => {
    localStorage.setItem('heroItems', JSON.stringify(heroItems));
    localStorage.setItem('heroStyles', JSON.stringify(heroStyles));
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

    setHeroItems([...heroItems, newItem]);
    setSelectedItem(newId);
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
      setHeroItems(items =>
        items.map(item =>
          item.id === itemId
            ? { 
                ...item, 
                imageUrl,
                styles: {
                  ...item.styles,
                  width: item.styles.width || '100%',
                  height: item.styles.height || '300px',
                  objectFit: item.styles.objectFit || 'cover',
                }
              }
            : item
        )
      );
    } else {
      // Clean up old background image if it's a blob URL
      if (heroStyles.backgroundImage.startsWith('blob:')) {
        URL.revokeObjectURL(heroStyles.backgroundImage);
      }
      // Update background image
      setHeroStyles({...heroStyles, backgroundImage: imageUrl});
    }

    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right') => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, position }
          : item
      )
    );
  };

  // DND sensors configuration
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setHeroItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, styles: { ...item.styles, [styleKey]: value } }
          : item
      )
    );
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'content' | 'link', value: string) => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    const item = heroItems.find(item => item.id === itemId);
    if (item?.imageUrl && item.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.imageUrl);
    }
    setHeroItems(items => items.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Get background style with better mobile handling
  const getBackgroundStyle = () => {
    return {
      backgroundColor: heroStyles.backgroundColor,
      backgroundImage: heroStyles.backgroundImage ? `url(${heroStyles.backgroundImage})` : 'none',
      backgroundSize: heroStyles.backgroundSize === 'custom' ? heroStyles.backgroundWidth : heroStyles.backgroundSize,
      backgroundPosition: heroStyles.backgroundPosition || 'center',
      backgroundRepeat: heroStyles.backgroundRepeat || 'no-repeat',
      position: 'relative' as const,
      minHeight: isMobile ? '400px' : '300px', // Increase minimum height for mobile
      height: heroStyles.height,
      color: heroStyles.color,
      fontFamily: heroStyles.fontFamily,
    };
  };

  // Get overlay style
  const getOverlayStyle = () => {
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: heroStyles.backgroundOverlay,
      opacity: parseFloat(heroStyles.overlayOpacity),
      zIndex: 1,
    };
  };

  // Get content container style based on layout with improved responsive classes
  const getContentContainerStyle = () => {
    switch (heroStyles.layout) {
      case 'left-content':
        return 'grid-cols-1 md:grid-cols-2 md:gap-8 items-center';
      case 'right-content':
        return 'grid-cols-1 md:grid-cols-2 md:gap-8 items-center flex-row-reverse';
      case 'center-content':
        return 'grid-cols-1 text-center items-center justify-items-center';
      case 'full-width':
        return 'grid-cols-1 items-center';
      default:
        return 'grid-cols-1 md:grid-cols-2 md:gap-8 items-center';
    }
  };

  // Handle AI config updates
  const handleAIConfigUpdate = (newConfig: { navbarConfig: null | undefined; heroConfig: { items: HeroItem[]; styles: HeroStyles } }) => {
    if (newConfig.heroConfig) {
      setHeroItems(newConfig.heroConfig.items);
      setHeroStyles(newConfig.heroConfig.styles);
    }
  };

  // Filter items for mobile view
  // const getMobileVisibleItems = (items: HeroItem[], position: 'left' | 'center' | 'right') => {
  //   return items
  //     .filter(item => item.position === position)
  //     .filter(item => !(item.type === 'image' && isMobile));
  // };

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
      
      {/* Hero Section */}
      <section 
        style={getBackgroundStyle()}
        className={`relative w-full overflow-hidden ${isAdmin && !isEditing ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''} 
          ${isEditing ? 'lg:mr-80 md:mr-64' : ''} transition-all duration-300`}
        onClick={() => {
          if (isAdmin && !isEditing && onStartEdit) {
            onStartEdit();
          }
        }}
      >
        {/* Background Overlay */}
        <div style={getOverlayStyle()}></div>
        
        {/* Content Container */}
        <div className="absolute inset-0 z-10 flex items-center justify-center w-full p-4">
          <div className="container mx-auto w-full max-w-screen-xl">
            {isMobile ? (
              // Mobile layout - center everything regardless of original position
              <div className="flex flex-col items-center justify-center w-full h-full gap-4 py-6">
                {heroItems
                  .filter(item => item.type !== 'image') // Filter out all images on mobile
                  .map(item => (
                    <div 
                      key={item.id} 
                      className="w-full flex flex-col items-center justify-center"
                      style={{ maxWidth: '100%' }}
                    >
                      <SortableItem
                        item={{
                          ...item,
                          styles: {
                            ...item.styles,
                            textAlign: 'center',  // Force center alignment
                            position: 'relative', // Reset any absolute positioning
                            top: 'auto',
                            left: 'auto'
                          }
                        }}
                        isEditing={isEditing}
                        isSelected={selectedItem === item.id}
                        onSelect={() => setSelectedItem(item.id)}
                        globalStyles={heroStyles}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              // Desktop layout - use the original grid layout
              <div className={`grid ${getContentContainerStyle()} w-full gap-y-6`}>
                {/* Left Content */}
                <div className="flex flex-col justify-center items-start w-full max-w-full px-4">
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext items={heroItems.filter(item => item.position === 'left')} strategy={horizontalListSortingStrategy}>
                      <div className="flex flex-col gap-4 w-full max-w-full">
                        {heroItems
                          .filter(item => item.position === 'left')
                          .map(item => (
                            <div key={item.id} className="w-full" style={{ maxWidth: '100%' }}>
                              <SortableItem
                                item={item}
                                isEditing={isEditing}
                                isSelected={selectedItem === item.id}
                                onSelect={() => setSelectedItem(item.id)}
                                globalStyles={heroStyles}
                              />
                            </div>
                          ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                
                {/* Right Content (if using 2-column layout) */}
                {(heroStyles.layout === 'left-content' || heroStyles.layout === 'right-content') && (
                  <div className="flex flex-col justify-center items-start w-full max-w-full px-4">
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                      <SortableContext items={heroItems.filter(item => item.position === 'right')} strategy={horizontalListSortingStrategy}>
                        <div className="flex flex-col gap-4 w-full max-w-full">
                          {heroItems
                            .filter(item => item.position === 'right')
                            .map(item => (
                              <div key={item.id} className="w-full" style={{ maxWidth: '100%' }}>
                                <SortableItem
                                  item={item}
                                  isEditing={isEditing}
                                  isSelected={selectedItem === item.id}
                                  onSelect={() => setSelectedItem(item.id)}
                                  globalStyles={heroStyles}
                                />
                              </div>
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
                
                {/* Center Content */}
                {heroStyles.layout === 'center-content' && (
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext items={heroItems.filter(item => item.position === 'center')} strategy={horizontalListSortingStrategy}>
                      <div className="flex flex-col items-center gap-4 w-full max-w-full px-4">
                        {heroItems
                          .filter(item => item.position === 'center')
                          .map(item => (
                            <div key={item.id} className="w-full text-center" style={{ maxWidth: '100%' }}>
                              <SortableItem
                                item={item}
                                isEditing={isEditing}
                                isSelected={selectedItem === item.id}
                                onSelect={() => setSelectedItem(item.id)}
                                globalStyles={heroStyles}
                              />
                            </div>
                          ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Render the sidebar component when in editing mode */}
      <HeroSidebar 
        isEditing={isEditing}
        selectedItem={selectedItem}
        heroItems={heroItems}
        heroStyles={heroStyles}
        fontFamilies={fontFamilies}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        handleSave={handleSave}
        addNewItem={addNewItem}
        updateItemText={updateItemText}
        updateItemPosition={updateItemPosition}
        updateItemStyle={updateItemStyle}
        deleteItem={deleteItem}
        setHeroStyles={setHeroStyles}
        apiKey={apiKey}
        handleAIConfigUpdate={handleAIConfigUpdate}
      />
    </>
  );
}