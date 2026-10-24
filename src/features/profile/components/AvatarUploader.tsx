import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Check, Trash2, X } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import UserAvatar from "@/src/shared/components/UserAvatar";

interface AvatarUploaderProps {
  avatar: string;
  name?: string;
  onChange: (file: File) => void;
  onRemove?: () => void;
  size?: "md" | "lg";
  variant?: "avatar" | "cover";
}

const OUTPUT_SIZE = 400;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

function createCroppedFile(imageUrl: string, area: Area, isCover: boolean): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = isCover ? 1600 : OUTPUT_SIZE;
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
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not export the cropped photo."));
            return;
          }

          resolve(new File([blob], isCover ? "cover-photo.jpg" : "profile-photo.jpg", { type: "image/jpeg" }));
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
  variant = "avatar",
}: AvatarUploaderProps) {
  const isCover = variant === "cover";
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
      setError("Choose a JPG, PNG, WEBP, HEIC, or HEIF image.");
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
      onChange(await createCroppedFile(imageUrl, croppedArea, isCover));
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
      <div className={isCover ? "absolute inset-0" : "relative w-fit"}>
        <label className={isCover ? "absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40" : "group relative block w-fit cursor-pointer"}>
          {isCover ? (
            <span className="rounded-lg bg-[#FF3F3F] px-3 py-2 text-xs font-semibold text-white">
              Change Cover
            </span>
          ) : (
          <>
          <span className="absolute -inset-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-70 blur-[1px] transition-opacity group-hover:opacity-100" />
          <span className="relative block rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500 p-0.5">
            <UserAvatar
              name={name}
              src={avatar}
              className={`${dim} block rounded-full bg-zinc-900`}
              imageClassName="object-cover"
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
          </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            hidden
            aria-label={isCover ? "Choose cover photo" : "Choose profile photo"}
            onChange={handleFileChange}
          />
        </label>

        {!isCover && avatar && onRemove && (
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
        <p className={isCover ? "absolute bottom-2 left-2 right-2 rounded bg-black/80 p-2 text-xs text-rose-400" : "mt-2 text-xs text-rose-400"} role="alert">
          {error}
        </p>
      )}

      {imageUrl && createPortal(
        <div className="theme-modal-backdrop fixed inset-0 z-1000 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4">
          <section
            aria-label={isCover ? "Crop cover photo" : "Crop profile photo"}
            aria-modal="true"
            className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#111113] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-none sm:max-w-md sm:overflow-visible sm:rounded-2xl sm:p-5"
            role="dialog"
          >
            <header className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-sm font-semibold text-zinc-100"
                >
                  {isCover ? "Crop cover photo" : "Crop profile photo"}
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {isCover ? "Drag and zoom to crop. Saved at 1600 x 400 px." : "Square photo · saved at 400 × 400 px"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                disabled={isSaving}
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
                aspect={isCover ? 4 : 1}
                cropShape={isCover ? "rect" : "round"}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                mediaProps={{
                  onError: () => setError("Could not load this photo. Try a JPG, PNG, or WEBP image."),
                }}
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
        </div>,
        document.body,
      )}
    </>
  );
}