'use client';

import Link from 'next/link';
import { NavItem, NavbarStyles } from './types';
import NavItemRenderer from './NavItemRenderer';

interface NavbarMainProps {
  navStyles: NavbarStyles;
  leftItems: NavItem[];
  navLinksItems: NavItem[];
  rightItems: NavItem[];
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isEditing: boolean;
  setSelectedItem?: (id: string) => void;
}

export default function NavbarMain({
  navStyles,
  leftItems,
  navLinksItems,
  rightItems,
  mobileMenuOpen,
  toggleMobileMenu,
  isEditing,
  setSelectedItem
}: NavbarMainProps) {
  return (
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
            {leftItems.map(item => (
              <NavItemRenderer 
                key={`nav-item-${item.id}`} 
                item={item} 
                isEditing={isEditing} 
                globalStyles={navStyles}
                onSelect={isEditing && setSelectedItem ? () => setSelectedItem(item.id) : undefined}
              />
            ))}
          </div>
          
          {/* Center/Navigation links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinksItems.map(item => (
              <NavItemRenderer 
                key={`nav-item-${item.id}`} 
                item={item} 
                isEditing={isEditing} 
                globalStyles={navStyles}
                onSelect={isEditing && setSelectedItem ? () => setSelectedItem(item.id) : undefined}
              />
            ))}
          </div>
          
          {/* Right section - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            {rightItems.map(item => (
              <NavItemRenderer 
                key={`nav-item-${item.id}`} 
                item={item} 
                isEditing={isEditing} 
                globalStyles={navStyles}
                onSelect={isEditing && setSelectedItem ? () => setSelectedItem(item.id) : undefined}
              />
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={mobileMenuOpen.toString()}
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
                  <NavItemRenderer 
                    item={item} 
                    isEditing={isEditing} 
                    globalStyles={navStyles}
                    onSelect={isEditing && setSelectedItem ? () => setSelectedItem(item.id) : undefined}
                  />
                </div>
              ))}
            </div>
            
            {/* Show right items in mobile menu */}
            <div className="flex flex-col space-y-3 py-2 border-t border-gray-200">
              {rightItems.map((item) => (
                <div key={`mobile-right-${item.id}`} className="px-3 mt-2">
                  <NavItemRenderer 
                    item={item} 
                    isEditing={isEditing} 
                    globalStyles={navStyles}
                    onSelect={isEditing && setSelectedItem ? () => setSelectedItem(item.id) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 