export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // "Ring" | "Necklace" | "Earrings" | "Bangles" | "Bridal" | "Custom"
  subCategory?: string; // "Gold" | "Diamond" | "Silver" | "Contemporary" | "Heritage"
  imageUrl: string;
  metal: string; // "18K Gold" | "22K Yellow Gold" | "Platinum" | "Sterling Silver" | "Rose Gold"
  gems?: string; // "Certified Diamonds" | "Natural Gemstones" | "Emeralds" | "None"
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  role: string;
  imageUrl: string;
}

export interface RecommendationRequest {
  preference: string;
  metalType: string;
  occasion: string;
  budgetRange: string;
  category: string;
}

export interface RecommendationResponse {
  analysis: string;
  suggestedStyles: string[];
  tips: string[];
}
