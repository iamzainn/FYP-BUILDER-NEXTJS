'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { HeroItem, HeroStyles } from './types';

interface HeroMainProps {
  heroItems: HeroItem[];
  heroStyles: HeroStyles;
  isEditing: boolean;
  selectedItem: string | null;
  setSelectedItem: (id: string | null) => void;
  onItemsReorder?: (items: HeroItem[]) => void;
}

export default function HeroMain({
  heroItems,
  heroStyles,
  isEditing,
  selectedItem,
  setSelectedItem,
  onItemsReorder,
}: HeroMainProps) {
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
      // Find the indices for the source and destination
      const oldIndex = heroItems.findIndex((item) => item.id === active.id);
      const newIndex = heroItems.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1 && onItemsReorder) {
        // Create new array with the moved item
        const newItems = [...heroItems];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        // Notify parent component of the reordering
        onItemsReorder(newItems);
      }
    }
  };

  // Get background style with better mobile handling
  const getBackgroundStyle = () => {
    return {
      backgroundColor: heroStyles.backgroundColor,
      backgroundImage: heroStyles.backgroundImage ? `url(${heroStyles.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: heroStyles.backgroundRepeat || 'no-repeat',
      position: 'relative' as const,
      minHeight: isMobile ? '320px' : '400px',
      color: heroStyles.color,
      fontFamily: heroStyles.fontFamily,
      transition: 'min-height 0.3s, height 0.3s',
      width: '100%',
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

  return (
    <section 
      style={getBackgroundStyle()}
      className="relative w-full overflow-hidden transition-all duration-300"
    >
      {/* Background Overlay */}
      <div style={getOverlayStyle()} className="absolute inset-0 pointer-events-none" />
      
      {/* Content Container (no absolute positioning) */}
      <div className="relative z-10 w-full p-2 md:p-4">
        <div className="container mx-auto w-full max-w-screen-xl">
          {isMobile ? (
            // Mobile layout - stack all items vertically, including images
            <div className="flex flex-col items-center justify-start w-full gap-4 py-6">
              {heroItems.map(item => (
                <div 
                  key={item.id} 
                  className="w-full max-w-[95vw] md:max-w-[600px] px-2 py-1 flex flex-col items-center justify-center break-words overflow-wrap break-all"
                  style={{ maxWidth: '100%' }}
                >
                  <SortableItem
                    item={{
                      ...item,
                      styles: {
                        ...item.styles,
                        textAlign: 'center',
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        width: item.type === 'image' ? '100%' : undefined,
                        maxWidth: '100%',
                        height: item.type === 'image' ? 'auto' : undefined,
                        fontSize: item.type === 'heading' ? 'clamp(1.5rem, 6vw, 2.5rem)' : (item.styles.fontSize || 'inherit'),
                        padding: item.styles.padding || '0.5rem 0',
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
            <div className={`grid ${getContentContainerStyle()} w-full gap-y-6 gap-x-8`}>
              {/* Left Content */}
              <div className="flex flex-col justify-center items-start w-full max-w-full px-2 md:px-4 space-y-4">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <SortableContext items={heroItems.filter(item => item.position === 'left')} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-col gap-4 w-full max-w-full">
                      {heroItems
                        .filter(item => item.position === 'left')
                        .map(item => (
                          <div key={item.id} className="w-full max-w-[600px] px-2 py-1 break-words overflow-wrap break-all" style={{ maxWidth: '100%' }}>
                            <SortableItem
                              item={{
                                ...item,
                                styles: {
                                  ...item.styles,
                                  fontSize: item.type === 'heading' ? 'clamp(2rem, 3vw, 3rem)' : (item.styles.fontSize || 'inherit'),
                                  padding: item.styles.padding || '0.5rem 0',
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
                  </SortableContext>
                </DndContext>
              </div>
              
              {/* Right Content (if using 2-column layout) */}
              {(heroStyles.layout === 'left-content' || heroStyles.layout === 'right-content') && (
                <div className="flex flex-col justify-center items-start w-full max-w-full px-2 md:px-4 space-y-4">
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext items={heroItems.filter(item => item.position === 'right')} strategy={horizontalListSortingStrategy}>
                      <div className="flex flex-col gap-4 w-full max-w-full">
                        {heroItems
                          .filter(item => item.position === 'right')
                          .map(item => (
                            <div key={item.id} className="w-full max-w-[600px] px-2 py-1 break-words overflow-wrap break-all" style={{ maxWidth: '100%' }}>
                              <SortableItem
                                item={{
                                  ...item,
                                  styles: {
                                    ...item.styles,
                                    fontSize: item.type === 'heading' ? 'clamp(2rem, 3vw, 3rem)' : (item.styles.fontSize || 'inherit'),
                                    padding: item.styles.padding || '0.5rem 0',
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
                    </SortableContext>
                  </DndContext>
                </div>
              )}
              
              {/* Center Content */}
              {heroStyles.layout === 'center-content' && (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <SortableContext items={heroItems.filter(item => item.position === 'center')} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-col items-center gap-4 w-full max-w-full px-2 md:px-4">
                      {heroItems
                        .filter(item => item.position === 'center')
                        .map(item => (
                          <div key={item.id} className="w-full max-w-[600px] px-2 py-1 text-center break-words overflow-wrap break-all" style={{ maxWidth: '100%' }}>
                            <SortableItem
                              item={{
                                ...item,
                                styles: {
                                  ...item.styles,
                                  fontSize: item.type === 'heading' ? 'clamp(2rem, 3vw, 3rem)' : (item.styles.fontSize || 'inherit'),
                                  padding: item.styles.padding || '0.5rem 0',
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
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 