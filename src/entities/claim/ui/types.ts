import { FormattedClaim } from '../types';

// ClaimCard types
export interface ClaimCardProps {
  claim: FormattedClaim;
  onCardClick?: (claim: FormattedClaim) => void;
}

// TableRow types
export interface TableRowProps {
  claim: FormattedClaim;
  onRowSelect?: (claim: FormattedClaim) => void;
  isSelected?: boolean;
  columnVisibility?: Record<string, boolean>;
}
