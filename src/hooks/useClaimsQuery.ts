import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, mutationKeys } from '../lib/queryClient';
import { Claim } from '../types/claims';

// Mock API functions (replace with real API calls)
const fetchClaims = async (): Promise<Claim[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return mock data - replace with real API call
  const response = await fetch('http://localhost:8001/api/v1/claims');
  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }
  return response.json();
};

const createClaim = async (claimData: Omit<Claim, 'id'>): Promise<Claim> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock API response - replace with real API call
  const newClaim: Claim = {
    ...claimData,
    id: `claim-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  return newClaim;
};

const updateClaim = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Claim>;
}): Promise<Claim> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock API response - replace with real API call
  const updatedClaim: Claim = {
    id,
    ...data,
    updatedAt: new Date().toISOString(),
  } as Claim;

  return updatedClaim;
};

const deleteClaim = async (id: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock API response - replace with real API call
  console.log(`Deleted claim ${id}`);
};

// Query Hook - Fetch all claims
export const useClaimsQuery = () => {
  return useQuery({
    queryKey: queryKeys.claims,
    queryFn: fetchClaims,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Cache for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Retry on failure
    retry: 3,
    // Show loading state on background refetches
    refetchOnWindowFocus: false,
    // Enable background refetching
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
    refetchIntervalInBackground: true,
  });
};

// Mutation Hook - Create new claim
export const useCreateClaimMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClaim,
    mutationKey: mutationKeys.createClaim,
    onSuccess: (newClaim) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.claims,
        (oldClaims: Claim[] | undefined) => {
          return oldClaims ? [...oldClaims, newClaim] : [newClaim];
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.claims });
    },
    onError: (error) => {
      console.error('Failed to create claim:', error);
      // Could show a toast notification here
    },
  });
};

// Mutation Hook - Update claim
export const useUpdateClaimMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClaim,
    mutationKey: mutationKeys.updateClaim,
    onSuccess: (updatedClaim) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.claims,
        (oldClaims: Claim[] | undefined) => {
          return oldClaims?.map((claim) =>
            claim.id === updatedClaim.id ? updatedClaim : claim
          );
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.claims });
    },
    onError: (error) => {
      console.error('Failed to update claim:', error);
      // Could show a toast notification here
    },
  });
};

// Mutation Hook - Delete claim
export const useDeleteClaimMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClaim,
    mutationKey: mutationKeys.deleteClaim,
    onSuccess: (_, deletedId) => {
      // Optimistically remove from cache
      queryClient.setQueryData(
        queryKeys.claims,
        (oldClaims: Claim[] | undefined) => {
          return oldClaims?.filter((claim) => claim.id !== deletedId);
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.claims });
    },
    onError: (error) => {
      console.error('Failed to delete claim:', error);
      // Could show a toast notification here
    },
  });
};

// Hook for manual cache invalidation (useful for refresh buttons)
export const useInvalidateClaims = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.claims });
  };
};
