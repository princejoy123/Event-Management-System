import { Request } from "express";
import { prisma } from "../../shared/prisma";


const createEvent = async(req: Request) =>{

    const result = await prisma.event.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            location: req.body.loacation,
            date: new Date(req.body.date),
            price: req.body.price,
            capacity: req.body.capacity,
            createdById: req.body.createdById
        },
        include: {
            createdBy: true
        }
    });
     
    return result
};



const getAllEvents = async ( req: Request) =>{

};

const getSingleEvent = async (req: Request) =>{

};

const updateEvents = async (req: Request) =>{

};

const deleteEvents = async (req: Request) =>{

};




export const EventService = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvents,
    deleteEvents
}