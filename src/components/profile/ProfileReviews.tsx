import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';
import { User } from '../../types';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface Review {
  id: string;
  author: { name: string; avatar: string; role: string };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

function generateMockReviews(user: User): Review[] {
  if ((user.completedRequests ?? 0) === 0 && (user.reputation ?? 0) < 100) return [];
  return [
    {
      id: '1',
      author: { name: 'Rohit Sharma', avatar: '', role: 'Home Owner' },
      rating: 5,
      comment:
        'Absolutely professional. Delivered the interior design layout well within schedule. Communication was clear and the 3D renders were stunning.',
      date: '2 weeks ago',
      helpful: 12,
    },
    {
      id: '2',
      author: { name: 'Anjali Verma', avatar: '', role: 'School Teacher' },
      rating: 5,
      comment:
        'Very trustworthy and responsive. Helped me redesign my living room on a tight budget. Will definitely work with again!',
      date: '1 month ago',
      helpful: 7,
    },
    {
      id: '3',
      author: { name: 'Vivek Malhotra', avatar: '', role: 'Property Owner' },
      rating: 4,
      comment:
        'Great work overall. Minor delay on final delivery but the quality was top-notch. Highly recommended for modular kitchen projects.',
      date: '2 months ago',
      helpful: 4,
    },
  ];
}

interface ProfileReviewsProps {
  user: User;
}

export default function ProfileReviews({ user }: ProfileReviewsProps) {
  const reviews = generateMockReviews(user);
  const [shown, setShown] = useState(2);

  if (reviews.length === 0) return null;

  const visibleReviews = reviews.slice(0, shown);

  return (
    <ProfileSectionCard
      title="Community Reviews"
      icon={MessageSquare}
      iconColor="text-[#FF3F3F]"
      accentColor="#FF3F3F"
      action={
        <span className="text-[11px] font-bold text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full">
          {reviews.length} reviews
        </span>
      }
    >
      <div className="flex flex-col divide-y divide-white/4">
        {visibleReviews.map((review, idx) => (
          <div key={review.id} className={`${idx > 0 ? 'pt-5' : ''} ${idx < visibleReviews.length - 1 ? 'pb-5' : ''}`}>
            <div className="flex items-start gap-3">
              <img
                src={getAvatarUrl(review.author.name, review.author.avatar)}
                alt={review.author.name}
                className="w-9 h-9 rounded-full object-cover bg-zinc-800 shrink-0 mt-0.5"
                onError={(e) => handleAvatarError(e, review.author.name)}
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div>
                    <span className="text-sm font-semibold text-white">{review.author.name}</span>
                    <span className="text-xs text-zinc-600 ml-2">{review.author.role}</span>
                  </div>
                  <span className="text-[11px] text-zinc-600 shrink-0">{review.date}</span>
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-700 fill-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{review.comment}</p>
                <button className="mt-2.5 flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > shown && (
        <button
          onClick={() => setShown((v) => v + 3)}
          className="mt-5 w-full py-2.5 rounded-xl border border-white/7 text-xs font-semibold text-zinc-400
            hover:text-white hover:border-white/15 hover:bg-white/4 transition-all"
        >
          Load more reviews
        </button>
      )}
    </ProfileSectionCard>
  );
}
