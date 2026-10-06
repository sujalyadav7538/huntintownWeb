import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function FormSection({
  icon: Icon,
  title,
  hint,
  aside,
  optional = false,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
  aside?: ReactNode;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="theme-card rounded-xl border p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF3F3F]/10 text-[#FF3F3F]">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="theme-text-primary flex items-center gap-2 text-sm font-semibold">
              {title}
              {optional && (
                <span className="theme-chip rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Optional
                </span>
              )}
            </h2>
            {hint && (
              <p className="theme-text-muted mt-0.5 text-xs leading-5">{hint}</p>
            )}
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

export function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "theme-chip-active text-[#FF3F3F]"
          : "theme-chip theme-divider"
      }`}
    >
      {children}
    </button>
  );
}

export function CharCount({ value, max }: { value: number; max: number }) {
  return (
    <span
      className={`text-[11px] tabular-nums ${value >= max ? "text-[#FF3F3F]" : "theme-text-muted"}`}
    >
      {value}/{max}
    </span>
  );
}
