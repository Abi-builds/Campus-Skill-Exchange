import React from 'react';
import { Navbar } from './components/Navbar';
import { PeerProfileCard } from './components/PeerProfileCard';
import { SessionRequestModal } from './components/SessionRequestModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { RequestsList } from './components/RequestsList';
import { Toast } from './components/Toast';
import { useApp } from './context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Calendar,
  Send,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    currentStudent,
    selectedPeer,
    showRequestModal,
    closeRequestModal,
    switchCurrentStudent,
  } = useApp();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Story Identification & Evaluation Banner */}
        <section
          aria-label="Module Story & Acceptance Criteria Header"
          className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Story ID: SCRUM07-F002-UI-002
                </span>
                <span className="bg-white/10 text-white/90 text-xs px-2.5 py-1 rounded-full border border-white/10">
                  Campus Skill Exchange Platform
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Peer Learning Session Request System
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                <strong>User Story:</strong> "As a student, I want to send a learning-session request to a matched peer, so that we can arrange to connect."
              </p>
            </div>

            {/* Quick AC Demo Guide Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl space-y-2 text-xs max-w-md shrink-0">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Acceptance Criteria Checklist</span>
              </div>
              <ul className="space-y-1.5 text-slate-200 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>AC1:</strong> Submit form on peer profile → Request created with status <code className="bg-black/30 px-1 rounded text-amber-300">'Pending'</code> and recipient is notified.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>AC2:</strong> Recipient accepts request → Status transitions to <code className="bg-black/30 px-1 rounded text-emerald-300">'Accepted'</code> for both students.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Evaluation Helper - Active Persona Switch bar */}
        <section
          aria-label="Persona Quick Switcher"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Quick Test Personas:</span>
            <span className="text-slate-500">Switch between Sender & Recipient:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => switchCurrentStudent('user-2024506117')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                currentStudent.id === 'user-2024506117'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Abinaya K (Requester / Student A)
            </button>
            <ArrowRight size={14} className="text-slate-400 hidden sm:block" />
            <button
              onClick={() => switchCurrentStudent('user-2024506107')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                currentStudent.id === 'user-2024506107'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Keerthivasan U (Matched Peer / Student B)
            </button>
          </div>
        </section>

        {/* Main Grid: Peer Profile Card & Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Matched Peer Profile (Story F002 Screen) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Users size={15} className="text-emerald-600" />
                <span>Matched Peer Profile Screen</span>
              </h2>
            </div>
            <PeerProfileCard peer={selectedPeer} />
          </div>

          {/* Right Column: Requests Management Hub (Verifies AC1 & AC2) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Layers size={15} className="text-emerald-600" />
                <span>Session Tracking & Verification Hub</span>
              </h2>
            </div>
            <RequestsList />
          </div>
        </div>
      </main>

      {/* Interactive Modal Form */}
      <SessionRequestModal
        peer={selectedPeer}
        isOpen={showRequestModal}
        onClose={closeRequestModal}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer />

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
