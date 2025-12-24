// Core types
export interface Claim {
  id: string;
  number: string;
  incidentDate: string;
  createdAt: string;
  amount: string;
  holder: string;
  policyNumber: string;
  insuredName: string;
  description: string;
  processingFee: string;
  status: string;
}

export interface FormattedClaim extends Claim {
  formattedClaimAmount: string;
  formattedProcessingFee: string;
  formattedTotalAmount: string;
  formattedIncidentDate: string;
  formattedCreatedDate: string;
}

// UI types
export type ViewMode = 'table' | 'cards';

// Sort options
export type SortOption =
  | 'created-newest'
  | 'created-oldest'
  | 'amount-highest'
  | 'amount-lowest'
  | 'total-highest'
  | 'total-lowest';
