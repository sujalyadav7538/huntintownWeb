export interface UserSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface User {
  /** MongoDB ObjectId string — always present after fetch */
  _id?: string;
  /** Custom UUID stored as `id` in userSchema */
  id: string;
  name: string;
  email?: string;
  avatar: string;
  avatar_public_id?: string;
  coverImage?: string;
  role: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  bio?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  // Trust metrics
  rating?: number;
  totalReviews?: number;
  completedJobs?: number;
  reputation?: number;
  // Verification
  isEmailVerified?: boolean;
  isGovernmentVerified?: boolean;
  governmentVerificationStatus?: "none" | "pending" | "verified" | "rejected";
  // Account
  isActive?: boolean;
  lastSeen?: string;
  // Counters
  postsCount?: number;
  offersSubmittedCount?: number;
  offersAcceptedCount?: number;
  // UI-only / legacy compat
  joinedAt?: string;
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
  _id?: string;
  id?: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  isOffer?: boolean;
  offerBudget?: string;
  offerDuration?: string;
  answers?: { question: string; answer: string }[];
}

/** Matches offerSchema in backend */
export interface Offer {
  _id: string;
  postId: string;
  offeredBy: User;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  /** MongoDB ObjectId string */
  _id?: string;
  /** Mapped from _id for consistent frontend use */
  id: string;
  title: string;
  description: string;
  category: string;
  /** Human-readable address */
  address: string;
  /** GeoJSON location object */
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: "help_needed";
  budget?: string;
  timeline?: string;
  author: User;
  createdAt: string;
  expiresAt: string;
  expiryDays?: number;
  questions?: string[];
  images?: string[];
  contactMethods?: {
    whatsApp?: boolean;
    phone?: boolean;
    chat?: boolean;
  };
  /** Raw backend status values */
  status: "live" | "in_progress" | "completed" | "expired" | "cancelled";
  comments: Comment[];
  offersCount: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id?: string;
    id?: string;
    name: string;
    avatar: string;
  };
  text: string;
  isRead: boolean;
  readBy?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  post?: {
    _id: string;
    title: string;
    category: string;
    budget?: string;
    location?: string;
    status?: string;
  };
  offerId?: string;
  participants: User[];
  status: string;
  lastMessage?: string;
  lastMessageAt?: string;
  /** Frontend-only unread counter — not returned by backend */
  unreadCount?: number;
}
