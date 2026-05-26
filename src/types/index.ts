export interface Project {
  id: string;
  name: string;
  location: string;
  type: 'apartment' | 'house' | 'commercial';
  status: 'available' | 'reserved' | 'sold' | 'inProgress';
  price: string;
  units: number;
  image: string;
  year: number;
  slug: string;
  websiteUrl?: string;
}

export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';

export type SellFormValues = {
  name: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  estimatedValue: string;
  message: string;
};

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'market' | 'design' | 'investment' | 'lifestyle';
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  content: string[];
}
