import { Camera, Check, ImagePlus, Upload, X } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface PhotosStepProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

export default function PhotosStep({
  images,
  onChange,
  maxImages = 5,
}: PhotosStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const merged = [...images, ...selected].slice(0, maxImages);

    onChange(merged);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10">
            <ImagePlus className="h-4 w-4 text-violet-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Add photos
              </p>

              <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-zinc-600">
                Optional
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-zinc-700">
              Show people what you're looking for.
            </p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            group flex min-h-[180px] w-full flex-col
            items-center justify-center
            rounded-2xl border border-dashed
            border-white/[0.09]
            bg-[#111317]
            px-5 py-8
            text-center
            transition-all
            hover:border-[#FF3F3F]/30
            hover:bg-[#FF3F3F]/[0.02]
          "
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.035] transition group-hover:bg-[#FF3F3F]/10">
            <Upload className="h-5 w-5 text-zinc-600 transition group-hover:text-[#FF3F3F]" />
          </div>

          <p className="mt-4 text-[11px] font-semibold text-zinc-300">
            Add photos
          </p>

          <p className="mt-1 text-[9px] text-zinc-700">
            Click to choose photos from your device
          </p>

          <span className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[8px] font-medium text-zinc-600">
            Up to {maxImages} photos
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleInput}
      />

      {/* Mobile camera shortcut */}
      {images.length < maxImages && (
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-[#111317] py-3 text-[9px] font-semibold text-zinc-400"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Gallery
          </button>

          <button
            type="button"
            onClick={() => {
              if (!inputRef.current) return;

              inputRef.current.setAttribute("capture", "environment");
              inputRef.current.click();
              inputRef.current.removeAttribute("capture");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-[#111317] py-3 text-[9px] font-semibold text-zinc-400"
          >
            <Camera className="h-3.5 w-3.5" />
            Camera
          </button>
        </div>
      )}

      {/* Preview */}
      {images.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Selected photos
              </p>

              <p className="mt-1 text-[9px] text-zinc-700">
                {images.length} of {maxImages}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-emerald-400">
              <Check className="h-3 w-3" />
              Added
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.07] bg-[#111317]"
                >
                  <img
                    src={previewUrl}
                    alt={`Upload ${index + 1}`}
                    className="h-full w-full object-cover"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="
                      absolute right-1.5 top-1.5
                      flex h-6 w-6 items-center justify-center
                      rounded-lg
                      bg-black/60
                      text-zinc-300
                      backdrop-blur
                      transition
                      hover:bg-red-500
                      hover:text-white
                    "
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-1 text-[7px] font-semibold text-white backdrop-blur">
                      Main
                    </span>
                  )}
                </div>
              );
            })}

            {/* Add another */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="
                  flex aspect-square
                  items-center justify-center
                  rounded-xl
                  border border-dashed border-white/[0.08]
                  bg-[#111317]
                  text-zinc-700
                  transition
                  hover:border-[#FF3F3F]/30
                  hover:text-[#FF3F3F]
                "
              >
                <ImagePlus className="h-5 w-5" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Empty state explanation */}
      {images.length === 0 && (
        <div className="flex items-start gap-2 rounded-xl bg-white/[0.018] px-3 py-2.5">
          <ImagePlus className="mt-0.5 h-3 w-3 shrink-0 text-zinc-700" />

          <p className="text-[9px] leading-4 text-zinc-700">
            Photos aren't required. They can make your request easier to
            understand and may help you get better responses.
          </p>
        </div>
      )}

      {/* Skip / continue hint */}
      {images.length === 0 && (
        <div className="text-center">
          <p className="text-[9px] text-zinc-700">
            You can skip this step and add photos later.
          </p>
        </div>
      )}
    </div>
  );
}
