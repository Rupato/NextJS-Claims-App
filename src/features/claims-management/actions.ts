'use server';

import { Claim } from '@/entities/claim/types';

// Server Action for creating a new claim
export async function createClaim(formData: FormData) {
  try {
    const claimData = {
      holder: formData.get('holder') as string,
      policyNumber: formData.get('policyNumber') as string,
      insuredName: formData.get('insuredName') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      processingFee: parseFloat(formData.get('processingFee') as string),
      incidentDate: formData.get('incidentDate') as string,
    };

    // Call the API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api-mock:8001';
    const response = await fetch(`${apiUrl}/api/v1/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimData),
    });

    if (!response.ok) {
      throw new Error('Failed to create claim');
    }

    const newClaim: Claim = await response.json();

    return { success: true, claim: newClaim };
  } catch (error) {
    console.error('Error creating claim:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
