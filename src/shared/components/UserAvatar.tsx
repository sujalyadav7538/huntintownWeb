import { useState } from "react";

interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  alt?: string;
}

const getInitials = (name?: string | null) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();

  return initials || "?";
};

export default function UserAvatar({
  name,
  src,
  className = "h-9 w-9 rounded-full",
  imageClassName = "object-cover",
  fallbackClassName = "font-semibold",
  alt,
}: UserAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const userName = name?.trim() || "User";
  const imageSource = src?.trim();

  if (!imageSource || failedSrc === imageSource) {
    return (
      <span
        role="img"
        aria-label={alt ?? `${userName} profile image`}
        className={`${className} flex shrink-0 items-center justify-center overflow-hidden bg-[#FF3F3F] text-white ${fallbackClassName} theme-avatar-fallback`}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt ?? userName}
      onError={() => setFailedSrc(imageSource)}
      referrerPolicy="no-referrer"
      className={`${className} ${imageClassName}`}
    />
  );
}
