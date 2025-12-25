# Next.js Insurance Claims Dashboard

An insurance claims management application built with Next.js, TypeScript, and modern React patterns.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager (or npm)
- Docker (optional, but recommended for easy setup)

### Quick Start

Choose your preferred setup method:

#### Option 1: Docker Setup

1. **Setup Environment:**
   - After cloning this repository, you'll find `updated-senior-fe-assignment.zip` inside the `nextjs-claim-app` folder
   - Extract the zip file and navigate to the extracted `updated-senior-fe-assignment` folder
   - Copy this `nextjs-claim-app` folder into the extracted folder
   - Create a `.env` file in the root folder with:
     ```
     FRONTEND_PORT=3000
     API_PORT=8001
     API_BASE_URL=http://api-mock:${API_PORT}
     NEXT_PUBLIC_API_URL=http://api-mock:${API_PORT}
     NEXT_PUBLIC_FRONTEND_PORT=${FRONTEND_PORT}
     MOCK_PORT=${API_PORT}
     ```

2. **Start Services:**
   - Copy and rename Docker files: `docker-root` → `docker-compose.yml`, `docker-backend` → `mock/Dockerfile`, `docker-frontend` → `nextjs-claim-app/Dockerfile`
   - Run: `docker compose up --build` from the main `updated-senior-fe-assignment`
   - Access at: http://localhost:3000

#### Option 2: Manual Setup without docker

1. **Setup Environment:**
   - After cloning this repository, you'll find `updated-senior-fe-assignment.zip` inside the `nextjs-claim-app` folder
   - Extract the zip file and navigate to the extracted `updated-senior-fe-assignment` folder
   - Copy this `nextjs-claim-app` folder into the extracted folder
   - Create a `.env.local` file in the `nextjs-claim-app` folder with:
     ```
     FRONTEND_PORT=3000
     API_PORT=8001
     API_BASE_URL=http://localhost:${API_PORT}
     NEXT_PUBLIC_API_URL=http://localhost:${API_PORT}
     NEXT_PUBLIC_FRONTEND_PORT=${FRONTEND_PORT}
     MOCK_PORT=${API_PORT}
     ```

2. **Start Services:**
   - Mock API: `cd mock && npm install && npm run mock` (runs on http://localhost:8001)
   - Frontend: `cd nextjs-claim-app && pnpm install && pnpm dev` (runs on http://localhost:3000)

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
