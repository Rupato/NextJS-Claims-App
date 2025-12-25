import { SortOption } from '@/shared/types';

export const tableHeaders = [
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
] as const;

export const getNextSortOption = (
  headerKey: string,
  currentSort?: SortOption
): SortOption => {
  if (headerKey === 'formattedClaimAmount') {
    return currentSort === 'amount-highest'
      ? 'amount-lowest'
      : 'amount-highest';
  } else if (headerKey === 'formattedTotalAmount') {
    return currentSort === 'total-highest' ? 'total-lowest' : 'total-highest';
  } else if (headerKey === 'formattedCreatedDate') {
    return currentSort === 'created-newest'
      ? 'created-oldest'
      : 'created-newest';
  } else {
    return currentSort === 'created-newest'
      ? 'created-oldest'
      : 'created-newest';
  }
};

export const isSortActiveForHeader = (
  headerKey: string,
  currentSort?: SortOption
): boolean => {
  if (!currentSort) return false;

  return (
    (headerKey === 'formattedClaimAmount' &&
      (currentSort === 'amount-highest' || currentSort === 'amount-lowest')) ||
    (headerKey === 'formattedTotalAmount' &&
      (currentSort === 'total-highest' || currentSort === 'total-lowest')) ||
    (headerKey === 'formattedCreatedDate' &&
      (currentSort === 'created-newest' || currentSort === 'created-oldest'))
  );
};

export const getSortIconDirection = (currentSort?: SortOption): '↑' | '↓' => {
  return currentSort?.includes('lowest') || currentSort?.includes('oldest')
    ? '↑'
    : '↓';
};
