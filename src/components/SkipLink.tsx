import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <nav aria-label="Skip navigation">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:bg-blue-700"
        onFocus={(e) => e.target.scrollIntoView({ block: 'nearest' })}
      >
        Skip to main content
      </a>
    </nav>
  );
};

export default SkipLink;
