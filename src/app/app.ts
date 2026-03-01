import express, { Application, Request, Response } from "express"
import cors from "cors"
import router from "./routes"
import notFound from "./middleware/notFound"
import globalErrorHandler from "./middleware/globalErrorHandler"
import { PaymentController } from "./modules/payment/payment.controller"


const app: Application = express()

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleStripeWebhookEvent
);

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Event Management Server"
    })
});


app.use(notFound)
app.use(globalErrorHandler)

export default app;

