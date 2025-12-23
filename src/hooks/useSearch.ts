import { useState, useEffect, useMemo } from 'react';
import { Claim } from '../types/claims';

export const useSearch = (claims: Claim[], delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce the search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, debouncedSearchTerm]);

  // Filter claims based on search term
  const filteredClaims = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return claims;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();

    return claims.filter((claim) =>
      claim.number.toLowerCase().includes(searchLower) ||
      claim.holder.toLowerCase().includes(searchLower) ||
      claim.policyNumber.toLowerCase().includes(searchLower)
    );
  }, [claims, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredClaims,
    isSearching,
  };
};
