
import { HandHelping, Sparkles } from "lucide-react";

export type PostType = "help_needed" | "offer_help";

interface PostTypeSelectorProps {
  value: PostType;
  onChange: (value: PostType) => void;
}

const OPTIONS: {
  value: PostType;
  title: string;
  description: string;
  icon: typeof HandHelping;
}[] = [
  {
    value: "help_needed",
    title: "I Need Help",
    description: "I’m looking for someone who can help me.",
    icon: HandHelping,
  },
  {
    value: "offer_help",
    title: "I Can Help",
    description: "I can help someone with a skill or service.",
    icon: Sparkles,
  },
];

export default function PostTypeSelector({
  value,
  onChange,
}: PostTypeSelectorProps) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="text-xs font-semibold text-zinc-300">
          What are you posting?
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-600">
          Choose how you want to connect with others.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                group relative flex items-start gap-3 rounded-2xl border p-3.5
                text-left transition-all duration-200
                ${
                  active
                    ? "border-[#FF3F3F]/50 bg-[#FF3F3F]/8"
                    : "border-[#252529] bg-[#111113] hover:border-zinc-700 hover:bg-[#141416]"
                }
              `}
            >
              {/* Selection indicator */}
              <span
                className={`
                  absolute right-3 top-3 h-2 w-2 rounded-full transition-all
                  ${
                    active
                      ? "bg-[#FF3F3F] shadow-[0_0_8px_#FF3F3F]"
                      : "bg-zinc-800 group-hover:bg-zinc-700"
                  }
                `}
              />

              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                  transition-colors
                  ${
                    active
                      ? "bg-[#FF3F3F]/15 text-[#FF3F3F]"
                      : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 pr-3">
                <p
                  className={`
                    text-xs font-bold
                    ${active ? "text-white" : "text-zinc-300"}
                  `}
                >
                  {option.title}
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
