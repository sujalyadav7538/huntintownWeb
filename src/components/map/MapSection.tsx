import { Post } from "@/src/types";
import HuntMap from "./HuntMap";

interface MapSectionProps {
  posts: Post[];
}

export default function MapSection({ posts }: MapSectionProps) {
  return (
    <section className="space-y-8">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-[#FF3F3F]/30 bg-[#FF3F3F]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF3F3F]">
            Live Community Map
          </span>

          <h2 className="text-3xl font-black text-white">
            Discover Opportunities Around You
          </h2>

          <p className="max-w-2xl text-sm leading-7 text-zinc-400">
            Browse nearby requirements, discover trusted helpers, and
            collaborate with people in your community through the live
            interactive map.
          </p>
        </div>

        <div className="flex gap-4">
          <QuickStat title="Live Posts" value={posts.length.toString()} />

          <QuickStat title="Radius" value="Nearby" />
        </div>
      </div>

      {/* Map */}

      <HuntMap posts={posts} />
    </section>
  );
}

function QuickStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#111113] px-5 py-3">
      <div className="text-2xl font-black text-white">{value}</div>

      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </div>
    </div>
  );
}
