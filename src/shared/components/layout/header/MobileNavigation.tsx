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
    <div className="flex h-full items-center justify-between px-4">
      <button type="button" onClick={handleSidePanelOpen} aria-label="Menu">
        <Menu className="h-5 w-5 text-zinc-400 hover:text-white" />
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("landing")}
        className="flex items-center"
        aria-label="Home"
      >
        <img
          src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
          alt="HuntInTown"
          className="h-8 w-37.5"
        />
      </button>

      <div className="flex items-center gap-1">
        {isAuthenticated && <Notification />}

        {isAuthenticated && currentUser ? (
          // <button
          //   type="button"
          //   onClick={() => setActiveTab("messaging")}
          //   aria-label="Messages"
          //   className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
          //     isMessagingActive
          //       ? "bg-[#FF3F3F]/10 text-[#FF3F3F]"
          //       : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
          //   }`}
          // >
          //   <MessageSquare className="h-5 w-5" />

          //   {unreadMessagesCount > 0 && (
          //     <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
          //       {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
          //     </span>
          //   )}
          // </button>
          <></>
        ) : (
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            aria-label="Sign In"
            className={`flex h-8 items-center gap-1.5 rounded-lg text-[11px] font-semibold transition ${
              isLoginActive
                ? "text-[#FF3F3F]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserRound className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}