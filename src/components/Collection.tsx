import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
// import AIChat from './AIChat';
import { CollectionItem, CollectionStyles, WebsiteConfig } from '../types/websiteConfig';
import SidebarCollection from './collection/sidebarCollection';

interface CollectionProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: CollectionItem[] | null;
  savedStyles?: CollectionStyles | null;
  apiKey?: string;
}

function SortableCollectionItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  // globalStyles,
  onImageUpload 
}: { 
  item: CollectionItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: CollectionStyles;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}) {
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

  // const handleClick = (e: React.MouseEvent) => {
  //   if (isEditing) {
  //     e.preventDefault();
  //     onSelect();
  //   }
  // };

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

export default function Collection({
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey
}: CollectionProps) {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(savedItems || [
    {
      id: 'col1',
      type: 'collection',
      title: "EDITOR'S PICK",
      imageUrl: "/dress.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    },
    {
      id: 'col1',
      type: 'collection',
      title: "SHOES",
      imageUrl: "/shoes.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    },
    {
      id: 'col1',
      type: 'collection',
      title: "ACCESSORIES",
      imageUrl: "/acess.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    }
    // Add more default items here
  ]);

  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles>(savedStyles || {
    backgroundColor: "#FFFFFF",
    backgroundType: "gradient",
    gradientStart: "#FFFFFF",
    gradientEnd: "#000000",
    gradientDirection: "to right",
    padding: "80px 0",
    gap: "24px",
    maxWidth: "1200px",
    layout: "grid",
    gridColumns: 3,
    aspectRatio: "1/1",
    containerPadding: "0 24px",
    sectionTitle: {
      text: "Shop By Category",
      color: "#000000",
      fontSize: "32px",
      fontWeight: "600",
      textAlign: "center",
      margin: "0 0 48px 0",
      fontFamily: "",
    }
  });

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

  useEffect(() => {
    if (savedItems) setCollectionItems(savedItems);
    if (savedStyles) {
      // If we have a backgroundColor but no gradient, create a gradient from it
      if (savedStyles.backgroundColor && !savedStyles.backgroundType) {
        const color = savedStyles.backgroundColor;
        // Create a lighter version for gradient start
        const lighterColor = adjustColor(color, 20);
        // Create a darker version for gradient end
        const darkerColor = adjustColor(color, -20);
        
        setCollectionStyles({
          ...savedStyles,
          backgroundType: 'gradient',
          gradientStart: lighterColor,
          gradientEnd: darkerColor,
          gradientDirection: 'to right'
        });
      } else {
        setCollectionStyles(savedStyles);
      }
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
    setCollectionItems(items =>
      items.map(item => ({
        ...item,
        styles: { ...item.styles, [styleKey]: value }
      }))
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem('collectionItems', JSON.stringify(collectionItems));
      localStorage.setItem('collectionStyles', JSON.stringify(collectionStyles));
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = collectionItems.findIndex(item => item.id === active.id);
      const newIndex = collectionItems.findIndex(item => item.id === over.id);
      
      const newItems = [...collectionItems];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      setCollectionItems(newItems);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real application, you would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setCollectionItems(items =>
        items.map(item =>
          item.id === itemId
            ? { ...item, imageUrl }
            : item
        )
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    if (newConfig.collectionConfig) {
      if (newConfig.collectionConfig.items) {
        setCollectionItems(newConfig.collectionConfig.items);
      }
      if (newConfig.collectionConfig.styles) {
        setCollectionStyles(newConfig.collectionConfig.styles);
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

  const updateGlobalStyle = (styleKey: string, value: string | number | Record<string, string>) => {
    setCollectionStyles(styles => ({
      ...styles,
      [styleKey]: value
    }));
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

  return (
    <>
      <section
        style={{
          backgroundColor: collectionStyles.backgroundType === 'color' ? collectionStyles.backgroundColor : undefined,
          backgroundImage: collectionStyles.backgroundType === 'gradient' 
            ? `linear-gradient(${collectionStyles.gradientDirection || 'to right'}, ${collectionStyles.gradientStart || '#FFFFFF'}, ${collectionStyles.gradientEnd || '#000000'})`
            : collectionStyles.backgroundType === 'image' 
              ? `url(${collectionStyles.backgroundImage})`
              : undefined,
          backgroundSize: collectionStyles.backgroundSize,
          backgroundPosition: collectionStyles.backgroundPosition,
          padding: isMobile ? '40px 0' : collectionStyles.padding,
        }}
        className={`${isAdmin && !isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''} ${isEditing ? 'lg:mr-80 md:mr-64' : ''}`}
        onClick={() => isAdmin && !isEditing && onStartEdit?.()}
        aria-label={isAdmin && !isEditing ? "Click to edit collection section" : "Collection section"}
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
                    isSelected={false}
                    onSelect={() => {}}
                    globalStyles={collectionStyles}
                    onImageUpload={handleImageUpload}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>

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
        </div>
      </section>
      
      {/* Add the SidebarCollection component */}
      <SidebarCollection
        isEditing={isEditing}
        collectionItems={collectionItems}
        collectionStyles={collectionStyles}
        handleSave={handleSave}
        updateGlobalStyle={updateGlobalStyle}
        updateAllItemsStyle={updateAllItemsStyle}
        apiKey={apiKey}
        handleAIConfigUpdate={handleAIConfigUpdate}
      />
    </>
  );
} 