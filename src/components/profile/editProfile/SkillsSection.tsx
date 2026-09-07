import { DraftAction, DraftState } from "./profileEditTypes";

interface SectionSkillsProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "block text-xs font-medium text-zinc-400 mb-2";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

export default function SectionSkills({ draft, dispatch }: SectionSkillsProps) {
  return (
    <>
      <div className="hidden md:block">
        <SectionSkillsDesktop draft={draft} dispatch={dispatch} />
      </div>

      <div className="md:hidden">
        <SectionSkillsMobile draft={draft} dispatch={dispatch} />
      </div>
    </>
  );
}

interface SectionSkillsLayoutProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

function SectionSkillsDesktop({ draft, dispatch }: SectionSkillsLayoutProps) {
  const preview = draft.skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Skills (comma-separated)</label>

        <input
          className={inputCls}
          value={draft.skillsRaw}
          onChange={(e) =>
            dispatch({
              type: "set",
              field: "skillsRaw",
              value: e.target.value,
            })
          }
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
                className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300"
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

function SectionSkillsMobile({ draft, dispatch }: SectionSkillsLayoutProps) {
  const preview = draft.skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Skills (comma-separated)</label>

        <input
          className={inputCls}
          value={draft.skillsRaw}
          onChange={(e) =>
            dispatch({
              type: "set",
              field: "skillsRaw",
              value: e.target.value,
            })
          }
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
                className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300"
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
