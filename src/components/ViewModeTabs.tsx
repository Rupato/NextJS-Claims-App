'use client';

import React from 'react';
import { ViewMode } from '../types';

interface ViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeTabs: React.FC<ViewModeTabsProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <nav aria-label="View mode selection" className="flex space-x-1">
      <button
        onClick={() => onViewModeChange('table')}
        className={`px-6 md:px-8 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap min-w-[100px] ${
          viewMode === 'table'
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        aria-pressed={viewMode === 'table'}
        aria-label="Switch to table view"
      >
        📊 Table View
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`px-6 md:px-8 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap min-w-[100px] ${
          viewMode === 'cards'
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        aria-pressed={viewMode === 'cards'}
        aria-label="Switch to card view"
      >
        🃏 Card View
      </button>
    </nav>
  );
};
