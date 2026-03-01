import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status-codes"


const login = catchAsync(async (req: Request, res: Response) =>{
    const result = await AuthService.login(req.body)
    const {accessToken, refreshToken} = result

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 100 * 60 * 60
    })

    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 30
    })

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Login Successfully",
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    })
});

const logout = catchAsync(async (req: Request, res: Response) => {

  res.clearCookie("accessToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none"
  });

  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none"
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null
  });
});


export const AuthController = {
    login,
    logout
}