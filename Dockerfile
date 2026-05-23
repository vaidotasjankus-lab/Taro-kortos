# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies including devDependencies (needed for build)
RUN npm ci

# Copy reference project code
COPY . .

# Run build script
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and critical runtime scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Only install production dependencies for a lightweight image
RUN npm ci --only=production

# Expose port (Cloud Run automatically routes traffic to this port via $PORT)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
