'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { FeedCard } from '@/components/FeedCard';
import { ContentModal } from '@/components/ContentModal';
import { AuthModal } from '@/components/AuthModal';
import { Pagination } from '@/components/Pagination';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { ContentItem, PaginationInfo, ApiSuccessResponse } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw, AlertCircle, Bookmark, BookOpen, TrendingUp } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks'>('feed');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Toasts & Modals
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Feed or Bookmarks from Backend API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'feed') {
        const response = await api.get<ApiSuccessResponse<ContentItem[]>>(
          `/feed?page=${page}&limit=${limit}&sort=${sort}`
        );
        setItems(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        if (!isAuthenticated) {
          setAuthModal({ isOpen: true, mode: 'login' });
          setActiveTab('feed');
          return;
        }
        const response = await api.get<ApiSuccessResponse<ContentItem[]>>('/bookmarks');
        setItems(response.data.data);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch content. Please check database connection.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, sort, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract unique sources for category filter tabs
  const availableCategories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.source)));
  }, [items]);

  const handleTabChange = (tab: 'feed' | 'bookmarks') => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Filter items by category and search input
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.source.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onToast={addToast}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container Layout: Feed Left, Sidebar Right */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed Column */}
          <main className="lg:col-span-8">
            {/* Header Category Tabs */}
            <CategoryFilter
              categories={availableCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Loading State */}
            {loading ? (
              <SkeletonLoader />
            ) : error ? (
              /* Error State */
              <div className="my-12 p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Unable to load stories</h3>
                  <p className="text-xs text-gray-500">{error}</p>
                </div>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              /* Empty State */
              <div className="my-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-500">
                  {activeTab === 'bookmarks' ? <Bookmark className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {activeTab === 'bookmarks' ? 'No saved stories yet' : 'No stories found'}
                </h3>
                <p className="text-xs text-gray-500">
                  {activeTab === 'bookmarks'
                    ? 'Save stories by clicking the bookmark icon on any story.'
                    : 'Try clearing your search terms or filter selections.'}
                </p>
              </div>
            ) : (
              /* Article Feed List */
              <div>
                <div className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <FeedCard
                      key={item.id}
                      item={item}
                      onSelect={(selected) => setSelectedItem(selected)}
                      openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
                      onToast={addToast}
                      onBookmarkToggleSuccess={() => {
                        if (activeTab === 'bookmarks') {
                          fetchData();
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {activeTab === 'feed' && pagination && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                )}
              </div>
            )}
          </main>

          {/* Medium Right Sidebar Panel */}
          <aside className="hidden lg:block lg:col-span-4 pl-6 border-l border-gray-100 space-y-8">
            {/* Staff Picks Widget */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-gray-700" />
                <span>Top Topics</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'MongoDB', 'Node.js', 'Next.js', 'Architecture', 'TypeScript', 'Web Dev'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchQuery(topic)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Info Box */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Writing on Medium</h4>
              <p className="text-sm font-bold text-gray-900">Discover & read great engineering stories</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect your account to save bookmarks and discover curated tech posts.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Detail Preview Modal */}
      <ContentModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onToast={addToast}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onToast={addToast}
      />
    </div>
  );
}
