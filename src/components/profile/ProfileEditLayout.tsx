import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  User,
  UserSocialLinks,
} from '../../types';
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
} from 'lucide-react';
import AvatarUploader from './AvatarUploader';
import ProfileFloatingSaveBar from './ProfileFloatingSaveBar';

// ──────────────────────────────────────────────────────
// Draft state
// ──────────────────────────────────────────────────────
interface DraftState {
  name: string;
  role: string;
  location: string;
  bio: string;
  skillsRaw: string; // comma-separated
  servicesRaw: string; // comma-separated
  avatar: string;
  socialLinks: UserSocialLinks;
}

function buildDraft(user: User): DraftState {
  return {
    name: user.name,
    role: user.role,
    location: user.location,
    bio: user.bio ?? '',
    skillsRaw: user.skills?.join(', ') ?? '',
    servicesRaw: user.services?.join(', ') ?? '',
    avatar: user.avatar,
    socialLinks: { ...user.socialLinks },
  };
}

type DraftAction =
  | { type: 'set'; field: keyof Omit<DraftState, 'socialLinks'>; value: string }
  | { type: 'setSocial'; field: keyof UserSocialLinks; value: string }
  | { type: 'reset'; payload: DraftState };

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'set':
      return { ...state, [action.field]: action.value };
    case 'setSocial':
      return { ...state, socialLinks: { ...state.socialLinks, [action.field]: action.value } };
    case 'reset':
      return action.payload;
    default:
      return state;
  }
}

// ──────────────────────────────────────────────────────
// Section definitions
// ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: UserIcon },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'social', label: 'Social Links', icon: Link2 },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: LayoutGrid },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Settings2 },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

// ──────────────────────────────────────────────────────
// Shared input / textarea styles
// ──────────────────────────────────────────────────────
const inputCls =
  'w-full bg-[#0a0a0c] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20 transition-all';

const labelCls = 'block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2';

const textareaCls =
  'w-full bg-[#0a0a0c] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF3F3F]/60 focus:ring-1 focus:ring-[#FF3F3F]/20 transition-all resize-none min-h-[120px]';

// ──────────────────────────────────────────────────────
// Completion calculator
// ──────────────────────────────────────────────────────
function calcCompletion(d: DraftState): number {
  const checks = [
    !!d.name,
    !!d.role,
    !!d.location,
    !!d.bio,
    !!d.avatar,
    d.skillsRaw.trim().length > 0,
    d.servicesRaw.trim().length > 0,
    !!(d.socialLinks.linkedin || d.socialLinks.github || d.socialLinks.website),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ──────────────────────────────────────────────────────
// Section editors
// ──────────────────────────────────────────────────────
function SectionBasic({
  draft,
  dispatch,
  onAvatarChange,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
  onAvatarChange: (file: File) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <label className={labelCls}>Profile Photo</label>
        <div className="flex items-center gap-5 p-4 rounded-xl bg-white/2.5 border border-white/6">
          <AvatarUploader
            avatar={draft.avatar}
            name={draft.name}
            onChange={onAvatarChange}
            size="md"
          />
          <div>
            <p className="text-sm font-semibold text-zinc-200">Profile picture</p>
            <p className="text-xs text-zinc-500 mt-0.5">JPG, PNG · Recommended 400×400px</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            className={inputCls}
            value={draft.name}
            onChange={(e) => dispatch({ type: 'set', field: 'name', value: e.target.value })}
            placeholder="Arjun Mehta"
          />
        </div>
        <div>
          <label className={labelCls}>Professional Title</label>
          <input
            className={inputCls}
            value={draft.role}
            onChange={(e) => dispatch({ type: 'set', field: 'role', value: e.target.value })}
            placeholder="Interior Designer · 5 yrs"
          />
        </div>
      </div>
    </div>
  );
}

function SectionAbout({
  draft,
  dispatch,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}) {
  const max = 500;
  const count = draft.bio.length;
  return (
    <div>
      <label className={labelCls}>Bio</label>
      <div className="relative">
        <textarea
          className={textareaCls}
          value={draft.bio}
          maxLength={max}
          onChange={(e) => dispatch({ type: 'set', field: 'bio', value: e.target.value })}
          placeholder="Describe yourself, your work style, and what makes you unique…"
          rows={6}
        />
        <span className={`absolute bottom-3 right-4 text-[11px] ${count > max * 0.85 ? 'text-amber-400' : 'text-zinc-600'}`}>
          {count}/{max}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-zinc-600">
        A compelling bio increases response rates by up to 40%.
      </p>
    </div>
  );
}

function SectionSkills({
  draft,
  dispatch,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}) {
  const preview = draft.skillsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Skills (comma-separated)</label>
        <input
          className={inputCls}
          value={draft.skillsRaw}
          onChange={(e) => dispatch({ type: 'set', field: 'skillsRaw', value: e.target.value })}
          placeholder="Interior Design, 3D Rendering, AutoCAD…"
        />
      </div>
      {preview.length > 0 && (
        <div>
          <p className={labelCls}>Preview</p>
          <div className="flex flex-wrap gap-2">
            {preview.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-lg bg-violet-400/10 border border-violet-400/20 text-xs text-violet-300 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLocation({
  draft,
  dispatch,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}) {
  return (
    <div>
      <label className={labelCls}>Your Location</label>
      <input
        className={inputCls}
        value={draft.location}
        onChange={(e) => dispatch({ type: 'set', field: 'location', value: e.target.value })}
        placeholder="Noida, Sector 62"
      />
      <p className="mt-2 text-[11px] text-zinc-600">
        Used to surface relevant local requests near you.
      </p>
    </div>
  );
}

function SectionSocial({
  draft,
  dispatch,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}) {
  const fields: { key: keyof UserSocialLinks; label: string; placeholder: string }[] = [
    { key: 'website', label: 'Personal Website', placeholder: 'https://yoursite.com' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/you' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/you' },
  ];
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className={labelCls}>{f.label}</label>
          <input
            className={inputCls}
            value={draft.socialLinks[f.key] ?? ''}
            onChange={(e) => dispatch({ type: 'setSocial', field: f.key, value: e.target.value })}
            placeholder={f.placeholder}
            type="url"
          />
        </div>
      ))}
    </div>
  );
}

function SectionServices({
  draft,
  dispatch,
}: {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}) {
  const preview = draft.servicesRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Services Offered (comma-separated)</label>
        <input
          className={inputCls}
          value={draft.servicesRaw}
          onChange={(e) => dispatch({ type: 'set', field: 'servicesRaw', value: e.target.value })}
          placeholder="Interior Design Consultation, 3D Visualization, Space Planning…"
        />
      </div>
      {preview.length > 0 && (
        <div>
          <p className={labelCls}>Preview</p>
          <div className="flex flex-wrap gap-2">
            {preview.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-lg bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-xs text-rose-300 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionPortfolio() {
  return (
    <div className="py-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/7 flex items-center justify-center mx-auto mb-4">
        <LayoutGrid className="w-6 h-6 text-zinc-500" />
      </div>
      <p className="text-sm font-semibold text-zinc-300">Portfolio coming soon</p>
      <p className="text-xs text-zinc-600 mt-1">
        Showcase past projects and work samples to attract more clients.
      </p>
    </div>
  );
}

function SectionVerification({ user }: { user: User }) {
  const isVerified = user.isVerified !== false;
  return (
    <div className="py-2 space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-400/6 border border-emerald-400/20">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            {isVerified ? 'Account verified' : 'Verification not complete'}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            {isVerified
              ? 'Your identity has been confirmed. Verified members receive 3× more responses.'
              : 'Submit your ID to unlock the verified badge and increase trust.'}
          </p>
        </div>
      </div>
      <p className="text-xs text-zinc-600">
        Full verification management will be available in Settings → Identity.
      </p>
    </div>
  );
}

function SectionPreferences() {
  return (
    <div className="space-y-4">
      {[
        { label: 'Profile visibility', sub: 'Make profile discoverable by other users', defaultOn: true },
        { label: 'Email notifications', sub: 'Receive updates on new messages and offers', defaultOn: true },
        { label: 'Request alerts', sub: 'Notify me when requests match my skills', defaultOn: false },
      ].map((pref) => (
        <div
          key={pref.label}
          className="flex items-center justify-between p-4 rounded-xl bg-white/2.5 border border-white/6 hover:border-white/9 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-200">{pref.label}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{pref.sub}</p>
          </div>
          <button
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
              pref.defaultOn ? 'bg-[#FF3F3F]' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                pref.defaultOn ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Main edit layout
// ──────────────────────────────────────────────────────
interface ProfileEditLayoutProps {
  user: User;
  isSaving: boolean;
  onSave: (updated: User, avatarFile: File | null) => void;
  onCancel: () => void;
}

export default function ProfileEditLayout({
  user,
  isSaving,
  onSave,
  onCancel,
}: ProfileEditLayoutProps) {
  const originalDraft = useRef<DraftState>(buildDraft(user));
  const [draft, dispatch] = useReducer(draftReducer, buildDraft(user));
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const handleAvatarChange = useCallback((file: File) => {
    // Revoke the previous preview blob URL to prevent memory leaks
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const preview = URL.createObjectURL(file);
    blobUrlRef.current = preview;
    dispatch({ type: 'set', field: 'avatar', value: preview });
    setPendingAvatarFile(file);
  }, []);

  // Revoke blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // When the user prop is updated (after a successful save from the parent),
  // re-sync originalDraft so isDirty resets and the blob preview is cleared.
  const prevUserRef = useRef(user);
  useEffect(() => {
    if (user !== prevUserRef.current) {
      prevUserRef.current = user;
      const freshDraft = buildDraft(user);
      originalDraft.current = freshDraft;
      dispatch({ type: 'reset', payload: freshDraft });
      // The saved avatar is now the Cloudinary URL; clear any pending file
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setPendingAvatarFile(null);
    }
  }, [user]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(originalDraft.current);
  const completionPct = useMemo(() => calcCompletion(draft), [draft]);

  // Warn on accidental navigation away
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleSave = () => {
    const updated: User = {
      ...user,
      name: draft.name,
      role: draft.role,
      location: draft.location,
      bio: draft.bio,
      // Keep existing avatar URL until backend responds with Cloudinary URL
      avatar: pendingAvatarFile ? draft.avatar : user.avatar,
      skills: draft.skillsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      services: draft.servicesRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      socialLinks: draft.socialLinks,
    };
    onSave(updated, pendingAvatarFile);
  };

  const handleDiscard = () => {
    // Revoke any pending blob URL and reset file
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setPendingAvatarFile(null);
    dispatch({ type: 'reset', payload: originalDraft.current });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return <SectionBasic draft={draft} dispatch={dispatch} onAvatarChange={handleAvatarChange} />;
      case 'about':
        return <SectionAbout draft={draft} dispatch={dispatch} />;
      case 'skills':
        return <SectionSkills draft={draft} dispatch={dispatch} />;
      case 'location':
        return <SectionLocation draft={draft} dispatch={dispatch} />;
      case 'social':
        return <SectionSocial draft={draft} dispatch={dispatch} />;
      case 'services':
        return <SectionServices draft={draft} dispatch={dispatch} />;
      case 'portfolio':
        return <SectionPortfolio />;
      case 'verification':
        return <SectionVerification user={user} />;
      case 'preferences':
        return <SectionPreferences />;
    }
  };

  const activeSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const canGoPrev = activeSectionIndex > 0;
  const canGoNext = activeSectionIndex < SECTIONS.length - 1;

  const goToPrev = () => {
    if (canGoPrev) setActiveSection(SECTIONS[activeSectionIndex - 1].id as SectionId);
  };
  const goToNext = () => {
    if (canGoNext) setActiveSection(SECTIONS[activeSectionIndex + 1].id as SectionId);
  };

  const activeLabel = SECTIONS.find((s) => s.id === activeSection)?.label ?? '';

  return (
    <>
      {/* ── Sticky top header bar (Airbnb/Instagram style) ── */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-5 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline text-sm font-semibold">Profile</span>
        </button>

        {/* Section breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 min-w-0">
          <span className="hidden sm:inline">Edit profile</span>
          <ChevronRight className="hidden sm:inline w-3 h-3 text-zinc-700 shrink-0" />
          <span className="font-semibold text-zinc-300 truncate">{activeLabel}</span>
        </div>

        {/* Step indicator — right side */}
        <div className="ml-auto flex items-center gap-2 text-[11px] text-zinc-600 shrink-0">
          <span className="font-mono tabular-nums">
            {activeSectionIndex + 1} / {SECTIONS.length}
          </span>
          {/* Mini dot progress */}
          <div className="hidden sm:flex items-center gap-1">
            {SECTIONS.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i === activeSectionIndex
                    ? 'w-4 h-1.5 bg-[#FF3F3F]'
                    : i < activeSectionIndex
                    ? 'w-1.5 h-1.5 bg-zinc-600'
                    : 'w-1.5 h-1.5 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Completion banner ── */}
      <div className="rounded-2xl bg-white/2.5 border border-white/6 p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-white">Profile Completion</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {completionPct < 80
                ? 'Add more details to build trust and get more responses.'
                : 'Great profile! Keep it updated.'}
            </p>
          </div>
          <span
            className={`text-xl font-black ${
              completionPct >= 80 ? 'text-emerald-400' : 'text-[#FF3F3F]'
            }`}
          >
            {completionPct}%
          </span>
        </div>
        <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completionPct >= 80
                ? 'bg-linear-to-r from-emerald-400 to-teal-400'
                : 'bg-linear-to-r from-[#FF3F3F] to-rose-400'
            }`}
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* ── Main layout: sidebar + content ── */}
      <div className="flex gap-4 items-start">
        {/* Sidebar navigation — hidden on mobile */}
        <nav className="hidden md:flex flex-col gap-1 w-52 shrink-0 sticky top-20">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as SectionId)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full group
                  ${isActive
                    ? 'bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/4 border border-transparent'
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF3F3F]' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                <span className="truncate">{sec.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Mobile horizontal tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-1 px-1">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as SectionId)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all
                    ${isActive
                      ? 'bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F]'
                      : 'text-zinc-500 bg-white/4 border border-white/6 hover:text-zinc-300'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {sec.label}
                </button>
              );
            })}
          </div>

          {/* Section card */}
          <div className="relative rounded-2xl bg-white/2.5 border border-white/6 overflow-hidden">
            {/* top accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#FF3F3F]/40 to-transparent opacity-60" />
            <div className="p-5 sm:p-7">
              <h2 className="text-base font-bold text-white mb-6">{activeLabel}</h2>
              {renderSection()}
            </div>
          </div>

          {/* ── Prev / Next navigation ── */}
          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Prev */}
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${canGoPrev
                  ? 'text-zinc-300 border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/12 cursor-pointer active:scale-[0.98]'
                  : 'text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40'
                }`}
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">
                {canGoPrev ? SECTIONS[activeSectionIndex - 1].label : 'Previous'}
              </span>
              <span className="xs:hidden">Prev</span>
            </button>

            {/* Section dots (mobile) */}
            <div className="flex items-center gap-1.5 md:hidden">
              {SECTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(SECTIONS[i].id as SectionId)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeSectionIndex
                      ? 'w-5 h-2 bg-[#FF3F3F]'
                      : i < activeSectionIndex
                      ? 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'
                      : 'w-2 h-2 bg-zinc-800 hover:bg-zinc-600'
                  }`}
                  aria-label={SECTIONS[i].label}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${canGoNext
                  ? 'text-white border-[#FF3F3F]/40 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 hover:border-[#FF3F3F]/60 cursor-pointer active:scale-[0.98]'
                  : 'text-zinc-700 border-white/4 bg-transparent cursor-not-allowed opacity-40'
                }`}
            >
              <span className="hidden xs:inline">
                {canGoNext ? SECTIONS[activeSectionIndex + 1].label : 'Next'}
              </span>
              <span className="xs:hidden">Next</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating save bar */}
      <ProfileFloatingSaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        completionPct={completionPct}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </>
  );
}
