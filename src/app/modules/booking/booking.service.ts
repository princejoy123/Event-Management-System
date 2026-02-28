import { PaymentStatus, TicketType } from "../../../../prisma/generated/enums";
import ApiError from "../../errors/ApiErrors";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status-codes";

interface BookingPayload {
  userId: string;
  eventId: string;
  quantity: number;
  paymentMethod: "STRIPE" | "SSL_COMMERZ" | "CASH";
}


const createBooking = async (payload: BookingPayload) => {
  const result = await prisma.$transaction(async (tnx) => {
    const event = await tnx.event.findUnique({
      where: { id: payload.eventId },
    });

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    if (payload.quantity > event.capacity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Not enough capacity for this event"
      );
    }

    // Create booking
    const booking = await tnx.booking.create({
      data: {
        userId: payload.userId,
        eventId: payload.eventId,
        totalAmount: Number(event.price) * payload.quantity,
      },
    });

    // Create tickets based on quantity
    for (let i = 0; i < payload.quantity; i++) {
      const ticket = await tnx.ticket.create({
        data: {
          eventId: event.id,
          name: `${event.title} Ticket`,
          type: TicketType.PAID,
          price: event.price,
          totalQuantity: 1,
          soldQuantity: 1,
        },
      });

      await tnx.bookingItem.create({
        data: {
          bookingId: booking.id,
          ticketId: ticket.id,
          quantity: 1,
          price: ticket.price,
        },
      });
    }

    // Create payment
    const payment = await tnx.payment.create({
      data: {
        bookingId: booking.id,
        amount: Number(event.price) * payload.quantity,
        method: payload.paymentMethod,
        status: PaymentStatus.UNPAID,
      },
    });

    // Reduce event capacity
    await tnx.event.update({
      where: { id: event.id },
      data: { capacity: event.capacity - payload.quantity },
    });

    return {
      booking,
      payment,
    };
  });

  return result;
};


const getAllBookings = async () => {
  const result = await prisma.booking.findMany({
    include: {
      user: true,
      event: true,
      payment: true,
      bookingItems: {
        include: {
          ticket: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.booking.count();

  return {
    meta: { total },
    data: result,
  };
};


const getSingleBooking = async (id: string) => {
  const result = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      event: true,
      payment: true,
      bookingItems: {
        include: {
          ticket: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  return result;
};


const updateBooking = async (id: string, payload: any) => {
  const result = await prisma.booking.update({
    where: { id },
    data: payload,
  });

  return result;
};


const deleteBooking = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  await prisma.booking.delete({
    where: { id },
  });

  return null;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};