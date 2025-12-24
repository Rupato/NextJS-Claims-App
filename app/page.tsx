import ClaimsDashboard from '../src/components/ClaimsDashboard';
import { Claim } from '../src/types';

// Fetch claims data on the server
async function getClaims(): Promise<Claim[]> {
  try {
    const response = await fetch('http://localhost:8001/api/v1/claims', {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching claims:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  const initialClaims = await getClaims();

  return <ClaimsDashboard initialClaims={initialClaims} />;
}
