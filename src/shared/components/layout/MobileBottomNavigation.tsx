import {
  Trees,
  Plus,
  Footprints,
  LucideIcon,
  User,
  Compass,
  UserRound,
  BowArrow,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { getAvatarUrl, getUserId, handleAvatarError } from "@/src/shared/utils";

type Tab =
  | "landing"
  | "explore"
  | "activity"
  | "responses"
  | "login"
  | "profile"
  | "feed"
  | "dashboard"
  | "messaging";

interface MobileBottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: Tab) => void;
  isAuthenticated: boolean;
  onCreatePost: () => void;
  currentUser?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface NavItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
  auth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "landing", label: "Den", icon: Trees },
  { id: "explore", label: "Jungle", icon: BowArrow },
  { id: "activity", label: "Tracks", icon: Footprints, auth: true },
  { id: "profile", label: "Profile", icon: User, auth: true },
];

export default function MobileBottomNavigation({
  activeTab,
  setActiveTab,
  isAuthenticated,
  onCreatePost,
  currentUser,
}: MobileBottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = getUserId(currentUser);

  const isActive = (item: NavItem) =>
    item.id === "profile"
      ? location.pathname.startsWith("/profile")
      : item.id === activeTab ||
        (item.id === "activity" && activeTab === "dashboard") ||
        (item.id === "explore" && activeTab === "feed");

  const handleNavigation = (item: NavItem) => {
    if (item.auth && !isAuthenticated) {
      setActiveTab("login");
      return;
    }

    if (item.id === "profile") {
      if (profileId) navigate("/profile");
      return;
    }

    setActiveTab(item.id);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const isProfile = item.id === "profile";
    const label = isProfile && !isAuthenticated ? "Sign In" : item.label;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavigation(item)}
        aria-label={label}
        className={`flex flex-col items-center gap-0.5 px-3 py-2.5 transition ${
          active ? "text-[#FF3F3F]" : "theme-text-muted"
        }`}
      >
        {isProfile ? (
          isAuthenticated ? (
            <img
              src={getAvatarUrl(
                currentUser?.name || "Profile",
                currentUser?.avatar,
              )}
              alt={currentUser?.name || "Profile"}
              onError={(event) =>
                handleAvatarError(event, currentUser?.name || "Profile")
              }
              className={`h-5 w-5 rounded-full object-cover ${
                active ? "ring-1 ring-[#FF3F3F]" : ""
              }`}
            />
          ) : (
            <UserRound className="h-5 w-5" />
          )
        ) : (
          <item.icon className="h-4 w-4" />
        )}

        <span className="text-[8px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="theme-panel fixed inset-x-0 bottom-0 z-40 border-t border-[#232327] bg-[#121214]/95 shadow-xl backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.slice(0, 2).map(renderNavItem)}

        <button
          type="button"
          onClick={onCreatePost}
          aria-label="Create post"
          className="theme-btn-accent flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Plus className="h-5 w-5" />
        </button>

        {NAV_ITEMS.slice(2).map(renderNavItem)}
      </div>
    </div>
  );
}