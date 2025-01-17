# MovieDirectorHub

A scalable microservices-based backend solution for managing movies and directors information.

## Architecture Overview

The system consists of three main services:

- **Movie Service** (Port 3000): Handles all movie-related operations
- **Director Service** (Port 3001): Manages director information
- **API Gateway** (Port 8080): Single entry point for all client requests

### Tech Stack

- Runtime: Node.js with TypeScript
- Database: MongoDB with Mongoose ODM
- Caching: Redis
- Containerization: Docker
- Testing: Jest
- API Documentation: Swagger
- Version Control: Git

## Project Structure

```
MovieDirectorHub/
├── services/
│   ├── movie-service/       # Movie microservice
│   ├── director-service/    # Director microservice
│   └── api-gateway/        # API Gateway
├── shared/                 # Shared utilities and types
├── docker/                 # Docker configuration files
└── docs/                   # Project documentation
```

## Prerequisites

- Docker and Docker Compose
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MovieDirectorHub.git
   cd MovieDirectorHub
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB
   - MongoDB Express (Admin UI)
   - Redis
   - Movie Service

3. To view logs from all services:
   ```bash
   docker-compose logs -f
   ```

4. To stop all services:
   ```bash
   docker-compose down
   ```

## Accessing Services

### Movie Service
- API: http://localhost:3000/api/v1
- Swagger Documentation: http://localhost:3000/api/v1/docs
- Health Check: http://localhost:3000/health

### MongoDB Management
You can manage MongoDB data using Mongo Express:
- URL: http://localhost:8081
- Username: admin
- Password: password123

MongoDB Connection Details:
- Username: admin
- Password: password123
- Connection URL: mongodb://admin:password123@localhost:27017/?authSource=admin

## API Documentation

Once the services are running, you can access the Swagger documentation:

- Movie Service: http://localhost:3000/api/v1/docs
- Director Service: http://localhost:3001/api/v1/docs (coming soon)
- API Gateway: http://localhost:8080/api-docs (coming soon)

## Development

### Running Services Individually

If you want to run services without Docker for development:

1. Install dependencies for shared module:
   ```bash
   cd shared
   npm install
   npm run build
   npm link
   cd ..
   ```

2. Install dependencies for Movie Service:
   ```bash
   cd services/movie-service
   npm install
   npm link @movie-director-hub/shared
   npm run dev
   cd ../..
   ```

### Running Tests

```bash
# Run tests for all services
npm run test

# Run tests for a specific service
cd services/movie-service && npm run test
```

### Code Style and Linting

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Error Handling

The system implements a standardized error handling approach:

```typescript
{
  status: string;     // "error"
  code: number;       // HTTP status code
  message: string;    // User-friendly error message
  timestamp: string;  // ISO timestamp
  path: string;       // Request path
  details?: any;      // Additional details (dev only)
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
