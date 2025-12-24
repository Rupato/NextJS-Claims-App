'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ClaimDetailsModal } from '@/features/claims-management/components/ClaimDetailsModal';
import { Claim } from '@/entities/claim/types';

const ClaimDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const {
    data: claim,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['claim', id],
    queryFn: async (): Promise<Claim> => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/claims/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch claim');
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading claim</div>;
  }

  if (!claim) {
    return <div>Claim not found</div>;
  }

  // Format the claim for the modal
  const claimAmount = parseFloat(claim.amount);
  const processingFee = parseFloat(claim.processingFee);
  const totalAmount = claimAmount + processingFee;

  const formattedClaim = {
    ...claim,
    formattedClaimAmount: `$${claimAmount.toLocaleString()}`,
    formattedProcessingFee: `$${processingFee.toLocaleString()}`,
    formattedTotalAmount: `$${totalAmount.toLocaleString()}`,
    formattedIncidentDate: new Date(claim.incidentDate).toLocaleDateString(),
    formattedCreatedDate: new Date(claim.createdAt).toLocaleDateString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              Detailed view of claim {claim.number}
            </p>
          </div>
          <div className="p-6">
            <ClaimDetailsModal
              claim={formattedClaim}
              isOpen={true}
              onClose={() => window.history.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
