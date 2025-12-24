import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '../src/components/Providers';

export const metadata: Metadata = {
  title: 'Insurance Claims Dashboard',
  description:
    'Professional insurance claims management dashboard with real-time data visualization, status tracking, and comprehensive claim information.',
  keywords:
    'insurance, claims, dashboard, management, policy, claims processing',
  authors: [{ name: 'Claims Management Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Insurance Claims Dashboard',
    description:
      'Manage insurance claims with real-time status tracking and comprehensive data visualization.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="dns-prefetch" href="//localhost:8001" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
