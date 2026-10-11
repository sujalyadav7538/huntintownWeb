import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";

interface UserProfileLinkProps extends Omit<ComponentProps<typeof Link>, "to"> {
  userId?: string | null;
  children: ReactNode;
}

export default function UserProfileLink({
  userId,
  children,
  ...linkProps
}: UserProfileLinkProps) {
  if (!userId) return <>{children}</>;

  return (
    <Link to={`/profile/${encodeURIComponent(userId)}`} {...linkProps}>
      {children}
    </Link>
  );
}
