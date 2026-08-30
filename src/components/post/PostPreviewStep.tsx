import {
  MapPin,
  Clock,
  Image as ImageIcon,
  HelpCircle,
  CalendarDays,
} from "lucide-react";

interface PostFormData {
  title: string;
  description: string;
  category: string;
  address: string;
  coordinates: [number, number] | null;
  budget: string;
  timeline: string;
  images: File[];
  imagePreviews: string[];
  questions: string[];
  expiryDays: number;
}

interface PostPreviewStepProps {
  form: PostFormData;
}

export default function PostPreviewStep({ form }: PostPreviewStepProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#111113]">
        {/* Preview Header */}
        <div className="border-b border-[#1e1e22] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-[#FF3F3F]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#FF5A5A]">
              {form.category || "Requirement"}
            </span>

            <span className="text-[9px] text-zinc-600">Preview</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Title */}
          <h2 className="text-lg font-bold leading-6 text-white">
            {form.title || "Your requirement title"}
          </h2>

          {/* Description */}
          <p className="mt-2 text-[11px] leading-5 text-zinc-400">
            {form.description || "Your requirement description"}
          </p>

          {/* Main Details */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <PreviewItem
              icon={<span className="text-sm">₹</span>}
              label="Budget"
              value={form.budget || "Negotiable"}
            />

            <PreviewItem
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Timeline"
              value={form.timeline || "Flexible"}
            />

            {form.address && (
              <PreviewItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Location"
                value={form.address}
                full
              />
            )}

            <PreviewItem
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Expires"
              value={`${form.expiryDays} days`}
            />
          </div>

          {/* Images */}
          {form.imagePreviews.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-zinc-500" />

                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                  Images
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {form.imagePreviews.slice(0, 6).map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Requirement ${index + 1}`}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {form.questions.length > 0 && (
            <div className="mt-5 rounded-xl border border-[#1e1e22] bg-[#0e0e10] p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />

                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                  Questions for applicants
                </span>
              </div>

              <div className="space-y-1.5">
                {form.questions.map((question, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white/[0.025] px-2.5 py-2 text-[10px] text-zinc-400"
                  >
                    {index + 1}. {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewItem({
  icon,
  label,
  value,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-[#1e1e22] bg-[#0e0e10] p-3 ${
        full ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 text-zinc-600">
        {icon}

        <span className="text-[8px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-[10px] font-semibold text-zinc-300">
        {value}
      </p>
    </div>
  );
}
