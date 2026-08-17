import {
  BriefcaseBusiness,
  Car,
  GraduationCap,
  Home,
  Laptop,
  MoreHorizontal,
  ShoppingBag,
  Users,
} from "lucide-react";

interface CategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORIES = [
  {
    id: "services",
    label: "Services",
    description: "Professional or local services",
    icon: BriefcaseBusiness,
  },
  {
    id: "education",
    label: "Education",
    description: "Tutoring, courses or learning",
    icon: GraduationCap,
  },
  {
    id: "technology",
    label: "Technology",
    description: "Tech, software or digital help",
    icon: Laptop,
  },
  {
    id: "home",
    label: "Home & Repair",
    description: "Repairs, maintenance or home help",
    icon: Home,
  },
  {
    id: "transport",
    label: "Transport",
    description: "Travel, delivery or vehicle help",
    icon: Car,
  },
  {
    id: "shopping",
    label: "Shopping",
    description: "Buying, selling or finding items",
    icon: ShoppingBag,
  },
  {
    id: "community",
    label: "Community",
    description: "Local or community assistance",
    icon: Users,
  },
  {
    id: "other",
    label: "Other",
    description: "Something that doesn't fit above",
    icon: MoreHorizontal,
  },
];

export default function CategoryStep({
  value,
  onChange,
}: CategoryStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Choose a category
        </p>

        <p className="mt-1 text-[11px] text-zinc-600">
          Pick the category that best describes your requirement.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const selected = value === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              aria-pressed={selected}
              className={`
                group relative flex min-h-[108px] flex-col
                items-start justify-between rounded-xl border p-3
                text-left transition-all duration-200
                ${
                  selected
                    ? "border-[#FF3F3F]/45 bg-[#FF3F3F]/[0.07] shadow-[0_0_24px_rgba(255,63,63,0.06)]"
                    : "border-white/[0.055] bg-white/[0.018] hover:border-white/[0.12] hover:bg-white/[0.03]"
                }
              `}
            >
              {/* Selection indicator */}
              <span
                className={`
                  absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full
                  transition-all
                  ${
                    selected
                      ? "bg-[#FF3F3F] shadow-[0_0_8px_rgba(255,63,63,0.7)]"
                      : "bg-zinc-800 group-hover:bg-zinc-600"
                  }
                `}
              />

              {/* Icon */}
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-lg
                  transition-colors
                  ${
                    selected
                      ? "bg-[#FF3F3F]/10 text-[#FF5555]"
                      : "bg-white/[0.035] text-zinc-600 group-hover:text-zinc-400"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="mt-3 min-w-0">
                <p
                  className={`
                    text-[11px] font-semibold transition-colors
                    ${selected ? "text-zinc-100" : "text-zinc-400"}
                  `}
                >
                  {category.label}
                </p>

                <p className="mt-0.5 line-clamp-2 text-[9px] leading-relaxed text-zinc-700">
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}