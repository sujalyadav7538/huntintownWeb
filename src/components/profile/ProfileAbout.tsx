import { useState } from "react";
import { User } from "../../types";
import { Sparkles } from "lucide-react";
import ProfileSectionCard from "./ProfileSectionCard";

const MAX_BIO_PREVIEW = 220;

interface ProfileAboutProps {
  user: User;
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  const bio =
    user.bio ||
    "This user hasn't written a bio yet. Check back soon to learn more about their expertise and what they offer.";
  const isLong = bio.length > MAX_BIO_PREVIEW;
  const [expanded, setExpanded] = useState(false);
  const displayBio =
    isLong && !expanded ? bio.slice(0, MAX_BIO_PREVIEW) + "…" : bio;

  return (
    <ProfileSectionCard
      title="About"
      icon={Sparkles}
      iconColor="text-[#FF3F3F]"
      accentColor="#FF3F3F"
    >
      <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {displayBio}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-xs font-semibold text-[#FF3F3F] hover:text-rose-400 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </ProfileSectionCard>
  );
}
