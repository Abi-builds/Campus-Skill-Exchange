import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../src/services/database';
import { sessionService } from '../src/services/sessionService';
import { ratingBadgeService } from '../src/services/ratingBadgeService';

describe('Story ID: SCRUM07-F003 - Ratings, Feedback & Skill Badges', () => {
  beforeEach(() => {
    localStorage.clear();
    db.resetAll();
  });

  it('SCRUM07-F003-BE-001 AC2: rejects rating submission for a non-completed session', async () => {
    // 1. Create a session request that is still 'Pending'
    const { request } = await sessionService.createSessionRequest({
      requesterId: 'user-2024506117',
      requesterName: 'Abinaya K',
      requesterRegNo: '2024506117',
      peerId: 'user-2024506107',
      peerName: 'Keerthivasan U',
      skill: 'Python for AI',
      preferredDate: '2026-09-30',
      preferredTime: '16:00 - 17:00',
      sessionMode: 'online',
    });

    expect(request.status).toBe('Pending');

    // 2. Attempt to rate non-completed session -> Should reject (AC2)
    await expect(
      ratingBadgeService.submitRating({
        sessionId: request.id,
        raterId: 'user-2024506117',
        raterName: 'Abinaya K',
        score: 5,
        comment: 'Great session!',
      })
    ).rejects.toThrow(/You can only rate sessions that are marked as Completed/i);
  });

  it('SCRUM07-F003-BE-001 AC1 & F003-BE-002 AC1: submits rating for completed session and evaluates badge criteria', async () => {
    // 1. Create session request
    const { request } = await sessionService.createSessionRequest({
      requesterId: 'user-2024506117',
      requesterName: 'Abinaya K',
      requesterRegNo: '2024506117',
      peerId: 'user-2024506043', // Kaviyun Ajees B (starts with 0 badges)
      peerName: 'Kaviyun Ajees B',
      skill: 'Flutter Mobile Dev',
      preferredDate: '2026-09-30',
      preferredTime: '16:00 - 17:00',
      sessionMode: 'in_person',
    });

    // 2. Accept session
    await sessionService.acceptSessionRequest(request.id, 'Kaviyun Ajees B');

    // 3. Complete session
    const completedSession = await sessionService.completeSession(request.id, 'user-2024506117');
    expect(completedSession.status).toBe('Completed');

    // 4. Submit rating for completed session (AC1)
    const { rating, newBadges } = await ratingBadgeService.submitRating({
      sessionId: completedSession.id,
      raterId: 'user-2024506117',
      raterName: 'Abinaya K',
      score: 5,
      comment: 'Excellent Flutter mentor! Explained state management clearly.',
    });

    expect(rating).toBeDefined();
    expect(rating.score).toBe(5);
    expect(rating.ratedPeerId).toBe('user-2024506043');

    // 5. Verify badge evaluation (F003-BE-002 AC1): Kaviyun completed his 1st session, so he earns 'First Exchange'
    expect(newBadges.some((b) => b.badgeKey === 'first_session')).toBe(true);

    const studentBadges = ratingBadgeService.getAllBadgesForStudent('user-2024506043');
    expect(studentBadges.some((b) => b.badgeKey === 'first_session')).toBe(true);
  });
});
