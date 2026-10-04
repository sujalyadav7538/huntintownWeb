import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";

export type OfferSort = "trustScoreAsc" | "trustScoreDesc" | "ratingAsc" | "ratingDesc" | "earliest" | "latest";

const OFFER_SORT_OPTIONS: { value: OfferSort; label: string; direction: "asc" | "desc" }[] = [
  // { value: "trustScoreAsc", label: "Trust score ascending", direction: "asc" },
  // { value: "trustScoreDesc", label: "Trust score descending", direction: "desc" },
  { value: "ratingAsc", label: "Rating ascending", direction: "asc" },
  { value: "ratingDesc", label: "Rating descending", direction: "desc" },
  { value: "earliest", label: "Earliest first", direction: "asc" },
  { value: "latest", label: "Latest first", direction: "desc" },
];

interface OfferSortMenuProps {
  value: OfferSort;
  onChange: (value: OfferSort) => void;
}

export default function OfferSortMenu({ value, onChange }: OfferSortMenuProps) {
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

  return (
    <details ref={menuRef} className="relative" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary aria-label="Filter and sort offers" title="Filter and sort offers" className="theme-icon-muted theme-hover-soft flex h-8 w-8 list-none items-center justify-center rounded-md transition [&::-webkit-details-marker]:hidden">
        <Filter className="h-4 w-4" />
      </summary>
      <div className="theme-panel absolute right-0 top-9 z-20 w-52 rounded-md border p-1 shadow-lg">
        {OFFER_SORT_OPTIONS.map((option) => {
          const DirectionIcon = option.direction === "asc" ? ArrowUp : ArrowDown;
          return (
            <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => { menuRef.current?.removeAttribute("open"); setOpen(false); onChange(option.value); }} className={`theme-text-primary theme-hover-soft inline-flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs ${value === option.value ? "font-bold" : "font-medium"}`}>
              <DirectionIcon className="theme-icon-muted h-3.5 w-3.5" /> {option.label}
            </button>
          );
        })}
      </div>
    </details>
  );
}
