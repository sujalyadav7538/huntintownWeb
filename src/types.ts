export interface UserSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface UserLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface User {
  // Identity
  _id: string;
  id: string;

  // Authentication / basic profile
  email: string;
  name: string;
  bio: string;
  about: string;
  role: string;

  // Images
  avatar: string;
  avatar_public_id: string;
  coverImage: string;
  coverImage_public_id: string;

  // Contact
  phone: string;
  website: string;

  // Skills
  skills: string[];

  // Address
  address: string;
  location?: UserLocation;

  // Verification
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isGovernmentVerified: boolean;
  governmentVerificationStatus: string;

  // Account
  isActive: boolean;
  googleId?: string | null;
  isOnline: boolean;
  lastSeen: string;

  // Relations
  // showcase?: string | UserShowcase;

  // Metrics
  metric?: UserMetric;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  joinedAt: string;
}

// ── Reputation System ─────────────────────────────────────────────────────────

export interface UserMetric {
  reviewMetrics: {
    averageRating: number;
    totalReviews: number;
    totalStars: number;
    score: number;
  };
  profileMetrics: {
    completion: number;
    score: number;
  };
  helperMetrics: {
    responsesSubmitted: number;
    responsesAccepted: number;
    acceptanceScore: number;
    completedResponses: number;
    cancelledResponses: number;
    completionScore: number;
  };
  hunterMetrics: {
    postsCreated: number;
    postsCompleted: number;
    postsCancelled: number;
    completionScore: number;
    responsesReceived: number;
    responsesAccepted: number;
    acceptanceScore: number;
  };
  responseMetrics: {
    totalResponseRequests: number;
    totalResponses: number;
    averageResponseTime: number;
    responseRate: number;
    responseScore: number;
  };
  activityMetrics: {
    activeDays: number;
    score: number;
  };
  trustScore: number;
}

export interface UserBadgeItem {
  badgeId: string;
  level: "bronze" | "silver" | "gold" | string;
  earnedAt: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary" | string;
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

/** Matches responseSchema in backend */
export interface Response {
  _id: string;
  postId: string;
  respondedBy: User;
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
  responsesCount: number;
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
  content?: string;
  messageType?: "text" | "image" | "video" | "audio" | "document";
  attachment?: {
    url?: string;
    publicId?: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
    thumbnail?: string;
  };
  isRead: boolean;
  readBy?: string[];
  createdAt: string;
  updatedAt?: string;
  /** Frontend-only: tracks optimistic send lifecycle */
  sendStatus?: "sending" | "sent" | "failed";
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
  responseId?: string;
  participants: User[];
  status: string;
  lastMessage?: string;
  lastMessageAt?: string;
  /** Frontend-only unread counter — not returned by backend */
  unreadCount?: number;
}

/** Aggregated post entry returned by GET /api/chat/posts — used in the messaging post picker */
export interface ChatPost {
  _id: string;
  title: string;
  category: string;
  budget?: string;
  location?: string;
  status: string;
  conversationCount: number;
  lastMessageAt?: string;
}

export interface ActivityPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  address?: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  questions?: string[];
  author: { _id?: string; name: string; avatar: string };
}

export interface ActivityResponse {
  _id: string;
  postId: ActivityPost;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
