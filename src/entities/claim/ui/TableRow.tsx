import React from 'react';
import { TableRowProps } from './types';
import { tableCellConfigs } from './table-cells';

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

    // Create cells array from configurations
    const cells = tableCellConfigs.map((config) => ({
      key: config.key,
      content: (
        <td className={config.className} role="cell">
          {config.render(claim)}
        </td>
      ),
    }));

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
