import { Search, PlusCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSearchTerm } from "../store/uiSlice";

import DesktopNavbar from "./header/DesktopNavbar";
import UserProfileIndicator from "./header/UserProfileIndicator";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreatePost: () => void;
  onLogoutSimulate: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  openCreatePost,
  onLogoutSimulate,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { searchTerm } = useAppSelector((s) => s.ui);
  const unreadMessagesCount = useAppSelector((s) =>
    s.conversations.conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-[#242428] shadow-md select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab("landing")}
          >
            <div className="text-[#FF3F3F] font-black text-xl tracking-tighter uppercase font-display select-none flex items-center gap-1.5">
              <img src="/name.png" alt="Logo" className="w-36 h-7" />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-550">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="header-search-input"
                type="text"
                placeholder="Search sofas, math tuition, local contractors..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#1a1a1e] border border-[#2d2d34] text-zinc-100 rounded-lg placeholder-zinc-550 focus:outline-[#FF3F3F]/30 focus:border-[#FF3F3F] focus:bg-[#202025] transition"
              />
            </div>
          </div>

          <DesktopNavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadMessagesCount={unreadMessagesCount}
            isAuthenticated={isAuthenticated}
          />

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                id="header-create-post-btn"
                onClick={openCreatePost}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black bg-[#FF3F3F] hover:bg-[#E53535] text-white rounded-lg transition cursor-pointer font-display tracking-widest uppercase"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Need</span>
              </button>
            )}

            <UserProfileIndicator
              setActiveTab={setActiveTab}
              onLogoutSimulate={onLogoutSimulate}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
