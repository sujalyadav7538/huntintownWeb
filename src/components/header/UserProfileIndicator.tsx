"use client";

import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { getAvatarUrl, handleAvatarError } from '../../utils';

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
        <img
          src={getAvatarUrl(currentUser.name, currentUser.avatar)}
          alt={currentUser.name}
          className="w-8.5 h-8.5 rounded-full object-cover border-2 border-[#FF3F3F]/40 hover:border-[#FF3F3F] transition bg-[#18181b]"
          onError={(e) => handleAvatarError(e, currentUser.name)}
          referrerPolicy="no-referrer"
        />
        <div className="hidden xl:block">
          <p className="text-xs font-bold text-zinc-100 leading-tight flex items-center gap-1">
            {currentUser.name}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" title="Online" />
          </p>
          <p className="text-[10px] text-zinc-400 capitalize">{currentUser.location}</p>
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
