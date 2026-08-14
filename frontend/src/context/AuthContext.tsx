'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, ContentItem, ApiSuccessResponse } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  bookmarkedIds: Set<string>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleBookmark: (contentId: string) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch bookmarks for authenticated user
  const refreshBookmarks = useCallback(async () => {
    try {
      const response = await api.get<ApiSuccessResponse<ContentItem[]>>('/bookmarks');
      const ids = new Set(response.data.data.map((item) => item.id));
      setBookmarkedIds(ids);
    } catch (err) {
      console.error('Failed to sync bookmarks:', err);
    }
  }, []);

  // Check stored authentication token on mount
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;
      const storedToken = localStorage.getItem('feed_auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.get<ApiSuccessResponse<{ user: User }>>('/auth/me');
          setUser(res.data.data.user);
          // Fetch user bookmarks after verifying token
          const bmRes = await api.get<ApiSuccessResponse<ContentItem[]>>('/bookmarks');
          const ids = new Set(bmRes.data.data.map((item) => item.id));
          setBookmarkedIds(ids);
        } catch (err) {
          console.warn('Stored token invalid or expired. Logging out.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('feed_auth_token');
          }
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    const res = await api.post<ApiSuccessResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });

    const { user: authUser, token: authToken } = res.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('feed_auth_token', authToken);
    }
    setToken(authToken);
    setUser(authUser);

    // Refresh bookmarks for logged in user
    try {
      const bmRes = await api.get<ApiSuccessResponse<ContentItem[]>>('/bookmarks');
      const ids = new Set(bmRes.data.data.map((item) => item.id));
      setBookmarkedIds(ids);
    } catch (e) {
      console.error('Error fetching initial bookmarks', e);
    }
  };

  // Register handler
  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<ApiSuccessResponse<{ user: User; token: string }>>('/auth/register', {
      name,
      email,
      password,
    });

    const { user: authUser, token: authToken } = res.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('feed_auth_token', authToken);
    }
    setToken(authToken);
    setUser(authUser);
    setBookmarkedIds(new Set());
  };

  // Logout handler
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('feed_auth_token');
    }
    setToken(null);
    setUser(null);
    setBookmarkedIds(new Set());
  };

  // Toggle bookmark (add/remove)
  const toggleBookmark = async (contentId: string): Promise<boolean> => {
    if (!token || !user) {
      throw new Error('Authentication required to bookmark content.');
    }

    const isBookmarked = bookmarkedIds.has(contentId);

    try {
      if (isBookmarked) {
        await api.delete(`/feed/${contentId}/bookmark`);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(contentId);
          return next;
        });
        return false;
      } else {
        await api.post(`/feed/${contentId}/bookmark`);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.add(contentId);
          return next;
        });
        return true;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        bookmarkedIds,
        login,
        register,
        logout,
        toggleBookmark,
        refreshBookmarks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
