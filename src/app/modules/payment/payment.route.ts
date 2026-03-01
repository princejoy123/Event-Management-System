import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../prisma/generated/enums";

const router = express.Router();

router.post(
  "/create-checkout-session",
  auth(UserRole.USER),
  PaymentController.createCheckoutSession
);


export const paymentRoutes = router;