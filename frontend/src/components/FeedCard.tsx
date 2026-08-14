'use client';

import React, { useState } from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';
import { ContentItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface FeedCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
  openAuthModal: (mode: 'login') => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onBookmarkToggleSuccess?: () => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  onSelect,
  openAuthModal,
  onToast,
  onBookmarkToggleSuccess,
}) => {
  const { isAuthenticated, bookmarkedIds, toggleBookmark } = useAuth();
  const [isBookmarking, setIsBookmarking] = useState(false);

  const isBookmarked = bookmarkedIds.has(item.id);

  // Estimate read time
  const wordCount = (item.description || '').split(' ').length + 200;
  const readTime = Math.max(1, Math.ceil(wordCount / 100));

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onToast('info', 'Sign in required', 'Please sign in to save stories.');
      openAuthModal('login');
      return;
    }

    try {
      setIsBookmarking(true);
      const nowBookmarked = await toggleBookmark(item.id);
      if (nowBookmarked) {
        onToast('success', 'Saved to Library', `Saved "${item.title.slice(0, 30)}..."`);
      } else {
        onToast('info', 'Removed from Library', 'Story removed from your library.');
      }
      if (onBookmarkToggleSuccess) {
        onBookmarkToggleSuccess();
      }
    } catch (err: any) {
      onToast('error', 'Action failed', err.message || 'Unable to update bookmark.');
    } finally {
      setIsBookmarking(false);
    }
  };

  const formattedDate = new Date(item.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      onClick={() => onSelect(item)}
      className="group cursor-pointer border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 transition-opacity hover:opacity-95"
    >
      {/* Top Author / Source Row */}
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
        <div className="w-5 h-5 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-[10px]">
          {item.source.charAt(0)}
        </div>
        <span className="font-semibold text-gray-900">{item.source}</span>
        <span>·</span>
        <span>{formattedDate}</span>
      </div>

      {/* Main Content Layout: Text Left, Thumbnail Right */}
      <div className="flex items-start justify-between gap-6 sm:gap-10">
        <div className="flex-1 space-y-1.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:underline leading-snug tracking-tight font-sans">
            {item.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-sans">
            {item.description}
          </p>

          {/* Bottom Action / Meta Row */}
          <div className="pt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-700 font-medium">
                {readTime} min read
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmarkClick}
                disabled={isBookmarking}
                title={isBookmarked ? 'Remove from library' : 'Save story'}
                className="text-gray-400 hover:text-black transition-colors p-1"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked ? 'fill-black text-black' : 'text-gray-500 hover:text-black'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Thumbnail Image */}
        <div className="w-28 sm:w-40 h-20 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/60">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      </div>
    </article>
  );
};
