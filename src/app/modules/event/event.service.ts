import { Request } from "express";
import { prisma } from "../../shared/prisma";


const createEvent = async (req: Request) => {
  const result = await prisma.event.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: new Date(req.body.date),
      price: req.body.price,
      capacity: req.body.capacity,
      createdById: req.body.createdById
    }
  });

  return result;
};



const getAllEvents = async (req: Request) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await prisma.event.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      createdBy: true
    }
  });

  const total = await prisma.event.count();

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};



const getSingleEvent = async ( id: string) => {
    const result = await prisma.event.findUnique({
        where: {id},
        include: {
            createdBy: true
        }
    })

    return result
}



const updateEvent = async (id: string, payload: any) => {

  if (payload.date) {
    payload.date = new Date(payload.date);
  }

  const result = await prisma.event.update({
    where: { id },
    data: payload
  });

  return result;
};



const deleteEvent = async (id: string) => {
  const result = await prisma.event.delete({
    where: { id }
  });

  return result;
};


export const EventService = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
};