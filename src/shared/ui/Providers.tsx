'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// DevTools component that conditionally renders only in development
function DevTools() {
  const [DevToolsComponent, setDevToolsComponent] =
    React.useState<React.ComponentType<{ initialIsOpen: boolean }> | null>(
      null
    );

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@tanstack/react-query-devtools')
        .then(({ ReactQueryDevtools }) => {
          setDevToolsComponent(() => ReactQueryDevtools);
        })
        .catch(() => {
          // Devtools not available, ignore
        });
    }
  }, []);

  if (!DevToolsComponent) return null;
  return <DevToolsComponent initialIsOpen={false} />;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DevTools />
    </QueryClientProvider>
  );
}
