// MobileNavigation.tsx

import { useAppSelector } from "@/src/store/hooks";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import {
  Ham,
  Menu,
  MessageSquare,
  Search,
  Send,
  UserCircle,
} from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  handleSidePanelOpen: () => void;
}

export default function MobileNavigation({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  handleSidePanelOpen,
}: MobileNavigationProps) {
  const { isAuthenticated, currentUser } = useAppSelector(
    (state) => state.auth,
  );

  return (
    <div className="flex h-14 items-center justify-between border-b border-[#232327] px-4">
      <button>
        <Menu
          className="h-5 w-5 text-zinc-400 hover:text-white"
          onClick={handleSidePanelOpen}
        />
      </button>
      {/* Logo */}
      <button
        onClick={() => setActiveTab("mobile")}
        className="flex  items-center"
      >
        <img src="/name.png" alt="HuntInTown" className="h-8 w-37.5" />
      </button>

      {/* Search */}

      {/* <div className="relative ">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          placeholder="Search requirements..."
          className="
          w-full
          h-10
          rounded-xl
          border border-[#2b2b30]
          bg-[#1A1A1D]
          pl-10
          pr-4
          text-sm
          text-white
          placeholder:text-zinc-500
          focus:border-[#FF3F3F]
          focus:outline-none
        "
        />
      </div> */}

      {/* Chat */}
      {/* <button
        onClick={() => setActiveTab(isAuthenticated ? "messaging" : "login")}
        className={`
                  relative
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl
                  transition
                    ${
                      activeTab === "messaging"
                        ? "bg-[#FF3F3F]/10 text-[#FF3F3F]"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }
          `}
      >
        <Send className="h-5 w-5" />

        {unreadMessagesCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
            {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
          </span>
        )}
      </button> */}

      {/* Profile */}
      {isAuthenticated && currentUser ? (
        <button
          type="button"
          onClick={() => setActiveTab("/profile")}
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            activeTab === "/profile" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          <img
            src={getAvatarUrl(currentUser.name, currentUser.avatar)}
            alt={currentUser.name}
            className="h-7 w-7 rounded-full object-cover ring-2 ring-[#2a2a2e]"
            onError={(e) => handleAvatarError(e, currentUser.name)}
            referrerPolicy="no-referrer"
          />
        </button>
      ) : (
        <button
          id="header-signin-btn"
          type="button"
          onClick={() => setActiveTab("login")}
          className="flex items-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          <UserCircle className="h-4 w-4" />
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
}
