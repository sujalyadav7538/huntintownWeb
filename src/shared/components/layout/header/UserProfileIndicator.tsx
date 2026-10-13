
import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';
import UserAvatar from '@/src/shared/components/UserAvatar';

interface UserProfileIndicatorProps {
  setActiveTab: (tab: string) => void;
  onLogoutSimulate: () => void;
}

export default function UserProfileIndicator({
  setActiveTab,
  onLogoutSimulate,
}: UserProfileIndicatorProps) {
  const { isAuthenticated, currentUser } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center pl-3 border-l border-[#2e2e33]">
        <button
          id="header-signin-btn"
          onClick={() => setActiveTab('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition cursor-pointer uppercase tracking-wide"
        >
          <UserCircle className="w-4 h-4" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 pl-3 border-l border-[#2e2e33]">
      <button
        id="header-profile-avatar-btn"
        onClick={() => setActiveTab('profile')}
        className="flex items-center gap-2 cursor-pointer text-left focus:outline-hidden"
      >
        <UserAvatar
          name={currentUser.name}
          src={currentUser.avatar}
          className="w-8.5 h-8.5 rounded-full border-2 border-[#FF3F3F]/40 bg-[#18181b] transition hover:border-[#FF3F3F]"
          imageClassName="object-cover"
        />
        <div className="hidden xl:block">
          <p className="text-xs font-bold text-zinc-100 leading-tight flex items-center gap-1">
            {currentUser.name}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" title="Online" />
          </p>
          <p className="text-[10px] text-zinc-400 capitalize">{currentUser.address || ''}</p>
        </div>
      </button>

      <button
        id="logout-simulator-btn"
        onClick={onLogoutSimulate}
        title="Logout"
        className="p-1 px-1.5 text-zinc-450 hover:text-[#FF3F3F] hover:bg-zinc-800 rounded transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
