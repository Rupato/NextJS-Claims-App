import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  reactCompiler: true,

  // Aggressive minification and optimization for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental features for better optimization
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // Enable webpack build worker for faster builds
    webpackBuildWorker: true,
  },

  // Compression and optimization (enabled by default in production)
  compress: true,

  // Webpack configuration for better tree shaking
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable aggressive chunk splitting and tree shaking
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Separate vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
