import { useState, useEffect, useMemo } from 'react';
import { Claim } from '../types/claims';

export const useSearch = (
  claims: Claim[],
  externalSearchTerm: string = '',
  delay: number = 300
) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(externalSearchTerm);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(externalSearchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [externalSearchTerm, delay]);

  // Filter claims based on search term
  const filteredClaims = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return claims;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();

    return claims.filter(
      (claim) =>
        claim.number.toLowerCase().includes(searchLower) ||
        claim.holder.toLowerCase().includes(searchLower) ||
        claim.policyNumber.toLowerCase().includes(searchLower)
    );
  }, [claims, debouncedSearchTerm]);

  // Show loading when search term has changed but debounced value hasn't caught up
  const isSearching = externalSearchTerm !== debouncedSearchTerm;

  return {
    filteredClaims,
    isSearching,
  };
};
