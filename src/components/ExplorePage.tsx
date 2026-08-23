import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SlidersHorizontal, X, LogIn, Compass } from "lucide-react";

import CategoryFilterRow from "./feed/CategoryFilterRow";
import PostGridCard from "./explore/PostGridCard";
import PostDetailView from "./explore/PostDetailView";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Post } from "../types";
import { deletePost, fetchPosts, fetchPostsPage } from "../store/postsSlice";
import ExploreSearch from "./explore/ExploreSearch";
import { handleHideMobileBottomNav } from "../store/uiSlice";

function SkeletonCard() {
  return (
    <div className="theme-explore-skeleton overflow-hidden rounded-xl border animate-pulse">
      <div className="theme-explore-skeleton-block h-36" />
      <div className="p-3 space-y-2">
        <div className="theme-explore-skeleton-block h-3 w-3/4 rounded-full" />
        <div className="theme-explore-skeleton-block h-3 w-1/2 rounded-full opacity-80" />
        <div className="flex gap-2 items-center mt-2">
          <div className="theme-explore-skeleton-block h-6 w-6 rounded-full" />
          <div className="theme-explore-skeleton-block h-2.5 w-20 rounded-full opacity-80" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((s: any) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Refs hold the live values so the observer closure never goes stale
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);

  // Sentinel div ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Support opening a specific post from external navigation (e.g. map click)
  useEffect(() => {
    const state = location.state as { openPostId?: string } | null;
    if (state?.openPostId && posts.length) {
      const p = posts.find(
        (p) => p._id === state.openPostId || p.id === state.openPostId,
      );
      if (p) setSelectedPost(p);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, posts]);

  // Stop skeleton once posts land in Redux (from this component or App.tsx)
  useEffect(() => {
    if (posts.length >= 0) setLoading(false);
  }, [posts.length]);

  // Kick off initial fetch — thunk's condition guard prevents duplicate calls
  useEffect(() => {
    loadingMoreRef.current = true; // block observer until initial load settles
    dispatch(fetchPosts())
      .then((action: any) => {
        if (action?.payload?.hasMore === false) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      })
      .finally(() => {
        loadingMoreRef.current = false;
        if (posts.length > 0) setLoading(false);
      });
  }, []);

  // Load next page — reads from refs so the observer closure is never stale
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const action = (await dispatch(fetchPostsPage(nextPage))) as any;
      if (action?.payload?.hasMore === false) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
      pageRef.current = nextPage;
      setPage(nextPage);
    } catch {
      // keep current page so the user can scroll back up and retry naturally
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [dispatch]);

  // Attach IntersectionObserver to the sentinel div
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        if (!hasMoreRef.current) {
          obs.disconnect();
          return;
        }
        loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

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
        matchesCategory = post.responsesCount >= 8;
      } else if (selectedCategory === "Nearby") {
        matchesCategory = post.address.includes("Sector 62");
      } else if (selectedCategory === "Premium") {
        matchesCategory = post.budget !== "Negotiable";
      }
    }
    return matchesSearch && matchesCategory;
  });

  const handleSelectPost = (post: Post) => {
    dispatch(handleHideMobileBottomNav(true));
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    dispatch(handleHideMobileBottomNav(false));
    setSelectedPost(null);
  };

  const handleResponseSubmit = (postId: string) => {
    handleClosePost();

    dispatch(deletePost(postId));
  };

  // ── Render post detail inline ──
  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        onBack={handleClosePost}
        onViewProfile={() => {
          navigate(`/profile/${selectedPost.author.id}`);
        }}
        onResponseSubmit={handleResponseSubmit}
      />
    );
  }

  // ── Render grid ──
  return (
    <div className="theme-page-shell mx-auto w-full max-w-7xl space-y-6 pt-3 lg:pt-4">
      {/* Guest notice */}
      {!isAuthenticated && (
        <div className="flex items-center gap-3 border-b border-zinc-800/70 pb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF3F3F]/10">
            <Compass className="h-4 w-4 text-[#FF3F3F]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200">
              Browsing as guest
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-600">
              Sign in to offer help or message posters.
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF3F3F] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#e53535]"
          >
            <LogIn className="h-3 w-3" />
            Sign in
          </button>
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-4">
        <ExploreSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <CategoryFilterRow
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          resultCount={filteredPosts.length}
        />
      </div>

      {/* Feed */}
      {loading ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex min-h-90 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">
            <SlidersHorizontal className="h-5 w-5 text-zinc-600" />
          </div>

          <p className="text-sm font-semibold text-zinc-300">
            No matching requirements
          </p>

          <p className="mt-1.5 max-w-xs text-[11px] text-zinc-600">
            Try changing your search or selecting another category.
          </p>

          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full border border-zinc-800 px-3 py-1.5 text-[10px] font-semibold text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPosts.map((post) => (
            <PostGridCard
              key={post.id}
              post={post}
              onSelect={() => handleSelectPost(post)}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll */}
      <div ref={sentinelRef} className="h-px" />

      {loadingMore && (
        <div className="flex justify-center py-5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-[#FF3F3F]" />
        </div>
      )}

      {/* End */}
      {!hasMore && !loading && filteredPosts.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-3">
          <div className="h-px w-12 bg-zinc-800" />

          <p className="text-[10px] text-zinc-700">
            You've seen all requirements
          </p>

          <div className="h-px w-12 bg-zinc-800" />
        </div>
      )}
    </div>
  );
}
