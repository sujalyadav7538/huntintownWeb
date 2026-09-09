import { useAppSelector } from "@/src/store/hooks";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import {
  User,
  LogOut,
  ChevronRight,
  Activity,
  Inbox,
  Send,
  Compass,
  Sun,
  Moon,
  LogIn,
  Search,
  BookOpen,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function SidePanel({
  open,
  onClose,
  theme,
  onToggleTheme,
  onLogout,
}: SidePanelProps) {
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(`/profile/${currentUser?.id || currentUser?._id}`);
    } else {
      navigate("/login");
    }

    onClose();
  };

  const navigationItems = [
    {
      label: "Explore",
      icon: Search,
      path: "/explore",
      authRequired: false,
    },
    {
      label: "Chat",
      icon: Send,
      path: "/messaging",
      authRequired: true,
    },
    {
      label: "Activity",
      icon: Clock3,
      path: "activity",
      authRequired: true,
    },
    {
      label: "Responses",
      icon: Inbox,
      path: "/responses",
      authRequired: true,
    },
    {
      label: "About",
      icon: BookOpen,
      path: "about",
      authRequired: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-9998 block lg:hidden backdrop-blur transition-opacity duration-300 ${open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[9999] flex lg:hidden h-dvh w-[78%] max-w-[300px] flex-col border-r border-white/[0.07] bg-[#111113] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Profile / Sign In */}
        <div className="shrink-0 border-b border-white/[0.07] px-5 py-6">
          <button
            type="button"
            onClick={handleProfileClick}
            className="flex w-full items-center gap-3 text-left"
          >
            {isAuthenticated && currentUser ? (
              <div className="relative shrink-0">
                <img
                  src={getAvatarUrl(currentUser.name, currentUser.avatar)}
                  alt={currentUser.name}
                  onError={(e) => handleAvatarError(e, currentUser.name)}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
                />

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111113] bg-emerald-400" />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                <LogIn className="h-5 w-5 text-zinc-500" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {isAuthenticated
                  ? currentUser?.name || "Your Profile"
                  : "Sign In"}
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-500">
                {isAuthenticated ? "View profile" : "Sign in to your account"}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigationItems
            .filter((item) => !item.authRequired || isAuthenticated)
            .map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="group flex w-full items-center gap-4 rounded-lg px-3 py-3.5 text-left transition hover:bg-white/[0.05]"
                >
                  <Icon className="h-[19px] w-[19px] text-zinc-500 transition group-hover:text-[#FF3F3F]" />

                  <span className="text-sm font-medium text-zinc-300 transition group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              );
            })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 px-4 py-3">
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />

          {isAuthenticated && <LogoutButton onLogout={onLogout} />}
        </div>
      </aside>
    </>
  );
}

function ThemeToggleButton({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="group flex w-full items-center justify-between rounded-lg px-2  py-2 transition hover:bg-white/5"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="text-sm font-medium text-zinc-200">Theme</p>
          <p className="text-[11px] text-zinc-500">
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-zinc-300">
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-[#FF3F3F]" />
          ) : (
            <Moon className="h-4 w-4 text-[#FF3F3F]" />
          )}
        </div>
      </div>

      <div
        className={`relative h-6 w-11 rounded-full border transition-colors duration-200 ${
          theme === "dark"
            ? "border-[#FF3F3F]/40 bg-[#FF3F3F]/20"
            : "border-zinc-700 bg-zinc-800"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all duration-200 ${
            theme === "dark" ? "left-5.5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-white/5"
    >
      <span className="text-sm font-medium text-zinc-300 transition group-hover:text-white">
        Logout
      </span>
      <LogOut className="h-5 w-5 text-zinc-500 transition group-hover:text-[#FF3F3F]" />
    </button>
  );
}
