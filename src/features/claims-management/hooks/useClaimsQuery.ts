import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, mutationKeys } from '@/shared/lib/queryClient';
import { Claim } from '@/entities/claim/types';

// Mock API functions (replace with real API calls)
const fetchClaims = async (): Promise<Claim[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return mock data - replace with real API call
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/v1/claims`);
  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }
  return response.json();
};

const createClaim = async (
  claimData: Omit<Claim, 'id' | 'number' | 'createdAt' | 'status'>
): Promise<Claim> => {
  // Call the real API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const requestBody = {
    amount: parseFloat(claimData.amount),
    holder: claimData.holder,
    policyNumber: claimData.policyNumber,
    insuredName: claimData.insuredName,
    description: claimData.description,
    processingFee: parseFloat(claimData.processingFee),
    incidentDate: claimData.incidentDate,
  };

  const response = await fetch(`${apiUrl}/api/v1/claims`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ CLIENT: API error response:', errorText);
    throw new Error(
      `Failed to create claim: ${response.status} ${response.statusText}`
    );
  }

  // JSON Server might return empty body for POST, so handle that case
  const responseText = await response.text();

  if (!responseText.trim()) {
    // Create a claim object since the API didn't return one
    const newClaim: Claim = {
      id: Date.now().toString(), // Temporary ID
      number: `CL-${Date.now()}`, // Temporary number
      amount: claimData.amount,
      holder: claimData.holder,
      policyNumber: claimData.policyNumber,
      insuredName: claimData.insuredName,
      description: claimData.description,
      processingFee: claimData.processingFee,
      incidentDate: claimData.incidentDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return newClaim;
  }

  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('❌ CLIENT: Failed to parse response JSON:', error);
    // Fallback: create claim object locally
    const newClaim: Claim = {
      id: Date.now().toString(),
      number: `CL-${Date.now()}`,
      amount: claimData.amount,
      holder: claimData.holder,
      policyNumber: claimData.policyNumber,
      insuredName: claimData.insuredName,
      description: claimData.description,
      processingFee: claimData.processingFee,
      incidentDate: claimData.incidentDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return newClaim;
  }
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
  // Mock delete - in real API, would delete the claim with id
};

// Query Hook - Fetch all claims with enhanced error handling
export const useClaimsQuery = (initialData?: Claim[]) => {
  return useQuery({
    queryKey: queryKeys.claims,
    queryFn: fetchClaims,
    initialData,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Cache for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Retry on failure with exponential backoff
    retry: (failureCount, error: unknown) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
          const updated = oldClaims ? [...oldClaims, newClaim] : [newClaim];
          return updated;
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.claims });
    },
    onError: (error) => {
      console.error('❌ Failed to create claim:', error);
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

// Query Hook - Fetch policy by number for smart form behavior
export const usePolicyQuery = (
  policyNumber: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: queryKeys.policy(policyNumber),
    queryFn: async (): Promise<{
      id: number;
      number: string;
      holder: string;
      status: string;
      finalAmount: string;
    } | null> => {
      if (!policyNumber || !/^TL-\d{5}$/.test(policyNumber)) {
        return null;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/api/v1/policies?number=${encodeURIComponent(policyNumber)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch policy');
      }

      const policies = await response.json();
      // Json-server returns array, so find the matching policy
      const policy = Array.isArray(policies)
        ? policies.find((p: { number: string }) => p.number === policyNumber)
        : null;

      return policy || null; // Return policy or null if not found
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry on 404
  });
};

// Hook for manual cache invalidation (useful for refresh buttons)
export const useInvalidateClaims = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.claims });
  };
};
