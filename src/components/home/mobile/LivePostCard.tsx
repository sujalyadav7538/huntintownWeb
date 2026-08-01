import {
  ArrowRight,
  Clock3,
  IndianRupee,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { Post } from "@/src/types";

interface LivePostCardProps {
  post: Post;
}

export default function LivePostCard({ post }: LivePostCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#252529] bg-[#111113] shadow-lg">
      {/* Top */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="h-3.5 w-3.5 text-[#FF3F3F]" />
            <span>{post.address || "Nearby"}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock3 className="h-3.5 w-3.5" />
            <span>5m ago</span>
          </div>
        </div>

        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-white">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
            {post.description}
          </p>
        </div>

        {post.budget && (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#FF3F3F]/10 px-3 py-1 text-sm font-semibold text-[#FF3F3F]">
            <IndianRupee className="h-3.5 w-3.5" />
            {post.budget}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="border-t border-[#242428] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800">
              <User className="h-5 w-5 text-zinc-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {post.author?.name || "Anonymous"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-[#FF3F3F] px-4 py-2 text-sm font-semibold text-white">
            View
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
