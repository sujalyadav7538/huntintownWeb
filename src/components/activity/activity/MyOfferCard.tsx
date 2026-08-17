import { ActivityResponse } from "@/src/types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MyOfferCardProps {
  offer: ActivityResponse;
  expanded: boolean;
  onToggle: () => void;
}

export default function MyOfferCard({
  offer,
  expanded,
  onToggle,
}: MyOfferCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          My Offer
        </p>

        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[9px] font-semibold uppercase text-zinc-500">
          Submitted
        </span>
      </div>

      <div className="mt-3">
        <p className="text-[13px] leading-relaxed text-zinc-300">
          {offer.message}
        </p>
      </div>

      <p className="mt-3 font-mono text-[10px] text-zinc-700">
        {new Date(offer.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      {offer.answers?.length > 0 && (
        <div className="mt-4 border-t border-zinc-800/70 pt-3">
          <button
            onClick={onToggle}
            className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}

            {expanded
              ? "Hide Q&A"
              : `View ${offer.answers.length} Q&A answer${
                  offer.answers.length > 1 ? "s" : ""
                }`}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {offer.answers.map((answer, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-800/70 bg-[#111114] p-3"
                >
                  <p className="text-[10px] font-medium text-zinc-600">
                    {answer.question}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                    {answer.answer || "No answer provided"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
