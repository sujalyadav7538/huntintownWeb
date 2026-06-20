"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface ContactMethods {
  whatsApp: boolean;
  phone: boolean;
  chat: boolean;
}

interface ContactMethodsToggleProps {
  contactMethods: ContactMethods;
  setContactMethods: React.Dispatch<React.SetStateAction<ContactMethods>>;
}

export default function ContactMethodsToggle({ contactMethods, setContactMethods }: ContactMethodsToggleProps) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Contact Method</label>
      <div className="grid grid-cols-3 gap-2 font-sans">
        <button
          type="button"
          onClick={() => setContactMethods(prev => ({ ...prev, whatsApp: !prev.whatsApp }))}
          className={`flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
            contactMethods.whatsApp 
              ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400 font-extrabold shadow-sm' 
              : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'
          }`}
        >
          {contactMethods.whatsApp && <Check className="w-3 h-3" />}
          <span>WhatsApp</span>
        </button>
        <button
          type="button"
          onClick={() => setContactMethods(prev => ({ ...prev, phone: !prev.phone }))}
          className={`flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
            contactMethods.phone 
              ? 'bg-blue-900/30 border-blue-500/50 text-blue-400 font-extrabold shadow-sm' 
              : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'
          }`}
        >
          {contactMethods.phone && <Check className="w-3 h-3" />}
          <span>Phone Call</span>
        </button>
        <button
          type="button"
          onClick={() => setContactMethods(prev => ({ ...prev, chat: !prev.chat }))}
          className={`flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
            contactMethods.chat 
              ? 'bg-red-900/30 border-[#FF3F3F]/50 text-[#FF3F3F] font-extrabold shadow-sm' 
              : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'
          }`}
        >
          {contactMethods.chat && <Check className="w-3 h-3 text-[#FF3F3F]" />}
          <span>In-App Chat</span>
        </button>
      </div>
    </div>
  );
}
