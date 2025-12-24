'use client';

import { useMemo } from 'react';
import { Claim, FormattedClaim } from '../types';
import {
  formatCurrency,
  formatIncidentDate,
  formatCreatedDate,
} from '../utils';

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
        formattedIncidentDate: formatIncidentDate(claim.incidentDate),
        formattedCreatedDate: formatCreatedDate(claim.createdAt),
      };
    });
  }, [claims]);
};
