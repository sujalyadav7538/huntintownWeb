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
                    ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/10 text-zinc-100"
                    : "border-[#1e1e22] bg-[#111113] text-zinc-500 hover:border-[#29292e] hover:bg-[#151518] hover:text-zinc-300"
                }
              `}
            >
              <Icon
                className={`
                  h-3 w-3 transition-colors
                  ${
                    isActive
                      ? "text-[#FF3F3F]"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }
                `}
              />

              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Active count */}
      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#1e1e22] bg-[#111113] px-3 py-1.5">
        <Flame className="h-3 w-3 text-[#FF3F3F]" />

        <span className="text-[10px] font-medium text-zinc-600">
          <span className="font-bold text-zinc-300">{resultCount}</span> active
        </span>
      </div>
    </div>
  );
}
