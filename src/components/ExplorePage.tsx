import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, X, LogIn, Compass } from "lucide-react";

import CategoryFilterRow from "./feed/CategoryFilterRow";
import PostGridCard from "./explore/PostGridCard";
import PostDetailView from "./explore/PostDetailView";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Post } from "../types";
import { fetchPosts } from "../store/postsSlice";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#0e0e10] overflow-hidden animate-pulse">
      <div className="h-36 bg-zinc-900" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-3/4 rounded-full bg-zinc-800" />
        <div className="h-3 w-1/2 rounded-full bg-zinc-800/70" />
        <div className="flex gap-2 items-center mt-2">
          <div className="h-6 w-6 rounded-full bg-zinc-800" />
          <div className="h-2.5 w-20 rounded-full bg-zinc-800/70" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAppSelector((s: any) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Support opening a specific post from external navigation (e.g. map click)
  useEffect(() => {
    const state = location.state as { openPostId?: string } | null;
    if (state?.openPostId && posts.length) {
      const p = posts.find(
        (p) => p._id === state.openPostId || p.id === state.openPostId,
      );
      if (p) setSelectedPost(p);
      // Clear the state so refreshing doesn't re-open it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, posts]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPosts()).finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory !== "All") {
      if (selectedCategory === "Urgent") {
        matchesCategory =
          post.title.toLowerCase().includes("urgent") ||
          post.description.toLowerCase().includes("urgent");
      } else if (selectedCategory === "Trending") {
        matchesCategory = post.offersCount >= 8;
      } else if (selectedCategory === "Nearby") {
        matchesCategory = post.address.includes("Sector 62");
      } else if (selectedCategory === "Premium") {
        matchesCategory = post.budget !== "Negotiable";
      }
    }
    return matchesSearch && matchesCategory;
  });

  // ── Render post detail inline ──
  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onViewProfile={() => {}}
        onNavigateToLogin={() => navigate("/login")}
      />
    );
  }

  // ── Render grid ──
  return (
    <div className="space-y-5">
      {/* Guest banner */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0e0e10] via-[#131316] to-[#0e0e10] border border-[#1e1e22] px-5 py-4 flex items-center gap-4">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#FF3F3F]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-zinc-100 leading-tight">
              Browse Requirements
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Viewing as guest.{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#FF3F3F] hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>{" "}
              to offer help or message posters.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F] hover:bg-[#e53535] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <LogIn className="w-3 h-3" /> Sign In
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative group max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-[#FF3F3F] transition-colors" />
        </span>
        <input
          type="text"
          placeholder="Search requirements, skills, people…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-[13px] pl-10 pr-10 py-2.5 bg-[#0e0e10] border border-[#1e1e22] text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 focus:bg-[#111113] transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <CategoryFilterRow
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resultCount={filteredPosts.length}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF3F3F]/8 border border-[#FF3F3F]/15 flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-6 h-6 text-[#FF3F3F]/60" />
          </div>
          <p className="text-[15px] font-semibold text-zinc-300">
            No matching requirements
          </p>
          <p className="text-[12px] text-zinc-600 mt-1.5 max-w-xs">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredPosts.map((post) => (
            <PostGridCard
              key={post.id}
              post={post}
              onSelect={() => setSelectedPost(post)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
