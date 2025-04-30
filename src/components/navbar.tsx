'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/aria-props */
/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState, useEffect, useRef } from 'react';


import AIChat from './AIChat';
import Link from 'next/link';


interface Style {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  backgroundColor?: string;
  padding?: string;
  marginTop?: string;
  width?: string;
  height?: string;
  objectFit?: string;
  fontWeight?: string;
  textTransform?: string;
  letterSpacing?: string;
  borderRadius?: string;
  boxShadow?: string;
  /* eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents */
  position?: string;
  top?: string;
  left?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  textAlign?: string;
  opacity?: string;
  zIndex?: string;
  lineHeight?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  alignSelf?: string;
  hover?: {
    color?: string;
    backgroundColor?: string;
    transform?: string;
    boxShadow?: string;
  };
}

export interface NavItem {
  id: string;
  type: string;
  label: string;
  link: string;
  position: string;
  imageUrl?: string;
  styles: Style;
}

export interface NavbarStyles {
  backgroundColor: string;
  padding: string;
  fontFamily: string;
  color: string;
  boxShadow: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface HeroItem {
  id: string;
  type: string;
  content?: string;
  link?: string;
  position?: string;
  styles: Record<string, string>;
  imageUrl?: string;
  animation?: string;
}

interface HeroStyles {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  height?: string;
  padding?: string;
  fontFamily?: string;
  color?: string;
  [key: string]: string | undefined;
}

interface HeroConfig {
  items: HeroItem[];
  styles: HeroStyles;
}

interface WebsiteConfig {
  navbarConfig?: {
    items: NavItem[];
    styles: NavbarStyles;
  } | null;
  heroConfig?: HeroConfig | null;
}

interface NavbarProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  apiKey?: string;
  savedItems?: NavItem[] | null;
  savedStyles?: NavbarStyles | null;
  onItemsChange?: (items: NavItem[]) => void;
  onStylesChange?: (styles: NavbarStyles) => void;
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

// // Update the type definition to properly handle string indexing
// type NavItemStyleKey = keyof NavItem['styles'];
// type NavItemStyles = NavItem['styles'];

// SortableItem component
// function SortableItem({ 
//   item, 
//   isEditing, 
//   isSelected, 
//   onSelect,
//   globalStyles 
// }: { 
//   item: NavItem; 
//   isEditing: boolean; 
//   isSelected: boolean;
//   onSelect: () => void;
//   globalStyles: NavbarStyles;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id: item.id });

//   const handleClick = () => {
//     if (isEditing) {
//       onSelect();
//     } else if (item.link) {
//       window.location.href = item.link;
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition,
//         color: item.styles.color || globalStyles.color,
//         fontSize: item.styles.fontSize,
//         fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
//         backgroundColor: item.styles.backgroundColor,
//         padding: item.styles.padding,
//         borderRadius: item.styles.borderRadius,
//         marginTop: item.styles.marginTop,
//         width: item.styles.width,
//         height: item.styles.height,
//         borderWidth: item.styles.borderWidth,
//         borderColor: item.styles.borderColor,
//         borderStyle: item.styles.borderStyle,
//         alignSelf: item.styles.alignSelf,
//       }}
//       {...attributes}
//       {...(isEditing ? listeners : {})}
//       onClick={handleClick}
//       className={`
//         ${isEditing ? 'cursor-move' : 'cursor-pointer'} 
//         transition-all duration-200
//         ${isSelected ? 'ring-2 ring-blue-500' : ''}
//         hover:opacity-80
//       `}
//     >
//       {item.type === 'image' && item.imageUrl ? (
//         <div style={{ width: '100%', height: '100%' }}>
//           <img 
//             src={item.imageUrl} 
//             alt={item.label}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: item.styles.objectFit || 'contain',
//               borderRadius: item.styles.borderRadius,
//               borderWidth: item.styles.borderWidth,
//               borderColor: item.styles.borderColor,
//               borderStyle: item.styles.borderStyle,
//             }}
//           />
//         </div>
//       ) : (
//         item.label
//       )}
//     </div>
//   );
// }

const defaultNavItems: NavItem[] = [
  {
    id: 'logo',
    type: 'image',
    label: 'Logo',
    link: '/',
    position: 'left',
    imageUrl: '/logo.png',
    styles: {
      width: '40px',
      height: '40px',
      objectFit: 'contain'
    }
  },
  {
    id: '1',
    type: 'link',
    label: 'Home',
    link: '/',
    position: 'nav',
    styles: {
      color: '#1e40af',
      fontSize: '16px',
      fontFamily: 'Inter',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      hover: {
        color: '#2563eb'
      }
    }
  },
  {
    id: '2',
    type: 'link',
    label: 'About',
    link: '/about',
    position: 'nav',
    styles: {
      color: '#1e40af',
      fontSize: '16px',
      fontFamily: 'Inter',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      hover: {
        color: '#2563eb'
      }
    }
  },
  {
    id: '3',
    type: 'link',
    label: 'Contact',
    link: '/contact',
    position: 'right',
    styles: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Inter',
      backgroundColor: '#2563eb',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      hover: {
        backgroundColor: '#1e40af',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
      }
    }
  }
];

const defaultNavStyles: NavbarStyles = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  fontFamily: 'Inter',
  color: '#1e40af',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default function Navbar({
  
  isEditing = false,

  onSave,
  apiKey,
  savedItems = null,
  savedStyles = null,
  onItemsChange,
  
}: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Combined state for all navbar items including logo
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [navStyles, setNavStyles] = useState<NavbarStyles>(defaultNavStyles);

  const [messages, setMessages] = useState<Message[]>([]);
  // const [inputMessage, setInputMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
  console.log(setMessages);
  
    scrollToBottom();
  }, [messages]);

  // Load saved settings
  useEffect(() => {
    if (savedItems && savedItems.length > 0) {
      console.log('Setting navItems from props:', savedItems);
      setNavItems(savedItems);
    }
    
    if (savedStyles) {
      console.log('Setting navStyles from props:', savedStyles);
      setNavStyles(savedStyles);
    }
  }, [savedItems, savedStyles]);

  // Save settings
  const handleSave = () => {
    localStorage.setItem('navItems', JSON.stringify(navItems));
    localStorage.setItem('navStyles', JSON.stringify(navStyles));
    setSelectedItem(null);
    onSave?.();
    onItemsChange?.(navItems);
  };

  // Add new item
  const addNewItem = (type: 'link' | 'image' | 'text', position: 'left' | 'center' | 'right' | 'nav' = 'nav') => {
    const newId = String(navItems.length + 1);
    const newItem: NavItem = {
      id: newId,
      type,
      label: type === 'link' ? 'New Link' : type === 'image' ? 'New Image' : 'New Text',
      link: type === 'link' ? '/' : '',
      position,
      styles: {
        color: '',
        fontSize: '16px',
        fontFamily: '',
        backgroundColor: 'transparent',
        padding: '0.5rem',
        marginTop: '0px',
        width: type === 'image' ? '40px' : undefined,
        height: type === 'image' ? '40px' : undefined,
        borderRadius: type === 'image' ? '0px' : undefined,
        borderWidth: type === 'image' ? '0px' : undefined,
        borderColor: type === 'image' ? '#000000' : undefined,
        borderStyle: type === 'image' ? 'solid' : undefined,
        objectFit: type === 'image' ? 'contain' : undefined,
        alignSelf: type === 'image' ? 'center' : undefined
      },
      imageUrl: type === 'image' ? '/vercel.svg' : undefined,
    };
    setNavItems([...navItems, newItem]);
    setSelectedItem(newId);
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, imageUrl }
          : item
      )
    );
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right' | 'nav') => {
    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, position }
          : item
      )
    );
  };

  // DND sensors configuration
  // const sensors = useSensors(
  //   useSensor(MouseSensor),
  //   useSensor(TouchSensor)
  // );

  // Handle drag end
  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   if (active.id !== over.id) {
  //     setNavItems((items) => {
  //       const oldIndex = items.findIndex((item) => item.id === active.id);
  //       const newIndex = items.findIndex((item) => item.id === over.id);
  //       return arrayMove(items, oldIndex, newIndex);
  //     });
  //   }
  // };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, styles: { ...item.styles, [styleKey]: value } }
          : item
      )
    );
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'label' | 'link', value: string) => {
    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setNavItems(items => items.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Add this function to handle AI config updates
  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    if (newConfig.navbarConfig) {
      console.log('Updating navbar config from AI:', newConfig.navbarConfig);
      
      // Update items if provided
      if (newConfig.navbarConfig.items) {
        console.log('Updating navbar items:', newConfig.navbarConfig.items);
        
        // Ensure all color values are in proper format
        const formattedItems = newConfig.navbarConfig.items.map((item: NavItem) => {
          // Create a new item to avoid mutating the original
          const newItem = { ...item };
          
          // Process styles to ensure colors are in proper format
          if (newItem.styles) {
            Object.entries(newItem.styles).forEach(([key, value]) => {
              // Check if this is a color property and needs formatting
              if (
                (key.toLowerCase().includes('color') || key.toLowerCase() === 'background') && 
                typeof value === 'string' && 
                !value.startsWith('#') && 
                !value.startsWith('rgb') && 
                !value.startsWith('hsl') &&
                value !== 'transparent'
              ) {
                // Convert named colors to hex
                const colorMap: Record<string, string> = {
                  'black': '#000000',
                  'white': '#ffffff',
                  'red': '#ff0000',
                  'green': '#00ff00',
                  'blue': '#0000ff',
                  'yellow': '#ffff00',
                  'purple': '#800080',
                  'orange': '#ffa500',
                  'gray': '#808080',
                  'grey': '#808080'
                };
                
                const lowerValue = value.toLowerCase();
                if (colorMap[lowerValue]) {
                  console.log(`Converting color value "${value}" to "${colorMap[lowerValue]}"`);
                  // Use a type assertion to safely access the object
                  (newItem.styles as Record<string, string>)[key] = colorMap[lowerValue];
                }
              }
            });
          }
          
          return newItem;
        });
        
        setNavItems(formattedItems);
      }
      
      // Update styles if provided
      if (newConfig.navbarConfig.styles) {
        console.log('Updating navbar styles:', newConfig.navbarConfig.styles);
        console.log('Previous backgroundColor:', navStyles.backgroundColor);
        console.log('New backgroundColor:', newConfig.navbarConfig.styles.backgroundColor);
        
        // Create a new styles object to ensure state update
        const updatedStyles = { 
          ...navStyles,  // Start with current styles
          ...newConfig.navbarConfig.styles  // Override with new styles
        };
        
        // Ensure backgroundColor is in proper format
        if (updatedStyles.backgroundColor && typeof updatedStyles.backgroundColor === 'string') {
          // Convert named colors to hex
          const colorMap: Record<string, string> = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'purple': '#800080',
            'orange': '#ffa500',
            'gray': '#808080',
            'grey': '#808080'
          };
          
          const lowerColor = updatedStyles.backgroundColor.toLowerCase();
          if (colorMap[lowerColor]) {
            console.log(`Converting backgroundColor from "${updatedStyles.backgroundColor}" to "${colorMap[lowerColor]}"`);
            updatedStyles.backgroundColor = colorMap[lowerColor];
          }
        }
        
        // Ensure color is in proper format
        if (updatedStyles.color && typeof updatedStyles.color === 'string') {
          // Convert named colors to hex
          const colorMap: Record<string, string> = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'purple': '#800080',
            'orange': '#ffa500',
            'gray': '#808080',
            'grey': '#808080'
          };
          
          const lowerColor = updatedStyles.color.toLowerCase();
          if (colorMap[lowerColor]) {
            console.log(`Converting color from "${updatedStyles.color}" to "${colorMap[lowerColor]}"`);
            updatedStyles.color = colorMap[lowerColor];
          }
        }
        
        console.log('Final updated styles:', updatedStyles);
        setNavStyles(updatedStyles);
      }
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    if (!isEditing) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // Group items by position
  const leftItems = navItems.filter(item => item.position === 'left');
  const navLinksItems = navItems.filter(item => item.position === 'nav');
  const rightItems = navItems.filter(item => item.position === 'right');

  // Render an individual navigation item based on its type
  const renderNavItem = (item: NavItem) => {
    const { id, type, label, link, imageUrl, styles = {} } = item;

    // Create a style object for this item
    const itemStyle: React.CSSProperties = {
      color: styles.color,
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily,
      backgroundColor: styles.backgroundColor,
      padding: styles.padding,
      marginTop: styles.marginTop,
      fontWeight: styles.fontWeight,
      textTransform: styles.textTransform as any,
      letterSpacing: styles.letterSpacing,
      borderRadius: styles.borderRadius,
      boxShadow: styles.boxShadow,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center'
    };

    // Generate a unique key for this item
    const key = `nav-item-${id}-${label}`;

    if (type === 'image' && imageUrl) {
      return (
        <Link href={link} key={key} className="flex items-center">
          <div 
            className="relative" 
            style={{
              width: styles.width || '40px',
              height: styles.height || '40px'
            }}
          >
            <img 
              src={imageUrl} 
              alt={label}
              style={{
                objectFit: (styles.objectFit as any) || 'contain',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </Link>
      );
    }

    if (type === 'link') {
      return (
        <Link 
          href={link} 
          key={key}
          style={itemStyle}
          className="nav-link hover:text-blue-600"
          onMouseOver={(e) => {
            if (styles.hover) {
              e.currentTarget.style.color = styles.hover.color || '';
              e.currentTarget.style.backgroundColor = styles.hover.backgroundColor || '';
              e.currentTarget.style.transform = styles.hover.transform || '';
              e.currentTarget.style.boxShadow = styles.hover.boxShadow || '';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = styles.color || '';
            e.currentTarget.style.backgroundColor = styles.backgroundColor || '';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = styles.boxShadow || '';
          }}
        >
          {label}
        </Link>
      );
    }

    // Default fallback for unknown types
    return (
      <span key={key} style={itemStyle}>
        {label}
      </span>
    );
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, selectedItem || '')}
        aria-label="Upload image"
        title="Upload image"
      />
      
      {/* Navbar */}
      <nav 
        style={{
          backgroundColor: navStyles.backgroundColor,
          padding: navStyles.padding,
          fontFamily: navStyles.fontFamily,
          color: navStyles.color,
          boxShadow: navStyles.boxShadow
        }}
        className="w-full z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Logo */}
            <div className="flex items-center">
              {leftItems.map(renderNavItem)}
            </div>
            
            {/* Center/Navigation links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinksItems.map(renderNavItem)}
            </div>
            
            {/* Right section - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              {rightItems.map(renderNavItem)}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                /* eslint-disable-next-line jsx-a11y/aria-proptypes */
                aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                aria-label="Open main menu"
                title="Toggle menu"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                {!mobileMenuOpen ? (
                  <svg 
                    className="block h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  /* Icon when menu is open */
                  <svg 
                    className="block h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
              style={{
                backgroundColor: navStyles.backgroundColor,
                fontFamily: navStyles.fontFamily,
              }}
            >
              {/* Show nav links in mobile menu */}
              <div className="flex flex-col space-y-3 py-2">
                {navLinksItems.map((item) => (
                  <div key={`mobile-${item.id}`} className="px-3">
                    {renderNavItem(item)}
                  </div>
                ))}
              </div>
              
              {/* Show right items in mobile menu */}
              <div className="flex flex-col space-y-3 py-2 border-t border-gray-200">
                {rightItems.map((item) => (
                  <div key={`mobile-right-${item.id}`} className="px-3 mt-2">
                    {renderNavItem(item)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Customization Sidebar */}
      {isEditing && (
        <div className="fixed inset-y-0 right-0 h-full w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-4 md:p-6 overflow-y-auto z-[9999] transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Customize Navbar
            </h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              aria-label="Save changes"
              title="Save changes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Save
            </button>
          </div>

          {/* Add New Item Buttons */}
          <div className="mb-6 p-4 bg-gray-800 rounded-xl shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Add New Item</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addNewItem('link')}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
                title="Add a new link to the navbar"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                  </svg>
                  Add Link
                </span>
              </button>
              <button
                onClick={() => addNewItem('image')}
                className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
                title="Add a new image to the navbar"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Image
                </span>
              </button>
              <button
                onClick={() => addNewItem('text')}
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md transition-all col-span-2"
                title="Add text to the navbar"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add Text
                </span>
              </button>
            </div>
          </div>

          {selectedItem && (
            <div className="mb-8 border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Item Settings
                </h3>
                <button
                  onClick={() => deleteItem(selectedItem)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow hover:shadow-md flex items-center gap-1"
                  title="Delete this item"
                  aria-label="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              {/* Text and Link Settings */}
              <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Text
                </label>
                <input
                  type="text"
                  value={navItems.find(item => item.id === selectedItem)?.label || ''}
                  onChange={(e) => updateItemText(selectedItem, 'label', e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter text"
                  title="Item text content"
                />
              </div>

              {navItems.find(item => item.id === selectedItem)?.type === 'link' && (
                <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={navItems.find(item => item.id === selectedItem)?.link || ''}
                    onChange={(e) => updateItemText(selectedItem, 'link', e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., /about"
                    title="Link destination URL"
                  />
                </div>
              )}

              {/* Position Settings */}
              <div className="mb-6 border-b border-gray-700 pb-4">
                <div className="bg-gray-800 p-3 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    Position Settings
                  </h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Menu Position
                    </label>
                    <select
                      value={navItems.find(item => item.id === selectedItem)?.position}
                      onChange={(e) => updateItemPosition(selectedItem, e.target.value as 'left' | 'center' | 'right' | 'nav')}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Select item position in the navbar"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="nav">Navigation Menu</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Position Type
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.position || 'relative'}
                    onChange={(e) => updateItemStyle(selectedItem, 'position', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    title="Select position type"
                  >
                    <option value="relative">Default (Relative)</option>
                    <option value="absolute">Free Position (Absolute)</option>
                  </select>
                </div>

                {navItems.find(item => item.id === selectedItem)?.styles.position === 'absolute' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Top Position
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.top?.replace('%', '') || '0')}
                          onChange={(e) => updateItemStyle(selectedItem, 'top', `${e.target.value}%`)}
                          className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                          title="Top position percentage"
                          placeholder="Top %"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Left Position
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.left?.replace('%', '') || '0')}
                          onChange={(e) => updateItemStyle(selectedItem, 'left', `${e.target.value}%`)}
                          className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                          title="Left position percentage"
                          placeholder="Left %"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Margin Controls */}
              <div className="mb-6 border-b border-gray-700 pb-4">
                <h4 className="text-sm font-medium text-blue-300 mb-3">Margin Controls</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Top Margin
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginTop?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginTop', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      />
                      <span className="text-sm text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Right Margin
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginRight?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginRight', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      />
                      <span className="text-sm text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Bottom Margin
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginBottom?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginBottom', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      />
                      <span className="text-sm text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Left Margin
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginLeft?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginLeft', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      />
                      <span className="text-sm text-gray-400">px</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Settings */}
              {navItems.find(item => item.id === selectedItem)?.type === 'image' && (
                <>
                  <div className="mb-6 border-b border-gray-700 pb-4">
                    <h4 className="text-sm font-medium text-blue-300 mb-3">Image Settings</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Upload Image
                      </label>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 w-full"
                      >
                        Choose Image
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Object Fit
                      </label>
                      <select
                        value={navItems.find(item => item.id === selectedItem)?.styles.objectFit || 'contain'}
                        onChange={(e) => updateItemStyle(selectedItem, 'objectFit', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white"
                      >
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                        <option value="scale-down">Scale Down</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Width (px)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.width?.replace('px', '') || '40')}
                        onChange={(e) => updateItemStyle(selectedItem, 'width', `${e.target.value}px`)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">
                        {navItems.find(item => item.id === selectedItem)?.styles.width}
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Height (px)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.height?.replace('px', '') || '40')}
                        onChange={(e) => updateItemStyle(selectedItem, 'height', `${e.target.value}px`)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">
                        {navItems.find(item => item.id === selectedItem)?.styles.height}
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Border Radius (px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.borderRadius?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'borderRadius', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Text Styling */}
              <div className="mb-6 border-b border-gray-700 pb-4">
                <h4 className="text-sm font-medium text-blue-300 mb-3">Text Styling</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={navItems.find(item => item.id === selectedItem)?.styles.color || navStyles.color}
                    onChange={(e) => updateItemStyle(selectedItem, 'color', e.target.value)}
                    className="w-full h-10 rounded border"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Font Size (px)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.fontSize?.replace('px', '') || '16')}
                    onChange={(e) => updateItemStyle(selectedItem, 'fontSize', `${e.target.value}px`)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-400">
                    {navItems.find(item => item.id === selectedItem)?.styles.fontSize}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Font Family
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.fontFamily || navStyles.fontFamily}
                    onChange={(e) => updateItemStyle(selectedItem, 'fontFamily', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="">Use Global Font</option>
                    {fontFamilies.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Text Align
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.textAlign || 'left'}
                    onChange={(e) => updateItemStyle(selectedItem, 'textAlign', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Text Transform
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.textTransform || 'none'}
                    onChange={(e) => updateItemStyle(selectedItem, 'textTransform', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="none">None</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Letter Spacing (px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.letterSpacing?.replace('px', '') || '0')}
                    onChange={(e) => updateItemStyle(selectedItem, 'letterSpacing', `${e.target.value}px`)}
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Line Height
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="2"
                    step="0.1"
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2')}
                    onChange={(e) => updateItemStyle(selectedItem, 'lineHeight', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Additional Styling */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-300 mb-3">Additional Styling</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={navItems.find(item => item.id === selectedItem)?.styles.backgroundColor || 'transparent'}
                    onChange={(e) => updateItemStyle(selectedItem, 'backgroundColor', e.target.value)}
                    className="w-full h-10 rounded border"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.opacity || '1')}
                    onChange={(e) => updateItemStyle(selectedItem, 'opacity', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Z-Index
                  </label>
                  <input
                    type="number"
                    value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.zIndex || '1')}
                    onChange={(e) => updateItemStyle(selectedItem, 'zIndex', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Box Shadow
                  </label>
                  <input
                    type="text"
                    value={navItems.find(item => item.id === selectedItem)?.styles.boxShadow || 'none'}
                    onChange={(e) => updateItemStyle(selectedItem, 'boxShadow', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="e.g., 0 2px 4px rgba(0,0,0,0.1)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Global Settings */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Global Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background Color */}
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Navbar Background
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={navStyles.backgroundColor}
                    onChange={(e) => setNavStyles({...navStyles, backgroundColor: e.target.value})}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    aria-label="Navbar background color"
                    title="Select navbar background color"
                  />
                  <span className="text-sm">{navStyles.backgroundColor}</span>
                </div>
              </div>

              {/* Global Text Color */}
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Global Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={navStyles.color}
                    onChange={(e) => setNavStyles({...navStyles, color: e.target.value})}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    aria-label="Global text color"
                    title="Select global text color"
                  />
                  <span className="text-sm">{navStyles.color}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-800 p-3 rounded-lg">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Global Font Family
              </label>
              <select
                value={navStyles.fontFamily}
                onChange={(e) => setNavStyles({...navStyles, fontFamily: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Global font family"
                title="Select global font family"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Padding */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Navbar Padding
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.5"
                  value={parseFloat(navStyles.padding)}
                  onChange={(e) => setNavStyles({...navStyles, padding: `${e.target.value}rem`})}
                  className="w-full accent-blue-500"
                  aria-label="Navbar padding"
                  title="Adjust navbar padding"
                />
                <span className="text-sm bg-gray-700 px-2 py-1 rounded">{navStyles.padding}</span>
              </div>
            </div>
          </div>

          {/* AI Chat Interface */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              AI Assistant
            </h3>
            
            {/* Add AIChat component */}
            {apiKey ? (
            <div className="bg-gray-800 p-2 rounded-xl shadow-inner">
              <AIChat 
                apiKey={apiKey}
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
                currentConfig={{
                  navbarConfig: {
                    // @ts-expect-error - Types from different imports are incompatible but functionality is correct
                    items: navItems,
                    styles: navStyles
                  },
                  heroConfig: null,
                  collectionConfig: null
                }}
                // @ts-expect-error - Handling type mismatches between different WebsiteConfig imports
                onConfigUpdate={handleAIConfigUpdate}
              />
            </div>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Please provide an API key to use the AI assistant.
                </p>
              </div>
          )}
          </div>
          
          {/* Mobile optimization: Bottom bar with save button for small screens */}
          <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 p-4 border-t border-gray-700 flex justify-center z-[10000]">
            <button
              onClick={handleSave}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg"
              aria-label="Save changes (mobile)"
              title="Save changes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
