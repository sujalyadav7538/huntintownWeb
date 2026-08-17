import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploaderProps {
  files: File[];
  previews: string[];
  onChange: (files: File[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  files,
  previews,
  onChange,
  maxImages = 3,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addImages = (incoming: FileList | null) => {
    if (!incoming) return;

    const remaining = maxImages - files.length;

    if (remaining <= 0) return;

    const newFiles = Array.from(incoming)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remaining);

    if (!newFiles.length) return;

    onChange([...files, ...newFiles]);
  };

  const removeImage = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <ImagePlus className="h-3.5 w-3.5 text-zinc-500" />
          Photos
          <span className="font-normal text-zinc-600">
            optional · max {maxImages}
          </span>
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          Add photos if they help explain the post.
        </p>
      </div>

      <div className="flex gap-2.5">
        {previews.map((preview, index) => (
          <div
            key={preview}
            className="
              group relative h-20 w-20 shrink-0
              overflow-hidden rounded-xl
              border border-[#252529]
              bg-[#111113]
            "
          >
            <img
              src={preview}
              alt={`Selected image ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="
                absolute right-1 top-1
                flex h-5 w-5 items-center justify-center
                rounded-full bg-black/70
                text-white opacity-0
                transition-opacity
                group-hover:opacity-100
              "
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {files.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addImages(e.dataTransfer.files);
            }}
            className={`
              flex h-20 w-20 shrink-0 flex-col
              items-center justify-center gap-1
              rounded-xl border border-dashed
              transition-all
              ${
                dragOver
                  ? "border-[#FF3F3F]/60 bg-[#FF3F3F]/5"
                  : "border-[#252529] bg-[#111113] hover:border-zinc-700"
              }
            `}
          >
            <ImagePlus className="h-4 w-4 text-zinc-600" />

            <span className="text-[9px] font-medium text-zinc-600">
              Add photo
            </span>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addImages(e.target.files);

                // Allow selecting the same file again.
                e.target.value = "";
              }}
            />
          </button>
        )}
      </div>

      {files.length > 0 && (
        <p className="mt-2 text-[9px] text-zinc-700">
          {files.length}/{maxImages} photos selected
        </p>
      )}
    </div>
  );
}