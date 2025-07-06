// Core user and artist types
export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist extends User {
  bio: string;
  craftCategories: CraftCategory[];
  location: Location;
  rates: Rate[];
  availability: Availability[];
  socialLinks: SocialLink[];
  achievements: Achievement[];
  reputation: Reputation;
  passport: ArtistPassport;
}

export interface CraftCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Location {
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Rate {
  id: string;
  serviceType: string;
  price: number;
  currency: string;
  duration?: string;
  description: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'award' | 'feature' | 'milestone';
}

export interface Reputation {
  rating: number;
  reviewCount: number;
  verified: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ArtistPassport {
  id: string;
  artistId: string;
  pastWorks: PastWork[];
  testimonials: Testimonial[];
  awards: Award[];
  downloadableEPK: string;
}

// Content and posting types
export interface Post {
  id: string;
  artistId: string;
  type: 'photo' | 'video' | 'text' | 'live';
  content: string;
  media: Media[];
  tags: string[];
  location?: Location;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  metadata: MediaMetadata;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  size: number;
  format: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

// Crowdfunding types
export interface CrowdfundingCampaign {
  id: string;
  artistId: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  currency: string;
  rewards: Reward[];
  supporters: Supporter[];
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  claimed: number;
  maxClaims?: number;
}

export interface Supporter {
  id: string;
  userId: string;
  amount: number;
  rewardId?: string;
  anonymous: boolean;
  message?: string;
  date: Date;
}

// Booking and collaboration types
export interface Booking {
  id: string;
  artistId: string;
  clientId: string;
  serviceType: string;
  date: Date;
  duration: number;
  rate: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requirements: string;
  location?: Location;
}

export interface Collaboration {
  id: string;
  participants: string[];
  projectType: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
  skills: string[];
  budget?: number;
  deadline?: Date;
}

// Store and marketplace types
export interface Product {
  id: string;
  artistId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: 'art' | 'music' | 'merch' | 'nft' | 'digital';
  media: Media[];
  inventory: number;
  tags: string[];
  status: 'active' | 'sold-out' | 'inactive';
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Live streaming and events
export interface LiveStream {
  id: string;
  artistId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'live' | 'ended';
  viewers: number;
  streamKey: string;
  chatEnabled: boolean;
}

export interface VirtualEvent {
  id: string;
  title: string;
  description: string;
  type: 'open-mic' | 'concert' | 'workshop' | 'exhibition';
  startTime: Date;
  endTime: Date;
  participants: string[];
  maxParticipants?: number;
  price?: number;
  status: 'upcoming' | 'live' | 'completed';
}

// AI and discovery types
export interface AITools {
  captionGeneration: (media: Media) => Promise<string>;
  styleFilter: (image: string, style: string) => Promise<string>;
  logoDesign: (requirements: string) => Promise<string>;
  contractGeneration: (booking: Booking) => Promise<string>;
}

export interface DiscoveryFilters {
  categories: string[];
  location: Location;
  priceRange: { min: number; max: number };
  rating: number;
  availability: Date[];
  skills: string[];
}

// Cultural heritage types
export interface CulturalZone {
  id: string;
  name: string;
  description: string;
  region: string;
  artForms: string[];
  artists: string[];
  events: VirtualEvent[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'document';
  url: string;
  description: string;
  tags: string[];
} 