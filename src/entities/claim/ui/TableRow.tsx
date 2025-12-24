import React from 'react';
import { FormattedClaim } from '@/entities/claim/types';
import { getStatusColorClasses } from '@/shared/utils';

interface TableRowProps {
  claim: FormattedClaim;
  onRowSelect?: (claim: FormattedClaim) => void;
  isSelected?: boolean;
  columnVisibility?: Record<string, boolean>;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ claim, onRowSelect, isSelected = false, columnVisibility }, ref) => {
    const handleClick = () => {
      onRowSelect?.(claim);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRowSelect?.(claim);
      }
    };

    const rowClassName = `
    hover:bg-gray-50 cursor-pointer transition-colors duration-150
    ${isSelected ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''}
    ${onRowSelect ? 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset' : ''}
  `.trim();

    // Define cells with their corresponding keys
    const cells = [
      {
        key: 'number',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            role="cell"
          >
            {claim.number}
          </td>
        ),
      },
      {
        key: 'status',
        content: (
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
        ),
      },
      {
        key: 'holder',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            role="cell"
          >
            {claim.holder}
          </td>
        ),
      },
      {
        key: 'policyNumber',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            role="cell"
          >
            {claim.policyNumber}
          </td>
        ),
      },
      {
        key: 'formattedClaimAmount',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            role="cell"
          >
            {claim.formattedClaimAmount}
          </td>
        ),
      },
      {
        key: 'formattedProcessingFee',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            role="cell"
          >
            {claim.formattedProcessingFee}
          </td>
        ),
      },
      {
        key: 'formattedTotalAmount',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            role="cell"
          >
            {claim.formattedTotalAmount}
          </td>
        ),
      },
      {
        key: 'formattedIncidentDate',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            role="cell"
          >
            <time dateTime={claim.incidentDate}>
              {claim.formattedIncidentDate}
            </time>
          </td>
        ),
      },
      {
        key: 'formattedCreatedDate',
        content: (
          <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            role="cell"
          >
            <time dateTime={claim.createdAt}>{claim.formattedCreatedDate}</time>
          </td>
        ),
      },
    ];

    // Filter cells based on column visibility
    const visibleCells = cells.filter((cell) => {
      return columnVisibility ? columnVisibility[cell.key] !== false : true;
    });

    return (
      <tr
        ref={ref}
        className={rowClassName}
        role="row"
        tabIndex={onRowSelect ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`Claim ${claim.number} - ${claim.holder}`}
      >
        {visibleCells.map((cell) => (
          <React.Fragment key={cell.key}>{cell.content}</React.Fragment>
        ))}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';
