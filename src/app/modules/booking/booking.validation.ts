import { z } from "zod";

const createBookingZodSchema = z.object({
    body: z.object({
        eventId: z.string(),
        quantity: z.number().int().positive(),
        paymentMethod: z.enum(["STRIPE", "SSL_COMMERZ", "CASH"])
    })
});


export const bookingValidation = {
    createBookingZodSchema
}