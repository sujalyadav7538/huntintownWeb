import {
  Home,
  Plus,
  Activity,
  LucideIcon,
  User,
  Compass,
  UserRound,
  Search,
  Clock3,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAvatarUrl, getUserId, handleAvatarError } from "../../utils";

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
    id: string;
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
  {
    id: "landing",
    label: "Home",
    icon: Home,
  },
  {
    id: "explore",
    label: "Explore",
    icon: Search,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Clock3,
    auth: true,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    auth: true,
  },
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

  const handleNavigation = (item: NavItem) => {
    if (item.auth && !isAuthenticated) {
      setActiveTab("login");
      return;
    }

    if (item.id === "profile") {
      if (profileId) {
        navigate(`/profile`);
      }
      return;
    }

    setActiveTab(item.id);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;

    const active =
      item.id === "profile"
        ? location.pathname.startsWith("/profile")
        : item.id === activeTab ||
          (item.id === "explore" && activeTab === "feed");

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item)}
        aria-label={
          item.id === "profile" && !isAuthenticated ? "Sign In" : item.label
        }
        className={`flex flex-col items-center gap-0.5 px-3 py-2.5 transition ${
          active ? "text-[#FF3F3F]" : "theme-text-muted"
        }`}
      >
        {item.id === "profile" ? (
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
          <Icon className="h-4 w-4" />
        )}

        <span className="text-[8px] font-bold uppercase tracking-wider">
          {item.id === "profile" && !isAuthenticated ? "Sign In" : item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="theme-panel fixed inset-x-0 bottom-0 z-40 border-t border-[#232327] bg-[#121214]/95 shadow-xl backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.slice(0, 2).map(renderNavItem)}

        <button
          onClick={onCreatePost}
          className="theme-btn-accent flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Plus className="h-5 w-5" />
        </button>

        {NAV_ITEMS.slice(2).map(renderNavItem)}
      </div>
    </div>
  );
}
