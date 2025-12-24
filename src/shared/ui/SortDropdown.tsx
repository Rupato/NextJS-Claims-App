import React, { useState, useRef, useEffect } from 'react';
import { SortOption } from '@/shared/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'created-newest', label: 'Created date (newest first)' },
  { value: 'created-oldest', label: 'Created date (oldest first)' },
  { value: 'amount-highest', label: 'Claim amount (highest)' },
  { value: 'amount-lowest', label: 'Claim amount (lowest)' },
  { value: 'total-highest', label: 'Total amount (highest)' },
  { value: 'total-lowest', label: 'Total amount (lowest)' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: SortOption) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const currentOption = SORT_OPTIONS.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Sort claims"
          >
            <span className="text-sm font-medium text-gray-700">
              Sort by: {currentOption?.label}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                <div className="space-y-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded ${
                        value === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700'
                      }`}
                      role="option"
                      aria-selected={value === option.value}
                    >
                      {option.label}
                      {value === option.value && (
                        <svg
                          className="w-4 h-4 inline-block ml-2 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
