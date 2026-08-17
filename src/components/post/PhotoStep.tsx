import { ImagePlus, X } from "lucide-react";

interface PhotosStepProps {
  files: File[];
  previews: string[];
  onChange: (files: File[]) => void;
  maxImages?: number;
}

export default function PhotosStep({
  files,
  previews,
  onChange,
  maxImages = 3,
}: PhotosStepProps) {
  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const validFiles = Array.from(incoming).filter((file) =>
      file.type.startsWith("image/"),
    );

    const nextFiles = [...files, ...validFiles].slice(0, maxImages);

    onChange(nextFiles);
  };

  const removeImage = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Photos
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          Add some context
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          Photos are optional, but they can help people understand your post.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {previews.map((preview, index) => (
          <div
            key={`${preview}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="
                absolute right-1.5 top-1.5 flex h-6 w-6
                items-center justify-center rounded-full
                bg-black/70 text-zinc-300 backdrop-blur
                transition hover:bg-red-500 hover:text-white
              "
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {files.length < maxImages && (
          <label
            className="
              flex aspect-square cursor-pointer flex-col
              items-center justify-center rounded-xl
              border border-dashed border-white/[0.09]
              bg-white/[0.015] transition
              hover:border-[#FF3F3F]/30
              hover:bg-[#FF3F3F]/[0.03]
            "
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035] text-zinc-600">
              <ImagePlus className="h-4 w-4" />
            </div>

            <span className="mt-2 text-[9px] font-semibold text-zinc-600">
              Add photo
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-zinc-700">
        <span>Optional</span>
        <span>
          {files.length}/{maxImages} photos
        </span>
      </div>
    </section>
  );
}