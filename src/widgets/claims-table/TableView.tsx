'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FormattedClaim } from '@/entities/claim/types';
import { SortOption } from '@/shared/types';
import { TableHeader } from './TableHeader';
import { TableRow } from '@/entities/claim/ui/TableRow';
import { ROW_HEIGHT, CONTAINER_HEIGHT } from '@/shared/virtualization';

interface TableViewProps {
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onRowSelect?: (claim: FormattedClaim) => void;
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: SortOption) => void;
  currentSort?: SortOption;
}

export const TableView: React.FC<TableViewProps> = ({
  formattedClaims,
  startIndex,
  endIndex,
  onScroll,
  hasActiveFilters,
  onRowSelect,
  columnVisibility,
  onColumnSort,
  currentSort,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Use smaller row height when filters are active to show more data
  const rowHeight = hasActiveFilters ? 48 : ROW_HEIGHT;

  // Global keyboard listener to activate navigation
  useEffect(() => {
    if (!onRowSelect) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only activate if we're not already focused and an arrow key is pressed
      if (
        selectedIndex === -1 &&
        (e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        // Focus the container and select first row
        if (containerRef.current) {
          containerRef.current.focus();
          setSelectedIndex(startIndex);
        }
      }
    };

    // Add global listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [onRowSelect, selectedIndex, startIndex]);

  // Focus on the selected row when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < formattedClaims.length) {
      const visibleIndex = selectedIndex - startIndex;
      if (visibleIndex >= 0 && visibleIndex < rowRefs.current.length) {
        const rowElement = rowRefs.current[visibleIndex];
        if (rowElement) {
          rowElement.focus();
          // Ensure the row is visible in the scroll container
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }
    }
  }, [selectedIndex, startIndex, formattedClaims.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onRowSelect) return;

      const visibleClaims = formattedClaims.slice(startIndex, endIndex);
      const currentVisibleIndex = selectedIndex - startIndex;
      console.log(e.key);
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (selectedIndex === -1) {
            // No row selected, select the first visible row
            setSelectedIndex(startIndex);
          } else if (currentVisibleIndex < visibleClaims.length - 1) {
            setSelectedIndex((prev) => prev + 1);
          } else if (endIndex < formattedClaims.length) {
            // Scroll down to show more rows
            containerRef.current?.scrollBy(0, rowHeight);
            // Move to the newly visible row
            setSelectedIndex(endIndex);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (selectedIndex === -1) {
            // No row selected, select the first visible row
            setSelectedIndex(startIndex);
          } else if (currentVisibleIndex > 0) {
            setSelectedIndex((prev) => prev - 1);
          } else if (startIndex > 0) {
            // Scroll up to show more rows
            containerRef.current?.scrollBy(0, -rowHeight);
            // Move to the newly visible row
            setSelectedIndex(startIndex - 1);
          }
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < formattedClaims.length) {
            onRowSelect(formattedClaims[selectedIndex]);
          }
          break;
      }
    },
    [
      selectedIndex,
      startIndex,
      endIndex,
      formattedClaims,
      onRowSelect,
      rowHeight,
    ]
  );

  const handleContainerClick = () => {
    // Focus the container when clicked anywhere to enable keyboard navigation
    if (containerRef.current && onRowSelect) {
      containerRef.current.focus();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={onScroll}
        onKeyDown={handleKeyDown}
        onClick={handleContainerClick}
        tabIndex={onRowSelect ? 0 : -1}
        role="region"
        aria-labelledby="claims-table"
        aria-describedby="table-keyboard-instructions"
      >
        <h3 id="claims-table" className="sr-only">
          Insurance Claims Data Table
        </h3>
        {onRowSelect && (
          <div id="table-keyboard-instructions" className="sr-only">
            Use ↑↓ arrow keys to navigate rows, Enter to open claim details
          </div>
        )}
        <table
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-labelledby="claims-table"
          aria-rowcount={formattedClaims.length + 1}
          aria-colcount={9}
        >
          {/* Top spacer for virtualization */}
          <TableHeader
            columnVisibility={columnVisibility}
            onColumnSort={onColumnSort}
            currentSort={currentSort}
          />
          <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
            <tr style={{ height: startIndex * rowHeight }} />
            {formattedClaims.slice(startIndex, endIndex).map((claim, index) => (
              <TableRow
                key={claim.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                claim={claim}
                onRowSelect={onRowSelect}
                isSelected={selectedIndex === startIndex + index}
                columnVisibility={columnVisibility}
              />
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
            {Math.min(endIndex, formattedClaims.length)}
          </p>
        </div>
      </div>
    </>
  );
};
