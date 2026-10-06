import { useMemo } from "react";
import {
  AlignLeft,
  Clock3,
  IndianRupee,
  Lightbulb,
  PenLine,
} from "lucide-react";
import {
  CharCount,
  FormSection,
} from "@/src/features/posts/components/FormSection";
import { ComboInput } from "@/src/features/posts/components/Dropdowns";
import {
  BUDGET_MAX,
  DESCRIPTION_MAX,
  TIMELINE_MAX,
  TITLE_MAX,
} from "@/src/features/posts/lib/postForm";

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

const TIMELINES = [
  "Today",
  "Tomorrow",
  "Within 3 days",
  "This Week",
  "Next Week",
  "This Month",
  "Flexible",
];

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

  return (
    <div className="space-y-4">
      <FormSection
        icon={PenLine}
        title="Title"
        hint="A short headline people will see first."
        aside={<CharCount value={title.length} max={TITLE_MAX} />}
      >
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={TITLE_MAX}
          aria-label="Requirement title"
          placeholder="e.g. Need a plumber for bathroom repair"
          className="theme-input h-11 w-full rounded-lg border px-3.5 text-sm outline-none transition"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="theme-text-muted inline-flex items-center gap-1 text-[11px] font-medium">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            Try:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onTitleChange(suggestion)}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                title === suggestion
                  ? "theme-chip-active text-[#FF3F3F]"
                  : "theme-chip theme-divider"
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection
        icon={AlignLeft}
        title="Description"
        hint="What needs to be done? Mention anything a helper should know."
        aside={<CharCount value={description.length} max={DESCRIPTION_MAX} />}
      >
        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          maxLength={DESCRIPTION_MAX}
          rows={4}
          aria-label="Requirement description"
          placeholder="Describe the task, problem, or result you need..."
          className="theme-input w-full resize-none rounded-lg border px-3.5 py-3 text-sm leading-6 outline-none transition"
        />
      </FormSection>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormSection
          icon={IndianRupee}
          title="Budget"
          hint="Type an amount or range, or pick a suggestion."
        >
          <ComboInput
            value={budget}
            onChange={onBudgetChange}
            suggestions={BUDGETS}
            maxLength={BUDGET_MAX}
            ariaLabel="Budget"
            placeholder="e.g. ₹3,500 or ₹800/hour"
          />
        </FormSection>

        <FormSection
          icon={Clock3}
          title="Timeline"
          hint="Type when you need it, or pick a suggestion."
        >
          <ComboInput
            value={timeline}
            onChange={onTimelineChange}
            suggestions={TIMELINES}
            maxLength={TIMELINE_MAX}
            ariaLabel="Timeline"
            placeholder="e.g. By Saturday evening"
          />
        </FormSection>
      </div>
    </div>
  );
}
