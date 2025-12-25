import { ReactNode } from 'react';
import { SortOption, ViewMode } from '../types';

// ErrorBoundary types
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
  onError?: (error: Error, errorInfo?: React.ErrorInfo) => void;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface DefaultErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

// ViewModeTabs types
export interface ViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
}

// Providers types
export interface ProvidersProps {
  children: ReactNode;
}

// SortDropdown types
export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

// LoadingSkeleton types
export interface LoadingSkeletonProps {
  viewMode: ViewMode;
}

// SearchInput types
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
  placeholder?: string;
}
