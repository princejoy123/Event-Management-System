import express, { Request, Response, NextFunction } from "express";
import { EventController } from "./event.controller";
import { eventValidation } from "./event.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../prisma/generated/enums";

const router = express.Router();

router.post(
  "/create-event",
  auth(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      eventValidation.createEventZodValidationSchema.parse(req.body);

    return EventController.createEvent(req, res, next);
  }
);

router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getSingleEvent);

router.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      eventValidation.updateEventZodValidationSchema.parse(req.body);

    return EventController.updateEvent(req, res, next);
  }
);

router.delete("/:id", EventController.deleteEvent);

export const eventRoutes = router;