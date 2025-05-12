import { WebsiteConfig as BaseWebsiteConfig } from '../hero/types';

export interface CollectionItem {
  id: string;
  type: 'collection';
  title: string;
  imageUrl: string;
  link: string;
  position: string;
  styles: {
    color: string;
    fontSize: string;
    fontWeight: string;
    textTransform: string;
    letterSpacing: string;
    textAlign: string;
    imageOverlay: string;
    overlayOpacity: string;
    objectFit: string;
    height: string;
    borderRadius: string;
    hoverEffect: string;
    animation: string;
    animationDuration: string;
    animationDelay: string;
    fontFamily: string;
    imageFilter: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    width: string;
    boxShadow: string;
  };
}

export interface CollectionStyles {
  backgroundColor: string;
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  padding: string;
  gap: string;
  maxWidth: string;
  layout: 'grid' | 'flex' | 'masonry';
  gridColumns: number;
  aspectRatio?: string;
  containerPadding: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  sectionTitle: {
    text: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    textAlign?: string;
    margin: string;
    fontFamily: string;
  };
}

export interface CollectionProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: CollectionItem[] | null;
  savedStyles?: CollectionStyles | null;
  apiKey?: string;
  onItemsChange?: (items: CollectionItem[]) => void;
  onStylesChange?: (styles: CollectionStyles) => void;
  onAIConfigUpdate?: (newConfig: WebsiteConfig) => void;
}

export interface WebsiteConfig extends BaseWebsiteConfig {
  collectionConfig?: {
    items: CollectionItem[];
    styles: CollectionStyles;
  };
}

export interface SortableCollectionItemProps {
  item: CollectionItem;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: CollectionStyles;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

export interface SidebarCollectionProps {
  isEditing: boolean;
  collectionItems: CollectionItem[];
  collectionStyles: CollectionStyles;
  handleSave: () => void;
  updateGlobalStyle: (styleKey: string, value: string | number | Record<string, string>) => void;
  updateAllItemsStyle: (styleKey: string, value: string) => void;
  apiKey?: string;
  handleAIConfigUpdate: (newConfig: WebsiteConfig) => void;
  onItemsChange?: (items: CollectionItem[]) => void;
  onStylesChange?: (styles: CollectionStyles) => void;
  onCloseSidebar?: () => void;
}

export const defaultCollectionItems: CollectionItem[] = [
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
    id: 'col2',
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
    id: 'col3',
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
];

export const defaultCollectionStyles: CollectionStyles = {
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