import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification, SessionRequest, StudentUser } from '../types';
import { INITIAL_STUDENTS } from '../services/mockData';
import {
  acceptSessionRequest,
  createSessionRequest,
  declineSessionRequest,
  getStoredNotifications,
  getStoredRequests,
  saveNotifications,
  CreateRequestPayload,
} from '../services/sessionService';

interface AppContextType {
  currentStudent: StudentUser;
  allStudents: StudentUser[];
  selectedPeer: StudentUser;
  requests: SessionRequest[];
  notifications: AppNotification[];
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showRequestModal: boolean;
  showNotificationsDrawer: boolean;
  switchCurrentStudent: (userId: string) => void;
  selectPeer: (peer: StudentUser) => void;
  openRequestModal: (peer?: StudentUser) => void;
  closeRequestModal: () => void;
  toggleNotificationsDrawer: () => void;
  sendSessionRequest: (
    payload: Omit<CreateRequestPayload, 'requesterId' | 'requesterName' | 'requesterRegNo'>
  ) => Promise<void>;
  handleAcceptRequest: (requestId: string) => Promise<void>;
  handleDeclineRequest: (requestId: string) => Promise<void>;
  markAllNotificationsRead: () => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allStudents] = useState<StudentUser[]>(INITIAL_STUDENTS);
  // Default logged-in user: Abinaya K
  const [currentStudent, setCurrentStudent] = useState<StudentUser>(INITIAL_STUDENTS[0]);
  // Default selected peer: Keerthivasan U
  const [selectedPeer, setSelectedPeer] = useState<StudentUser>(INITIAL_STUDENTS[1]);
  
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load requests and notifications from storage on startup
  useEffect(() => {
    setRequests(getStoredRequests());
    setNotifications(getStoredNotifications());
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const switchCurrentStudent = (userId: string) => {
    const student = allStudents.find((s) => s.id === userId);
    if (student) {
      setCurrentStudent(student);
      // Auto-select another student as peer if matching current
      if (selectedPeer.id === student.id) {
        const nextPeer = allStudents.find((s) => s.id !== student.id) || INITIAL_STUDENTS[0];
        setSelectedPeer(nextPeer);
      }
      triggerToast(`Switched active view to: ${student.name} (${student.regNo})`, 'info');
    }
  };

  const selectPeer = (peer: StudentUser) => {
    setSelectedPeer(peer);
  };

  const openRequestModal = (peer?: StudentUser) => {
    if (peer) setSelectedPeer(peer);
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
  };

  const toggleNotificationsDrawer = () => {
    setShowNotificationsDrawer((prev) => !prev);
  };

  const sendSessionRequest = async (
    payload: Omit<CreateRequestPayload, 'requesterId' | 'requesterName' | 'requesterRegNo'>
  ) => {
    const fullPayload: CreateRequestPayload = {
      ...payload,
      requesterId: currentStudent.id,
      requesterName: currentStudent.name,
      requesterRegNo: currentStudent.regNo,
    };

    const { request, notification } = await createSessionRequest(fullPayload);

    // Update local state
    setRequests((prev) => [request, ...prev]);
    setNotifications((prev) => [notification, ...prev]);
    closeRequestModal();

    triggerToast(
      `Session request sent to ${payload.peerName}! Request status is 'Pending' (AC1).`,
      'success'
    );
  };

  const handleAcceptRequest = async (requestId: string) => {
    const updated = await acceptSessionRequest(requestId, currentStudent.name);
    setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    setNotifications(getStoredNotifications());
    triggerToast(
      `Session request accepted! Status changed to 'Accepted' for both students (AC2).`,
      'success'
    );
  };

  const handleDeclineRequest = async (requestId: string) => {
    const updated = await declineSessionRequest(requestId, currentStudent.name);
    setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    setNotifications(getStoredNotifications());
    triggerToast(`Session request declined.`, 'info');
  };

  const markAllNotificationsRead = () => {
    const allNotifs = getStoredNotifications();
    const updated = allNotifs.map((n) =>
      n.recipientId === currentStudent.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    setNotifications(updated);
  };

  // Filtered notifications for current student
  const studentNotifications = notifications.filter(
    (n) => n.recipientId === currentStudent.id
  );

  return (
    <AppContext.Provider
      value={{
        currentStudent,
        allStudents,
        selectedPeer,
        requests,
        notifications: studentNotifications,
        toast,
        showRequestModal,
        showNotificationsDrawer,
        switchCurrentStudent,
        selectPeer,
        openRequestModal,
        closeRequestModal,
        toggleNotificationsDrawer,
        sendSessionRequest,
        handleAcceptRequest,
        handleDeclineRequest,
        markAllNotificationsRead,
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
