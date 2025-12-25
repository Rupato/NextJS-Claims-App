import React from 'react';
import { TableHeaderProps } from './types';
import {
  tableHeaders,
  getNextSortOption,
  isSortActiveForHeader,
  getSortIconDirection,
} from './utils';

export const TableHeader = ({
  columnVisibility,
  onColumnSort,
  currentSort,
}: TableHeaderProps) => {
  const handleSortClick = (header: (typeof tableHeaders)[number]) => {
    if (!header.sortable || !onColumnSort) return;

    const nextSort = getNextSortOption(header.key, currentSort);
    onColumnSort(nextSort);
  };

  const getSortIcon = (header: (typeof tableHeaders)[number]) => {
    if (!header.sortable) return null;

    const isActive = isSortActiveForHeader(header.key, currentSort);
    if (!isActive) return null;

    const direction = getSortIconDirection(currentSort);
    return <span className="ml-1 inline-block">{direction}</span>;
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
