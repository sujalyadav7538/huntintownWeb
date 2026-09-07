import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ImagePlus,
  LayoutGrid,
  Link2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Trophy,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

/* =========================================================
   TYPES
========================================================= */

type ShowcaseType =
  | "work"
  | "project"
  | "service"
  | "business"
  | "achievement"
  | "skill"
  | "experience"
  | "product"
  | "portfolio"
  | "other";

type ShowcaseField =
  | "subtitle"
  | "description"
  | "organization"
  | "role"
  | "location"
  | "dates"
  | "coverImage"
  | "gallery"
  | "skills"
  | "tags"
  | "links"
  | "metadata";

interface ShowcaseLink {
  label: string;
  url: string;
}

interface ShowcaseMedia {
  url: string;
  public_id: string;
}

interface ShowcaseMetadata {
  company: string;
  client: string;
  credential: string;
  year: string;
  duration: string;
  result: string;
  category: string;
}

interface ShowcaseItem {
  id: string;
  type: ShowcaseType;
  title: string;
  subtitle: string;
  description: string;
  organization: string;
  role: string;
  location: string;
  currentlyActive: boolean;
  startDate: string;
  endDate: string;
  coverImage: string;
  coverImage_public_id: string;
  gallery: ShowcaseMedia[];
  skills: string[];
  tags: string[];
  links: ShowcaseLink[];
  metadata: ShowcaseMetadata;
}

interface PortfolioSectionProps {
  items?: ShowcaseItem[];
  onChange?: (items: ShowcaseItem[]) => void;
}

interface ShowcaseTypeConfig {
  value: ShowcaseType;
  label: string;
  icon: typeof Briefcase;
  description: string;
  fields: ShowcaseField[];
  metadata?: (keyof ShowcaseMetadata)[];
}

/* =========================================================
   CONFIGURATION
========================================================= */

const SHOWCASE_CONFIG: Record<ShowcaseType, ShowcaseTypeConfig> = {
  project: {
    value: "project",
    label: "Project",
    icon: LayoutGrid,
    description: "A project you built or contributed to.",
    fields: [
      "subtitle",
      "description",
      "role",
      "dates",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["client", "duration", "result", "category"],
  },

  work: {
    value: "work",
    label: "Work",
    icon: Briefcase,
    description: "A job, freelance role, or professional work.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "role",
      "location",
      "dates",
      "coverImage",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["company", "duration", "result"],
  },

  experience: {
    value: "experience",
    label: "Experience",
    icon: UserRound,
    description: "Professional or personal experience.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "role",
      "location",
      "dates",
      "coverImage",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["company", "duration", "result"],
  },

  service: {
    value: "service",
    label: "Service",
    icon: Wrench,
    description: "A service or expertise that you provide.",
    fields: [
      "subtitle",
      "description",
      "location",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["category", "result"],
  },

  product: {
    value: "product",
    label: "Product",
    icon: Sparkles,
    description: "A product, application, tool, or digital asset.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "role",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["category", "client", "result"],
  },

  business: {
    value: "business",
    label: "Business",
    icon: Building2,
    description: "A business, startup, or venture.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "role",
      "location",
      "dates",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["company", "client", "category", "result"],
  },

  achievement: {
    value: "achievement",
    label: "Achievement",
    icon: Trophy,
    description: "An award, milestone, certification, or accomplishment.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "dates",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["credential", "year", "result", "category"],
  },

  skill: {
    value: "skill",
    label: "Skill",
    icon: Award,
    description: "A skill, specialization, or area of expertise.",
    fields: ["subtitle", "description", "skills", "tags", "links", "metadata"],
    metadata: ["category", "year"],
  },

  portfolio: {
    value: "portfolio",
    label: "Portfolio",
    icon: LayoutGrid,
    description: "A collection of work or creative showcase.",
    fields: [
      "subtitle",
      "description",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: ["category", "result"],
  },

  other: {
    value: "other",
    label: "Other",
    icon: Tag,
    description: "Anything else you want to showcase.",
    fields: [
      "subtitle",
      "description",
      "organization",
      "role",
      "location",
      "dates",
      "coverImage",
      "gallery",
      "skills",
      "tags",
      "links",
      "metadata",
    ],
    metadata: [
      "company",
      "client",
      "credential",
      "year",
      "duration",
      "result",
      "category",
    ],
  },
};

const SHOWCASE_TYPES = Object.values(SHOWCASE_CONFIG);

const METADATA_CONFIG: Record<
  keyof ShowcaseMetadata,
  {
    label: string;
    placeholder: string;
  }
> = {
  company: {
    label: "Company",
    placeholder: "Company name",
  },
  client: {
    label: "Client",
    placeholder: "Client name",
  },
  credential: {
    label: "Credential",
    placeholder: "Certificate / credential ID",
  },
  year: {
    label: "Year",
    placeholder: "2026",
  },
  duration: {
    label: "Duration",
    placeholder: "6 months",
  },
  result: {
    label: "Result",
    placeholder: "What did you achieve?",
  },
  category: {
    label: "Category",
    placeholder: "Category",
  },
};

const EMPTY_METADATA: ShowcaseMetadata = {
  company: "",
  client: "",
  credential: "",
  year: "",
  duration: "",
  result: "",
  category: "",
};

/* =========================================================
   HELPERS
========================================================= */

const createEmptyItem = (): ShowcaseItem => ({
  id: crypto.randomUUID(),
  type: "project",
  title: "",
  subtitle: "",
  description: "",
  organization: "",
  role: "",
  location: "",
  currentlyActive: false,
  startDate: "",
  endDate: "",
  coverImage: "",
  coverImage_public_id: "",
  gallery: [],
  skills: [],
  tags: [],
  links: [],
  metadata: { ...EMPTY_METADATA },
});

const formatDateRange = (item: ShowcaseItem) => {
  if (!item.startDate && !item.endDate) return "";

  const start = item.startDate
    ? new Date(item.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  const end = item.currentlyActive
    ? "Present"
    : item.endDate
      ? new Date(item.endDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PortfolioSection({
  items: externalItems = [],
  onChange,
}: PortfolioSectionProps) {
  const [items, setItems] = useState<ShowcaseItem[]>(externalItems);
  const [editingItem, setEditingItem] = useState<ShowcaseItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(externalItems);
  }, [externalItems]);

  const updateItems = (nextItems: ShowcaseItem[]) => {
    setItems(nextItems);
    onChange?.(nextItems);
  };

  const addItem = () => {
    setError(null);
    setEditingItem(createEmptyItem());
  };

  const editItem = (item: ShowcaseItem) => {
    setError(null);
    setEditingItem({
      ...item,
      metadata: {
        ...EMPTY_METADATA,
        ...item.metadata,
      },
      gallery: [...item.gallery],
      skills: [...item.skills],
      tags: [...item.tags],
      links: [...item.links],
    });
  };

  const saveItem = async (item: ShowcaseItem) => {
    const exists = items.some((existing) => existing.id === item.id);
    const endpoint = exists
      ? `/api/showcase/items/${encodeURIComponent(item.id)}`
      : "/api/showcase/items";

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch(endpoint, {
        method: exists ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.item) {
        throw new Error(payload?.message || "Unable to save showcase item.");
      }

      const savedItem = payload.item as ShowcaseItem;
      const nextItems = exists
        ? items.map((existing) =>
            existing.id === item.id ? savedItem : existing,
          )
        : [...items, savedItem];

      updateItems(nextItems);
      setEditingItem(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save showcase item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (isSubmitting || !window.confirm("Delete this showcase item?")) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/showcase/items/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to delete showcase item.");
      }

      updateItems(items.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete showcase item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block">
        <PortfolioDesktop
          items={items}
          onAdd={addItem}
          onEdit={editItem}
          onDelete={deleteItem}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-[#ff6262]" role="alert">
          {error}
        </p>
      )}

      {/* MOBILE */}
      <div className="md:hidden">
        <PortfolioMobile
          items={items}
          onAdd={addItem}
          onEdit={editItem}
          onDelete={deleteItem}
        />
      </div>

      {/* EDITOR */}
      {editingItem && (
        <PortfolioItemEditor
          item={editingItem}
          onSave={saveItem}
          isSaving={isSubmitting}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}

/* =========================================================
   DESKTOP
========================================================= */

function PortfolioDesktop({
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: ShowcaseItem[];
  onAdd: () => void;
  onEdit: (item: ShowcaseItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <PortfolioHeader count={items.length} onAdd={onAdd} />

      {items.length === 0 ? (
        <PortfolioEmptyState onAdd={onAdd} />
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE
========================================================= */

function PortfolioMobile({
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: ShowcaseItem[];
  onAdd: () => void;
  onEdit: (item: ShowcaseItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <PortfolioHeader count={items.length} onAdd={onAdd} />

      {items.length === 0 ? (
        <PortfolioEmptyState onAdd={onAdd} />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function PortfolioHeader({
  count,
  onAdd,
}: {
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-[#ff6262]" />

          <h2 className="text-lg font-semibold text-zinc-100">Portfolio</h2>

          {count > 0 && (
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-xs text-zinc-500">
              {count}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          Showcase your work, experience, skills and achievements.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#FF3F3F] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5757]"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add item</span>
      </button>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function PortfolioEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-12 text-center transition hover:border-[#FF3F3F]/50 hover:bg-[#FF3F3F]/5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF3F3F]/10">
        <Plus className="h-5 w-5 text-[#ff6262]" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-100">
        Add your first portfolio item
      </h3>

      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Showcase your projects, work, skills, services, achievements and more.
      </p>
    </button>
  );
}

/* =========================================================
   CARD
========================================================= */

function PortfolioCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ShowcaseItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const config = SHOWCASE_CONFIG[item.type];
  const Icon = config.icon;

  const hasField = (field: ShowcaseField) => config.fields.includes(field);

  const dateRange = hasField("dates") ? formatDateRange(item) : "";

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] ">
      {/* COVER */}
      {hasField("coverImage") && item.coverImage && (
        <div className="h-40 overflow-hidden bg-zinc-900">
          <img
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        {/* TOP */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FF3F3F]/15 bg-[#FF3F3F]/10 text-[#ff6262]">
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <span className="text-xs font-medium text-[#ff6262]">
                {config.label}
              </span>

              <h3 className="mt-0.5 truncate text-base font-semibold text-zinc-100">
                {item.title || "Untitled"}
              </h3>

              {hasField("subtitle") && item.subtitle && (
                <p className="truncate text-sm text-zinc-500">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-100"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTEXT */}
        {(hasField("organization") ||
          hasField("role") ||
          hasField("location") ||
          hasField("dates")) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
            {hasField("organization") && item.organization && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {item.organization}
              </span>
            )}

            {hasField("role") && item.role && <span>{item.role}</span>}

            {hasField("location") && item.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {item.location}
              </span>
            )}

            {dateRange && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {dateRange}
              </span>
            )}
          </div>
        )}

        {/* DESCRIPTION */}
        {hasField("description") && item.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
            {item.description}
          </p>
        )}

        {/* SKILLS */}
        {hasField("skills") && item.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-white/6 bg-white/4 px-2 py-1 text-xs text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* LINKS */}
        {hasField("links") && item.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.links.slice(0, 3).map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EDITOR
========================================================= */

function PortfolioItemEditor({
  item: initialItem,
  onSave,
  onClose,
  isSaving,
}: {
  item: ShowcaseItem;
  onSave: (item: ShowcaseItem) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [item, setItem] = useState<ShowcaseItem>(initialItem);
  const [metadataOpen, setMetadataOpen] = useState(false);

  const config = SHOWCASE_CONFIG[item.type];

  const { fields, metadata: metadataFields = [] } = config;

  const hasField = (field: ShowcaseField) => fields.includes(field);

  const updateItem = <K extends keyof ShowcaseItem>(
    key: K,
    value: ShowcaseItem[K],
  ) => {
    setItem((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateMetadata = (key: keyof ShowcaseMetadata, value: string) => {
    setItem((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value,
      },
    }));
  };

  const changeType = (type: ShowcaseType) => {
    const nextConfig = SHOWCASE_CONFIG[type];

    setItem((prev) => ({
      ...prev,
      type,
      metadata: {
        ...prev.metadata,
      },
    }));

    if (!nextConfig.fields.includes("dates")) {
      setItem((prev) => ({
        ...prev,
        currentlyActive: false,
        startDate: "",
        endDate: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center backdrop-blur-sm p-0 sm:p-6">
      <div className="flex h-full w-full flex-col border-white/8 bg-[#111113] text-zinc-100 sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl sm:border">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              {item.id ? "Edit portfolio item" : "Add portfolio item"}
            </h2>

            <p className="text-xs text-zinc-500">{config.description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-6">
            {/* TYPE */}
            <EditorSection
              title="What are you showcasing?"
              description="Choose the type that best describes this item."
            >
              <label className="relative block">
                <select
                  value={item.type}
                  onChange={(event) =>
                    changeType(event.target.value as ShowcaseType)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0a0a0c] px-4 py-3 pr-10 text-sm font-medium text-zinc-100 outline-none transition focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
                >
                  {SHOWCASE_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-[#111113] text-zinc-100"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff6262]" />
              </label>
            </EditorSection>

            {/* BASIC */}
            <EditorSection
              title="Basic information"
              description="The main information visitors will see."
            >
              <div className="space-y-4">
                <Field
                  label="Title"
                  required
                  value={item.title}
                  placeholder={`e.g. ${
                    config.value === "project" ? "HuntInTown" : config.label
                  }`}
                  onChange={(value) => updateItem("title", value)}
                />

                {hasField("subtitle") && (
                  <Field
                    label="Subtitle"
                    value={item.subtitle}
                    placeholder="Short description"
                    onChange={(value) => updateItem("subtitle", value)}
                  />
                )}

                {hasField("description") && (
                  <TextArea
                    label="Description"
                    value={item.description}
                    placeholder="Describe this item..."
                    rows={5}
                    onChange={(value) => updateItem("description", value)}
                  />
                )}
              </div>
            </EditorSection>

            {/* CONTEXT */}
            {(hasField("organization") ||
              hasField("role") ||
              hasField("location")) && (
              <EditorSection
                title="Context"
                description="Additional information about this item."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {hasField("organization") && (
                    <Field
                      label="Organization"
                      value={item.organization}
                      placeholder="Company / organization"
                      onChange={(value) => updateItem("organization", value)}
                    />
                  )}

                  {hasField("role") && (
                    <Field
                      label="Role"
                      value={item.role}
                      placeholder="Your role"
                      onChange={(value) => updateItem("role", value)}
                    />
                  )}

                  {hasField("location") && (
                    <Field
                      label="Location"
                      value={item.location}
                      placeholder="Delhi, India"
                      onChange={(value) => updateItem("location", value)}
                    />
                  )}
                </div>
              </EditorSection>
            )}

            {/* DATES */}
            {hasField("dates") && (
              <EditorSection
                title="Time period"
                description="Add when this experience or activity took place."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Start date"
                    type="date"
                    value={item.startDate}
                    onChange={(value) => updateItem("startDate", value)}
                  />

                  {!item.currentlyActive && (
                    <Field
                      label="End date"
                      type="date"
                      value={item.endDate}
                      onChange={(value) => updateItem("endDate", value)}
                    />
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={item.currentlyActive}
                    onChange={(e) => {
                      updateItem("currentlyActive", e.target.checked);

                      if (e.target.checked) {
                        updateItem("endDate", "");
                      }
                    }}
                    className="rounded border-white/20 bg-[#0a0a0c] text-[#FF3F3F] focus:ring-[#FF3F3F]/30"
                  />
                  Currently active
                </label>
              </EditorSection>
            )}

            {/* VISUAL */}
            {(hasField("coverImage") || hasField("gallery")) && (
              <EditorSection
                title="Visual proof"
                description="Add images to make this item more engaging."
              >
                {hasField("coverImage") && (
                  <Field
                    label="Cover image URL"
                    value={item.coverImage}
                    placeholder="https://..."
                    onChange={(value) => updateItem("coverImage", value)}
                  />
                )}

                {hasField("gallery") && (
                  <div className="mt-4">
                    <GalleryInput
                      gallery={item.gallery}
                      onChange={(gallery) => updateItem("gallery", gallery)}
                    />
                  </div>
                )}
              </EditorSection>
            )}

            {/* SKILLS */}
            {hasField("skills") && (
              <EditorSection
                title="Skills"
                description="Technologies, skills or expertise related to this item."
              >
                <TagInput
                  values={item.skills}
                  placeholder="Type a skill and press Enter"
                  onChange={(skills) => updateItem("skills", skills)}
                />
              </EditorSection>
            )}

            {/* TAGS */}
            {hasField("tags") && (
              <EditorSection title="Tags" description="Add searchable tags.">
                <TagInput
                  values={item.tags}
                  placeholder="Type a tag and press Enter"
                  onChange={(tags) => updateItem("tags", tags)}
                />
              </EditorSection>
            )}

            {/* LINKS */}
            {hasField("links") && (
              <EditorSection
                title="External links"
                description="Add relevant websites, repositories or resources."
              >
                <LinksInput
                  links={item.links}
                  onChange={(links) => updateItem("links", links)}
                />
              </EditorSection>
            )}

            {/* METADATA */}
            {hasField("metadata") && metadataFields.length > 0 && (
              <div className="rounded-xl border border-white/8 bg-[#151518]">
                <button
                  type="button"
                  onClick={() => setMetadataOpen((value) => !value)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      Additional information
                    </p>

                    <p className="text-xs text-zinc-500">
                      Optional details specific to this type.
                    </p>
                  </div>

                  {metadataOpen ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </button>

                {metadataOpen && (
                  <div className="border-t border-white/8 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {metadataFields.map((field) => {
                        const metadataConfig = METADATA_CONFIG[field];

                        return (
                          <Field
                            key={field}
                            label={metadataConfig.label}
                            value={item.metadata[field]}
                            placeholder={metadataConfig.placeholder}
                            onChange={(value) => updateMetadata(field, value)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/8 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!item.title.trim() || isSaving}
            onClick={() => onSave(item)}
            className="rounded-lg bg-[#FF3F3F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ff5757] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save item"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EDITOR SECTION
========================================================= */

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>

        {description && (
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  placeholder,
  required,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}

        {required && <span className="ml-1 text-[#ff6262]">*</span>}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0a0a0c] px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  placeholder,
  rows = 4,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-white/10 bg-[#0a0a0c] px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
      />
    </label>
  );
}

/* =========================================================
   TAG INPUT
========================================================= */

function TagInput({
  values,
  placeholder,
  onChange,
}: {
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();

    if (!value) return;

    if (
      !values.some((existing) => existing.toLowerCase() === value.toLowerCase())
    ) {
      onChange([...values, value]);
    }

    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((value) => value !== tag));
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0c] p-2">
      <div className="flex flex-wrap gap-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md border border-[#FF3F3F]/20 bg-[#FF3F3F]/10 px-2 py-1 text-xs font-medium text-[#ff6b6b]"
          >
            {tag}

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="transition hover:text-[#ff6262]"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }

            if (e.key === "Backspace" && !input && values.length) {
              removeTag(values[values.length - 1]);
            }
          }}
          className="min-w-45 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-zinc-600"
        />
      </div>
    </div>
  );
}

/* =========================================================
   GALLERY INPUT
========================================================= */

function GalleryInput({
  gallery,
  onChange,
}: {
  gallery: ShowcaseMedia[];
  onChange: (gallery: ShowcaseMedia[]) => void;
}) {
  const [url, setUrl] = useState("");

  const addImage = () => {
    const value = url.trim();

    if (!value) return;

    onChange([
      ...gallery,
      {
        url: value,
        public_id: "",
      },
    ]);

    setUrl("");
  };

  const removeImage = (index: number) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-zinc-500" />

        <span className="text-xs font-medium text-zinc-400">Gallery</span>
      </div>

      <div className="flex gap-2">
        <input
          value={url}
          placeholder="Image URL"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImage();
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
        />

        <button
          type="button"
          onClick={addImage}
          className="rounded-lg border border-white/10 bg-[#151518] px-3 text-zinc-400 transition hover:border-[#FF3F3F]/40 hover:text-[#ff6b6b]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {gallery.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {gallery.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-[#151518]"
            >
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   LINKS INPUT
========================================================= */

function LinksInput({
  links,
  onChange,
}: {
  links: ShowcaseLink[];
  onChange: (links: ShowcaseLink[]) => void;
}) {
  const addLink = () => {
    onChange([
      ...links,
      {
        label: "",
        url: "",
      },
    ]);
  };

  const updateLink = (
    index: number,
    key: keyof ShowcaseLink,
    value: string,
  ) => {
    onChange(
      links.map((link, i) =>
        i === index
          ? {
              ...link,
              [key]: value,
            }
          : link,
      ),
    );
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={index}
          className="rounded-lg border border-white/10 bg-[#151518] p-3"
        >
          <div className="flex gap-2">
            <Link2 className="mt-2.5 h-4 w-4 shrink-0 text-zinc-500" />

            <div className="min-w-0 flex-1 space-y-2">
              <input
                value={link.label}
                placeholder="Link label"
                onChange={(e) => updateLink(index, "label", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
              />

              <input
                value={link.url}
                placeholder="https://..."
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20"
              />
            </div>

            <button
              type="button"
              onClick={() => removeLink(index)}
              className="self-start rounded-lg p-2 text-zinc-500 transition hover:bg-[#FF3F3F]/10 hover:text-[#ff6262]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLink}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-[#FF3F3F]/50 hover:text-[#ff6b6b]"
      >
        <Plus className="h-4 w-4" />
        Add link
      </button>
    </div>
  );
}
