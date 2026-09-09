// MobileNavigation.tsx

import { useAppSelector } from "@/src/store/hooks";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import { Menu, MessageSquare, Moon, Sun, UserCircle } from "lucide-react";

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

  return (
    <div className="flex h-full items-center justify-between px-4">
      {/* Menu */}
      <button type="button" onClick={handleSidePanelOpen}>
        <Menu className="h-5 w-5 text-zinc-400 hover:text-white" />
      </button>

      {/* Logo */}
      <button
        type="button"
        onClick={() => setActiveTab("mobile")}
        className="flex items-center"
      >
        <img
          src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
          alt="HuntInTown"
          className="h-8 w-37.5"
        />
      </button>

      <div className="flex items-center gap-1">
        {/* Messages */}
        {isAuthenticated && currentUser ? (
          <button
            type="button"
            onClick={() =>
              setActiveTab(isAuthenticated ? "messaging" : "login")
            }
            aria-label={isAuthenticated ? "Messages" : "Sign in"}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
              activeTab === "messaging"
                ? "bg-[#FF3F3F]/10 text-[#FF3F3F]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <MessageSquare className="h-5 w-5" />

            {isAuthenticated && unreadMessagesCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
                {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            aria-label="Sign In"
            className={`flex h-8 items-center gap-1.5 rounded-lg  text-[11px] font-semibold transition ${
              activeTab === "login"
                ? "text-[#FF3F3F]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserCircle className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
}
