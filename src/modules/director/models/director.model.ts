import { Schema, model, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const directorSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .transform((str) => {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }),
  bio: z.string().min(1).max(1000).optional(),
});

// Interface extending Document
export interface IDirector extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const directorMongooseSchema = new Schema<IDirector>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
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
directorMongooseSchema.index({ firstName: 1, lastName: 1 });
directorMongooseSchema.index({ birthDate: 1 });

// Export the model
export const DirectorModel = model<IDirector>('Director', directorMongooseSchema); 