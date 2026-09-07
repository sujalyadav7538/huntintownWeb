import { useEffect, useMemo, useState } from "react";

import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  X,
} from "lucide-react";
import { ShowcaseItem } from "@/src/types";
import { formatPeriod, TYPE_CONFIG } from "./UserShowCase";

interface ShowcaseDetailCardProps {
  item: ShowcaseItem | null;
  open: boolean;
  onClose: () => void;
}

export default function ShowcaseDetailCard({
  item,
  open,
  onClose,
}: ShowcaseDetailCardProps) {
  const [activeImage, setActiveImage] = useState(0);

  const images = useMemo(() => {
    if (!item) return [];

    return [
      ...(item.coverImage ? [item.coverImage] : []),
      ...(item.gallery?.map((image) => image.url) ?? []),
    ].filter(
      (url, index, array) => Boolean(url) && array.indexOf(url) === index,
    );
  }, [item]);

  useEffect(() => {
    setActiveImage(0);
  }, [item]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (images.length <= 1) return;

      if (event.key === "ArrowLeft") {
        setActiveImage((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }

      if (event.key === "ArrowRight") {
        setActiveImage((current) =>
          current === images.length - 1 ? 0 : current + 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, images.length, onClose]);

  if (!open || !item) return null;

  const showPrevious = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto  backdrop-blur-sm "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <ShowcaseDetailDesktop
        item={item}
        images={images}
        activeImage={activeImage}
        onClose={onClose}
        onPrevious={showPrevious}
        onNext={showNext}
        onImageChange={setActiveImage}
      />

      <ShowcaseDetailMobile
        item={item}
        images={images}
        activeImage={activeImage}
        onClose={onClose}
        onPrevious={showPrevious}
        onNext={showNext}
        onImageChange={setActiveImage}
      />
    </div>
  );
}

interface ShowcaseDetailDesktopProps {
  item: ShowcaseItem;
  images: string[];
  activeImage: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
}

function ShowcaseDetailDesktop({
  item,
  images,
  activeImage,
  onClose,
  onPrevious,
  onNext,
  onImageChange,
}: ShowcaseDetailDesktopProps) {
  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
  const Icon = config.icon;
  const period = formatPeriod(item);
  const result = item.metadata?.result;

  return (
    <div className="relative mt-6 hidden w-full max-w-3xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] shadow-2xl sm:block">
      {/* <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#FF3F3F] to-transparent" /> */}

      <button
        type="button"
        onClick={onClose}
        className="absolute cursor-pointer right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="max-h-[calc(100dvh-3rem)] overflow-y-auto">
        {images.length > 0 ? (
          <div className="relative h-60 ">
            <img
              src={images[activeImage]}
              alt={item.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-black/10 to-transparent" />

            <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur-md">
              <Icon className="h-3 w-3 text-[#ff6b6b]" />
              {config.label}
            </span>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[8px] text-zinc-300 backdrop-blur-md">
                  {activeImage + 1} / {images.length}
                </span>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onImageChange(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeImage
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/40"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="border-b border-white/5  px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/10">
                <Icon className="h-4 w-4 text-[#ff6b6b]" />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#ff6b6b]">
                {config.label}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 lg:p-8">
          <h2 className="text-xl font-bold tracking-tight text-white lg:text-2xl">
            {item.title}
          </h2>

          {item.subtitle && (
            <p className="mt-1 text-[10px] leading-4 text-zinc-500">
              {item.subtitle}
            </p>
          )}

          {(item.organization || item.role || item.location || period) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] text-zinc-500">
              {(item.organization || item.role) && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-zinc-700" />
                  {item.role && item.organization
                    ? `${item.role} · ${item.organization}`
                    : item.role || item.organization}
                </span>
              )}

              {item.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-zinc-700" />
                  {item.location}
                </span>
              )}

              {period && <span className="text-zinc-600">{period}</span>}
            </div>
          )}

          {item.description && (
            <div className="mt-5">
              <p className="whitespace-pre-wrap text-[10px] leading-[1.8] text-zinc-400">
                {item.description}
              </p>
            </div>
          )}

          {result && (
            <div className="mt-5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.035] px-4 py-3">
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500/70" />

                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-500/60">
                    Result
                  </p>

                  <p className="mt-1 text-[9px] leading-relaxed text-emerald-400/80">
                    {result}
                  </p>
                </div>
              </div>
            </div>
          )}

          {item.skills?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-700">
                Skills
              </p>

              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/5 bg-white/[0.025] px-2 py-1 text-[8px] text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[8px] text-zinc-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {item.links?.length > 0 && (
            <div className="mt-5 border-t border-white/5 pt-4">
              <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-700">
                Links
              </p>

              <div className="flex flex-wrap gap-2">
                {item.links.map((link) => (
                  <a
                    key={`${item.id}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/[0.06] px-2.5 py-1.5 text-[8px] font-semibold text-[#ff6b6b] hover:bg-[#FF3F3F]/10"
                  >
                    <Globe className="h-3 w-3 shrink-0" />
                    <span className="truncate">{link.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.metadata && (
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
              {item.metadata.category && (
                <MetadataItem label="Category" value={item.metadata.category} />
              )}

              {item.metadata.year && (
                <MetadataItem label="Year" value={item.metadata.year} />
              )}

              {item.metadata.duration && (
                <MetadataItem label="Duration" value={item.metadata.duration} />
              )}

              {item.metadata.credential && (
                <MetadataItem
                  label="Credential"
                  value={item.metadata.credential}
                />
              )}

              {item.metadata.client && (
                <MetadataItem label="Client" value={item.metadata.client} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



interface ShowcaseDetailMobileProps {
  item: ShowcaseItem;
  images: string[];
  activeImage: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
}

function ShowcaseDetailMobile({
  item,
  images,
  activeImage,
  onClose,
  onPrevious,
  onNext,
  onImageChange,
}: ShowcaseDetailMobileProps) {
  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
  const Icon = config.icon;
  const period = formatPeriod(item);
  const result = item.metadata?.result;

  return (
    <div className="relative w-full h-full  overflow-hidden   theme-panel  sm:hidden">
      <div className="absolute inset-x-0 top-0 z-20 h-px " />

      <button
        type="button"
        onClick={onClose}
        className="absolute cursor-pointer right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-md"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="max-h-[calc(100dvh-1rem)] overflow-y-auto">
        {images.length > 0 ? (
          <div className="relative h-52 bg-zinc-950">
            <img
              src={images[activeImage]}
              alt={item.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-black/10 to-transparent" />

            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur-md">
              <Icon className="h-2.5 w-2.5 text-[#ff6b6b]" />
              {config.label}
            </span>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrevious}
                  className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[7px] text-zinc-300 backdrop-blur-md">
                  {activeImage + 1} / {images.length}
                </span>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onImageChange(index)}
                      className={`h-1.5 rounded-full ${
                        index === activeImage
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/40"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="border-b border-white/5 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/10">
                <Icon className="h-3.5 w-3.5 text-[#ff6b6b]" />
              </div>

              <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#ff6b6b]">
                {config.label}
              </span>
            </div>
          </div>
        )}

        <div className="p-3.5">
          <h2 className="pr-8 text-base font-bold tracking-tight text-white">
            {item.title}
          </h2>

          {item.subtitle && (
            <p className="mt-1 text-[9px] leading-4 text-zinc-500">
              {item.subtitle}
            </p>
          )}

          {(item.organization || item.role || item.location || period) && (
            <div className="mt-3 flex flex-col gap-1.5 text-[8px] text-zinc-500">
              {(item.organization || item.role) && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-2.5 w-2.5 text-zinc-700" />
                  {item.role && item.organization
                    ? `${item.role} · ${item.organization}`
                    : item.role || item.organization}
                </span>
              )}

              {item.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-2.5 w-2.5 text-zinc-700" />
                  {item.location}
                </span>
              )}

              {period && <span className="text-zinc-600">{period}</span>}
            </div>
          )}

          {item.description && (
            <p className="mt-4 whitespace-pre-wrap text-[9px] leading-[1.7] text-zinc-400">
              {item.description}
            </p>
          )}

          {result && (
            <div className="mt-4 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.035] px-3 py-2.5">
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/70" />

                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-500/60">
                    Result
                  </p>

                  <p className="mt-0.5 text-[8px] leading-relaxed text-emerald-400/80">
                    {result}
                  </p>
                </div>
              </div>
            </div>
          )}

          {item.skills?.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-700">
                Skills
              </p>

              <div className="flex flex-wrap gap-1">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/5 bg-white/[0.025] px-1.5 py-1 text-[7px] text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[7px] text-zinc-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {item.links?.length > 0 && (
            <div className="mt-4 border-t border-white/5 pt-3">
              <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-700">
                Links
              </p>

              <div className="flex flex-col gap-1.5">
                {item.links.map((link) => (
                  <a
                    key={`${item.id}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/[0.06] px-2.5 py-1.5 text-[8px] font-semibold text-[#ff6b6b]"
                  >
                    <Globe className="h-2.5 w-2.5 shrink-0" />
                    <span className="min-w-0 truncate">{link.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.metadata && (
            <div className="mt-4 grid grid-cols-1 gap-1.5 border-t border-white/5 pt-3">
              {item.metadata.category && (
                <MetadataItem label="Category" value={item.metadata.category} />
              )}

              {item.metadata.year && (
                <MetadataItem label="Year" value={item.metadata.year} />
              )}

              {item.metadata.duration && (
                <MetadataItem label="Duration" value={item.metadata.duration} />
              )}

              {item.metadata.credential && (
                <MetadataItem
                  label="Credential"
                  value={item.metadata.credential}
                />
              )}

              {item.metadata.client && (
                <MetadataItem label="Client" value={item.metadata.client} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <p className="text-[7px] font-bold uppercase tracking-wider text-zinc-700">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[8px] text-zinc-400">{value}</p>
    </div>
  );
}
