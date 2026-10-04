import { useMemo } from "react";
import {
  Clock3,
  IndianRupee,
  Lightbulb,
  PenLine,
  Sparkles,
} from "lucide-react";

interface DetailsStepProps {
  title: string;
  description: string;
  budget: string;
  timeline: string;
  category: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
}

const BUDGETS = [
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,000",
  "₹2,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000+",
  "Negotiable",
];

const TIMELINES = ["Today", "Tomorrow", "This Week", "Next Week", "Flexible"];

const TITLE_SUGGESTIONS: Record<string, string[]> = {
  home_services: [
    "Need help with home repair",
    "Need someone for home maintenance",
    "Looking for help with household work",
  ],
  technology: [
    "Need a React developer",
    "Need help building a website",
    "Need help fixing a software issue",
  ],
  repairs: [
    "Need help repairing an appliance",
    "Need someone for repair work",
    "Looking for a repair professional",
  ],
  delivery: [
    "Need something delivered",
    "Need pickup and drop service",
    "Need help moving an item",
  ],
  moving: [
    "Need help moving furniture",
    "Need movers for household items",
    "Need help shifting items",
  ],
  cleaning: [
    "Need help cleaning my home",
    "Looking for a cleaning service",
    "Need deep cleaning",
  ],
  education: [
    "Looking for a tutor",
    "Need help with a subject",
    "Looking for learning support",
  ],
  design: [
    "Need help with a design project",
    "Looking for a designer",
    "Need help with creative work",
  ],
  business: [
    "Need help with a business task",
    "Looking for business support",
    "Need help with marketing",
  ],
  personal: [
    "Need help with a personal task",
    "Looking for someone to help",
    "Need assistance with something",
  ],
  other: [
    "Need help with something",
    "Looking for someone who can help",
    "Need assistance with a task",
  ],
};

export default function DetailsStep({
  title,
  description,
  budget,
  timeline,
  category,
  onTitleChange,
  onDescriptionChange,
  onBudgetChange,
  onTimelineChange,
}: DetailsStepProps) {
  const suggestions = useMemo(
    () => TITLE_SUGGESTIONS[category] ?? TITLE_SUGGESTIONS.other,
    [category],
  );

  const selectedBudget = BUDGETS.includes(budget);
  const selectedTimeline = TIMELINES.includes(timeline);

  return (
    <div className="space-y-7">
      {/* =====================================================
          TITLE
      ====================================================== */}
      <section>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PenLine className="h-3.5 w-3.5 text-[#FF3F3F]" />
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                What do you need?
              </p>
            </div>

            <p className="mt-1 text-[10px] text-zinc-700">
              Pick a suggestion or write your own.
            </p>
          </div>

          <span className="text-[9px] text-zinc-700">{title.length}/100</span>
        </div>

        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={100}
          placeholder="e.g. Need a plumber for bathroom repair"
          className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111317] px-3.5 text-[12px] text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/40 focus:bg-[#13161a]"
        />

        <div className="mt-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-amber-400" />
            <p className="text-[9px] font-medium text-zinc-600">Suggestions</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onTitleChange(suggestion)}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-[9px] transition ${title === suggestion ? "border-[#FF3F3F]/30 bg-[#FF3F3F]/10 text-[#ff6565]" : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:border-white/[0.11] hover:text-zinc-300"}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}
      <section>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              A little more detail
            </p>
            <p className="mt-1 text-[10px] text-zinc-700">
              Tell people what actually needs to be done.
            </p>
          </div>

          <span className="text-[9px] text-zinc-700">
            {description.length}/300
          </span>
        </div>

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          maxLength={300}
          rows={4}
          placeholder="Describe the task, problem, or result you need..."
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#111317] px-3.5 py-3 text-[11px] leading-5 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/40 focus:bg-[#13161a]"
        />

        <div className="mt-2 flex items-center gap-1.5 text-[9px] text-zinc-700">
          <Sparkles className="h-3 w-3" />
          Keep it short. You can add photos and questions later.
        </div>
      </section>

      {/* =====================================================
          BUDGET
      ====================================================== */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              What's your budget?
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-700">
              Choose a range. No typing needed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BUDGETS.map((item) => {
            const active = budget === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => onBudgetChange(item)}
                className={`rounded-xl border px-3 py-2.5 text-[10px] font-semibold transition ${active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/[0.06] bg-[#111317] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"}`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {!selectedBudget && (
          <p className="mt-2 text-[9px] text-zinc-700">
            Select one to continue.
          </p>
        )}
      </section>

      {/* =====================================================
          TIMELINE
      ====================================================== */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10">
            <Clock3 className="h-3.5 w-3.5 text-amber-400" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              When do you need it?
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-700">
              Choose the closest option.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIMELINES.map((item) => {
            const active = timeline === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => onTimelineChange(item)}
                className={`rounded-xl border px-3 py-2.5 text-[10px] font-semibold transition ${active ? "border-amber-400/30 bg-amber-400/10 text-amber-300" : "border-white/[0.06] bg-[#111317] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"}`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {!selectedTimeline && (
          <p className="mt-2 text-[9px] text-zinc-700">
            Select one to continue.
          </p>
        )}
      </section>
    </div>
  );
}
