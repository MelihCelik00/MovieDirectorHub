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
- [API Data Formats and Validation](#api-data-formats-and-validation)

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

## Architectural Decision: Monolithic vs Microservices

This project implements a modular monolithic architecture instead of microservices. Here's the reasoning behind this decision:

### Why Modular Monolith?

1. **Project Scale**
   - The current scope (movies and directors) doesn't justify the operational complexity of microservices
   - Domain boundaries are clear but closely related
   - Data consistency is crucial between movies and directors

2. **Development Efficiency**
   - Faster development and deployment cycles (important for efficient and agile teams)
   - Simpler debugging and testing
   - Easier to maintain code consistency
   - Lower initial development overhead

3. **Operational Simplicity**
   - Single deployment unit
   - Simpler monitoring and logging
   - Less infrastructure complexity
   - Lower operational costs in a production environment case

4. **Team Size**
   - Suitable for small to medium-sized teams
   - No need for multiple specialized teams
   - Easier knowledge sharing and onboarding

### Future Scalability Considerations

The current modular design allows for future migration to microservices if needed:

1. **Module Independence**
   - Clear boundaries between modules
   - Separate business logic and data access layers
   - Independent scaling possible through containerization

2. **Migration Path**
   - Modules can be extracted into microservices gradually
   - Event-driven patterns can be introduced incrementally
   - Service discovery and API gateway can be added when needed

### Trade-offs Analysis

#### Advantages of Current Approach

1. **Simplicity**
   - Single codebase
   - Unified deployment
   - Direct method calls instead of network calls
   - Simpler testing and debugging

2. **Performance**
   - No network overhead between modules
   - Shared resources (cache, database connections)
   - Lower latency for cross-module operations

3. **Consistency**
   - Strong consistency for related data
   - Simpler transaction management
   - Unified schema updates

4. **Resource Efficiency**
   - Lower infrastructure costs
   - Fewer moving parts
   - Simplified monitoring

#### What We Give Up

1. **Independent Scaling**
   - Cannot scale modules independently
   - Resource allocation is shared

2. **Technology Diversity**
   - Locked into single technology stack
   - Cannot optimize different modules with different technologies

3. **Isolation**
   - Bugs can potentially affect the entire system
   - Deployments require full system updates

### When to Consider Microservices

The project is designed to evolve into microservices when:

1. **Scale Indicators**
   - High load on specific modules
   - Need for independent scaling
   - Different resource requirements per module

2. **Team Growth**
   - Multiple teams working on different modules
   - Need for independent deployment cycles
   - Specialized technology requirements

3. **Business Requirements**
   - Different availability requirements per module
   - Need for different security levels
   - Geographic distribution requirements

This architectural decision prioritizes development speed, simplicity, and maintainability while keeping the door open for future evolution as the project grows.

## API Data Formats and Validation

### Movies

#### Date Formats
The API accepts multiple date formats for the `releaseDate` field:
- YYYY-MM-DD (e.g., "2017-12-01")
- ISO 8601 (e.g., "2017-12-01T00:00:00.000Z")
- Date objects

#### Rating
- Accepts both number and string formats (e.g., 7.4 or "7.4")
- Must be between 0 and 10
- Optional field

#### IMDB ID
- Must start with "tt" followed by 7-8 digits (e.g., "tt4925292")
- If "tt" prefix is missing, it will be automatically added
- Must be unique across all movies

#### Other Fields
- `title`: Required, 1-200 characters
- `description`: Required, 1-2000 characters
- `genre`: Required, 1-50 characters
- `directorId`: Required, must be a valid MongoDB ObjectId

### Directors

#### Date Formats
The API accepts multiple date formats for the `birthDate` field:
- YYYY-MM-DD (e.g., "1970-07-30")
- ISO 8601 (e.g., "1970-07-30T00:00:00.000Z")

#### Required Fields
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters
- `birthDate`: Valid date in accepted formats

#### Optional Fields
- `bio`: String, up to 2000 characters

### Search Endpoints

#### Movies
- Search by genre: `/api/movies/search/genre?genre=Drama`
- Search by rating range: `/api/movies/search/rating?min=7.0&max=10.0`
- Search by release date range: `/api/movies/search/release-date?from=2000-01-01&to=2020-01-01`
- Search by IMDB ID: `/api/movies/imdb/:imdbId`
- Search by director: `/api/movies/director/:directorId`

#### Directors
- Search by name: `/api/directors/search?firstName=Christopher&lastName=Nolan`
- Search by birth date range: `/api/directors/search/date-range?from=1960-01-01&to=1980-01-01`

### Dependencies
The application uses:
- Zod for runtime type checking and validation
- MongoDB for data persistence
- Express for the REST API

### Validation and Error Handling

The API implements robust validation using Zod schema validation:

#### Input Validation
- All inputs are validated before processing
- Automatic type coercion where appropriate (e.g., string to number for ratings)
- Format validation for special fields (IMDB ID, dates, ObjectIds)
- Cross-reference validation (e.g., checking if director exists)

#### Error Responses
The API provides detailed error messages in a consistent format:
```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed: [field]: [specific error message]",
  "timestamp": "2025-01-19T14:31:08.204Z",
  "path": "/api/endpoint"
}
```

#### Validation Features
- Automatic data transformation (e.g., adding "tt" prefix to IMDB IDs)
- Multiple format support for dates
- Flexible input formats (e.g., numbers as strings)
- Detailed error messages for each validation failure
- Required vs optional field validation
- Range and format validation for specific fields

#### Error Types
- `ValidationError`: Input validation failures
- `NotFoundError`: Resource not found
- `DatabaseError`: Database operation failures
- Each error type includes specific details about the failure
