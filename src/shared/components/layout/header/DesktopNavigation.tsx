import {
  Compass,
  Footprints,
  MessageSquare,
  PlusCircle,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import UserProfileIndicator from "@/src/shared/components/layout/header/UserProfileIndicator";
import Notification from "@/src/shared/components/layout/Notification";

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
  { id: "landing", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "activity", label: "Activity", icon: Footprints, auth: true },
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
  const isNavItemActive = (id: string) =>
    id === activeTab ||
    (id === "activity" && activeTab === "dashboard") ||
    (id === "explore" && activeTab === "feed");

  return (
    <div className="hidden h-full grid-cols-[1fr_auto_1fr] items-center px-6 md:grid">
      {/* Logo */}
      <button
        type="button"
        onClick={() => setActiveTab("landing")}
        className="flex shrink-0 items-center"
        aria-label="Home"
      >
        <img
          src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
          alt="HuntInTown"
          className="h-7 w-auto"
        />
      </button>

      {/* Navigation */}
      <nav className="flex shrink-0 items-center gap-5">
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
      <div className="flex shrink-0 items-center justify-self-end gap-3">
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