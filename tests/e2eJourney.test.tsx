import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../src/services/database';
import { profileService } from '../src/services/profileService';
import { searchService } from '../src/services/searchService';
import { sessionService } from '../src/services/sessionService';
import { ratingBadgeService } from '../src/services/ratingBadgeService';

describe('Story ID: SCRUM07-E2E-001 - End-to-End Student Journey', () => {
  beforeEach(() => {
    localStorage.clear();
    db.resetAll();
  });

  it('executes full student lifecycle: profile setup -> search -> request -> accept -> complete -> rate -> badge award', async () => {
    // 1. Student A (Abinaya) updates profile to learn "Embedded C"
    const profileA = await profileService.getProfile('user-2024506117');
    expect(profileA).not.toBeNull();

    await profileService.updateProfile('user-2024506117', {
      name: profileA!.name,
      department: profileA!.department,
      year: profileA!.year,
      bio: profileA!.bio,
      availability: profileA!.availability,
      skillsToTeach: profileA!.skillsToTeach,
      skillsToLearn: [...profileA!.skillsToLearn, 'Embedded C'],
    });

    // 2. Student A searches for peers who can teach "Embedded C"
    const matchingPeers = await searchService.searchPeersBySkill('Embedded C', undefined, 'user-2024506117');
    expect(matchingPeers.length).toBeGreaterThan(0);
    const peerKaviya = matchingPeers.find((p) => p.name === 'Kaviya R');
    expect(peerKaviya).toBeDefined();

    // 3. Student A sends a learning-session request to Kaviya (AC1: Pending status & recipient notified)
    const { request, notification } = await sessionService.createSessionRequest({
      requesterId: 'user-2024506117',
      requesterName: 'Abinaya K',
      requesterRegNo: '2024506117',
      peerId: peerKaviya!.id,
      peerName: peerKaviya!.name,
      skill: 'Embedded C',
      preferredDate: '2026-10-01',
      preferredTime: '15:00 - 16:00',
      sessionMode: 'in_person',
      optionalMessage: 'Hi Kaviya, I would love to learn microcontrollers!',
    });

    expect(request.status).toBe('Pending');
    expect(notification.recipientId).toBe(peerKaviya!.id);

    // 4. Kaviya accepts the session request (AC2: status transitions to 'Accepted')
    const acceptedRequest = await sessionService.acceptSessionRequest(request.id, peerKaviya!.name);
    expect(acceptedRequest.status).toBe('Accepted');

    // 5. Session takes place and is marked as Completed
    const completedRequest = await sessionService.completeSession(request.id, 'user-2024506117');
    expect(completedRequest.status).toBe('Completed');

    // 6. Student A rates Kaviya 5 stars for the completed session
    const { rating, newBadges } = await ratingBadgeService.submitRating({
      sessionId: completedRequest.id,
      raterId: 'user-2024506117',
      raterName: 'Abinaya K',
      score: 5,
      comment: 'Fantastic teacher, explained embedded registers with real hardware!',
    });

    expect(rating.score).toBe(5);
    expect(rating.ratedPeerId).toBe(peerKaviya!.id);

    // 7. Verify teaching peer (Kaviya) earns a skill badge upon first session completion
    expect(newBadges.some((b) => b.badgeKey === 'first_session')).toBe(true);

    const kaviyaBadges = ratingBadgeService.getAllBadgesForStudent(peerKaviya!.id);
    expect(kaviyaBadges.some((b) => b.badgeKey === 'first_session')).toBe(true);
  });

  it('Exception Path: if session request is declined, no completion or badge award occurs', async () => {
    // 1. Send request
    const { request } = await sessionService.createSessionRequest({
      requesterId: 'user-2024506117',
      requesterName: 'Abinaya K',
      requesterRegNo: '2024506117',
      peerId: 'user-2024506007',
      peerName: 'Kaviya R',
      skill: 'Embedded C',
      preferredDate: '2026-10-01',
      preferredTime: '15:00 - 16:00',
      sessionMode: 'in_person',
    });

    // 2. Peer declines request
    const declined = await sessionService.declineSessionRequest(request.id, 'Kaviya R');
    expect(declined.status).toBe('Declined');

    // 3. Trying to complete or rate a declined session fails
    await expect(sessionService.completeSession(request.id, 'user-2024506117')).rejects.toThrow(
      /Only accepted sessions can be marked as completed/i
    );

    await expect(
      ratingBadgeService.submitRating({
        sessionId: request.id,
        raterId: 'user-2024506117',
        raterName: 'Abinaya K',
        score: 5,
        comment: 'Did not happen',
      })
    ).rejects.toThrow(/You can only rate sessions that are marked as Completed/i);
  });
});
