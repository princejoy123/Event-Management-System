import express, { Request, Response, NextFunction } from "express";
import { EventController } from "./event.controller";
import { eventValidation } from "./event.validation";
import { UserRole } from "../../../../prisma/generated/enums";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";


const router = express.Router();

router.post(
  "/create-event",
  auth(UserRole.HOST),
  validateRequest(eventValidation.createEventZodValidationSchema),
  EventController.createEvent
);

router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getSingleEvent);

router.patch(
  "/:id",
  auth(UserRole.HOST, UserRole.ADMIN),
  validateRequest(eventValidation.updateEventZodValidationSchema),
  EventController.updateEvent
);

router.delete("/:id", auth(UserRole.ADMIN), EventController.deleteEvent);

export const eventRoutes = router;