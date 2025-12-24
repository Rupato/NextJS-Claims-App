import React from 'react';
import { SortOption } from '@/shared/types';

interface TableHeaderProps {
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: SortOption) => void;
  currentSort?: SortOption;
}

const tableHeaders = [
  {
    key: 'number',
    label: 'Claim ID',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
  {
    key: 'holder',
    label: 'Holder',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
  {
    key: 'policyNumber',
    label: 'Policy #',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
  {
    key: 'formattedClaimAmount',
    label: 'Claim Amount',
    sortable: true,
    sortKey: 'amount-highest' as SortOption,
  },
  { key: 'formattedProcessingFee', label: 'Processing Fee', sortable: false },
  {
    key: 'formattedTotalAmount',
    label: 'Total Amount',
    sortable: true,
    sortKey: 'total-highest' as SortOption,
  },
  {
    key: 'formattedIncidentDate',
    label: 'Incident Date',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
  {
    key: 'formattedCreatedDate',
    label: 'Created Date',
    sortable: true,
    sortKey: 'created-newest' as SortOption,
  },
];

export const TableHeader: React.FC<TableHeaderProps> = ({
  columnVisibility,
  onColumnSort,
  currentSort,
}) => {
  const handleSortClick = (header: (typeof tableHeaders)[0]) => {
    if (!header.sortable || !onColumnSort) return;

    // Cycle through sort options for this column
    let nextSort: SortOption;
    if (header.key === 'formattedClaimAmount') {
      nextSort =
        currentSort === 'amount-highest' ? 'amount-lowest' : 'amount-highest';
    } else if (header.key === 'formattedTotalAmount') {
      nextSort =
        currentSort === 'total-highest' ? 'total-lowest' : 'total-highest';
    } else if (header.key === 'formattedCreatedDate') {
      nextSort =
        currentSort === 'created-newest' ? 'created-oldest' : 'created-newest';
    } else {
      nextSort =
        currentSort === 'created-newest' ? 'created-oldest' : 'created-newest';
    }

    onColumnSort(nextSort);
  };

  const getSortIcon = (header: (typeof tableHeaders)[0]) => {
    if (!header.sortable) return null;

    const isActive =
      currentSort &&
      ((header.key === 'formattedClaimAmount' &&
        (currentSort === 'amount-highest' ||
          currentSort === 'amount-lowest')) ||
        (header.key === 'formattedTotalAmount' &&
          (currentSort === 'total-highest' ||
            currentSort === 'total-lowest')) ||
        (header.key === 'formattedCreatedDate' &&
          (currentSort === 'created-newest' ||
            currentSort === 'created-oldest')));

    if (!isActive) return null;

    const isAscending =
      currentSort?.includes('lowest') || currentSort?.includes('oldest');

    return <span className="ml-1 inline-block">{isAscending ? '↑' : '↓'}</span>;
  };

  return (
    <thead className="bg-gray-50">
      <tr role="row">
        {tableHeaders.map((header) => {
          // Check if column should be visible
          if (columnVisibility && columnVisibility[header.key] === false) {
            return null;
          }

          return (
            <th
              key={header.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                header.sortable
                  ? 'cursor-pointer hover:bg-gray-100 select-none'
                  : ''
              }`}
              role="columnheader"
              scope="col"
              onClick={() => handleSortClick(header)}
              aria-sort={header.sortable && currentSort ? 'other' : undefined}
            >
              <div className="flex items-center">
                {header.label}
                {getSortIcon(header)}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
