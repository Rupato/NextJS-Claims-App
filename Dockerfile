FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FRONTEND_PORT
ARG API_PORT

# Set environment variables for build time
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FRONTEND_PORT=$NEXT_PUBLIC_FRONTEND_PORT
ENV API_PORT=$API_PORT

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE ${NEXT_PUBLIC_FRONTEND_PORT:-3000}

# Start the application
CMD ["pnpm", "start"]
