import z from "zod";

const createEventZodValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  date: z.string(),
  price: z.number(),
  capacity: z.number().int().positive(),
  createdById: z.string()
});

const updateEventZodValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  price: z.number().optional(),
  capacity: z.number().int().positive().optional()
});

export const eventValidation = {
  createEventZodValidationSchema,
  updateEventZodValidationSchema
};