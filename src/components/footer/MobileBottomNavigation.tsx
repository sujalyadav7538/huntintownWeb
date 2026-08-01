import {
  Home,
  LayoutGrid,
  Plus,
  Activity,
  Inbox,
  LucideIcon,
  User,
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
    icon: LayoutGrid,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
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
  currentUser
}: MobileBottomNavigationProps) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#232327] bg-[#121214]/95 backdrop-blur-md shadow-xl">
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
                active ? "text-[#FF3F3F]" : "text-zinc-500"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span className="text-[9px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Action Button */}
        <button
          onClick={onCreatePost}
          className="flex h-12 w-12 -mt-5 items-center justify-center rounded-full bg-[#FF3F3F] text-white shadow-lg shadow-[#FF3F3F]/40 transition active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>

        {NAV_ITEMS.slice(2).map((item) => {
          const active = item.id === activeTab;

          return (
            <button
              key={item.id}
              onClick={() =>
                setActiveTab(item.auth && !isAuthenticated ? "login" : item.id)
              }
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 transition ${
                active ? "text-[#FF3F3F]" : "text-zinc-500"
              }`}
            >
              {item.id === "profile" && isAuthenticated && currentUser ? (
                <div className="relative">
                  <img
                    src={getAvatarUrl(currentUser.name, currentUser.avatar)}
                    alt={currentUser.name}
                    onError={(e) => handleAvatarError(e, currentUser.name)}
                    className={`
              h-6 w-6 rounded-full object-cover transition
              ${
                active
                  ? "ring-2 ring-[#FF3F3F] ring-offset-2 ring-offset-[#121214]"
                  : "ring-1 ring-white/10"
              }
            `}
                  />

                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#121214] bg-emerald-400" />
                </div>
              ) : (
                (() => {
                  const Icon = item.icon;
                  return <Icon className="h-5 w-5" />;
                })()
              )}

              <span className="text-[9px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
