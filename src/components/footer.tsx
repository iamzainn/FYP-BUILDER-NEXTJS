'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import FooterSidebar from './footer/sidebar';
import { WebsiteConfig, FooterColumn,  FooterStyles, SocialLink } from '@/types/websiteConfig';

interface FooterProps {
  componentId?: number;
  useDirectSave?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCloseSidebar?: () => void;
  onSave?: (columns: FooterColumn[], styles: FooterStyles, socialLinks: SocialLink[]) => void;
  apiKey?: string;
  savedColumns?: FooterColumn[] | null;
  savedStyles?: FooterStyles | null;
  savedSocialLinks?: SocialLink[] | null;
  onAIConfigUpdate?: (config: WebsiteConfig) => void;
  onColumnsChange?: (columns: FooterColumn[]) => void;
  onStylesChange?: (styles: FooterStyles) => void;
  onSocialLinksChange?: (socialLinks: SocialLink[]) => void;
}

// Default footer columns with links
const defaultColumns: FooterColumn[] = [
  {
    id: 'column-1',
    title: 'Company',
    links: [
      { id: 'link-1-1', label: 'About Us', href: '/about' },
      { id: 'link-1-2', label: 'Careers', href: '/careers' },
      { id: 'link-1-3', label: 'Blog', href: '/blog' },
    ],
  },
  {
    id: 'column-2',
    title: 'Resources',
    links: [
      { id: 'link-2-1', label: 'Documentation', href: '/docs' },
      { id: 'link-2-2', label: 'Help Center', href: '/help' },
      { id: 'link-2-3', label: 'Guides', href: '/guides' },
    ],
  },
  {
    id: 'column-3',
    title: 'Legal',
    links: [
      { id: 'link-3-1', label: 'Privacy Policy', href: '/privacy' },
      { id: 'link-3-2', label: 'Terms of Service', href: '/terms' },
      { id: 'link-3-3', label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

// Default social links with icons
const defaultSocialLinks: SocialLink[] = [
  {
    id: 'social-1',
    platform: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
  {
    id: 'social-2',
    platform: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    ),
  },
  {
    id: 'social-3',
    platform: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

// Default footer styles
const defaultStyles: FooterStyles = {
  backgroundColor: '#1f2937',
  textColor: '#f3f4f6',
  headingColor: '#ffffff',
  linkColor: '#d1d5db',
  linkHoverColor: '#ffffff',
  borderColor: '#374151',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '3rem 1.5rem',
  useGradient: false,
  gradientFrom: '#1f2937',
  gradientTo: '#111827',
  gradientDirection: 'to bottom',
  footerBottom: {
    backgroundColor: '#111827',
    textColor: '#9ca3af',
    useGradient: false,
    gradientFrom: '#111827',
    gradientTo: '#0f172a',
    gradientDirection: 'to bottom',
  },
};

const Footer: React.FC<FooterProps> = ({
  isEditing = false,
  onStartEdit,
  onCloseSidebar,
  onSave,
  apiKey,
  savedColumns = null,
  savedStyles = null,
  savedSocialLinks = null,
  onColumnsChange,
  onStylesChange,
  onSocialLinksChange,
  
  componentId,
  useDirectSave = false
}) => {
  const [columns, setColumns] = useState<FooterColumn[]>(savedColumns || defaultColumns);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(savedSocialLinks || defaultSocialLinks);
  const [footerStyles, setFooterStyles] = useState<FooterStyles>(savedStyles || defaultStyles);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Change selectedItem to be a string representation that the sidebar can work with
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  // Internal state to track what type of item is selected
  const [selectedItemType, setSelectedItemType] = useState<string | null>(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Set up event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for item selection events from the sidebar
  useEffect(() => {
    const handleSelectItem = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === 'object' && 'type' in event.detail && 'id' in event.detail) {
        // Convert the object to a string format for the sidebar
        const type = event.detail.type;
        const id = event.detail.id;
        
        if (type && id) {
          setSelectedItemType(type);
          setSelectedItem(`${type}-${id}`);
        } else {
          setSelectedItemType(null);
          setSelectedItem(null);
        }
      }
    };
    
    window.addEventListener('selectFooterItem', handleSelectItem as EventListener);
    
    return () => {
      window.removeEventListener('selectFooterItem', handleSelectItem as EventListener);
    };
  }, []);

  // Load saved data or use defaults
  useEffect(() => {
    if (savedColumns) {
      // Create a deep copy to ensure we're working with fresh objects
      const columnsCopy = JSON.parse(JSON.stringify(savedColumns));
      setColumns(columnsCopy);
    }
    
    if (savedStyles) {
      // Create a deep copy to ensure we're working with fresh objects
      const stylesCopy = JSON.parse(JSON.stringify(savedStyles));
      setFooterStyles(stylesCopy);
    }
    
    if (savedSocialLinks) {
      // Create a deep copy to ensure we're working with fresh objects
      const socialLinksCopy = JSON.parse(JSON.stringify(savedSocialLinks));
      setSocialLinks(socialLinksCopy);
    }
  }, [savedColumns, savedStyles, savedSocialLinks]);

  // Load saved settings from localStorage if not provided through props
  useEffect(() => {
    if (!savedColumns && !savedStyles) {
      const savedFooterColumns = localStorage.getItem('footerColumns');
      const savedFooterStyles = localStorage.getItem('footerStyles');
      const savedSocialLinks = localStorage.getItem('footerSocialLinks');
      
      if (savedFooterColumns) setColumns(JSON.parse(savedFooterColumns));
      if (savedFooterStyles) setFooterStyles(JSON.parse(savedFooterStyles));
      if (savedSocialLinks) setSocialLinks(JSON.parse(savedSocialLinks));
    }
  }, [savedColumns, savedStyles]);

  // Add effect to save to local storage when changes occur
  useEffect(() => {
    if (columns) {
      localStorage.setItem('footerColumns', JSON.stringify(columns));
    }
    if (footerStyles) {
      localStorage.setItem('footerStyles', JSON.stringify(footerStyles));
    }
    if (socialLinks) {
      localStorage.setItem('footerSocialLinks', JSON.stringify(socialLinks));
    }
  }, [columns, footerStyles, socialLinks]);

  // Handle newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription for:', newsletterEmail);
    // Here you would typically send this to your email service
    setNewsletterEmail('');
  };

  // Handle AI config updates - improved with deep cloning
  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    console.log('Received AI config update for footer:', JSON.stringify(newConfig.footerConfig, null, 2));
    
    if (newConfig.footerConfig) {
      let hasChanges = false;
      
      if (newConfig.footerConfig.columns) {
        console.log('Updating footer columns from AI:', JSON.stringify(newConfig.footerConfig.columns, null, 2));
        
        // Create deep copy of columns
        const deepCopiedColumns = JSON.parse(JSON.stringify(newConfig.footerConfig.columns));
        
        // Update local state
        setColumns(deepCopiedColumns);
        hasChanges = true;
        
        // Notify parent component immediately
        if (onColumnsChange) {
          console.log('Notifying parent of AI-generated column changes');
          onColumnsChange(deepCopiedColumns);
        }
      }
      
      if (newConfig.footerConfig.styles) {
        console.log('Updating footer styles from AI:', JSON.stringify(newConfig.footerConfig.styles, null, 2));
        
        // Create deep copy of styles
        const deepCopiedStyles = JSON.parse(JSON.stringify(newConfig.footerConfig.styles));
        
        // Update local state
        setFooterStyles(deepCopiedStyles);
        hasChanges = true;
        
        // Notify parent component immediately
        if (onStylesChange) {
          console.log('Notifying parent of AI-generated style changes');
          onStylesChange(deepCopiedStyles);
        }
      }
      
      if (newConfig.footerConfig.socialLinks) {
        console.log('Updating footer social links from AI:', JSON.stringify(newConfig.footerConfig.socialLinks, null, 2));
        
        // Create deep copy of social links
        const deepCopiedSocialLinks = JSON.parse(JSON.stringify(newConfig.footerConfig.socialLinks));
        
        // Update local state
        setSocialLinks(deepCopiedSocialLinks);
        hasChanges = true;
        
        // Notify parent component immediately
        if (onSocialLinksChange) {
          console.log('Notifying parent of AI-generated social link changes');
          onSocialLinksChange(deepCopiedSocialLinks);
        }
      }
      
      // If we've made changes, simulate a save to ensure changes are persisted
      if (hasChanges) {
        // Save to localStorage as a backup
        localStorage.setItem('footerColumns', JSON.stringify(columns));
        localStorage.setItem('footerStyles', JSON.stringify(footerStyles));
        localStorage.setItem('footerSocialLinks', JSON.stringify(socialLinks));
        
        console.log('AI-generated changes have been applied and saved locally');
      }
    }
  };

  // New function to close the editing sidebar
  const handleCloseEditMode = () => {
    if (onCloseSidebar) {
      console.log("Closing Footer editing sidebar using onCloseSidebar");
      onCloseSidebar();
    } else if (onStartEdit) {
      console.log("Closing Footer editing sidebar using onStartEdit (legacy method)");
      // Fallback to the old method if onCloseSidebar is not provided
      onStartEdit();
    } else {
      console.warn("No close method provided to Footer component");
    }
  };

  // New function to save directly to the component endpoint
  const handleDirectSave = async () => {
    if (!componentId) {
      console.error("Cannot perform direct save: Missing componentId");
      return;
    }

    console.log("Starting direct save operation...");
    console.log("Component ID:", componentId);
    
    setIsSaving(true);
    
    try {
      // Clone data to avoid reference issues
      const clonedColumns = JSON.parse(JSON.stringify(columns));
      const clonedStyles = JSON.parse(JSON.stringify(footerStyles));
      const clonedSocialLinks = JSON.parse(JSON.stringify(socialLinks));
      
      const content = {
        columns: clonedColumns,
        styles: clonedStyles,
        socialLinks: clonedSocialLinks
      };
      
      console.log("Preparing API payload:", content);
      
      const endpoint = `/api/components/${componentId}`;
      console.log("API endpoint:", endpoint);
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", { 
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        return;
      }
      
      console.log("Save successful:", responseData);
      
      // Auto-close sidebar after successful save
      handleCloseEditMode();
    } catch (error) {
      console.error("Save failed with exception:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Modify the existing handleSave function to use the direct approach when specified
  const handleSave = () => {
    console.log("handleSave called with:", { useDirectSave, componentId });
    
    if (useDirectSave && componentId) {
      console.log("Using direct save mode");
      handleDirectSave();
      return;
    }
    
    // Traditional save method (localStorage + parent notification)
    console.log("Using traditional save method");
    localStorage.setItem("builder.footer", JSON.stringify({ 
      columns, 
      styles: footerStyles, 
      socialLinks 
    }));
    console.log("Saved to localStorage:", { 
      columns, 
      styles: footerStyles, 
      socialLinks 
    });
    
    if (onSave) {
      onSave(columns, footerStyles, socialLinks);
      console.log("Parent component notified via onSave");
    }
  };

  // Check if an item is selected by ID - updated for string representation
  const isItemSelected = (type: string, id: string) => {
    if (!selectedItem || !selectedItemType) return false;
    
    if (type === 'column' && selectedItemType === 'column') {
      return selectedItem === `column-${id}`;
    } else if (type === 'link' && selectedItemType === 'link') {
      const parts = selectedItem.split('-');
      return parts.length >= 3 && parts[2] === id;
    } else if (type === 'social' && selectedItemType === 'social') {
      return selectedItem === `social-${id}`;
    }
    
    return false;
  };

  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  // Get background style based on gradient settings
  const getBackgroundStyle = () => {
    if (footerStyles.useGradient) {
      return {
        background: `linear-gradient(${footerStyles.gradientDirection}, ${footerStyles.gradientFrom}, ${footerStyles.gradientTo})`,
      };
    }
    return {
      backgroundColor: footerStyles.backgroundColor,
    };
  };

  // Get footer bottom background style based on gradient settings
  const getFooterBottomStyle = () => {
    if (footerStyles.footerBottom.useGradient) {
      return {
        background: `linear-gradient(${footerStyles.footerBottom.gradientDirection}, ${footerStyles.footerBottom.gradientFrom}, ${footerStyles.footerBottom.gradientTo})`,
        color: footerStyles.footerBottom.textColor,
      };
    }
    return {
      backgroundColor: footerStyles.footerBottom.backgroundColor,
      color: footerStyles.footerBottom.textColor,
    };
  };

  // Update column data
 
  
  // Update link data
  
  
  // Update social link
 
  
  // Update footer styles
  
  return (
    <footer 
      style={{
        ...getBackgroundStyle(),
        color: footerStyles.textColor,
        fontFamily: footerStyles.fontFamily,
        padding: isMobile ? '2rem 1rem' : footerStyles.padding,
        position: 'static',
        marginTop: '0'
      }}
      className={`w-full ${!isEditing ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''} ${isEditing ? 'lg:mr-96' : ''}`}
      onClick={() => {
        if (!isEditing && onStartEdit) {
          onStartEdit();
        }
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content with improved responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b" style={{ borderColor: footerStyles.borderColor }}>
          {/* Company Info & Newsletter - takes full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 style={{ color: footerStyles.headingColor }} className="text-lg font-semibold mb-4">Stay Updated</h2>
              <p className="mb-4">Subscribe to our newsletter for the latest products, promotions, and updates.</p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-2 border rounded-md flex-grow"
                  style={{ borderColor: footerStyles.borderColor }}
                  required
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            {/* Social Links - better spacing for mobile */}
            <div>
              <h2 style={{ color: footerStyles.headingColor }} className="text-lg font-semibold mb-4">Connect With Us</h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map(social => {
                  // Safely render social icons
                  let iconElement = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                    </svg>
                  );
                  
                  // Use platform-specific icons based on platform name
                  if (typeof social.platform === 'string') {
                    const platform = social.platform.toLowerCase();
                    if (platform.includes('facebook')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      );
                    } else if (platform.includes('twitter') || platform.includes('x.com')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      );
                    } else if (platform.includes('instagram')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      );
                    } else if (platform.includes('youtube')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      );
                    } else if (platform.includes('linkedin')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                      );
                    } else if (platform.includes('tiktok')) {
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      );
                    }
                  }
                  
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${
                        isEditing && isItemSelected('social', social.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                      aria-label={`Follow us on ${social.platform}`}
                      title={social.platform}
                      onClick={(e) => {
                        if (isEditing) {
                          e.preventDefault();
                          setSelectedItem(`social-${social.id}`);
                        }
                      }}
                    >
                      {iconElement}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Footer Navigation Columns - reorganized for mobile */}
          {columns.map(column => (
            <div 
              key={column.id} 
              onClick={() => {
                if (isEditing) {
                  setSelectedItem(`column-${column.id}`);
                }
              }}
              className={`${isEditing ? 'cursor-pointer hover:bg-black hover:bg-opacity-10 p-2 rounded' : ''}
                ${isEditing && isItemSelected('column', column.id) ? 'bg-blue-900 bg-opacity-20 ring-2 ring-blue-500' : ''}`}
            >
              <h2 style={{ color: footerStyles.headingColor }} className="text-lg font-semibold mb-4">{column.title}</h2>
              <ul className="space-y-2">
                {column.links.map(link => (
                  <li 
                    key={link.id}
                    onClick={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                        setSelectedItem(`link-${column.id}-${link.id}`);
                      }
                    }}
                    className={`${isEditing ? 'cursor-pointer hover:bg-black hover:bg-opacity-10 p-1 rounded' : ''}
                      ${isEditing && isItemSelected('link', link.id) ? 'bg-blue-900 bg-opacity-20 ring-2 ring-blue-500' : ''}`}
                  >
                    <Link
                      href={link.href}
                      style={{ color: footerStyles.linkColor }}
                      className="hover:underline transition-colors duration-200 block py-1"
                      onMouseOver={(e) => { e.currentTarget.style.color = footerStyles.linkHoverColor }}
                      onMouseOut={(e) => { e.currentTarget.style.color = footerStyles.linkColor }}
                      onClick={(e) => {
                        if (isEditing) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Bottom - better vertical spacing for mobile */}
        <div 
          className="py-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4"
          style={getFooterBottomStyle()}
        >
          <div className="text-center md:text-left">
            <p>&copy; {currentYear} Your Brand Name. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <Link 
              href="/privacy-policy" 
              className="hover:underline px-2"
              onMouseOver={(e) => { e.currentTarget.style.color = footerStyles.linkHoverColor }}
              onMouseOut={(e) => { e.currentTarget.style.color = footerStyles.footerBottom.textColor }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:underline px-2"
              onMouseOver={(e) => { e.currentTarget.style.color = footerStyles.linkHoverColor }}
              onMouseOut={(e) => { e.currentTarget.style.color = footerStyles.footerBottom.textColor }}
            >
              Terms of Service
            </Link>
            <Link 
              href="/sitemap" 
              className="hover:underline px-2"
              onMouseOver={(e) => { e.currentTarget.style.color = footerStyles.linkHoverColor }}
              onMouseOut={(e) => { e.currentTarget.style.color = footerStyles.footerBottom.textColor }}
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
      
      {/* Edit Button for Admin Mode */}
      {isEditing && (
        <FooterSidebar
          isEditing={isEditing}
          selectedItem={selectedItem}
          footerColumns={columns}
          socialLinks={socialLinks}
          footerStyles={footerStyles}
          handleSave={handleSave}
          handleClose={handleCloseEditMode}
          setFooterColumns={setColumns}
          setSocialLinks={setSocialLinks}
          setFooterStyles={setFooterStyles}
          apiKey={apiKey}
          handleAIConfigUpdate={handleAIConfigUpdate}
          useDirectSave={useDirectSave}
          componentId={componentId}
          isSaving={isSaving}
        />
      )}
    </footer>
  );
}

export default Footer; 