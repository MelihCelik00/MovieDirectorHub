import mongoose from 'mongoose';
import { config } from './index';

/**
 * MongoDB connection options
 */
const mongooseOptions: mongoose.ConnectOptions = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Connects to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri, mongooseOptions);
    console.info('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected.');
  });
}

/**
 * Closes MongoDB connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.info('MongoDB connection closed.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
} 