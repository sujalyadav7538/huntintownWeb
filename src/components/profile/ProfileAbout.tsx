import { useState } from "react";
import { User } from "../../types";
import { FileText } from "lucide-react";
import ProfileSectionCard from "./ProfileSectionCard";

const PREVIEW_LENGTH = 260;

interface ProfileAboutProps {
  user: User;
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  const [expanded, setExpanded] = useState(false);

  const bio =
    user.bio?.trim() ||
    "No introduction has been added yet. Add a short description about yourself, your experience, and the services you offer to help people know you better.";

  const showToggle = bio.length > PREVIEW_LENGTH;

  const content =
    !expanded && showToggle ? `${bio.slice(0, PREVIEW_LENGTH)}...` : bio;

  return (
    <ProfileSectionCard
      title="About"
      icon={FileText}
      iconColor="text-[#FF3F3F]"
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-7 text-zinc-300 whitespace-pre-wrap break-words">
          {content}
        </p>

        {showToggle && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </ProfileSectionCard>
  );
}
