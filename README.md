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

Fix ESLint issues automatically:

```bash
pnpm lint:fix
```

## Pre-commit Hooks

This project includes Git pre-commit hooks that automatically run quality checks before each commit:

- **ESLint**: Code linting to ensure code quality
- **Tests**: Run test suite to prevent regressions

The hooks are configured in `.git/hooks/pre-commit` and will prevent commits if any checks fail.

## Testing

Run tests:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

## Branching Strategy

This project follows **GitHub Flow** for branching:

- **`main`**: Production-ready code, always deployable
- **Feature branches**: Created from `main` for new features/fixes
  - Naming: `feature/description` or `fix/description`
- **Pull Requests**: All changes merged via PRs to `main`
- **CI Checks**: Automated linting and testing run on every push/PR
- **Pre-commit Hooks**: Local quality checks prevent bad commits
- **Merge Blocking**: PRs cannot merge when CI checks fail

### Workflow:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create Pull Request on GitHub
5. CI checks pass, get review, merge to `main`

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
