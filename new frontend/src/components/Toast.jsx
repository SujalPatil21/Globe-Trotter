import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
};

const STYLES = {
  success: 'bg-white border-green-500/30 text-charcoal',
  error:   'bg-white border-red-400/40 text-charcoal',
  warning: 'bg-white border-gold/40 text-charcoal',
  info:    'bg-white border-charcoal/20 text-charcoal',
};

const ICON_COLORS = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-gold-dark',
  info:    'text-charcoal/60',
};

export default function Toast({ message, type = 'success', duration = 3500, onClose }) {
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[type] || CheckCircle;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 min-w-[260px] max-w-sm ${STYLES[type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${ICON_COLORS[type]}`} />
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }}
        className="text-charcoal/30 hover:text-charcoal/60 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── ToastContainer — mount at app root or per-page ──────────────────────────
// Usage: const { toasts, showToast } = useToast();  <ToastContainer toasts={toasts} />
import { useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={() => onRemove(t.id)}
          />
        </div>
      ))}
    </div>
  );
}
