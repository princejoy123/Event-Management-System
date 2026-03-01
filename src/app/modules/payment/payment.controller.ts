import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { PaymentMethod } from "../../../../prisma/generated/enums";


const createCheckoutSession = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { bookingId } = req.body;

    const result = await PaymentService.createCheckoutSession(
      bookingId,
      req.user!.id
    );


    const message =
      result.paymentMethod === PaymentMethod.CASH
        ? "Cash payment confirmed successfully"
        : "Stripe checkout session created";

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message,
      data: result,
    });
  }
);


const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  return await PaymentService.handleStripeWebhookEvent(req, res);
};

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};