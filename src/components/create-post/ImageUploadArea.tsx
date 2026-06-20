"use client";

import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function ImageUploadArea() {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">Add Images (Optional)</label>
      <div className="border border-dashed border-[#2b2b30] bg-[#0c0c0e] hover:bg-[#111114] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition">
        <UploadCloud className="w-6 h-6 text-zinc-500 mb-1" />
        <span className="text-[10px] text-zinc-400 font-bold font-sans">Upload Images Here</span>
        <span className="text-[8px] text-zinc-650 font-mono uppercase tracking-widest mt-0.5">Max size 5MB • PNG, JPG</span>
      </div>
    </div>
  );
}
