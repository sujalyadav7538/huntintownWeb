"use client";

import React from 'react';

interface DashboardStatsProps {
  openCount: number;
  fulfilledCount: number;
  helperSubmissions: number;
}

export default function DashboardStats({ openCount, fulfilledCount, helperSubmissions }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
      <div className="bg-[#121214] rounded-xl border border-[#232327] p-4 text-center">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">My Active Posts</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-black text-white font-display">{openCount}</span>
          <span className="text-[9px] text-[#FF3F3F] font-bold bg-red-950/40 border border-red-900 px-1.5 py-0.5 rounded uppercase font-mono">Live</span>
        </div>
      </div>
      
      <div className="bg-[#121214] rounded-xl border border-[#232327] p-4 text-center">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Tasks Fulfilled</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-black text-white font-display">{fulfilledCount}</span>
          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Done</span>
        </div>
      </div>

      <div className="bg-[#121214] rounded-xl border border-[#232327] p-4 text-center">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">My Active Bids</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-black text-white font-display">{helperSubmissions}</span>
          <span className="text-[9px] text-blue-400 font-bold bg-blue-950/40 border border-blue-900 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Interventions</span>
        </div>
      </div>
    </div>
  );
}
