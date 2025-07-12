export interface User {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalSwaps: number;
  joinDate: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'update' | 'maintenance';
  createdAt: string;
  isActive: boolean;
}