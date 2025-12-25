import React from 'react';
import { FormattedClaim } from '../types';
import { getStatusColorClasses } from '@/shared/utils';

export interface CellConfig {
  key: keyof FormattedClaim | 'status';
  className: string;
  render: (claim: FormattedClaim) => React.ReactNode;
}

export const tableCellConfigs: CellConfig[] = [
  {
    key: 'number',
    className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
    render: (claim) => claim.number,
  },
  {
    key: 'status',
    className: 'px-6 py-4 whitespace-nowrap',
    render: (claim) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(
          claim.status
        )}`}
        aria-label={`Status: ${claim.status}`}
      >
        {claim.status}
      </span>
    ),
  },
  {
    key: 'holder',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    render: (claim) => claim.holder,
  },
  {
    key: 'policyNumber',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    render: (claim) => claim.policyNumber,
  },
  {
    key: 'formattedClaimAmount',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    render: (claim) => claim.formattedClaimAmount,
  },
  {
    key: 'formattedProcessingFee',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    render: (claim) => claim.formattedProcessingFee,
  },
  {
    key: 'formattedTotalAmount',
    className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
    render: (claim) => claim.formattedTotalAmount,
  },
  {
    key: 'formattedIncidentDate',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    render: (claim) => (
      <time dateTime={claim.incidentDate}>{claim.formattedIncidentDate}</time>
    ),
  },
  {
    key: 'formattedCreatedDate',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    render: (claim) => (
      <time dateTime={claim.createdAt}>{claim.formattedCreatedDate}</time>
    ),
  },
];
