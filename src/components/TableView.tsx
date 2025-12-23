'use client';

import React, { useRef } from 'react';
import { FormattedClaim } from '../types/claims';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import {
  ROW_HEIGHT,
  CONTAINER_HEIGHT,
} from '../constants/virtualization';

interface TableViewProps {
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  claimsLength: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  formattedClaims,
  startIndex,
  endIndex,
  claimsLength,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        {/* Top spacer for virtualization */}
        <div style={{ height: startIndex * ROW_HEIGHT }} />

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
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
            {formattedClaims.slice(startIndex, endIndex).map((claim) => (
              <TableRow key={claim.id} claim={claim} />
            ))}
          </tbody>
        </table>

        {/* Bottom spacer for virtualization */}
        <div style={{ height: (claimsLength - endIndex) * ROW_HEIGHT }} />
      </div>

      <div
        className="px-6 py-4 border-t border-gray-200 bg-gray-50"
        id="claims-table-desc"
      >
        <div>
          <p className="text-sm text-gray-500">
            Virtualized table: Showing {endIndex - startIndex} rendered rows of{' '}
            {claimsLength} total claims. Scroll to dynamically load/unload data
            for optimal performance.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rendered range: {startIndex + 1}-{Math.min(endIndex, claimsLength)}{' '}
            | Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};
