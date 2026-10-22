// MobileNavigation.tsx

import { useAppSelector } from "@/src/store/hooks";
import { Menu, MessageSquare, UserRound } from "lucide-react";
import Notification from "../Notification";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  handleSidePanelOpen: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function MobileNavigation({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  handleSidePanelOpen,
  theme,
}: MobileNavigationProps) {
  const { isAuthenticated, currentUser } = useAppSelector(
    (state) => state.auth,
  );

  const isMessagingActive = activeTab === "messaging";
  const isLoginActive = activeTab === "login";

  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-4">
      <button
        type="button"
        onClick={handleSidePanelOpen}
        aria-label="Menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-(--app-text-muted) transition hover:text-(--app-text)"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("landing")}
        className="flex items-center justify-self-center"
        aria-label="Home"
      >
        <img
          src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
          alt="HuntInTown"
          className="h-8 w-auto max-w-[42vw] object-contain"
        />
      </button>

      <div className="flex items-center justify-self-end gap-1.5">
        {isAuthenticated && <Notification />}

        {isAuthenticated && currentUser ? (
          <button
            type="button"
            onClick={() => setActiveTab("messaging")}
            aria-label="Chat"
            aria-current={isMessagingActive ? "page" : undefined}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
              isMessagingActive
                ? "bg-[color-mix(in_srgb,var(--app-red)_12%,transparent)] text-(--app-red)"
                : "text-(--app-text-muted) hover:text-(--app-text)"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
                {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            aria-label="Sign In"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
              isLoginActive
                ? "text-(--app-red)"
                : "text-(--app-text-muted) hover:text-(--app-text)"
            }`}
          >
            <UserRound className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}