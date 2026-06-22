import { Search, PlusCircle, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSearchTerm } from "../store/uiSlice";
import { getAvatarUrl, handleAvatarError } from "../utils";

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
  const { isAuthenticated, currentUser } = useAppSelector((s) => s.auth);
  const { searchTerm } = useAppSelector((s) => s.ui);
  const unreadMessagesCount = useAppSelector((s) =>
    s.conversations.conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-[#242428] shadow-md select-none font-sans">

      {/* ── Mobile header (Instagram-style) — hidden on md+ ── */}
      <div className="md:hidden flex items-center justify-between px-4 h-14">
        {/* Left: avatar → profile */}
        <button
          onClick={() => setActiveTab(isAuthenticated ? 'profile' : 'login')}
          className="relative flex-shrink-0"
          aria-label="Profile"
        >
          {isAuthenticated ? (
            <>
              <img
                src={getAvatarUrl(currentUser.name, currentUser.avatar)}
                alt={currentUser.name}
                className={`w-8 h-8 rounded-full object-cover bg-zinc-800 transition
                  ${activeTab === 'profile'
                    ? 'ring-2 ring-[#FF3F3F] ring-offset-1 ring-offset-[#121214]'
                    : 'ring-1 ring-white/10'}`}
                onError={(e) => handleAvatarError(e, currentUser.name)}
                referrerPolicy="no-referrer"
              />
              {/* online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#121214]" />
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-400">?</span>
            </div>
          )}
        </button>

        {/* Center: logo */}
        <button onClick={() => setActiveTab('landing')} className="absolute left-1/2 -translate-x-1/2">
          <img src="/name.png" alt="HuntInTown" className="h-6 w-auto" />
        </button>

        {/* Right: chat icon with unread badge */}
        <button
          onClick={() => setActiveTab(isAuthenticated ? 'messaging' : 'login')}
          className="relative flex-shrink-0 p-1.5 text-zinc-400 hover:text-white transition"
          aria-label="Messages"
        >
          <MessageSquare className={`w-6 h-6 ${activeTab === 'messaging' ? 'text-[#FF3F3F]' : ''}`} />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF3F3F] text-[9px] font-black text-white flex items-center justify-center leading-none">
              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Desktop header — hidden on mobile ── */}
      <div className="hidden md:block">
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
      </div>

    </header>
  );
}
