import React from 'react';
import { FormattedClaim } from '../types/claims';
import { getStatusColorClasses } from '../utils/formatters';

interface TableRowProps {
  claim: FormattedClaim;
}

export const TableRow: React.FC<TableRowProps> = ({ claim }) => (
  <tr className="hover:bg-gray-50" role="row">
    <td
      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
      role="cell"
    >
      {claim.number}
    </td>
    <td className="px-6 py-4 whitespace-nowrap" role="cell">
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(
          claim.status
        )}`}
        aria-label={`Status: ${claim.status}`}
      >
        {claim.status}
      </span>
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
      role="cell"
    >
      {claim.holder}
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
      role="cell"
    >
      {claim.policyNumber}
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
      role="cell"
    >
      {claim.formattedClaimAmount}
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
      role="cell"
    >
      {claim.formattedProcessingFee}
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
      role="cell"
    >
      {claim.formattedTotalAmount}
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
      role="cell"
    >
      <time dateTime={claim.incidentDate}>{claim.formattedIncidentDate}</time>
    </td>
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
      role="cell"
    >
      <time dateTime={claim.createdAt}>{claim.formattedCreatedDate}</time>
    </td>
  </tr>
);
