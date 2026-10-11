import { useEffect, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import {
  dismissAppError,
  getAppErrorSnapshot,
  subscribeToAppErrors,
} from "@/src/shared/lib/appErrors";

export default function AppErrorNotice() {
  const notice = useSyncExternalStore(
    subscribeToAppErrors,
    getAppErrorSnapshot,
    getAppErrorSnapshot,
  );

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(
      () => dismissAppError(notice.id),
      7000,
    );

    return () => window.clearTimeout(timeout);
  }, [notice]);

  if (!notice) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-10000 flex justify-center sm:left-auto sm:right-5 sm:w-full sm:max-w-md">
      <div
        role="alert"
        aria-live="assertive"
        className="flex w-full items-start gap-3 rounded-xl border border-rose-500/25 bg-(--app-surface) px-4 py-3 text-sm text-rose-200 shadow-xl"
      >
        <p className="min-w-0 flex-1">{notice.message}</p>
        <button
          type="button"
          aria-label="Dismiss error message"
          onClick={() => dismissAppError(notice.id)}
          className="shrink-0 rounded-md p-1 text-rose-200/70 transition hover:bg-white/5 hover:text-rose-100"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}