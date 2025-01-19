import { Schema, model, Document, Types } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const movieSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  releaseDate: z.date(),
  genre: z.string().min(1).max(50),
  rating: z.number().min(0).max(10).optional(),
  imdbId: z.string().min(1).max(50),
  directorId: z.instanceof(Types.ObjectId),
});

// Interface extending Document
export interface IMovie extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  genre: string;
  rating?: number;
  imdbId: string;
  directorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const movieMongooseSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    imdbId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    directorId: {
      type: Schema.Types.ObjectId,
      ref: 'Director',
      required: true,
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
movieMongooseSchema.index({ title: 1 });
movieMongooseSchema.index({ releaseDate: 1 });
movieMongooseSchema.index({ genre: 1 });
movieMongooseSchema.index({ directorId: 1 });
movieMongooseSchema.index({ imdbId: 1 }, { unique: true });

// Export the model
export const MovieModel = model<IMovie>('Movie', movieMongooseSchema); 