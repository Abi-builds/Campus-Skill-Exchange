import { SessionRating, EarnedBadge, AppNotification } from '../types';
import { db } from './database';
import { INITIAL_BADGES } from './mockData';

export interface SubmitRatingPayload {
  sessionId: string;
  raterId: string;
  raterName: string;
  score: number; // 1 to 5
  comment: string;
}

/**
 * Story ID: SCRUM07-F003-BE-001 - Rating capture API
 * Story ID: SCRUM07-F003-BE-002 - Skill badge award service
 * Story ID: SCRUM07-F003-DB-001 - Ratings and badges data store
 */
export const ratingBadgeService = {
  /**
   * Submit post-session rating and feedback.
   * AC1: Validates session is completed, records rating linked to session and rated peer.
   * AC2: Rejects rating if session is NOT completed.
   */
  submitRating: async (
    payload: SubmitRatingPayload
  ): Promise<{ rating: SessionRating; newBadges: EarnedBadge[] }> => {
    const requests = db.getRequests();
    const session = requests.find((r) => r.id === payload.sessionId);

    if (!session) {
      throw new Error(`Session ${payload.sessionId} not found.`);
    }

    // AC2: Reject rating for non-completed session
    if (session.status !== 'Completed') {
      throw new Error('Rating Rejected: You can only rate sessions that are marked as Completed.');
    }

    // Determine the peer being rated (if rater is requester, rated is peer/teacher; and vice versa)
    const ratedPeerId =
      payload.raterId === session.requesterId ? session.peerId : session.requesterId;
    const ratedPeerName =
      payload.raterId === session.requesterId ? session.peerName : session.requesterName;

    // Check if already rated
    const existingRatings = db.getRatings();
    const alreadyRated = existingRatings.some(
      (r) => r.sessionId === payload.sessionId && r.raterId === payload.raterId
    );
    if (alreadyRated) {
      throw new Error('You have already submitted a rating for this session.');
    }

    const newRating: SessionRating = {
      id: `rate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sessionId: payload.sessionId,
      raterId: payload.raterId,
      raterName: payload.raterName,
      ratedPeerId,
      ratedPeerName,
      score: Math.min(5, Math.max(1, payload.score)),
      comment: payload.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    existingRatings.unshift(newRating);
    db.saveRatings(existingRatings);

    // Mark session as rated
    session.isRated = true;
    db.saveRequests(requests);

    // Recalculate rated student's aggregate rating
    const studentRatings = existingRatings.filter((r) => r.ratedPeerId === ratedPeerId);
    const sum = studentRatings.reduce((acc, curr) => acc + curr.score, 0);
    const avgRating = Number((sum / studentRatings.length).toFixed(1));

    const students = db.getStudents();
    const studentIdx = students.findIndex((s) => s.id === ratedPeerId);
    if (studentIdx !== -1) {
      students[studentIdx].rating = avgRating;
      students[studentIdx].totalReviews = studentRatings.length;
      db.saveStudents(students);
    }

    // Story ID: SCRUM07-F003-BE-002 - Evaluate and award badges for the rated peer
    const newBadges = await ratingBadgeService.evaluateAndAwardBadges(ratedPeerId);

    // Notify the rated student about new review
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: ratedPeerId,
      senderName: payload.raterName,
      title: `New Rating Received: ${payload.score} ⭐`,
      message: `"${payload.comment || 'Great learning session!'}"`,
      type: 'session_rated',
      requestId: session.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifs = db.getNotifications();
    notifs.unshift(notif);
    db.saveNotifications(notifs);

    return { rating: newRating, newBadges };
  },

  /**
   * Evaluates student's activity against badge criteria and awards new badges.
   * Story ID: SCRUM07-F003-BE-002
   */
  evaluateAndAwardBadges: async (studentId: string): Promise<EarnedBadge[]> => {
    const students = db.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (!student) return [];

    const existingBadges = db.getBadges().filter((b) => b.studentId === studentId);
    const existingBadgeKeys = new Set(existingBadges.map((b) => b.badgeKey));

    const requests = db.getRequests();
    const ratings = db.getRatings().filter((r) => r.ratedPeerId === studentId);

    // Completed sessions where student taught
    const taughtCompleted = requests.filter(
      (r) => r.peerId === studentId && r.status === 'Completed'
    );
    // Completed sessions where student learned
    const learnedCompleted = requests.filter(
      (r) => r.requesterId === studentId && r.status === 'Completed'
    );

    const newlyAwarded: EarnedBadge[] = [];

    // Criterion 1: First Exchange
    if (!existingBadgeKeys.has('first_session') && (taughtCompleted.length > 0 || learnedCompleted.length > 0)) {
      const template = INITIAL_BADGES.first_session;
      const b: EarnedBadge = {
        id: `badge-${studentId}-${Date.now()}-1`,
        studentId,
        badgeKey: 'first_session',
        name: template.name,
        description: template.description,
        icon: template.icon,
        criteria: template.criteria,
        awardedAt: new Date().toISOString(),
      };
      newlyAwarded.push(b);
    }

    // Criterion 2: Top Mentor (taught 1+ completed sessions with rating >= 4.5)
    if (!existingBadgeKeys.has('top_mentor') && taughtCompleted.length >= 1 && student.rating >= 4.5) {
      const template = INITIAL_BADGES.top_mentor;
      const b: EarnedBadge = {
        id: `badge-${studentId}-${Date.now()}-2`,
        studentId,
        badgeKey: 'top_mentor',
        name: template.name,
        description: template.description,
        icon: template.icon,
        criteria: template.criteria,
        awardedAt: new Date().toISOString(),
      };
      newlyAwarded.push(b);
    }

    // Criterion 3: Skill Pioneer (offers 3 or more teach skills)
    if (!existingBadgeKeys.has('multi_skill') && student.skillsToTeach.length >= 3) {
      const template = INITIAL_BADGES.multi_skill;
      const b: EarnedBadge = {
        id: `badge-${studentId}-${Date.now()}-3`,
        studentId,
        badgeKey: 'multi_skill',
        name: template.name,
        description: template.description,
        icon: template.icon,
        criteria: template.criteria,
        awardedAt: new Date().toISOString(),
      };
      newlyAwarded.push(b);
    }

    // Save newly awarded badges to datastore
    if (newlyAwarded.length > 0) {
      const allBadges = db.getBadges();
      allBadges.push(...newlyAwarded);
      db.saveBadges(allBadges);

      // Create notification for student
      const notifs = db.getNotifications();
      newlyAwarded.forEach((badge) => {
        notifs.unshift({
          id: `notif-badge-${Date.now()}-${badge.id}`,
          recipientId: studentId,
          senderName: 'Campus Recognition Board',
          title: `New Badge Unlocked: ${badge.name}! 🏆`,
          message: badge.description,
          type: 'badge_awarded',
          read: false,
          createdAt: new Date().toISOString(),
        });
      });
      db.saveNotifications(notifs);
    }

    return newlyAwarded;
  },

  getStudentRatings: (studentId: string): SessionRating[] => {
    return db.getRatings().filter((r) => r.ratedPeerId === studentId);
  },

  getAllBadgesForStudent: (studentId: string): EarnedBadge[] => {
    return db.getBadges().filter((b) => b.studentId === studentId);
  },
};
