import { FormattedClaim, Claim } from '@/entities/claim/types';

// ClaimDetailsModal types
export interface ClaimDetailsModalProps {
  claim: FormattedClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

// CreateClaimModal types
export interface CreateClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimCreated?: (claim: Claim) => void;
}

// ClaimsDashboard types
export interface ColumnConfig {
  key: keyof FormattedClaim;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface ClaimsDashboardProps {
  initialClaims?: Claim[];
}

// CreateClaimForm types (using yup inference)
export type FormData = {
  holder: string;
  policyNumber: string;
  claimAmount: number;
  processingFee: number;
  incidentDate: string;
  description: string;
};

export interface CreateClaimFormProps {
  onFormChange?: (hasChanges: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

// StatusFilter types
export interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  availableStatuses: string[];
}
