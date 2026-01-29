# syntax=docker/dockerfile:1.6

###############################################################################
# Base stage: resolves application dependencies in isolation to keep builds   #
# reproducible and safe. Uses a build cache for npm to speed up rebuilds.      #
###############################################################################
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app
# Copy lock files if they exist to ensure deterministic installs.
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
# Install dependencies without running scripts for security.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

###############################################################################
# Build stage: compiles TypeScript to JavaScript and prepares production       #
# artifacts without leaking dev tooling into the final image.                  #
###############################################################################
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure the TypeScript build is performed in the container.
RUN npm run build

###############################################################################
# Production stage: contains only runtime dependencies and compiled sources,  #
# hardened for production usage.                                              #
###############################################################################
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
# Copy dependency manifests and install only production deps.
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --ignore-scripts

# Copy compiled sources and any static assets from the build stage.
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Create a non-root user for safer runtime execution.
RUN addgroup -g 1001 appgroup && adduser -S -G appgroup -u 1001 appuser
USER appuser

# Expose the HTTP port configured in the application (defaults to 3000).
EXPOSE 3000

# Launch the compiled Node.js application.
CMD ["node", "dist/main.js"]
