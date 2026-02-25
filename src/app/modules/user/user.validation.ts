import z from "zod";
import { UserRole, UserStatus } from "../../../../prisma/generated/enums";


const createUserZodValidationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum([UserRole.ADMIN, UserRole.HOST, UserRole.USER]).optional()
});

const updateUserZodValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.HOST, UserRole.USER]).optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DEACTIVE]).optional()
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
    updateUserZodValidationSchema,
    createHostZodValidationSchema,
    createAdminZodValidationSchema
}