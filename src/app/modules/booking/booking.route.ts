import express from "express";
import { BookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../prisma/generated/enums";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/book-event",
  auth(UserRole.USER),
  validateRequest(bookingValidation.createBookingZodSchema),
  BookingController.createBooking
);

router.get(
  "/",
  auth(UserRole.ADMIN),
  BookingController.getAllBooking
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  BookingController.getSingleBooking
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  BookingController.deleteBooking
);

export const bookingRoutes = router;