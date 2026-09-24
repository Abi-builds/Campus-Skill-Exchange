import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentUser,
  SessionRequest,
  SessionRating,
  AppNotification,
  EarnedBadge,
} from '../types';
import { db } from '../services/database';
import { INITIAL_STUDENTS } from '../services/mockData';
import { profileService, ProfileUpdatePayload } from '../services/profileService';
import { sessionService, CreateRequestPayload } from '../services/sessionService';
import { ratingBadgeService } from '../services/ratingBadgeService';

export type NavigationTab = 'search' | 'profile' | 'requests' | 'badges' | 'e2e';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStudent: StudentUser;
  allStudents: StudentUser[];
  selectedPeer: StudentUser;
  requests: SessionRequest[];
  ratings: SessionRating[];
  notifications: AppNotification[];
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  
  // Modals state
  showRequestModal: boolean;
  showProfileEditModal: boolean;
  showRatingModal: boolean;
  ratingSessionTarget: SessionRequest | null;
  showNotificationsDrawer: boolean;

  // Actions
  switchCurrentStudent: (studentId: string) => void;
  selectPeer: (peer: StudentUser) => void;
  openRequestModal: (peer?: StudentUser) => void;
  closeRequestModal: () => void;
  openProfileEditModal: () => void;
  closeProfileEditModal: () => void;
  openRatingModal: (session: SessionRequest) => void;
  closeRatingModal: () => void;
  toggleNotificationsDrawer: () => void;
  
  // Service calls
  updateStudentProfile: (payload: ProfileUpdatePayload) => Promise<StudentUser>;
  sendSessionRequest: (
    payload: Omit<CreateRequestPayload, 'requesterId' | 'requesterName' | 'requesterRegNo'>
  ) => Promise<void>;
  handleAcceptRequest: (requestId: string) => Promise<void>;
  handleDeclineRequest: (requestId: string) => Promise<void>;
  handleCompleteSession: (requestId: string) => Promise<void>;
  handleSubmitRating: (score: number, comment: string) => Promise<void>;
  
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('search');
  const [allStudents, setAllStudents] = useState<StudentUser[]>(INITIAL_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<StudentUser>(INITIAL_STUDENTS[0]);
  const [selectedPeer, setSelectedPeer] = useState<StudentUser>(INITIAL_STUDENTS[1]);
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [ratings, setRatings] = useState<SessionRating[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Modals
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingSessionTarget, setRatingSessionTarget] = useState<SessionRequest | null>(null);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const loadAllState = async () => {
    const students = await profileService.getAllProfiles();
    setAllStudents(students);

    if (!currentStudent && students.length > 0) {
      setCurrentStudent(students[0]); // Abinaya K
      setSelectedPeer(students[1]); // Keerthivasan U
    } else if (currentStudent) {
      const refreshed = students.find((s) => s.id === currentStudent.id) || students[0];
      setCurrentStudent(refreshed);
    }

    setRequests(db.getRequests());
    setRatings(db.getRatings());
    setNotifications(db.getNotifications());
  };

  useEffect(() => {
    loadAllState();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const switchCurrentStudent = async (studentId: string) => {
    const found = allStudents.find((s) => s.id === studentId);
    if (found) {
      setCurrentStudent(found);
      if (selectedPeer?.id === found.id) {
        const nextPeer = allStudents.find((s) => s.id !== found.id) || allStudents[0];
        setSelectedPeer(nextPeer);
      }
      triggerToast(`Switched active view to: ${found.name} (${found.regNo})`, 'info');
    }
  };

  const selectPeer = (peer: StudentUser) => {
    setSelectedPeer(peer);
  };

  const openRequestModal = (peer?: StudentUser) => {
    if (peer) setSelectedPeer(peer);
    setShowRequestModal(true);
  };

  const closeRequestModal = () => setShowRequestModal(false);

  const openProfileEditModal = () => setShowProfileEditModal(true);
  const closeProfileEditModal = () => setShowProfileEditModal(false);

  const openRatingModal = (session: SessionRequest) => {
    setRatingSessionTarget(session);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setRatingSessionTarget(null);
    setShowRatingModal(false);
  };

  const toggleNotificationsDrawer = () => setShowNotificationsDrawer((p) => !p);

  // SCRUM07-F001: Update profile
  const updateStudentProfile = async (payload: ProfileUpdatePayload): Promise<StudentUser> => {
    if (!currentStudent) throw new Error('No current student logged in');
    const updated = await profileService.updateProfile(currentStudent.id, payload);
    await loadAllState();
    closeProfileEditModal();
    triggerToast('Profile updated successfully! Skills are now updated and searchable.', 'success');
    return updated;
  };

  // SCRUM07-F002: Send session request
  const sendSessionRequest = async (
    payload: Omit<CreateRequestPayload, 'requesterId' | 'requesterName' | 'requesterRegNo'>
  ) => {
    if (!currentStudent) return;
    const { request } = await sessionService.createSessionRequest({
      ...payload,
      requesterId: currentStudent.id,
      requesterName: currentStudent.name,
      requesterRegNo: currentStudent.regNo,
    });
    await loadAllState();
    closeRequestModal();
    triggerToast(
      `Session request sent to ${payload.peerName}! Request status is 'Pending' (AC1).`,
      'success'
    );
  };

  // SCRUM07-F002: Accept request
  const handleAcceptRequest = async (requestId: string) => {
    if (!currentStudent) return;
    await sessionService.acceptSessionRequest(requestId, currentStudent.name);
    await loadAllState();
    triggerToast(`Session request accepted! Status changed to 'Accepted' (AC2).`, 'success');
  };

  // SCRUM07-F002: Decline request
  const handleDeclineRequest = async (requestId: string) => {
    if (!currentStudent) return;
    await sessionService.declineSessionRequest(requestId, currentStudent.name);
    await loadAllState();
    triggerToast(`Session request declined.`, 'info');
  };

  // SCRUM07-F003: Complete session
  const handleCompleteSession = async (requestId: string) => {
    if (!currentStudent) return;
    await sessionService.completeSession(requestId, currentStudent.id);
    await loadAllState();
    triggerToast(`Session marked as Completed! You can now rate and give feedback.`, 'success');
  };

  // SCRUM07-F003: Submit rating & feedback
  const handleSubmitRating = async (score: number, comment: string) => {
    if (!currentStudent || !ratingSessionTarget) return;

    const { rating, newBadges } = await ratingBadgeService.submitRating({
      sessionId: ratingSessionTarget.id,
      raterId: currentStudent.id,
      raterName: currentStudent.name,
      score,
      comment,
    });

    await loadAllState();
    closeRatingModal();

    if (newBadges.length > 0) {
      triggerToast(
        `Rating submitted! Peer earned new badge: ${newBadges.map((b) => b.name).join(', ')} 🏆`,
        'success'
      );
    } else {
      triggerToast(`Rating and feedback submitted successfully! ⭐`, 'success');
    }
  };

  const markAllNotificationsRead = () => {
    if (!currentStudent) return;
    const all = db.getNotifications();
    const updated = all.map((n) =>
      n.recipientId === currentStudent.id ? { ...n, read: true } : n
    );
    db.saveNotifications(updated);
    setNotifications(updated);
  };

  const resetAllData = () => {
    db.resetAll();
    loadAllState();
    triggerToast('All demo data has been reset to default state.', 'info');
  };

  if (!currentStudent || !selectedPeer) {
    return null;
  }

  const studentNotifications = notifications.filter(
    (n) => n.recipientId === currentStudent.id
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentStudent,
        allStudents,
        selectedPeer,
        requests,
        ratings,
        notifications: studentNotifications,
        toast,
        showRequestModal,
        showProfileEditModal,
        showRatingModal,
        ratingSessionTarget,
        showNotificationsDrawer,
        switchCurrentStudent,
        selectPeer,
        openRequestModal,
        closeRequestModal,
        openProfileEditModal,
        closeProfileEditModal,
        openRatingModal,
        closeRatingModal,
        toggleNotificationsDrawer,
        updateStudentProfile,
        sendSessionRequest,
        handleAcceptRequest,
        handleDeclineRequest,
        handleCompleteSession,
        handleSubmitRating,
        markAllNotificationsRead,
        resetAllData,
        clearToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
