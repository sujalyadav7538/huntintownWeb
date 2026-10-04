import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { ResponseStatus } from "../types";

export type OfferStatusFilterValue = Extract<
  ResponseStatus,
  "pending" | "accepted" | "rejected"
>;

interface OfferStatusFilterProps {
  value: OfferStatusFilterValue;
  onChange: (value: OfferStatusFilterValue) => void;
}

const FILTERS: { value: OfferStatusFilterValue; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_DOT_STYLES: Record<OfferStatusFilterValue, string> = {
  pending: "bg-amber-400",
  accepted: "bg-emerald-400",
  rejected: "bg-red-400",
};

export default function OfferStatusFilter({
  value,
  onChange,
}: OfferStatusFilterProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        menuRef.current?.removeAttribute("open");
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        menuRef.current?.removeAttribute("open");
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectedFilter = FILTERS.find((filter) => filter.value === value)!;

  return (
    <details
      ref={menuRef}
      className="relative"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        aria-label="Filter offers by application status"
        title="Filter offers by status"
        className=" theme-hover-soft flex h-8 list-none items-center gap-2 rounded-md  px-2.5 text-xs font-semibold transition [&::-webkit-details-marker]:hidden"
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[value]}`}
        />
        <span>{selectedFilter.label}</span>
        <ChevronDown
          className={`theme-icon-muted h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </summary>
      <div className="theme-panel absolute right-0 top-9 z-20 w-44 rounded-md  p-1 shadow-lg">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={value === filter.value}
            onClick={() => {
              menuRef.current?.removeAttribute("open");
              setOpen(false);
              onChange(filter.value);
            }}
            className={`theme-text-primary theme-hover-soft inline-flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs ${value === filter.value ? "theme-chip-active font-semibold" : "font-medium"}`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[filter.value]}`}
            />
            <span className="flex-1">{filter.label}</span>
            {value === filter.value && (
              <Check className="h-3.5 w-3.5 text-[#FF3F3F]" />
            )}
          </button>
        ))}
      </div>
    </details>
  );
}
