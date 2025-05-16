/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HeroItem {
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

export interface HeroStyles {
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

export interface HeroProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCloseSidebar?: () => void;
  onSave?: () => void;
  savedItems?: HeroItem[] | null;
  savedStyles?: HeroStyles | null;
  apiKey?: string;
  onItemsChange?: (items: HeroItem[]) => void;
  onStylesChange?: (styles: HeroStyles) => void;
  onAIConfigUpdate?: (newConfig: WebsiteConfig) => void;
  componentId?: number;
  useDirectSave?: boolean;
}

export interface WebsiteConfig {
  heroConfig?: {
    items: HeroItem[];
    styles: HeroStyles;
  } | null;

  navbarConfig?: any;
  collectionConfig?: any;
  productConfig?: any;
  footerConfig?: any;
}

export interface SortableItemProps {
  item: HeroItem;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: HeroStyles;
}

export const defaultHeroItems: HeroItem[] = [
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
];

export const defaultHeroStyles: HeroStyles = {
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
};

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