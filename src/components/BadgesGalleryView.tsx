import React from 'react';
import { Award, Sparkles, Zap, BookOpen, CheckCircle2, Star, Users } from 'lucide-react';
import { INITIAL_BADGES } from '../services/mockData';
import { useApp } from '../context/AppContext';

export const BadgesGalleryView: React.FC = () => {
  const { allStudents } = useApp();

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-emerald-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-indigo-500" />;
      default:
        return <BookOpen className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/40">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
            SCRUM07-F003 • Badges & Gamification
          </span>
          <span className="text-xs text-slate-500 font-medium">Campus Recognition Board</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Skill Badges & Achievements Catalog
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Students automatically unlock verified skill badges by sharing knowledge, completing sessions, and earning high peer ratings.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.values(INITIAL_BADGES).map((badge) => {
          // Find all students who have earned this badge
          const earnedStudents = allStudents.filter((s) =>
            s.badges.some((b) => b.badgeKey === badge.badgeKey)
          );

          return (
            <div
              key={badge.badgeKey}
              data-testid={`gallery-badge-${badge.badgeKey}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start space-x-4 mb-3">
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/70 shadow-xs shrink-0">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{badge.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Criteria Definition */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1 mb-4">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Eligibility Criteria:
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{badge.criteria}</span>
                  </div>
                </div>
              </div>

              {/* Earned By Student Avatars */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Users size={13} className="text-slate-400" />
                  <span>Earned by {earnedStudents.length} students:</span>
                </span>
                <div className="flex -space-x-2 overflow-hidden">
                  {earnedStudents.map((st) => (
                    <img
                      key={st.id}
                      src={st.avatar}
                      title={st.name}
                      alt={st.name}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
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
