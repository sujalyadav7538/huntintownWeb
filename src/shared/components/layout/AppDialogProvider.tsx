import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, Info, X } from "lucide-react";

interface DialogOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface AppDialogApi {
  showAlert: (message: string, options?: DialogOptions) => Promise<void>;
  showConfirm: (message: string, options?: DialogOptions) => Promise<boolean>;
}

interface DialogRequest {
  kind: "alert" | "confirm";
  message: string;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  resolve: (result: boolean) => void;
}

const DialogContext = createContext<AppDialogApi | null>(null);

export function useAppDialog() {
  const dialog = useContext(DialogContext);
  if (!dialog) {
    throw new Error("useAppDialog must be used inside AppDialogProvider");
  }
  return dialog;
}

export default function AppDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<DialogRequest | null>(null);

  const showAlert = useCallback(
    (message: string, options: DialogOptions = {}) =>
      new Promise<void>((resolve) => {
        setRequest({
          kind: "alert",
          message,
          title: options.title ?? "Notice",
          confirmLabel: options.confirmLabel ?? "OK",
          cancelLabel: "",
          resolve: () => resolve(),
        });
      }),
    [],
  );

  const showConfirm = useCallback(
    (message: string, options: DialogOptions = {}) =>
      new Promise<boolean>((resolve) => {
        setRequest({
          kind: "confirm",
          message,
          title: options.title ?? "Please confirm",
          confirmLabel: options.confirmLabel ?? "Continue",
          cancelLabel: options.cancelLabel ?? "Cancel",
          resolve,
        });
      }),
    [],
  );

  const closeDialog = useCallback((result: boolean) => {
    setRequest((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!request) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeDialog, request]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {request && (
        <div
          className="fixed inset-0 z-10001 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog(false);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-dialog-title"
            aria-describedby="app-dialog-message"
            className="w-full max-w-sm rounded-xl border border-white/10 bg-[#151518] p-5 shadow-2xl"
          >
            <header className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#FF3F3F]/20 bg-[#FF3F3F]/10 text-[#ff6b6b]">
                {request.kind === "confirm" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="app-dialog-title" className="text-sm font-semibold text-zinc-100">
                  {request.title}
                </h2>
                <p id="app-dialog-message" className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                  {request.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => closeDialog(false)}
                aria-label="Close dialog"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <footer className="mt-5 flex justify-end gap-2">
              {request.kind === "confirm" && (
                <button
                  type="button"
                  onClick={() => closeDialog(false)}
                  className="rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/5"
                >
                  {request.cancelLabel}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => closeDialog(true)}
                className="rounded-lg bg-[#FF3F3F] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#ff5353]"
              >
                {request.confirmLabel}
              </button>
            </footer>
          </section>
        </div>
      )}
    </DialogContext.Provider>
  );
}
