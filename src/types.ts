export interface UserSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  rating?: number;
  reputation?: number;
  skills?: string[];
  joinedAt?: string;
  bio?: string;
  // Extended profile fields
  trustScore?: number;
  completedRequests?: number;
  successRate?: number;
  responseRate?: number;
  communityScore?: number;
  isVerified?: boolean;
  reviewCount?: number;
  socialLinks?: UserSocialLinks;
  services?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  isOffer?: boolean;
  offerBudget?: string;
  offerDuration?: string;
  answers?: { question: string; answer: string }[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  type: 'help_needed' | 'skill_offered';
  budget?: string; // e.g. "Volunteer / Free" or "Paid ($50)"
  author: User;
  createdAt: string;
  expiresAt: string; // Expiry timestamp (max 10 days from creation)
  expiryDays?: number; // Chosen expiry days during creation
  questions?: string[]; // Optional questions asked by poster
  status: 'open' | 'fulfilled' | 'cancelled';
  comments: Comment[];
  offersCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
