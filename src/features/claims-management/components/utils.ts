import { FormattedClaim } from '@/entities/claim/types';

export const DEFAULT_COLUMNS: {
  key: keyof FormattedClaim;
  label: string;
  visible: boolean;
  sortable: boolean;
}[] = [
  { key: 'number', label: 'Claim ID', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'holder', label: 'Holder', visible: true, sortable: true },
  { key: 'policyNumber', label: 'Policy #', visible: true, sortable: true },
  {
    key: 'formattedClaimAmount',
    label: 'Claim Amount',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedProcessingFee',
    label: 'Processing Fee',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedTotalAmount',
    label: 'Total Amount',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedIncidentDate',
    label: 'Incident Date',
    visible: true,
    sortable: true,
  },
  {
    key: 'formattedCreatedDate',
    label: 'Created Date',
    visible: true,
    sortable: true,
  },
];
