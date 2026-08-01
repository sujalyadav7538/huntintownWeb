import { ArrowRight } from "lucide-react";
import { Post } from "@/src/types";
import LivePostCard from "./LivePostCard";

interface MobileLivePostsProps {
  posts: Post[];
  onViewAll: () => void;
}

export default function MobileLivePosts({
  posts,
  onViewAll,
}: MobileLivePostsProps) {
  return (
    <section className="mt-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-white">Live Requirements</h2>

          <p className="text-xs text-zinc-500">
            Fresh opportunities from your area
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-[#FF3F3F]"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Horizontal Feed */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {posts.map((post) => (
          <div key={post._id} className="snap-center shrink-0 w-[88%]">
            <LivePostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
