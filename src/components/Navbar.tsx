import React from 'react';
import { GraduationCap, Bell, ArrowRightLeft, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentStudent,
    allStudents,
    switchCurrentStudent,
    notifications,
    toggleNotificationsDrawer,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Scrum info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Campus SkillExchange
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Scrum 7
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" />
                <span>Story: SCRUM07-F002-UI-002 (Peer Session Request)</span>
              </p>
            </div>
          </div>

          {/* Right section: Persona Switcher & Notification Bell */}
          <div className="flex items-center space-x-4">
            {/* Persona Switcher for Evaluation / AC testing */}
            <div className="hidden md:flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium px-2.5 flex items-center gap-1">
                <ArrowRightLeft size={12} className="text-slate-400" />
                Active View:
              </span>
              <select
                aria-label="Active Student Persona"
                value={currentStudent.id}
                onChange={(e) => switchCurrentStudent(e.target.value)}
                className="bg-white text-xs font-semibold text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.regNo})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={toggleNotificationsDrawer}
              data-testid="notifications-button"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  data-testid="notification-badge"
                  className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-bounce"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Current Student Profile Snapshot */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {currentStudent.name}
                  <UserCheck size={12} className="text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {currentStudent.regNo}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
