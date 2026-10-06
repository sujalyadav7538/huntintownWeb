import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SlidersHorizontal, LogIn, Compass, BowArrow } from "lucide-react";

import CategoryFilterRow from "@/src/features/explore/components/CategoryFilterRow";
import PostGridCard from "@/src/shared/components/post/PostGridCard";
import PostDetailView from "@/src/features/explore/components/PostDetailView";
import ExploreSearch from "@/src/features/explore/components/ExploreSearch";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { Post } from "@/src/shared/types";
import {
  deletePost,
  fetchPosts,
  fetchPostsPage,
  normalizePost,
} from "@/src/store/postsSlice";
import { handleHideMobileBottomNav } from "@/src/store/uiSlice";
import { useIsDesktop } from "@/src/shared/hooks/useBreakpoint";
import { useSeo } from "@/src/shared/hooks/useSeo";
import useDebounce from "@/src/shared/hooks/useDebounce";
import { apiFetch } from "@/src/shared/lib/api";

const SEARCH_PAGE_SIZE = 20;

type Coords = { lat: number; lng: number };

const getCurrentCoords = () =>
  new Promise<Coords | null>((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 },
    );
  });

/* ================================================================
   PAGE — state and data loading only.

   Everything visual lives in ExploreDesktop / ExploreMobile below.
================================================================ */

export default function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const initialSearchTerm = useAppSelector((s) => s.ui.searchTerm);

  const isDesktop = useIsDesktop();

  useSeo({
    title: "Explore Local Requirements",
    description:
      "Browse requirements posted by neighbours near you — from repairs and tutoring to design and events — and offer your help.",
    path: "/explore",
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const debouncedSearch = useDebounce(searchTerm.trim(), 400);
  const isSearchMode = debouncedSearch.length > 0 || selectedCategory !== "All";

  // Server-side search state (used whenever a search term or filter is active)
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchModeRef = useRef(isSearchMode);
  const searchPageRef = useRef(1);
  const searchHasMoreRef = useRef(false);
  const searchAbortRef = useRef<AbortController | null>(null);
  const coordsRef = useRef<Coords | null>(null);
  searchModeRef.current = isSearchMode;

  // Pagination state
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
      const target = posts.find((p) => p.id === state.openPostId);
      if (target) setSelectedPost(target);
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

  const fetchSearchPage = useCallback(
    async (page: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(SEARCH_PAGE_SIZE),
        filter: selectedCategory.toLowerCase(),
      });
      if (debouncedSearch) params.set("q", debouncedSearch);

      if (selectedCategory === "Nearby") {
        coordsRef.current ??= await getCurrentCoords();
        if (coordsRef.current) {
          params.set("lat", String(coordsRef.current.lat));
          params.set("lng", String(coordsRef.current.lng));
        }
      }

      const res = await apiFetch(`/api/posts/search?${params}`, { signal });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Search failed");
      return {
        posts: (data.posts ?? []).map(normalizePost) as Post[],
        hasMore: Boolean(data.hasMore),
      };
    },
    [debouncedSearch, selectedCategory],
  );

  // Run a fresh search whenever the debounced term or filter changes
  useEffect(() => {
    searchAbortRef.current?.abort();
    searchPageRef.current = 1;
    searchHasMoreRef.current = false;
    setSearchError("");

    if (!isSearchMode) {
      setSearchResults([]);
      setSearchHasMore(false);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    searchAbortRef.current = controller;
    setSearchLoading(true);

    fetchSearchPage(1, controller.signal)
      .then(({ posts: results, hasMore: more }) => {
        if (controller.signal.aborted) return;
        setSearchResults(results);
        searchHasMoreRef.current = more;
        setSearchHasMore(more);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setSearchResults([]);
        setSearchHasMore(false);
        setSearchError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearchLoading(false);
      });

    return () => controller.abort();
  }, [fetchSearchPage, isSearchMode]);

  // Load next page — reads from refs so the observer closure is never stale
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;

    if (searchModeRef.current) {
      if (!searchHasMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
      const nextPage = searchPageRef.current + 1;
      try {
        const { posts: results, hasMore: more } = await fetchSearchPage(
          nextPage,
          searchAbortRef.current?.signal,
        );
        setSearchResults((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...results.filter((p) => !seen.has(p.id))];
        });
        searchPageRef.current = nextPage;
        searchHasMoreRef.current = more;
        setSearchHasMore(more);
      } catch {
        // aborted or failed — the next intersection retries
      } finally {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
      return;
    }

    if (!hasMoreRef.current) return;
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
    } catch {
      // keep current page so the user can scroll back up and retry naturally
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [dispatch, fetchSearchPage]);

  // Attach IntersectionObserver to the sentinel div
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

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
    setSearchResults((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // Post detail takes over the whole screen on both breakpoints.
  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        onBack={handleClosePost}
        onViewProfile={() => {
          navigate(`/profile/${selectedPost.author?.id ?? selectedPost.author?._id}`);
        }}
        onResponseSubmit={handleResponseSubmit}
      />
    );
  }

  const viewProps: ExploreViewProps = {
    isAuthenticated,
    posts: isSearchMode ? searchResults : posts,
    loading: isSearchMode ? searchLoading : loading,
    loadingMore,
    hasMore: isSearchMode ? searchHasMore : hasMore,
    errorMessage: isSearchMode ? searchError : "",
    searchTerm,
    selectedCategory,
    sentinelRef,
    onSearchTermChange: setSearchTerm,
    onCategoryChange: setSelectedCategory,
    onSelectPost: handleSelectPost,
    onClearFilters: handleClearFilters,
    onSignIn: () => navigate("/login"),
  };

  // One view mounts at a time — see useBreakpoint for why this is not CSS.
  return isDesktop ? (
    <ExploreDesktop {...viewProps} />
  ) : (
    <ExploreMobile {...viewProps} />
  );
}

interface ExploreViewProps {
  isAuthenticated: boolean;
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  errorMessage: string;
  searchTerm: string;
  selectedCategory: string;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSelectPost: (post: Post) => void;
  onClearFilters: () => void;
  onSignIn: () => void;
}

/* ================================================================
   DESKTOP — wide multi-column board
================================================================ */

function ExploreDesktop({
  isAuthenticated,
  posts,
  loading,
  loadingMore,
  hasMore,
  errorMessage,
  searchTerm,
  selectedCategory,
  sentinelRef,
  onSearchTermChange,
  onCategoryChange,
  onSelectPost,
  onClearFilters,
  onSignIn,
}: ExploreViewProps) {
  return (
    <div className="theme-page-shell mx-auto w-full max-w-7xl space-y-6 pt-4">
      {/* The page's only h1 — the design has no visible heading here. */}
      <h1 className="sr-only">Explore local requirements near you</h1>

      {!isAuthenticated && <GuestNotice onSignIn={onSignIn} />}

      {/* Search and filters sit on one row — there is room for both */}
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <ExploreSearch
            searchTerm={searchTerm}
            setSearchTerm={onSearchTermChange}
          />
        </div>

        <span className="shrink-0 text-[10px] font-medium text-zinc-600">
          {posts.length} {posts.length === 1 ? "requirement" : "requirements"}
        </span>
      </div>

      <CategoryFilterRow
        selectedCategory={selectedCategory}
        setSelectedCategory={onCategoryChange}
        resultCount={posts.length}
      />

      {loading ? (
        <FeedSkeleton
          className="grid grid-cols-2 gap-x-5 gap-y-6 xl:grid-cols-4"
          count={8}
        />
      ) : posts.length === 0 ? (
        <EmptyFeed
          errorMessage={errorMessage}
          canClear={Boolean(searchTerm) || selectedCategory !== "All"}
          onClearFilters={onClearFilters}
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-4">
          {posts.map((post) => (
            <PostGridCard
              key={post.id ?? post._id}
              post={post}
              onSelect={() => onSelectPost(post)}
            />
          ))}
        </div>
      )}

      <FeedFooter
        sentinelRef={sentinelRef}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        hasPosts={posts.length > 0}
      />
    </div>
  );
}

/* ================================================================
   MOBILE — single column, search pinned under the header
================================================================ */

function ExploreMobile({
  isAuthenticated,
  posts,
  loading,
  loadingMore,
  hasMore,
  errorMessage,
  searchTerm,
  selectedCategory,
  sentinelRef,
  onSearchTermChange,
  onCategoryChange,
  onSelectPost,
  onClearFilters,
  onSignIn,
}: ExploreViewProps) {
  return (
    <div className="theme-page-shell mx-auto w-full space-y-4 pt-3">
      <h1 className="sr-only">Explore local requirements near you</h1>

      {!isAuthenticated && <GuestNotice compact onSignIn={onSignIn} />}

      {/* Stacked, and sticky so filtering stays reachable while scrolling */}
      <div className="theme-page-shell sticky top-0 z-10 space-y-3 pb-2">
        <ExploreSearch
          searchTerm={searchTerm}
          setSearchTerm={onSearchTermChange}
        />

        <CategoryFilterRow
          selectedCategory={selectedCategory}
          setSelectedCategory={onCategoryChange}
          resultCount={posts.length}
        />
      </div>

      {loading ? (
        <FeedSkeleton className="grid grid-cols-1 gap-3 sm:grid-cols-2" count={4} />
      ) : posts.length === 0 ? (
        <EmptyFeed
          errorMessage={errorMessage}
          canClear={Boolean(searchTerm) || selectedCategory !== "All"}
          onClearFilters={onClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {posts.map((post) => (
            <PostGridCard
              key={post.id ?? post._id}
              post={post}
              onSelect={() => onSelectPost(post)}
            />
          ))}
        </div>
      )}

      <FeedFooter
        sentinelRef={sentinelRef}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        hasPosts={posts.length > 0}
      />
    </div>
  );
}

/* ================================================================
   SHARED PIECES
================================================================ */

function GuestNotice({
  compact = false,
  onSignIn,
}: {
  compact?: boolean;
  onSignIn: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800/70 pb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF3F3F]/10">
        <BowArrow className="h-4 w-4 text-[#FF3F3F]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-zinc-200">Browsing as guest</p>

        {!compact && (
          <p className="mt-0.5 text-[10px] text-zinc-600">
            Sign in to offer help or message posters.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSignIn}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF3F3F] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#e53535]"
      >
        <LogIn className="h-3 w-3" />
        Sign in
      </button>
    </div>
  );
}

function EmptyFeed({
  errorMessage,
  canClear,
  onClearFilters,
}: {
  errorMessage?: string;
  canClear: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">
        <SlidersHorizontal className="h-5 w-5 text-zinc-600" />
      </div>

      <p className="text-sm font-semibold text-zinc-300">
        No matching requirements
      </p>

      <p className="mt-1.5 max-w-xs text-[11px] text-zinc-600">
        {errorMessage || "Try changing your search or selecting another category."}
      </p>

      {canClear && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-full border border-zinc-800 px-3 py-1.5 text-[10px] font-semibold text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function FeedSkeleton({
  className,
  count,
}: {
  className: string;
  count: number;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="theme-explore-skeleton overflow-hidden rounded-xl border animate-pulse">
      <div className="theme-explore-skeleton-block h-36" />

      <div className="space-y-2 p-3">
        <div className="theme-explore-skeleton-block h-3 w-3/4 rounded-full" />
        <div className="theme-explore-skeleton-block h-3 w-1/2 rounded-full opacity-80" />

        <div className="mt-2 flex items-center gap-2">
          <div className="theme-explore-skeleton-block h-6 w-6 rounded-full" />
          <div className="theme-explore-skeleton-block h-2.5 w-20 rounded-full opacity-80" />
        </div>
      </div>
    </div>
  );
}

function FeedFooter({
  sentinelRef,
  loading,
  loadingMore,
  hasMore,
  hasPosts,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  hasPosts: boolean;
}) {
  return (
    <>
      <div ref={sentinelRef} className="h-px" />

      {loadingMore && (
        <div className="flex justify-center py-5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-[#FF3F3F]" />
        </div>
      )}

      {!hasMore && !loading && hasPosts && (
        <div className="flex items-center justify-center gap-3 py-3">
          <div className="h-px w-12 bg-zinc-800" />

          <p className="text-[10px] text-zinc-700">
            You've seen all requirements
          </p>

          <div className="h-px w-12 bg-zinc-800" />
        </div>
      )}
    </>
  );
}
