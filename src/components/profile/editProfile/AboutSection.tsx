import { DraftAction, DraftState } from "./profileEditTypes";

interface SectionAboutProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "block text-xs font-medium text-zinc-400 mb-2";
const textareaCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50 resize-none";

export default function AboutSection({ draft, dispatch }: SectionAboutProps) {
  return (
    <>
      <div className="hidden md:block">
        <SectionAboutDesktop draft={draft} dispatch={dispatch} />
      </div>

      <div className="md:hidden">
        <SectionAboutMobile draft={draft} dispatch={dispatch} />
      </div>
    </>
  );
}

interface SectionAboutLayoutProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

function SectionAboutDesktop({ draft, dispatch }: SectionAboutLayoutProps) {
  return <AboutFields draft={draft} dispatch={dispatch} />;
}

function SectionAboutMobile({ draft, dispatch }: SectionAboutLayoutProps) {
  return <AboutFields draft={draft} dispatch={dispatch} />;
}

function getWordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function limitWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") : value;
}

function AboutFields({ draft, dispatch }: SectionAboutLayoutProps) {
  const bioMaxWords = 50;
  const aboutMaxWords = 700;
  const bioCount = getWordCount(draft.bio);
  const aboutCount = getWordCount(draft.about);

  return (
    <div className="space-y-6">
      <label className={labelCls}>Bio</label>

      <div className="relative">
        <textarea
          className={textareaCls}
          value={draft.bio}
          onChange={(event) =>
            dispatch({
              type: "set",
              field: "bio",
              value: limitWords(event.target.value, bioMaxWords),
            })
          }
          placeholder="Write a concise introduction about yourself..."
          rows={3}
        />

        <span
          className={`absolute bottom-3 right-3 text-[11px] ${
            bioCount > bioMaxWords * 0.85 ? "text-amber-400" : "text-zinc-600"
          }`}
        >
          {bioCount}/{bioMaxWords} words
        </span>
      </div>

      <p className="mt-2 text-[11px] text-zinc-600">
        Keep this short and focused. It appears as your profile introduction.
      </p>

      <div>
        <label className={labelCls}>About</label>
        <div className="relative">
        <textarea
          className={textareaCls}
          value={draft.about}
          onChange={(event) =>
            dispatch({
              type: "set",
              field: "about",
              value: limitWords(event.target.value, aboutMaxWords),
            })
          }
          placeholder="Tell people more about your experience, work, and background..."
          rows={8}
        />

        <span
          className={`absolute bottom-3 right-3 text-[11px] ${
            aboutCount > aboutMaxWords * 0.85 ? "text-amber-400" : "text-zinc-600"
          }`}
        >
          {aboutCount}/{aboutMaxWords} words
        </span>
      </div>
      </div>
    </div>
  );
}
