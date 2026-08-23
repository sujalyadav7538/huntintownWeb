import { Flame, Zap, MapPin, Star, LayoutGrid, TrendingUp } from "lucide-react";

interface CategoryFilterRowProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  resultCount: number;
}

const FILTER_TABS = [
  { label: "All", icon: LayoutGrid },
  { label: "Urgent", icon: Zap },
  { label: "Trending", icon: TrendingUp },
  { label: "Nearby", icon: MapPin },
  { label: "Premium", icon: Star },
];

export default function CategoryFilterRow({
  selectedCategory,
  setSelectedCategory,
  resultCount,
}: CategoryFilterRowProps) {
  return (
    <div className="flex w-full items-center gap-2">
      {/* Filters */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none">
        {FILTER_TABS.map(({ label, icon: Icon }) => {
          const isActive = selectedCategory === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedCategory(label)}
              className={`
                group inline-flex shrink-0 cursor-pointer items-center gap-1.5
                rounded-xl border px-3 py-1.5
                text-[10px] font-semibold whitespace-nowrap
                transition-all duration-200
                ${
                  isActive
                    ? "theme-chip-active"
                    : "theme-chip"
                }
              `}
            >
              <Icon
                className={`
                  h-3 w-3 transition-colors
                  ${
                    isActive
                      ? "text-[#FF3F3F]"
                      : "theme-icon-muted"
                  }
                `}
              />

              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Active count */}
      <div className="theme-chip-count flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5">
        <Flame className="h-3 w-3 text-[#FF3F3F]" />

        <span className="theme-text-muted text-[10px] font-medium">
          <span className="theme-text-primary font-bold">{resultCount}</span> active
        </span>
      </div>
    </div>
  );
}
