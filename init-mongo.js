// Create movie-director-hub database
db = db.getSiblingDB('movie-director-hub');

// Create collections
db.createCollection('directors');
db.createCollection('movies');

// Create indexes
db.directors.createIndex({ firstName: 1, lastName: 1 });
db.directors.createIndex({ birthDate: 1 });

db.movies.createIndex({ title: 1 });
db.movies.createIndex({ releaseDate: 1 });
db.movies.createIndex({ genre: 1 });
db.movies.createIndex({ directorId: 1 });
db.movies.createIndex({ imdbId: 1 }, { unique: true });

// Optional: Add some sample data
db.directors.insertMany([
  {
    firstName: "Christopher",
    lastName: "Nolan",
    birthDate: new Date("1970-07-30"),
    bio: "British-American film director known for mind-bending narratives",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: "Martin",
    lastName: "Scorsese",
    birthDate: new Date("1942-11-17"),
    bio: "American film director, producer, and screenwriter",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get the inserted directors' IDs
const nolanId = db.directors.findOne({ firstName: "Christopher", lastName: "Nolan" })._id;
const scorseseId = db.directors.findOne({ firstName: "Martin", lastName: "Scorsese" })._id;

// Insert sample movies
db.movies.insertMany([
  {
    title: "Inception",
    description: "A thief who enters the dreams of others to steal secrets from their subconscious.",
    releaseDate: new Date("2010-07-16"),
    genre: "Sci-Fi",
    rating: 8.8,
    imdbId: "tt1375666",
    directorId: nolanId,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Departed",
    description: "An undercover cop and a mole in the police attempt to identify each other.",
    releaseDate: new Date("2006-10-06"),
    genre: "Crime",
    rating: 8.5,
    imdbId: "tt0407887",
    directorId: scorseseId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]); 