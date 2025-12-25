'use client';

import { useState, useEffect } from 'react';
import { Claim } from '@/entities/claim/types';
import { API_CONFIG } from '@/shared/constants';

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLAIMS}`,
          {
            headers: {
              'Cache-Control': `max-age=${API_CONFIG.CACHE_DURATION}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClaims(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch claims');
        console.error('Error fetching claims:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return { claims, loading, error };
};
