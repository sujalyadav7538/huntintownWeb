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
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-all duration-300
        ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[9999]
        h-dvh w-[84%] max-w-[360px]
        bg-[#111113]
        border-l border-[#232327]
        shadow-2xl
        flex flex-col
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 shrink-0 px-5 border-b border-[#232327] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Menu</h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Profile */}
          <button
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#FF3F3F]" />
              <span className="text-white font-medium">Profile</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
          {/* Chat */}
          <button
            onClick={() => {
              navigate("/messaging");
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-zinc-400" />
              <span className="text-white font-medium">Chat</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
          {/* Explore */}
          <button
            onClick={() => {
              navigate("/explore");
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-zinc-400" />
              <span className="text-white font-medium">Explore</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
          {/* Activity */}
          <button
            onClick={() => {
              navigate("/activity");
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-zinc-400" />
              <span className="text-white font-medium">Activity</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
          {/* Responses */}
          <button
            onClick={() => {
              navigate("/responses");
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-5 h-5 text-zinc-400" />
              <span className="text-white font-medium">Responses</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>{" "}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-[#232327] bg-[#111113]">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3
            bg-red-500/10 border border-red-500/20
            text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
