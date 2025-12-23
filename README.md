# Next.js Claim App

This project is a Next.js application configured to use Rsbuild for building, managed with pnpm. It combines the full-stack capabilities of Next.js with the fast bundling performance of Rsbuild and efficient package management of pnpm.

## Tech Stack

- **Next.js**: React framework for building full-stack web applications
- **Rsbuild**: Fast bundler based on Rspack for optimized builds
- **pnpm**: Efficient package manager
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting

## Setup and Installation

1. Ensure you have pnpm installed:
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building

Build the application for production:
```bash
pnpm build
```

## Preview Production Build

Start the production server:
```bash
pnpm start
```

## Linting

Run ESLint:
```bash
pnpm lint
```

## Benefits of This Approach

### pnpm
- **Fast Installation**: Uses hard links and symlinks for efficient disk usage
- **Strict Dependency Resolution**: Prevents dependency confusion issues
- **Workspace Support**: Excellent for monorepo setups
- **Smaller node_modules**: Shares dependencies across projects

### Rsbuild
- **Lightning Fast Builds**: Based on Rspack (Rust-powered webpack alternative)
- **Optimized for Modern Web**: Built-in support for latest JavaScript features
- **Plugin Ecosystem**: Extensible with plugins for various needs
- **Better Performance**: Faster than traditional webpack in most cases

### Next.js
- **Full-Stack Framework**: Server-side rendering, API routes, and static generation
- **App Router**: Modern routing with layouts and nested routes
- **Built-in Optimizations**: Automatic code splitting, image optimization, and more
- **TypeScript Support**: First-class TypeScript integration

### Combined Benefits
- **Rapid Development**: Hot reloading with Rsbuild's fast dev server
- **Efficient Builds**: Rsbuild provides significantly faster build times compared to Next.js's default webpack
- **Scalable Architecture**: Next.js's features combined with Rsbuild's performance
- **Modern Tooling**: Leverages the latest in build tools and package management

This setup provides a modern, performant development experience while maintaining the powerful features of Next.js for building complex web applications.
