import { Search, X } from "lucide-react";

interface ExploreSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function ExploreSearch({
  searchTerm,
  setSearchTerm,
}: ExploreSearchProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search
        className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          searchTerm
            ? "text-[#FF3F3F]"
            : "text-zinc-600"
        }`}
      />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search requirements, skills, people..."
        className="
          h-10 w-full
          rounded-full
          border border-zinc-800
          bg-[#111113]
          pl-10 pr-10
          text-xs text-zinc-200
          placeholder:text-zinc-600
          outline-none
          transition-all
          focus:border-zinc-700
          focus:bg-[#141416]
          focus:ring-1
          focus:ring-[#FF3F3F]/10
        "
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          aria-label="Clear search"
          className="
            absolute right-3.5 top-1/2
            flex h-5 w-5
            -translate-y-1/2
            items-center justify-center
            rounded-full
            text-zinc-600
            transition
            hover:bg-white/5
            hover:text-zinc-300
          "
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}