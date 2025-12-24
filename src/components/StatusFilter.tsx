import React, { useState, useRef, useEffect } from 'react';
import { getStatusColorClasses } from '../utils';

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  availableStatuses: string[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatuses = [],
  onStatusChange,
  availableStatuses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStatusToggle = (status: string) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(newSelected);
  };

  const handleClearAll = () => {
    onStatusChange([]);
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    onStatusChange(selectedStatuses.filter((s) => s !== statusToRemove));
  };

  // Remove duplicates from availableStatuses
  const uniqueAvailableStatuses = [...new Set(availableStatuses)];

  // Determine icon rotation based on dropdown state
  const iconRotationClass = isOpen ? 'rotate-180' : '';

  // Determine if we have active filters
  const hasActiveFilters = selectedStatuses.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Filter by status"
          >
            <span className="text-sm font-medium text-gray-700">
              Filter by Status
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${iconRotationClass}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                <div className="space-y-1">
                  {uniqueAvailableStatuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => handleStatusToggle(status)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {selectedStatuses.map((status) => (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClasses(status)}`}
                >
                  {status}
                  <button
                    onClick={() => handleRemoveStatus(status)}
                    className="ml-1 hover:bg-opacity-75 rounded-full p-0.5"
                    aria-label={`Remove ${status} filter`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusFilter;
