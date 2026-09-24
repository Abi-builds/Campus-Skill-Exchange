import React from 'react';
import {
  GraduationCap,
  Bell,
  ArrowRightLeft,
  Search,
  User,
  Inbox,
  Award,
  Compass,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentStudent,
    allStudents,
    switchCurrentStudent,
    notifications,
    toggleNotificationsDrawer,
    requests,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingRequestsCount = requests.filter(
    (r) => r.peerId === currentStudent.id && r.status === 'Pending'
  ).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'search', label: 'Explore & Search', icon: <Search size={15} /> },
    { id: 'profile', label: 'My Skill Profile', icon: <User size={15} /> },
    {
      id: 'requests',
      label: 'Session Hub',
      icon: <Inbox size={15} />,
      badge: pendingRequestsCount,
    },
    { id: 'badges', label: 'Trophy Room', icon: <Award size={15} /> },
    { id: 'e2e', label: 'E2E Journey', icon: <Compass size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Logo, Gamification Badges, Persona Switcher */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/60">
          {/* Brand Logo & Scrum info */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('search')}
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Campus SkillExchange
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Scrum 7
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Peer-to-Peer Learning & Community Hub</span>
              </p>
            </div>
          </div>

          {/* Gamification Stats: Streak & Level */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-xl text-orange-400 text-xs font-bold shadow-xs shadow-orange-500/10">
              <Flame size={15} className="text-orange-400 fill-orange-400 animate-pulse" />
              <span>5-Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-indigo-300 text-xs font-bold shadow-xs shadow-indigo-500/10">
              <Zap size={14} className="text-indigo-400 fill-indigo-400" />
              <span>Level 3 Mentor</span>
            </div>
          </div>

          {/* Right section: Persona Switcher & Notification Bell */}
          <div className="flex items-center space-x-3">
            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-800">
              <span className="hidden md:flex text-xs text-slate-400 font-semibold px-2 items-center gap-1">
                <ArrowRightLeft size={12} className="text-slate-500" />
                Active View:
              </span>
              <select
                aria-label="Active Student Persona"
                data-testid="persona-switcher-select"
                value={currentStudent.id}
                onChange={(e) => switchCurrentStudent(e.target.value)}
                className="bg-slate-800/90 text-xs font-bold text-white rounded-xl px-2.5 py-1.5 border border-slate-700/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.regNo})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={toggleNotificationsDrawer}
              data-testid="notifications-button"
              className="relative p-2.5 rounded-2xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-hidden cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  data-testid="notification-badge"
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0b0f19] animate-bounce shadow-md shadow-rose-500/50"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Current Profile Thumbnail */}
            <div
              className="flex items-center space-x-2 pl-2 border-l border-slate-800 cursor-pointer group"
              onClick={() => setActiveTab('profile')}
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                  {currentStudent.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentStudent.regNo}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Tier: Bento Navigation Tabs */}
        <nav className="flex space-x-2 py-2.5 overflow-x-auto scrollbar-none text-xs font-bold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 font-extrabold -translate-y-0.5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs shadow-amber-500/50">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
