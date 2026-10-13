import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastMessage {
  id: number;
  message: string;
  action?: ToastAction;
}

const listeners = new Set<(toast: ToastMessage) => void>();
let nextToastId = 0;

export const notifySuccess = (message: string, action?: ToastAction) => {
  const toast = { id: ++nextToastId, message, action };
  listeners.forEach((listener) => listener(toast));
};

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const listener = (nextToast: ToastMessage) => setToast(nextToast);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const dismiss = () => setToast(null);

  return (
    <>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-3 bottom-20 z-10000 mx-auto flex max-w-lg items-center gap-3 rounded-lg border border-emerald-500/30 bg-(--app-surface) px-4 py-3 text-sm text-(--app-text) shadow-2xl shadow-black/30 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0 sm:w-[min(28rem,calc(100vw-2rem))]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                dismiss();
              }}
              className="shrink-0 rounded px-2 py-1 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded text-(--app-text-muted) transition hover:bg-white/10 hover:text-(--app-text) focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
