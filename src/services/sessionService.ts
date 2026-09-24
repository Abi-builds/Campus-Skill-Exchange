import { AppNotification, SessionRequest } from '../types';
import { db } from './database';

export interface CreateRequestPayload {
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
}

/**
 * Story ID: SCRUM07-F002-BE-002
 * Story ID: SCRUM07-F002-DB-001
 * Session request workflow API: Create, Accept, Decline, and Complete.
 */
export const sessionService = {
  getRequests: async (): Promise<SessionRequest[]> => {
    return db.getRequests();
  },

  createSessionRequest: async (
    payload: CreateRequestPayload
  ): Promise<{ request: SessionRequest; notification: AppNotification }> => {
    const newRequest: SessionRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      requesterId: payload.requesterId,
      requesterName: payload.requesterName,
      requesterRegNo: payload.requesterRegNo,
      peerId: payload.peerId,
      peerName: payload.peerName,
      skill: payload.skill,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      sessionMode: payload.sessionMode,
      locationOrLink:
        payload.sessionMode === 'in_person'
          ? payload.locationOrLink || 'Central Campus Library, 2nd Floor'
          : 'https://meet.google.com/skill-exchange-demo',
      optionalMessage: payload.optionalMessage?.trim() || undefined,
      status: 'Pending', // AC1
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRated: false,
    };

    const requests = db.getRequests();
    requests.unshift(newRequest);
    db.saveRequests(requests);

    // Notification for recipient (AC1)
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: payload.peerId,
      senderName: payload.requesterName,
      title: 'New Learning Session Request',
      message: `${payload.requesterName} sent you a learning-session request for "${payload.skill}".`,
      type: 'session_request',
      requestId: newRequest.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = db.getNotifications();
    notifications.unshift(newNotification);
    db.saveNotifications(notifications);

    return { request: newRequest, notification: newNotification };
  },

  acceptSessionRequest: async (
    requestId: string,
    peerName: string
  ): Promise<SessionRequest> => {
    const requests = db.getRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Request ${requestId} not found.`);

    const updated: SessionRequest = {
      ...requests[index],
      status: 'Accepted', // AC2
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    db.saveRequests(requests);

    // Notify requester (AC2)
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: updated.requesterId,
      senderName: peerName,
      title: 'Session Request Accepted! 🎉',
      message: `${peerName} accepted your session request for "${updated.skill}".`,
      type: 'session_accepted',
      requestId: updated.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = db.getNotifications();
    notifications.unshift(notif);
    db.saveNotifications(notifications);

    return updated;
  },

  declineSessionRequest: async (
    requestId: string,
    peerName: string
  ): Promise<SessionRequest> => {
    const requests = db.getRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Request ${requestId} not found.`);

    const updated: SessionRequest = {
      ...requests[index],
      status: 'Declined',
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    db.saveRequests(requests);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: updated.requesterId,
      senderName: peerName,
      title: 'Session Request Declined',
      message: `${peerName} could not accept your session request for "${updated.skill}".`,
      type: 'session_declined',
      requestId: updated.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = db.getNotifications();
    notifications.unshift(notif);
    db.saveNotifications(notifications);

    return updated;
  },

  /**
   * Completes an accepted session, enabling rating & feedback (SCRUM07-F003 trigger)
   */
  completeSession: async (
    requestId: string,
    actionUser: string
  ): Promise<SessionRequest> => {
    const requests = db.getRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error(`Request ${requestId} not found.`);

    if (requests[index].status !== 'Accepted') {
      throw new Error('Only accepted sessions can be marked as completed.');
    }

    const updated: SessionRequest = {
      ...requests[index],
      status: 'Completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    db.saveRequests(requests);

    // Notify both participants that session is complete and ready for feedback
    const otherUserId =
      actionUser === updated.requesterId ? updated.peerId : updated.requesterId;
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: otherUserId,
      senderName: 'Campus SkillExchange',
      title: 'Session Completed! ⭐ Rate Your Experience',
      message: `Your learning session on "${updated.skill}" is complete. Leave feedback to help your peer earn skill badges!`,
      type: 'session_completed',
      requestId: updated.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = db.getNotifications();
    notifications.unshift(notif);
    db.saveNotifications(notifications);

    return updated;
  },
};
