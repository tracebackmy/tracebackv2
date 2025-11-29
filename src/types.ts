export type Role = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: number;
}

export type ItemStatus = 
  | 'Reported' // User lost item
  | 'Match Found' // System matched lost item
  | 'Pending Verification' // Admin found item, not public yet
  | 'Listed' // Public found item
  | 'Claimed' // Returned to owner
  | 'Resolved'; // Ticket closed

export interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  status: ItemStatus;
  userId?: string; // If lost, who reported it
  createdBy: string;
  createdAt: number;
}

export type ClaimStatus = 'Pending Review' | 'In Verification' | 'Approved - Pending Pickup' | 'Rejected' | 'Completed';

export interface Claim {
  id: string;
  itemId: string;
  userId: string; // The claimant
  itemTitle: string;
  proofDescription: string;
  evidenceUrl?: string;
  status: ClaimStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: 'Open' | 'Resolved';
  createdAt: number;
  lastMessageAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
  isAdmin: boolean;
}

export interface CCTVLog {
  id: string;
  station: string;
  timestamp: string;
  cameraAngle: string;
  detectedObjects: string[];
}