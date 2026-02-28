import express from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { eventRoutes } from "../modules/event/event.route";
import { bookingRoutes } from "../modules/booking/booking.route";

const router = express.Router()

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/event",
        route: eventRoutes
    },
    {
        path: "/booking",
        route: bookingRoutes
    }
]

moduleRoutes.forEach(route =>{router.use(route.path, route.route)})

export default router;