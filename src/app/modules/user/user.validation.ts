import z from "zod";


const createUserZodValidationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
});

const createHostZodValidationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

const createAdminZodValidationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  contactNumber: z.string()
});

export const userValidationSchema = {
    createUserZodValidationSchema,
    createHostZodValidationSchema,
    createAdminZodValidationSchema
}