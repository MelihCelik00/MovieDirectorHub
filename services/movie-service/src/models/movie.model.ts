import { Schema, model, Document } from 'mongoose';
import { Movie } from '@movie-director-hub/shared';

/**
 * Interface for Movie document extending base Movie type and Document
 */
export interface MovieDocument extends Movie, Document {}

/**
 * Movie schema definition
 */
const movieSchema = new Schema<MovieDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    imdbId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    directorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Director',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
movieSchema.index({ title: 1 });
movieSchema.index({ imdbId: 1 }, { unique: true });
movieSchema.index({ directorId: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });

/**
 * Movie model
 */
export const MovieModel = model<MovieDocument>('Movie', movieSchema); 