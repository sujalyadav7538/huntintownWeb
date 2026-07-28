import { MapPinned, Navigation, Activity } from "lucide-react";
import { Post } from "@/src/types";
import HuntMap from "./HuntMap";

interface MapSectionProps {
  posts: Post[];
}

export default function MapSection({ posts }: MapSectionProps) {
  return (
    <section className="">
      {/* Map */}
      <div className="overflow-hidden rounded-2xl">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232327] px-2 py-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF3F3F]/10 border border-[#FF3F3F]/20">
                <Activity className="w-5 h-5 text-[#FF3F3F]" />
              </div>

              <div>
                <h3 className="text-md font-semibold text-white">
                  Live Community Map
                </h3>

                <p className="text-sm text-zinc-500">
                  Discover nearby peoples.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">
                Live 
              </span>
            </div>
          </div>
        </div>

        <div className="h-[520px]">
          <HuntMap posts={posts} />
        </div>
      </div>
    </section>
  );
}
