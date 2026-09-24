import React from 'react';
import {
  Edit3,
  Award,
  BookOpen,
  Calendar,
  Star,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyProfileView: React.FC = () => {
  const { currentStudent, openProfileEditModal, ratings } = useApp();

  const studentReviews = ratings.filter((r) => r.ratedPeerId === currentStudent.id);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-200/40 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 relative p-6 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
            <ShieldCheck size={14} className="text-amber-300" />
            <span>Verified Campus Student Profile</span>
          </div>

          <button
            type="button"
            data-testid="btn-open-edit-profile"
            onClick={openProfileEditModal}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Edit3 size={14} className="text-emerald-600" />
            <span>Edit Profile & Skills (F001)</span>
          </button>
        </div>

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentStudent.name}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-md border border-slate-200">
                    {currentStudent.regNo}
                  </span>
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStudent.department} • <span className="text-emerald-700 font-semibold">{currentStudent.year}</span>
                </p>
                <div className="flex items-center space-x-3 mt-1 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star size={14} className="fill-amber-400 mr-1" />
                    <span>{currentStudent.rating}</span>
                    <span className="text-slate-400 font-normal ml-1">
                      ({currentStudent.totalReviews} peer reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-600 text-sm leading-relaxed mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            "{currentStudent.bio}"
          </p>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Can Teach */}
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span>Skills You Can Teach</span>
                </span>
                <span className="text-xs bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  {currentStudent.skillsToTeach.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentStudent.skillsToTeach.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No teaching skills listed.</span>
                ) : (
                  currentStudent.skillsToTeach.map((s, i) => (
                    <span
                      key={i}
                      className="bg-white text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Want to Learn */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-600" />
                  <span>Skills You Want to Learn</span>
                </span>
                <span className="text-xs bg-blue-200/80 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                  {currentStudent.skillsToLearn.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentStudent.skillsToLearn.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No learning skills listed.</span>
                ) : (
                  currentStudent.skillsToLearn.map((s, i) => (
                    <span
                      key={i}
                      className="bg-white text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-300 shadow-2xs"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>Campus Availability:</span>
              <strong className="text-slate-800">{currentStudent.availability}</strong>
            </span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Profile Active & Searchable</span>
            </span>
          </div>
        </div>
      </div>

      {/* STORY SCRUM07-F003-UI-002: Skill badges display on profile with context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/30">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Earned Skill Badges & Honors</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {currentStudent.badges.length} Unlocked
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Story: SCRUM07-F003-UI-002 • Verified contribution badges displayed with criteria and unlock context
            </p>
          </div>
        </div>

        {currentStudent.badges.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No badges earned yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Complete peer learning sessions and maintain high ratings to unlock campus skill badges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudent.badges.map((badge) => (
              <div
                key={badge.id}
                data-testid={`badge-card-${badge.badgeKey}`}
                className="bg-linear-to-br from-amber-50/70 via-white to-orange-50/40 p-4 rounded-xl border border-amber-200/80 shadow-xs flex items-start space-x-3.5 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-amber-100 text-amber-800 rounded-xl shrink-0 border border-amber-200 shadow-xs">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{badge.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(badge.awardedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
                  {/* Relevant Context / Criteria Met (AC1 of F003-UI-002) */}
                  <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-100/50 p-2 rounded-lg">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Criteria Met:</strong> {badge.criteria}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Peer Reviews History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/30">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          <span>Peer Reviews & Ratings ({studentReviews.length})</span>
        </h2>

        {studentReviews.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl text-xs text-slate-400">
            No peer reviews received yet. Complete a session to receive feedback!
          </div>
        ) : (
          <div className="space-y-3">
            {studentReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-800">{rev.raterName}</span>
                    <span className="text-slate-300">•</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.score ? 'fill-amber-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
