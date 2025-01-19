# MovieDirectorHub API

A robust and scalable backend solution for managing movies and directors, built with TypeScript, Node.js, and MongoDB.

## Table of Contents

- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Future Developments](#future-developments)

## System Architecture

The application follows a modular monolithic architecture with clear separation of concerns:

### Layers

1. **Controllers**: Handle HTTP requests/responses
2. **Services**: Implement business logic
3. **Repositories**: Handle data access
4. **Models**: Define data structures and validation

### Design Patterns

- Repository Pattern
- Service Layer Pattern
- Dependency Injection
- Factory Pattern
- Singleton Pattern (for database connections)

### Key Principles

- SOLID and DRY principles
- Clean Architecture
- Type Safety
- Modular Design

## Features

- Complete CRUD operations for movies and directors
- Advanced search and filtering capabilities
- Pagination and sorting
- Data validation using Zod
- Caching with Redis
- Rate limiting
- API documentation with Swagger
- Error handling and logging
- Security features (CORS, Helmet)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest (planned)
- **Logging**: Winston
- **Security**: 
  - Helmet
  - CORS
  - Rate Limiting
  - Input Validation

## Project Structure

```
src/
├── config/                 # Configuration files
├── modules/               # Feature modules
│   ├── movie/            # Movie module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── routes/
│   ├── director/         # Director module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── routes/
│   └── shared/           # Shared module
├── middleware/           # Application middleware
├── utils/               # Utility functions
└── app.ts              # Application entry point
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start (One Command Setup)

1. Clone the repository:
```bash
git clone <repository-url>
cd MovieDirectorHub
```

2. Start the entire application:
```bash
docker-compose up --build
```

3. Additionally, if you want to restart the app:
```bash
docker-compose down && docker-compose up --build
```

That's it! The following services will be automatically set up and available:
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- MongoDB Express (Database UI): http://localhost:8081
  - Username: admin
  - Password: password123

The setup includes:
- Application build and startup
- Database initialization with sample data
- Redis cache setup
- Health checks for all services
- Automatic service dependency management

### Development Mode

For development with hot-reload:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Useful Commands

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

Execute commands in containers:
```bash
# Access app container shell
docker-compose exec app sh

# Run tests
docker-compose exec app npm test

# Install new dependencies
docker-compose exec app npm install <package-name>
```

Stop the application:
```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and images
docker-compose down -v --rmi all
```

### Service Health Checks

The setup even includes health checks for all services:
- API: http://localhost:3000/api/health
- MongoDB: Internal ping command
- Redis: Internal ping command
- Mongo Express: HTTP check

## API Documentation

### Director Endpoints

- **GET ```/api/directors```**
  - Get all directors with pagination
  - Query params: page, limit, sortBy, sortOrder

- **GET ```/api/directors/:id```**
  - Get director by ID

- **POST ```/api/directors```**
  - Create a new director
  - Required fields: firstName, lastName, birthDate

- **PUT ```/api/directors/:id```**
  - Update director by ID

- **DELETE ```/api/directors/:id```**
  - Delete director by ID

- **GET ```/api/directors/search/date-range```**
  - Search directors by birth date range
  - Query params: startDate, endDate

- **GET ```/api/directors/search/name```**
  - Search director by name
  - Query params: firstName, lastName

### Movie Endpoints

- **GET ```/api/movies```**
  - Get all movies with pagination
  - Query params: page, limit, sortBy, sortOrder

- **GET ```/api/movies/:id```**
  - Get movie by ID

- **POST ```/api/movies```**
  - Create a new movie
  - Required fields: title, description, releaseDate, genre, imdbId, directorId

- **PUT ```/api/movies/:id```**
  - Update movie by ID

- **DELETE ```/api/movies/:id```**
  - Delete movie by ID

- **GET ```/api/movies/director/:directorId```**
  - Get movies by director ID

- **GET ```/api/movies/imdb/:imdbId```**
  - Get movie by IMDB ID

- **GET ```/api/movies/search/genre```**
  - Search movies by genre
  - Query params: genre

- **GET ```/api/movies/search/release-year```**
  - Search movies by release year range
  - Query params: startYear, endYear

- **GET ```/api/movies/search/rating```**
  - Search movies by rating range
  - Query params: minRating, maxRating

## Error Handling

The application implements a comprehensive error handling system:

### Error Types

- **ValidationError** (400): Invalid input data
- **NotFoundError** (404): Resource not found
- **ConflictError** (409): Resource conflict
- **DatabaseError** (500): Database operation errors

### Error Response Format

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-19T12:00:00.000Z",
  "path": "/api/movies",
  "details": {}
}
```

## Future Potential Development Areas

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - OAuth2 integration

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests
   - Test coverage reporting

3. **Performance Optimizations**
   - Query optimization
   - Index optimization (Unique, Compound)
   - Cache strategy improvements
   - Connection pooling

4. **Additional Features**
   - Movie ratings and reviews
   - Validating movies with IMDB apis
   - User favorites
   - Watchlists
   - Advanced search with full-text search
   - Image upload for movie posters
   - Batch operations

5. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline
   - Monitoring and alerting
   - Performance metrics
   - Auto-scaling

6. **Documentation**
   - API versioning
   - Interactive API documentation
   - Code documentation improvements
   - Development guidelines
