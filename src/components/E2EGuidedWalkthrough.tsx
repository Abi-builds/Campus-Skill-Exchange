import React from 'react';
import {
  ArrowRight,
  Sparkles,
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
        switchCurrentStudent('user-2024506107');
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
    <div className="bento-card p-6 sm:p-8 text-left space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-500/40">
              SCRUM07-E2E-001
            </span>
            <span className="text-xs text-slate-400 font-semibold">Mission Roadmap</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>End-to-End Student Journey</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test the entire student flow across all 3 epics: from profile creation to peer matching, session execution, and badge awarding.
          </p>
        </div>

        <button
          type="button"
          onClick={resetAllData}
          className="btn-3d-slate px-4 py-2 text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Steps List Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30">
                  {st.num}
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 font-bold">
                  {st.epic}
                </span>
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                {st.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{st.desc}</p>
            </div>

            <button
              type="button"
              onClick={st.action}
              className="mt-4 w-full btn-3d-slate text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer"
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
