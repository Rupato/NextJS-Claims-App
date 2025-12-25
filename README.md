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
