"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DashboardHeaderProps {
  setActiveTab: (tab: string) => void;
}

export default function DashboardHeader({ setActiveTab }: DashboardHeaderProps) {
  return (
    <div className="bg-[#121214] border border-[#232327] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm font-sans">
      <div>
        <h2 className="text-lg font-black tracking-tight font-display uppercase text-zinc-100">Responses & Offers Dashboard</h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed font-normal">
          Monitor help requests, manage incoming service bids, review options, or delete listing coordinates.
        </p>
      </div>
      <button
        id="dashboard-browse-btn"
        onClick={() => setActiveTab('feed')}
        className="px-4 py-2 bg-[#FF3F3F] hover:bg-[#E53535] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
      >
        <span>Browse Requirements</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}
