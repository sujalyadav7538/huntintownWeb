import { DraftAction, DraftState } from "./profileEditTypes";

interface ServicesSectionProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "mb-2 block text-xs font-medium text-zinc-400";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

export default function ServicesSection({
  draft,
  dispatch,
}: ServicesSectionProps) {
  return (
    <>
      <div className="hidden md:block">
        <ServicesSectionDesktop draft={draft} dispatch={dispatch} />
      </div>

      <div className="md:hidden">
        <ServicesSectionMobile draft={draft} dispatch={dispatch} />
      </div>
    </>
  );
}

interface ServicesSectionLayoutProps extends ServicesSectionProps {}

function ServicesSectionDesktop({
  draft,
  dispatch,
}: ServicesSectionLayoutProps) {
  return <ServicesFields draft={draft} dispatch={dispatch} />;
}

function ServicesSectionMobile({
  draft,
  dispatch,
}: ServicesSectionLayoutProps) {
  return <ServicesFields draft={draft} dispatch={dispatch} />;
}

function ServicesFields({ draft, dispatch }: ServicesSectionLayoutProps) {
  const preview = draft.servicesRaw
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Services Offered (comma-separated)</label>
        <input
          className={inputCls}
          value={draft.servicesRaw}
          onChange={(event) =>
            dispatch({
              type: "set",
              field: "servicesRaw",
              value: event.target.value,
            })
          }
          placeholder="Interior Design Consultation, 3D Visualization, Space Planning…"
        />
      </div>

      {preview.length > 0 && (
        <div>
          <p className={labelCls}>Preview</p>
          <div className="flex flex-wrap gap-2">
            {preview.map((service) => (
              <span
                key={service}
                className="rounded-lg border border-[#FF3F3F]/20 bg-[#FF3F3F]/10 px-3 py-1.5 text-xs font-medium text-rose-300"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
