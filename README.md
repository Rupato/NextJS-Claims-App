# Next.js Insurance Claims Dashboard

An insurance claims management application built with Next.js, TypeScript, and modern React patterns.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

1. Install pnpm if you don't have it:

   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

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
