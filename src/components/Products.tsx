import { useState, useEffect, useRef } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// import Image from 'next/image';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { ProductItem, ProductStyles, WebsiteConfig } from '../types/websiteConfig';


import SidebarProducts from './products/sidebarProducts';


interface ProductsProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: ProductItem[] | null;
  savedStyles?: ProductStyles | null;
  apiKey?: string;
}

function SortableProductItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles,
  onImageUpload 
}: { 
  item: ProductItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: ProductStyles;
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
              // @ts-expect-error - objectFit is string but expected to be ObjectFit type
              objectFit: item.styles.objectFit || 'cover',
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

export default function Products({
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey
}: ProductsProps) {
  // Default sample products
  const defaultProducts: ProductItem[] = [
    {
      id: 'prod1',
      name: "Premium Wireless Headphones",
      description: "Experience crystal-clear sound with our premium noise-cancelling headphones. Perfect for music lovers and professionals alike.",
      price: 249.99,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      rating: 4.8,
      badge: "BEST SELLER",
      buttonText: "Add to Cart",
      styles: {
        nameColor: "#000000",
        descriptionColor: "#666666",
        priceColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        imageHeight: "300px",
        cardBackgroundColor: "#ffffff",
        buttonColor: "#3B82F6",
        buttonTextColor: "#ffffff",
        borderRadius: "8px",
        badgeColor: "#ef4444",
        badgeTextColor: "#ffffff",
        ratingColor: "#FFD700",
        borderWidth: "0px",
        borderColor: "transparent",
        objectFit: "cover",
        showDescription: true,
        showButton: true,
        showRating: true,
        showBadge: true,
        hoverEffect: "zoom",
        animation: "fade",
        textTransform: "none",
        fontFamily: "",
      }
    },
    {
      id: 'prod2',
      name: "Smart Watch Series 5",
      description: "Track your fitness goals, receive notifications, and more with this sleek smartwatch. Water-resistant and long battery life.",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2064&auto=format&fit=crop",
      rating: 4.5,
      badge: "NEW",
      buttonText: "Add to Cart",
      styles: {
        nameColor: "#000000",
        descriptionColor: "#666666",
        priceColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        imageHeight: "300px",
        cardBackgroundColor: "#ffffff",
        buttonColor: "#3B82F6",
        buttonTextColor: "#ffffff",
        borderRadius: "8px",
        badgeColor: "#10b981",
        badgeTextColor: "#ffffff",
        ratingColor: "#FFD700",
        borderWidth: "0px",
        borderColor: "transparent",
        objectFit: "cover",
        showDescription: true,
        showButton: true,
        showRating: true,
        showBadge: true,
        hoverEffect: "zoom",
        animation: "fade",
        textTransform: "none",
        fontFamily: "",
      }
    },
    {
      id: 'prod3',
      name: "Designer Leather Backpack",
      description: "Stylish and practical leather backpack with multiple compartments. Perfect for work, travel, or everyday use.",
      price: 129.99,
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
      rating: 4.2,
      badge: "SALE",
      buttonText: "Add to Cart",
      styles: {
        nameColor: "#000000",
        descriptionColor: "#666666",
        priceColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        imageHeight: "300px",
        cardBackgroundColor: "#ffffff",
        buttonColor: "#3B82F6",
        buttonTextColor: "#ffffff",
        borderRadius: "8px",
        badgeColor: "#8b5cf6",
        badgeTextColor: "#ffffff",
        ratingColor: "#FFD700",
        borderWidth: "0px",
        borderColor: "transparent",
        objectFit: "cover",
        showDescription: true,
        showButton: true,
        showRating: true,
        showBadge: true,
        hoverEffect: "zoom",
        animation: "fade",
        textTransform: "none",
        fontFamily: "",
      }
    },
    {
      id: 'prod4',
      name: "Ergonomic Office Chair",
      description: "Work comfortably with this ergonomic office chair. Adjustable height, lumbar support, and premium materials for all-day comfort.",
      price: 349.99,
      imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2000&auto=format&fit=crop",
      rating: 4.7,
      badge: "PREMIUM",
      buttonText: "Add to Cart",
      styles: {
        nameColor: "#000000",
        descriptionColor: "#666666",
        priceColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        imageHeight: "300px",
        cardBackgroundColor: "#ffffff",
        buttonColor: "#3B82F6",
        buttonTextColor: "#ffffff",
        borderRadius: "8px",
        badgeColor: "#f59e0b",
        badgeTextColor: "#ffffff",
        ratingColor: "#FFD700",
        borderWidth: "0px",
        borderColor: "transparent",
        objectFit: "cover",
        showDescription: true,
        showButton: true,
        showRating: true,
        showBadge: true,
        hoverEffect: "zoom",
        animation: "fade",
        textTransform: "none",
        fontFamily: "",
      }
    }
  ];

  const [productItems, setProductItems] = useState<ProductItem[]>(savedItems || defaultProducts);

  const [productStyles, setProductStyles] = useState<ProductStyles>(savedStyles || {
    backgroundColor: "#F3F4F6",
    padding: "80px 0",
    gap: "24px",
    maxWidth: "1200px",
    layout: "grid",
    gridColumns: 4,
    containerPadding: "0 24px",
    fontFamily: "Inter, system-ui, sans-serif",
    sectionTitle: {
      text: "Featured Products",
      color: "#111827",
      fontSize: "32px",
      fontWeight: "700",
      textAlign: "center",
      margin: "0 0 48px 0",
      fontFamily: "Inter, system-ui, sans-serif",
      textTransform: "none"
    }
  });

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
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
    if (savedItems) setProductItems(savedItems);
    if (savedStyles) setProductStyles(savedStyles);
  }, [savedItems, savedStyles]);

  const handleSave = () => {
    try {
      localStorage.setItem('productItems', JSON.stringify(productItems));
      localStorage.setItem('productStyles', JSON.stringify(productStyles));
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = productItems.findIndex(item => item.id === active.id);
      const newIndex = productItems.findIndex(item => item.id === over.id);
      
      const newItems = [...productItems];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      setProductItems(newItems);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real application, you would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setProductItems(items =>
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

  const addNewProduct = () => {
    const newId = `prod${productItems.length + 1}`;
    const newProduct: ProductItem = {
      id: newId,
      name: "New Product",
      description: "Product description goes here. Add details about your product.",
      price: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      rating: 5.0,
      badge: "NEW",
      buttonText: "Add to Cart",
      styles: {
        nameColor: "#000000",
        descriptionColor: "#666666",
        priceColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        imageHeight: "300px",
        cardBackgroundColor: "#ffffff",
        buttonColor: "#3B82F6",
        buttonTextColor: "#ffffff",
        borderRadius: "8px",
        badgeColor: "#10b981",
        badgeTextColor: "#ffffff",
        ratingColor: "#FFD700",
        borderWidth: "0px",
        borderColor: "transparent",
        objectFit: "cover",
        showDescription: true,
        showButton: true,
        showRating: true,
        showBadge: true,
        hoverEffect: "zoom",
        animation: "fade",
        textTransform: "none",
        fontFamily: "",
      }
    };
    
    setProductItems([...productItems, newProduct]);
    setSelectedItem(newId);
  };

  const updateProductDetails = (itemId: string, field: keyof ProductItem, value: any) => {
    setProductItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateProductStyle = (itemId: string, styleKey: string, value: string | boolean) => {
    setProductItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, styles: { ...item.styles, [styleKey]: value } }
          : item
      )
    );
  };

  const updateAllProductsStyle = (styleKey: string, value: string | boolean) => {
    setProductItems(items =>
      items.map(item => ({
        ...item,
        styles: { ...item.styles, [styleKey]: value }
      }))
    );
  };

  const deleteProduct = (itemId: string) => {
    setProductItems(items => items.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    if (newConfig.productsConfig) {
      if (newConfig.productsConfig.items) {
        setProductItems(newConfig.productsConfig.items);
      }
      if (newConfig.productsConfig.styles) {
        setProductStyles(newConfig.productsConfig.styles);
      }
    }
  };

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

  const updateGlobalStyle = (styleKey: string, value: string | number | Record<string, string>) => {
    setProductStyles(styles => ({
      ...styles,
      [styleKey]: value
    }));
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

  return (
    <>
      <section
        style={{
          background: productStyles.backgroundType === 'gradient' 
            ? `linear-gradient(${productStyles.gradientDirection || 'to right'}, ${productStyles.gradientStart || '#ffffff'}, ${productStyles.gradientEnd || '#000000'})` 
            : productStyles.backgroundColor,
          padding: isMobile ? '40px 0' : productStyles.padding,
        }}
        className={`${isAdmin && !isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''} ${isEditing ? 'lg:mr-80 md:mr-64' : ''}`}
        onClick={() => isAdmin && !isEditing && onStartEdit?.()}
        aria-label={isAdmin && !isEditing ? "Click to edit products section" : "Products section"}
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

          <DndContext onDragEnd={handleDragEnd}>
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
              title="Edit Products"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </section>
      
      {/* Add the SidebarProducts component */}
      <SidebarProducts
        isEditing={isEditing}
        selectedItem={selectedItem}
        productItems={productItems}
        productStyles={productStyles}
        handleSave={handleSave}
        addNewProduct={addNewProduct}
        updateProductDetails={updateProductDetails}
        updateProductStyle={updateProductStyle}
        updateAllProductsStyle={updateAllProductsStyle}
        updateGlobalStyle={updateGlobalStyle}
        deleteProduct={deleteProduct}
        apiKey={apiKey}
        handleAIConfigUpdate={handleAIConfigUpdate}
      />
    </>
  );
} 