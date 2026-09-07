import { DraftAction, DraftState } from "./profileEditTypes";

interface SectionLocationProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "block text-xs font-medium text-zinc-400 mb-2";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

export default function SectionLocation({
  draft,
  dispatch,
}: SectionLocationProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <SectionLocationDesktop draft={draft} dispatch={dispatch} />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <SectionLocationMobile draft={draft} dispatch={dispatch} />
      </div>
    </>
  );
}

interface SectionLocationLayoutProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

function SectionLocationDesktop({
  draft,
  dispatch,
}: SectionLocationLayoutProps) {
  return (
    <div>
      <label className={labelCls}>Your Location</label>

      <input
        className={inputCls}
        value={draft.location}
        onChange={(e) =>
          dispatch({
            type: "set",
            field: "location",
            value: e.target.value,
          })
        }
        placeholder="Noida, Sector 62"
      />

      <p className="mt-2 text-[11px] text-zinc-600">
        Used to surface relevant local requests near you.
      </p>
    </div>
  );
}

function SectionLocationMobile({
  draft,
  dispatch,
}: SectionLocationLayoutProps) {
  return (
    <div>
      <label className={labelCls}>Your Location</label>

      <input
        className={inputCls}
        value={draft.location}
        onChange={(e) =>
          dispatch({
            type: "set",
            field: "location",
            value: e.target.value,
          })
        }
        placeholder="Noida, Sector 62"
      />

      <p className="mt-2 text-[11px] text-zinc-600">
        Used to surface relevant local requests near you.
      </p>
    </div>
  );
}
