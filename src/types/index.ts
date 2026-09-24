export type SkillType = 'teach' | 'learn';
export type SessionStatus = 'Pending' | 'Accepted' | 'Declined' | 'Completed';

export interface StudentSkill {
  id: string;
  studentId: string;
  skillName: string;
  type: SkillType;
}

export interface EarnedBadge {
  id: string;
  studentId: string;
  badgeKey: 'first_session' | 'top_mentor' | 'multi_skill' | 'quick_learner';
  name: string;
  description: string;
  icon: string;
  criteria: string;
  awardedAt: string;
}

export interface StudentUser {
  id: string;
  regNo: string;
  name: string;
  department: string;
  year: string;
  avatar: string;
  bio: string;
  availability: string;
  rating: number;
  totalReviews: number;
  skillsToTeach: string[];
  skillsToLearn: string[];
  badges: EarnedBadge[];
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
  completedAt?: string;
  isRated?: boolean;
}

export interface SessionRating {
  id: string;
  sessionId: string;
  raterId: string;
  raterName: string;
  ratedPeerId: string;
  ratedPeerName: string;
  score: number; // 1 to 5 stars
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  senderName: string;
  title: string;
  message: string;
  type: 'session_request' | 'session_accepted' | 'session_declined' | 'session_completed' | 'session_rated' | 'badge_awarded';
  requestId?: string;
  read: boolean;
  createdAt: string;
}
