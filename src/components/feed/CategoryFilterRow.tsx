"use client";

import React from 'react';
import { Flame, Zap, MapPin, Star, LayoutGrid, TrendingUp } from 'lucide-react';

interface CategoryFilterRowProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  resultCount: number;
}

const FILTER_TABS = [
  { label: 'All',      icon: LayoutGrid },
  { label: 'Urgent',   icon: Zap },
  { label: 'Trending', icon: TrendingUp },
  { label: 'Nearby',   icon: MapPin },
  { label: 'Premium',  icon: Star },
];

export default function CategoryFilterRow({
  selectedCategory,
  setSelectedCategory,
  resultCount
}: CategoryFilterRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
      {/* Scrollable pill filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1 min-w-0">
        {FILTER_TABS.map(({ label, icon: Icon }) => {
          const isActive = selectedCategory === label;
          return (
            <button
              key={label}
              id={`cat-filter-${label.toLowerCase()}`}
              onClick={() => setSelectedCategory(label)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-[#FF3F3F] text-white border-[#FF3F3F] shadow-md shadow-[#FF3F3F]/25'
                  : 'bg-[#111113] text-zinc-500 border-[#1e1e22] hover:border-[#2e2e34] hover:text-zinc-300 hover:bg-[#18181c]'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-zinc-600'}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#111113] border border-[#1e1e22] rounded-full text-[11px] text-zinc-500 font-medium whitespace-nowrap">
        <Flame className="w-3 h-3 text-[#FF3F3F]" />
        <span><span className="text-zinc-300 font-bold">{resultCount}</span> active</span>
      </div>
    </div>
  );
}
