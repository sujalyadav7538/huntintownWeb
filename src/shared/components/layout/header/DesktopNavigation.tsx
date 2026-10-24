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
    <div className="hidden h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4 md:grid lg:grid-cols-[minmax(0,0.65fr)_auto_minmax(max-content,1fr)] lg:gap-x-6 lg:px-6">
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
      <nav aria-label="Main navigation" className="flex shrink-0 items-center justify-self-center gap-1 xl:gap-2">
        {NAV_ITEMS.filter((item) => !item.auth || isAuthenticated).map(
          (item) => {
            const Icon = item.icon;
            const active = isNavItemActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setActiveTab(item.id)}
                className="desktop-nav-item relative flex h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-(--app-text-muted) transition hover:text-(--app-text) lg:px-3"
                style={active ? {
                  color: "var(--app-text)",
                  background: "linear-gradient(135deg, rgb(255 255 255 / 18%), rgb(255 255 255 / 3%)), color-mix(in srgb, var(--app-red) 9%, transparent)",
                  boxShadow: "0 3px 10px rgb(0 0 0 / 6%)",
                  WebkitBackdropFilter: "blur(14px) saturate(160%)",
                  backdropFilter: "blur(14px) saturate(160%)",
                } : undefined}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-[#FF3F3F]" : ""
                  }`}
                />

                <span className="text-xs font-medium lg:text-sm">{item.label}</span>

                {item.id === "messaging" && unreadMessagesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
                    {unreadMessagesCount > 99
                      ? "99+"
                      : unreadMessagesCount}
                  </span>
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