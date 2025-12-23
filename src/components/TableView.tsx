'use client';

import React, { useRef } from 'react';
import { FormattedClaim } from '../types/claims';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { ROW_HEIGHT, CONTAINER_HEIGHT } from '../constants/virtualization';

interface TableViewProps {
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
}

export const TableView: React.FC<TableViewProps> = ({
  formattedClaims,
  startIndex,
  endIndex,
  onScroll,
  hasActiveFilters,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use smaller row height when filters are active to show more data
  const rowHeight = hasActiveFilters ? 48 : ROW_HEIGHT;

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={onScroll}
        role="region"
        aria-labelledby="claims-table"
      >
        <h3 id="claims-table" className="sr-only">
          Insurance Claims Data Table
        </h3>
        <table
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-labelledby="claims-table"
          aria-rowcount={formattedClaims.length + 1}
          aria-colcount={9}
        >
          {/* Top spacer for virtualization */}
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
            <tr style={{ height: startIndex * rowHeight }} />
            {formattedClaims.slice(startIndex, endIndex).map((claim) => (
              <TableRow key={claim.id} claim={claim} />
            ))}
            <tr
              style={{
                height: (formattedClaims.length - endIndex) * rowHeight,
              }}
            />
          </tbody>
          {/* Bottom spacer for virtualization */}
        </table>
      </div>

      <div
        className="px-6 py-4 border-t border-gray-200 bg-gray-50"
        id="claims-table-desc"
      >
        <div>
          <p className="text-sm text-gray-500">
            Virtualized table: Showing {endIndex - startIndex} rendered rows of{' '}
            {formattedClaims.length} total claims. Scroll to dynamically
            load/unload data for optimal performance.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rendered range: {startIndex + 1}-
            {Math.min(endIndex, formattedClaims.length)} | Last updated:{' '}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};
