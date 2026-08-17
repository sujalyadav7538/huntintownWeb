
import { Check, IndianRupee, Wallet } from "lucide-react";

export const BUDGET_OPTIONS = [
  {
    value: "Negotiable",
    label: "Negotiable",
    description: "Open to discussion",
  },
  {
    value: "Under ₹500",
    label: "Under ₹500",
    description: "Small tasks",
  },
  {
    value: "₹500 - ₹1,000",
    label: "₹500 – ₹1K",
    description: "Quick help",
  },
  {
    value: "₹1,000 - ₹5,000",
    label: "₹1K – ₹5K",
    description: "Regular tasks",
  },
  {
    value: "₹5,000 - ₹10,000",
    label: "₹5K – ₹10K",
    description: "Larger tasks",
  },
  {
    value: "₹10,000+",
    label: "₹10K+",
    description: "Bigger projects",
  },
] as const;

export type Budget = (typeof BUDGET_OPTIONS)[number]["value"];

interface BudgetSelectorProps {
  value: Budget;
  onChange: (value: Budget) => void;
}

export default function BudgetSelector({
  value,
  onChange,
}: BudgetSelectorProps) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <Wallet className="h-3.5 w-3.5 text-zinc-500" />
          Budget
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          Choose an approximate budget. You can discuss the final amount later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BUDGET_OPTIONS.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                relative flex min-h-15.5 items-center gap-2.5
                rounded-xl border px-3 py-2.5 text-left
                transition-all duration-200
                ${
                  active
                    ? "border-[#FF3F3F]/45 bg-[#FF3F3F]/8"
                    : "border-[#252529] bg-[#111113] hover:border-zinc-700 hover:bg-[#141416]"
                }
              `}
            >
              <div
                className={`
                  flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                  ${
                    active
                      ? "bg-[#FF3F3F]/15 text-[#FF3F3F]"
                      : "bg-zinc-900 text-zinc-600"
                  }
                `}
              >
                <IndianRupee className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <p
                  className={`text-[11px] font-bold ${
                    active ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {option.label}
                </p>

                <p className="mt-0.5 truncate text-[9px] text-zinc-600">
                  {option.description}
                </p>
              </div>

              {active && (
                <span className="absolute right-2 top-2">
                  <Check className="h-3 w-3 text-[#FF3F3F]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
