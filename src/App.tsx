import React from 'react';
import { Navbar } from './components/Navbar';
import { PeerSearchSection } from './components/PeerSearchSection';
import { MyProfileView } from './components/MyProfileView';
import { RequestsList } from './components/RequestsList';
import { BadgesGalleryView } from './components/BadgesGalleryView';
import { E2EGuidedWalkthrough } from './components/E2EGuidedWalkthrough';
import { SessionRequestModal } from './components/SessionRequestModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { RatingFeedbackModal } from './components/RatingFeedbackModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { Toast } from './components/Toast';
import { useApp } from './context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Award,
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedPeer,
    showRequestModal,
    closeRequestModal,
    currentStudent,
    switchCurrentStudent,
  } = useApp();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Story Identification Banner */}
        <section
          aria-label="Campus Skill Exchange Banner"
          className="bg-linear-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10 text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Scrum Team 7 • Complete Platform
                </span>
                <span className="bg-white/10 text-white/90 text-xs px-2.5 py-1 rounded-full border border-white/10">
                  Epics: F001 (Profiles) • F002 (Search/Matching) • F003 (Ratings/Badges)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Campus Skill Exchange Platform
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Connect students who want to learn with peers who can teach. Arrange peer sessions, rate exchanges, and earn verified skill badges.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-xs space-y-1 max-w-xs shrink-0">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Active Testing Persona</span>
              </div>
              <p className="text-slate-200 text-[11px]">
                Currently acting as: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.regNo}).
                Use the switcher in the header to swap roles anytime!
              </p>
            </div>
          </div>
        </section>

        {/* Tab Routing */}
        <section aria-label="Tab Content View">
          {activeTab === 'search' && <PeerSearchSection />}
          {activeTab === 'profile' && <MyProfileView />}
          {activeTab === 'requests' && <RequestsList />}
          {activeTab === 'badges' && <BadgesGalleryView />}
          {activeTab === 'e2e' && <E2EGuidedWalkthrough />}
        </section>
      </main>

      {/* Global Modals & Notifications */}
      <SessionRequestModal
        peer={selectedPeer}
        isOpen={showRequestModal}
        onClose={closeRequestModal}
      />
      <ProfileEditModal />
      <RatingFeedbackModal />
      <NotificationsDrawer />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
