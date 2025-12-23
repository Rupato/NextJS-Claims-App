import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Insurance Claims Dashboard',
  description: 'Professional insurance claims management dashboard with real-time data visualization, status tracking, and comprehensive claim information.',
  keywords: 'insurance, claims, dashboard, management, policy, claims processing',
  authors: [{ name: 'Claims Management Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Insurance Claims Dashboard',
    description: 'Manage insurance claims with real-time status tracking and comprehensive data visualization.',
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
