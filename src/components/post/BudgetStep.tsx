import { IndianRupee, MessageCircle } from "lucide-react";

interface BudgetStepProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000+",
];

export default function BudgetStep({
  value,
  onChange,
}: BudgetStepProps) {
  const isNegotiable = value === "Negotiable";

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Budget
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          What is your budget?
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          Give people an idea of what you have in mind.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`
                rounded-xl border px-3 py-3 text-left
                text-[10px] font-semibold transition-all
                ${
                  selected
                    ? "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-300"
                    : "border-white/[0.06] bg-white/[0.018] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
                }
              `}
            >
              <IndianRupee
                className={`mb-2 h-3.5 w-3.5 ${
                  selected ? "text-emerald-400" : "text-zinc-700"
                }`}
              />

              {option}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onChange("Negotiable")}
          className={`
            rounded-xl border px-3 py-3 text-left
            text-[10px] font-semibold transition-all
            ${
              isNegotiable
                ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/[0.06] text-[#ff6b6b]"
                : "border-white/[0.06] bg-white/[0.018] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
            }
          `}
        >
          <MessageCircle
            className={`mb-2 h-3.5 w-3.5 ${
              isNegotiable ? "text-[#ff5555]" : "text-zinc-700"
            }`}
          />

          Negotiable
        </button>
      </div>

      {/* Custom budget */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Or enter an amount
        </label>

        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-700" />

          <input
            type="number"
            min={0}
            placeholder="Enter budget"
            value={
              OPTIONS.includes(value) || value === "Negotiable" ? "" : value
            }
            onChange={(e) => onChange(e.target.value)}
            className="
              h-11 w-full rounded-xl border border-white/[0.06]
              bg-white/[0.018] pl-9 pr-3.5 text-xs text-zinc-200
              outline-none transition placeholder:text-zinc-700
              focus:border-emerald-500/30
            "
          />
        </div>
      </div>
    </section>
  );
}