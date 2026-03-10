# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only package files to leverage caching
COPY package*.json ./

# Install dependencies with build tools
RUN npm ci --only=production

# Production stage
FROM node:22-alpine
WORKDIR /app

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "src/server.js"]

# Start application
CMD ["node", "src/server.js"]
