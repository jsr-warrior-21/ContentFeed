'use client';

import React from 'react';
import { Bookmark, LogIn, UserPlus, LogOut, Search, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  activeTab: 'feed' | 'bookmarks';
  setActiveTab: (tab: 'feed' | 'bookmarks') => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  onToast: (type: 'info', title: string, message?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  onToast,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, isAuthenticated, logout, bookmarkedIds } = useAuth();

  const handleBookmarksClick = () => {
    if (!isAuthenticated) {
      onToast('info', 'Sign in required', 'Please log in to access your saved library.');
      openAuthModal('login');
    } else {
      setActiveTab('bookmarks');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Search Bar */}
          <div className="flex items-center space-x-6">
            <div
              onClick={() => setActiveTab('feed')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold font-serif text-lg">
                M
              </div>
              <span className="text-2xl font-black font-serif tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">
                Content Feed
              </span>
            </div>

            {/* Medium Search Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100/80 border border-transparent text-gray-900 text-xs placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
                activeTab === 'feed' ? 'text-black font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Home Feed</span>
            </button>

            <button
              onClick={handleBookmarksClick}
              className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
                activeTab === 'bookmarks' ? 'text-black font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
              {isAuthenticated && bookmarkedIds.size > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 font-semibold">
                  {bookmarkedIds.size}
                </span>
              )}
            </button>

            {/* Auth Buttons / Avatar */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-800 hidden md:inline">{user.name}</span>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs sm:text-sm font-medium text-gray-700 hover:text-black px-3 py-1.5 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="text-xs sm:text-sm font-medium bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
