import {
  Home,
  Compass,
  Activity,
  MessageSquare,
  Search,
  PlusCircle,
  Moon,
  Sun,
} from "lucide-react";

import UserProfileIndicator from "./UserProfileIndicator";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setSearchTerm } from "../../store/uiSlice";
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
  {
    id: "landing",
    label: "Home",
    icon: Home,
  },
  {
    id: "explore",
    label: "Explore",
    icon: Compass,
  },
  {
    id: "dashboard/activity",
    label: "Activity",
    icon: Activity,
    auth: true,
  },
  {
    id: "messaging",
    label: "Chat",
    icon: MessageSquare,
    auth: true,
  },
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
  const { searchTerm } = useAppSelector((s) => s.ui);

  return (
    <div className="hidden h-full items-center justify-between px-6 md:flex">
      {/* Left */}
      <button
        onClick={() => setActiveTab("mobile")}
        className="flex items-center shrink-0"
      >
        <img
          src={`${theme=="dark"?"/dark_logo.png":"/light_logo.png"}`}
          alt="HuntInTown"
          className="
            h-7 w-auto            
          "
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
            className="
              w-full
              rounded-xl
              border border-[#2b2b30]
              bg-[#1A1A1D]
              py-2
              pl-10
              pr-4
              text-sm
              text-white
              placeholder:text-zinc-500
              focus:border-[#FF3F3F]
              focus:outline-none
            "
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6 shrink-0">
        {NAV_ITEMS.filter((i) => !i.auth || isAuthenticated).map((item) => {
          const Icon = item.icon;

          const active =
            item.id === activeTab ||
            (item.id === "explore" && activeTab === "feed");

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-2 transition cursor-pointer ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-[#FF3F3F]" : ""}`} />

              <span className="text-sm font-medium">{item.label}</span>

              {item.id === "messaging" && unreadMessagesCount > 0 && (
                <span className="absolute -right-4 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[9px] font-bold text-white">
                  {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                </span>
              )}

              {active && (
                <span className="absolute -bottom-5.25 left-0 h-0.5 w-full rounded-full bg-[#FF3F3F]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right */}
      <div className="ml-8 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl cursor-pointer text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-white" />
          ) : (
            <Moon className="h-4 w-4 text-[#FF3F3F]" />
          )}
        </button>

        {isAuthenticated && (
          <button
            onClick={openCreatePost}
            className="
                  inline-flex items-center gap-1.5
                  h-8 px-3
                  rounded-xl
                  border border-zinc-800
                  text-zinc-200 text-sm font-medium
                  hover:border-[#FF3F3F]/40
                  hover:text-white
                  hover:bg-zinc-800
                  transition-all
                  duration-200
                  cursor-pointer
                "
          >
            <PlusCircle className="h-4 w-4 text-[#FF3F3F]" />
            <span>Post</span>
          </button>
        )}

        <UserProfileIndicator
          setActiveTab={setActiveTab}
          onLogoutSimulate={onLogoutSimulate}
        />
      </div>
    </div>
  );
}
