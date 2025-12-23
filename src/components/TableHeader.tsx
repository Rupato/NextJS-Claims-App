import React from 'react';

const tableHeaders = [
  { key: 'id', label: 'Claim ID', scope: 'col' as const },
  { key: 'status', label: 'Status', scope: 'col' as const },
  { key: 'holder', label: 'Holder Name', scope: 'col' as const },
  { key: 'policy', label: 'Policy Number', scope: 'col' as const },
  { key: 'claimAmount', label: 'Claim Amount', scope: 'col' as const },
  { key: 'processingFee', label: 'Processing Fee', scope: 'col' as const },
  { key: 'totalAmount', label: 'Total Amount', scope: 'col' as const },
  { key: 'incidentDate', label: 'Incident Date', scope: 'col' as const },
  { key: 'createdDate', label: 'Created Date', scope: 'col' as const },
];

export const TableHeader: React.FC = () => (
  <thead className="bg-gray-50">
    <tr role="row">
      {tableHeaders.map((header) => (
        <th
          key={header.key}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          role="columnheader"
          scope={header.scope}
        >
          {header.label}
        </th>
      ))}
    </tr>
  </thead>
);
