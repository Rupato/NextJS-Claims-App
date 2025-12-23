'use client';

import { useMemo } from 'react';
import { Claim, FormattedClaim } from '../types/claims';
import { formatCurrency } from '../utils/formatters';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const useFormattedClaims = (claims: Claim[]): FormattedClaim[] => {
  return useMemo(() => {
    return claims.map((claim) => {
      const claimAmount = parseFloat(claim.amount);
      const processingFee = parseFloat(claim.processingFee);
      const totalAmount = claimAmount + processingFee;

      return {
        ...claim,
        formattedClaimAmount: formatCurrency(claim.amount),
        formattedProcessingFee: formatCurrency(claim.processingFee),
        formattedTotalAmount: formatCurrency(totalAmount.toString()),
        formattedIncidentDate: formatDistanceToNow(
          parseISO(claim.incidentDate),
          { addSuffix: true }
        ),
        formattedCreatedDate: formatDistanceToNow(parseISO(claim.createdAt), {
          addSuffix: true,
        }),
      };
    });
  }, [claims]);
};
