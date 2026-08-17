import { useAppSelector } from "@/src/store/hooks";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import {
  X,
  User,
  Settings,
  LogOut,
  ChevronRight,
  LayoutGrid,
  Activity,
  Inbox,
  MessageSquare,
  Plus,
  Sparkles,
  Send,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;

  onLogout: () => void;
}

export default function SidePanel({
  open,
  onClose,

  onLogout,
}: SidePanelProps) {
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[9999] flex h-dvh w-[78%] max-w-[300px] flex-col border-r border-white/[0.07] bg-[#111113] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile */}
        <div className="shrink-0 border-b border-white/[0.07] px-5 py-6">
          <button
            type="button"
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
            className="flex w-full items-center gap-3 text-left"
          >
            {currentUser ? (
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
                <User className="h-5 w-5 text-zinc-500" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {currentUser?.name || "Your Profile"}
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-500">View profile</p>
            </div>

            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {[
            {
              label: "Explore",
              icon: Compass,
              path: "/explore",
            },
            {
              label: "Chat",
              icon: Send,
              path: "/messaging",
            },
            {
              label: "Activity",
              icon: Activity,
              path: "/activity",
            },
            {
              label: "Responses",
              icon: Inbox,
              path: "/responses",
            },
          ].map((item) => {
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

        {/* Logout */}
        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-4 rounded-lg px-3 py-3.5 text-left transition hover:bg-red-500/[0.07]"
          >
            <LogOut className="h-[19px] w-[19px] text-zinc-500 transition group-hover:text-red-400" />

            <span className="text-sm font-medium text-zinc-400 transition hover:text-red-400">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
