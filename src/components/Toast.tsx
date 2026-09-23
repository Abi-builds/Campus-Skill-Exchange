import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-950/20',
    info: 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20',
    error: 'bg-rose-900/95 text-white border-rose-700 shadow-rose-950/20',
  };

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    info: <Info size={18} className="text-cyan-400 shrink-0" />,
    error: <AlertTriangle size={18} className="text-rose-400 shrink-0" />,
  };

  return (
    <aside
      aria-label="Status notifications"
      className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-subtle"
    >
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-xs font-medium leading-snug flex-1">{toast.message}</p>
        <button
          onClick={clearToast}
          aria-label="Dismiss toast"
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
};
