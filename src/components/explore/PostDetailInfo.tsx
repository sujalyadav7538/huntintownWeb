import {
  MapPin,
  Clock,
  IndianRupee,
  Users,
  CalendarDays,
  HelpCircle,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Post } from "../../types";
import { getPostExpiryLabel } from "../../utils";

interface Props {
  post: Post;
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-zinc-500">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
        <p className="text-sm text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

export default function PostDetailInfo({ post }: Props) {
  const timeLabel = getPostExpiryLabel(post.expiresAt);
  const hasContact = post.contactMethods && Object.values(post.contactMethods).some(Boolean);

  return (
    <>
      {/* Description */}
      <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Description
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Meta grid */}
      <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetaRow icon={<MapPin className="w-4 h-4" />} label="Location" value={post.address ?? "—"} />
          {post.budget && (
            <MetaRow icon={<IndianRupee className="w-4 h-4" />} label="Budget" value={`₹${post.budget}`} />
          )}
          {post.timeline && (
            <MetaRow icon={<Clock className="w-4 h-4" />} label="Timeline" value={post.timeline} />
          )}
          <MetaRow icon={<CalendarDays className="w-4 h-4" />} label="Expiry" value={timeLabel} />
          <MetaRow icon={<Users className="w-4 h-4" />} label="Responses" value={String(post.responsesCount)} />
        </div>
      </div>

      {/* Contact methods */}
      {hasContact && (
        <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Preferred Contact
          </h2>
          <div className="flex gap-2 flex-wrap">
            {post.contactMethods.whatsApp && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-800/40 bg-green-950/30 px-3 py-1 text-xs text-green-400">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </span>
            )}
            {post.contactMethods.phone && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800/40 bg-blue-950/30 px-3 py-1 text-xs text-blue-400">
                <Phone className="w-3 h-3" /> Phone
              </span>
            )}
            {post.contactMethods.chat && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-800/40 bg-purple-950/30 px-3 py-1 text-xs text-purple-400">
                <MessageCircle className="w-3 h-3" /> In-app Chat
              </span>
            )}
          </div>
        </div>
      )}

      {/* Screening questions */}
      {post.questions && post.questions.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Screening Questions
          </h2>
          <ul className="space-y-2">
            {post.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <HelpCircle className="w-4 h-4 text-[#FF3F3F]/60 mt-0.5 shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extra images */}
      {post.images && post.images.length > 1 && (
        <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {post.images.slice(1).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${post.title} ${i + 2}`}
                className="h-28 w-full rounded-xl object-cover border border-zinc-800"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
