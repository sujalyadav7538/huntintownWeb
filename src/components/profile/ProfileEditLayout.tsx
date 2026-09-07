import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  User as UserIcon,
  FileText,
  Zap,
  MapPin,
  Shield,
  Link2,
  Briefcase,
  LayoutGrid,
  Settings2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";

import { User } from "../../types";

import AboutSection from "./editProfile/AboutSection";
import BasicSection from "./editProfile/BasicSection";
import LocationSection from "./editProfile/LocationSection";
import PortfolioSection from "./editProfile/PortfolioSection";
import PreferencesSection from "./editProfile/PreferencesSection";
import ServicesSection from "./editProfile/ServicesSection";
import SkillsSection from "./editProfile/SkillsSection";
import SocialSection from "./editProfile/SocialSection";
import VerificationSection from "./editProfile/VeificationSection";
import {
  handleHideMobileBottomNav,
  handleHideUpperNavigation,
} from "@/src/store/uiSlice";
import { useDispatch } from "react-redux";
import {
  buildDraft,
  calcCompletion,
  DraftAction,
  DraftState,
  draftReducer,
} from "./editProfile/profileEditTypes";

const SECTIONS = [
  { id: "basic", label: "Basic Info", icon: UserIcon },
  { id: "about", label: "About", icon: FileText },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "location", label: "Location", icon: MapPin },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "portfolio", label: "Portfolio", icon: LayoutGrid },
  { id: "verification", label: "Verification", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Settings2 },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// ──────────────────────────────────────────────────────
// Shared Layout Props
// ──────────────────────────────────────────────────────

interface ProfileLayoutProps {
  sections: typeof SECTIONS;
  activeSection: SectionId;
  activeSectionIndex: number;
  activeLabel: string;

  canGoPrev: boolean;
  canGoNext: boolean;

  setActiveSection: (section: SectionId) => void;
  goToPrev: () => void;
  goToNext: () => void;

  renderSection: () => React.ReactNode;

  onCancel: () => void;
  completionPct: number;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
}

// ──────────────────────────────────────────────────────
// Main Profile Edit Layout
// ──────────────────────────────────────────────────────

interface ProfileEditLayoutProps {
  user: User;
  isSaving: boolean;

  onSave: (
    updated: User,
    avatarFile: File | null,
    coverImageFile: File | null,
  ) => void;

  onCancel: () => void;
}

export default function ProfileEditLayout({
  user,
  isSaving,
  onSave,
  onCancel,
}: ProfileEditLayoutProps) {
  // ──────────────────────────────────────────────────
  // State
  // ──────────────────────────────────────────────────

  const [draft, dispatch] = useReducer(draftReducer, user, buildDraft);

  const dispatcher = useDispatch();

  const originalDraft = useRef<DraftState>(buildDraft(user));

  const previousUserRef = useRef(user);

  const [activeSection, setActiveSection] = useState<SectionId>("basic");

  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

  const [pendingCoverImageFile, setPendingCoverImageFile] =
    useState<File | null>(null);

  const [showcaseItems, setShowcaseItems] = useState<any[]>(
    user.showcase?.items ?? [],
  );

  const blobUrlRef = useRef<string | null>(null);

  // ──────────────────────────────────────────────────
  // Avatar
  // ──────────────────────────────────────────────────

  const handleAvatarChange = useCallback((file: File) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    blobUrlRef.current = previewUrl;

    dispatch({
      type: "set",
      field: "avatar",
      value: previewUrl,
    });

    setPendingAvatarFile(file);
  }, []);

  // ──────────────────────────────────────────────────
  // Cover Image
  // ──────────────────────────────────────────────────

  const handleCoverImageChange = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      dispatch({
        type: "set",
        field: "coverImage",
        value: reader.result,
      });
    };

    reader.readAsDataURL(file);

    setPendingCoverImageFile(file);
  }, []);

  // ──────────────────────────────────────────────────
  // Mobile Bottom Navigation
  // ──────────────────────────────────────────────────

  useEffect(() => {
    dispatcher(handleHideMobileBottomNav(true));
    dispatcher(handleHideUpperNavigation(true));

    return () => {
      dispatcher(handleHideMobileBottomNav(false));
      dispatcher(handleHideUpperNavigation(false));

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  // ──────────────────────────────────────────────────
  // Sync After Save
  // ──────────────────────────────────────────────────

  useEffect(() => {
    if (user === previousUserRef.current) {
      return;
    }

    previousUserRef.current = user;

    const freshDraft = buildDraft(user);

    originalDraft.current = freshDraft;

    dispatch({
      type: "reset",
      payload: freshDraft,
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setPendingAvatarFile(null);
    setPendingCoverImageFile(null);
    setShowcaseItems(user.showcase?.items ?? []);
  }, [user]);

  // ──────────────────────────────────────────────────
  // Derived State
  // ──────────────────────────────────────────────────

  const isDirty =
    JSON.stringify(draft) !== JSON.stringify(originalDraft.current);

  const completionPct = useMemo(() => calcCompletion(draft), [draft]);

  const activeSectionIndex = SECTIONS.findIndex(
    (section) => section.id === activeSection,
  );

  const activeLabel = SECTIONS[activeSectionIndex]?.label ?? "";

  const canGoPrev = activeSectionIndex > 0;

  const canGoNext = activeSectionIndex < SECTIONS.length - 1;

  // ──────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────

  const goToPrev = useCallback(() => {
    if (!canGoPrev) return;

    setActiveSection(SECTIONS[activeSectionIndex - 1].id);
  }, [activeSectionIndex, canGoPrev]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;

    setActiveSection(SECTIONS[activeSectionIndex + 1].id);
  }, [activeSectionIndex, canGoNext]);

  // ──────────────────────────────────────────────────
  // Save
  // ──────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const updated = {
      ...user,

      name: draft.name,
      role: draft.role,
      address: draft.location,
      bio: draft.bio,
      about: draft.about,

      avatar: pendingAvatarFile ? draft.avatar : user.avatar,

      coverImage: pendingCoverImageFile ? draft.coverImage : user.coverImage,

      skills: draft.skillsRaw
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      services: draft.servicesRaw
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean),

      socialLinks: draft.socialLinks,
    } as User;
    console.log(updated);
    onSave(updated, pendingAvatarFile, pendingCoverImageFile);
  }, [user, draft, pendingAvatarFile, pendingCoverImageFile, onSave]);

  // ──────────────────────────────────────────────────
  // Discard
  // ──────────────────────────────────────────────────

  const handleDiscard = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setPendingAvatarFile(null);
    setPendingCoverImageFile(null);

    dispatch({
      type: "reset",
      payload: originalDraft.current,
    });
  }, []);

  // ──────────────────────────────────────────────────
  // Before Unload
  // ──────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // ──────────────────────────────────────────────────
  // Section Renderer
  // ──────────────────────────────────────────────────

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <BasicSection
            draft={draft}
            dispatch={dispatch}
            onAvatarChange={handleAvatarChange}
            onCoverImageChange={handleCoverImageChange}
          />
        );

      case "about":
        return <AboutSection draft={draft} dispatch={dispatch} />;

      case "skills":
        return <SkillsSection draft={draft} dispatch={dispatch} />;

      case "location":
        return <LocationSection draft={draft} dispatch={dispatch} />;

      case "social":
        return <SocialSection draft={draft} dispatch={dispatch} />;

      case "services":
        return <ServicesSection draft={draft} dispatch={dispatch} />;

      case "portfolio":
        return (
          <PortfolioSection
            items={showcaseItems}
            onChange={setShowcaseItems}
          />
        );

      case "verification":
        return <VerificationSection user={user} />;

      case "preferences":
        return <PreferencesSection />;

      default:
        return null;
    }
  };

  // ──────────────────────────────────────────────────
  // Layout Props
  // ──────────────────────────────────────────────────

  const layoutProps: ProfileLayoutProps = {
    sections: SECTIONS,
    activeSection,
    activeSectionIndex,
    activeLabel,
    canGoPrev,
    canGoNext,
    setActiveSection,
    goToPrev,
    goToNext,
    renderSection,
    onCancel,
    completionPct,
    isDirty,
    isSaving,
    onSave: handleSave,
  };

  // ──────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopProfileEditLayout {...layoutProps} />
      </div>

      {/* Mobile */}
      <div className="block pb-24 md:hidden">
        <MobileProfileEditLayout {...layoutProps} />
      </div>

      {/* Shared Save Bar */}
      {/* <div className="md:hidden">
        <ProfileFloatingSaveBar
          isDirty={isDirty}
          isSaving={isSaving}
          completionPct={completionPct}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div> */}
    </>
  );
}

// ══════════════════════════════════════════════════════
// Desktop Profile Edit Layout
// ══════════════════════════════════════════════════════

function DesktopProfileEditLayout({
  sections,
  activeSection,
  activeSectionIndex,
  activeLabel,
  canGoPrev,
  canGoNext,
  setActiveSection,
  goToPrev,
  goToNext,
  renderSection,
  onCancel,
  completionPct,
  isDirty,
  isSaving,
  onSave,
}: ProfileLayoutProps) {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-30 -mx-6 px-6 py-3 mb-5 bg-[#171717]/90 backdrop-blur-md border-b border-white/5 flex items-center gap-4">
        {/* Back */}
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group cursor-pointer shrink-0"
        >
          <span className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 min-w-0">
          <span className="font-semibold text-zinc-300">Navigation</span>

          <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />

          <span className="font-semibold text-zinc-300 truncate">
            {activeLabel}
          </span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4 shrink-0">
          {/* Profile Completion */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                Profile
              </p>

              <p
                className={`text-xs font-bold tabular-nums ${
                  completionPct >= 80 ? "text-emerald-400" : "text-[#FF3F3F]"
                }`}
              >
                {completionPct}% complete
              </p>
            </div>

            <div className="w-20 h-1.5 rounded-full bg-white/6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completionPct >= 80 ? "bg-emerald-400" : "bg-[#FF3F3F]"
                }`}
                style={{
                  width: `${completionPct}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              isDirty && !isSaving
                ? "bg-[#FF3F3F] text-white hover:bg-[#ff5757] active:scale-[0.98]"
                : "cursor-not-allowed bg-white/6 text-zinc-600"
            }`}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/*Main Layout*/}
      <div className="flex gap-4 items-start">
        {/* Sidebar */}

        <nav className="flex flex-col gap-1 w-52 shrink-0 sticky top-20">
          {sections.map((section) => {
            const Icon = section.icon;

            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full group ${
                  isActive
                    ? "bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F]"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/4 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-[#FF3F3F]"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
                />

                <span className="truncate">{section.label}</span>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Content */}

        <div className="flex-1 min-w-0">
          <div className="relative rounded-2xl bg-white/2.5 border border-white/6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#FF3F3F]/40 to-transparent opacity-60" />

            <div className="p-7">
              <h2 className="text-base font-bold text-white mb-6">
                {activeLabel}
              </h2>

              {renderSection()}
            </div>
          </div>

          {/* Navigation */}

          <div className="mt-4 flex items-center justify-between gap-3 pb-4">
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                canGoPrev
                  ? "text-zinc-300 border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/12 cursor-pointer active:scale-[0.98]"
                  : "text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />

              {canGoPrev ? sections[activeSectionIndex - 1].label : "Previous"}
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                canGoNext
                  ? "text-white border-[#FF3F3F]/40 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 hover:border-[#FF3F3F]/60 cursor-pointer active:scale-[0.98]"
                  : "text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40"
              }`}
            >
              {canGoNext ? sections[activeSectionIndex + 1].label : "Next"}

              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
// Mobile Profile Edit Layout
// ══════════════════════════════════════════════════════

function MobileProfileEditLayout({
  sections,
  activeSection,
  activeSectionIndex,
  activeLabel,
  canGoPrev,
  canGoNext,
  setActiveSection,
  goToPrev,
  goToNext,
  renderSection,
  onCancel,
  completionPct,
  isDirty,
  isSaving,
  onSave,
}: ProfileLayoutProps) {
  return (
    <>
      {/* Mobile Header*/}

      <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center gap-3 border-b border-white/5 bg-[#171717]/90 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Back to profile"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/5 text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span
            className={`text-xs font-bold tabular-nums ${
              completionPct >= 80 ? "text-emerald-400" : "text-[#FF3F3F]"
            }`}
          >
            {completionPct}%
          </span>

          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              isDirty && !isSaving
                ? "bg-[#FF3F3F] text-white hover:bg-[#ff5757] active:scale-[0.98]"
                : "cursor-not-allowed bg-white/6 text-zinc-600"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Mobile Tabs*/}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-1 px-1">
        {sections.map((section) => {
          const Icon = section.icon;

          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F]"
                  : "text-zinc-500 bg-white/4 border border-white/6 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />

              {section.label}
            </button>
          );
        })}
      </div>

      {/*Content */}

      <div className="relative rounded-2xl bg-white/2.5 border border-white/6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#FF3F3F]/40 to-transparent opacity-60" />

        <div className="p-5">
          <h2 className="text-base font-bold text-white mb-6">{activeLabel}</h2>

          {renderSection()}
        </div>
      </div>

      {/*Mobile Navigation*/}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3  px-4 py-3  backdrop-blur-md">
        <button
          type="button"
          onClick={goToPrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            canGoPrev
              ? "text-zinc-300 border-white/8 bg-white/4 hover:bg-white/8 cursor-pointer"
              : "text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />

          <span>
            {canGoPrev ? sections[activeSectionIndex - 1].label : "Previous"}
          </span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            canGoNext
              ? "text-white border-[#FF3F3F]/40 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 cursor-pointer"
              : "text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40"
          }`}
        >
          <span>
            {canGoNext ? sections[activeSectionIndex + 1].label : "Next"}
          </span>

          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
