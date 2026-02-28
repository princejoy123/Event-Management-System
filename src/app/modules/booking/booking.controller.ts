import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BookingService } from "./booking.service";


const createBooking = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const payload = {
      ...req.body,
      userId: req.user!.id,
    };

    const result = await BookingService.createBooking(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking successful, tickets generated!",
      data: result,
    });
  }
);


const getAllBooking = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAllBookings();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings retrieved successfully!",
      data: result,
    });
  }
);


const getSingleBooking = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getSingleBooking(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking retrieved successfully!",
      data: result,
    });
  }
);


const deleteBooking = catchAsync(
  async (req: Request, res: Response) => {
    await BookingService.deleteBooking(req.params.id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking deleted successfully!",
      data: null,
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  deleteBooking,
};