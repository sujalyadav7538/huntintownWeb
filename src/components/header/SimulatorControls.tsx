"use client";

import React from 'react';
import { Globe, Smartphone } from 'lucide-react';

interface SimulatorControlsProps {
  isMobileSimulated: boolean;
  setIsMobileSimulated: (val: boolean) => void;
}

export default function SimulatorControls({ isMobileSimulated, setIsMobileSimulated }: SimulatorControlsProps) {
  return (
    <div className="flex items-center gap-4 font-mono">
      <div className="flex items-center gap-1 text-zinc-550 text-[10px] select-none font-bold uppercase tracking-wider">
        <span>Viewport:</span>
      </div>
      <button
        id="toggle-desktop-sim"
        onClick={() => setIsMobileSimulated(false)}
        className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold cursor-pointer transition ${
          !isMobileSimulated ? 'bg-[#FF3F3F]' : 'hover:bg-zinc-850 text-zinc-400'
        }`}
      >
        <Globe className="w-3 h-3 text-white" />
        <span className="text-white">Desktop</span>
      </button>
      <button
        id="toggle-mobile-sim"
        onClick={() => setIsMobileSimulated(true)}
        className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold cursor-pointer transition ${
          isMobileSimulated ? 'bg-[#FF3F3F]' : 'hover:bg-zinc-850 text-zinc-400'
        }`}
      >
        <Smartphone className="w-3 h-3 text-white" />
        <span className="text-white">Mobile Sim</span>
      </button>
    </div>
  );
}
