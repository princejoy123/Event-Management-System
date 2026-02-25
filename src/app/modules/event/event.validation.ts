import z from "zod";


const createEventValidationSchema = z.object({
    title: z.string(),
    description: z.string(),
    loacation: z.string(),
    date: z.string(),
    price: z.number(),
    capacity: z.number().int().positive(),
    createdById: z.string()
});
const updateEventValidationSchema = z.object({
    title: z.string(),
    description: z.string(),
    loacation: z.string(),
    date: z.string(),
    price: z.number(),
    capacity: z.number().int().positive(),
});



export const eventValidationSchema = {
    createEventValidationSchema,
    updateEventValidationSchema
};