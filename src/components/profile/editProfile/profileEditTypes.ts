import { User, UserSocialLinks } from "../../../types";

export interface DraftState {
  name: string;
  role: string;
  location: string;
  bio: string;
  about: string;
  skillsRaw: string;
  servicesRaw: string;
  avatar: string;
  coverImage: string;
  socialLinks: UserSocialLinks;
}

export type DraftAction =
  | { type: "set"; field: keyof Omit<DraftState, "socialLinks">; value: string }
  | { type: "setSocial"; field: keyof UserSocialLinks; value: string }
  | { type: "reset"; payload: DraftState };

export const SECTION_DEFINITIONS = [
  { id: "basic", label: "Basic Info" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "location", label: "Location" },
  { id: "social", label: "Social Links" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "verification", label: "Verification" },
  { id: "preferences", label: "Preferences" },
] as const;

export type SectionId = (typeof SECTION_DEFINITIONS)[number]["id"];

export interface SectionIconDefinition {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ProfileEditSectionProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
  onAvatarChange: (file: File) => void;
  onCoverImageChange: (file: File) => void;
  user: User;
}

export interface ProfileEditShellProps {
  activeSection: SectionId;
  activeLabel: string;
  activeSectionIndex: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  completionPct: number;
  isDirty: boolean;
  isSaving: boolean;
  sections: SectionIconDefinition[];
  sectionContent: React.ReactNode;
  onCancel: () => void;
  onDiscard: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSelectSection: (section: SectionId) => void;
}

export function buildDraft(user: User): DraftState {
  const source = user as User & {
    services?: string[];
    socialLinks?: UserSocialLinks;
  };

  return {
    name: user.name ?? "",
    role: user.role ?? "",
    location: user.address ?? "",
    bio: user.bio ?? "",
    about: user.about ?? "",
    skillsRaw: user.skills?.join(", ") ?? "",
    servicesRaw: source.services?.join(", ") ?? "",
    avatar: user.avatar ?? "",
    coverImage: user.coverImage ?? "",
    socialLinks: { ...(source.socialLinks ?? {}) },
  };
}

export function draftReducer(
  state: DraftState,
  action: DraftAction,
): DraftState {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "setSocial":
      return {
        ...state,
        socialLinks: { ...state.socialLinks, [action.field]: action.value },
      };
    case "reset":
      return action.payload;
    default:
      return state;
  }
}

export function calcCompletion(draft: DraftState): number {
  const checks = [
    Boolean(draft.name),
    Boolean(draft.role),
    Boolean(draft.location),
    Boolean(draft.bio),
    Boolean(draft.about),
    Boolean(draft.avatar),
    draft.skillsRaw.trim().length > 0,
    draft.servicesRaw.trim().length > 0,
    Boolean(
      draft.socialLinks.linkedin ||
        draft.socialLinks.github ||
        draft.socialLinks.website,
    ),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
