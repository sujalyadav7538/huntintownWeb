import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { UserSocialLinks } from "@/src/shared/types";
import { DraftAction, DraftState } from "@/src/features/profile/components/edit/profileEditTypes";

interface SocialSectionProps {
  draft: DraftState;
  dispatch: React.Dispatch<DraftAction>;
}

const labelCls = "mb-2 block text-xs font-medium text-zinc-400";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#FF3F3F]/50";

const socialPlatforms: {
  key: keyof UserSocialLinks;
  label: string;
  placeholder: string;
}[] = [
  { key: "website", label: "Website", placeholder: "https://your-site.com" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "twitter", label: "X", placeholder: "https://x.com/you" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/you" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/you" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@you" },
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
  const [activePlatforms, setActivePlatforms] = useState<
    (keyof UserSocialLinks)[]
  >(() =>
    socialPlatforms
      .filter((platform) => Boolean(draft.socialLinks[platform.key]?.trim()))
      .map((platform) => platform.key),
  );
  const [newPlatform, setNewPlatform] = useState<keyof UserSocialLinks | "">("");
  const availablePlatforms = socialPlatforms.filter(
    (platform) => !activePlatforms.includes(platform.key),
  );

  const addPlatform = () => {
    if (!newPlatform) return;
    setActivePlatforms((current) => [...current, newPlatform]);
    setNewPlatform("");
  };

  const removePlatform = (key: keyof UserSocialLinks) => {
    setActivePlatforms((current) => current.filter((platform) => platform !== key));
    dispatch({ type: "setSocial", field: key, value: "" });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-5 text-zinc-500">
        Add the profiles you want people to find.
      </p>

      {activePlatforms.map((key) => {
        const platform = socialPlatforms.find((item) => item.key === key)!;

        return (
          <div key={platform.key}>
            <label className={labelCls} htmlFor={`social-${platform.key}`}>
              {platform.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                id={`social-${platform.key}`}
                className={inputCls}
                value={draft.socialLinks[platform.key] ?? ""}
                onChange={(event) =>
                  dispatch({
                    type: "setSocial",
                    field: platform.key,
                    value: event.target.value,
                  })
                }
                placeholder={platform.placeholder}
                type="url"
              />
              <button
                type="button"
                onClick={() => removePlatform(platform.key)}
                aria-label={`Remove ${platform.label} link`}
                title={`Remove ${platform.label} link`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-rose-500/30 hover:text-rose-400"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

      {availablePlatforms.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="social-platform">
            Choose a social platform
          </label>
          <select
            id="social-platform"
            className={`${inputCls} min-w-0 flex-1`}
            value={newPlatform}
            onChange={(event) =>
              setNewPlatform(event.target.value as keyof UserSocialLinks | "")
            }
          >
            <option value="">Choose a platform</option>
            {availablePlatforms.map((platform) => (
              <option key={platform.key} value={platform.key}>
                {platform.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addPlatform}
            disabled={!newPlatform}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FF3F3F] px-4 text-sm font-semibold text-white transition hover:bg-[#e53535] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add link
          </button>
        </div>
      )}
    </div>
  );
}
