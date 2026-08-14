export interface ContentItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  image: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  bookmarkId?: string;
  bookmarkedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface ApiSuccessResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

export interface ApiErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: string[];
}
