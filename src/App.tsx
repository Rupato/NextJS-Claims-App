import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import Home from './app/page';
import './app/globals.css';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="antialiased">
        <Home />
      </div>
      {/* Only show devtools in development */}
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
