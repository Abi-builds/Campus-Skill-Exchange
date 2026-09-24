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
  Users,
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedPeer,
    showRequestModal,
    closeRequestModal,
    currentStudent,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Story Identification Bento Banner */}
        <section
          aria-label="Campus Skill Exchange Banner"
          className="bento-card p-6 sm:p-7 relative overflow-hidden bg-linear-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/40 border border-slate-800"
        >
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10 text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs shadow-emerald-500/10">
                  Scrum Team 7 • Complete Platform
                </span>
                <span className="bg-slate-800/80 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/80">
                  Epics: F001 (Profiles) • F002 (Search/Matching) • F003 (Ratings/Badges)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Campus Skill Exchange Platform
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Connect students who want to learn with peers who can teach. Arrange peer sessions, rate exchanges, and earn verified skill badges.
              </p>
            </div>

            {/* Quick Summary Pill Bento */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-1.5 max-w-xs shrink-0 shadow-lg">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Active Testing Persona</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
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
