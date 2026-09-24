import React from 'react';
import { Award, Sparkles, Zap, BookOpen, CheckCircle2, Star, Users, Flame } from 'lucide-react';
import { INITIAL_BADGES } from '../services/mockData';
import { useApp } from '../context/AppContext';

export const BadgesGalleryView: React.FC = () => {
  const { allStudents } = useApp();

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-indigo-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-blue-400" />;
    }
  };

  const getBadgeTier = (key: string) => {
    switch (key) {
      case 'top_mentor':
        return { label: 'LEGENDARY', style: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'multi_skill':
        return { label: 'EPIC', style: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'first_session':
        return { label: 'STARTER', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'RARE', style: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header Bento */}
      <div className="bento-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/40">
            SCRUM07-F003 • Badges & Honors
          </span>
          <span className="text-xs text-slate-400 font-semibold">Campus Hall of Fame</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Trophy Room & Achievement Badges</span>
          <Award className="w-7 h-7 text-amber-400 animate-bounce-subtle" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Students unlock verified achievement badges automatically by teaching peers, delivering quality sessions, and maintaining high ratings.
        </p>
      </div>

      {/* Badges Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.values(INITIAL_BADGES).map((badge) => {
          const earnedStudents = allStudents.filter((s) =>
            s.badges.some((b) => b.badgeKey === badge.badgeKey)
          );
          const tier = getBadgeTier(badge.badgeKey);

          return (
            <div
              key={badge.badgeKey}
              data-testid={`gallery-badge-${badge.badgeKey}`}
              className="bento-card p-6 flex flex-col justify-between group hover:border-amber-400/40"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 shadow-md shadow-amber-500/10 shrink-0 group-hover:scale-110 transition-transform">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{badge.name}</h3>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${tier.style}`}>
                    {tier.label}
                  </span>
                </div>

                {/* Criteria Definition */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1 mb-4">
                  <div className="font-black text-slate-400 uppercase tracking-wider text-[10px]">
                    Unlock Requirement:
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{badge.criteria}</span>
                  </div>
                </div>
              </div>

              {/* Earned By Student Avatars */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Users size={14} className="text-slate-500" />
                  <span>Unlocked by {earnedStudents.length} {earnedStudents.length === 1 ? 'student' : 'students'}:</span>
                </span>
                <div className="flex -space-x-2 overflow-hidden">
                  {earnedStudents.map((st) => (
                    <img
                      key={st.id}
                      src={st.avatar}
                      title={st.name}
                      alt={st.name}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
