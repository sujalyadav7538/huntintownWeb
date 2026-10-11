import { useCallback, useEffect, useState } from "react";
import { Camera, Check, Trash2, X } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";

import { getAvatarUrl, handleAvatarError } from "@/src/shared/utils";

interface AvatarUploaderProps {
  avatar: string;
  name?: string;
  onChange: (file: File) => void;
  onRemove?: () => void;
  size?: "md" | "lg";
}

const OUTPUT_SIZE = 400;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function createCroppedFile(imageUrl: string, area: Area): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not prepare the cropped photo."));
        return;
      }

      context.drawImage(
        image,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not export the cropped photo."));
            return;
          }

          resolve(new File([blob], "profile-photo.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92,
      );
    };
    image.onerror = () => reject(new Error("Could not load this photo."));
    image.src = imageUrl;
  });
}

export default function AvatarUploader({
  avatar,
  name = "User",
  onChange,
  onRemove,
  size = "lg",
}: AvatarUploaderProps) {
  const dim = size === "lg" ? "h-28 w-28" : "h-20 w-20";
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleCropComplete = useCallback(
    (_area: Area, areaPixels: Area) => setCroppedArea(areaPixels),
    [],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setError("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleCropSave = async () => {
    if (!imageUrl || !croppedArea || isSaving) return;

    setIsSaving(true);
    setError("");
    try {
      onChange(await createCroppedFile(imageUrl, croppedArea));
      setImageUrl(null);
      setCroppedArea(null);
    } catch (cropError) {
      setError(
        cropError instanceof Error
          ? cropError.message
          : "Could not crop this photo.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="relative w-fit">
        <label className="group relative block w-fit cursor-pointer">
          <span className="absolute -inset-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-70 blur-[1px] transition-opacity group-hover:opacity-100" />
          <span className="relative block rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500 p-0.5">
            <img
              src={getAvatarUrl(name, avatar)}
              alt={name}
              className={`${dim} block rounded-full bg-zinc-900 object-cover`}
              onError={(event) => handleAvatarError(event, name)}
              referrerPolicy="no-referrer"
            />
          </span>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="flex flex-col items-center gap-1">
              <Camera aria-hidden="true" className="h-5 w-5 text-white" />
              <span className="text-[10px] font-semibold text-white/90">
                Change
              </span>
            </span>
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleFileChange}
          />
        </label>

        {avatar && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Delete profile photo"
            aria-label="Delete profile photo"
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#171717] text-zinc-400 transition hover:border-rose-500/40 hover:text-rose-400"
          >
            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error && !imageUrl && (
        <p className="mt-2 text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}

      {imageUrl && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <section
            aria-labelledby="profile-photo-crop-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] p-4 shadow-2xl sm:p-5"
            role="dialog"
          >
            <header className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="profile-photo-crop-title"
                  className="text-sm font-semibold text-zinc-100"
                >
                  Crop profile photo
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Square photo · saved at 400 × 400 px
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                aria-label="Cancel photo crop"
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </header>

            <div className="relative h-[min(70vw,320px)] min-h-60 w-full overflow-hidden rounded-xl bg-black">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <label className="mt-5 block text-xs font-medium text-zinc-400">
              Zoom
              <input
                type="range"
                min={1}
                max={4}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-2 block w-full accent-[#FF3F3F]"
              />
            </label>

            {error && (
              <p className="mt-3 text-xs text-rose-400" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                disabled={isSaving}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:text-zinc-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={isSaving || !croppedArea}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF3F3F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#e53535] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                {isSaving ? "Preparing..." : "Use photo"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}