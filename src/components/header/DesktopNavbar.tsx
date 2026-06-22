"use client";

import React from 'react';
import { Home, Activity, Inbox } from 'lucide-react';

interface DesktopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  isAuthenticated: boolean;
}

export default function DesktopNavbar({ activeTab, setActiveTab, unreadMessagesCount, isAuthenticated }: DesktopNavbarProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1 font-sans">
      <button
        id="nav-landing-btn"
        onClick={() => setActiveTab('landing')}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
          activeTab === 'landing' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>
      <button
        id="nav-feed-btn"
        onClick={() => setActiveTab('explore')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
          activeTab === 'explore' || activeTab === 'feed' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
        }`}
      >
        Explore
      </button>
      {isAuthenticated && (
        <button
          id="nav-activity-btn"
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
            activeTab === 'activity' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>My Activity</span>
        </button>
      )}
      {isAuthenticated && (
        <button
          id="nav-responses-btn"
          onClick={() => setActiveTab('responses')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
            activeTab === 'responses' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Responses</span>
        </button>
      )}
      {/* <button
        id="nav-dashboard-btn"
        onClick={() => setActiveTab('dashboard')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
          activeTab === 'dashboard' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
        }`}
      >
        Bids & Offers
      </button> */}
      {/* <button
        id="nav-chat-btn"
        onClick={() => setActiveTab('messaging')}
        className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
          activeTab === 'messaging' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
        }`}
      >
        <span>Chats</span>
        {unreadMessagesCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#FF3F3F] text-[9px] font-bold text-white font-mono">
            {unreadMessagesCount}
          </span>
        )}
      </button> */}
      {/* <button
        id="nav-profile-btn"
        onClick={() => setActiveTab('profile')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
          activeTab === 'profile' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
        }`}
      >
        Profile
      </button> */}
      {/* {!isAuthenticated && (
        <button
          id="nav-login-btn"
          onClick={() => setActiveTab('login')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
            activeTab === 'login' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Sign In
        </button>
      )} */}
    </nav>
  );
}
