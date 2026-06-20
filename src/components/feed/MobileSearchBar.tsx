"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

interface MobileSearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function MobileSearchBar({ searchTerm, setSearchTerm }: MobileSearchBarProps) {
  return (
    <div className="block md:hidden">
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-[#FF3F3F] transition-colors duration-200" />
        </span>
        <input
          id="mobile-feed-search-input"
          type="text"
          placeholder="Search requirements, skills, people…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-[13px] pl-10 pr-10 py-2.5 bg-[#0e0e10] border border-[#1e1e22] text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 focus:bg-[#111113] transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
