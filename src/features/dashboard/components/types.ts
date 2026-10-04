export type PostStatus = "live" | "in_progress" | "completed" | "expired" | "cancelled";
export type ResponseStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface DashboardPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget?: string;
  timeline?: string;
  status: PostStatus;
  expiresAt?: string;
  responsesCount: number;
  hasConversation?: boolean;
  createdAt?: string;
  author?: DashboardUser;
}

export interface DashboardUser {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
  location?: { coordinates?: [number, number] } | string;
}

export interface DashboardResponse {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: ResponseStatus;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  respondedBy: DashboardUser & { email?: string };
  trustScore?: number;
  averageRating?: number;
  conversationId?: string;
}

export interface SubmittedResponse {
  _id: string;
  postId: DashboardPost & { author: DashboardUser };
  message: string;
  answers: { question: string; answer: string }[];
  status: ResponseStatus;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  conversationId?: string;
}

export interface DashboardConversation {
  _id: string;
  post?: { _id: string };
  postId?: string;
  responseId?: string;
}