import { User } from "../../types";
import { Calendar, Clock, Globe, ShieldCheck } from "lucide-react";

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
    </div>
  );
}
