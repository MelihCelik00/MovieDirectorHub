FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY ./shared /app/shared
WORKDIR /app/shared
RUN npm install
RUN npm run build
RUN npm link

# Move to movie service directory
WORKDIR /app/movie-service
COPY ./services/movie-service/package*.json ./
RUN npm install
RUN npm link @movie-director-hub/shared

COPY ./services/movie-service .

CMD ["npm", "run", "dev"] 