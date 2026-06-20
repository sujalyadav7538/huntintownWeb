"use client";

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { Post } from '../types';

import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import PublishedListingItem from './dashboard/PublishedListingItem';
import ProposalsSidebar from './dashboard/ProposalsSidebar';
import OffersReceivedModal from './dashboard/OffersReceivedModal';

interface DashboardProps {
  onUpdateStatus: (postId: string, status: 'open' | 'fulfilled' | 'cancelled') => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ onUpdateStatus, onDeleteListing, onSelectPost, setActiveTab }: DashboardProps) {
  const posts = useAppSelector((s) => s.posts);
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  const [offersPost, setOffersPost] = useState<Post | null>(null);

  // Listings authored by current user
  const myPosts = posts.filter(p => p.author.id === currentUser.id);

  // Listings where current user replied or commented
  const postsUserCommentedOn = posts.filter(p =>
    p.author.id !== currentUser.id &&
    p.comments.some(c => c.author.id === currentUser.id)
  );

  // Stats calculation
  const openCount = myPosts.filter(p => p.status === 'open').length;
  const fulfilledCount = myPosts.filter(p => p.status === 'fulfilled').length;
  const helperSubmissions = postsUserCommentedOn.length;

  return (
    <div className="space-y-6 text-zinc-100">

      {/* Intro Visual Banner */}
      <DashboardHeader setActiveTab={setActiveTab} />

      {/* STATS ROW */}
      <DashboardStats
        openCount={openCount}
        fulfilledCount={fulfilledCount}
        helperSubmissions={helperSubmissions}
      />

      {/* MAIN PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left pane: published needs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0e0e10] rounded-xl border border-[#1e1e22] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1a1a1e] flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#FF3F3F]" />
                <span>My Published Requirements</span>
              </h3>
              <span className="text-[9px] font-bold bg-[#1a1a1e] border border-[#252529] text-zinc-400 px-2 py-0.5 rounded-full">
                {myPosts.length} posts
              </span>
            </div>

            {myPosts.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <p className="text-[12px] font-semibold text-zinc-400">No requirements published yet.</p>
                <p className="text-[11px] text-zinc-600 mt-1">Use "Post Requirement" to publish your first one.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#161619]">
                {myPosts.map(post => (
                  <PublishedListingItem
                    key={post.id}
                    post={post}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteListing={onDeleteListing}
                    onSelectPost={onSelectPost}
                    onViewOffers={(p) => setOffersPost(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: my submitted proposals (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ProposalsSidebar
            postsUserCommentedOn={postsUserCommentedOn}
            currentUser={currentUser}
            onSelectPost={onSelectPost}
          />
        </div>
      </div>

      {/* Offers received drawer */}
      {offersPost && (
        <OffersReceivedModal
          post={offersPost}
          onClose={() => setOffersPost(null)}
        />
      )}
    </div>
  );
}
