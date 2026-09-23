export type SessionStatus = 'Pending' | 'Accepted' | 'Declined' | 'Completed';

export interface StudentUser {
  id: string;
  regNo: string;
  name: string;
  department: string;
  year: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  badges: string[];
  skillsToTeach: string[];
  skillsToLearn: string[];
  bio: string;
  availability: string;
}

export interface SessionRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRegNo: string;
  peerId: string;
  peerName: string;
  skill: string;
  preferredDate: string;
  preferredTime: string;
  sessionMode: 'in_person' | 'online';
  locationOrLink?: string;
  optionalMessage?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  senderName: string;
  title: string;
  message: string;
  type: 'session_request' | 'session_accepted' | 'session_declined';
  requestId: string;
  read: boolean;
  createdAt: string;
}
