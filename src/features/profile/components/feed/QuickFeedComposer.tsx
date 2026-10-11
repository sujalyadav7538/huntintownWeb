import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Send, X } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { apiFetch } from "@/src/shared/lib/api";
import type { ShowcaseItem } from "@/src/shared/types";

interface QuickFeedComposerProps {
  onCreated?: (item: ShowcaseItem) => void;
}

export default function QuickFeedComposer({
  onCreated,
}: QuickFeedComposerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageSwiperRef = useRef<SwiperInstance | null>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () =>
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.from(event.target.files ?? []);
    if (!chosenFiles.length) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (chosenFiles.some((file) => !validTypes.includes(file.type))) {
      setError("Choose JPG, PNG, WEBP, HEIC, or HEIF images only.");
      event.target.value = "";
      return;
    }

    if (images.length + chosenFiles.length > 10) {
      setError("You can add up to 10 images to a highlight.");
      event.target.value = "";
      return;
    }

    setError("");
    const selectedImages = chosenFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrlsRef.current.push(preview);
      return { file, preview };
    });
    setImages((previous) => [...previous, ...selectedImages]);
    event.target.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setCaption("");
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !caption.trim() || images.length === 0) {
      setError("A title, caption, and at least one photo are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("id", crypto.randomUUID());
      formData.append("title", title.trim());
      formData.append("description", caption.trim());
      images.forEach(({ file }) => formData.append("images", file));

      const response = await apiFetch("/api/feed", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to create feed post.");
      }

      const item = payload.item as ShowcaseItem;
      onCreated?.(item);
      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#1e1e22] bg-[#111113] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">Create post</p>
          <p className="text-[11px] text-zinc-500">
            Share a quick photo update
          </p>
        </div>
      </div>

      <label
        htmlFor="highlight-title"
        className="mb-1.5 block text-xs font-medium text-zinc-300"
      >
        Title <span className="text-[#ff7b7b]">*</span>
      </label>
      <input
        id="highlight-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={120}
        required
        aria-required="true"
        placeholder="Give your highlight a title"
        className="mb-3 w-full rounded-xl border border-white/10 bg-[#17181b] px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#FF3F3F]/60"
      />

      <label
        htmlFor="highlight-caption"
        className="mb-1.5 block text-xs font-medium text-zinc-300"
      >
        Caption <span className="text-[#ff7b7b]">*</span>
      </label>
      <textarea
        id="highlight-caption"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        maxLength={220}
        rows={3}
        required
        aria-required="true"
        placeholder="What are you sharing today?"
        className="w-full resize-none rounded-xl border border-white/10 bg-[#17181b] px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#FF3F3F]/60"
      />

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-zinc-500">
        <span>
          {caption.length}/220 · {images.length}/10 images
        </span>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#FF3F3F]/25 bg-[#FF3F3F]/10 px-3 py-2 font-medium text-[#ff7b7b] transition hover:bg-[#FF3F3F]/15">
          <ImagePlus className="h-4 w-4" />
          Add photos <span className="text-[#ff7b7b]">*</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            hidden
            aria-required="true"
            onChange={handleImageSelection}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="relative mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#0f1012]">
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => imageSwiperRef.current?.slidePrev()}
                className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white"
                aria-label="Previous selected image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => imageSwiperRef.current?.slideNext()}
                className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white"
                aria-label="Next selected image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          <Swiper
            onSwiper={(swiper) => {
              imageSwiperRef.current = swiper;
            }}
            slidesPerView={1}
            watchOverflow
          >
            {images.map(({ preview }, index) => (
              <SwiperSlide key={preview}>
                <div className="relative h-40 sm:h-52">
                  <img
                    src={preview}
                    alt={`Selected image ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const removed = images[index];
                      URL.revokeObjectURL(removed.preview);
                      previewUrlsRef.current = previewUrlsRef.current.filter(
                        (url) => url !== removed.preview,
                      );
                      setImages((previous) =>
                        previous.filter((_, imageIndex) => imageIndex !== index),
                      );
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-zinc-200"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {images.length > 1 && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-2.5 py-1 text-[11px] text-white">
                      {index + 1} / {images.length}
                    </span>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3F3F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4949] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </section>
  );
}
