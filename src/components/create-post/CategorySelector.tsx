
import {
  BriefcaseBusiness,
  Car,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Palette,
  PawPrint,
  Scale,
  ShoppingBasket,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const CATEGORIES = [
  {
    value: "Home & Living",
    label: "Home & Living",
    icon: House,
  },
  {
    value: "Tech & Electronics",
    label: "Tech & Electronics",
    icon: Laptop,
  },
  {
    value: "Education & Tutoring",
    label: "Education",
    icon: GraduationCap,
  },
  {
    value: "Health & Wellness",
    label: "Health & Wellness",
    icon: HeartPulse,
  },
  {
    value: "Events & Celebrations",
    label: "Events",
    icon: Palette,
  },
  {
    value: "Business & Finance",
    label: "Business",
    icon: BriefcaseBusiness,
  },
  {
    value: "Transport & Moving",
    label: "Transport",
    icon: Car,
  },
  {
    value: "Legal & Consulting",
    label: "Legal",
    icon: Scale,
  },
  {
    value: "Pets & Animals",
    label: "Pets",
    icon: PawPrint,
  },
  {
    value: "Fitness & Sports",
    label: "Fitness",
    icon: Dumbbell,
  },
  {
    value: "Food & Catering",
    label: "Food",
    icon: Utensils,
  },
  {
    value: "Shopping & Errands",
    label: "Shopping",
    icon: ShoppingBasket,
  },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedCategory = CATEGORIES.find((c) => c.value === value);
  const SelectedIcon = selectedCategory?.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/30 to-transparent hover:border-zinc-700/50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {SelectedIcon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF3F3F]/15 text-[#FF3F3F]">
              <SelectedIcon className="h-4 w-4" />
            </div>
          )}
          <span className="text-sm font-medium text-white">
            {selectedCategory?.label}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-md shadow-2xl shadow-black/50">
          <div className="grid grid-cols-2 gap-2 p-4 max-h-80 overflow-y-auto">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const active = value === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    onChange(category.value);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-150 text-left
                    ${
                      active
                        ? "bg-[#FF3F3F]/15 border border-[#FF3F3F]/30 text-white"
                        : "border border-zinc-800/30 bg-zinc-900/30 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700/50 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-7 w-7 items-center justify-center rounded-lg
                      transition-colors flex-shrink-0
                      ${
                        active
                          ? "bg-[#FF3F3F]/20 text-[#FF3F3F]"
                          : "bg-zinc-800/50 text-zinc-500 group-hover:text-zinc-300"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium leading-tight">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
