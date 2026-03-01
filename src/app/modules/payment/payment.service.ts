import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { BookingStatus, PaymentStatus } from "../../../../prisma/generated/enums";
import { stripe } from "../../Helper/stripe";


const createStripeCheckoutSession = async (
  bookingId: string,
  userId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      event: true,
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new Error("Unauthorized booking access");
  }

  if (booking.payment?.status === PaymentStatus.PAID) {
    throw new Error("Booking already paid");
  }

  if (!booking.payment) {
    throw new Error("Payment record not found");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    success_url: "https://abusaiyedjoy.vercel.app",
    cancel_url: "https://abu-saiyed-joy.vercel.app",

    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: booking.event.title,
          },
          unit_amount: Math.round(Number(booking.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      bookingId: booking.id,
      paymentId: booking.payment.id,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};


const handleStripeWebhookEvent = async (
  req: any,
  res: any
) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = config.stripe.stripeWebhookSecret as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;
      const paymentId = session.metadata?.paymentId;

      if (!bookingId || !paymentId) {
        return res.status(200).json({
          message: "Metadata missing",
        });
      }

      await prisma.$transaction(async (tx) => {
       
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.PAID
          },
        });

        
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.CONFIRMED, 
          },
        });
      });

      console.log("✅ Payment successful & booking confirmed");
      break;
    }

    case "checkout.session.expired":
      console.log("⚠️ Checkout expired");
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment failed");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};

export const PaymentService = {
  createStripeCheckoutSession,
  handleStripeWebhookEvent,
};