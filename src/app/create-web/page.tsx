'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AIService } from '../../services/aiService';

import { MongoDBApiService } from '@/services/mondodbapi';
import Link from 'next/link';

export default function SetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    subdomain: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    logo: '',
    heroImage: '/hero.jpg',
    backgroundImage: '/slideshow-1.jpg'
  });

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validate file type
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      
      if (!validTypes.includes(fileType)) {
        throw new Error(`Invalid file type. Please upload ${validTypes.join(', ')}`);
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`File is too large. Maximum size is 5MB`);
      }
      
      // Log file details for debugging
      console.log('Attempting to upload file:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
      
      // Upload the file to the server and save in MongoDB
      const logoUrl = await MongoDBApiService.uploadFile(file, 'logo');
      
      if (logoUrl) {
        setFormData(prev => ({ ...prev, logo: logoUrl }));
        console.log('Logo uploaded successfully:', logoUrl);
      } else {
        // Use placeholder logo instead of throwing error
        console.log('Using placeholder logo as fallback');
        setFormData(prev => ({ ...prev, logo: '/placeholder-logo.png' }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      // More detailed error info for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      // Provide user-friendly error message
      const errorMessage = 'Failed to upload logo. You can continue with setup and add a logo later.';
      alert(errorMessage);
      
      // Set a placeholder logo to allow the user to continue
      setFormData(prev => ({ 
        ...prev, 
        logo: '/placeholder-logo.png' // Using a placeholder image path
      }));
    } finally {
      setIsUploading(false);
    }
  };

   // Add this function to your page.tsx file
   function generateSubdomain(storeName: string): string {
    // Convert to lowercase
    let subdomain = storeName.toLowerCase();
    
    // Remove special characters and spaces
    subdomain = subdomain.replace(/[^a-z0-9]/g, '');
    
    // Ensure it's not empty (fallback to a default if needed)
    if (!subdomain) {
      subdomain = 'store' + Math.floor(Math.random() * 10000);
    }
    
    return subdomain;
  }

  const handleSubmit = async () => {
    setIsGenerating(true);
    const subdomain = generateSubdomain(formData.storeName);
    console.log("subdomain created ",subdomain);
    
    try {
      // Generate hero content using AI
      const aiService = new AIService('AIzaSyCiYjw2tHMyFGVysLOTBztOl2Z9H4l8L3E');
      const heroContent = await aiService.generateHeroContent(formData.storeName, formData.storeDescription);
      console.log("heroContent created ",heroContent);

      // Save navbar settings
      const navItems = [
        {
          id: 'logo',
          type: 'image',
          label: formData.storeName,
          link: '/',
          position: 'left',
          imageUrl: formData.logo,
          styles: {
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }
        },
        {
          id: '1',
          type: 'link',
          label: 'Home',
          link: '/',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '2',
          type: 'link',
          label: 'Products',
          link: '/products',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '3',
          type: 'link',
          label: 'Case Studies',
          link: '/case-studies',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '4',
          type: 'link',
          label: 'About',
          link: '/about',
          position: 'nav',
          styles: {
            color: formData.secondaryColor,
            fontSize: '16px',
            padding: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            hover: {
              color: formData.primaryColor
            }
          }
        },
        {
          id: '5',
          type: 'link',
          label: 'Contact',
          link: '/contact',
          position: 'right',
          styles: {
            color: '#ffffff',
            fontSize: '16px',
            padding: '0.75rem 1.5rem',
            fontWeight: '600',
            backgroundColor: formData.primaryColor,
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            hover: {
              backgroundColor: formData.secondaryColor,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
            }
          }
        }
      ];

      const navStyles = {
        backgroundColor: '#ffffff',
        padding: '1rem',
        fontFamily: 'Inter',
        color: formData.secondaryColor,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      };

      // Save hero settings with AI-generated content
      const heroItems = [
        {
          id: 'badge1',
          type: 'badge',
          content: `Welcome to ${formData.storeName}`,
          position: 'left',
          styles: {
            color: '#ffffff',
            backgroundColor: 'rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            backdropFilter: 'blur(4px)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block'
          }
        },
        {
          id: 'heading1',
          type: 'heading',
          content: heroContent.heroTitle,
          position: 'left',
          styles: {
            color: '#ffffff',
            fontSize: '56px',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }
        },
        {
          id: 'subheading1',
          type: 'subheading',
          content: heroContent.heroSubtitle,
          position: 'left',
          styles: {
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '2rem',
            maxWidth: '600px',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }
        },
        {
          id: 'button1',
          type: 'button',
          content: heroContent.ctaText,
          link: heroContent.ctaLink,
          position: 'left',
          styles: {
            color: '#ffffff',
            backgroundColor: '#333333',
            fontSize: '16px',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'auto',
            border: '1px solid rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            hover: {
              backgroundColor: '#4a4a4a',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
            },
            after: {
              content: '→',
              marginLeft: '0.5rem',
              transition: 'transform 0.3s ease',
            },
            'hover:after': {
              transform: 'translateX(4px)'
            }
          }
        },
        {
          id: 'image1',
          type: 'image',
          content: 'Hero Image',
          position: 'right',
          imageUrl: formData.heroImage,
          styles: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: '2'
          }
        }
      ];

      const heroStyles = {
        backgroundColor: 'transparent',
        backgroundImage: formData.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '600px',
        padding: '4rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        layout: 'left-content',
        backgroundOverlay: 'rgba(0,0,0,0.4)',
        overlayOpacity: '1'
      };
      const collectionItems=[
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
      ];
    
      const collectionStyles={
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
      };
      // Create default products
      const defaultProducts = [
        {
          id: 'prod1',
          name: "Premium Product",
          description: "High-quality product with excellent features.",
          price: 199.99,
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          rating: 4.8,
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
        },
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

      const productStyles = {
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
      };
// Default footer columns with links
const defaultColumns = [
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { id: 'shop-1', label: 'All Products', href: '/products' },
      { id: 'shop-2', label: 'New Arrivals', href: '/products/new' },
      { id: 'shop-3', label: 'Best Sellers', href: '/products/best-sellers' },
      { id: 'shop-4', label: 'Sale Items', href: '/products/sale' }
    ]
  },
  {
    id: 'account',
    title: 'Account',
    links: [
      { id: 'account-1', label: 'My Account', href: '/account' },
      { id: 'account-2', label: 'Order History', href: '/account/orders' },
      { id: 'account-3', label: 'Wishlist', href: '/account/wishlist' },
      { id: 'account-4', label: 'Returns', href: '/account/returns' }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { id: 'support-1', label: 'Help Center', href: '/help' },
      { id: 'support-2', label: 'Contact Us', href: '/contact' },
      { id: 'support-3', label: 'Shipping Info', href: '/shipping' },
      { id: 'support-4', label: 'Returns & Exchanges', href: '/returns' }
    ]
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: 'company-1', label: 'About Us', href: '/about' },
      { id: 'company-2', label: 'Careers', href: '/careers' },
      { id: 'company-3', label: 'Privacy Policy', href: '/privacy' },
      { id: 'company-4', label: 'Terms of Service', href: '/terms' }
    ]
  }
];

// Default social links with icons
const defaultSocialLinks = [
  {
    id: 'facebook',
    platform: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    )
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    id: 'twitter',
    platform: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    )
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    )
  }
];

// Default styles for the footer with gradient options
const defaultStyles = {
  backgroundColor: '#f9fafb',
  textColor: '#4b5563',
  headingColor: '#111827',
  linkColor: '#4b5563',
  linkHoverColor: '#1e40af',
  borderColor: '#e5e7eb',
  padding: '3rem 1.5rem',
  fontFamily: 'Inter, sans-serif',
  // Add gradient properties
  useGradient: false,
  gradientFrom: '#f9fafb',
  gradientTo: '#e5e7eb',
  gradientDirection: 'to bottom',
  footerBottom: {
    backgroundColor: '#f3f4f6',
    textColor: '#6b7280',
    useGradient: false,
    gradientFrom: '#f3f4f6',
    gradientTo: '#e5e7eb',
    gradientDirection: 'to bottom'
  }
};
      // Create the complete website configuration
      const websiteConfig = {
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: formData.logo,
        heroImage: formData.heroImage,
        backgroundImage: formData.backgroundImage,
        navItems: navItems,
        navStyles: navStyles,
        heroItems: heroItems,
        heroStyles: heroStyles,
        collectionItems: collectionItems,
        collectionStyles: collectionStyles,
        productItems: defaultProducts,
        productStyles: productStyles,
        footerColumns: defaultColumns,
        footerSocialLinks: defaultSocialLinks,
        footerStyles: defaultStyles,
        setupComplete: true
      };

     

      ;

      const data = {
        storeName: formData.storeName,
        subdomain: subdomain,
        storeConfig: websiteConfig
      }
      console.log("data created in create-web ",data);

      // Create the website in MongoDB
      const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ai-website-builder-ashen.vercel.app/'}/api/websites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create website");
      }

      if (!response) {
        throw new Error('Failed to create website in database');
      }

      console.log('Website created in database:', response);

      
      router.push(`/home/${formData.storeName}`);
    } catch (error) {
      console.error('Error during setup:', error);
      alert('Failed to complete setup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration - improved blur effects */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute top-40 right-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      
      {/* Navigation back to dashboard */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Create Your Website</h1>
          <p className="mt-2 text-gray-600">Let&apos;s build something amazing together</p>
        </div>

        {/* Progress Steps - Enhanced */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 ${
                    step >= item 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white' 
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {item}
                </div>
                <span className={`text-sm ${step >= item ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                  {item === 1 ? 'Basic Info' : item === 2 ? 'Branding' : 'Content'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-95">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Description
                </label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeDescription: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  rows={3}
                  placeholder="Brief description of your store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Logo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  title="Choose logo file"
                  aria-label="Store logo upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300 flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {isUploading ? 'Uploading...' : 'Choose Logo'}
                </button>
                {formData.logo && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-center">
                    <div className="relative h-24 w-24">
                      <img src={formData.logo} alt="Logo preview" className="h-full w-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-md hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center shadow-md font-medium"
            >
              <span>Continue to Branding</span>
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Step 2: Colors and Branding */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-95">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Colors & Branding</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full h-12 cursor-pointer rounded-md border border-gray-300 p-1"
                    title="Select primary color"
                    aria-label="Primary color"
                  />
                  <div className="absolute right-3 top-3 bg-white px-2 py-1 text-xs font-mono rounded shadow border border-gray-200">
                    {formData.primaryColor.toUpperCase()}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className="w-full h-8 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, primaryColor: color }))}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-full h-12 cursor-pointer rounded-md border border-gray-300 p-1"
                    title="Select secondary color"
                    aria-label="Secondary color"
                  />
                  <div className="absolute right-3 top-3 bg-white px-2 py-1 text-xs font-mono rounded shadow border border-gray-200">
                    {formData.secondaryColor.toUpperCase()}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {['#1e40af', '#3730a3', '#6b21a8', '#7e22ce', '#a21caf'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className="w-full h-8 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, secondaryColor: color }))}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: formData.primaryColor }}></div>
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: formData.primaryColor }}></div>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: formData.secondaryColor }}></div>
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: formData.secondaryColor }}></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-md hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center shadow-md font-medium"
              >
                <span>Continue</span>
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Step */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm bg-opacity-95">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Almost Done!</h2>
            
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md text-sm animate-fadeIn">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium mb-1">AI-Powered Content</p>
                  <p>Our AI will generate engaging hero content based on your store information.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Website Summary</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Store Name:</strong> {formData.storeName}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Description:</strong> {formData.storeDescription.substring(0, 50)}{formData.storeDescription.length > 50 ? '...' : ''}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex items-center">
                      <span className="mr-2"><strong>Colors:</strong></span>
                      <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: formData.primaryColor }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.secondaryColor }}></div>
                    </div>
                  </li>
                  {formData.logo && (
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Logo:</strong> Uploaded</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-md hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Website...
                  </>
                ) : (
                  <>
                    <span>Create Website</span>
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 10 10.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
