import { Schema, model, Document, Types } from 'mongoose';
import { z } from 'zod';

export const movieSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  releaseDate: z.union([
    z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .transform((str) => new Date(str)),
    z.string()
      .datetime()
      .transform((str) => new Date(str)),
    z.date()
  ]),
  genre: z.string().min(1).max(50),
  rating: z.union([
    z.number().min(0).max(10),
    z.string().transform((val) => parseFloat(val))
  ]).optional(),
  imdbId: z.string()
    .regex(/^tt\d{7,8}$/, 'IMDB ID must start with "tt" followed by 7-8 digits')
    .transform((val) => val.startsWith('tt') ? val : `tt${val}`),
  directorId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
    .transform((str) => new Types.ObjectId(str)),
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

movieMongooseSchema.index({ title: 1 });
movieMongooseSchema.index({ releaseDate: 1 });
movieMongooseSchema.index({ genre: 1 });
movieMongooseSchema.index({ directorId: 1 });
movieMongooseSchema.index({ imdbId: 1 }, { unique: true });

export const MovieModel = model<IMovie>('Movie', movieMongooseSchema); 