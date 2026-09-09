import { ShowcaseItem, ShowcaseType } from "@/src/types";
import {
  Award,
  Briefcase,
  Building2,
  ExternalLink,
  FolderKanban,
  Globe,
  MapPin,
  Package,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Wrench,
} from "lucide-react";

interface UserShowcaseProps {
  items: ShowcaseItem[];
  isOwner?: boolean;
  onAdd?: () => void;
  onEdit?: (item: ShowcaseItem) => void;
  onSelect?: (item: ShowcaseItem) => void;
  maxItems?: number;
}

export const TYPE_CONFIG: Record<
  ShowcaseType,
  {
    label: string;
    icon: typeof Briefcase;
  }
> = {
  work: { label: "Work", icon: Briefcase },
  project: { label: "Project", icon: FolderKanban },
  service: { label: "Service", icon: Wrench },
  business: { label: "Business", icon: Building2 },
  achievement: { label: "Achievement", icon: Award },
  skill: { label: "Skill", icon: Sparkles },
  experience: { label: "Experience", icon: Briefcase },
  product: { label: "Product", icon: Package },
  portfolio: { label: "Portfolio", icon: Rocket },
  other: { label: "Showcase", icon: Sparkles },
};

export const formatDate = (date?: string | Date | null) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  return value.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

export const formatPeriod = (item: ShowcaseItem) => {
  const start = formatDate(item.startDate);

  if (!start) return "";

  if (item.currentlyActive) {
    return `${start} — Present`;
  }

  const end = formatDate(item.endDate);

  return end ? `${start} — ${end}` : start;
};

export default function UserShowcase({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  onSelect,
  maxItems = 10,
}: UserShowcaseProps) {
  const visibleItems = items.slice(0, maxItems);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#111113]">
      <header className="flex items-center justify-between border-b border-[#1e1e22] px-4 py-3.5 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF3F3F]" />
            <h2 className="text-[13px] font-semibold text-zinc-100">
              Showcase
            </h2>
          </div>

          <p className="mt-0.5 text-[9px] text-zinc-600">
            {isOwner ? "Show what you can do" : "What this user can do"}
          </p>
        </div>

        {isOwner && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#FF3F3F]/20 bg-[#FF3F3F]/10 px-3 text-[9px] font-semibold text-[#ff6b6b] transition-colors hover:bg-[#FF3F3F]/15"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </header>

      {visibleItems.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
            <Sparkles className="h-4 w-4 text-zinc-700" />
          </div>

          <p className="mt-3 text-[11px] font-medium text-zinc-500">
            {isOwner
              ? "Showcase your work and achievements"
              : "No showcase items yet"}
          </p>

          {isOwner && onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="mt-3 text-[9px] font-semibold text-[#ff6b6b] hover:text-[#ff8585]"
            >
              Add your first showcase
            </button>
          )}
        </div>
      ) : (
        <>
          <ShowcaseDesktop
            items={visibleItems}
            isOwner={isOwner}
            onEdit={onEdit}
            onSelect={onSelect}
          />

          <ShowcaseMobile
            items={visibleItems}
            isOwner={isOwner}
            onEdit={onEdit}
            onSelect={onSelect}
          />
        </>
      )}

      {items.length > maxItems && (
        <div className="border-t border-[#1e1e22] px-4 py-3 text-center sm:px-5">
          <button
            type="button"
            className="text-[9px] font-semibold text-zinc-500 transition-colors hover:text-zinc-200"
          >
            View all {items.length} showcase items
          </button>
        </div>
      )}
    </section>
  );
}

interface ShowcaseDesktopProps {
  items: ShowcaseItem[];
  isOwner?: boolean;
  onEdit?: (item: ShowcaseItem) => void;
  onSelect?: (item: ShowcaseItem) => void;
}

function ShowcaseDesktop({
  items,
  isOwner = false,
  onEdit,
  onSelect,
}: ShowcaseDesktopProps) {
  if (items.length === 0) {
    return (
      <div className="hidden sm:flex items-center justify-center rounded-xl border border-white/[0.06] bg-[#151518] px-4 py-10">
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-500">
            No showcases yet
          </p>

          <p className="mt-1 text-[10px] text-zinc-700">
            {isOwner
              ? "Add projects, achievements, or experiences to showcase."
              : "No showcase items available."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden gap-3 p-4 sm:grid sm:grid-cols-2">
      {items.map((item) => {
        const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
        const Icon = config.icon;
        const period = formatPeriod(item);
        const hasImage = Boolean(item.coverImage);
        const hasGallery = Boolean(item.gallery?.length);
        const hasLinks = Boolean(item.links?.length);
        const hasSkills = Boolean(item.skills?.length);
        const result = item.metadata?.result;

        return (
          <article
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#151518] transition-all duration-200 hover:border-white/[0.10] hover:bg-[#18181c] ${
              onSelect ? "cursor-pointer" : ""
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3F3F]/50 to-transparent" />

            {hasImage ? (
              <div className="relative h-40 overflow-hidden bg-zinc-900">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-black/10 to-transparent" />

                <span className="absolute left-3 theme-text-image top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10  px-2 py-1 text-[8px] font-bold uppercase tracking-wider ">
                  <Icon className="h-3 w-3 text-[#ff6b6b]" />
                  {config.label}
                </span>

                {hasGallery && (
                  <span className="absolute theme-text-image right-3 top-3 rounded-full border border-white/10  px-2 py-1 text-[8px] font-semibold ">
                    +{item.gallery!.length} photos
                  </span>
                )}
              </div>
            ) : (
              <div className="relative flex items-center gap-3 border-b border-white/5 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#FF3F3F]/15 ">
                  <Icon className="h-4 w-4 text-[#ff6b6b]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#ff6b6b]/70">
                    {config.label}
                  </p>

                  <p className="mt-0.5 text-[9px] text-zinc-600">
                    {item.organization || "Showcase"}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-[13px] font-semibold leading-[1.4] text-zinc-100 transition-colors group-hover:text-white">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="mt-1 line-clamp-1 text-[9px] text-zinc-500">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {isOwner && onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-zinc-600 transition-colors hover:border-white/10 hover:text-zinc-300"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                )}
              </div>

              {(item.organization || item.role || period) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-zinc-500">
                  {(item.organization || item.role) && (
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <Briefcase className="h-3 w-3 shrink-0 text-zinc-700" />
                      <span className="truncate">
                        {item.role && item.organization
                          ? `${item.role} · ${item.organization}`
                          : item.role || item.organization}
                      </span>
                    </span>
                  )}

                  {period && <span className="text-zinc-700">{period}</span>}
                </div>
              )}

              {item.location && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-zinc-600">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}

              {item.description && (
                <p className="mt-3 line-clamp-3 text-[10px] leading-[1.6] text-zinc-500">
                  {item.description}
                </p>
              )}

              {result && (
                <div className="mt-3 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.035] px-3 py-2.5">
                  <div className="flex items-start gap-2">
                    <Award className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/60" />

                    <div className="min-w-0">
                      <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-500/60">
                        Result
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-[9px] leading-relaxed text-emerald-400/80">
                        {result}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hasSkills && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.skills!.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-white/5 bg-white/[0.025] px-1.5 py-1 text-[8px] text-zinc-500"
                    >
                      {skill}
                    </span>
                  ))}

                  {item.skills!.length > 4 && (
                    <span className="px-1 py-1 text-[8px] text-zinc-700">
                      +{item.skills!.length - 4}
                    </span>
                  )}
                </div>
              )}

              {hasLinks && (
                <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-3">
                  {item.links!.slice(0, 2).map((link) => (
                    <a
                      key={`${item.id}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[8px] font-semibold text-[#ff6b6b] transition-colors hover:text-[#ff8585]"
                    >
                      <Globe className="h-3 w-3" />
                      {link.label}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ))}
                </div>
              )}

              {onSelect && (
                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[8px] text-zinc-700">
                    View showcase
                  </span>

                  <span className="text-[9px] font-semibold text-zinc-500 transition-colors group-hover:text-[#ff6b6b]">
                    Explore →
                  </span>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

interface ShowcaseMobileProps {
  items: ShowcaseItem[];
  isOwner?: boolean;
  onEdit?: (item: ShowcaseItem) => void;
  onSelect?: (item: ShowcaseItem) => void;
}

function ShowcaseMobile({
  items,
  isOwner = false,
  onEdit,
  onSelect,
}: ShowcaseMobileProps) {
  if (items.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center px-4 py-8 sm:hidden">
          <div className="w-full rounded-xl border border-white/[0.06] bg-[#151518] px-4 py-8 text-center">
            <p className="text-xs font-semibold text-zinc-500">
              No showcases yet
            </p>

            <p className="mt-1 text-[10px] leading-relaxed text-zinc-700">
              {isOwner
                ? "Add projects, achievements, or experiences to showcase."
                : "No showcase items available."}
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="relative sm:hidden">
      <div className="flex  gap-3 overflow-x-auto px-3 py-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
          const Icon = config.icon;
          const hasImage = Boolean(item.coverImage);
          const hasLinks = Boolean(item.links?.length);
          const hasGallery = Boolean(item.gallery?.length);

          return (
            <div
              key={item.id}
              className="w-[82vw] max-w-75 shrink-0 snap-start"
            >
              <article className="w-full overflow-hidden rounded-xl border border-white/[0.06] ">
                {hasImage ? (
                  <div className="relative h-32 overflow-hidden bg-zinc-900">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 " />

                    <span className="absolute theme-text-image left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-[7px] font-bold uppercase tracking-wider ">
                      <Icon className="h-2.5 w-2.5 text-[#ff6b6b]" />
                      {config.label}
                    </span>

                    {hasGallery && (
                      <span className="absolute theme-text-image right-2.5 top-2.5 rounded-full border border-white/10  px-2 py-1 text-[7px]  backdrop-blur-md">
                        + {item.gallery!.length}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex  items-center gap-2.5 border-b border-white/5 px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/10">
                      <Icon className="h-3.5 w-3.5 text-[#ff6b6b]" />
                    </div>

                    <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#ff6b6b]/70">
                      {config.label}
                    </span>
                  </div>
                )}

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-[11px] font-semibold leading-[1.45] text-zinc-100">
                      {item.title}
                    </h3>

                    {isOwner && onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/5 text-zinc-600"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-[8px] leading-[1.65] text-zinc-500">
                      {item.description}
                    </p>
                  )}

                  {hasLinks && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-white/5 pt-2.5">
                      {item.links!.slice(0, 3).map((link) => (
                        <a
                          key={`${item.id}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex min-w-0 max-w-full items-center gap-1 text-[8px] font-semibold theme-link-accent "
                        >
                          <Globe className="h-2.5 w-2.5 shrink-0" />
                          <span className="max-w-25 truncate">
                            {link.label}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {onSelect && (
                    <div className="mt-2.5 flex justify-end border-t border-white/5 pt-2.5">
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="text-[8px] font-semibold  transition-colors theme-link-accent "
                      >
                        Explore →
                      </button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1 pb-3">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={`h-1 rounded-full transition-all ${
                index === 0 ? "w-4 bg-[#FF3F3F]" : "w-1 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
