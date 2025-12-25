# Next.js Insurance Claims Dashboard

An insurance claims management application built with Next.js, TypeScript, and modern React patterns.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager (or npm)
- Docker (optional, but recommended for easy setup)

### Setup Instructions

1. **Extract the Repository:**
   - Download the project zip file containing the `updated-senior-fe-assignment` folder
   - Extract the zip file into your desired location
   - Navigate to the extracted `updated-senior-fe-assignment` folder
   - Place the `nextjs-claim-app` folder into that folder

2. **Using Docker:**
   (You'll need to copy the provided Docker files and rename them: `docker-root` → `docker-compose.yml` in root folder, `docker-backend` → `Dockerfile` in `mock/` folder, `docker-frontend` → `Dockerfile` in `nextjs-claim-app/` folder)

   ```bash
   # From the root updated-senior-fe-assignment folder
   # Ensure Docker is running on your machine
   docker compose up --build
   ```

   This will automatically start both the Next.js frontend (http://localhost:3000) and the mock API backend (http://localhost:8001).

3. **Without Docker (Manual Setup):**

   **Start the Mock API Backend:**

   ```bash
   cd mock
   npm install
   npm run mock
   ```

   The mock API will run on http://localhost:8001

   **Start the Next.js Frontend:**

   ```bash
   cd nextjs-claim-app
   pnpm install
   pnpm dev
   ```

   The frontend will run on http://localhost:3000

### Installation (Alternative using npm)

If you prefer using npm instead of pnpm:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

### Development

Once both services are running, open http://localhost:3000 in your browser to access the claims management dashboard.

### Building

Build for production:

```bash
pnpm build
```

### Testing

Run tests:

```bash
pnpm test
```

## Tech Stack Overview

- **Framework**: Next.js 16 with App Router and TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Yup validation
- **Data Fetching**: TanStack Query with custom hooks
- **Date Handling**: react-datepicker
- **Testing**: Vitest with React Testing Library and Happy DOM
- **Code Quality**: ESLint, Prettier, TypeScript strict mode, Husky pre-commit hooks
- **Build Tool**: Next.js built-in bundler

## Design Patterns Used

### Architectural Patterns

- **Feature-Sliced Architecture**: Code organized by business domains (`entities`, `features`, `shared`, `widgets`) for better maintainability and independent feature development
- **Custom Hooks Pattern**: Extensive use of custom hooks for data fetching, URL state management, search functionality, and virtualization logic

### Data Management Patterns

- **Observer Pattern**: TanStack Query for reactive data fetching with automatic cache management and optimistic updates
- **Repository Pattern**: Centralized data access logic in custom hooks, abstracting API calls from components

### Component Patterns

- **Compound Components Pattern**: Components designed to work together (e.g., `ClaimsView` with `ClaimsTable`/`ClaimsCards`)
- **Container/Presentational Pattern**: Separation of business logic (containers) from presentation (pure components)

### State Management Patterns

- **URL State Synchronization**: Application state persisted in URL parameters for shareable, bookmarkable states
- **Persisted State Pattern**: Local storage integration for user preferences with automatic restoration

### Performance Patterns

- **Virtualization Pattern**: Custom virtual scrolling for large datasets with `useTableVirtualization` and `useCardsVirtualization`
- **Memoization Pattern**: Strategic use of `React.memo`, `useMemo`, and `useCallback` for performance optimization

### Error Handling Patterns

- **Error Boundary Pattern**: Graceful error handling with user-friendly messages
- **Retry Pattern**: Exponential backoff for failed API calls with configurable retry limits

### Accessibility Patterns

- **Screen Reader Pattern**: Comprehensive ARIA support, live regions, skip links, and keyboard navigation

## Key Decisions

### Architecture

- **Feature-Sliced Architecture**: Organized code by business domains for better maintainability
- **Custom Hooks Pattern**: Centralized data fetching and business logic in reusable hooks
- **Component Composition**: Built complex UIs through composition of smaller components

### Performance

- **Virtualization**: Implemented custom virtual scrolling for large claim lists
- **Route-based Code Splitting**: Automatic lazy loading for better initial bundle size
- **Query Caching**: TanStack Query for efficient server state management

### Developer Experience

- **TypeScript Strict Mode**: Full type safety throughout the application
- **Modern Tooling**: Latest versions of Next.js, React, and build tools
- **Automated Quality Gates**: Prettier, ESLint, and Husky for consistent code quality
- **CI/CD Pipelines**: GitHub Actions with automated testing, linting, and building on every push/PR

## Trade-offs Made

### Framework Choices

- **Next.js 16 + React 19**: Latest versions provide features but may have occasional stability issues
- **Tailwind CSS v4**: Modern styling approach but requires learning Tailwind utility classes

### Architecture Complexity

- **Feature-Sliced Design**: Excellent for large applications but adds initial learning curve
- **Custom Hook Abstractions**: Improve reusability but add indirection

### Testing Strategy

- **Vitest + React Testing Library**: Modern testing tools but require different mental model than Jest
- **Happy DOM**: Fast testing environment but less browser-compatible than jsdom

## What We'd Improve with More Time

### Performance & Scalability

- Implement React Server Components for better SSR performance
- Add service worker for offline functionality and caching
- Optimize images and assets with Next.js Image component
- Implement proper bundle analysis and optimization

### User Experience

- Add comprehensive error boundaries with retry mechanisms
- Implement optimistic updates for better perceived performance
- Add loading skeletons and better empty states
- Improve accessibility with proper ARIA labels and keyboard navigation

### Developer Experience

- Add end-to-end testing with Playwright
- Create Storybook for component documentation
- Implement automated performance monitoring
- Automate code review or bug cards

### Architecture & Security

- Add proper authentication and authorization
- Implement rate limiting and API security
- Add comprehensive logging and error monitoring
- Set up feature flags for gradual rollouts
- **Backend within Next.js**: Leverage Next.js API routes to create a full-stack application without external backend services

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── claims/            # Claims routes
│   │   ├── [id]/          # Dynamic claim pages
│   │   └── new/           # Create claim form
│   └── page.tsx           # Dashboard
├── entities/              # Business entities
│   └── claim/             # Claim domain
├── features/              # Feature slices
│   └── claims-management/ # Claims functionality
├── shared/                # Reusable code
│   ├── ui/               # UI components
│   ├── hooks/            # Shared hooks
│   ├── utils/            # Utilities
│   └── lib/              # Library config
└── widgets/               # Composite components
    └── claims-table/      # Table widget
```
