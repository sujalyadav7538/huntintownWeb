import AvatarUploader from "../AvatarUploader";
import { DraftAction, DraftState } from "./profileEditTypes";


interface SectionBasicProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
  onAvatarChange: (file: File) => void;
  onCoverImageChange: (file: File) => void;
}
const labelCls = "block text-xs font-medium text-zinc-400 mb-2";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

export default function BasicSection({
  draft,
  dispatch,
  onAvatarChange,
  onCoverImageChange,
}: SectionBasicProps) {
  return (
    <>
      <div className="hidden md:block">
        <SectionBasicDesktop
          draft={draft}
          dispatch={dispatch}
          onAvatarChange={onAvatarChange}
          onCoverImageChange={onCoverImageChange}
        />
      </div>

      <div className="md:hidden">
        <SectionBasicMobile
          draft={draft}
          dispatch={dispatch}
          onAvatarChange={onAvatarChange}
          onCoverImageChange={onCoverImageChange}
        />
      </div>
    </>
  );
}

interface SectionBasicDesktopProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
  onAvatarChange: (file: File) => void;
  onCoverImageChange: (file: File) => void;
}

function SectionBasicDesktop({
  draft,
  dispatch,
  onAvatarChange,
  onCoverImageChange,
}: SectionBasicDesktopProps) {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <label className={labelCls}>Profile Photo</label>

        <div className="flex items-center gap-5 rounded-xl border border-white/6 bg-white/2.5 p-4">
          <AvatarUploader
            avatar={draft.avatar}
            name={draft.name}
            onChange={onAvatarChange}
            size="md"
          />

          <div>
            <p className="text-sm font-semibold text-zinc-200">
              Profile picture
            </p>

            <p className="mt-0.5 text-xs text-zinc-500">
              JPG, PNG · Recommended 400×400px
            </p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelCls}>Cover Image</label>

        <div className="mt-2 overflow-hidden rounded-xl border border-white/6 bg-white/2.5">
          <div className="relative h-40 bg-zinc-900 sm:h-48">
            {draft.coverImage ? (
              <img
                src={draft.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                No cover image selected
              </div>
            )}

            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 opacity-0 transition hover:opacity-100">
              <div className="rounded-lg bg-[#FF3F3F] px-4 py-2 text-sm font-semibold text-white">
                Change Cover
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onCoverImageChange(file);
                }}
              />
            </label>
          </div>

          <div className="border-t border-white/6 p-3">
            <p className="text-sm font-semibold text-zinc-200">Cover photo</p>

            <p className="mt-0.5 text-xs text-zinc-500">
              JPG, PNG · Recommended 1600 × 400px
            </p>
          </div>
        </div>
      </div>

      {/* Basic Details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Full Name</label>

          <input
            className={inputCls}
            value={draft.name}
            onChange={(e) =>
              dispatch({
                type: "set",
                field: "name",
                value: e.target.value,
              })
            }
            placeholder="Arjun Mehta"
          />
        </div>

        <div>
          <label className={labelCls}>Professional Title</label>

          <input
            className={inputCls}
            value={draft.role}
            onChange={(e) =>
              dispatch({
                type: "set",
                field: "role",
                value: e.target.value,
              })
            }
            placeholder="Interior Designer · 5 yrs"
          />
        </div>
      </div>
    </div>
  );
}

interface SectionBasicMobileProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
  onAvatarChange: (file: File) => void;
  onCoverImageChange: (file: File) => void;
}

function SectionBasicMobile({
  draft,
  dispatch,
  onAvatarChange,
  onCoverImageChange,
}: SectionBasicMobileProps) {
  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div>
        <label className={labelCls}>Profile Photo</label>

        <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/2.5 p-3">
          <AvatarUploader
            avatar={draft.avatar}
            name={draft.name}
            onChange={onAvatarChange}
            size="md"
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-200">
              Profile picture
            </p>

            <p className="mt-0.5 text-xs text-zinc-500">
              JPG, PNG · 400×400px recommended
            </p>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div>
        <label className={labelCls}>Cover Image</label>

        <div className="mt-2 overflow-hidden rounded-xl border border-white/6 bg-white/2.5">
          <div className="relative h-32 bg-zinc-900">
            {draft.coverImage ? (
              <img
                src={draft.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                No cover image selected
              </div>
            )}

            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40">
              <div className="rounded-lg bg-[#FF3F3F] px-3 py-1.5 text-xs font-semibold text-white">
                Change Cover
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onCoverImageChange(file);
                }}
              />
            </label>
          </div>

          <div className="border-t border-white/6 p-3">
            <p className="text-sm font-semibold text-zinc-200">Cover photo</p>

            <p className="mt-0.5 text-xs text-zinc-500">
              JPG, PNG · 1600 × 400px recommended
            </p>
          </div>
        </div>
      </div>

      {/* Basic Details */}
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Full Name</label>

          <input
            className={inputCls}
            value={draft.name}
            onChange={(e) =>
              dispatch({
                type: "set",
                field: "name",
                value: e.target.value,
              })
            }
            placeholder="Arjun Mehta"
          />
        </div>

        <div>
          <label className={labelCls}>Professional Title</label>

          <input
            className={inputCls}
            value={draft.role}
            onChange={(e) =>
              dispatch({
                type: "set",
                field: "role",
                value: e.target.value,
              })
            }
            placeholder="Interior Designer · 5 yrs"
          />
        </div>
      </div>
    </div>
  );
}
