import { FormattedClaim } from '@/entities/claim/types';

// TableView types
export interface TableViewProps {
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onRowSelect?: (claim: FormattedClaim) => void;
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: import('@/shared/types').SortOption) => void;
  currentSort?: import('@/shared/types').SortOption;
}

// ClaimsView types
export interface ClaimsViewProps {
  viewMode: 'table' | 'cards';
  formattedClaims: FormattedClaim[];
  startIndex: number;
  endIndex: number;
  cardStartIndex: number;
  cardEndIndex: number;
  cardsPerRow: number;
  onTableScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onCardsScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onRowSelect?: (claim: FormattedClaim) => void;
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: import('@/shared/types').SortOption) => void;
  currentSort?: import('@/shared/types').SortOption;
}

// TableHeader types
export interface TableHeaderProps {
  columnVisibility?: Record<string, boolean>;
  onColumnSort?: (sortOption: import('@/shared/types').SortOption) => void;
  currentSort?: import('@/shared/types').SortOption;
}

// CardsView types
export interface CardsViewProps {
  formattedClaims: FormattedClaim[];
  cardStartIndex: number;
  cardEndIndex: number;
  cardsPerRow: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  hasActiveFilters: boolean;
  onCardClick?: (claim: FormattedClaim) => void;
}
