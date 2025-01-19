// Switch to admin database
db = db.getSiblingDB('admin');

// Create users for each service with appropriate permissions
db.createUser({
  user: 'movie-service-user',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'movie-service' }
  ]
});

db.createUser({
  user: 'director-service-user',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'director-service' }
  ]
});

// Initialize movie-service database
db = db.getSiblingDB('movie-service');
db.createCollection('movies');

// Create indexes for movies collection
db.movies.createIndex({ title: 1 });
db.movies.createIndex({ directorId: 1 });
db.movies.createIndex({ genre: 1 });
db.movies.createIndex({ releaseDate: 1 });

// Initialize director-service database
db = db.getSiblingDB('director-service');
db.createCollection('directors');

// Create indexes for directors collection
db.directors.createIndex({ firstName: 1 });
db.directors.createIndex({ lastName: 1 });
db.directors.createIndex({ birthDate: 1 }); 