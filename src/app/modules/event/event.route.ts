import express, { Request, Response, NextFunction } from "express";
import { EventController } from "./event.controller";
import { eventValidationSchema } from "./event.validation";

const router = express.Router();

router.post(
  "/create-event",
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      eventValidationSchema.createEventValidationSchema.parse(req.body);

    return EventController.createEvent(req, res, next);
  }
);

router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getSingleEvent);

router.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      eventValidationSchema.updateEventValidationSchema.parse(req.body);

    return EventController.updateEvent(req, res, next);
  }
);

router.delete("/:id", EventController.deleteEvent);

export const eventRoutes = router;