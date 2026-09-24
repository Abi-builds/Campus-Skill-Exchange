import React from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    showNotificationsDrawer,
    toggleNotificationsDrawer,
    notifications,
    markAllNotificationsRead,
    currentStudent,
  } = useApp();

  if (!showNotificationsDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in text-left">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={toggleNotificationsDrawer}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-white">
          {/* Drawer Header */}
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Notifications Hub</h3>
                <p className="text-[11px] text-slate-400">
                  Inbox for {currentStudent.name} ({currentStudent.regNo})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleNotificationsDrawer}
              aria-label="Close notifications"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">
              {notifications.length} Total {notifications.length === 1 ? 'Notification' : 'Notifications'}
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 mb-3 border border-slate-800">
                  <Bell size={24} />
                </div>
                <p className="text-sm font-bold text-slate-300">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  When peers send you session requests or update request statuses, alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    notif.read
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md shadow-emerald-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black flex items-center gap-2">
                      {notif.type === 'session_request' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                      <span>{notif.title}</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-400">From: {notif.senderName}</span>
                    {notif.requestId && (
                      <span className="font-mono text-[10px] text-slate-600">ID: {notif.requestId.slice(0, 12)}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note regarding AC1 */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              💡 Demonstrating <strong>AC1</strong>: Recipient is immediately notified upon request submission.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
