import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserCheck,
  Search,
  Send,
  Check,
  Star,
  Award,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const E2EGuidedWalkthrough: React.FC = () => {
  const { setActiveTab, switchCurrentStudent, openProfileEditModal, resetAllData } = useApp();

  const steps = [
    {
      num: 1,
      title: 'Profile Setup',
      epic: 'SCRUM07-F001',
      desc: 'Student lists skills they can teach & want to learn (validation prevents empty profiles).',
      actionLabel: 'Try Profile Edit',
      action: () => {
        setActiveTab('profile');
        openProfileEditModal();
      },
    },
    {
      num: 2,
      title: 'Peer Skill Search',
      epic: 'SCRUM07-F002-UI-001',
      desc: 'Search peers by skill name with live filtering and empty-state messaging.',
      actionLabel: 'Go to Search',
      action: () => setActiveTab('search'),
    },
    {
      num: 3,
      title: 'Send Session Request',
      epic: 'SCRUM07-F002-UI-002',
      desc: 'Submit request with optional message; request status is Pending & peer is notified (AC1).',
      actionLabel: 'Explore Peers',
      action: () => setActiveTab('search'),
    },
    {
      num: 4,
      title: 'Peer Accepts Request',
      epic: 'SCRUM07-F002-UI-002',
      desc: 'Switch to peer persona; accept request to transition status to Accepted (AC2).',
      actionLabel: 'View Requests Hub',
      action: () => {
        switchCurrentStudent('user-2024506107'); // Switch to Keerthivasan
        setActiveTab('requests');
      },
    },
    {
      num: 5,
      title: 'Session Completion',
      epic: 'SCRUM07-F003 Trigger',
      desc: 'Mark accepted session as Completed to unlock rating and feedback actions.',
      actionLabel: 'Open Requests',
      action: () => setActiveTab('requests'),
    },
    {
      num: 6,
      title: 'Rate & Award Badges',
      epic: 'SCRUM07-F003-BE-002',
      desc: 'Submit star rating and comments; system evaluates rules and awards skill badges.',
      actionLabel: 'View Badges',
      action: () => setActiveTab('badges'),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/40 text-left space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              SCRUM07-E2E-001
            </span>
            <span className="text-xs text-slate-500 font-medium">Full Lifecycle Verification</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>End-to-End Student Journey</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Test the entire student flow across all 3 epics: from profile creation to peer matching, session execution, and badge awarding.
          </p>
        </div>

        <button
          type="button"
          onClick={resetAllData}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {st.num}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold">
                  {st.epic}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
            </div>

            <button
              type="button"
              onClick={st.action}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span>{st.actionLabel}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
