import ClaimsDashboard from '@/features/claims-management/components/ClaimsDashboard';
import { Claim } from '@/entities/claim/types';

// Fetch claims data on the server
async function getClaims(): Promise<Claim[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/claims`, {
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
