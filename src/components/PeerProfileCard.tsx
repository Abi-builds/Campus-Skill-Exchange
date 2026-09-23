import React from 'react';
import { Star, Award, Calendar, BookOpen, Sparkles, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { StudentUser } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  peer: StudentUser;
}

export const PeerProfileCard: React.FC<Props> = ({ peer }) => {
  const { currentStudent, openRequestModal, allStudents, selectPeer } = useApp();

  const isSelf = currentStudent.id === peer.id;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden transition-all hover:shadow-lg">
      {/* Top Banner / Match Accent */}
      <div className="h-28 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 relative p-4 flex items-start justify-between">
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
          <Sparkles size={13} className="text-amber-300" />
          <span>96% Skill Compatibility Match</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/80 text-xs font-medium">Select Peer:</span>
          <select
            aria-label="Select Peer to View"
            value={peer.id}
            onChange={(e) => {
              const found = allStudents.find((s) => s.id === e.target.value);
              if (found) selectPeer(found);
            }}
            className="bg-white/20 text-white text-xs font-semibold rounded-lg px-2 py-1 border border-white/30 backdrop-blur-md cursor-pointer focus:outline-hidden"
          >
            {allStudents.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-900">
                {s.name} ({s.department.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        {/* Peer Avatar and Core Identity */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
          <div className="flex items-end space-x-4">
            <div className="relative">
              <img
                src={peer.avatar}
                alt={peer.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg shadow-slate-900/10"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-xs">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{peer.name}</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-md border border-slate-200">
                  {peer.regNo}
                </span>
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {peer.department} • <span className="text-emerald-700 font-semibold">{peer.year}</span>
              </p>
              <div className="flex items-center space-x-3 mt-1 text-xs">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star size={14} className="fill-amber-400 mr-1" />
                  <span>{peer.rating}</span>
                  <span className="text-slate-400 font-normal ml-1">({peer.totalReviews} sessions)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Button */}
          <div>
            {isSelf ? (
              <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <HelpCircle size={14} className="shrink-0 text-amber-600" />
                <span>You are currently viewing as this student. Switch persona above to test sending a request.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openRequestModal(peer)}
                data-testid="open-request-modal-button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Send size={16} />
                <span>Request Learning Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          "{peer.bio}"
        </p>

        {/* Badges Section */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Award size={13} className="text-amber-500" />
            <span>Earned Skill Badges</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {peer.badges.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
              >
                <Sparkles size={11} className="text-amber-600" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Skills to Teach */}
          <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <BookOpen size={14} className="text-emerald-600" />
              <span>Skills {peer.name.split(' ')[0]} Can Teach</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {peer.skillsToTeach.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills to Learn */}
          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              <BookOpen size={14} className="text-blue-600" />
              <span>Skills {peer.name.split(' ')[0]} Wants to Learn</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {peer.skillsToLearn.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white text-blue-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar size={13} className="text-slate-400" />
            <span>Usual Availability:</span>
            <span className="text-slate-800 font-semibold">{peer.availability}</span>
          </span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Open for requests
          </span>
        </div>
      </div>
    </div>
  );
};
