import { useState } from "react";
import {
  BriefcaseBusiness,
  Brush,
  Car,
  ChevronDown,
  GraduationCap,
  Home,
  Laptop,
  MoreHorizontal,
  Package,
  Scissors,
  Sparkles,
  Wrench,
} from "lucide-react";

interface CategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORIES = [
  { value: "home_services", label: "Home Services", icon: Home },
  { value: "technology", label: "Technology", icon: Laptop },
  { value: "repairs", label: "Repairs", icon: Wrench },
  { value: "delivery", label: "Delivery", icon: Package },
  { value: "moving", label: "Moving", icon: Car },
  { value: "cleaning", label: "Cleaning", icon: Sparkles },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "design", label: "Design & Creative", icon: Brush },
  { value: "business", label: "Business", icon: BriefcaseBusiness },
  { value: "personal", label: "Personal", icon: Scissors },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

export default function CategoryStep({ value, onChange }: CategoryStepProps) {
  const [open, setOpen] = useState(false);

  const selected = CATEGORIES.find((item) => item.value === value);

  return (
    <div className="space-y-6">
      {/* Primary selector */}
      <div>
        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          Category
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left transition ${value ? "border-[#FF3F3F]/40 bg-[#FF3F3F]/[0.04]" : "border-white/[0.08] bg-[#111317] hover:border-white/[0.14]"}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF3F3F]/10">
                {selected ? (
                  <selected.icon className="h-4 w-4 text-[#FF3F3F]" />
                ) : (
                  <Sparkles className="h-4 w-4 text-zinc-500" />
                )}
              </div>

              <span
                className={`truncate text-[12px] font-medium ${selected ? "text-zinc-100" : "text-zinc-500"}`}
              >
                {selected?.label ?? "Select a category"}
              </span>
            </div>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121519] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
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
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left transition ${active ? "bg-[#FF3F3F]/10 text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"}`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${active ? "text-[#FF3F3F]" : "text-zinc-600"}`}
                      />
                      <span className="truncate text-[10px] font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular categories */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Popular categories
            </p>
            <p className="mt-1 text-[10px] text-zinc-700">
              Pick one to continue
            </p>
          </div>

          <span className="text-[9px] text-zinc-700">
            {CATEGORIES.length} available
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.slice(0, 8).map((category) => {
            const Icon = category.icon;
            const active = value === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onChange(category.value)}
                className={`group relative flex min-h-[92px] flex-col items-center justify-center rounded-xl border px-3 py-4 text-center transition-all ${active ? "border-[#FF3F3F]/50 bg-[#FF3F3F]/[0.07] shadow-[0_0_25px_rgba(255,63,63,0.06)]" : "border-white/[0.06] bg-[#111317] hover:border-white/[0.12] hover:bg-white/[0.025]"}`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-[#FF3F3F]/15" : "bg-white/[0.03] group-hover:bg-white/[0.05]"}`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-[#FF3F3F]" : "text-zinc-500 group-hover:text-zinc-300"}`}
                  />
                </div>

                <span
                  className={`mt-2 text-[9px] font-semibold ${active ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"}`}
                >
                  {category.label}
                </span>

                {active && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF3F3F]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Small guidance */}
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.018] px-3 py-2.5">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        <p className="text-[9px] leading-4 text-zinc-600">
          Your category helps us suggest a suitable title and questions in the
          next steps.
        </p>
      </div>
    </div>
  );
}
