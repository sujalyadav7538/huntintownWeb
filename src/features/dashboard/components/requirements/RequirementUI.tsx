import { AlertCircle, LoaderCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: "border-emerald-500/35 bg-emerald-500/10",
    in_progress: "border-sky-500/35 bg-sky-500/10",
    completed: "border-cyan-500/35 bg-cyan-500/10",
    expired: "theme-divider border bg-(--app-surface-soft)",
    cancelled: "border-red-500/35 bg-red-500/10",
    pending: "border-amber-500/35 bg-amber-500/10",
    accepted: "border-emerald-500/35 bg-emerald-500/10",
    rejected: "border-red-500/35 bg-red-500/10",
  };

  return (
    <span
      className={`theme-text-primary rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase ${styles[status] ?? "theme-divider border bg-(--app-surface-soft)"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function Avatar({
  name,
  src,
  large = false,
}: {
  name: string;
  src?: string;
  large?: boolean;
}) {
  const size = large ? "h-11 w-11" : "h-9 w-9";
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`theme-chip ${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`theme-chip ${size} ${large ? "text-base" : "text-sm"} flex shrink-0 items-center justify-center rounded-full font-bold`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function LoadingState() {
  return (
    <div className="theme-text-muted flex items-center justify-center gap-2 py-12 text-xs">
      <LoaderCircle className="h-4 w-4 animate-spin" /> Loading
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="theme-divider theme-text-muted rounded-lg  px-4 py-10 text-center text-xs">
      {text}
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-8 text-center">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <p role="alert" className="theme-text-primary text-xs">
        {message}
      </p>
      <button
        type="button"
        onClick={retry}
        className="text-xs font-semibold text-[#FF6B6B] hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
