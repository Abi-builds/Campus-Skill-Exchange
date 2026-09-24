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
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyProfileView: React.FC = () => {
  const { currentStudent, openProfileEditModal, ratings } = useApp();

  const studentReviews = ratings.filter((r) => r.ratedPeerId === currentStudent.id);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-indigo-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Bento Header: Profile Identity */}
      <div className="bento-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500/80 shadow-xl shadow-emerald-500/20"
              />
              <span className="absolute -bottom-2 -right-2 bg-linear-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                LVL 3
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Verified Student
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentStudent.regNo}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {currentStudent.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {currentStudent.department} • <strong className="text-emerald-400">{currentStudent.year}</strong>
              </p>
              <div className="flex items-center space-x-3 pt-1 text-xs">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star size={14} className="fill-amber-400 mr-1" />
                  <span>{currentStudent.rating}</span>
                  <span className="text-slate-500 font-normal ml-1">
                    ({currentStudent.totalReviews} peer reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              data-testid="btn-open-edit-profile"
              onClick={openProfileEditModal}
              className="btn-3d-emerald px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Edit3 size={15} />
              <span>Edit Profile & Skills (F001)</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          "{currentStudent.bio}"
        </p>
      </div>

      {/* Gamification Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bento-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-indigo-400 text-xs font-bold mb-1">
            <Zap size={14} />
            <span>Mentor Level</span>
          </div>
          <div className="text-2xl font-black text-white">Level 3</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '72%' }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">1,450 / 2,000 XP</span>
        </div>

        <div className="bento-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-orange-400 text-xs font-bold mb-1">
            <Flame size={14} />
            <span>Active Streak</span>
          </div>
          <div className="text-2xl font-black text-white">5 Days</div>
          <span className="text-[10px] text-slate-400 mt-2 block">+250 XP bonus</span>
        </div>

        <div className="bento-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
            <BookOpen size={14} />
            <span>Skills Offered</span>
          </div>
          <div className="text-2xl font-black text-white">{currentStudent.skillsToTeach.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Verified in Catalog</span>
        </div>

        <div className="bento-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
            <Award size={14} />
            <span>Badges Unlocked</span>
          </div>
          <div className="text-2xl font-black text-white">{currentStudent.badges.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Honors & Medals</span>
        </div>
      </div>

      {/* Skills Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Can Teach Bento */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={15} />
              <span>Skills You Can Teach</span>
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              {currentStudent.skillsToTeach.length} Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStudent.skillsToTeach.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No teaching skills listed.</span>
            ) : (
              currentStudent.skillsToTeach.map((s, i) => (
                <span
                  key={i}
                  className="bg-emerald-500/10 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-xs"
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Want to Learn Bento */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={15} />
              <span>Skills You Want to Learn</span>
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-500/40">
              {currentStudent.skillsToLearn.length} Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStudent.skillsToLearn.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No learning skills listed.</span>
            ) : (
              currentStudent.skillsToLearn.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-500/10 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-500/30 shadow-xs"
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* STORY SCRUM07-F003-UI-002: Skill badges display on profile with context */}
      <div className="bento-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Trophy Room • Earned Skill Badges</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-3 py-0.5 rounded-full border border-amber-500/40">
                {currentStudent.badges.length} Unlocked
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Story: SCRUM07-F003-UI-002 • Verified contribution badges displayed with criteria and unlock context
            </p>
          </div>
        </div>

        {currentStudent.badges.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No badges earned yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Complete peer learning sessions and maintain high ratings to unlock campus skill badges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudent.badges.map((badge) => (
              <div
                key={badge.id}
                data-testid={`badge-card-${badge.badgeKey}`}
                className="bg-linear-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/5 flex items-start space-x-4 hover:border-amber-400/60 transition-all"
              >
                <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0 border border-amber-500/30 shadow-md shadow-amber-500/10">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{badge.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {new Date(badge.awardedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                  {/* Relevant Context / Criteria Met (AC1 of F003-UI-002) */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
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

      {/* Reviews Bento Box */}
      <div className="bento-card p-6 sm:p-8">
        <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-400" />
          <span>Peer Reviews & Endorsements ({studentReviews.length})</span>
        </h2>

        {studentReviews.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/60 rounded-2xl text-xs text-slate-400">
            No peer reviews received yet. Complete a session to receive feedback!
          </div>
        ) : (
          <div className="space-y-3">
            {studentReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">{rev.raterName}</span>
                    <span className="text-slate-600">•</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.score ? 'fill-amber-400' : 'text-slate-700'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
