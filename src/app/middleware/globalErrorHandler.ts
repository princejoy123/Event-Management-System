import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("From Global Error Handler", err)

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err
    })

};

export default globalErrorHandler;