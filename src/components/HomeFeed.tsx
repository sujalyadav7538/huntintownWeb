import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { apiFetch } from "../lib/api";
import { User } from "../types";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSearchTerm } from "../store/uiSlice";

import PostCard from "./feed/PostCard";
import PostDetailModal from "./feed/PostDetailModal";
import FeedSidebar from "./feed/FeedSidebar";
import MobileSearchBar from "./feed/MobileSearchBar";
import CategoryFilterRow from "./feed/CategoryFilterRow";
import UserProfileModal from "./profile/UserProfileModal";

interface HomeFeedProps {
  onAddComment: (
    postId: string,
    commentContent: string,
    isOffer: boolean,
    offerBudget?: string,
    offerDuration?: string,
    answers?: { question: string; answer: string }[],
  ) => void;

  onToggleResolve: (postId: string) => void;

  onInitiateChat: (participant: User) => void;
}

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#0e0e10] rounded-2xl border border-[#1e1e22] p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1a1a1e]" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-28 bg-[#1a1a1e] rounded-full" />
          <div className="h-2.5 w-20 bg-[#161619] rounded-full" />
        </div>
      </div>
      <div className="h-4 w-3/4 bg-[#1a1a1e] rounded-full" />
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-[#161619] rounded-full" />
        <div className="h-2.5 w-5/6 bg-[#161619] rounded-full" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-16 bg-[#161619] rounded-full" />
        <div className="h-5 w-20 bg-[#161619] rounded-full" />
      </div>
    </div>
  );
}

export default function HomeFeed({
  onAddComment,
  onToggleResolve,
  onInitiateChat,
}: HomeFeedProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const searchTerm = useAppSelector((s) => s.ui.searchTerm);

  const handleSetSearchTerm = (val: string) => dispatch(setSearchTerm(val));

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [focusedPostId, setFocusedPostId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const handleViewProfile = (author: User) => {
    setViewingUser(author);
  };

  // FETCH POSTS FROM DB
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiFetch(`/api/posts/getAvailablePosts`,{
          method:"GET",
          headers:{
            "Authorization": `${localStorage.getItem("access_token")}`
          }
        });
        const data = await res.json();
        const fetched: any[] = (data.posts || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          author: {
            ...p.author,
            avatar: p.author?.avatar || "",
            role: p.author?.role || "",
            rating: p.author?.rating ?? null,
            reputation: p.author?.reputation ?? null,
          },
        }));
        setPosts(fetched);

        const openPostId = (location.state as any)?.openPostId;
        if (openPostId) {
          const match = fetched.find(
            (p) => p._id === openPostId || p.id === openPostId,
          );
          if (match) setFocusedPostId(match._id || match.id);
          navigate("/feed", { replace: true, state: {} });
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // FILTERING LOGIC
  const filteredPosts = posts.filter((post) => {
    const isOwnPost =
      post.author?.id === currentUser?.id ||
      post.author?._id === currentUser?.id;
    if (isOwnPost) return false;

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
        matchesCategory = post.location.includes("Sector 62");
      } else if (selectedCategory === "Premium") {
        matchesCategory = post.budget !== "Negotiable";
      }
    }

    return matchesSearch && matchesCategory;
  });

  const focusedPost = posts.find(
    (p) => p.id === focusedPostId || p._id === focusedPostId,
  );

  return (
    <div className="space-y-5">
      {/* ── Desktop search bar ── */}
      <div className="hidden md:block">
        <div className="relative group max-w-xl">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-[#FF3F3F] transition-colors duration-200" />
          </span>
          <input
            type="text"
            placeholder="Search requirements, skills, people…"
            value={searchTerm}
            onChange={(e) => handleSetSearchTerm(e.target.value)}
            className="w-full text-[13px] pl-10 pr-10 py-2.5 bg-[#0e0e10] border border-[#1e1e22] text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 focus:bg-[#111113] transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => handleSetSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile search ── */}
      <MobileSearchBar
        searchTerm={searchTerm}
        setSearchTerm={handleSetSearchTerm}
      />

      {/* ── Filters ── */}
      <CategoryFilterRow
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resultCount={filteredPosts.length}
      />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-3 order-last lg:order-first">
          <FeedSidebar />
        </aside>

        {/* Feed column */}
        <div className="lg:col-span-9 space-y-3 order-first lg:order-last">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FF3F3F]/8 border border-[#FF3F3F]/15 flex items-center justify-center mb-4">
                <SlidersHorizontal className="w-6 h-6 text-[#FF3F3F]/60" />
              </div>
              <p className="text-[15px] font-semibold text-zinc-300">
                No matching requirements
              </p>
              <p className="text-[12px] text-zinc-600 mt-1.5 max-w-xs">
                Try a different filter or search term — or be the first to post!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onSelect={() => setFocusedPostId(post.id)}
                onInitiateChat={onInitiateChat}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Detail modal ── */}
      {focusedPost && (
        <PostDetailModal
          focusedPost={focusedPost}
          currentUser={currentUser}
          onClose={() => setFocusedPostId(null)}
          onAddComment={onAddComment}
          onViewProfile={handleViewProfile}
        />
      )}

      {/* ── User profile modal ── */}
      {viewingUser && (
        <UserProfileModal
          user={viewingUser}
          currentUserId={currentUser?.id ?? ''}
          onClose={() => setViewingUser(null)}
          onMessage={(u) => {
            setViewingUser(null);
            onInitiateChat(u);
          }}
        />
      )}
    </div>
  );
}
