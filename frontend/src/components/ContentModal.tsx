'use client';

import React from 'react';
import { X, ExternalLink, Bookmark } from 'lucide-react';
import { ContentItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ContentModalProps {
  item: ContentItem | null;
  onClose: () => void;
  openAuthModal: (mode: 'login') => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  item,
  onClose,
  openAuthModal,
  onToast,
}) => {
  const { isAuthenticated, bookmarkedIds, toggleBookmark } = useAuth();

  if (!item) return null;

  const isBookmarked = bookmarkedIds.has(item.id);

  // Estimate read time
  const wordCount = (item.description || '').split(' ').length + 200;
  const readTime = Math.max(1, Math.ceil(wordCount / 100));

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      onToast('info', 'Sign in required', 'Please sign in to save stories.');
      openAuthModal('login');
      return;
    }
    try {
      const nowBookmarked = await toggleBookmark(item.id);
      if (nowBookmarked) {
        onToast('success', 'Saved to Library', `Saved "${item.title.slice(0, 30)}..."`);
      } else {
        onToast('info', 'Removed from Library', 'Story removed from your library.');
      }
    } catch (err: any) {
      onToast('error', 'Action failed', err.message || 'Could not update bookmark.');
    }
  };

  const formattedDate = new Date(item.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 text-gray-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Author Header */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs">
              {item.source.charAt(0)}
            </div>
            <div>
              <span className="font-semibold text-gray-900 block leading-tight">{item.source}</span>
              <span className="text-xs text-gray-500">{formattedDate} · {readTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight font-serif">
            {item.title}
          </h1>

          {/* Cover Image */}
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Body Text */}
          <div className="text-gray-700 text-base sm:text-lg leading-relaxed font-sans space-y-4">
            <p>{item.description}</p>
            <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-200">
              This publication was curated from {item.source}. Click below to visit the official article.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleBookmarkToggle}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                isBookmarked
                  ? 'bg-gray-100 text-gray-900 border border-gray-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black text-black' : ''}`} />
              <span>{isBookmarked ? 'Saved to library' : 'Save to library'}</span>
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium bg-black hover:bg-gray-800 text-white transition-colors"
            >
              <span>Read full story</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
