'use client';

import { useState, useEffect } from 'react';
import { Claim } from '../types';

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // Add cache control for better performance
        const response = await fetch('http://localhost:8001/api/v1/claims', {
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
          },
        });

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
