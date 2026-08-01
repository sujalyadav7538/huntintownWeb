import { MapPin, SlidersHorizontal } from "lucide-react";
import { Post } from "@/src/types";
import HuntMap from "../../map/HuntMap";

interface MobileMapSectionProps {
  posts: Post[];
}

export default function MobileMapSection({ posts }: MobileMapSectionProps) {
  return (
    <section className="overflow-hidden  ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="text-lg font-bold text-white">Nearby Opportunities</p>

          <p className="text-xs text-zinc-500">
            {posts.length} active requirements around you
          </p>
        </div>

        {/* <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a30] bg-[#19191c]">
          <SlidersHorizontal className="h-4 w-4 text-zinc-300" />
        </button> */}
      </div>

      {/* Search */}
      {/* <div className="px-4 pb-3">
        <div className="flex items-center rounded-xl bg-[#1A1A1D] border border-[#2c2c31] px-3 h-11">
          <MapPin className="h-4 w-4 text-[#FF3F3F]" />

          <input
            placeholder="Search nearby..."
            className="ml-3 w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          />
        </div>
      </div> */}

      {/* Map */}
      <div className=" h-80  ">
        <HuntMap posts={posts} className="h-full rounded-2xl" />

        {/* Floating Info Card */}

        {/* <div className="absolute left-4 right-4 bottom-4 rounded-2xl bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500">LIVE MAP</p>

              <h3 className="mt-1 text-base font-bold text-zinc-900">
                {posts.length} Nearby Requests
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Tap any marker to view details
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF3F3F]">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
