import { useState } from "react";
import {
  CalendarClock,
  ClipboardCheck,
  HelpCircle,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";
import {
  FormSection,
  OptionChip,
} from "@/src/features/posts/components/FormSection";
import {
  ACCEPTED_IMAGE_TYPES,
  EXPIRY_OPTIONS,
  MAX_IMAGE_BYTES,
  MAX_POST_IMAGES,
  MAX_QUESTIONS,
  QUESTION_MAX,
  getCategoryLabel,
} from "@/src/features/posts/lib/postForm";

interface ExtraDetailsStepProps {
  images: File[];
  imagePreviews: string[];
  questions: string[];
  expiryDays: number;
  summary: {
    category: string;
    title: string;
    budget: string;
    timeline: string;
    address: string;
    hasCoordinates: boolean;
  };
  onImagesChange: (images: File[]) => void;
  onQuestionsChange: (questions: string[]) => void;
  onExpiryChange: (value: number) => void;
}

export default function ExtraDetailsStep({
  images,
  imagePreviews,
  questions,
  expiryDays,
  summary,
  onImagesChange,
  onQuestionsChange,
  onExpiryChange,
}: ExtraDetailsStepProps) {
  const [imageError, setImageError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    const valid = files.filter(
      (file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES,
    );
    const room = MAX_POST_IMAGES - images.length;

    if (valid.length < files.length) {
      setImageError("Only JPG, PNG or WEBP images up to 5 MB are allowed.");
    } else if (valid.length > room) {
      setImageError(`You can add up to ${MAX_POST_IMAGES} photos.`);
    } else {
      setImageError("");
    }

    if (valid.length && room > 0) {
      onImagesChange([...images, ...valid.slice(0, room)]);
    }
  };

  const removeImage = (index: number) => {
    setImageError("");
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    onQuestionsChange(questions.map((q, i) => (i === index ? value : q)));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <FormSection
          icon={ImagePlus}
          title="Photos"
          hint="Photos help helpers understand the job at a glance."
          optional
          aside={
            <span className="theme-text-muted text-[11px] tabular-nums">
              {images.length}/{MAX_POST_IMAGES}
            </span>
          }
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imagePreviews.map((src, index) => (
              <div
                key={src}
                className="theme-divider group relative aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  src={src}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition hover:bg-[#FF3F3F]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {images.length < MAX_POST_IMAGES && (
              <label className="theme-divider theme-text-muted flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed transition hover:border-[#FF3F3F]/50 hover:text-[#FF3F3F]">
                <ImagePlus className="h-5 w-5" />
                <span className="text-[11px] font-medium">Add photo</span>
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  multiple
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          {imageError && (
            <p role="alert" className="mt-2 text-xs text-red-400">
              {imageError}
            </p>
          )}
        </FormSection>

        <FormSection
          icon={HelpCircle}
          title="Screening questions"
          hint="Ask what helpers should answer when they send an offer."
          optional
          aside={
            questions.length < MAX_QUESTIONS && (
              <button
                type="button"
                onClick={() => onQuestionsChange([...questions, ""])}
                className="theme-link-accent inline-flex items-center gap-1 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            )
          }
        >
          {questions.length === 0 ? (
            <button
              type="button"
              onClick={() => onQuestionsChange([""])}
              className="theme-divider theme-text-muted flex w-full items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-left text-xs transition hover:border-[#FF3F3F]/40"
            >
              <Plus className="h-4 w-4 text-[#FF3F3F]" />
              e.g. "Have you done this kind of work before?"
            </button>
          ) : (
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="theme-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={question}
                    maxLength={QUESTION_MAX}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    aria-label={`Question ${index + 1}`}
                    placeholder="What would you like to know?"
                    className="theme-input h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onQuestionsChange(questions.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove question ${index + 1}`}
                    className="theme-icon-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection
          icon={CalendarClock}
          title="Keep it live for"
          hint="Your post expires automatically after this period."
        >
          <div className="grid grid-cols-4 gap-2">
            {EXPIRY_OPTIONS.map((days) => (
              <OptionChip
                key={days}
                active={expiryDays === days}
                onClick={() => onExpiryChange(days)}
              >
                {days} days
              </OptionChip>
            ))}
          </div>
        </FormSection>
      </div>

      <aside className="lg:sticky lg:top-4 lg:self-start">
        <FormSection icon={ClipboardCheck} title="Review" hint="How your post will be published.">
          <dl className="space-y-3 text-xs">
            {[
              ["Category", getCategoryLabel(summary.category)],
              ["Title", summary.title],
              ["Budget", summary.budget],
              ["Timeline", summary.timeline],
              [
                "Location",
                summary.address ||
                  (summary.hasCoordinates ? "Current location" : "—"),
              ],
              ["Photos", `${images.length}`],
              ["Questions", `${questions.filter((q) => q.trim()).length}`],
              ["Expires in", `${expiryDays} days`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="theme-text-muted shrink-0">{label}</dt>
                <dd className="theme-text-primary min-w-0 truncate text-right font-medium">
                  {value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </FormSection>
      </aside>
    </div>
  );
}
