import { AppNotification, SessionRequest, SessionStatus } from '../types';

const STORAGE_KEY_REQUESTS = 'campus_skill_exchange_requests';
const STORAGE_KEY_NOTIFS = 'campus_skill_exchange_notifications';

// Helper to load requests from localStorage
export const getStoredRequests = (): SessionRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading requests from localStorage', err);
    return [];
  }
};

// Helper to save requests
export const saveRequests = (requests: SessionRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed saving requests to localStorage', err);
  }
};

// Helper to load notifications
export const getStoredNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading notifications', err);
    return [];
  }
};

// Helper to save notifications
export const saveNotifications = (notifs: AppNotification[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed saving notifications', err);
  }
};

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
 * Story ID: SCRUM07-F002-UI-002
 * AC1: Creates session request with status 'Pending' and notifies recipient.
 */
export const createSessionRequest = async (
  payload: CreateRequestPayload
): Promise<{ request: SessionRequest; notification: AppNotification }> => {
  // Simulate network latency (250ms)
  await new Promise((res) => setTimeout(res, 250));

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
    status: 'Pending', // AC1 requirement
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const requests = getStoredRequests();
  requests.unshift(newRequest);
  saveRequests(requests);

  // Create notification for recipient (AC1 requirement)
  const newNotification: AppNotification = {
    id: `notif-${Date.now()}`,
    recipientId: payload.peerId,
    senderName: payload.requesterName,
    title: 'New Learning Session Request',
    message: `${payload.requesterName} sent you a session request for "${payload.skill}".`,
    type: 'session_request',
    requestId: newRequest.id,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const notifications = getStoredNotifications();
  notifications.unshift(newNotification);
  saveNotifications(notifications);

  return { request: newRequest, notification: newNotification };
};

/**
 * Story ID: SCRUM07-F002-UI-002
 * AC2: Recipient accepts request, updating status to 'Accepted' visible to both students.
 */
export const acceptSessionRequest = async (
  requestId: string,
  peerName: string
): Promise<SessionRequest> => {
  await new Promise((res) => setTimeout(res, 250));

  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error(`Session request ${requestId} not found`);
  }

  const updated: SessionRequest = {
    ...requests[index],
    status: 'Accepted', // AC2 requirement
    updatedAt: new Date().toISOString(),
  };

  requests[index] = updated;
  saveRequests(requests);

  // Notify requester that request was accepted
  const newNotification: AppNotification = {
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

  const notifications = getStoredNotifications();
  notifications.unshift(newNotification);
  saveNotifications(notifications);

  return updated;
};

/**
 * Decline a session request
 */
export const declineSessionRequest = async (
  requestId: string,
  peerName: string
): Promise<SessionRequest> => {
  await new Promise((res) => setTimeout(res, 250));

  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error(`Session request ${requestId} not found`);
  }

  const updated: SessionRequest = {
    ...requests[index],
    status: 'Declined',
    updatedAt: new Date().toISOString(),
  };

  requests[index] = updated;
  saveRequests(requests);

  const newNotification: AppNotification = {
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

  const notifications = getStoredNotifications();
  notifications.unshift(newNotification);
  saveNotifications(notifications);

  return updated;
};

/**
 * Clear data helper for clean testing / demonstration reset
 */
export const resetDemoData = (): void => {
  localStorage.removeItem(STORAGE_KEY_REQUESTS);
  localStorage.removeItem(STORAGE_KEY_NOTIFS);
};
