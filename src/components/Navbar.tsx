import React from 'react';
import {
  GraduationCap,
  Bell,
  ArrowRightLeft,
  Sparkles,
  Search,
  User,
  Inbox,
  Award,
  Compass,
  CheckCircle,
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
    { id: 'profile', label: 'My Profile & Skills', icon: <User size={15} /> },
    {
      id: 'requests',
      label: 'Session Hub',
      icon: <Inbox size={15} />,
      badge: pendingRequestsCount,
    },
    { id: 'badges', label: 'Badges & Honors', icon: <Award size={15} /> },
    { id: 'e2e', label: 'E2E Journey', icon: <Compass size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Persona Switcher & Notifications */}
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Brand Logo & Scrum info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
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
                <span>Peer-to-Peer Learning & Recognition Platform</span>
              </p>
            </div>
          </div>

          {/* Right section: Persona Switcher & Notification Bell */}
          <div className="flex items-center space-x-3">
            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <span className="hidden lg:flex text-xs text-slate-500 font-medium px-2 items-center gap-1">
                <ArrowRightLeft size={12} className="text-slate-400" />
                Active View:
              </span>
              <select
                aria-label="Active Student Persona"
                data-testid="persona-switcher-select"
                value={currentStudent.id}
                onChange={(e) => switchCurrentStudent(e.target.value)}
                className="bg-white text-xs font-semibold text-slate-800 rounded-lg px-2.5 py-1 border border-slate-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
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

            {/* Current Profile Thumbnail */}
            <div
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer"
              onClick={() => setActiveTab('profile')}
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentStudent.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentStudent.regNo}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Tier: Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 py-2 overflow-x-auto scrollbar-none text-xs font-bold">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
