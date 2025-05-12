import { WebsiteConfig as BaseWebsiteConfig } from '../../types/websiteConfig';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  badge?: string;
  buttonText?: string;
  styles: {
    nameColor: string;
    descriptionColor: string;
    priceColor: string;
    fontSize: string;
    fontWeight: string;
    imageHeight: string;
    cardBackgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
    borderRadius: string;
    badgeColor: string;
    badgeTextColor: string;
    ratingColor: string;
    borderWidth: string;
    borderColor: string;
    objectFit: string;
    showDescription: boolean;
    showButton: boolean;
    showRating: boolean;
    showBadge: boolean;
    hoverEffect: string;
    animation: string;
    textTransform: string;
    fontFamily: string;
  };
}

export interface ProductStyles {
  backgroundColor: string;
  backgroundType?: 'color' | 'gradient';
  padding: string;
  gap: string;
  maxWidth: string;
  layout?: 'grid';
  gridColumns: number;
  containerPadding: string;
  fontFamily: string;
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
    textTransform: string;
  };
}

export interface ProductsProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: ProductItem[] | null;
  savedStyles?: ProductStyles | null;
  apiKey?: string;
  onItemsChange?: (items: ProductItem[]) => void;
  onStylesChange?: (styles: ProductStyles) => void;
  onAIConfigUpdate?: (newConfig: WebsiteConfig) => void;
}

export interface WebsiteConfig extends BaseWebsiteConfig {
  productsConfig?: {
    items: ProductItem[];
    styles: ProductStyles;
  };
}

export interface SortableProductItemProps {
  item: ProductItem; 
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: ProductStyles;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

export interface SidebarProductsProps {
  isEditing: boolean;
  selectedItem: string | null;
  productItems: ProductItem[];
  productStyles: ProductStyles;
  handleSave: () => void;
  addNewProduct: () => void;
  updateProductDetails: (itemId: string, field: keyof ProductItem, value: any) => void;
  updateProductStyle: (itemId: string, styleKey: string, value: string | boolean) => void;
  updateAllProductsStyle: (styleKey: string, value: string | boolean) => void;
  updateGlobalStyle: (styleKey: string, value: string | number | Record<string, string>) => void;
  deleteProduct: (itemId: string) => void;
  apiKey?: string;
  handleAIConfigUpdate: (newConfig: WebsiteConfig) => void;
  onItemsChange?: (items: ProductItem[]) => void;
  onStylesChange?: (styles: ProductStyles) => void;
  onCloseSidebar?: () => void;
}

export interface ProductsMainProps {
  productItems: ProductItem[];
  productStyles: ProductStyles;
  isEditing: boolean;
  selectedItem: string | null;
  setSelectedItem: (id: string | null) => void;
  onDragEnd: (event: any) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
  isMobile: boolean;
}

// Default sample products
export const defaultProducts: ProductItem[] = [
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

export const defaultProductStyles: ProductStyles = {
  backgroundColor: "#F3F4F6",
  backgroundType: "color",
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