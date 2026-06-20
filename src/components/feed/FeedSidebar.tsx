import { Shield, Zap, Users, TrendingUp, ChevronRight } from 'lucide-react';

const STATS = [
  { label: 'Active Posts', value: '1.2k+', color: '#FF3F3F' },
  { label: 'Verified Users', value: '12k+', color: '#6366f1' },
  { label: 'Fulfilled Today', value: '48', color: '#10b981' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Post a requirement', desc: 'Describe what you need in under 2 minutes.' },
  { step: '02', title: 'Receive offers', desc: 'Locals with relevant skills respond fast.' },
  { step: '03', title: 'Connect & close', desc: 'Chat, negotiate, and get it done.' },
];

export default function FeedSidebar() {
  return (
    <div className="space-y-3">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {STATS.map(({ label, value, color }) => (
          <div key={label} className="bg-[#0e0e10] border border-[#1e1e22] rounded-xl p-3 text-center">
            <span className="block text-lg font-black tracking-tight" style={{ color }}>{value}</span>
            <span className="block text-[9px] text-zinc-500 font-medium mt-0.5 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-[#0e0e10] border border-[#1e1e22] rounded-xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#FF3F3F]" />
          <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">How it works</h3>
        </div>
        <div className="space-y-3">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F] text-[9px] font-black flex items-center justify-center">{step}</span>
              <div>
                <p className="text-[12px] font-semibold text-zinc-200 leading-snug">{title}</p>
                <p className="text-[11px] text-zinc-600 leading-relaxed mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-[#0e0e10] border border-[#1e1e22] rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Why HuntInTown</h3>
        </div>
        {[
          'Verified resident network',
          'Zero transaction fees',
          'Real-time matching',
          'Secure direct messaging',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      {/* Community avatars */}
      <div className="bg-[#0e0e10] border border-[#1e1e22] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Community</span>
          </div>
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=52',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=52',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=52',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=52',
            ].map((src, i) => (
              <img key={i} className="w-7 h-7 rounded-full border-2 border-[#0e0e10] object-cover" src={src} alt="" />
            ))}
            <div className="w-7 h-7 rounded-full bg-[#FF3F3F]/15 border-2 border-[#0e0e10] text-[8px] text-[#FF3F3F] flex items-center justify-center font-black">+12k</div>
          </div>
          <span className="text-[11px] text-zinc-500 leading-tight">Trusted residents across the city</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-between px-4 py-3 bg-[#FF3F3F]/8 hover:bg-[#FF3F3F]/14 border border-[#FF3F3F]/20 hover:border-[#FF3F3F]/35 rounded-xl transition-all duration-200 group cursor-pointer">
        <span className="text-[12px] font-semibold text-[#FF3F3F]">Post your requirement</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#FF3F3F] group-hover:translate-x-0.5 transition-transform" />
      </button>

    </div>
  );
}
