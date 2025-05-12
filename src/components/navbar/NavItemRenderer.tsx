'use client';

import Link from 'next/link';
import { NavItem, NavbarStyles } from './types';

interface NavItemRendererProps {
  item: NavItem;
  isEditing: boolean;
  globalStyles: NavbarStyles;
  onSelect?: () => void;
}

export default function NavItemRenderer({ 
  item, 
  isEditing, 
  globalStyles,
  onSelect 
}: NavItemRendererProps) {
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

  // Handle double click on item
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isEditing && onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect();
      console.log("Double-clicked on item:", id);
    }
  };

  // Handle click on item (prevent navigation when in edit mode)
  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (type === 'image' && imageUrl) {
    return (
      <div 
        className={`flex items-center ${isEditing ? 'cursor-default' : 'cursor-pointer'} ${isEditing ? 'hover:outline hover:outline-blue-400 hover:outline-dashed hover:outline-1' : ''}`}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {isEditing ? (
          <div 
            className="relative" 
            style={{
              width: styles.width || '40px',
              height: styles.height || '40px',
              ...itemStyle
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
        ) : (
          <Link href={link} className="flex items-center">
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
        )}
      </div>
    );
  }

  if (type === 'link') {
    return isEditing ? (
      <span
        style={itemStyle}
        className={`nav-link hover:text-blue-600 transition-colors ${isEditing ? 'hover:outline hover:outline-blue-400 hover:outline-dashed hover:outline-1 px-2 py-1' : ''}`}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        {label}
      </span>
    ) : (
      <Link 
        href={link} 
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
    <span 
      style={itemStyle}
      className={isEditing ? 'hover:outline hover:outline-blue-400 hover:outline-dashed hover:outline-1 px-2 py-1' : ''}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {label}
    </span>
  );
} 