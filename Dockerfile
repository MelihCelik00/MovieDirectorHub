# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install TypeScript globally
RUN npm install -g typescript

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary files
COPY .env.example .env

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"] 