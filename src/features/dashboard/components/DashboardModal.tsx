import { useEffect, useRef } from "react";
import { ArrowLeft, X } from "lucide-react";
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
  backButton = false,
  hideMobileBack = false,
  hideHeaderControls = false,
  size = "standard",
  closeOnEscape = true,
  page = false,
}: DashboardModalProps) {
  const isTablet = useIsTablet();
  const isMobileSheet = page && !isTablet;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileSheet) return;
    const container = overlayRef.current?.closest("main") ?? document.body;
    const previous = container.style.overflow;
    container.style.overflow = "hidden";
    return () => {
      container.style.overflow = previous;
    };
  }, [isMobileSheet]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (closeOnEscape) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, onClose]);

  if (page && !isMobileSheet) {
    return (
      <section aria-label={title} className="theme-panel mx-auto flex min-h-[65vh] w-full max-w-5xl flex-col rounded-xl border">
        <header className="theme-divider flex shrink-0 flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={onClose} aria-label="Back" className="theme-icon-muted theme-hover-soft rounded-md p-2">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="theme-text-primary text-base font-bold">{title}</h1>
              {subtitle && <p className="theme-text-muted mt-1 text-xs">{subtitle}</p>}
            </div>
          </div>
          {headerActions}
        </header>
        <div className={`min-h-0 flex-1 ${contentClassName ?? ""}`}>{children}</div>
      </section>
    );
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-200 flex justify-center bg-black/25 backdrop-blur-sm ${mobileDrawer || isMobileSheet ? "items-end p-0 md:items-center md:p-5" : mobileFullscreen ? "items-stretch pt-14 md:items-center md:p-5" : "items-end sm:items-center sm:p-5"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`theme-panel flex w-full flex-col overflow-hidden border shadow-2xl ${mobileDrawer || isMobileSheet ? "h-[85dvh] max-h-[90dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] md:h-auto md:min-h-96 md:max-h-[78dvh] md:rounded-xl" : mobileFullscreen ? `min-h-80 h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] rounded-none md:h-auto ${compactDesktop ? "md:max-h-[70dvh] md:min-h-0" : "md:max-h-[78dvh] md:min-h-105"} md:rounded-xl` : "min-h-80 max-h-[92dvh] rounded-t-2xl sm:min-h-96 sm:rounded-xl"} ${mobileDrawer || mobileFullscreen ? (size === "wide" ? "md:max-w-2xl" : "md:max-w-xl") : size === "wide" ? "sm:max-w-2xl" : "sm:max-w-xl"}`}
      >
        {isMobileSheet && <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-(--app-border-strong)" />}
        <header className={`theme-divider flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 ${hideHeaderTitle && mobileFullscreen ? "hidden md:flex" : ""}`}>
          <div className="flex min-w-0 items-start gap-2">
            {!hideHeaderControls &&
              !hideMobileBack &&
              !mobileDrawer &&
              (mobileFullscreen || backButton) && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Back"
                className="theme-icon-muted theme-hover-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {!hideHeaderTitle && (
              <div className="min-w-0">
                <h2 className="theme-text-primary truncate text-base font-bold">
                  {title}
                </h2>
                {subtitle && (
                  <p className="theme-text-muted mt-1 truncate text-xs">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          {!hideHeaderControls && (
            <div className="flex shrink-0 items-center gap-1">
              {headerActions}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className={`theme-icon-muted theme-hover-soft h-8 w-8 items-center justify-center rounded-md transition hover:text-current ${!mobileDrawer && (mobileFullscreen || backButton) ? "hidden md:flex" : "flex"}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </header>
        <div
          className={`min-h-0 flex-1 ${contentClassName ?? "overflow-y-auto"}`}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
