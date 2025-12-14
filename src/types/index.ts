export interface PhotoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Photo {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  location?: string;
  year?: number;
  description?: string;
  altText: string;
  width: number;
  height: number;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  thumbnailUrl: string;
  description?: string;
  year?: number;
  duration?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    instagram?: string;
    youtube?: string;
    email: string;
    phone?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stockQuantity?: number;
  imageUrl: string;
  category: 'print' | 'digital' | 'package';
  size?: string;
  isAvailable: boolean;
  paypalItemId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
