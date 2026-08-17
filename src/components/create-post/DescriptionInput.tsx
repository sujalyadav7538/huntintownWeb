import { FileText } from "lucide-react";
import type { PostType } from "./PostTypeSelector";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  postType: PostType;
  maxLength?: number;
}

const CONTENT: Record<
  PostType,
  {
    label: string;
    placeholder: string;
    helper: string;
  }
> = {
  help_needed: {
    label: "What do you need help with?",
    placeholder: "e.g. I need someone to fix a leaking pipe in my kitchen...",
    helper: "Briefly describe what you need.",
  },
  offer_help: {
    label: "What can you help with?",
    placeholder:
      "e.g. I can help with home electrical repairs and installations...",
    helper: "Tell people what you can offer.",
  },
};

export default function DescriptionInput({
  value,
  onChange,
  postType,
  maxLength = 300,
}: DescriptionInputProps) {
  const content = CONTENT[postType];
  console.log(content,postType);

  const remaining = maxLength - value.length;
  const tooShort = value.trim().length > 0 && value.trim().length < 10;

  return (
    <div>
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div>
          <label
            htmlFor="post-description"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
          >
            <FileText className="h-3.5 w-3.5 text-zinc-500" />
            {content.label}
            <span className="text-[#FF3F3F]">*</span>
          </label>

          <p className="mt-0.5 text-[10px] text-zinc-600">{content.helper}</p>
        </div>

        <span
          className={`shrink-0 text-[10px] font-mono ${
            remaining < 30 ? "text-amber-500" : "text-zinc-700"
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>

      <textarea
        id="post-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={content.placeholder}
        maxLength={maxLength}
        rows={4}
        className="
          w-full resize-none rounded-2xl
          border border-[#252529]
          bg-[#111113]
          px-3.5 py-3
          text-sm leading-relaxed text-zinc-100
          placeholder:text-zinc-700
          outline-none
          transition-all duration-200
          focus:border-[#FF3F3F]/50
          focus:bg-[#131315]
          focus:ring-2
          focus:ring-[#FF3F3F]/5
        "
      />

      <div className="mt-1.5 min-h-4">
        {tooShort ? (
          <p className="text-[10px] text-amber-500">
            Please enter at least 10 characters.
          </p>
        ) : (
          <p className="text-[10px] text-zinc-700">
            Keep it clear and specific so others understand quickly.
          </p>
        )}
      </div>
    </div>
  );
}
