import express, { Application, Request, Response } from "express"
import cors from "cors"
import router from "./routes"
import notFound from "./middleware/notFound"
import globalErrorHandler from "./middleware/globalErrorHandler"


const app: Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Event Management Server"
    })
});


app.use(notFound)
app.use(globalErrorHandler)

export default app;

