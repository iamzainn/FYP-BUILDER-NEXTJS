/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Style {
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

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface HeroItem {
  id: string;
  type: string;
  content?: string;
  link?: string;
  position?: string;
  styles: Record<string, string>;
  imageUrl?: string;
  animation?: string;
}

export interface HeroStyles {
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

export interface HeroConfig {
  items: HeroItem[];
  styles: HeroStyles;
}

export interface WebsiteConfig {
  navbarConfig?: {
    items: NavItem[];
    styles: NavbarStyles;
  } | null;
  heroConfig?: HeroConfig | null;
  collectionConfig?: any | null;
}

// Default values for new navbars
export const defaultNavItems: NavItem[] = [
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

export const defaultNavStyles: NavbarStyles = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  fontFamily: 'Inter',
  color: '#1e40af',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

// Common configuration
export const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'system-ui',
  'Roboto',
  'Open Sans'
]; 