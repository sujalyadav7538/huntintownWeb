import {
  Trees,
  Compass,
  Footprints,
  MessageSquare,
  Search,
  PlusCircle,
  Moon,
  Sun,
  BowArrow,
} from "lucide-react";

import UserProfileIndicator from "@/src/shared/components/layout/header/UserProfileIndicator";
import Notification from "@/src/shared/components/layout/Notification";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setSearchTerm } from "@/src/store/uiSlice";

interface DesktopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  isAuthenticated: boolean;
  openCreatePost: () => void;
  onLogoutSimulate: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const NAV_ITEMS = [
  { id: "landing", label: "Den", icon: Trees },
  { id: "explore", label: "Jungle", icon: BowArrow },
  { id: "activity", label: "Tracks", icon: Footprints, auth: true },
  { id: "messaging", label: "Chat", icon: MessageSquare, auth: true },
];

export default function DesktopNavigation({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  isAuthenticated,
  openCreatePost,
  onLogoutSimulate,
  theme,
  onToggleTheme,
}: DesktopNavigationProps) {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.ui.searchTerm);

  const isNavItemActive = (id: string) =>
    id === activeTab ||
    (id === "activity" && activeTab === "dashboard") ||
    (id === "explore" && activeTab === "feed");

  return (
    <div className="hidden h-full items-center justify-between px-6 md:flex">
      {/* Logo */}
      <button
        type="button"
        onClick={() => setActiveTab("mobile")}
        className="flex shrink-0 items-center"
        aria-label="Home"
      >
        <img
          src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
          alt="HuntInTown"
          className="h-7 w-auto"
        />
      </button>

      {/* Search */}
      <div className="mx-8 w-full max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <input
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search requirements..."
            className="w-full rounded-xl border border-[#2b2b30] bg-[#1A1A1D] py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF3F3F] focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex shrink-0 items-center gap-6">
        {NAV_ITEMS.filter((item) => !item.auth || isAuthenticated).map(
          (item) => {
            const Icon = item.icon;
            const active = isNavItemActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex cursor-pointer items-center gap-2 transition ${
                  active
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-[#FF3F3F]" : ""
                  }`}
                />

                <span className="text-sm font-medium">{item.label}</span>

                {item.id === "messaging" && unreadMessagesCount > 0 && (
                  <span className="absolute -right-4 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
                    {unreadMessagesCount > 99
                      ? "99+"
                      : unreadMessagesCount}
                  </span>
                )}

                {active && (
                  <span className="absolute -bottom-5.25 left-0 h-0.5 w-full rounded-full bg-[#FF3F3F]" />
                )}
              </button>
            );
          },
        )}
      </nav>

      {/* Actions */}
      <div className="ml-8 flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${
            theme === "dark" ? "light" : "dark"
          } theme`}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-white" />
          ) : (
            <Moon className="h-4 w-4 text-[#FF3F3F]" />
          )}
        </button>

        {isAuthenticated && (
          <>
            <button
              type="button"
              onClick={openCreatePost}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 px-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-[#FF3F3F]/40 hover:bg-zinc-800 hover:text-white"
            >
              <PlusCircle className="h-4 w-4 text-[#FF3F3F]" />
              <span>Post</span>
            </button>

            <Notification />
          </>
        )}

        <UserProfileIndicator
          setActiveTab={setActiveTab}
          onLogoutSimulate={onLogoutSimulate}
        />
      </div>
    </div>
  );
}