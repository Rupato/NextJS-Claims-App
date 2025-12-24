import { QueryClient } from '@tanstack/react-query';

// Create a client with sensible defaults for claims management
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus for claims data (user preference)
      refetchOnWindowFocus: false,
      // Refetch on reconnect to ensure fresh data
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Don't retry mutations that are expected to fail (like validation errors)
      retryDelay: 1000,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  claims: ['claims'] as const,
  claim: (id: string) => ['claims', id] as const,
  claimStats: ['claims', 'stats'] as const,
} as const;

// Mutation keys for optimistic updates
export const mutationKeys = {
  createClaim: ['createClaim'] as const,
  updateClaim: ['updateClaim'] as const,
  deleteClaim: ['deleteClaim'] as const,
} as const;
