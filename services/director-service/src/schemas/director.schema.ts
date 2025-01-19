import { z } from 'zod';

export const createDirectorSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(2, 'First name must be at least 2 characters long')
      .max(50, 'First name must not exceed 50 characters'),
    lastName: z.string()
      .min(2, 'Last name must be at least 2 characters long')
      .max(50, 'Last name must not exceed 50 characters'),
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
    bio: z.string()
      .min(10, 'Bio must be at least 10 characters long')
      .max(1000, 'Bio must not exceed 1000 characters')
      .optional(),
  }),
});

export const updateDirectorSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid director ID'),
  }),
  body: z.object({
    firstName: z.string()
      .min(2, 'First name must be at least 2 characters long')
      .max(50, 'First name must not exceed 50 characters')
      .optional(),
    lastName: z.string()
      .min(2, 'Last name must be at least 2 characters long')
      .max(50, 'Last name must not exceed 50 characters')
      .optional(),
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
      .optional(),
    bio: z.string()
      .min(10, 'Bio must be at least 10 characters long')
      .max(1000, 'Bio must not exceed 1000 characters')
      .optional(),
  }),
}); 