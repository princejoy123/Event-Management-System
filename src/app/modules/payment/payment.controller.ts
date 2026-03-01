import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";


const createStripeCheckoutSession = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { bookingId } = req.body;

    const result = await PaymentService.createStripeCheckoutSession(
      bookingId,
      req.user!.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Stripe checkout session created",
      data: result,
    });
  }
);


const handleStripeWebhookEvent = async (
  req: Request,
  res: Response
) => {
  const result = await PaymentService.handleStripeWebhookEvent(req, res);
  return result;
};

export const PaymentController = {
  createStripeCheckoutSession,
  handleStripeWebhookEvent,
};