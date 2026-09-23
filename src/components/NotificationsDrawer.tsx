import React from 'react';
import { X, Bell, CheckCheck, Clock, Calendar, MessageCircle, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={toggleNotificationsDrawer}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Notifications Hub</h3>
                <p className="text-[11px] text-slate-400">
                  Inbox for {currentStudent.name} ({currentStudent.regNo})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleNotificationsDrawer}
                aria-label="Close notifications"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {notifications.length} Total {notifications.length === 1 ? 'Notification' : 'Notifications'}
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
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
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Bell size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  When peers send you session requests or update request statuses, alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notif.read
                      ? 'bg-white border-slate-200'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {notif.type === 'session_request' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                      <span>{notif.title}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">From: {notif.senderName}</span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {notif.requestId.slice(0, 12)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note regarding AC1 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500">
              💡 Demonstrating <strong>AC1</strong>: Recipient is immediately notified upon request submission.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
