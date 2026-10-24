import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useIsTablet } from "@/src/shared/hooks/useBreakpoint";

interface DashboardModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  contentClassName?: string;
  mobileDrawer?: boolean;
  mobileFullscreen?: boolean;
  compactDesktop?: boolean;
  hideHeaderTitle?: boolean;
  backButton?: boolean;
  hideMobileBack?: boolean;
  hideHeaderControls?: boolean;
  size?: "wide" | "standard";
  closeOnEscape?: boolean;
  page?: boolean;
}

export default function DashboardModal({
  title,
  subtitle,
  onClose,
  children,
  headerActions,
  contentClassName,
  mobileDrawer = false,
  mobileFullscreen = false,
  compactDesktop = false,
  hideHeaderTitle = false,
  hideHeaderControls = false,
  size = "standard",
  closeOnEscape = true,
  page = false,
}: DashboardModalProps) {
  const isTablet = useIsTablet();
  const isMobileSheet = page && !isTablet;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = overlayRef.current?.closest("main") ?? document.body;
    const previous = container.style.overflow;
    container.style.overflow = "hidden";
    return () => {
      container.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (closeOnEscape) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, onClose]);

  const header = (
    <header className="theme-divider grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-b px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:px-5 md:py-4">
      <div className="col-start-1 row-start-1 min-w-0">
        {!hideHeaderTitle && (
          <>
            <h2 className="theme-text-primary truncate text-base font-bold">
              {title}
            </h2>
            {subtitle && (
              <p className="theme-text-muted mt-1 truncate text-xs" title={subtitle}>
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
      {!hideHeaderControls && (
        <>
          {headerActions && (
            <div role="toolbar" aria-label="Dialog actions" className="theme-divider col-span-2 col-start-1 row-start-2 flex min-w-0 items-center justify-end border-t pt-3 md:col-span-1 md:col-start-2 md:row-start-1 md:border-t-0 md:border-r md:pt-0 md:pr-3">
              {headerActions}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close dialog"
            className="theme-icon-muted theme-hover-soft col-start-2 row-start-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition hover:text-current md:col-start-3 md:h-8 md:w-8"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      )}
    </header>
  );

  return (
    <div
      ref={overlayRef}
      className={`theme-modal-backdrop fixed inset-0 z-200 flex justify-center bg-black/25 backdrop-blur-sm ${mobileDrawer || mobileFullscreen || isMobileSheet ? "items-end p-0 md:items-center md:p-5" : "items-end sm:items-center sm:p-5"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`theme-panel flex w-full flex-col overflow-hidden border shadow-2xl ${mobileDrawer || isMobileSheet ? "h-[85dvh] max-h-[90dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] md:h-auto md:min-h-96 md:max-h-[78dvh] md:rounded-xl md:pb-0" : mobileFullscreen ? `h-[85dvh] max-h-[90dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] md:h-auto md:pb-0 ${compactDesktop ? "md:max-h-[70dvh] md:min-h-0" : "md:max-h-[78dvh] md:min-h-105"} md:rounded-xl` : "max-h-[92dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] sm:min-h-96 sm:rounded-xl sm:pb-0"} ${mobileDrawer || mobileFullscreen ? (size === "wide" ? "md:max-w-2xl" : "md:max-w-xl") : size === "wide" ? "sm:max-w-2xl" : "sm:max-w-xl"}`}
      >
        {isMobileSheet && <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-(--app-border-strong)" />}
        {header}
        <div
          className={`min-h-0 flex-1 ${contentClassName ?? "overflow-y-auto"}`}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
