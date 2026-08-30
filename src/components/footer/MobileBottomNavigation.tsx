import {
  Home,
  LayoutGrid,
  Plus,
  Activity,
  Inbox,
  LucideIcon,
  User,
  Send,
  Compass,
  MessageSquare,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";

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
    icon: Compass,
  },
  {
    id: "dashboard/activity",
    label: "Activity",
    icon: Activity,
    auth: true,
  },
  {
    id: "profile",
    label: "profile",
    icon: MessageSquare,
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
  return (
    <div className="theme-panel md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#232327] bg-[#121214]/95 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const Icon = item.icon;

          const active =
            item.id === activeTab ||
            (item.id === "explore" && activeTab === "feed");

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 transition ${
                active ? "text-[#FF3F3F]" : "theme-text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />

              <span className="text-[8px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Action Button */}
        <button
          onClick={onCreatePost}
          className="theme-btn-accent flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Plus className="h-5 w-5" />
        </button>

        {NAV_ITEMS.slice(2).map((item) => {
          const Icon = item.icon;

          const active =
            item.id === activeTab ||
            (item.id === "explore" && activeTab === "feed");

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 transition ${
                active ? "text-[#FF3F3F]" : "theme-text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />

              <span className="text-[8px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
