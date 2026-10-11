import { User } from "@/src/shared/types";
import {
  Calendar,
  Clock,
  Facebook,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Linkedin,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";

interface ProfileAboutProps {
  user: User;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="theme-icon-muted h-3.5 w-3.5 shrink-0" />
      <span className="theme-text-muted w-28 shrink-0 text-[11px]">{label}</span>
      <span className="theme-text-secondary text-[12px] font-medium">{value}</span>
    </div>
  );
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  const about =
    user?.about?.trim() ||
    "No bio yet. Edit your profile to introduce yourself.";

  const joinedYear = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : null;
  const links = [
    { label: "Website", value: user.socialLinks?.website || user.website, Icon: Globe },
    { label: "LinkedIn", value: user.socialLinks?.linkedin, Icon: Linkedin },
    { label: "GitHub", value: user.socialLinks?.github, Icon: Github },
    { label: "X", value: user.socialLinks?.twitter, Icon: Twitter },
    { label: "Instagram", value: user.socialLinks?.instagram, Icon: Instagram },
    { label: "Facebook", value: user.socialLinks?.facebook, Icon: Facebook },
    { label: "YouTube", value: user.socialLinks?.youtube, Icon: Youtube },
  ].flatMap(({ label, value, Icon }) => {
    if (!value?.trim()) return [];

    try {
      const url = new URL(value.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") return [];
      return [{ label, href: url.href, Icon }];
    } catch {
      return [];
    }
  });

  return (
    <div className="theme-card rounded-xl border p-4 sm:p-5">
      <h3 className="theme-text-muted mb-3 text-xs font-bold uppercase tracking-wider">
        About Me
      </h3>
      <p className="theme-text-secondary mb-4 text-[13px] leading-relaxed">{about}</p>

      <div className="theme-divider divide-y">
        {joinedYear && (
          <DetailRow icon={Calendar} label="Member since" value={joinedYear} />
        )}
        <DetailRow icon={Clock} label="Response time" value="Usually within 1 hour" />
        <DetailRow
          icon={Globe}
          label="Languages"
          value="English, Hindi"
        />
        {user.governmentVerificationStatus === "verified" && (
          <DetailRow
            icon={ShieldCheck}
            label="Govt. Verified"
            value={
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            }
          />
        )}
      </div>

      {links.length > 0 && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <h4 className="theme-text-muted mb-2 text-[10px] font-semibold uppercase">
            Links
          </h4>
          <div className="flex flex-wrap gap-2">
            {links.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="theme-chip inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[10px] transition hover:border-[#FF3F3F]/30 hover:text-[#FF6B6B]"
              >
                <Icon className="h-3 w-3" />
                {label}
                <ExternalLink aria-hidden="true" className="h-2.5 w-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
