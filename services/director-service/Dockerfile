FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY ./shared /app/shared

# Build and link shared module
WORKDIR /app/shared
RUN npm install
RUN npm run build
RUN npm link

# Set up director service
WORKDIR /app/director-service
COPY ./services/director-service/package*.json ./
RUN npm install
RUN npm link @movie-director-hub/shared

# Copy rest of the files
COPY ./services/director-service .

# Start the service using the full path
CMD ["./node_modules/.bin/ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"] 