import { UserSocialLinks } from "../../../types";
import { DraftAction, DraftState } from "./profileEditTypes";

interface SocialSectionProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "mb-2 block text-xs font-medium text-zinc-400";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

const socialFields: {
  key: keyof UserSocialLinks;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "website",
    label: "Personal Website",
    placeholder: "https://yoursite.com",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/you",
  },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/you" },
];

export default function SocialSection({ draft, dispatch }: SocialSectionProps) {
  return (
    <>
      <div className="hidden md:block">
        <SocialSectionDesktop draft={draft} dispatch={dispatch} />
      </div>

      <div className="md:hidden">
        <SocialSectionMobile draft={draft} dispatch={dispatch} />
      </div>
    </>
  );
}

interface SocialSectionLayoutProps extends SocialSectionProps {}

function SocialSectionDesktop({ draft, dispatch }: SocialSectionLayoutProps) {
  return <SocialFields draft={draft} dispatch={dispatch} />;
}

function SocialSectionMobile({ draft, dispatch }: SocialSectionLayoutProps) {
  return <SocialFields draft={draft} dispatch={dispatch} />;
}

function SocialFields({ draft, dispatch }: SocialSectionLayoutProps) {
  return (
    <div className="space-y-4">
      {socialFields.map((field) => (
        <div key={field.key}>
          <label className={labelCls}>{field.label}</label>
          <input
            className={inputCls}
            value={draft.socialLinks[field.key] ?? ""}
            onChange={(event) =>
              dispatch({
                type: "setSocial",
                field: field.key,
                value: event.target.value,
              })
            }
            placeholder={field.placeholder}
            type="url"
          />
        </div>
      ))}
    </div>
  );
}
