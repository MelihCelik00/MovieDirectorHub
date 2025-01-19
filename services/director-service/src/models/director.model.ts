import { Schema, model, Document } from 'mongoose';
import { Director } from '@movie-director-hub/shared';

export interface DirectorDocument extends Omit<Director, '_id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const directorSchema = new Schema<DirectorDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret): Record<string, unknown> => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes
directorSchema.index({ firstName: 1 });
directorSchema.index({ lastName: 1 });
directorSchema.index({ birthDate: 1 });

export const DirectorModel = model<DirectorDocument>('Director', directorSchema); 