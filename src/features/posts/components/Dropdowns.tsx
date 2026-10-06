import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown, Search } from "lucide-react";

const usePopover = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return { open, setOpen, rootRef };
};

/* ================================================================
   SelectDropdown — pick one value from a fixed, searchable list
================================================================ */

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

export function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  ariaLabel,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  ariaLabel: string;
}) {
  const { open, setOpen, rootRef } = usePopover();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const listId = useId();

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? options.filter(
          (option) =>
            option.label.toLowerCase().includes(term) ||
            option.hint?.toLowerCase().includes(term),
        )
      : options;
  }, [options, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(Math.max(0, options.findIndex((o) => o.value === value)));
    }
  }, [open, options, value]);

  const choose = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") return setOpen(false);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => Math.min(filtered.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && filtered[highlight]) {
      event.preventDefault();
      choose(filtered[highlight]);
    }
  };

  const SelectedIcon = selected?.icon;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`theme-input flex h-12 w-full items-center gap-3 rounded-lg border px-3.5 text-left transition ${
          open ? "border-[#FF3F3F]/40" : ""
        }`}
      >
        {SelectedIcon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FF3F3F]/10 text-[#FF3F3F]">
            <SelectedIcon className="h-4 w-4" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-sm ${selected ? "theme-text-primary font-medium" : "theme-text-muted"}`}
          >
            {selected?.label ?? placeholder}
          </span>
          {selected?.hint && (
            <span className="theme-text-muted block truncate text-[11px]">
              {selected.hint}
            </span>
          )}
        </span>
        <ChevronDown
          className={`theme-icon-muted h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="theme-panel absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border shadow-xl">
          <div className="theme-divider relative border-b p-2">
            <Search className="theme-icon-muted pointer-events-none absolute left-4.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlight(0);
              }}
              onKeyDown={onKeyDown}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              className="theme-input h-9 w-full rounded-md border pl-8 pr-2 text-sm outline-none"
            />
          </div>

          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="theme-text-muted px-3 py-4 text-center text-xs">
                No match for "{query}"
              </li>
            ) : (
              filtered.map((option, index) => {
                const Icon = option.icon;
                const active = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => choose(option)}
                      onMouseEnter={() => setHighlight(index)}
                      className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition ${
                        index === highlight ? "bg-(--app-surface-soft)" : ""
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`h-4 w-4 shrink-0 ${active ? "text-[#FF3F3F]" : "theme-icon-muted"}`}
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="theme-text-primary block truncate text-sm">
                          {option.label}
                        </span>
                        {option.hint && (
                          <span className="theme-text-muted block truncate text-[11px]">
                            {option.hint}
                          </span>
                        )}
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0 text-[#FF3F3F]" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ComboInput — free text with optional quick-pick suggestions
================================================================ */

export function ComboInput({
  value,
  onChange,
  suggestions,
  placeholder,
  icon: Icon,
  maxLength,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  icon?: LucideIcon;
  maxLength?: number;
  ariaLabel: string;
}) {
  const { open, setOpen, rootRef } = usePopover();
  const listId = useId();

  // Show every suggestion until the user types something that isn't one of them.
  const term = value.trim().toLowerCase();
  const isPreset = suggestions.some((item) => item.toLowerCase() === term);
  const visible =
    term && !isPreset
      ? suggestions.filter((item) => item.toLowerCase().includes(term))
      : suggestions;

  return (
    <div ref={rootRef} className="relative">
      {Icon && (
        <Icon className="theme-icon-muted pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
      )}
      <input
        value={value}
        maxLength={maxLength}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") setOpen(false);
        }}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open && visible.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        className={`theme-input h-12 w-full rounded-lg border pr-10 text-sm outline-none transition ${Icon ? "pl-10" : "pl-3.5"}`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Show suggestions"
        onClick={() => setOpen((current) => !current)}
        className="theme-icon-muted absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && visible.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="theme-panel absolute inset-x-0 top-full z-30 mt-1.5 max-h-60 overflow-y-auto rounded-lg border p-1 shadow-xl"
        >
          {visible.map((item) => {
            const active = item.toLowerCase() === term;
            return (
              <li key={item} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className="theme-hover-soft flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm"
                >
                  <span className="theme-text-primary">{item}</span>
                  {active && <Check className="h-4 w-4 text-[#FF3F3F]" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
