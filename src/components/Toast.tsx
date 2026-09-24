import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900/95 text-white border-emerald-500/50 shadow-2xl shadow-emerald-500/20',
    info: 'bg-slate-900/95 text-white border-cyan-500/50 shadow-2xl shadow-cyan-500/20',
    error: 'bg-slate-900/95 text-white border-rose-500/50 shadow-2xl shadow-rose-500/20',
  };

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />,
    info: <Info size={20} className="text-cyan-400 shrink-0" />,
    error: <AlertTriangle size={20} className="text-rose-400 shrink-0" />,
  };

  return (
    <aside
      aria-label="Status notifications"
      className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-subtle text-left"
    >
      <div
        className={`flex items-center space-x-3.5 px-4.5 py-3.5 rounded-3xl border shadow-2xl backdrop-blur-xl ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-xs font-bold leading-snug flex-1">{toast.message}</p>
        <button
          onClick={clearToast}
          aria-label="Dismiss toast"
          className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
};
