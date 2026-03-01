import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { EventService } from "./event.service";
import httpStatus from "http-status-codes";


const createEvent = catchAsync(async (req: Request & { user?: any }, res: Response) => {

  const result = await EventService.createEvent({
    ...req.body,
    createdById: req.user!.id
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created successfully!",
    data: result
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getAllEvents(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events retrieved successfully!",
    data: result
  });
});


const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getSingleEvent(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event retrieved successfully!",
    data: result
  });
});


const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully!",
    data: result
  });
});


const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully!",
    data: null
  });
});


export const EventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
};