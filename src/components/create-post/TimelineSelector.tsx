
import { Check, Clock } from "lucide-react";

export const TIMELINE_OPTIONS = [
  { value: "As soon as possible", label: "ASAP", description: "Need it soon" },
  { value: "Within 1 day", label: "Today / 1 day", description: "Very soon" },
  { value: "Within 3 days", label: "Within 3 days", description: "This week" },
  { value: "Within 7 days", label: "Within a week", description: "Flexible" },
  { value: "Within 30 days", label: "Within a month", description: "No rush" },
  { value: "Flexible", label: "Flexible", description: "Whenever suitable" },
] as const;

export type Timeline =
  (typeof TIMELINE_OPTIONS)[number]["value"];

interface TimelineSelectorProps {
  value: Timeline;
  onChange: (value: Timeline) => void;
}

export default function TimelineSelector({
  value,
  onChange,
}: TimelineSelectorProps) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          When do you need it?
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          Pick the timeframe that works for you.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TIMELINE_OPTIONS.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                relative min-h-[58px] rounded-xl border
                px-3 py-2.5 text-left transition-all duration-200
                ${
                  active
                    ? "border-[#FF3F3F]/45 bg-[#FF3F3F]/8"
                    : "border-[#252529] bg-[#111113] hover:border-zinc-700 hover:bg-[#141416]"
                }
              `}
            >
              <p
                className={`text-[11px] font-bold ${
                  active ? "text-white" : "text-zinc-300"
                }`}
              >
                {option.label}
              </p>

              <p className="mt-0.5 text-[9px] text-zinc-600">
                {option.description}
              </p>

              {active && (
                <Check className="absolute right-2 top-2 h-3 w-3 text-[#FF3F3F]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}