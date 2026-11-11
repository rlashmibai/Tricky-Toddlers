import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, Sparkles, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { playSound } from './sounds';

export type ToastType = 'success' | 'cart' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const triggerToast = (
  message: string,
  type: ToastType = 'success',
  title?: string,
  duration = 3800
) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { message, type, title, duration },
      })
    );
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', title?: string, duration = 3800) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const defaultTitles: Record<ToastType, string> = {
        success: 'Changes Saved',
        cart: 'Cart Updated',
        info: 'Notification',
        warning: 'Please Note',
        error: 'Action Needed',
      };

      const newToast: ToastItem = {
        id,
        title: title || defaultTitles[type],
        message,
        type,
        duration,
      };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  useEffect(() => {
    const handleGlobalToast = (e: Event) => {
      const customEvent = e as CustomEvent<{
        message: string;
        type?: ToastType;
        title?: string;
        duration?: number;
      }>;
      if (customEvent.detail?.message) {
        showToast(
          customEvent.detail.message,
          customEvent.detail.type || 'success',
          customEvent.detail.title,
          customEvent.detail.duration
        );
      }
    };

    window.addEventListener('app-toast', handleGlobalToast);
    return () => window.removeEventListener('app-toast', handleGlobalToast);
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'cart':
        return {
          border: 'border-amber-400/40 bg-gradient-to-r from-[#17130a]/95 via-[#0f172a]/95 to-[#0b1329]/95',
          iconBg: 'bg-amber-400/20 border-amber-400/40 text-amber-300',
          titleColor: 'text-amber-200',
          barColor: 'from-amber-400 to-yellow-300',
          Icon: ShoppingBag,
        };
      case 'info':
        return {
          border: 'border-cyan-400/40 bg-gradient-to-r from-[#091926]/95 via-[#0f172a]/95 to-[#0b1329]/95',
          iconBg: 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300',
          titleColor: 'text-cyan-200',
          barColor: 'from-cyan-400 to-indigo-400',
          Icon: Sparkles,
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 bg-gradient-to-r from-[#1c1208]/95 via-[#0f172a]/95 to-[#0b1329]/95',
          iconBg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
          titleColor: 'text-amber-200',
          barColor: 'from-amber-400 to-orange-400',
          Icon: AlertTriangle,
        };
      case 'error':
        return {
          border: 'border-rose-500/45 bg-gradient-to-r from-[#1f0a12]/95 via-[#0f172a]/95 to-[#0b1329]/95',
          iconBg: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
          titleColor: 'text-rose-200',
          barColor: 'from-rose-500 to-pink-500',
          Icon: AlertCircle,
        };
      case 'success':
      default:
        return {
          border: 'border-emerald-400/40 bg-gradient-to-r from-[#071c18]/95 via-[#0f172a]/95 to-[#0b1329]/95',
          iconBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
          titleColor: 'text-emerald-200',
          barColor: 'from-emerald-400 to-teal-300',
          Icon: CheckCircle2,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Global Glass-Card Toast Notification Stack */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-20 right-3 sm:right-6 z-[250] flex flex-col gap-2.5 w-[calc(100vw-1.5rem)] max-w-sm pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const style = getToastStyles(toast.type);
            const IconComponent = style.Icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`pointer-events-auto relative overflow-hidden glass-card rounded-2xl border ${style.border} backdrop-blur-2xl shadow-2xl shadow-black/60 p-3.5 sm:p-4`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl border ${style.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    {toast.title && (
                      <div className={`text-xs font-black uppercase tracking-wider ${style.titleColor}`}>
                        {toast.title}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug mt-0.5 break-words">
                      {toast.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      dismissToast(toast.id);
                    }}
                    aria-label="Dismiss notification"
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Animated Progress Bar */}
                {toast.duration && toast.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${style.barColor}`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (message, type = 'success', title, duration) =>
        triggerToast(message, type, title, duration),
      dismissToast: () => {},
    };
  }
  return context;
};
