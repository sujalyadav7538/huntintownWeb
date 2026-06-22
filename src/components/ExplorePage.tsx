import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, LogIn, Compass } from 'lucide-react';
import { apiFetch } from '../lib/api';

import PostCard from './feed/PostCard';
import PostDetailModal from './feed/PostDetailModal';
import CategoryFilterRow from './feed/CategoryFilterRow';

// Stub user to satisfy PostCard / PostDetailModal typings in read-only mode
const GUEST_USER = {
  id: '__guest__',
  name: 'Guest',
  email: '',
  avatar: '',
  role: '',
  rating: null,
  reputation: null,
};

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

export default function ExplorePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [focusedPostId, setFocusedPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiFetch('/api/posts/getAvailablePosts', { method: 'GET' });
        const data = await res.json();
        const fetched: any[] = (data.posts || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          author: {
            ...p.author,
            avatar: p.author?.avatar || '',
            role: p.author?.role || '',
            rating: p.author?.rating ?? null,
            reputation: p.author?.reputation ?? null,
          },
        }));
        setPosts(fetched);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Urgent') {
        matchesCategory =
          post.title.toLowerCase().includes('urgent') ||
          post.description.toLowerCase().includes('urgent');
      } else if (selectedCategory === 'Trending') {
        matchesCategory = post.offersCount >= 8;
      } else if (selectedCategory === 'Nearby') {
        matchesCategory = post.location.includes('Sector 62');
      } else if (selectedCategory === 'Premium') {
        matchesCategory = post.budget !== 'Negotiable';
      }
    }

    return matchesSearch && matchesCategory;
  });

  const focusedPost = posts.find(
    (p) => p.id === focusedPostId || p._id === focusedPostId,
  );

  return (
    <div className="space-y-5">
      {/* ── Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0e0e10] via-[#131316] to-[#0e0e10] border border-[#1e1e22] px-5 py-5 flex items-center gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 flex items-center justify-center">
          <Compass className="w-5 h-5 text-[#FF3F3F]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-bold text-zinc-100 leading-tight">Browse Requirements</h1>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            You're viewing as a guest.{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#FF3F3F] hover:underline font-semibold cursor-pointer"
            >
              Sign in
            </button>{' '}
            to offer help or message posters.
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF3F3F] hover:bg-[#e53535] text-white text-[12px] font-bold rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="relative group max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-[#FF3F3F] transition-colors duration-200" />
        </span>
        <input
          type="text"
          placeholder="Search requirements, skills, people…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-[13px] pl-10 pr-10 py-2.5 bg-[#0e0e10] border border-[#1e1e22] text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 focus:bg-[#111113] transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Category filters ── */}
      <CategoryFilterRow
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resultCount={filteredPosts.length}
      />

      {/* ── Posts grid ── */}
      <div className="space-y-3">
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
            <p className="text-[15px] font-semibold text-zinc-300">No matching requirements</p>
            <p className="text-[12px] text-zinc-600 mt-1.5 max-w-xs">
              Try a different filter or search term.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={GUEST_USER as any}
              onSelect={() => setFocusedPostId(post.id)}
              onInitiateChat={() => navigate('/login')}
              readOnly
            />
          ))
        )}
      </div>

      {/* ── Detail modal (read-only) ── */}
      {focusedPost && (
        <PostDetailModal
          focusedPost={focusedPost}
          currentUser={GUEST_USER as any}
          onClose={() => setFocusedPostId(null)}
          onAddComment={() => {}}
          readOnly
        />
      )}
    </div>
  );
}
