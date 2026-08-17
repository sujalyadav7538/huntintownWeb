import { FileText } from "lucide-react";

interface DetailsStepProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  postType: "need" | "offer";
}

export default function DetailsStep({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  postType,
}: DetailsStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Tell us more
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          What do you need?
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          Give people enough context to understand what you're looking for.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            <FileText className="h-3 w-3" />
            Title
          </label>

          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={
              postType === "need"
                ? "e.g. Need a plumber for kitchen repair"
                : "e.g. I can help with React development"
            }
            maxLength={120}
            className="
              h-11 w-full rounded-xl border border-white/[0.06]
              bg-white/[0.018] px-3.5 text-xs text-zinc-200
              outline-none transition
              placeholder:text-zinc-700
              focus:border-[#FF3F3F]/40
              focus:bg-white/[0.025]
            "
          />

          <div className="mt-1.5 flex justify-end">
            <span className="text-[9px] text-zinc-700">
              {title.length}/120
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={
              postType === "need"
                ? "Describe what you need, the situation, and any important details..."
                : "Describe what you can help with, your experience, and what you can offer..."
            }
            maxLength={1000}
            rows={6}
            className="
              w-full resize-none rounded-xl border border-white/[0.06]
              bg-white/[0.018] px-3.5 py-3 text-xs leading-relaxed
              text-zinc-200 outline-none transition
              placeholder:text-zinc-700
              focus:border-[#FF3F3F]/40
              focus:bg-white/[0.025]
            "
          />

          <div className="mt-1.5 flex justify-between">
            <span className="text-[9px] text-zinc-700">
              Keep it clear and specific.
            </span>

            <span className="text-[9px] text-zinc-700">
              {description.length}/1000
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}